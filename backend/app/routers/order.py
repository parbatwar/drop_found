from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.order import (
    OrderGroupResponse,
    OrderResponse,
    OrderUpdate,
    CheckoutRequest,
    QuickBuyRequest,
)
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/me", response_model=list[OrderResponse])
def view_orders(current_user=Depends(get_current_user), db=Depends(get_db)):
    return OrderService.view_order(current_user, db)


@router.get("/seller", response_model=list[OrderResponse])
def view_seller_orders(current_user=Depends(get_current_user), db=Depends(get_db)):
    return OrderService.view_seller_orders(current_user=current_user, db=db)


@router.put("/{order_id}/status")
def update_order_status(
    order_id: str,
    data: OrderUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return OrderService.update_order_status(
        order_id=order_id, current_user=current_user, new_status=data.status, db=db
    )


@router.post("/checkout", response_model=OrderGroupResponse)
def checkout(
    data: CheckoutRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return OrderService.checkout_cart(data, current_user, db)


@router.post("/quick-buy", response_model=OrderGroupResponse)
def quick_buy(
    data: QuickBuyRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return OrderService.quick_buy(data, current_user, db)
