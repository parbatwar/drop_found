import pytest
import uuid
from datetime import datetime
from fastapi import HTTPException

from app.models.user.user import User, UserRole
from app.models.seller.seller import SellerProfile
from app.models.order.order import Order, OrderItem
from app.models.catalog.listing import Listing
from app.models.catalog.category import Category
from app.models.enums.enums import (
    OrderStatus,
    SellerType,
    VerificationStatus,
    PaymentMethod,
)
from app.models.enums.listing_enum import Gender, ListingSize, ListingStatus
from app.services.order_service import OrderService


def make_buyer(db):
    buyer = User(
        email=f"buyer-{uuid.uuid4()}@test.com",
        password_hash="fake",
        first_name="Test",
        last_name="Buyer",
        role=UserRole.buyer,
    )
    db.add(buyer)
    db.commit()
    db.refresh(buyer)
    return buyer


def make_seller(db):
    seller_user = User(
        email=f"seller-{uuid.uuid4()}@test.com",
        password_hash="fake",
        first_name="Test",
        last_name="Seller",
        role=UserRole.seller,
    )
    db.add(seller_user)
    db.commit()
    db.refresh(seller_user)

    seller_profile = SellerProfile(
        user_id=seller_user.id,
        shop_name=f"Shop {uuid.uuid4()}",
        slug=f"shop-{uuid.uuid4()}",
        business_phone="9800000000",
        seller_type=SellerType.thrift_shop,
        verification_status=VerificationStatus.approved,
    )
    db.add(seller_profile)
    db.commit()
    db.refresh(seller_profile)
    return seller_user, seller_profile


def make_listing(db, seller_profile, quantity=5):
    category = Category(name="Test Cat", slug=f"test-cat-{uuid.uuid4()}")
    db.add(category)
    db.commit()
    db.refresh(category)

    listing = Listing(
        seller_id=seller_profile.id,
        category_id=category.id,
        title="Test Item",
        price=1000,
        quantity=quantity,
        gender=Gender.unisex,
        size=ListingSize.m,
        status=ListingStatus.active,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


def make_order(db, buyer, seller_profile, listing, status=OrderStatus.pending, qty=1):
    order = Order(
        buyer_id=buyer.id,
        seller_id=seller_profile.id,
        status=status,
        subtotal=1000,
        total_amount=1080,
        delivery_fee=80,
        receiver_phone="9800000000",
        delivery_address="Test Address",
        payment_method=PaymentMethod.cod,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    item = OrderItem(
        order_id=order.id,
        listing_id=listing.id,
        quantity=qty,
        price_at_purchase=1000,
    )
    db.add(item)
    db.commit()
    db.refresh(order)
    return order


# ── Tests ──


def test_seller_can_accept_pending_order(db_session):
    buyer = make_buyer(db_session)
    seller_user, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(db_session, buyer, seller_profile, listing)

    updated = OrderService.update_order_status(
        order_id=str(order.id),
        current_user=seller_user,
        new_status=OrderStatus.accepted,
        db=db_session,
    )

    assert updated.status == OrderStatus.accepted


def test_seller_cannot_skip_straight_to_ready_for_pickup(db_session):
    """
    ready_for_pickup IS a seller-controlled status, but it's only valid
    coming from 'accepted' -- not directly from 'pending'.
    """
    buyer = make_buyer(db_session)
    seller_user, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(db_session, buyer, seller_profile, listing)  # starts as pending

    with pytest.raises(HTTPException) as exc_info:
        OrderService.update_order_status(
            order_id=str(order.id),
            current_user=seller_user,
            new_status=OrderStatus.ready_for_pickup,
            db=db_session,
        )

    assert exc_info.value.status_code == 400


def test_seller_cannot_update_admin_controlled_status(db_session):
    """delivered/picked_up/out_for_delivery/completed are admin-only,
    regardless of the order's current status."""
    buyer = make_buyer(db_session)
    seller_user, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(db_session, buyer, seller_profile, listing)

    with pytest.raises(HTTPException) as exc_info:
        OrderService.update_order_status(
            order_id=str(order.id),
            current_user=seller_user,
            new_status=OrderStatus.delivered,
            db=db_session,
        )

    assert exc_info.value.status_code == 403
    assert "admin" in exc_info.value.detail.lower()


def test_buyer_can_cancel_pending_order(db_session):
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(db_session, buyer, seller_profile, listing)

    updated = OrderService.update_order_status(
        order_id=str(order.id),
        current_user=buyer,
        new_status=OrderStatus.cancelled,
        db=db_session,
    )

    assert updated.status == OrderStatus.cancelled


def test_buyer_cannot_cancel_after_ready_for_pickup(db_session):
    """Once it's past accepted, buyer loses cancellation rights."""
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(
        db_session,
        buyer,
        seller_profile,
        listing,
        status=OrderStatus.ready_for_pickup,
    )

    with pytest.raises(HTTPException) as exc_info:
        OrderService.update_order_status(
            order_id=str(order.id),
            current_user=buyer,
            new_status=OrderStatus.cancelled,
            db=db_session,
        )

    assert exc_info.value.status_code == 400


def test_buyer_cannot_accept_their_own_order(db_session):
    """Only the seller can accept — not the buyer, even though it's their order."""
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(db_session, buyer, seller_profile, listing)

    with pytest.raises(HTTPException) as exc_info:
        OrderService.update_order_status(
            order_id=str(order.id),
            current_user=buyer,  # ← buyer trying to do a seller action
            new_status=OrderStatus.accepted,
            db=db_session,
        )

    assert exc_info.value.status_code == 403


def test_cancelling_order_restores_listing_stock(db_session):
    """This is the exact code path we just added .with_for_update() to."""
    buyer = make_buyer(db_session)
    seller_user, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile, quantity=5)

    # simulate the stock already having been decremented at checkout time
    listing.quantity = 3
    db_session.commit()

    order = make_order(db_session, buyer, seller_profile, listing, qty=2)

    OrderService.update_order_status(
        order_id=str(order.id),
        current_user=buyer,
        new_status=OrderStatus.cancelled,
        db=db_session,
    )

    db_session.refresh(listing)
    assert listing.quantity == 5  # 3 + 2 restored


def test_rejecting_order_reactivates_sold_out_listing(db_session):
    """If quantity hit 0 and status flipped to inactive, rejecting an order
    should bring it back to active once stock is restored."""
    buyer = make_buyer(db_session)
    seller_user, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile, quantity=5)

    listing.quantity = 0
    listing.status = ListingStatus.inactive
    db_session.commit()

    order = make_order(db_session, buyer, seller_profile, listing, qty=1)

    OrderService.update_order_status(
        order_id=str(order.id),
        current_user=seller_user,
        new_status=OrderStatus.rejected,
        db=db_session,
    )

    db_session.refresh(listing)
    assert listing.quantity == 1
    assert listing.status == ListingStatus.active
