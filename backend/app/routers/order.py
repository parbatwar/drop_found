# app/routes/order.py
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.catalog.listing import Listing
from app.models.enums.enums import OrderStatus
from app.models.order.order import Order, OrderGroup, OrderItem
from app.models.order.order import OrderGroup
from app.schemas.order import (
    OrderGroupResponse,
    OrderResponse,
    OrderUpdate,
    CheckoutRequest,
    QuickBuyRequest,
)
from app.services.order_service import OrderService
from app.models.user.user import User
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/orders", tags=["orders"])


# ─── Buyer Endpoints ───
@router.get("/me", response_model=list[OrderResponse])
def view_orders(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    """Get all orders for the current buyer"""
    return OrderService.view_order(current_user, db)


@router.get("/me/{order_id}", response_model=OrderResponse)
def get_buyer_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get a specific order for the current buyer"""
    return OrderService.get_order_by_id(order_id, current_user, db)


# ─── Seller Endpoints ───
@router.get("/seller", response_model=list[OrderResponse])
def view_seller_orders(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
    status: OrderStatus | None = None,  # ✅ Optional filter by status
):
    """Get all orders for the current seller (optionally filtered by status)"""
    return OrderService.view_seller_orders(current_user, db, status)


@router.put("/{order_id}/status")
def update_order_status(
    order_id: str,
    data: OrderUpdate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """Update order status (seller or admin)"""
    return OrderService.update_order_status(
        order_id=order_id, current_user=current_user, new_status=data.status, db=db
    )


# ─── Order Group Endpoints ───
@router.get("/group/{order_group_id}", response_model=OrderGroupResponse)
def get_order_group(
    order_group_id: str,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get an order group with all its orders"""
    return OrderService.get_order_group(order_group_id, current_user, db)


@router.get("/groups/me", response_model=list[OrderGroupResponse])
def view_my_order_groups(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get all order groups for the current buyer with orders and sellers loaded"""
    order_groups = (
        db.query(OrderGroup)
        .options(
            joinedload(OrderGroup.orders).joinedload(Order.seller),
            joinedload(OrderGroup.orders)
            .joinedload(Order.items)
            .joinedload(OrderItem.listing)
            .joinedload(Listing.images),
            joinedload(OrderGroup.orders).joinedload(Order.buyer),
            joinedload(OrderGroup.orders).joinedload(Order.review),
        )
        .filter(OrderGroup.buyer_id == current_user.id)
        .order_by(OrderGroup.created_at.desc())
        .all()
    )

    return order_groups


# ─── Checkout Endpoints ───
@router.post("/checkout", response_model=OrderGroupResponse)
def checkout(
    data: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """Checkout entire cart with tiered delivery fee per seller"""
    return OrderService.checkout_cart(data, current_user, db)


@router.post("/quick-buy", response_model=OrderGroupResponse)
def quick_buy(
    data: QuickBuyRequest,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """Quick buy a single item (bypasses cart)"""
    return OrderService.quick_buy(data, current_user, db)


# ─── Admin Endpoints ───
@router.get("/admin/all", response_model=list[OrderResponse])
def view_all_orders_for_admin(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
    status: OrderStatus | None = None,  # ✅ Optional filter
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """
    Admin only: View all orders with pagination and optional status filter.

    - `status`: Filter by order status (pending, accepted, etc.)
    - `limit`: Number of orders per page (max 100)
    - `offset`: Pagination offset
    """
    return OrderService.view_all_orders_for_admin(
        current_user, db, status, limit, offset
    )


@router.get("/admin/{order_id}", response_model=OrderResponse)
def admin_get_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """Admin only: Get any order by ID"""
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return OrderService.get_order_by_id(order_id, current_user, db)


@router.put("/admin/{order_id}/complete")
def admin_complete_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """
    Admin only: Manually complete a delivered order.
    This marks the order as completed immediately without waiting 7 days.
    """
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return OrderService.update_order_status(
        order_id=order_id,
        current_user=current_user,
        new_status=OrderStatus.completed,
        db=db,
    )


@router.put("/admin/{order_id}/status")
def admin_update_order_status(
    order_id: str,
    data: OrderUpdate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """
    Admin only: Update any order status (bypass normal restrictions).
    Use with caution - this can override seller and buyer actions.
    """
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return OrderService.admin_update_order_status(
        order_id=order_id, new_status=data.status, db=db
    )


@router.get("/admin/stats", response_model=dict)
def admin_order_stats(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    """
    Admin only: Get order statistics.
    Returns counts by status for dashboard overview.
    """
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return OrderService.get_order_stats(db)
