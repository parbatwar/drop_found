from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.review import ReviewCreate
from app.services.review_service import ReviewService

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/order/{order_id}")
def create_review(
    order_id: str,
    data: ReviewCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return ReviewService.create_review(
        order_id=order_id,
        data=data,
        current_user=current_user,
        db=db,
    )


@router.get("/seller/{seller_id}")
def get_seller_reviews(seller_id: str, db=Depends(get_db)):
    return ReviewService.get_seller_reviews(seller_id=seller_id, db=db)
