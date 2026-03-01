import time
import json
import pydantic
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
import os
from dotenv import load_dotenv

from config import CONTRACT_ADDRESS, CONTRACT_ABI
import models, schemas
from database import SessionLocal, engine, get_db

load_dotenv()

# Web3 Setup (Gasless Relayer)
RPC_URL = os.getenv("RPC_URL", "https://rpc-amoy.polygon.technology/")
w3 = Web3(Web3.HTTPProvider(RPC_URL))
try:
    contract = w3.eth.contract(address=w3.to_checksum_address(CONTRACT_ADDRESS), abi=CONTRACT_ABI)
except Exception as e:
    contract = None

ADMIN_PRIVATE_KEY = os.getenv("ADMIN_PRIVATE_KEY", "0x0000000000000000000000000000000000000000000000000000000000000001")
try:
    account = w3.eth.account.from_key(ADMIN_PRIVATE_KEY)
    ADMIN_ADDRESS = account.address
except ValueError:
    ADMIN_ADDRESS = None

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blocky TraceHerb API", version="1.0.0")

@app.on_event("startup")
def startup_populate():
    db = SessionLocal()
    # Inject Mock Data for the E-Commerce Demo
    mock_log = db.query(models.VerificationLog).filter(models.VerificationLog.order_id == "ORD-98765-AYU").first()
    if not mock_log:
        # Create Mock Farmer
        mock_user = models.UserProfile(wallet_address="0xMockFarmer123", name="NatureHeal Farms", phone_number="+91 9999999999", role="farmer", is_verified=False)
        db.add(mock_user)
        db.commit()
        db.refresh(mock_user)
        
        # Create Mock Batch
        mock_batch = models.BatchMetadata(batch_id="BATCH-0x123-A01", gps_location="Lat: 18.5204, Lng: 73.8567", owner_id=mock_user.id)
        db.add(mock_batch)
        db.commit()
        
        # Link Log to Batch
        new_log = models.VerificationLog(
            order_id="ORD-98765-AYU",
            linked_batch_id="BATCH-0x123-A01",
            consumer_ip="192.168.1.1",
            scanned_at=datetime.utcnow().isoformat()
        )
        db.add(new_log)
        db.commit()
    db.close()

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Blocky TraceHerb Cloud API"}

# --- Auth / Login Bridge ---
@app.post("/auth/login", response_model=schemas.UserProfileResponse)
def login_or_register(user_data: schemas.UserProfileCreate, db: Session = Depends(get_db)):
    # Check if the user already exists (by wallet address)
    db_user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == user_data.wallet_address).first()
    
    if db_user:
        # Update role if needed
        db_user.role = user_data.role
        db.commit()
        db.refresh(db_user)
        return db_user
    else:
        # Create a new default profile for them based on wallet
        new_user = models.UserProfile(**user_data.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

@app.post("/auth/verify_request", response_model=schemas.VerificationRequestResponse)
def request_verification(request_data: schemas.VerificationRequestCreate, db: Session = Depends(get_db)):
    # Basic check if it already exists
    existing = db.query(models.VerificationRequest).filter(models.VerificationRequest.farmer_id == request_data.farmer_id).first()
    
    if existing:
        existing.document_url = request_data.document_url
        existing.status = "Pending"
        existing.admin_feedback = None
        db.commit()
        db.refresh(existing)
        return existing
        
    new_request = models.VerificationRequest(**request_data.model_dump())
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@app.get("/auth/verification_status/{farmer_id}")
def get_verification_status(farmer_id: str, db: Session = Depends(get_db)):
    req = db.query(models.VerificationRequest).filter(models.VerificationRequest.farmer_id == farmer_id).first()
    if not req:
        return {"status": "Unverified", "feedback": None}
    return {"status": req.status, "feedback": req.admin_feedback}

# --- Admin Verification Endpoints ---
@app.get("/admin/verification_requests")
def get_all_verification_requests(db: Session = Depends(get_db)):
    # In a real app, protect this with Admin JWT/Clerk role check
    requests = db.query(models.VerificationRequest).all()
    # Fetch user details to merge with requests
    result = []
    for req in requests:
        user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == req.farmer_id).first()
        result.append({
            "id": req.id,
            "farmer_id": req.farmer_id,
            "farmer_name": user.name if user else "Unknown User",
            "document_url": req.document_url,
            "status": req.status,
            "admin_feedback": req.admin_feedback
        })
    return result

