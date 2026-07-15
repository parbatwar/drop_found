from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
)

from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=list[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    return CategoryService.get_categories(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_single_category(
    category_id: UUID,
    db: Session = Depends(get_db),
):
    return CategoryService.get_category(category_id, db)


@router.post(
    "/",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
):
    return CategoryService.create(category, db)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_existing_category(
    category_id: UUID,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
):
    return CategoryService.update(category_id, category, db)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_category(
    category_id: UUID,
    db: Session = Depends(get_db),
):
    CategoryService.delete(category_id, db)

    return None
