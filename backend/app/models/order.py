from sqlalchemy import Column, DateTime, ForeignKey, Numeric, UUID, Text
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base
from app.models.enums import OrderStatus, DeliveryMethod


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    status = Column(
        Enum(OrderStatus, native_enum=False),
        nullable=False,
        default=OrderStatus.pending,
    )
    total_amount = Column(Numeric(10, 2), nullable=False)
    delivery_method = Column(
        Enum(DeliveryMethod, native_enum=False),
        nullable=False,
        default=DeliveryMethod.seller,
    )
    delivery_fee = Column(Numeric(10, 2), nullable=False)
    delivery_address = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    buyer = relationship(
        "User", foreign_keys="[Order.buyer_id]", back_populates="orders"
    )
    seller = relationship(
        "SellerProfile", foreign_keys="[Order.seller_id]", back_populates="orders"
    )
    listing = relationship("Listing", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False)
    review = relationship("Review", back_populates="order", uselist=False)
