from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class WishlistCreate(BaseModel):
    listing_id: UUID


class WishlistResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    listing_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
