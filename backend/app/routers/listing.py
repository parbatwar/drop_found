from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas.listing import ListingCreate, ListingUpdate
from app.services.listing_service import ListingService

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.post("/")
def create_listing(
    data: ListingCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ListingService.create_listing(data=data, user=current_user, db=db)


@router.get("/")
def get_listings(db=Depends(get_db)):
    return ListingService.get_listings(db)


@router.get("/{listing_id}")
def get_listing(listing_id: str, db=Depends(get_db)):
    return ListingService.get_listing(listing_id=listing_id, db=db)


@router.patch("/{listing_id}")
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
