# backend/app/services/auth_service.py
import secrets
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user.user import User
from app.models.user.email_verification import EmailVerification

# from app.core.email import send_verification_email  # ❌ Commented out for Phase 2

TOKEN_EXPIRY_HOURS = 24
RESEND_COOLDOWN_SECONDS = 60


class AuthService:

    @staticmethod
    def create_and_send_verification(user: User, db: Session):
        """⏸️ PHASE 2 - Will be re-enabled with email verification"""
        # TODO: Re-enable when email service is ready
        print(f"[AuthService] ⏸️ Email verification skipped for {user.email} (Phase 2)")
        return

        # token = secrets.token_urlsafe(32)
        # record = EmailVerification(
        #     user_id=user.id,
        #     token=token,
        #     expires_at=datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS),
        # )
        # db.add(record)
        # db.commit()
        # send_verification_email(user.email, token, user.first_name)

    @staticmethod
    def verify_email(token: str, db: Session):
        """⏸️ PHASE 2 - Will be re-enabled with email verification"""
        raise HTTPException(
            status_code=400,
            detail="Email verification is temporarily disabled. Please use Google OAuth.",
        )

    @staticmethod
    def resend_verification(current_user: User, db: Session):
        """⏸️ PHASE 2 - Will be re-enabled with email verification"""
        raise HTTPException(
            status_code=400,
            detail="Email verification is temporarily disabled. Please use Google OAuth.",
        )
