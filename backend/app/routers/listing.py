from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.dependencies import get_current_user_optional
from app.database import get_db
from app.models.enums.enums import SellerType
from app.models.enums.listing_enum import ListingSize, Gender, ListingColor
from app.models.user.user import User
from app.schemas.listing import (
    ListingCreate,
    ListingImageCreate,
    ListingResponse,
    ListingUpdate,
)
from app.services.listing_service import ListingService

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.post("/")
def create_listing(
    data: ListingCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ListingService.create_listing(data=data, user=current_user, db=db)


@router.get("/", response_model=list[ListingResponse])
def get_listings(
    search: str | None = None,
    category_id: UUID | None = None,
    gender: Gender | None = None,
    size: ListingSize | None = None,
    color: ListingColor | None = None,
    seller_type: SellerType | None = None,
    sort: str = "newest",
    db: Session = Depends(get_db),
):
    return ListingService.get_listings(
        db=db,
        search=search,
        category_id=category_id,
        gender=gender,
        size=size,
        color=color,
        seller_type=seller_type,
        sort=sort,
    )


@router.get("/me", response_model=List[ListingResponse])
def get_my_listings(
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return ListingService.get_my_listings(current_user, db)


@router.get("/seller/{seller_id}", response_model=List[ListingResponse])
def get_seller_listings(
    seller_id: str,
    db=Depends(get_db),
):
    return ListingService.get_seller_listings(
        seller_id=seller_id,
        db=db,
    )


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    return ListingService.get_listing(listing_id, current_user, db)


@router.patch("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: str,
    data: ListingUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return ListingService.update_listing(
        listing_id=listing_id, data=data, current_user=current_user, db=db
    )


@router.delete("/{listing_id}")
def delete_listing(
    listing_id: str, current_user=Depends(get_current_user), db=Depends(get_db)
):
    return ListingService.delete_listing(
        listing_id=listing_id, current_user=current_user, db=db
    )


@router.post("/{listing_id}/images")
def add_listing_image(
    listing_id: str,
    data: ListingImageCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ListingService.add_image(listing_id, data, current_user, db)


@router.delete("/{listing_id}/images/{image_id}")
def delete_listing_image(
    listing_id: str,
    image_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ListingService.delete_image(listing_id, image_id, current_user, db)
