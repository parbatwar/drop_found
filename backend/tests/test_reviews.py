import pytest
from app.main import app
from app.core.dependencies import get_current_user
from app.models.enums.enums import OrderStatus
from tests.factories import make_buyer, make_seller, make_listing, make_order


def _as_user(user):
    """Swaps FastAPI's real auth dependency for one that just returns
    our test user directly -- skips needing a real JWT/login for tests."""

    def _override():
        return user

    return _override


def test_cannot_review_pending_order(db_session, client):
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(
        db_session, buyer, seller_profile, listing, status=OrderStatus.pending
    )

    app.dependency_overrides[get_current_user] = _as_user(buyer)
    try:
        response = client.post(
            f"/reviews/order/{order.id}/listing/{listing.id}",
            json={"rating": 5, "comment": "Great!"},
        )
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 404


def test_can_review_delivered_order(db_session, client):
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(
        db_session, buyer, seller_profile, listing, status=OrderStatus.delivered
    )

    app.dependency_overrides[get_current_user] = _as_user(buyer)
    try:
        response = client.post(
            f"/reviews/order/{order.id}/listing/{listing.id}",
            json={"rating": 5, "comment": "Great!"},
        )
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200


def test_cannot_review_same_order_twice(db_session, client):
    buyer = make_buyer(db_session)
    _, seller_profile = make_seller(db_session)
    listing = make_listing(db_session, seller_profile)
    order = make_order(
        db_session, buyer, seller_profile, listing, status=OrderStatus.delivered
    )

    app.dependency_overrides[get_current_user] = _as_user(buyer)
    try:
        client.post(
            f"/reviews/order/{order.id}/listing/{listing.id}", json={"rating": 5}
        )
        response = client.post(
            f"/reviews/order/{order.id}/listing/{listing.id}", json={"rating": 4}
        )
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 400
