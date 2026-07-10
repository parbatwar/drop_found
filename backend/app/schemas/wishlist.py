from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class WishlistListingImage(BaseModel):
    image_url: str

    class Config:
        from_attributes = True


class WishlistListing(BaseModel):
    id: UUID
    title: str
    price: float
    images: list[WishlistListingImage] = []

    class Config:
        from_attributes = True


class WishlistCreate(BaseModel):
    listing_id: UUID


class WishlistResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    listing: WishlistListing
    created_at: datetime

    class Config:
        from_attributes = True
