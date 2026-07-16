from decimal import Decimal

from fastapi import HTTPException
from app.models.order.cart import Cart, CartItem
from app.models.catalog.listing import Listing
from app.utils.order import get_delivery_fee


class CartService:
    @staticmethod
    def get_or_create_cart(current_user, db):
        cart = db.query(Cart).filter(Cart.buyer_id == current_user.id).first()
        if not cart:
            cart = Cart(buyer_id=current_user.id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    @staticmethod
    def add_item(data, current_user, db):
        listing = db.query(Listing).filter(Listing.id == data.listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if listing.status.value != "active":
            raise HTTPException(status_code=400, detail="Listing not available")
        if listing.quantity < data.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")

        cart = CartService.get_or_create_cart(current_user, db)

        existing_item = (
            db.query(CartItem)
            .filter(CartItem.cart_id == cart.id, CartItem.listing_id == data.listing_id)
            .first()
        )

        if existing_item:
            existing_item.quantity += data.quantity
        else:
            existing_item = CartItem(
                cart_id=cart.id,
                listing_id=data.listing_id,
                quantity=data.quantity,
            )
            db.add(existing_item)

        db.commit()
        return CartService.get_cart(current_user, db)

    @staticmethod
    def get_cart(current_user, db):
        cart = CartService.get_or_create_cart(current_user, db)
        return CartService.build_cart_response(cart, db)

    @staticmethod
    def build_cart_response(cart, db):
        delivery_fee_per_order = get_delivery_fee(db)

        items = []
        subtotal = Decimal("0")
        seller_ids = set()

        for item in cart.items:
            listing = item.listing

            line_total = listing.price * item.quantity
            subtotal += line_total

            seller_ids.add(listing.seller_id)

            items.append(
                {
                    "id": item.id,
                    "listing_id": item.listing_id,
                    "quantity": item.quantity,
                    "title": listing.title,
                    "price": float(listing.price),
                    "line_total": float(line_total),
                    "image_url": (
                        listing.images[0].image_url if listing.images else None
                    ),
                    "seller_id": listing.seller_id,
                    "shop_name": listing.seller.shop_name,
                }
            )

        seller_order_count = len(seller_ids)
        delivery_fee = delivery_fee_per_order * seller_order_count
        total = subtotal + delivery_fee

        return {
            "id": cart.id,
            "items": items,
            "subtotal": float(subtotal),
            "delivery_fee": float(delivery_fee),
            "total": float(total),
            "seller_order_count": seller_order_count,
        }

    @staticmethod
    def update_item_quantity(item_id, data, current_user, db):
        cart = CartService.get_or_create_cart(current_user, db)
        item = (
            db.query(CartItem)
            .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
            .first()
        )
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        if data.quantity <= 0:
            db.delete(item)
        else:
            if item.listing.quantity < data.quantity:
                raise HTTPException(
                    status_code=400,
                    detail="Not enough stock",
                )

            item.quantity = data.quantity

        db.commit()

        return CartService.get_cart(current_user, db)

    @staticmethod
    def remove_item(item_id, current_user, db):
        cart = CartService.get_or_create_cart(current_user, db)
        item = (
            db.query(CartItem)
            .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
            .first()
        )
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        db.delete(item)
        db.commit()
        return CartService.get_cart(current_user, db)

    @staticmethod
    def clear_cart(current_user, db):
        cart = CartService.get_or_create_cart(current_user, db)
        for item in cart.items:
            db.delete(item)
        db.commit()
        return {"detail": "Cart cleared"}
