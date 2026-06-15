from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.seller import SellerApply, SellerResponse
from app.services.seller_service import SellerService
from app.models.user import User

router = APIRouter(prefix="/sellers", tags=["sellers"])


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


@router.get("/{slug}", response_model=SellerResponse)
def seller_slug(slug: str, db: Session = Depends(get_db)):
    return SellerService.seller_slug(slug, db)
