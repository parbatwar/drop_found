# app/services/review_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.social.review import Review
from app.models.seller.seller import SellerProfile
from app.models.catalog.listing import Listing
from app.schemas.review import ReviewCreate, ReviewsResponse, ReviewResponse
from app.models.user.user import User
import uuid


class ReviewService:

    @staticmethod
    def create_review(
        order_id: uuid.UUID,
        listing_id: uuid.UUID,
        seller_id: uuid.UUID,
        data: ReviewCreate,
        current_user: User,
        db: Session,
    ):
        """Create a review for a completed order"""
        # Check if review already exists for this order
        existing = db.query(Review).filter(Review.order_id == order_id).first()
        if existing:
            raise HTTPException(
                status_code=400, detail="Review already exists for this order"
            )

        review = Review(
            buyer_id=current_user.id,
            seller_id=seller_id,
            listing_id=listing_id,
            order_id=order_id,
            rating=data.rating,
            comment=data.comment,
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def get_listing_reviews(
        listing_id: uuid.UUID, db: Session, page: int = 1, limit: int = 10
    ):
        """Get all reviews for a listing with pagination"""
        # Get reviews
        query = db.query(Review).filter(
            Review.listing_id == listing_id, Review.is_visible == True
        )

        # Get total count
        total_reviews = query.count()

        # Get paginated reviews
        reviews = (
            query.order_by(Review.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        # Calculate average rating
        avg_result = (
            db.query(func.avg(Review.rating))
            .filter(Review.listing_id == listing_id, Review.is_visible == True)
            .scalar()
        )

        average_rating = float(avg_result) if avg_result else 0.0
        total_pages = (total_reviews + limit - 1) // limit if total_reviews > 0 else 1

        return ReviewsResponse(
            reviews=reviews,
            average_rating=average_rating,
            total_reviews=total_reviews,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )

    @staticmethod
    def get_seller_reviews(
        seller_id: uuid.UUID, db: Session, page: int = 1, limit: int = 10
    ):
        """Get all reviews for a seller with pagination"""
        # Get reviews
        query = db.query(Review).filter(
            Review.seller_id == seller_id, Review.is_visible == True
        )

        # Get total count
        total_reviews = query.count()

        # Get paginated reviews
        reviews = (
            query.order_by(Review.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        # Calculate average rating
        avg_result = (
            db.query(func.avg(Review.rating))
            .filter(Review.seller_id == seller_id, Review.is_visible == True)
            .scalar()
        )

        average_rating = float(avg_result) if avg_result else 0.0
        total_pages = (total_reviews + limit - 1) // limit if total_reviews > 0 else 1

        return ReviewsResponse(
            reviews=reviews,
            average_rating=average_rating,
            total_reviews=total_reviews,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )

    @staticmethod
    def get_listing_rating_stats(listing_id: uuid.UUID, db: Session):
        """Get just the rating stats for a listing (for listing response)"""
        reviews = (
            db.query(Review)
            .filter(Review.listing_id == listing_id, Review.is_visible == True)
            .all()
        )

        total_reviews = len(reviews)
        average_rating = (
            sum(r.rating for r in reviews) / total_reviews if total_reviews > 0 else 0.0
        )

        return {"average_rating": average_rating, "total_reviews": total_reviews}

    @staticmethod
    def get_seller_rating_stats(seller_id: uuid.UUID, db: Session):
        """Get just the rating stats for a seller (for seller response)"""
        reviews = (
            db.query(Review)
            .filter(Review.seller_id == seller_id, Review.is_visible == True)
            .all()
        )

        total_reviews = len(reviews)
        average_rating = (
            sum(r.rating for r in reviews) / total_reviews if total_reviews > 0 else 0.0
        )

        return {"average_rating": average_rating, "total_reviews": total_reviews}
