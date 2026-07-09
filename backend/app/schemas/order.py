from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from app.models.enums import OrderStatus, PaymentMethod


class OrderCreate(BaseModel):
    listing_id: UUID
    receiver_phone: str
    delivery_address: str
    payment_method: PaymentMethod
    delivery_fee: float = 100.00


class OrderUpdate(BaseModel):
    status: OrderStatus


class OrderListingImage(BaseModel):
    image_url: str

    class Config:
        from_attributes = True


class OrderListing(BaseModel):
    id: UUID
    title: str
    price: float
    images: list[OrderListingImage] = Field(default_factory=list)

    class Config:
        from_attributes = True


class OrderBuyer(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str

    class Config:
        from_attributes = True


class ReviewMini(BaseModel):
    id: UUID
    rating: int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    seller_id: UUID
    listing_id: UUID

    buyer: OrderBuyer
    listing: OrderListing

    review: ReviewMini | None = None

    status: OrderStatus
    total_amount: float
    receiver_phone: str
    delivery_address: str
    delivery_fee: float
    payment_method: PaymentMethod
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
