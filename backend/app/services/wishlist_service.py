from fastapi import HTTPException
from app.models.social.wishlist import Wishlist
from app.models.catalog.listing import Listing


class WishlistService:

    @staticmethod
    def add_to_wishlist(data, current_user, db):

        listing = db.query(Listing).filter(Listing.id == data.listing_id).first()

        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        existing = (
            db.query(Wishlist)
            .filter(
                Wishlist.buyer_id == current_user.id,
                Wishlist.listing_id == data.listing_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(status_code=400, detail="Already in wishlist")

        wishlist = Wishlist(buyer_id=current_user.id, listing_id=data.listing_id)

        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)

        return wishlist

    @staticmethod
    def get_my_wishlist(current_user, db):

        return db.query(Wishlist).filter(Wishlist.buyer_id == current_user.id).all()

    @staticmethod
    def remove_from_wishlist(listing_id, current_user, db):

        print("Current User:", current_user.id)
        print("Listing ID:", listing_id)

        all_items = db.query(Wishlist).all()

        for item in all_items:
            print(
                "Wishlist DB:",
                item.buyer_id,
                item.listing_id,
            )

        wishlist = (
            db.query(Wishlist)
            .filter(
                Wishlist.buyer_id == current_user.id, Wishlist.listing_id == listing_id
            )
            .first()
        )

        print("Wishlist:", wishlist)

        if not wishlist:
            raise HTTPException(status_code=404, detail="Wishlist item not found")

        db.delete(wishlist)
        db.commit()

        return {"detail": "Removed from wishlist"}
