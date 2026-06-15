from fastapi import HTTPException
from app.models.seller import SellerProfile
from app.models.enums import UserRole
from app.utils.slug import generate_slug


class SellerService:

    @staticmethod
    def apply(data, current_user, db):
        """
        Handles the application for a user to become a seller.
        """
        exisitng_profile = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if exisitng_profile:
            raise HTTPException(
                status_code=409,
                detail="Seller Profile already exists for this account",
            )

        slug = generate_slug(data.shop_name)

        if db.query(SellerProfile).filter(SellerProfile.slug == slug).first():
            raise HTTPException(status_code=409, detail="Shop name already taken")

        seller = SellerProfile(
            user_id=current_user.id,
            shop_name=data.shop_name,
            slug=slug,
            bio=data.bio,
            location=data.location,
            seller_type=data.seller_type,
        )

        db.add(seller)
        current_user.role = UserRole.SELLER

        db.commit()
        db.refresh(seller)
        return seller

    @staticmethod
    def me(current_user, db):
        existing_profile = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )
        if not existing_profile:
            raise HTTPException(status_code=404, detail="Seller Profile not found")

        return existing_profile

    @staticmethod
    def seller_slug(slug, db):
        seller = db.query(SellerProfile).filter(SellerProfile.slug == slug).first()
        if not seller:
            raise HTTPException(status_code=404, detail="Seller Profile not found")

        return seller
