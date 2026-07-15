from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.seller import SellerApply, SellerResponse, SellerUpdate
from app.services.seller_service import SellerService
from app.models.user.user import User
from app.core.dependencies import get_current_user_optional

router = APIRouter(prefix="/sellers", tags=["sellers"])


@router.get("/", response_model=list[SellerResponse])
def get_sellers(db: Session = Depends(get_db)):
    return SellerService.get_all_sellers(db)


@router.post("/apply", response_model=SellerResponse)
def apply(
    data: SellerApply, current_user=Depends(get_current_user), db=Depends(get_db)
):
    """
    Apply to become a seller. Requires the user to be authenticated and not already a seller.
    """
    return SellerService.apply(data=data, current_user=current_user, db=db)


@router.get("/me", response_model=SellerResponse)
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return SellerService.me(current_user, db)


@router.put("/me", response_model=SellerResponse)
def update_profile(
    data: SellerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return SellerService.update_profile(current_user, data, db)


@router.get("/{slug}", response_model=SellerResponse)
def seller_slug(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    return SellerService.seller_slug(slug, db, current_user)
