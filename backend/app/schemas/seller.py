# backend/app/schemas/seller.py
from pydantic import BaseModel, field_validator, EmailStr
import uuid
import re
from datetime import datetime
from app.models.enums.enums import SellerType, VerificationStatus, BusinessType


class SellerApply(BaseModel):
    seller_type: SellerType
    shop_name: str
    avatar_url: str | None = None
    location: str | None = None
    bio: str | None = None
    business_phone: str
    business_email: EmailStr | None = None

    business_type: BusinessType = BusinessType.individual

    identity_front_url: str
    identity_back_url: str

    pan_certificate_url: str | None = None
    registration_certificate_url: str | None = None
    pan_number: str | None = None
    business_registration_number: str | None = None
    # business_address_proof: str | None = None

    # ✅ Shop name validation
    @field_validator("shop_name")
    @classmethod
    def validate_shop_name(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError("Shop name must be at least 3 characters")
        return v.strip()

    # ✅ Business phone validation - exactly 10 digits
    @field_validator("business_phone")
    @classmethod
    def validate_business_phone(cls, v):
        if not v:
            raise ValueError("Business phone is required")
        # Remove any non-digit characters
        cleaned = re.sub(r"\D", "", v)
        if len(cleaned) != 10:
            raise ValueError("Business phone must be exactly 10 digits")
        return cleaned

    # ✅ Location validation for business
    @field_validator("location")
    @classmethod
    def validate_location(cls, v, info):
        if info.data.get("business_type") == BusinessType.registered:
            if not v or not v.strip():
                raise ValueError("Location is required for business sellers")
        return v

    # ✅ Business documents validation
    @field_validator(
        "pan_certificate_url",
        "registration_certificate_url",
        "business_registration_number",
        "pan_number",
    )
    @classmethod
    def validate_business_documents(cls, v, info):
        if info.data.get("business_type") == BusinessType.registered:
            field_name = info.field_name
            if not v:
                raise ValueError(f"{field_name} is required for business sellers")

            # ✅ Business registration number - alphanumeric, min 5
            if field_name == "business_registration_number":
                if not re.match(r"^[A-Za-z0-9-]{5,}$", v):
                    raise ValueError(
                        "Business registration number must be at least 5 alphanumeric characters"
                    )

            # ✅ PAN number - digits only, 9-15 digits
            if field_name == "pan_number":
                if not re.match(r"^[0-9]{9,15}$", v):
                    raise ValueError("PAN number must be 9-15 digits")
        return v


class SellerUpdate(BaseModel):
    shop_name: str | None = None
    bio: str | None = None
    location: str | None = None
    avatar_url: str | None = None
    business_phone: str | None = None
    business_email: EmailStr | None = None

    @field_validator("shop_name")
    @classmethod
    def validate_shop_name(cls, v):
        if v is not None and len(v.strip()) < 3:
            raise ValueError("Shop name must be at least 3 characters")
        return v

    @field_validator("business_phone")
    @classmethod
    def validate_business_phone(cls, v):
        if v is not None:
            cleaned = re.sub(r"\D", "", v)
            if len(cleaned) != 10:
                raise ValueError("Business phone must be exactly 10 digits")
            return cleaned
        return v


class ReviewSellerRequest(BaseModel):
    status: VerificationStatus
    verify_identity: bool = False
    verify_business: bool = False


class SellerResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    shop_name: str
    slug: str
    bio: str | None = None
    location: str | None = None
    avatar_url: str | None = None
    business_phone: str | None = None
    business_email: str | None = None

    seller_type: SellerType
    verification_status: VerificationStatus
    is_identity_verified: bool = False
    is_business_verified: bool = False
    business_type: BusinessType

    identity_verified_at: datetime | None = None
    business_verified_at: datetime | None = None

    identity_front_url: str | None = None
    identity_back_url: str | None = None
    pan_certificate_url: str | None = None
    registration_certificate_url: str | None = None
    business_address_proof: str | None = None

    # ✅ Documents JSON (backward compatibility)
    verification_documents: dict | None = None

    followers_count: int = 0
    average_rating: float = 0.0
    total_reviews: int = 0
    is_following: bool = False

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SellerVerificationStatusResponse(BaseModel):
    has_applied: bool
    can_sell: bool
    verification_status: VerificationStatus | None = None
    is_identity_verified: bool = False
    is_business_verified: bool = False
    business_type: BusinessType | None = None
    message: str | None = None


class BusinessVerificationRequest(BaseModel):
    pan_certificate_url: str
    registration_certificate_url: str
    business_registration_number: str
    pan_number: str
    business_address_proof: str
    business_type: BusinessType = BusinessType.registered
