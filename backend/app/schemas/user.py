from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid
from app.models.user import UserRole


class UserCreate(BaseModel):
    """Model for creating a new user."""

    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: str | None = None


class UserUpdate(BaseModel):
    """Model for updating user information."""

    email: EmailStr | None = None
    password: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None


class UserLogin(BaseModel):
    """Model for user login."""

    email: str
    password: str


class UserResponse(BaseModel):
    """Response model for user data."""

    id: uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    role: UserRole
    is_active: bool
    is_email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
