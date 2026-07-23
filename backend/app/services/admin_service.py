# backend/app/services/admin_service.py
import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.seller.seller import SellerProfile
from app.models.user.user import User
from app.models.enums.enums import VerificationStatus
from app.schemas.seller import ReviewSellerRequest
from datetime import datetime


class AdminService:
    @staticmethod
    def get_pending_sellers(db: Session):
        """
        Retrieves all pending seller requests with verification details.
        """
        return (
            db.query(SellerProfile)
            .filter(SellerProfile.verification_status == VerificationStatus.pending)
            .all()
        )

    @staticmethod
    def review_seller(seller_id: uuid.UUID, data: ReviewSellerRequest, db: Session):
        """
        Updates verification flags with granular control.
        Can approve identity and business separately.
        """
        seller_profile = (
            db.query(SellerProfile).filter(SellerProfile.id == seller_id).first()
        )
        if not seller_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Seller not found.",
            )

        # ✅ Update overall status
        seller_profile.verification_status = data.status

        # ✅ Update identity verification
        if data.verify_identity and data.status == VerificationStatus.approved:
            seller_profile.is_identity_verified = True
            seller_profile.identity_verified_at = datetime.utcnow()
        elif data.status == VerificationStatus.rejected:
            seller_profile.is_identity_verified = False
            seller_profile.is_business_verified = False

        # ✅ Update business verification (only if business documents exist)
        if data.verify_business and data.status == VerificationStatus.approved:
            # Check if seller has business documents
            if (
                seller_profile.business_type == BusinessType.registered
                or seller_profile.applied_as_business
            ):
                seller_profile.is_business_verified = True
                seller_profile.business_verified_at = datetime.utcnow()

        # ✅ Update user role based on verification
        applicant_user = (
            db.query(User).filter(User.id == seller_profile.user_id).first()
        )

        if applicant_user:
            if (
                data.status == VerificationStatus.approved
                and seller_profile.is_identity_verified
            ):
                applicant_user.role = "seller"
            elif data.status == VerificationStatus.rejected:
                applicant_user.role = "buyer"

        db.commit()

        return {
            "detail": f"Application updated to status {data.status.value}.",
            "is_identity_verified": seller_profile.is_identity_verified,
            "is_business_verified": seller_profile.is_business_verified,
        }
