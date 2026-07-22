from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user.user import User
from app.schemas.follow import FollowCreate, FollowResponse
from app.services.follow_service import FollowService
from app.core.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/follows", tags=["Follows"])


@router.post("", response_model=FollowResponse)
def follow_seller(
    data: FollowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FollowService.follow_seller(data, current_user, db)


@router.delete("/{seller_id}")
def unfollow_seller(
    seller_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return FollowService.unfollow_seller(seller_id, current_user, db)


@router.get("/sellers/{seller_id}/followers")
def get_seller_followers(
    seller_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional),
):
    """Get all followers of a seller with user details"""
    followers = FollowService.get_seller_followers(seller_id, db)

    result = []
    for follow in followers:
        result.append(
            {
                "id": follow.buyer.id,
                "first_name": follow.buyer.first_name,
                "last_name": follow.buyer.last_name,
                "followed_at": follow.created_at,
            }
        )

    return {"followers": result, "count": len(result)}


@router.get("", response_model=list[dict])
def get_my_following(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all shops that the current user follows with seller details"""
    follows = FollowService.get_my_following(current_user, db)

    result = []
    for follow in follows:
        result.append(
            {
                "id": follow.id,
                "seller_id": follow.seller_id,
                "created_at": follow.created_at,
                "seller": {
                    "id": follow.seller.id,
                    "shop_name": follow.seller.shop_name,
                    "slug": follow.seller.slug,
                    "avatar_url": follow.seller.avatar_url,
                    "seller_type": follow.seller.seller_type,
                },
            }
        )

    return result
