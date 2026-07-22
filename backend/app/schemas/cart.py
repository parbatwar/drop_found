# app/schemas/cart.py
from pydantic import BaseModel
from uuid import UUID


class CartItemAdd(BaseModel):
    listing_id: UUID
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: str  # ✅ Changed to str
    listing_id: str  # ✅ Changed to str
    quantity: int
    title: str
    price: float
    line_total: float
    image_url: str | None
    seller_id: str  # ✅ Changed to str
    shop_name: str

    class Config:
        from_attributes = True


# ✅ Add this class if it doesn't exist
class SellerDeliveryBreakdown(BaseModel):
    seller_id: str
    shop_name: str
    subtotal: float
    delivery_fee: float


class CartResponse(BaseModel):
    id: str  # ✅ Changed to str
    items: list[CartItemResponse]
    subtotal: float
    delivery_fee: float
    total: float
    seller_order_count: int
    seller_breakdown: list[SellerDeliveryBreakdown] = []  # ✅ Make sure this exists

    class Config:
        from_attributes = True
