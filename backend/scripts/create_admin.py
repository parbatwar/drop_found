# scripts/create_admin.py
import getpass
from sqlalchemy import select

from app.database import get_db
from app.models.user.user import User, UserRole
from app.core.security import hash_password


def create_admin(email: str, password: str, first_name: str, last_name: str):
    db = next(get_db())
    try:
        existing = db.execute(
            select(User).where(User.email == email)
        ).scalar_one_or_none()
        if existing:
            print(f"User with email {email} already exists (role={existing.role}).")
            return

        admin = User(
            email=email,
            password_hash=hash_password(password),
            first_name=first_name,
            last_name=last_name,
            role=UserRole.admin,
            is_active=True,
            is_email_verified=True,
        )
        db.add(admin)
        db.commit()
        print(f"Admin created: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    email = input("Email: ")
    first_name = input("First name: ")
    last_name = input("Last name: ")
    password = getpass.getpass("Password: ")

    create_admin(email, password, first_name, last_name)
