from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UUID,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base
from app.models.enums import (
    ListingCategory,
    ListingSection,
    ListingStatus,
    ListingCondition,
    ListingSize,
)


class Listing(Base):
    """Represents a clothing item listed for sale by a seller."""

    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    condition = Column(
        Enum(ListingCondition, values_callable=lambda x: [e.value for e in x]),
        nullable=True,
    )
    status = Column(
        Enum(ListingStatus, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=ListingStatus.ACTIVE,
    )
    section = Column(
        Enum(ListingSection, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    category = Column(
        Enum(ListingCategory, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    size = Column(
        Enum(ListingSize, values_callable=lambda x: [e.value for e in x]), nullable=True
    )
    is_boosted = Column(Boolean, default=False, nullable=False)
    boost_expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    images = relationship(
        "ListingImage", back_populates="listing", cascade="all, delete-orphan"
    )
    seller = relationship("SellerProfile", back_populates="listings")
    orders = relationship("Order", back_populates="listing")
    wishlists = relationship("Wishlist", back_populates="listing")


class ListingImage(Base):
    """Represents an image linked with a listing."""

    __tablename__ = "listing_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    image_url = Column(String(255), nullable=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="images")
