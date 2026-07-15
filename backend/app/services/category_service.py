# app/services/category_service.py

from uuid import UUID

from fastapi import HTTPException, status
from app.utils.slug import generate_slug
from sqlalchemy.orm import Session

from app.models.catalog.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    @staticmethod
    def get_categories(db: Session):
        """Returns all active categories ordered by name."""
        return (
            db.query(Category)
            .filter(Category.is_active == True)
            .order_by(Category.name)
            .all()
        )

    @staticmethod
    def get_category(category_id: UUID, db: Session):
        """Returns a single category by id."""

        category = db.query(Category).filter(Category.id == category_id).first()

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

        return category

    @staticmethod
    def create(category_data: CategoryCreate, db: Session):
        """Creates a new category."""

        slug = generate_slug(category_data.name)

        existing = db.query(Category).filter(Category.slug == slug).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category already exists.",
            )

        category = Category(
            name=category_data.name,
            slug=slug,
            is_active=True,
        )

        db.add(category)
        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def update(
        category_id: UUID,
        category_data: CategoryUpdate,
        db: Session,
    ):
        """Updates an existing category."""

        category = db.query(Category).filter(Category.id == category_id).first()

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

        if category_data.name is not None:

            slug = generate_slug(category_data.name)

            duplicate = (
                db.query(Category)
                .filter(
                    Category.slug == slug,
                    Category.id != category_id,
                )
                .first()
            )

            if duplicate:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category already exists.",
                )

            category.name = category_data.name
            category.slug = slug

        if category_data.is_active is not None:
            category.is_active = category_data.is_active

        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def delete(category_id: UUID, db: Session):
        """Deletes a category."""

        category = db.query(Category).filter(Category.id == category_id).first()

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

        db.delete(category)
        db.commit()

        return {"detail": "Category deleted successfully."}
