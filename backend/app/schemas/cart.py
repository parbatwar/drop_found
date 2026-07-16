from pydantic import BaseModel
from uuid import UUID


class CartItemAdd(BaseModel):
    listing_id: UUID
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: UUID
    listing_id: UUID
    quantity: int

    # Display info
    title: str
    price: float
    line_total: float
    image_url: str | None
    seller_id: UUID
    shop_name: str

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: UUID
    items: list[CartItemResponse]

    subtotal: float
    delivery_fee: float
    total: float
    seller_order_count: int

    class Config:
        from_attributes = True
