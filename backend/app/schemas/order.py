from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from app.models.enums import OrderStatus, DeliveryMethod


class OrderCreate(BaseModel):
    listing_id: UUID
    delivery_method: DeliveryMethod
    delivery_address: str
    delivery_fee: float = 0.00


class OrderUpdate(BaseModel):
    status: OrderStatus


class OrderResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    seller_id: UUID
    listing_id: UUID
    status: OrderStatus
    total_amount: float
    delivery_method: DeliveryMethod
    delivery_fee: float
    delivery_address: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
