from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.order import OrderCreate
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/")
def create_order(
    data: OrderCreate, current_user=Depends(get_current_user), db=Depends(get_db)
):
    return OrderService.create_order(data=data, current_user=current_user, db=db)


@router.get("/me")
def view_orders(current_user=Depends(get_current_user), db=Depends(get_db)):
    return OrderService.view_order(current_user=current_user, db=db)


@router.get("/seller")
def view_seller_orders(current_user=Depends(get_current_user), db=Depends(get_db)):
    return OrderService.view_seller_orders(current_user=current_user, db=db)


@router.put("/{order_id}/status")
def update_order_status(
    order_id: str,
    new_status: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return OrderService.update_order_status(
        order_id=order_id, current_user=current_user, new_status=new_status, db=db
    )
