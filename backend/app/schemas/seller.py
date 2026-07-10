from pydantic import BaseModel
import uuid
from datetime import datetime
from app.models.enums import SellerType, VerificationStatus


class SellerApply(BaseModel):
    seller_type: SellerType
    shop_name: str
    bio: str | None = None
    location: str | None = None
    # id_document_url: str


class SellerUpdate(BaseModel):
    shop_name: str | None = None
    bio: str | None = None
    location: str | None = None
    avatar_url: str | None = None


class ReviewSellerRequest(BaseModel):
    status: VerificationStatus


class SellerResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    shop_name: str
    slug: str
    bio: str | None = None
    location: str | None = None
    avatar_url: str | None = None
    # id_document_url: str | None = None

    is_following: bool = False
    verification_status: VerificationStatus
    verified_at: datetime | None = None
    seller_type: SellerType
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
