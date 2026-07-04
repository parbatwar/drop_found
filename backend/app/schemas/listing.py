from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List
from app.models.enums import (
    ListingCondition,
    ListingStatus,
    ListingSection,
    ListingCategory,
    ListingSize,
)


class ListingImageCreate(BaseModel):
    image_url: str
    display_order: int

    class Config:
        from_attributes = True


class ListingCreate(BaseModel):
    title: str
    description: str | None = None
    price: float
    condition: ListingCondition | None = None
    section: ListingSection
    category: ListingCategory
    size: ListingSize | None = None
    images: List[ListingImageCreate] = []


class ListingImageResponse(BaseModel):
    id: UUID
    image_url: str
    display_order: int

    class Config:
        from_attributes = True


class ListingUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None
    condition: ListingCondition | None = None
    status: ListingStatus | None = None
    category: ListingCategory | None = None
    size: ListingSize | None = None
    images: list[ListingImageCreate] | None = None


class ListingResponse(BaseModel):
    id: UUID
    seller_id: UUID
    title: str
    description: str | None
    price: float
    condition: ListingCondition | None
    status: ListingStatus
    section: ListingSection
    category: ListingCategory
    size: ListingSize | None
    is_boosted: bool
    images: List[ListingImageResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
