from pydantic import BaseModel
import uuid
from datetime import datetime
from app.models.enums import VerificationStatus


class SellerApply(BaseModel):
    shop_name: str
    slug: str
    bio: str | None = None
    location: str | None = None
    id_document_url: str


class SellerUpdate(BaseModel):
    shop_name: str | None = None
    bio: str | None = None
    location: str | None = None
    avatar_url: str | None = None


class SellerResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    shop_name: str
    bio: str
    location: str
    avatar_url: str
    id_document_url: str
    verified_at: datetime | None
    created_at: datetime
    updated_at: datetime
    verification_status: VerificationStatus

    class Config:
        from_attributes = True
