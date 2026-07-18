from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    UUID,
    Integer,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


class Review(Base):
    """
    Buyer review for a completed order.
    """

    __tablename__ = "reviews"

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_review_rating"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    order_id = Column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, unique=True
    )

    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)

    is_visible = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    buyer = relationship(
        "User", foreign_keys="[Review.buyer_id]", back_populates="reviews"
    )
    seller = relationship(
        "SellerProfile", foreign_keys="[Review.seller_id]", back_populates="reviews"
    )
    listing = relationship("Listing", back_populates="reviews")
    order = relationship("Order", back_populates="review", uselist=False)
