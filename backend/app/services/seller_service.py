from fastapi import HTTPException
from app.models.seller.seller import SellerProfile
from app.models.enums.enums import UserRole, VerificationStatus
from app.utils.slug import generate_slug

from app.models.user.user import User
from app.models.seller.follow import Follow


class SellerService:

    @staticmethod
    def get_all_sellers(db):
        return (
            db.query(SellerProfile)
            .filter(SellerProfile.verification_status == "approved")
            .all()
        )

    @staticmethod
    def apply(data, current_user, db):
        """
        Handles the application for a user to become a seller.
        Allows reapplication if a previous application was rejected.
        """
        existing_profile = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )

        if existing_profile:
            if existing_profile.verification_status in (
                VerificationStatus.pending,
                VerificationStatus.approved,
            ):
                raise HTTPException(
                    status_code=409,
                    detail="Seller Profile already exists for this account",
                )

            # Previously rejected — allow resubmission on the same profile
            new_slug = generate_slug(data.shop_name)
            slug_taken = (
                db.query(SellerProfile)
                .filter(
                    SellerProfile.slug == new_slug,
                    SellerProfile.id != existing_profile.id,
                )
                .first()
            )
            if slug_taken:
                raise HTTPException(status_code=409, detail="Shop name already taken")

            existing_profile.shop_name = data.shop_name
            existing_profile.slug = new_slug
            existing_profile.bio = data.bio
            existing_profile.location = data.location
            existing_profile.avatar_url = data.avatar_url
            existing_profile.seller_type = data.seller_type
            existing_profile.verification_status = VerificationStatus.pending

            db.commit()
            db.refresh(existing_profile)
            return existing_profile

        # First-time application
        slug = generate_slug(data.shop_name)
        if db.query(SellerProfile).filter(SellerProfile.slug == slug).first():
            raise HTTPException(status_code=409, detail="Shop name already taken")

        seller = SellerProfile(
            user_id=current_user.id,
            shop_name=data.shop_name,
            slug=slug,
            bio=data.bio,
            location=data.location,
            avatar_url=data.avatar_url,
            seller_type=data.seller_type,
        )

        db.add(seller)
        db.commit()
        db.refresh(seller)
        return seller

    @staticmethod
    def update_profile(current_user, data, db):
        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )

        if not seller:
            raise HTTPException(
                status_code=404,
                detail="Seller profile not found",
            )

        if data.shop_name and data.shop_name != seller.shop_name:
            slug = generate_slug(data.shop_name)

            existing = (
                db.query(SellerProfile)
                .filter(
                    SellerProfile.slug == slug,
                    SellerProfile.id != seller.id,
                )
                .first()
            )

            if existing:
                raise HTTPException(
                    status_code=409,
                    detail="Shop name already taken",
                )

            seller.shop_name = data.shop_name
            seller.slug = slug

        if data.bio is not None:
            seller.bio = data.bio

        if data.location is not None:
            seller.location = data.location

        if data.avatar_url is not None:
            seller.avatar_url = data.avatar_url

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
    def seller_slug(slug, db, current_user: User | None = None):
        seller = db.query(SellerProfile).filter(SellerProfile.slug == slug).first()

        if not seller:
            raise HTTPException(status_code=404, detail="Seller Profile not found")

        seller.is_following = False

        if current_user:
            follow = (
                db.query(Follow)
                .filter(
                    Follow.buyer_id == current_user.id,
                    Follow.seller_id == seller.id,
                )
                .first()
            )

            seller.is_following = follow is not None

        return seller