@app.post("/admin/verification_requests/{request_id}/review")
def review_verification_request(request_id: int, status: str, feedback: str = None, db: Session = Depends(get_db)):
    req = db.query(models.VerificationRequest).filter(models.VerificationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if status not in ["Approved", "Declined"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    req.status = status
    req.admin_feedback = feedback
    db.commit()
    
    # Update user profile if approved
    if status == "Approved":
        user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == req.farmer_id).first()
        if user:
            user.is_verified = True
            db.commit()
            
    return {"message": f"Request {status}"}

# --- User Profiles ---
@app.post("/users/", response_model=schemas.UserProfileResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserProfileCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == user.wallet_address).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Wallet address already registered")
    
    new_user = models.UserProfile(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/{wallet_address}", response_model=schemas.UserProfileResponse)
def get_user(wallet_address: str, db: Session = Depends(get_db)):
    db_user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == wallet_address).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- Batch Metadata ---
@app.post("/batches/", response_model=schemas.BatchMetadataResponse, status_code=status.HTTP_201_CREATED)
def create_batch_metadata(metadata: schemas.BatchMetadataCreate, owner_wallet: str, db: Session = Depends(get_db)):
    # Verify owner exists
    db_user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == owner_wallet).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Owner wallet not found. Please register first.")
    
    # Check if batch exists
    db_batch = db.query(models.BatchMetadata).filter(models.BatchMetadata.batch_id == metadata.batch_id).first()
    if db_batch:
        raise HTTPException(status_code=400, detail="Metadata for this batch already exists")
    
    new_metadata = models.BatchMetadata(**metadata.model_dump(), owner_id=db_user.id)
    db.add(new_metadata)
    db.commit()
    db.refresh(new_metadata)
    return new_metadata

