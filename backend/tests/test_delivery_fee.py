import pytest
from decimal import Decimal
from fastapi import HTTPException
from app.utils.order import get_tier_delivery_fee
from tests.factories import make_platform_settings


def test_fee_is_low_tier_under_threshold(db_session):
    make_platform_settings(db_session, threshold=700, fee_low=80, fee_high=120)
    fee = get_tier_delivery_fee(db_session, Decimal("500"))
    assert fee == Decimal("80")


def test_fee_is_high_tier_at_threshold(db_session):
    """Exactly at the threshold should be HIGH tier -- the check is
    `subtotal < threshold`, so equal-to counts as the higher bracket."""
    make_platform_settings(db_session, threshold=700, fee_low=80, fee_high=120)
    fee = get_tier_delivery_fee(db_session, Decimal("700"))
    assert fee == Decimal("120")


def test_fee_is_high_tier_above_threshold(db_session):
    make_platform_settings(db_session, threshold=700, fee_low=80, fee_high=120)
    fee = get_tier_delivery_fee(db_session, Decimal("1500"))
    assert fee == Decimal("120")


def test_missing_settings_raises_error(db_session):
    """No PlatformSetting rows at all -- should fail loudly, not
    silently default to some fee."""
    with pytest.raises(HTTPException) as exc_info:
        get_tier_delivery_fee(db_session, Decimal("500"))
    assert exc_info.value.status_code == 500
