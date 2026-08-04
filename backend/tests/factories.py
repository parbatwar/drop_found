import uuid
from app.models.user.user import User, UserRole
from app.models.seller.seller import SellerProfile
from app.models.catalog.listing import Listing
from app.models.catalog.category import Category
from app.models.order.order import Order, OrderItem
from app.models.settings.platform_setting import PlatformSetting
from app.models.enums.enums import (
    SellerType,
    VerificationStatus,
    PaymentMethod,
    OrderStatus,
)
from app.models.enums.listing_enum import Gender, ListingSize, ListingStatus


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


def make_seller(
    db, verification_status=VerificationStatus.approved, is_identity_verified=True
):
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
        business_phone=f"98{uuid.uuid4().int % 100000000:08d}",
        seller_type=SellerType.thrift_shop,
        verification_status=verification_status,
        is_identity_verified=is_identity_verified,
    )
    db.add(seller_profile)
    db.commit()
    db.refresh(seller_profile)
    return seller_user, seller_profile


def make_listing(
    db, seller_profile, quantity=5, price=1000, status=ListingStatus.active
):
    category = Category(name="Test Cat", slug=f"test-cat-{uuid.uuid4()}")
    db.add(category)
    db.commit()
    db.refresh(category)

    listing = Listing(
        seller_id=seller_profile.id,
        category_id=category.id,
        title="Test Item",
        price=price,
        quantity=quantity,
        gender=Gender.unisex,
        size=ListingSize.m,
        status=status,
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
        subtotal=listing.price * qty,
        total_amount=listing.price * qty + 80,
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
        price_at_purchase=listing.price,
    )
    db.add(item)
    db.commit()
    db.refresh(order)
    return order


def make_platform_settings(db, threshold=700, fee_low=80, fee_high=120):
    """Checkout/delivery-fee logic reads these from the DB — without them,
    get_tier_delivery_fee raises an error. Call this in any test that
    touches checkout or delivery fee calculation."""
    db.add(
        PlatformSetting(key="inside_valley_delivery_threshold", value=str(threshold))
    )
    db.add(PlatformSetting(key="inside_valley_delivery_fee_low", value=str(fee_low)))
    db.add(PlatformSetting(key="inside_valley_delivery_fee_high", value=str(fee_high)))
    db.commit()
