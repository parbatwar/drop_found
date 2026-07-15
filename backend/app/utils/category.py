"""
Helper functions for category-related operations.
"""

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.catalog.category import Category


def get_active_category(category_id, db: Session):
    category = (
        db.query(Category)
        .filter(
            Category.id == category_id,
            Category.is_active == True,
        )
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found.",
        )

    return category
