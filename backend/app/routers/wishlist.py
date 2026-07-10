from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.wishlist import WishlistCreate, WishlistResponse
from app.services.wishlist_service import WishlistService
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.post("", response_model=WishlistResponse)
def add_to_wishlist(
    data: WishlistCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return WishlistService.add_to_wishlist(data, current_user, db)


@router.get("", response_model=list[WishlistResponse])
def get_my_wishlist(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return WishlistService.get_my_wishlist(current_user, db)


@router.delete("/listing/{listing_id}")
def remove_from_wishlist(
    listing_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return WishlistService.remove_from_wishlist(listing_id, current_user, db)
