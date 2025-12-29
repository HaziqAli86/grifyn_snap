from typing import Optional, List
from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr
from datetime import datetime

class User(Document):
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    saved_registry_ids: List[str] = []
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr

class UserUpdatePassword(BaseModel):
    current_password: str
    new_password: str