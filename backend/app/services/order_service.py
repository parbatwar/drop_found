# app/services/order_service.py
from decimal import Decimal
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.enums.listing_enum import ListingStatus
from app.models.catalog.listing import Listing
from app.models.order.order import Order, OrderItem, OrderStatus, OrderGroup
from app.models.seller.seller import SellerProfile
from app.models.order.cart import Cart, CartItem
from app.models.user.user import User
from app.schemas.order import CheckoutRequest, QuickBuyRequest, OrderUpdate
from app.utils.order import get_tier_delivery_fee, get_delivery_fee
import uuid


class OrderService:

    @staticmethod
    def view_order(current_user: User, db: Session):
        """Get all orders for the current buyer"""
        return db.query(Order).filter(Order.buyer_id == current_user.id).all()

    @staticmethod
    def view_seller_orders(current_user: User, db: Session):
        """Get all orders for the current seller"""
        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not seller:
            raise HTTPException(status_code=403, detail="Not a seller")
        return db.query(Order).filter(Order.seller_id == seller.id).all()

    @staticmethod
    def view_all_orders_for_admin(current_user: User, db: Session):
        """Admin only: View all orders in the system"""
        if current_user.role.value != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return db.query(Order).order_by(Order.created_at.desc()).all()

    @staticmethod
    def update_order_status(
        order_id: str, current_user: User, new_status: OrderStatus, db: Session
    ):
        """Update order status with validation, role-based permissions, and stock management"""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        current_status = order.status

        # ✅ Define transitions
        transitions = {
            OrderStatus.pending: [
                OrderStatus.accepted,
                OrderStatus.rejected,
            ],
            OrderStatus.accepted: [
                OrderStatus.ready_for_pickup,
                OrderStatus.cancelled,
            ],
            OrderStatus.ready_for_pickup: [
                OrderStatus.picked_up,
            ],
            OrderStatus.picked_up: [
                OrderStatus.out_for_delivery,
            ],
            OrderStatus.out_for_delivery: [
                OrderStatus.delivered,
            ],
            OrderStatus.delivered: [
                OrderStatus.completed,  # ✅ Admin can manually complete
            ],
            # Final states
            OrderStatus.rejected: [],
            OrderStatus.cancelled: [],
            OrderStatus.completed: [],
        }

        # ✅ Define who can do what (simplified)
        seller_controlled = {
            OrderStatus.accepted,
            OrderStatus.rejected,
            OrderStatus.ready_for_pickup,
            OrderStatus.cancelled,
        }

        admin_controlled = {
            OrderStatus.picked_up,
            OrderStatus.out_for_delivery,
            OrderStatus.delivered,
            OrderStatus.completed,  # ✅ Admin can mark as completed
        }

        # ✅ Check permissions based on the target status
        if new_status in seller_controlled:
            # Only the seller can update these statuses
            seller = (
                db.query(SellerProfile)
                .filter(SellerProfile.user_id == current_user.id)
                .first()
            )
            if not seller or order.seller_id != seller.id:
                raise HTTPException(status_code=403, detail="Not your order")

            if new_status == OrderStatus.cancelled and current_status not in [
                OrderStatus.pending,
                OrderStatus.accepted,
            ]:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot cancel order at this stage. It's already being processed.",
                )

        elif new_status in admin_controlled:
            # ✅ Only admin can update delivery and completion statuses
            if current_user.role.value != "admin":
                raise HTTPException(
                    status_code=403, detail="Only admin can update delivery status"
                )

            # ✅ If completing, ensure order is delivered first
            if (
                new_status == OrderStatus.completed
                and current_status != OrderStatus.delivered
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Order must be delivered before marking as completed",
                )

        # ✅ Buyer cancellation check
        elif new_status == OrderStatus.cancelled:
            if current_user.id == order.buyer_id:
                if current_status not in [OrderStatus.pending, OrderStatus.accepted]:
                    raise HTTPException(
                        status_code=400,
                        detail="Cannot cancel order at this stage. It's already being processed.",
                    )
            else:
                raise HTTPException(
                    status_code=403, detail="Not authorized to cancel this order"
                )

        # ✅ Validate transition
        allowed = transitions.get(current_status, [])
        if new_status not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot transition from {current_status.value} to {new_status.value}",
            )

        # ✅ Restore stock on cancellation or rejection
        if new_status in (OrderStatus.cancelled, OrderStatus.rejected):
            for order_item in order.items:
                listing = order_item.listing
                listing.quantity += order_item.quantity
                if listing.quantity > 0:
                    listing.status = ListingStatus.active

        # ✅ Update status
        order.status = new_status
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def auto_complete_orders(db: Session):
        """
        Auto-complete orders that have been delivered for more than 7 days.
        This should be called by a scheduled task (e.g., daily cron job).
        """
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        # Find delivered orders older than 7 days
        orders_to_complete = (
            db.query(Order)
            .filter(
                Order.status == OrderStatus.delivered, Order.updated_at < seven_days_ago
            )
            .all()
        )

        completed_count = 0
        for order in orders_to_complete:
            order.status = OrderStatus.completed
            completed_count += 1

        db.commit()
        return completed_count

    @staticmethod
    def checkout_cart(data: CheckoutRequest, current_user: User, db: Session):
        """Checkout entire cart with tiered delivery fee per seller"""
        cart = db.query(Cart).filter(Cart.buyer_id == current_user.id).first()
        if not cart or not cart.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        # Group items by seller
        items_by_seller = {}
        for item in cart.items:
            listing = (
                db.query(Listing)
                .filter(Listing.id == item.listing_id)
                .with_for_update()
                .first()
            )
            if not listing or listing.status.value != "active":
                raise HTTPException(
                    status_code=400,
                    detail=f"'{listing.title if listing else item.listing_id}' is no longer available",
                )
            if listing.quantity < item.quantity:
                raise HTTPException(
                    status_code=400, detail=f"Not enough stock for '{listing.title}'"
                )
            items_by_seller.setdefault(listing.seller_id, []).append(
                (listing, item.quantity)
            )

        # Create order group
        order_group = OrderGroup(buyer_id=current_user.id, total_amount=0)
        db.add(order_group)
        db.flush()

        grand_total = Decimal("0")

        # Process each seller's items
        for seller_id, items in items_by_seller.items():
            # Calculate subtotal for this seller
            seller_subtotal = sum(listing.price * qty for listing, qty in items)

            # ✅ Calculate tiered delivery fee based on seller subtotal
            delivery_fee = get_tier_delivery_fee(db, seller_subtotal)

            # Create order for this seller
            order = Order(
                order_group_id=order_group.id,
                buyer_id=current_user.id,
                seller_id=seller_id,
                status=OrderStatus.pending,
                subtotal=seller_subtotal,
                delivery_fee=delivery_fee,
                total_amount=seller_subtotal + delivery_fee,
                receiver_phone=data.receiver_phone,
                payment_method=data.payment_method,
                delivery_address=data.delivery_address,
            )
            db.add(order)
            db.flush()

            # Add items to order and update stock
            for listing, qty in items:
                order_item = OrderItem(
                    order_id=order.id,
                    listing_id=listing.id,
                    quantity=qty,
                    price_at_purchase=listing.price,
                )
                db.add(order_item)

                # Decrement stock
                listing.quantity -= qty
                if listing.quantity == 0:
                    listing.status = ListingStatus.inactive

            grand_total += seller_subtotal + delivery_fee

        order_group.total_amount = grand_total

        # Clear cart
        for item in cart.items:
            db.delete(item)

        db.commit()
        db.refresh(order_group)
        return order_group

    @staticmethod
    def quick_buy(data: QuickBuyRequest, current_user: User, db: Session):
        """Quick buy a single item with tiered delivery fee"""
        listing = (
            db.query(Listing)
            .filter(Listing.id == data.listing_id)
            .with_for_update()
            .first()
        )

        if not listing or listing.status.value != "active":
            raise HTTPException(status_code=400, detail="Listing not available")
        if listing.quantity < data.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")

        # Calculate subtotal for this single item
        subtotal = listing.price * data.quantity

        # ✅ Calculate tiered delivery fee
        delivery_fee = get_tier_delivery_fee(db, subtotal)

        # Create order group
        order_group = OrderGroup(buyer_id=current_user.id, total_amount=0)
        db.add(order_group)
        db.flush()

        # Create order
        order = Order(
            order_group_id=order_group.id,
            buyer_id=current_user.id,
            seller_id=listing.seller_id,
            status=OrderStatus.pending,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total_amount=subtotal + delivery_fee,
            receiver_phone=data.receiver_phone,
            payment_method=data.payment_method,
            delivery_address=data.delivery_address,
        )
        db.add(order)
        db.flush()

        # Add item to order
        order_item = OrderItem(
            order_id=order.id,
            listing_id=listing.id,
            quantity=data.quantity,
            price_at_purchase=listing.price,
        )
        db.add(order_item)

        # Update stock
        listing.quantity -= data.quantity
        if listing.quantity == 0:
            listing.status = ListingStatus.inactive

        order_group.total_amount = order.total_amount

        db.commit()
        db.refresh(order_group)
        return order_group

    @staticmethod
    def get_order_by_id(order_id: uuid.UUID, current_user: User, db: Session):
        """Get a single order by ID with permission check"""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Check if user is buyer or seller or admin
        if current_user.id != order.buyer_id:
            seller = (
                db.query(SellerProfile)
                .filter(SellerProfile.user_id == current_user.id)
                .first()
            )
            if not seller or order.seller_id != seller.id:
                if current_user.role.value != "admin":
                    raise HTTPException(status_code=403, detail="Not your order")

        return order

    @staticmethod
    def get_order_group(order_group_id: uuid.UUID, current_user: User, db: Session):
        """Get an order group with all its orders"""
        order_group = (
            db.query(OrderGroup).filter(OrderGroup.id == order_group_id).first()
        )
        if not order_group:
            raise HTTPException(status_code=404, detail="Order group not found")

        # Check if user is buyer or admin
        if (
            current_user.id != order_group.buyer_id
            and current_user.role.value != "admin"
        ):
            raise HTTPException(status_code=403, detail="Not your order")

        return order_group

    @staticmethod
    def view_seller_orders(
        current_user: User, db: Session, status: OrderStatus | None = None
    ):
        """Get all orders for the current seller, optionally filtered by status"""
        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not seller:
            raise HTTPException(status_code=403, detail="Not a seller")

        query = db.query(Order).filter(Order.seller_id == seller.id)

        if status:
            query = query.filter(Order.status == status)

        return query.order_by(Order.created_at.desc()).all()

    @staticmethod
    def view_all_orders_for_admin(
        current_user: User,
        db: Session,
        status: OrderStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ):
        """Admin only: View all orders with pagination and optional status filter"""
        if current_user.role.value != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")

        query = db.query(Order)

        if status:
            query = query.filter(Order.status == status)

        return query.order_by(Order.created_at.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def admin_update_order_status(order_id: str, new_status: OrderStatus, db: Session):
        """
        Admin only: Force update any order status (bypass normal restrictions).
        Use with caution - this can override seller and buyer actions.
        """
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # ✅ Restore stock if cancelling or rejecting
        if new_status in (OrderStatus.cancelled, OrderStatus.rejected):
            for order_item in order.items:
                listing = order_item.listing
                listing.quantity += order_item.quantity
                if listing.quantity > 0:
                    listing.status = ListingStatus.active

        order.status = new_status
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def get_order_stats(db: Session):
        """Get order statistics for admin dashboard"""
        stats = {}
        for status in OrderStatus:
            count = db.query(Order).filter(Order.status == status).count()
            stats[status.value] = count

        # Add total
        stats["total"] = db.query(Order).count()

        return stats
