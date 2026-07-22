# backend/app/services/google_auth_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from authlib.integrations.requests_client import OAuth2Session
import os
import httpx
from app.models.user.user import User
from app.core.security import create_access_token, hash_password
import secrets
import string


class GoogleAuthService:

    @staticmethod
    def get_oauth_client():
        """Get OAuth2 client with Google credentials"""
        return OAuth2Session(
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
            redirect_uri=os.getenv("GOOGLE_REDIRECT_URI"),
            scope="email profile",
        )

    @staticmethod
    def get_authorization_url():
        """Get Google OAuth authorization URL"""
        client = GoogleAuthService.get_oauth_client()

        # ✅ Generate a random state for CSRF protection
        state = secrets.token_urlsafe(32)

        auth_url, state = client.create_authorization_url(
            "https://accounts.google.com/o/oauth2/auth",
            state=state,
        )
        return auth_url, state

    @staticmethod
    async def handle_callback(code: str, db: Session):
        """Handle Google OAuth callback"""
        client = GoogleAuthService.get_oauth_client()

        try:
            # ✅ Get redirect URI from env
            redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

            # Get token
            token = client.fetch_token(
                "https://oauth2.googleapis.com/token",
                authorization_response=f"{redirect_uri}?code={code}",
            )

            # Get user info from Google
            async with httpx.AsyncClient() as http_client:
                response = await http_client.get(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    headers={"Authorization": f"Bearer {token['access_token']}"},
                )
                user_info = response.json()

            email = user_info.get("email")
            first_name = user_info.get("given_name", "")
            last_name = user_info.get("family_name", "")
            google_id = user_info.get("id")

            if not email:
                raise HTTPException(400, "No email from Google")

            if not first_name or len(first_name) < 2:
                first_name = "User"

            if not last_name:
                last_name = ""

            # Check if user exists
            user = db.query(User).filter(User.email == email).first()

            if not user:
                # Create new user
                user = User(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    phone=None,
                    is_email_verified=True,
                    is_active=True,
                    role="buyer",
                    password_hash=hash_password(
                        secrets.token_urlsafe(32)
                    ),  # Random password
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            # Create access token
            access_token = create_access_token(
                user_id=str(user.id), role=user.role.value
            )

            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                    "is_email_verified": user.is_email_verified,
                },
            }

        except Exception as e:
            print(f"[Google OAuth] Error: {e}")
            raise HTTPException(
                status_code=400, detail=f"Google authentication failed: {str(e)}"
            )
