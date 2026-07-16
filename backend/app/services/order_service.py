from decimal import Decimal

from fastapi import HTTPException
from app.models.enums.listing_enum import ListingStatus
from app.models.catalog.listing import Listing
from app.models.order.order import Order, OrderItem, OrderStatus, OrderGroup
from app.models.seller.seller import SellerProfile
from app.models.order.cart import Cart, CartItem
from app.utils.order import get_delivery_fee


class OrderService:

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
            allowed = [OrderStatus.delivered]
        else:
            raise HTTPException(
                status_code=400, detail="Order can no longer be updated"
            )

        if new_status not in allowed:
            raise HTTPException(status_code=400, detail="Invalid status transition")

        # cancel after acceptance → restore stock for ALL items in this order
        if (
            current_status == OrderStatus.accepted
            and new_status == OrderStatus.cancelled
        ):
            for order_item in order.items:
                listing = order_item.listing
                listing.quantity += order_item.quantity
                listing.status = ListingStatus.active

        order.status = new_status
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def checkout_cart(data, current_user, db):
        """data = { receiver_phone, delivery_address, payment_method }"""
        cart = db.query(Cart).filter(Cart.buyer_id == current_user.id).first()
        if not cart or not cart.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        delivery_fee = get_delivery_fee(db)

        # group cart items by seller
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

        order_group = OrderGroup(buyer_id=current_user.id, total_amount=0)
        db.add(order_group)
        db.flush()

        grand_total = Decimal("0")

        for seller_id, items in items_by_seller.items():
            seller_subtotal = sum(listing.price * qty for listing, qty in items)
            seller_delivery_fee = delivery_fee

            order = Order(
                order_group_id=order_group.id,
                buyer_id=current_user.id,
                seller_id=seller_id,
                status=OrderStatus.pending,
                subtotal=seller_subtotal,
                delivery_fee=seller_delivery_fee,
                total_amount=seller_subtotal + seller_delivery_fee,
                receiver_phone=data.receiver_phone,
                payment_method=data.payment_method,
                delivery_address=data.delivery_address,
            )
            db.add(order)
            db.flush()

            for listing, qty in items:
                order_item = OrderItem(
                    order_id=order.id,
                    listing_id=listing.id,
                    quantity=qty,
                    price_at_purchase=listing.price,
                )
                db.add(order_item)

                # decrement stock, lock if sold out
                listing.quantity -= qty
                if listing.quantity == 0:
                    listing.status = ListingStatus.inactive

            grand_total += seller_subtotal + seller_delivery_fee

        order_group.total_amount = grand_total

        # clear the cart
        for item in cart.items:
            db.delete(item)

        db.commit()
        db.refresh(order_group)
        return order_group

    @staticmethod
    def quick_buy(data, current_user, db):
        """Buy Now — skips cart entirely, single item, immediate checkout."""
        listing = (
            db.query(Listing)
            .filter(Listing.id == data.listing_id)
            .with_for_update()
            .first()
        )

        if not listing or listing.status.value != "active":
            raise HTTPException(status_code=400, detail="Listing not available")
        if listing.quantity < 1:
            raise HTTPException(status_code=400, detail="Out of stock")
        if listing.quantity < data.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")

        delivery_fee = get_delivery_fee(db)

        order_group = OrderGroup(buyer_id=current_user.id, total_amount=0)
        db.add(order_group)
        db.flush()

        subtotal = listing.price * data.quantity
        total_amount = subtotal + delivery_fee

        order = Order(
            order_group_id=order_group.id,
            buyer_id=current_user.id,
            seller_id=listing.seller_id,
            status=OrderStatus.pending,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total_amount=total_amount,
            receiver_phone=data.receiver_phone,
            payment_method=data.payment_method,
            delivery_address=data.delivery_address,
        )
        db.add(order)
        db.flush()

        order_item = OrderItem(
            order_id=order.id,
            listing_id=listing.id,
            quantity=data.quantity,
            price_at_purchase=listing.price,
        )
        db.add(order_item)

        listing.quantity -= data.quantity
        if listing.quantity == 0:
            listing.status = ListingStatus.inactive

        order_group.total_amount = order.total_amount

        db.commit()
        db.refresh(order_group)
        return order_group
