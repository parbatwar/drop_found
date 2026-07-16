from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartResponse
from app.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/", response_model=CartResponse)
def get_cart(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return CartService.get_cart(current_user, db)


@router.post("/items")
def add_item(
    data: CartItemAdd,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CartService.add_item(data, current_user, db)


@router.patch("/items/{item_id}")
def update_item(
    item_id: str,
    data: CartItemUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CartService.update_item_quantity(item_id, data, current_user, db)


@router.delete("/items/{item_id}")
def remove_item(
    item_id: str, current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    return CartService.remove_item(item_id, current_user, db)


@router.delete("/")
def clear_cart(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return CartService.clear_cart(current_user, db)