@app.post("/batches/mint", response_model=schemas.BatchMetadataResponse)
def mint_batch_gasless(metadata: schemas.BatchMetadataCreate, owner_wallet: str, db: Session = Depends(get_db)):
    """
    Phase 4: Gasless Relayer.
    This saves metadata to the local DB *and* signs a smart contract transaction 
    on behalf of the farmer using the backend's Admin wallet.
    """
    # 1. Verify owner exists
    db_user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == owner_wallet).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Owner wallet not found. Please register first.")
    
    # 2. Check if batch already exists in DB
    db_batch = db.query(models.BatchMetadata).filter(models.BatchMetadata.batch_id == metadata.batch_id).first()
    if db_batch:
        raise HTTPException(status_code=400, detail="Metadata for this batch already exists")

    # 3. Blockchain Relayer (Gasless Meta-Transaction)
    tx_hash_hex = None
    if contract and ADMIN_ADDRESS:
        try:
            # Parse lat/lng from string "Lat: 18.5204, Lng: 73.8567"
            lat_int = 0
            lng_int = 0
            if metadata.gps_location and "Lat: " in metadata.gps_location:
                try:
                    parts = metadata.gps_location.split(", ")
                    lat_str = parts[0].replace("Lat: ", "")
                    lng_str = parts[1].replace("Lng: ", "")
                    lat_int = int(float(lat_str) * 10**6)
                    lng_int = int(float(lng_str) * 10**6)
                except Exception:
                    pass

            # Extract actual data from frontend's detailed_notes (e.g., "Crop: Tulsi | Quantity: 150 kg")
            extracted_crop = "Unknown Crop"
            extracted_quantity = 100
            
            if metadata.detailed_notes:
                notes_lower = metadata.detailed_notes.lower()
                if "tulsi" in notes_lower: extracted_crop = "Tulsi"
                elif "brahmi" in notes_lower: extracted_crop = "Brahmi"
                elif "ashwagandha" in notes_lower: extracted_crop = "Ashwagandha"
                elif "neem" in notes_lower: extracted_crop = "Neem"
                elif "crop:" in notes_lower: 
                    # Try to extract substring after Crop:
                    parts = metadata.detailed_notes.split("|")
                    if len(parts) > 0:
                        extracted_crop = parts[0].replace("Crop/Herb:", "").replace("Crop:", "").strip()
                
                import re
                nums = re.findall(r'\d+', metadata.detailed_notes)
                if nums:
                    extracted_quantity = int(nums[0])

            # The Android App expects the getBatchDetails tuple in an inverted order from the parameter names:
            # App reads Index 2 as 'Herb Name', Index 3 as 'Herb Type', Index 4 as 'Farmer Name'.
            # The deployed ABI names these parameters: _farmerName, _herbName, _herbType.
            # We must pass them in the order the App expects to see them!
            tx = contract.functions.registerBatch(
                metadata.batch_id,
                extracted_crop,                   # Sent as _farmerName, displayed as 'Herb Name' on Android
                "Organic Herb",                   # Sent as _herbName, displayed as 'Herb Type' on Android
                db_user.name or "Unknown Farmer", # Sent as _herbType, displayed as 'Farmer' on Android
                lat_int,
                lng_int,
                extracted_quantity,               # Sent as _quantity
                "Grade A",                        # Sent as _qualityGrade
                "Registered via Next.js"          # Sent as _additionalNotes
            ).build_transaction({
                'from': ADMIN_ADDRESS,
                'nonce': w3.eth.get_transaction_count(ADMIN_ADDRESS),
                # Provide dummy gas pricing for generic testnets if needed
                'gas': 3000000,
                'gasPrice': w3.eth.gas_price
            })
            
            # Sign and send
            signed_tx = w3.eth.account.sign_transaction(tx, private_key=ADMIN_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            tx_hash_hex = tx_hash.hex()
            print(f"✅ Gasless Tx successful: {tx_hash_hex}")
        except Exception as e:
            print(f"⚠️ Blockchain Relayer error: {str(e)}")
            # For hackathon demo purposes, we still allow DB save even if the testnet RPC fails
            pass

    # 4. Save to Database
    new_metadata = models.BatchMetadata(**metadata.model_dump(), owner_id=db_user.id)
    db.add(new_metadata)
    db.commit()
    db.refresh(new_metadata)
    
    return new_metadata
# --- NLP & AI Extractor (Phase 3 Mock) ---
@app.post("/nlp/extract", response_model=schemas.NLPExtractionResponse)
def extract_entities(nlp_input: schemas.NLPInput):
    # This is a Mock for the Google Gemini API.
    # In production, we'd send nlp_input.text to Google Generative AI
    # Prompt: "Extract Crop Name, Quantity, and Location from: {text}"
    
    text = nlp_input.text.lower()
    
    # Simple Mock Logic for Demonstration
    crop = "Unknown Crop"
    quantity = "Unknown"
    location = "Unknown"
    
    # Mock Crops
    if "ashwagandha" in text: crop = "Ashwagandha"
    elif "turmeric" in text: crop = "Turmeric"
    elif "brahmi" in text: crop = "Brahmi"
    elif "neem" in text: crop = "Neem"
        
    # Mock Quantities
    if "100" in text: quantity = "100 kg"
    elif "500" in text: quantity = "500 kg"
    elif "50" in text: quantity = "50 kg"
        
    # Mock Locations
    if "pune" in text: location = "Pune, Maharashtra"
    elif "mumbai" in text: location = "Mumbai, Maharashtra"
    elif "kerala" in text: location = "Kerala"
    elif "gujarat" in text: location = "Gujarat"

    # For the judges demo, if someone just says "test", return a perfect dummy payload
    if text == "test" or text == "demo":
        return {"crop_name": "Organic Turmeric", "quantity": "500 kg", "location": "Pune, Maharashtra"}
    
    return {
        "crop_name": crop,
        "quantity": quantity,
        "location": location
    }

# --- Phase 4: Razorpay Micro-payments ---
import razorpay
import os

# Initialize Razorpay Client (Use Test Keys from env or mock)
RZP_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_mockkey123456")
RZP_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "mocksecret1234567890abc")
razorpay_client = razorpay.Client(auth=(RZP_KEY_ID, RZP_KEY_SECRET))

@app.post("/payments/order")
def create_payment_order(order_req: schemas.PaymentOrderRequest):
    """
    Called by the Consumer /trace UI when they click 'Pay ₹25'
    """
    try:
        # Create a Razorpay Order
        data = {
            "amount": order_req.amount, # Amount in paise (e.g. 2500 = ₹25)
            "currency": "INR",
            "receipt": f"receipt_{order_req.batch_id}",
            "notes": {
                "batch_id": order_req.batch_id
            }
        }
        # In a real scenario with valid keys, this calls the Razorpay API
        # order = razorpay_client.order.create(data=data)
        
        # For the demo, if keys are mock, we mock the order response too
        if RZP_KEY_ID == "rzp_test_mockkey123456":
             order = {"id": "order_mock_12345", "amount": 2500, "currency": "INR"}
        else:
             order = razorpay_client.order.create(data=data)
             
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/payments/verify")
def verify_payment(verify_req: schemas.PaymentVerificationRequest):
    """
    Called after successful Razorpay checkout to unlock the report
    """
    try:
        if RZP_KEY_ID == "rzp_test_mockkey123456":
            # Mock success for demo
            return {"status": "success", "message": "Payment verified successfully", "batch_id": verify_req.batch_id}
            
        # Verify the signature
        params_dict = {
            'razorpay_order_id': verify_req.razorpay_order_id,
            'razorpay_payment_id': verify_req.razorpay_payment_id,
            'razorpay_signature': verify_req.razorpay_signature
        }
        res = razorpay_client.utility.verify_payment_signature(params_dict)
        if res:
             return {"status": "success", "message": "Payment verified successfully", "batch_id": verify_req.batch_id}
        else: # Added this else block to maintain logical flow, as the provided snippet removed it.
             raise HTTPException(status_code=400, detail="Invalid payment signature")
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Razorpay Signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PurchaseRecord(pydantic.BaseModel):
    consumer_id: str
    batch_id: str
    payment_id: str

