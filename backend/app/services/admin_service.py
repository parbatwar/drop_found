# app/services/admin_service.py
import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.seller.seller import SellerProfile  # Adjust if your profile model path varies
from app.models.user.user import User
from app.models.enums.enums import VerificationStatus
from app.schemas.seller import ReviewSellerRequest


class AdminService:
    @staticmethod
    def get_pending_sellers(db: Session):
        """
        Retrieves all pending seller requests from the data store layer.
        """
        return (
            db.query(SellerProfile)
            .filter(SellerProfile.verification_status == VerificationStatus.pending)
            .all()
        )

    @staticmethod
    def review_seller(seller_id: uuid.UUID, data: ReviewSellerRequest, db: Session):
        """
        Updates verification flags and cascades appropriate platform role permissions.
        """
        seller_profile = (
            db.query(SellerProfile).filter(SellerProfile.id == seller_id).first()
        )
        if not seller_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target merchant application registry record not found.",
            )

        seller_profile.verification_status = data.status

        applicant_user = (
            db.query(User).filter(User.id == seller_profile.user_id).first()
        )

        if applicant_user:
            if data.status == VerificationStatus.approved:
                applicant_user.role = "seller"
            elif data.status == VerificationStatus.rejected:
                applicant_user.role = "buyer"

        db.commit()
        return {"detail": f"Application effectively updated to status {data.status}."}
