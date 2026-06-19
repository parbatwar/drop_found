from sqlalchemy import Column, ForeignKey, String, DateTime, UUID, Text
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
from app.models.enums import SellerType, SocialPlatform, VerificationStatus
import uuid


class SellerProfile(Base):
    """Represents a seller's profile in the system. Each seller has a one-to-one relationship with a user."""

    __tablename__ = "seller_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True
    )
    shop_name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    bio = Column(Text)
    location = Column(String(255))
    seller_type = Column(Enum(SellerType, native_enum=False), nullable=False)
    avatar_url = Column(String(255))
    # id_document_url = Column(String(255))
    verification_status = Column(
        Enum(VerificationStatus, native_enum=False),
        default=VerificationStatus.pending.value,
        nullable=False,
    )
    verified_at = Column(DateTime)

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
    """Represents a social media link for a seller. Each seller can have multiple social links."""

    __tablename__ = "seller_social_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    platform = Column(Enum(SocialPlatform, native_enum=False), nullable=False)
    url = Column(String(255), nullable=False)

    seller = relationship("SellerProfile", back_populates="social_links")
