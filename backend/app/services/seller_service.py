# backend/app/services/seller_service.py
from fastapi import HTTPException
from app.models.catalog.listing import Listing
from app.models.seller.seller import SellerProfile
from app.models.enums.enums import UserRole, VerificationStatus, BusinessType
from app.models.social.review import Review
from app.services.review_service import ReviewService
from app.utils.seller import get_verified_seller
from app.utils.slug import generate_slug
from app.schemas.seller import SellerVerificationStatusResponse

from app.models.user.user import User
from app.models.seller.follow import Follow
from datetime import datetime


class SellerService:

    @staticmethod
    def apply_for_seller(data, current_user, db):
        """
        Handles the application for a user to become a seller.
        ✅ Stores business phone and email during application.
        ✅ Stores documents in both JSON and individual fields.
        """
        existing_profile = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )

        # ✅ Check if business_phone already exists (unique constraint)
        existing_phone = (
            db.query(SellerProfile)
            .filter(SellerProfile.business_phone == data.business_phone)
            .first()
        )

        if existing_phone:
            raise HTTPException(
                status_code=409,
                detail="This business phone number is already registered to another shop",
            )

        # ✅ Check if business_email already exists (if provided)
        if data.business_email:
            existing_email = (
                db.query(SellerProfile)
                .filter(SellerProfile.business_email == data.business_email)
                .first()
            )

            if existing_email:
                raise HTTPException(
                    status_code=409,
                    detail="This business email is already registered to another shop",
                )

        # ✅ Build documents dictionary
        documents = {}
        if data.identity_front_url:
            documents["identity_front"] = data.identity_front_url
        if data.identity_back_url:
            documents["identity_back"] = data.identity_back_url
        if data.pan_certificate_url:
            documents["pan_certificate"] = data.pan_certificate_url
        if data.registration_certificate_url:
            documents["registration_certificate"] = data.registration_certificate_url

        if existing_profile:
            if existing_profile.verification_status in (
                VerificationStatus.pending,
                VerificationStatus.approved,
            ):
                raise HTTPException(
                    status_code=409,
                    detail="Seller Profile already exists for this account",
                )

            # Previously rejected — allow resubmission
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

            # ✅ Update basic info
            existing_profile.shop_name = data.shop_name
            existing_profile.slug = new_slug
            existing_profile.bio = data.bio
            existing_profile.location = data.location
            existing_profile.avatar_url = data.avatar_url
            existing_profile.seller_type = data.seller_type
            existing_profile.verification_status = VerificationStatus.pending
            existing_profile.business_type = data.business_type
            existing_profile.applied_as_business = (
                data.business_type == BusinessType.registered
            )

            # ✅ Update business contact fields
            existing_profile.business_phone = data.business_phone
            existing_profile.business_email = data.business_email

            # ✅ Store documents in JSON field
            existing_profile.verification_documents = documents if documents else None

            # ✅ ALSO store in individual fields for easy access
            existing_profile.identity_front_url = data.identity_front_url
            existing_profile.identity_back_url = data.identity_back_url
            existing_profile.pan_certificate_url = data.pan_certificate_url
            existing_profile.registration_certificate_url = (
                data.registration_certificate_url
            )

            if data.business_registration_number:
                existing_profile.business_registration_number = (
                    data.business_registration_number
                )
            if data.pan_number:
                existing_profile.pan_number = data.pan_number

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
            verification_status=VerificationStatus.pending,
            business_type=data.business_type,
            applied_as_business=data.business_type == BusinessType.registered,
            verification_documents=documents if documents else None,
            business_registration_number=data.business_registration_number,
            pan_number=data.pan_number,
            # ✅ New fields
            business_phone=data.business_phone,
            business_email=data.business_email,
            # ✅ Store documents in individual fields
            identity_front_url=data.identity_front_url,
            identity_back_url=data.identity_back_url,
            pan_certificate_url=data.pan_certificate_url,
            registration_certificate_url=data.registration_certificate_url,
            is_identity_verified=False,
            is_business_verified=False,
        )

        db.add(seller)
        db.commit()
        db.refresh(seller)
        return seller

    @staticmethod
    def update_seller_profile(current_user, data, db):
        """Update the current user's seller profile."""
        seller = get_verified_seller(current_user, db)

        # ✅ Update shop name
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

        # ✅ Update bio
        if data.bio is not None:
            seller.bio = data.bio

        # ✅ Update location
        if data.location is not None:
            seller.location = data.location

        # ✅ Update avatar
        if data.avatar_url is not None:
            seller.avatar_url = data.avatar_url

        # ✅ Update business phone (check uniqueness)
        if data.business_phone is not None:
            existing_phone = (
                db.query(SellerProfile)
                .filter(
                    SellerProfile.business_phone == data.business_phone,
                    SellerProfile.id != seller.id,
                )
                .first()
            )
            if existing_phone:
                raise HTTPException(
                    status_code=409,
                    detail="This business phone number is already registered to another shop",
                )
            seller.business_phone = data.business_phone

        # ✅ Update business email (check uniqueness)
        if data.business_email is not None:
            existing_email = (
                db.query(SellerProfile)
                .filter(
                    SellerProfile.business_email == data.business_email,
                    SellerProfile.id != seller.id,
                )
                .first()
            )
            if existing_email:
                raise HTTPException(
                    status_code=409,
                    detail="This business email is already registered to another shop",
                )
            seller.business_email = data.business_email

        db.commit()
        db.refresh(seller)
        return seller

    @staticmethod
    def get_all_sellers(db):
        sellers = (
            db.query(SellerProfile)
            .filter(SellerProfile.verification_status == VerificationStatus.approved)
            .all()
        )

        for seller in sellers:
            followers_count = (
                db.query(Follow).filter(Follow.seller_id == seller.id).count()
            )
            rating_stats = ReviewService.get_seller_rating_stats(seller.id, db)

            seller.followers_count = followers_count
            seller.average_rating = rating_stats["average_rating"]
            seller.total_reviews = rating_stats["total_reviews"]

        return sellers

    @staticmethod
    def get_my_seller_profile(current_user, db):
        """Get the current user's seller profile with stats."""
        seller = get_verified_seller(current_user, db)

        followers_count = db.query(Follow).filter(Follow.seller_id == seller.id).count()
        rating_stats = ReviewService.get_seller_rating_stats(seller.id, db)

        seller.followers_count = followers_count
        seller.average_rating = rating_stats["average_rating"]
        seller.total_reviews = rating_stats["total_reviews"]

        return seller

    @staticmethod
    def get_seller_profile(slug, db, current_user: User | None = None):
        """
        Fetches a seller profile by its slug for public viewing.
        """
        seller = db.query(SellerProfile).filter(SellerProfile.slug == slug).first()

        if not seller:
            raise HTTPException(status_code=404, detail="Seller Profile not found")

        followers_count = db.query(Follow).filter(Follow.seller_id == seller.id).count()
        rating_stats = ReviewService.get_seller_rating_stats(seller.id, db)

        seller.followers_count = followers_count
        seller.average_rating = rating_stats["average_rating"]
        seller.total_reviews = rating_stats["total_reviews"]

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

    @staticmethod
    def get_seller_verification_status(current_user, db):
        """Get verification status for the current seller"""
        seller = (
            db.query(SellerProfile)
            .filter(SellerProfile.user_id == current_user.id)
            .first()
        )

        if not seller:
            return {
                "has_applied": False,
                "can_sell": False,
                "verification_status": None,
                "is_identity_verified": False,
                "is_business_verified": False,
                "business_type": None,
                "message": "You haven't applied as a seller yet.",
            }

        # ✅ Seller can only sell if identity is verified AND status is approved
        can_sell = (
            seller.is_identity_verified
            and seller.verification_status == VerificationStatus.approved
        )

        # ✅ Build message based on status
        if seller.verification_status == VerificationStatus.pending:
            message = (
                "Your application is under review. Please wait for admin approval."
            )
        elif (
            seller.verification_status == VerificationStatus.approved
            and seller.is_identity_verified
        ):
            message = "Your account is verified and ready to sell!"
        elif (
            seller.verification_status == VerificationStatus.approved
            and not seller.is_identity_verified
        ):
            message = "Your account is approved but identity verification is pending."
        elif seller.verification_status == VerificationStatus.rejected:
            message = (
                "Your application was rejected. Please reapply with correct documents."
            )
        else:
            message = None

        return {
            "has_applied": True,
            "can_sell": can_sell,
            "verification_status": seller.verification_status,
            "is_identity_verified": seller.is_identity_verified,
            "is_business_verified": seller.is_business_verified,
            "business_type": seller.business_type,
            "message": message,
        }
