import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.user.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.google.google_auth_service import GoogleAuthService

# from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

# @router.post("/register")
# def register(userdata: UserCreate, db: Session = Depends(get_db)):
#     """
#     Registers a new user. Validates email uniqueness and sends verification email.
#     """
#     existing_user = db.query(User).filter(User.email == userdata.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     new_user = User(
#         email=userdata.email,
#         password_hash=hash_password(userdata.password),
#         first_name=userdata.first_name,
#         last_name=userdata.last_name,
#         phone=userdata.phone,
#         is_email_verified=False,
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     # Send verification email
#     AuthService.create_and_send_verification(new_user, db)

#     return {
#         "message": "User registered successfully. Please check your email to verify your account.",
#         "user": {
#             "id": new_user.id,
#             "email": new_user.email,
#             "first_name": new_user.first_name,
#             "last_name": new_user.last_name,
#             "role": new_user.role,
#             "is_email_verified": new_user.is_email_verified,
#         },
#     }


@router.post("/login")
def login(userdata: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates a user by verifying email and password. Returns JWT token.
    """
    user = db.query(User).filter(User.email == userdata.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(userdata.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_email_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified. Please check your inbox and verify your email address.",
        )

    token = create_access_token(user_id=str(user.id), role=user.role.value)
    return {
        "access_token": token,
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


@router.get("/me", response_model=UserResponse)
def me(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns current authenticated user's information.
    """
    return current_user


@router.get("/google/login")
def google_login():
    """Redirect to Google OAuth login"""
    auth_url, state = GoogleAuthService.get_authorization_url()
    return {"auth_url": auth_url}


@router.get("/google/callback")
async def google_callback(
    code: str,
    db: Session = Depends(get_db),
):
    """Google OAuth callback endpoint that redirects to frontend"""
    # Get the token and user data from your service
    result = await GoogleAuthService.handle_callback(code, db)

    access_token = result["access_token"]
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Redirect user's browser back to the frontend with the token
    return RedirectResponse(url=f"{frontend_url}/?token={access_token}")


# # Verify email endpoint
# @router.get("/verify-email")
# def verify_email(
#     token: str,
#     db: Session = Depends(get_db),
# ):
#     """
#     Verify user's email address using the token sent via email.
#     """
#     return AuthService.verify_email(token, db)


# Resend verification email
# @router.post("/resend-verification")
# def resend_verification(
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db),
# ):
#     """
#     Resend verification email to the current user.
#     Rate-limited to 1 request per minute.
#     """
#     return AuthService.resend_verification(current_user, db)


# @router.post("/check-verification")
# def check_verification(
#     email: str,
#     db: Session = Depends(get_db),
# ):
#     """
#     Check if a user's email is verified (without logging in).
#     Useful for frontend to check status before showing login error.
#     """
#     user = db.query(User).filter(User.email == email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     return {
#         "email": user.email,
#         "is_email_verified": user.is_email_verified,
#         "message": "Email verified" if user.is_email_verified else "Email not verified",
#     }
