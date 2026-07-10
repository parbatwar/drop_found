from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.follow import FollowCreate, FollowResponse
from app.services.follow_service import FollowService
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/follows", tags=["Follows"])


@router.post("", response_model=FollowResponse)
def follow_seller(
    data: FollowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FollowService.follow_seller(data, current_user, db)


@router.get("", response_model=list[FollowResponse])
def get_my_following(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FollowService.get_my_following(current_user, db)


@router.delete("/{seller_id}")
def unfollow_seller(
    seller_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FollowService.unfollow_seller(seller_id, current_user, db)
