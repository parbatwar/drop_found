from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class ReviewCreate(BaseModel):
    seller_id: UUID
    order_id: UUID
    rating: int = Field(..., ge=1, le=5)  # must be between 1 and 5
    comment: str | None = None


class ReviewUpdate(BaseModel):
    rating: int | None = Field(None, ge=1, le=5)
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    seller_id: UUID
    order_id: UUID
    rating: int
    comment: str | None
    is_visible: bool
    created_at: datetime

    class Config:
        from_attributes = True