@app.post("/payments/record_purchase")
def record_purchase(record: PurchaseRecord, db: Session = Depends(get_db)):
    # Prevent duplicate records for the same consumer and batch
    existing = db.query(models.ConsumerPurchase).filter(
        models.ConsumerPurchase.consumer_id == record.consumer_id,
        models.ConsumerPurchase.batch_id == record.batch_id
    ).first()
    
    if existing:
        return {"status": "already_recorded"}
        
    new_purchase = models.ConsumerPurchase(
        consumer_id=record.consumer_id,
        batch_id=record.batch_id,
        payment_id=record.payment_id
    )
    db.add(new_purchase)
    db.commit()
    return {"status": "success"}

@app.get("/payments/has_purchased/{consumer_id}/{batch_id}")
def check_has_purchased(consumer_id: str, batch_id: str, db: Session = Depends(get_db)):
    existing = db.query(models.ConsumerPurchase).filter(
        models.ConsumerPurchase.consumer_id == consumer_id,
        models.ConsumerPurchase.batch_id == batch_id
    ).first()
    return {"purchased": bool(existing)}

@app.get("/batches/{batch_id}", response_model=schemas.BatchMetadataResponse)
def get_batch_metadata(batch_id: str, db: Session = Depends(get_db)):
    db_batch = db.query(models.BatchMetadata).filter(models.BatchMetadata.batch_id == batch_id).first()
    if not db_batch:
        raise HTTPException(status_code=404, detail="Batch metadata not found")

    processing_history = []
    herb_name = None
    quantity = None
    timestamp = None

    # If contract is connected, fetch extra details
    if contract:
        try:
            # ABI: batchId, farmer, farmerName(cropName), herbName, herbType(farmer-name), lat, lng, timestamp, quantity, qualityGrade, isVerified, additionalNotes
            raw_details = contract.functions.getBatchDetails(batch_id).call()
            if raw_details:
                herb_name = raw_details[2] # cropName
                timestamp = raw_details[7] # collectionTimestamp
                quantity = raw_details[8]  # quantity
        except Exception as e:
            print(f"Error fetching batch details: {e}")

        try:
            raw_history = contract.functions.getProcessingHistory(batch_id).call()
            # raw_history is a list of tuples: (processor_address, processorName, stepDescription, timestamp, location)
            for step in raw_history:
                processing_history.append({
                    "processor_address": step[0],
                    "processor_name": step[1],
                    "step_description": step[2],
                    "timestamp": step[3],
                    "location": step[4]
                })
        except Exception as e:
            print(f"Error fetching processing history: {e}")

    # Convert SQLAlchemy model to dict so we can inject processing_history and details
    batch_dict = {column.name: getattr(db_batch, column.name) for column in db_batch.__table__.columns}
    batch_dict["processing_history"] = processing_history
    batch_dict["herb_name"] = herb_name
    batch_dict["quantity"] = quantity
    batch_dict["timestamp"] = timestamp

    # Manually serialize relationship so frontend gets Farmer Name and Email
    if db_batch.owner:
        batch_dict["owner"] = {
            "id": db_batch.owner.id,
            "wallet_address": db_batch.owner.wallet_address,
            "name": db_batch.owner.name,
            "phone_number": db_batch.owner.phone_number,
            "role": db_batch.owner.role,
            "is_verified": db_batch.owner.is_verified
        }
    
    return batch_dict

