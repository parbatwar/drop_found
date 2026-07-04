from typing import List
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.models.user import UserRole
from app.database import get_db
from app.schemas.seller import SellerResponse, ReviewSellerRequest
from app.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/sellers/pending", response_model=List[SellerResponse])
def get_pending_sellers(
    admin_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    return AdminService.get_pending_sellers(db=db)


@router.patch("/sellers/{seller_id}/review")
def review_seller(
    seller_id: uuid.UUID,
    data: ReviewSellerRequest,
    admin_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    return AdminService.review_seller(seller_id=seller_id, data=data, db=db)
