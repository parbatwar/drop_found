from sqlalchemy import UUID, Boolean, Column, UUID, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


class Notification(Base):
    """Represents a notification sent to a user."""

    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    notification_type = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")
