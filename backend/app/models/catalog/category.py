from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    UUID,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # relationships
    listings = relationship("Listing", back_populates="category")