@app.post("/batches/process")
def add_processing_step(step_data: schemas.ProcessingStepCreate, processor_wallet: str, db: Session = Depends(get_db)):
    """
    Phase 7: Processors adding steps to an existing batch via Gasless Relayer.
    """
    # 1. Verify processor exists and is verified
    db_user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == processor_wallet).first()
    if not db_user or db_user.role != 'processor':
        raise HTTPException(status_code=403, detail="Processor not found or unauthorized.")
        
    # 2. Add step to Blockchain using Gasless Admin
    tx_hash_hex = None
    if contract and ADMIN_ADDRESS:
        try:
            tx = contract.functions.addProcessingStep(
                step_data.batch_id,
                step_data.processor_name,
                step_data.step_description,
                step_data.location
            ).build_transaction({
                'from': ADMIN_ADDRESS,
                'nonce': w3.eth.get_transaction_count(ADMIN_ADDRESS, 'pending'),
                'gas': 3000000,
                'gasPrice': w3.eth.gas_price
            })
            signed_tx = w3.eth.account.sign_transaction(tx, private_key=ADMIN_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            tx_hash_hex = tx_hash.hex()
        except Exception as e:
            print("Blockchain processing step failed:", e)
            raise HTTPException(status_code=500, detail=f"Blockchain relayer failed: {str(e)}")
            
    return {"status": "success", "tx_hash": tx_hash_hex, "message": "Processing step added successfully"}
# --- E-commerce Verification ---
@app.post("/verify/", response_model=schemas.VerificationLogResponse)
def log_verification(verification: schemas.VerificationLogCreate, db: Session = Depends(get_db)):
    new_log = models.VerificationLog(
        **verification.model_dump(),
        scanned_at=datetime.utcnow().isoformat()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@app.get("/verify/{order_id}")
def get_verification_status(order_id: str, db: Session = Depends(get_db)):
    db_log = db.query(models.VerificationLog).filter(models.VerificationLog.order_id == order_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="No blockchain batch linked to this order yet.")
    
    # Check the trusted status of the farmer who owns this batch
    db_batch = db.query(models.BatchMetadata).filter(models.BatchMetadata.batch_id == db_log.linked_batch_id).first()
    farmer_status = False
    if db_batch and db_batch.owner:
        farmer_status = db_batch.owner.is_verified
        
    return {
        "status": "success", 
        "linked_batch_id": db_log.linked_batch_id, 
        "verified_on": db_log.scanned_at,
        "is_farmer_verified": farmer_status
    }

# --- Admin Routes ---
@app.put("/admin/users/{wallet_address}/verify")
def toggle_user_verification(wallet_address: str, verified: bool, db: Session = Depends(get_db)):
    db_user = db.query(models.UserProfile).filter(models.UserProfile.wallet_address == wallet_address).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_verified = verified
    db.commit()
    return {"status": "success", "wallet_address": wallet_address, "is_verified": db_user.is_verified}

# --- Consumer History ---
@app.get("/users/{consumer_id}/purchases")
def get_consumer_purchases(consumer_id: str, db: Session = Depends(get_db)):
    purchases = db.query(models.ConsumerPurchase).filter(models.ConsumerPurchase.consumer_id == consumer_id).all()
    results = []
    
    # Reverse to show newest first
    for p in reversed(purchases):
        batch = db.query(models.BatchMetadata).filter(models.BatchMetadata.batch_id == p.batch_id).first()
        if batch:
            # We don't have a strict 'crop_name' column yet, so we extract from detailed_notes or generic
            crop_name = "Organic Product"
            if batch.detailed_notes and "Crop:" in batch.detailed_notes:
                try:
                    crop_name = batch.detailed_notes.split("Crop: ")[1].split("\n")[0]
                except:
                    pass
            
            results.append({
                "batch_id": batch.batch_id,
                "crop_name": crop_name,
                "image_url": batch.image_url,
                "gps_location": batch.gps_location
            })
    return results

@app.post("/users/scans/record")
def record_scan(scan: schemas.ScanHistoryCreate, db: Session = Depends(get_db)):
    new_scan = models.ScanHistory(
        consumer_id=scan.consumer_id,
        batch_id=scan.batch_id,
        scanned_at=datetime.utcnow().isoformat()
    )
    db.add(new_scan)
    db.commit()
    return {"status": "recorded"}

@app.get("/users/{consumer_id}/scans")
def get_consumer_scans(consumer_id: str, db: Session = Depends(get_db)):
    scans = db.query(models.ScanHistory).filter(models.ScanHistory.consumer_id == consumer_id).all()
    results = []
    for s in reversed(scans):
        batch = db.query(models.BatchMetadata).filter(models.BatchMetadata.batch_id == s.batch_id).first()
        if batch:
            results.append({
                "batch_id": batch.batch_id,
                "scanned_at": s.scanned_at,
                "image_url": batch.image_url
            })
    return results
