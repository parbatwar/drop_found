from fastapi import HTTPException

from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.review import Review


class ReviewService:
    @staticmethod
    def create_review(order_id: str, data, current_user, db):
        order = db.query(Order).filter(Order.id == order_id).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.buyer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not your order")

        if order.status != OrderStatus.delivered:
            raise HTTPException(
                status_code=400,
                detail="Only delivered orders can be reviewed",
            )

        existing_review = db.query(Review).filter(Review.order_id == order.id).first()

        if existing_review:
            raise HTTPException(
                status_code=400,
                detail="Review already exists",
            )

        review = Review(
            buyer_id=current_user.id,
            seller_id=order.seller_id,
            listing_id=order.listing_id,
            order_id=order.id,
            rating=data.rating,
            comment=data.comment,
        )

        db.add(review)
        db.commit()
        db.refresh(review)

        return review

    @staticmethod
    def get_seller_reviews(seller_id, db):
        return (
            db.query(Review)
            .filter(
                Review.seller_id == seller_id,
                Review.is_visible == True,
            )
            .order_by(Review.created_at.desc())
            .all()
        )
