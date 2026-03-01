from pydantic import BaseModel
from typing import Optional, List

class UserProfileBase(BaseModel):
    wallet_address: str
    name: str
    phone_number: str
    role: str = "farmer"

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    is_verified: bool

    class Config:
        from_attributes = True

class BatchMetadataBase(BaseModel):
    batch_id: str
    image_url: Optional[str] = None
    lab_report_url: Optional[str] = None
    detailed_notes: Optional[str] = None
    gps_location: Optional[str] = None

class NLPInput(BaseModel):
    text: str

class NLPExtractionResponse(BaseModel):
    crop_name: Optional[str] = None
    quantity: Optional[str] = None
    location: Optional[str] = None

class BatchMetadataCreate(BatchMetadataBase):
    pass

class BatchMetadataResponse(BatchMetadataBase):
    id: int
    owner_id: int
    owner: Optional[UserProfileResponse] = None
    processing_history: Optional[List[dict]] = None
    herb_name: Optional[str] = None
    quantity: Optional[int] = None
    timestamp: Optional[int] = None

    class Config:
        from_attributes = True

class VerificationLogBase(BaseModel):
    order_id: str
    linked_batch_id: str
    consumer_ip: Optional[str] = None
    scanned_at: Optional[str] = None

class VerificationLogCreate(VerificationLogBase):
    pass

class VerificationLogResponse(VerificationLogBase):
    id: int

    class Config:
        from_attributes = True

class PaymentOrderRequest(BaseModel):
    batch_id: str
    amount: int = 2500

class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    batch_id: str
    consumer_id: Optional[str] = None

class VerificationRequestBase(BaseModel):
    farmer_id: str
    document_url: str

class VerificationRequestCreate(VerificationRequestBase):
    pass

class VerificationRequestResponse(VerificationRequestBase):
    id: int
    status: str
    admin_feedback: Optional[str] = None

    class Config:
        from_attributes = True

class ScanHistoryBase(BaseModel):
    consumer_id: str
    batch_id: str
    scanned_at: Optional[str] = None

class ScanHistoryCreate(ScanHistoryBase):
    pass

class ScanHistoryResponse(ScanHistoryBase):
    id: int

    class Config:
        from_attributes = True

class ProcessingStepCreate(BaseModel):
    batch_id: str
    processor_name: str
    step_description: str
    location: str
