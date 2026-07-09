from decimal import Decimal

from fastapi import HTTPException
from app.models.enums import ListingStatus
from app.models.listing import Listing
from app.models.order import Order, OrderStatus
from app.models.seller import SellerProfile
from app.schemas import listing, order


class OrderService:
    @staticmethod
    def create_order(data, current_user, db):

        listing = db.query(Listing).filter(Listing.id == data.listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if listing.status.value != "active":
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

        if order.status != OrderStatus.pending:
            raise HTTPException(
                status_code=400, detail="Order has already been processed"
            )

        order.status = new_status

        if new_status == OrderStatus.accepted:
            listing = order.listing

            if listing.quantity <= 0:
                raise HTTPException(
                    status_code=400, detail="Item is already out of stock"
                )

            listing.quantity -= 1

            if listing.quantity == 0:
                listing.status = ListingStatus.sold

        db.commit()
        db.refresh(order)
        return order
