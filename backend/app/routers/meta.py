from fastapi import APIRouter
from app.models.enums import (
    ListingCategory,
    ListingCondition,
    ListingSize,
    ListingSection,
    ListingStatus,
    SellerType,
)

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("/listing-options")
def get_listing_options():
    return {
        "categories": [c.value for c in ListingCategory],
        "conditions": [c.value for c in ListingCondition],
        "sizes": [s.value for s in ListingSize],
        "sections": [s.value for s in ListingSection],
        "statuses": [s.value for s in ListingStatus],
    }


@router.get("/seller-options")
def get_seller_options():
    return {
        "seller_types": [s.value for s in SellerType],
    }
