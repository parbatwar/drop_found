"""
This represents an image linked with a listing in the catalog.
Each listing can have multiple images, and each image is associated with a specific listing.
"""

from app.database import Base
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UUID,
)
import uuid
from datetime import datetime
from sqlalchemy.orm import relationship


class ListingImage(Base):
    """Represents an image linked with a listing."""

    __tablename__ = "listing_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    image_url = Column(String(255), nullable=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="images")
