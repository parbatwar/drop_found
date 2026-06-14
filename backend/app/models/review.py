from sqlalchemy import Boolean, Column, DateTime, ForeignKey, UUID, Integer, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


class Review(Base):
    """Represents a review left by a buyer for a seller profile."""

    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    order_id = Column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, unique=True
    )
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    is_visible = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    buyer = relationship(
        "User", foreign_keys="[Review.buyer_id]", back_populates="reviews"
    )
    seller = relationship(
        "SellerProfile", foreign_keys="[Review.seller_id]", back_populates="reviews"
    )
    order = relationship("Order", back_populates="review", uselist=False)
