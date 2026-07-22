from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.catalog.category import Category
from app.models.enums.listing_enum import (
    Gender,
    ListingCondition,
    ListingSize,
    ListingColor,
    ListingStatus,
)
from app.models.enums.enums import SellerType
from app.models.enums.listing_enum import Gender, ListingColor
from app.utils.category import get_active_category
from app.utils.order import get_tier_delivery_fee

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("/listing-options")
def get_listing_options(db: Session = Depends(get_db)):
    categories = (
        db.query(Category)
        .filter(Category.is_active == True)
        .order_by(Category.name)
        .all()
    )

    return {
        "categories": [
            {
                "id": str(category.id),
                "name": category.name,
                "slug": category.slug,
            }
            for category in categories
        ],
        "genders": [g.value for g in Gender],
        "conditions": [c.value for c in ListingCondition],
        "sizes": [s.value for s in ListingSize],
        "colors": [c.value for c in ListingColor],
        "statuses": [s.value for s in ListingStatus],
    }


@router.get("/seller-options")
def get_seller_options():
    return {
        "seller_types": [s.value for s in SellerType],
    }


@router.get("/delivery-fee")
def get_current_delivery_fee(db: Session = Depends(get_db)):
    return {"delivery_fee": float(get_tier_delivery_fee(db, Decimal(0)))}
