# backend/app/models/seller/seller.py
from sqlalchemy import Column, ForeignKey, String, DateTime, UUID, Text, Boolean, JSON
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

# ✅ Import BusinessType from enums
from app.models.enums.enums import (
    SellerType,
    SocialPlatform,
    VerificationStatus,
    BusinessType,
)


class SellerProfile(Base):
    """Represents a seller's profile in the system."""

    __tablename__ = "seller_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True
    )
    shop_name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    bio = Column(Text)
    business_phone = Column(String(20), nullable=False, unique=True)
    business_email = Column(String(255), nullable=True, unique=True)
    location = Column(String(255))
    seller_type = Column(Enum(SellerType, native_enum=False), nullable=False)
    avatar_url = Column(String(255))

    # ✅ Verification fields
    verification_status = Column(
        Enum(VerificationStatus, native_enum=False),
        default=VerificationStatus.pending,
        nullable=False,
    )

    # ✅ Identity verification (for ALL sellers)
    is_identity_verified = Column(Boolean, default=False)
    identity_verified_at = Column(DateTime, nullable=True)

    # ✅ Business verification (only for registered businesses)
    is_business_verified = Column(Boolean, default=False)
    business_verified_at = Column(DateTime, nullable=True)

    # ✅ Business type
    business_type = Column(
        Enum(BusinessType, native_enum=False),
        default="individual",
        nullable=False,
    )

    # ✅ Business documents (only for registered businesses)
    business_registration_number = Column(String(100), nullable=True)
    pan_number = Column(String(50), nullable=True)

    # ✅ NEW: Individual document URL fields for easy access
    identity_front_url = Column(String(500), nullable=True)
    identity_back_url = Column(String(500), nullable=True)
    pan_certificate_url = Column(String(500), nullable=True)
    registration_certificate_url = Column(String(500), nullable=True)
    # business_address_proof = Column(String(500), nullable=True)

    # ✅ Document URLs stored as JSON (backup/aggregated)
    verification_documents = Column(JSON, nullable=True)

    # ✅ Track if seller applied as business
    applied_as_business = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="seller_profile")
    listings = relationship("Listing", back_populates="seller")
    orders = relationship("Order", back_populates="seller")
    social_links = relationship("SellerSocialLink", back_populates="seller")
    reviews = relationship(
        "Review", foreign_keys="[Review.seller_id]", back_populates="seller"
    )
    follows = relationship(
        "Follow", foreign_keys="[Follow.seller_id]", back_populates="seller"
    )


class SellerSocialLink(Base):
    """Represents a social media link for a seller."""

    __tablename__ = "seller_social_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    platform = Column(Enum(SocialPlatform, native_enum=False), nullable=False)
    url = Column(String(255), nullable=False)

    seller = relationship("SellerProfile", back_populates="social_links")
