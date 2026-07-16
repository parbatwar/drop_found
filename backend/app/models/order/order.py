from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    UUID,
    String,
    Text,
)
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base
from app.models.enums.enums import OrderStatus, PaymentMethod


class Order(Base):
    """Represents an order placed by a buyer to a seller.
    Each order is associated with a specific seller and may contain multiple items (listings).
    An order can be part of an order group, which groups multiple orders from different sellers in a single checkout process.
    """

    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    order_group_id = Column(
        UUID(as_uuid=True), ForeignKey("order_groups.id"), nullable=True
    )
    status = Column(
        Enum(OrderStatus, native_enum=False),
        nullable=False,
        default=OrderStatus.pending,
    )
    subtotal = Column(Numeric(10, 2), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)

    # Delivery (Changes per order)
    receiver_phone = Column(String(50), nullable=False)
    delivery_address = Column(Text, nullable=False)
    delivery_fee = Column(Numeric(10, 2), nullable=False, default=0.00)
    payment_method = Column(
        Enum(PaymentMethod, native_enum=False),
        nullable=False,
        default=PaymentMethod.cod,
    )

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    buyer = relationship(
        "User", foreign_keys="[Order.buyer_id]", back_populates="orders"
    )
    seller = relationship(
        "SellerProfile", foreign_keys="[Order.seller_id]", back_populates="orders"
    )
    payment = relationship("Payment", back_populates="order", uselist=False)
    review = relationship("Review", back_populates="order", uselist=False)
    order_group = relationship("OrderGroup", back_populates="orders")
    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderGroup(Base):
    """Groups sub-orders created from one checkout (one per seller)."""

    __tablename__ = "order_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="order_group")


class OrderItem(Base):
    """A single listing + quantity within one seller's order."""

    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(
        UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False
    )
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    listing = relationship("Listing", back_populates="order_items")


