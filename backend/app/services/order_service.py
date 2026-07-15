from decimal import Decimal

from fastapi import HTTPException
from app.models.enums.listing_enum import ListingStatus
from app.models.catalog.listing import Listing
from app.models.order.order import Order, OrderStatus
from app.models.seller.seller import SellerProfile


class OrderService:
    @staticmethod
    def create_order(data, current_user, db):

        listing = db.query(Listing).filter(Listing.id == data.listing_id).first()

        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        if listing.status != ListingStatus.active:
            raise HTTPException(status_code=400, detail="Listing is not available")

        if listing.quantity < 1:
            raise HTTPException(status_code=400, detail="Item out of stock")

        order = Order(
            buyer_id=current_user.id,
            seller_id=listing.seller_id,
            listing_id=data.listing_id,
            status=OrderStatus.pending,
            total_amount=listing.price + Decimal(str(data.delivery_fee)),
            payment_method=data.payment_method,
            receiver_phone=data.receiver_phone,
            delivery_fee=data.delivery_fee,
            delivery_address=data.delivery_address,
        )

        db.add(order)
        db.commit()
        db.refresh(order)

        return order

    @staticmethod
    def view_order(current_user, db):
        return db.query(Order).filter(Order.buyer_id == current_user.id).all()

    @staticmethod
    def view_seller_orders(current_user, db):
        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )

        if not seller:
            raise HTTPException(status_code=403, detail="Not a seller")

        return db.query(Order).filter(Order.seller_id == seller.id).all()

    @staticmethod
    def update_order_status(order_id: str, current_user, new_status: OrderStatus, db):
        order = db.query(Order).filter(Order.id == order_id).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.seller_id != current_user.seller_profile.id:
            raise HTTPException(status_code=403, detail="Not your order")

        current_status = order.status

        # Allowed status transitions
        if current_status == OrderStatus.pending:
            allowed = [
                OrderStatus.accepted,
                OrderStatus.rejected,
                OrderStatus.cancelled,
            ]

        elif current_status == OrderStatus.accepted:
            allowed = [
                OrderStatus.shipped,
                OrderStatus.delivered,
                OrderStatus.cancelled,
            ]

        elif current_status == OrderStatus.shipped:
            allowed = [
                OrderStatus.delivered,
            ]

        else:
            raise HTTPException(
                status_code=400,
                detail="Order can no longer be updated",
            )

        if new_status not in allowed:
            raise HTTPException(
                status_code=400,
                detail="Invalid status transition",
            )

        listing = order.listing

        # Accept order → reserve stock
        if new_status == OrderStatus.accepted:

            if listing.quantity <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Item is already out of stock",
                )

            listing.quantity -= 1

            if listing.quantity == 0:
                listing.status = ListingStatus.sold

        # Cancel after acceptance → restore stock
        if (
            current_status == OrderStatus.accepted
            and new_status == OrderStatus.cancelled
        ):
            listing.quantity += 1
            listing.status = ListingStatus.active

        order.status = new_status

        db.commit()
        db.refresh(order)

        return order
