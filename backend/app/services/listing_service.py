from fastapi import HTTPException
from app.models.seller.seller import SellerProfile
from app.models.enums.listing_enum import ListingStatus
from app.models.catalog.listing import Listing
from app.models.catalog.listing_image import ListingImage
from app.models.social.wishlist import Wishlist
from app.utils.seller import (
    get_verified_seller,
    validate_listing_owner,
)
from app.utils.category import get_active_category


class ListingService:
    @staticmethod
    def create_listing(data, user, db):
        seller = get_verified_seller(user, db)

        if seller.seller_type == "thrift" and data.condition is None:
            raise HTTPException(
                status_code=400, detail="Condition is required for thrift listings."
            )

        if len(data.images) > 6:
            raise HTTPException(status_code=400, detail="Maximum 6 images allowed.")

        get_active_category(data.category_id, db)

        # 1. Instantiate the primary parent model without handling the images array directly
        listing = Listing(
            title=data.title,
            description=data.description,
            price=data.price,
            quantity=data.quantity,
            category_id=data.category_id,
            gender=data.gender,
            size=data.size,
            condition=data.condition,
            color=data.color,
            is_on_sale=data.is_on_sale,
            seller_id=seller.id,
        )
        db.add(listing)
        db.flush()  # Flushes record state instantly to generate listing.id UUID for foreign key mapping

        # 2. Iterate through the validated nested images array and save them to the DB
        if data.images:
            for img_inbound in data.images:
                db_image = ListingImage(
                    listing_id=listing.id,
                    image_url=img_inbound.image_url,
                    display_order=img_inbound.display_order,
                )
                db.add(db_image)

        # 3. Save everything atomically
        db.commit()
        db.refresh(listing)

        return listing

    @staticmethod
    def get_listings(
        db,
        search=None,
        category_id=None,
        gender=None,
        size=None,
        color=None,
        seller_type=None,
        sort="newest",
    ):
        query = (
            db.query(Listing)
            .join(Listing.seller)
            .filter(Listing.status == ListingStatus.active)
        )

        if search:
            query = query.filter(Listing.title.ilike(f"%{search}%"))

        if category_id:
            query = query.filter(Listing.category_id == category_id)

        if gender:
            query = query.filter(Listing.gender == gender)

        if size:
            query = query.filter(Listing.size == size)

        if color:
            query = query.filter(Listing.color == color)

        if seller_type:
            query = query.filter(SellerProfile.seller_type == seller_type)

        # Sorting
        if sort == "price_asc":
            query = query.order_by(Listing.price.asc())

        elif sort == "price_desc":
            query = query.order_by(Listing.price.desc())

        else:
            query = query.order_by(Listing.created_at.desc())

        return query.all()

    @staticmethod
    def get_my_listings(current_user, db):
        seller = get_verified_seller(current_user, db)

        return (
            db.query(Listing)
            .filter(Listing.seller_id == seller.id)
            .order_by(Listing.created_at.desc())
            .all()
        )

    @staticmethod
    def get_listing(listing_id, current_user, db):
        """
        Fetch a listing by its ID and determine if it's wishlisted by the current user.
        """
        listing = db.query(Listing).filter(Listing.id == listing_id).first()

        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        listing.is_wishlisted = False

        if current_user:
            wishlist = (
                db.query(Wishlist)
                .filter(
                    Wishlist.buyer_id == current_user.id,
                    Wishlist.listing_id == listing.id,
                )
                .first()
            )

            listing.is_wishlisted = wishlist is not None

        return listing

    @staticmethod
    def update_listing(listing_id, data, current_user, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        seller = get_verified_seller(current_user, db)
        validate_listing_owner(listing, seller)

        # handle images — replace all if new set provided
        update_data = data.model_dump(exclude_unset=True)

        print("UPDATE DATA")
        print(update_data)

        if (
            seller.seller_type == "thrift"
            and "condition" in update_data
            and update_data["condition"] is None
        ):
            raise HTTPException(
                status_code=400, detail="Condition is required for thrift listings."
            )

        # Validate category if changing
        if "category_id" in update_data:
            get_active_category(update_data["category_id"], db)

        # Update all non-image fields
        for field, value in update_data.items():
            if field == "images":
                continue

            setattr(listing, field, value)

        # Auto status management
        if listing.quantity <= 0:
            listing.quantity = 0
            listing.status = ListingStatus.sold
        elif listing.quantity > 0 and listing.status == ListingStatus.sold:
            listing.status = ListingStatus.active

        if "images" in update_data and update_data["images"] is not None:

            if len(update_data["images"]) > 6:
                raise HTTPException(
                    status_code=400,
                    detail="Maximum 6 images allowed.",
                )

            # delete existing images
            db.query(ListingImage).filter(
                ListingImage.listing_id == listing.id
            ).delete()

            # insert new images
            for img in update_data["images"]:
                db_image = ListingImage(
                    listing_id=listing.id,
                    image_url=img["image_url"],
                    display_order=img["display_order"],
                )
                db.add(db_image)

        db.commit()

        print("AFTER COMMIT")
        print(listing.title)
        print(listing.price)
        print(listing.quantity)

        db.refresh(listing)

        print("AFTER REFRESH")
        print(listing.title)
        print(listing.price)

        return listing

    @staticmethod
    def delete_listing(listing_id, current_user, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        seller = get_verified_seller(current_user, db)
        validate_listing_owner(listing, seller)

        db.delete(listing)
        db.commit()
        return {"detail": "Listing deleted successfully"}

    @staticmethod
    def get_seller_listings(seller_id: str, db):
        return (
            db.query(Listing)
            .filter(
                Listing.seller_id == seller_id,
                Listing.status == ListingStatus.active,
            )
            .order_by(Listing.created_at.desc())
            .all()
        )

    @staticmethod
    def add_image(listing_id, data, current_user, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        seller = get_verified_seller(current_user, db)
        validate_listing_owner(listing, seller)

        # max 6 images check
        current_count = (
            db.query(ListingImage).filter(ListingImage.listing_id == listing_id).count()
        )
        if current_count >= 6:
            raise HTTPException(status_code=400, detail="Maximum 6 images per listing")

        image = ListingImage(
            listing_id=listing_id,
            image_url=data.image_url,
            display_order=data.display_order,
        )
        db.add(image)
        db.commit()
        db.refresh(image)
        return image

    @staticmethod
    def delete_image(listing_id, image_id, current_user, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        seller = get_verified_seller(current_user, db)
        validate_listing_owner(listing, seller)

        image = (
            db.query(ListingImage)
            .filter(ListingImage.id == image_id, ListingImage.listing_id == listing_id)
            .first()
        )
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")

        db.delete(image)
        db.commit()
        return {"detail": "Image deleted"}
