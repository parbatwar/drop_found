import pytest
from fastapi import HTTPException
from app.services.wishlist_service import WishlistService
from app.schemas.wishlist import WishlistCreate
from tests.factories import make_buyer, make_seller, make_listing


def test_add_to_wishlist_succeeds(db_session):
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)

    result = WishlistService.add_to_wishlist(
        WishlistCreate(listing_id=listing.id), buyer, db_session
    )
    assert result.listing_id == listing.id


def test_adding_same_listing_twice_fails(db_session):
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)

    WishlistService.add_to_wishlist(
        WishlistCreate(listing_id=listing.id), buyer, db_session
    )

    with pytest.raises(HTTPException) as exc_info:
        WishlistService.add_to_wishlist(
            WishlistCreate(listing_id=listing.id), buyer, db_session
        )

    assert exc_info.value.status_code == 400
