from pydantic import BaseModel
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


class OrderResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    seller_id: UUID
    listing_id: UUID
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
