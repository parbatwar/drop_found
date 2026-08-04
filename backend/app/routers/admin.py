# backend/app/routers/admin.py
from typing import List
import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.models.user.user import UserRole
from app.database import get_db
from app.schemas.seller import SellerResponse, ReviewSellerRequest
from app.services.admin_service import AdminService
from app.schemas.pagination import PaginatedResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/sellers/pending", response_model=PaginatedResponse[SellerResponse])
def get_pending_sellers(
    admin_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    """Get paginated pending seller applications with verification details."""
    return AdminService.get_pending_sellers(db=db, page=page, limit=limit)


@router.patch("/sellers/{seller_id}/review")
def review_seller(
    seller_id: uuid.UUID,
    data: ReviewSellerRequest,
    admin_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    """Review seller application with granular verification control."""
    return AdminService.review_seller(seller_id=seller_id, data=data, db=db)
