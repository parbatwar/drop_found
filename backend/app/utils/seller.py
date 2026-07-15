"""
Helper functions for seller-related operations.
"""

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.seller.seller import SellerProfile
from app.models.catalog.listing import Listing


def get_verified_seller(user, db: Session) -> SellerProfile:
    """
    Returns the current user's verified seller profile.
    Raises an exception if the user is not an approved seller.
    """

    seller = db.query(SellerProfile).filter(SellerProfile.user_id == user.id).first()

    if not seller:
        raise HTTPException(
            status_code=403,
            detail="Only sellers can perform this action.",
        )

    if seller.verification_status.value != "approved":
        raise HTTPException(
            status_code=403,
            detail="Your seller account is pending verification.",
        )

    return seller


def validate_listing_owner(listing: Listing, seller: SellerProfile):
    """
    Ensures the listing belongs to the current seller.
    """

    if listing.seller_id != seller.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to modify this listing.",
        )
