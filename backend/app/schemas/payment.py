from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from app.models.enums import PaymentMethod, PaymentStatus


class PaymentCreate(BaseModel):
    order_id: UUID
    method: PaymentMethod
    transaction_ref: str | None = None
    amount: float


class PaymentResponse(BaseModel):
    id: UUID
    order_id: UUID
    method: PaymentMethod
    transaction_ref: str | None
    amount: float
    status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True
