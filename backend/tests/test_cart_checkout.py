import pytest
from fastapi import HTTPException
from app.services.cart_service import CartService
from app.services.order_service import OrderService
from app.schemas.cart import CartItemAdd
from app.schemas.order import CheckoutRequest
from app.models.enums.enums import PaymentMethod
from tests.factories import (
    make_buyer,
    make_seller,
    make_listing,
    make_platform_settings,
)


def test_add_item_to_cart_succeeds(db_session):
    make_platform_settings(db_session)
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile, quantity=5)

    result = CartService.add_item(
        CartItemAdd(listing_id=listing.id, quantity=2), buyer, db_session
    )
    assert result["items"][0]["quantity"] == 2


def test_add_item_more_than_stock_fails(db_session):
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile, quantity=2)

    with pytest.raises(HTTPException) as exc_info:
        CartService.add_item(
            CartItemAdd(listing_id=listing.id, quantity=5), buyer, db_session
        )
    assert exc_info.value.status_code == 400


def test_checkout_empty_cart_fails(db_session):
    buyer = make_buyer(db_session)
    with pytest.raises(HTTPException) as exc_info:
        OrderService.checkout_cart(
            CheckoutRequest(
                receiver_phone="9800000000",
                delivery_address="Addr",
                payment_method=PaymentMethod.cod,
            ),
            buyer,
            db_session,
        )
    assert exc_info.value.status_code == 400


def test_checkout_decrements_stock_and_creates_order(db_session):
    make_platform_settings(db_session)
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile, quantity=5, price=1000)

    CartService.add_item(
        CartItemAdd(listing_id=listing.id, quantity=2), buyer, db_session
    )

    order_group = OrderService.checkout_cart(
        CheckoutRequest(
            receiver_phone="9800000000",
            delivery_address="Addr",
            payment_method=PaymentMethod.cod,
        ),
        buyer,
        db_session,
    )

    db_session.refresh(listing)
    assert listing.quantity == 3  # 5 - 2
    assert len(order_group.orders) == 1
    assert order_group.orders[0].subtotal == 2000


def test_checkout_math_is_consistent(db_session):
    """subtotal + delivery_fee should always equal total_amount --
    catches a whole class of 'off by the delivery fee' bugs."""
    make_platform_settings(db_session, threshold=700, fee_low=80, fee_high=120)
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile, quantity=5, price=1000)

    CartService.add_item(
        CartItemAdd(listing_id=listing.id, quantity=1), buyer, db_session
    )

    order_group = OrderService.checkout_cart(
        CheckoutRequest(
            receiver_phone="9800000000",
            delivery_address="Addr",
            payment_method=PaymentMethod.cod,
        ),
        buyer,
        db_session,
    )
    order = order_group.orders[0]
    assert order.subtotal + order.delivery_fee == order.total_amount
