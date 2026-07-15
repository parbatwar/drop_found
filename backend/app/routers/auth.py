from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.user.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(userdata: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user. Validates that the email is unique and hashes the password before saving.
    """

    existing_user = db.query(User).filter(User.email == userdata.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=userdata.email,
        password_hash=hash_password(userdata.password),
        first_name=userdata.first_name,
        last_name=userdata.last_name,
        phone=userdata.phone,
    )
    db.add(new_user)        # add to session
    db.commit()             # save to database
    db.refresh(new_user)    # refresh to get generated fields like id, created_at

    token = create_access_token(user_id=str(new_user.id), role=new_user.role.value)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
def login(userdata: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates a user by verifying the email and password. Returns a JWT token if successful.
    """

    user = db.query(User).filter(User.email == userdata.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(userdata.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user_id=str(user.id), role=user.role.value)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    """
    Returns the current authenticated user's information. Requires a valid JWT token.
    """

    return current_user


"""
response_model=UserResponse just means — 
"when sending the response, use this schema as the shape".

current_user — variable name you use inside the function
User — type hint, it's a User object
Depends(get_current_user) — tells FastAPI "before running this function, 
        run get_current_user first and pass its return value here"
"""
