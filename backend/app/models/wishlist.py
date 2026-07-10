from sqlalchemy import Column, DateTime, ForeignKey, UUID, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


class Wishlist(Base):
    __tablename__ = "wishlists"

    __table_args__ = (
        UniqueConstraint("buyer_id", "listing_id", name="uq_buyer_listing"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    buyer = relationship("User", back_populates="wishlists")
    listing = relationship("Listing", back_populates="wishlists")
