from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from app.models.enums.enums import OrderStatus, PaymentMethod


# ── Cart checkout request (what buyer submits) ──
class CheckoutRequest(BaseModel):
    receiver_phone: str
    delivery_address: str
    payment_method: PaymentMethod


class OrderUpdate(BaseModel):
    status: OrderStatus


# ── Nested response pieces ──
class OrderListingImage(BaseModel):
    image_url: str

    class Config:
        from_attributes = True


class OrderItemListing(BaseModel):
    id: UUID
    title: str
    images: list[OrderListingImage] = Field(default_factory=list)

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    id: UUID
    listing_id: UUID
    quantity: int
    price_at_purchase: float
    listing: OrderItemListing

    class Config:
        from_attributes = True


class OrderBuyer(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str

    class Config:
        from_attributes = True


class OrderSeller(BaseModel):
    id: UUID
    shop_name: str
    slug: str
    avatar_url: str | None = None

    class Config:
        from_attributes = True


class ReviewMini(BaseModel):
    id: UUID
    rating: int

    class Config:
        from_attributes = True


# ── Main order response — one per seller ──
class OrderResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    seller_id: UUID
    order_group_id: UUID | None

    seller: OrderSeller
    buyer: OrderBuyer
    items: list[OrderItemResponse] = []
    review: ReviewMini | None = None

    status: OrderStatus
    subtotal: float
    delivery_fee: float
    total_amount: float

    receiver_phone: str
    delivery_address: str
    payment_method: PaymentMethod

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Order group response — the whole checkout, all sellers ──
class OrderGroupResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    total_amount: float
    orders: list[OrderResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class QuickBuyRequest(BaseModel):
    listing_id: UUID
    quantity: int = 1
    receiver_phone: str
    delivery_address: str
    payment_method: PaymentMethod
