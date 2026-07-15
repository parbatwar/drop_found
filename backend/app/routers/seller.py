from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.seller import SellerApply, SellerResponse, SellerUpdate
from app.services.seller_service import SellerService
from app.models.user.user import User
from app.core.dependencies import get_current_user_optional

router = APIRouter(prefix="/sellers", tags=["sellers"])


@router.post("/apply", response_model=SellerResponse)
def apply_for_seller(
    data: SellerApply,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    """
    Requires the user to be authenticated and not already a seller.
    """
    return SellerService.apply_for_seller(data=data, current_user=current_user, db=db)


@router.put("/me", response_model=SellerResponse)
def update_seller_profile(
    data: SellerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the current user's seller profile."""
    return SellerService.update_seller_profile(current_user, data, db)


@router.get("/", response_model=list[SellerResponse])
def get_all_sellers(db: Session = Depends(get_db)):
    """Get all approved sellers."""
    return SellerService.get_all_sellers(db)


@router.get("/me", response_model=SellerResponse)
def get_my_seller_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's seller profile"""
    return SellerService.get_my_seller_profile(current_user, db)


@router.get("/{slug}", response_model=SellerResponse)
def get_seller_profile(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Get a seller profile by slug for viewing."""
    return SellerService.get_seller_profile(slug, db, current_user)
