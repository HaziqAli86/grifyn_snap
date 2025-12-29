from typing import List, Optional
from datetime import datetime
from enum import Enum
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field, ConfigDict

class GiftType(str, Enum):
    FUND = "fund"
    COLLEGE_529 = "529"
    PHYSICAL = "physical"

class PledgeStatus(str, Enum):
    PENDING = "pending"
    FULFILLED = "fulfilled"
    RECEIVED = "received"

class Child(Document):
    user_id: Indexed(str) # Reference to User ID
    name: str
    photo_url: Optional[str] = None
    birthday_or_age: str
    interests: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_modified_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "children"
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "65ca...",
                "name": "Leo",
                # ...
            }
        }

class Gift(Document):
    child_id: Indexed(str) # Reference to Child ID
    type: GiftType
    title: str
    description: str
    sort_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_modified_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Type-specific fields (Optional based on type)
    target_amount: Optional[float] = None # fund
    pledged_amount: Optional[float] = 0.0 # fund
    external_payment_url: Optional[str] = None # fund
    
    plan_name: Optional[str] = None # 529
    contribution_url: Optional[str] = None # 529
    
    product_url: Optional[str] = None # physical
    image_url: Optional[str] = None # physical
    merchant: Optional[str] = None # physical
    price: Optional[float] = None # physical
    quantity: Optional[int] = 1 # physical
    claimed_count: Optional[int] = 0 # physical

    class Settings:
        name = "gifts"

    class Config:
        populate_by_name = True

class Pledge(Document):
    child_id: Indexed(str) # Optimization for queries
    gift_id: Indexed(str)
    giver_name: str
    amount: Optional[float] = None # For fund
    note: Optional[str] = None
    status: PledgeStatus = PledgeStatus.PENDING
    thanked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "pledges"

    class Config:
        populate_by_name = True

# Pydantic Schemas for API Requests/Responses

class ChildResponse(BaseModel):
    id: PydanticObjectId
    user_id: str = Field(serialization_alias="userId")
    name: str
    photo_url: Optional[str] = None
    birthday_or_age: str
    interests: List[str] = []
    created_at: datetime = Field(serialization_alias="createdAt")
    last_modified_at: datetime = Field(serialization_alias="lastModifiedAt")

    class Config:
        populate_by_name = True
        from_attributes = True

class GiftResponse(BaseModel):
    id: PydanticObjectId
    child_id: str = Field(serialization_alias="childId")
    type: GiftType
    title: str
    description: str
    sort_order: int = Field(serialization_alias="sortOrder")
    created_at: datetime = Field(serialization_alias="createdAt")
    last_modified_at: datetime = Field(serialization_alias="lastModifiedAt")
    # Optional fields
    target_amount: Optional[float] = None
    pledged_amount: Optional[float] = 0.0
    external_payment_url: Optional[str] = None
    plan_name: Optional[str] = None
    contribution_url: Optional[str] = None
    product_url: Optional[str] = None
    image_url: Optional[str] = None
    merchant: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = 1
    claimed_count: Optional[int] = 0

    class Config:
        populate_by_name = True
        from_attributes = True

class PledgeResponse(BaseModel):
    id: PydanticObjectId
    child_id: str = Field(serialization_alias="childId")
    gift_id: str = Field(serialization_alias="giftId")
    giver_name: str
    amount: Optional[float] = None
    note: Optional[str] = None
    status: PledgeStatus
    thanked: bool
    created_at: datetime = Field(serialization_alias="createdAt")

    class Config:
        populate_by_name = True
        from_attributes = True

class ChildCreate(BaseModel):
    name: str
    photo_url: Optional[str] = None
    birthday_or_age: str
    interests: List[str] = []

class ChildUpdate(BaseModel):
    name: Optional[str] = None
    photo_url: Optional[str] = None
    birthday_or_age: Optional[str] = None
    interests: Optional[List[str]] = None

class GiftCreate(BaseModel):
    type: GiftType
    title: str
    description: str
    target_amount: Optional[float] = None
    external_payment_url: Optional[str] = None
    plan_name: Optional[str] = None
    contribution_url: Optional[str] = None
    product_url: Optional[str] = None
    image_url: Optional[str] = None
    merchant: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = 1

class GiftUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    # ... allow updating other fields as needed
    target_amount: Optional[float] = None
    external_payment_url: Optional[str] = None
    plan_name: Optional[str] = None
    contribution_url: Optional[str] = None
    product_url: Optional[str] = None
    image_url: Optional[str] = None
    merchant: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class PledgeCreate(BaseModel):
    giver_name: str
    amount: Optional[float] = None
    note: Optional[str] = None