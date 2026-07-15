from sqlalchemy import Column, DateTime, ForeignKey, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


class Follow(Base):
    """Represents a follow relationship between a buyer and a seller. Each record indicates that a buyer is following a seller."""

    __tablename__ = "follows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    buyer = relationship("User", back_populates="follows")
    seller = relationship("SellerProfile", back_populates="follows")
