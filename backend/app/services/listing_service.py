from fastapi import HTTPException
from app.models.listing import Listing, ListingImage  # Added import for ListingImage
from app.models.seller import SellerProfile


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
        return db.query(Listing).all()

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

        # exclude_unset handles updating only changed fields without breaking the schema structures
        for field, value in data.dict(exclude_unset=True).items():
            if field == "images":
                continue  # Let update handling for existing images be a separate refinement if needed
            setattr(listing, field, value)

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
