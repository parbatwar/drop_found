from sqlalchemy import Column, DateTime, ForeignKey, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


class Wishlist(Base):
    """Represents a wishlist created by a buyer. Each wishlist can contain multiple listings."""

    __tablename__ = "wishlists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    buyer = relationship("User", back_populates="wishlists")
    listing = relationship("Listing", back_populates="wishlists")
    
