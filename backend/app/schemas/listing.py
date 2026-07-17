from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List

from app.models.enums.enums import SellerType
from app.models.enums.listing_enum import (
    Gender,
    ListingColor,
    ListingCondition,
    ListingStatus,
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
    quantity: int = 1

    category_id: UUID

    gender: Gender
    size: ListingSize
    condition: ListingCondition | None = None
    color: ListingColor | None = None

    is_on_sale: bool = False

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
    quantity: int | None = None

    category_id: UUID | None = None

    gender: Gender | None = None
    size: ListingSize | None = None
    condition: ListingCondition | None = None
    color: ListingColor | None = None

    is_on_sale: bool | None = None

    status: ListingStatus | None = None
    images: list[ListingImageCreate] | None = None


class ListingResponse(BaseModel):
    id: UUID
    seller_id: UUID

    title: str
    description: str | None

    price: float
    quantity: int

    category_id: UUID
    category_name: str

    shop_name: str
    seller_type: SellerType

    gender: Gender
    size: ListingSize
    condition: ListingCondition | None
    color: ListingColor | None
    status: ListingStatus

    is_on_sale: bool
    is_wishlisted: bool = False

    images: List[ListingImageResponse] = []

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
