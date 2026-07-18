"""
This is the main model for a listing in the catalog.
It represents an item listed for sale by a seller.
"""

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UUID,
)
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base
from app.models.enums.listing_enum import (
    Gender,
    ListingColor,
    ListingSize,
    ListingStatus,
    ListingCondition,
)


class Listing(Base):
    """Represents a clothing item listed for sale by a seller."""

    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    category_id = Column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False
    )

    title = Column(String(255), nullable=False)
    description = Column(Text)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Numeric(10, 2), nullable=False)

    gender = Column(Enum(Gender, native_enum=False), nullable=False)
    size = Column(Enum(ListingSize, native_enum=False), nullable=False)
    condition = Column(Enum(ListingCondition, native_enum=False), nullable=True)
    color = Column(Enum(ListingColor, native_enum=False), nullable=True)

    status = Column(
        Enum(ListingStatus, native_enum=False),
        nullable=False,
        default=ListingStatus.active,
    )

    is_on_sale = Column(Boolean, nullable=False, default=False)
    is_surplus = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # Relationships
    seller = relationship("SellerProfile", back_populates="listings")
    category = relationship("Category", back_populates="listings")

    images = relationship(
        "ListingImage",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    order_items = relationship("OrderItem", back_populates="listing")
    cart_items = relationship("CartItem", back_populates="listing")
    wishlists = relationship("Wishlist", back_populates="listing")
    reviews = relationship("Review", back_populates="listing")

    @property
    def category_name(self):
        return self.category.name

    @property
    def shop_name(self):
        return self.seller.shop_name if self.seller else None

    @property
    def seller_type(self):
        return self.seller.seller_type if self.seller else None
