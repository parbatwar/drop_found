# app/utils/order.py
from decimal import Decimal
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.settings.platform_setting import PlatformSetting


def _get_setting(db: Session, key: str) -> Decimal:
    """Fetch a setting value and convert to Decimal."""
    setting = db.query(PlatformSetting).filter(PlatformSetting.key == key).first()
    if not setting:
        raise HTTPException(
            status_code=500, detail=f"Platform setting '{key}' is not configured."
        )
    return Decimal(setting.value)


def get_tier_delivery_fee(db: Session, subtotal: Decimal) -> Decimal:
    """
    Calculate delivery fee based on subtotal tier.

    If subtotal < 700 → NPR 80
    If subtotal >= 700 → NPR 120
    """
    threshold = _get_setting(db, "inside_valley_delivery_threshold")

    if subtotal < threshold:
        return _get_setting(db, "inside_valley_delivery_fee_low")
    return _get_setting(db, "inside_valley_delivery_fee_high")


# def get_delivery_fee(db: Session) -> Decimal:
#     """
#     Legacy function - returns the low tier fee.
#     Deprecated: Use get_tier_delivery_fee instead.
#     """
#     return _get_setting(db, "inside_valley_delivery_fee_low")
