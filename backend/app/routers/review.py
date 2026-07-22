# app/routes/review.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewsResponse
from app.services.review_service import ReviewService
from app.models.user.user import User
from app.models.order.order import Order
from app.models.catalog.listing import Listing
from app.models.social.review import Review
from fastapi import HTTPException
import uuid

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/order/{order_id}/listing/{listing_id}", response_model=ReviewResponse)
def create_review(
    order_id: UUID,
    listing_id: UUID,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a review for a completed order.
    One review per order item.
    """
    # ✅ Allow both delivered AND completed orders
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.buyer_id == current_user.id,
            Order.status.in_(["delivered", "completed"]),  # ✅ Fixed
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404, detail="Order not found or not delivered/completed"
        )

    # Verify listing exists and get seller
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # Check if review already exists for this order
    existing = db.query(Review).filter(Review.order_id == order_id).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="Review already exists for this order"
        )

    return ReviewService.create_review(
        order_id=order_id,
        listing_id=listing_id,
        seller_id=listing.seller_id,
        data=data,
        current_user=current_user,
        db=db,
    )


@router.get("/listing/{listing_id}", response_model=ReviewsResponse)
def get_listing_reviews(
    listing_id: UUID,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
):
    """
    Get all reviews for a listing with pagination.
    Returns: reviews, average_rating, total_reviews, pagination info.
    """
    return ReviewService.get_listing_reviews(listing_id, db, page, limit)


@router.get("/seller/{seller_id}", response_model=ReviewsResponse)
def get_seller_reviews(
    seller_id: UUID,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
):
    """
    Get all reviews for a seller with pagination.
    Returns: reviews, average_rating, total_reviews, pagination info.
    """
    return ReviewService.get_seller_reviews(seller_id, db, page, limit)
