# app/services/cart_service.py
from decimal import Decimal
from fastapi import HTTPException
from app.models.order.cart import Cart, CartItem
from app.models.catalog.listing import Listing
from app.utils.order import get_tier_delivery_fee


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
        items = []
        subtotal = Decimal("0")

        # Group items by seller with their subtotal
        seller_groups = {}

        for item in cart.items:
            listing = item.listing

            if not listing:
                continue

            line_total = listing.price * item.quantity
            subtotal += line_total

            seller_id = str(listing.seller_id)  # ✅ Convert to string

            if seller_id not in seller_groups:
                seller_groups[seller_id] = {
                    "seller_id": seller_id,  # ✅ Already string
                    "shop_name": listing.seller.shop_name,
                    "subtotal": Decimal("0"),
                    "items": [],
                }

            seller_groups[seller_id]["subtotal"] += line_total
            seller_groups[seller_id]["items"].append(
                {
                    "id": str(item.id),  # ✅ Convert to string
                    "listing_id": str(item.listing_id),  # ✅ Convert to string
                    "quantity": item.quantity,
                    "title": listing.title,
                    "price": float(listing.price),
                    "line_total": float(line_total),
                    "image_url": (
                        listing.images[0].image_url if listing.images else None
                    ),
                    "seller_id": seller_id,  # ✅ Already string
                    "shop_name": listing.seller.shop_name,
                }
            )

        # ✅ Calculate delivery fee PER SELLER using tiered pricing
        total_delivery_fee = Decimal("0")
        seller_breakdown = []

        for seller_id, group in seller_groups.items():
            seller_subtotal = group["subtotal"]
            delivery_fee = get_tier_delivery_fee(db, seller_subtotal)
            total_delivery_fee += delivery_fee

            seller_breakdown.append(
                {
                    "seller_id": seller_id,  # ✅ Already string
                    "shop_name": group["shop_name"],
                    "subtotal": float(seller_subtotal),
                    "delivery_fee": float(delivery_fee),
                }
            )

        total = subtotal + total_delivery_fee
        seller_order_count = len(seller_groups)

        # Flatten items for response
        all_items = []
        for group in seller_groups.values():
            all_items.extend(group["items"])

        return {
            "id": str(cart.id),  # ✅ Convert to string
            "items": all_items,
            "subtotal": float(subtotal),
            "delivery_fee": float(total_delivery_fee),
            "total": float(total),
            "seller_order_count": seller_order_count,
            "seller_breakdown": seller_breakdown,
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
