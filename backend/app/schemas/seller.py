from pydantic import BaseModel
import uuid
from datetime import datetime
from app.models.enums.enums import SellerType, VerificationStatus


class SellerApply(BaseModel):
    seller_type: SellerType
    shop_name: str
    avatar_url: str | None = None
    location: str | None = None
    bio: str | None = None


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

    seller_type: SellerType
    followers_count: int = 0
    average_rating: float = 0.0  # Overall seller rating
    total_reviews: int = 0  # Total reviews for this seller

    is_following: bool = False
    verification_status: VerificationStatus
    verified_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
