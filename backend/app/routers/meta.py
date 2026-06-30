from fastapi import APIRouter
from app.models.enums import (
    ListingCategory,
    ListingCondition,
    ListingSize,
    ListingSection,
    ListingStatus,
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
