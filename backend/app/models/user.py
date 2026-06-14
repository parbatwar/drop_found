from sqlalchemy import Column, Enum, String, Boolean, DateTime, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid
from app.models.enums import UserRole


class User(Base):
    """
    Represents a user in the system. Users can be buyers, sellers, or admins.
    """

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_email_verified = Column(Boolean, default=False)
    role = Column(Enum(UserRole), default=UserRole.BUYER, nullable=False)

    # relationships
    seller_profile = relationship("SellerProfile", back_populates="user", uselist=False)
    orders = relationship(
        "Order", foreign_keys="[Order.buyer_id]", back_populates="buyer"
    )
    reviews = relationship(
        "Review", foreign_keys="[Review.buyer_id]", back_populates="buyer"
    )
    wishlists = relationship("Wishlist", back_populates="buyer")
    follows = relationship(
        "Follow", foreign_keys="[Follow.buyer_id]", back_populates="buyer"
    )
    notifications = relationship("Notification", back_populates="user")
