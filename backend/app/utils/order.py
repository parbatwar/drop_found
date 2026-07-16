from fastapi import HTTPException

from decimal import Decimal
from app.models.settings.platform_setting import PlatformSetting


def get_delivery_fee(db) -> Decimal:
    setting = (
        db.query(PlatformSetting)
        .filter(PlatformSetting.key == "inside_valley_delivery_fee")
        .first()
    )

    if not setting:
        raise HTTPException(status_code=500, detail="Delivery fee is not configured.")

    return Decimal(setting.value)
