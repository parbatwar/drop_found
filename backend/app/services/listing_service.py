from fastapi import HTTPException
from app.models.enums import ListingStatus
from app.models.listing import Listing, ListingImage  # Added import for ListingImage
from app.models.seller import SellerProfile
from app.schemas import listing


class ListingService:
    @staticmethod
    def create_listing(data, user, db):
        existing_seller = (
            db.query(SellerProfile).filter(SellerProfile.user_id == user.id).first()
        )

        if not existing_seller:
            raise HTTPException(
                status_code=403, detail="Only sellers can create listings"
            )

        if existing_seller.verification_status.value != "approved":
            raise HTTPException(
                status_code=403, detail="Your account is pending verification"
            )

        # 1. Instantiate the primary parent model without handling the images array directly
        listing = Listing(
            title=data.title,
            description=data.description,
            price=data.price,
            quantity=data.quantity,
            condition=data.condition,
            section=data.section,
            category=data.category,
            size=data.size,
            seller_id=existing_seller.id,
        )

        db.add(listing)
        db.flush()  # Flushes record state instantly to generate listing.id UUID for foreign key mapping

        # 2. Iterate through the validated nested images array and save them to the DB
        if hasattr(data, "images") and data.images:
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
    def get_listings(db):
        return db.query(Listing).filter(Listing.status == ListingStatus.active).all()

    @staticmethod
    def get_my_listings(current_user, db):
        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not seller:
            raise HTTPException(status_code=403, detail="Not a seller")
        return (
            db.query(Listing)
            .filter(Listing.seller_id == seller.id)
            .order_by(Listing.created_at.desc())
            .all()
        )

    @staticmethod
    def get_listing(listing_id, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        return listing

    @staticmethod
    def update_listing(listing_id, data, current_user, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not seller or listing.seller_id != seller.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to update this listing",
            )

        # update non-image fields
        for field, value in data.dict(exclude_unset=True).items():
            if field == "images":
                continue
            setattr(listing, field, value)

        # Auto status management
        if listing.quantity <= 0:
            listing.quantity = 0
            listing.status = ListingStatus.sold
        elif listing.quantity > 0 and listing.status == ListingStatus.sold:
            listing.status = ListingStatus.active

        # handle images — replace all if new set provided
        update_data = data.dict(exclude_unset=True)
        if "images" in update_data and update_data["images"] is not None:
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
        db.refresh(listing)
        return listing

    @staticmethod
    def delete_listing(listing_id, current_user, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not seller or listing.seller_id != seller.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to delete this listing",
            )

        db.delete(listing)
        db.commit()
        return {"detail": "Listing deleted successfully"}

    @staticmethod
    def get_seller_listings(
        seller_id: str,
        db,
    ):
        return (
            db.query(Listing)
            .filter(Listing.seller_id == seller_id)
            .order_by(Listing.created_at.desc())
            .all()
        )

    @staticmethod
    def add_image(listing_id, data, current_user, db):
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not seller or listing.seller_id != seller.id:
            raise HTTPException(status_code=403, detail="Not your listing")

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

        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not seller or listing.seller_id != seller.id:
            raise HTTPException(status_code=403, detail="Not your listing")

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
