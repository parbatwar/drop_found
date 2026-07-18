from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None


class ReviewUpdate(BaseModel):
    rating: int | None = Field(None, ge=1, le=5)
    comment: str | None = None


class ReviewBuyer(BaseModel):
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


class ReviewResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    seller_id: UUID
    order_id: UUID

    buyer: ReviewBuyer

    rating: int
    comment: str | None

    is_visible: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewsResponse(BaseModel):
    """Response for listing reviews with pagination"""

    reviews: list[ReviewResponse]
    average_rating: float
    total_reviews: int
    page: int
    limit: int
    total_pages: int
