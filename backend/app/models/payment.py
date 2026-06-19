from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String, UUID
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid
from app.models.enums import PaymentMethod, PaymentStatus


class Payment(Base):
    """Represents a payment transaction for an order. Each payment is associated with a single order."""

    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, unique=True
    )
    method = Column(
        Enum(PaymentMethod, native_enum=False),
        nullable=False,
        default=PaymentMethod.cod,
    )
    transaction_ref = Column(String(255), nullable=True, unique=True)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(
        Enum(PaymentStatus, native_enum=False),
        nullable=False,
        default=PaymentStatus.pending,
    )
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="payment", uselist=False)


"""
class Payout(Base):
    __tablename__ = "payouts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(
        UUID(as_uuid=True), ForeignKey("seller_profiles.id"), nullable=False
    )
    order_id = Column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, unique=True
    )
    amount = Column(Numeric(10, 2), nullable=False)
    payout_status = Column(Enum(PayoutStatus), nullable=False)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
"""
