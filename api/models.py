from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class UserProfile(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, index=True)
    role = Column(String, default="farmer") # farmer, processor, admin, consumer
    is_verified = Column(Boolean, default=False)

    batches_metadata = relationship("BatchMetadata", back_populates="owner")

class BatchMetadata(Base):
    __tablename__ = "batch_metadata"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String, unique=True, index=True) # On-chain ID
    image_url = Column(String, nullable=True)
    lab_report_url = Column(String, nullable=True)
    detailed_notes = Column(String, nullable=True)
    gps_location = Column(String, nullable=True) # E.g., "Lat: 18.5204, Lng: 73.8567"
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("UserProfile", back_populates="batches_metadata")

class VerificationLog(Base):
    __tablename__ = "verification_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True) # From E-commerce
    linked_batch_id = Column(String, index=True)
    consumer_ip = Column(String, nullable=True)
    scanned_at = Column(String, nullable=True)

class VerificationRequest(Base):
    __tablename__ = "verification_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(String, index=True) # Clerk user.id
    document_url = Column(String, nullable=False)
    status = Column(String, default="Pending") # Pending, Approved, Declined
    admin_feedback = Column(String, nullable=True)

class ConsumerPurchase(Base):
    __tablename__ = "consumer_purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    consumer_id = Column(String, index=True) # Clerk user.id
    batch_id = Column(String, index=True)
    payment_id = Column(String, nullable=True)
    unlocked_at = Column(String, nullable=True)

class ScanHistory(Base):
    __tablename__ = "scan_history"
    
    id = Column(Integer, primary_key=True, index=True)
    consumer_id = Column(String, index=True)
    batch_id = Column(String, index=True)
    scanned_at = Column(String, nullable=True)
