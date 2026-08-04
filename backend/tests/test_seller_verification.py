import pytest
from fastapi import HTTPException
from app.utils.seller import get_verified_seller
from app.models.enums.enums import VerificationStatus
from tests.factories import make_buyer, make_seller


def test_approved_seller_passes(db_session):
    seller_user, seller_profile = make_seller(
        db_session, verification_status=VerificationStatus.approved
    )
    result = get_verified_seller(seller_user, db_session)
    assert result.id == seller_profile.id


def test_pending_seller_is_blocked(db_session):
    seller_user, _ = make_seller(
        db_session, verification_status=VerificationStatus.pending
    )
    with pytest.raises(HTTPException) as exc_info:
        get_verified_seller(seller_user, db_session)
    assert exc_info.value.status_code == 403


def test_buyer_with_no_seller_profile_is_blocked(db_session):
    buyer = make_buyer(db_session)
    with pytest.raises(HTTPException) as exc_info:
        get_verified_seller(buyer, db_session)
    assert exc_info.value.status_code == 403
