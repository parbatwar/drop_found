# app/routes/announcement.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.announcement_service import AnnouncementService
from app.schemas.announcement import (
    AnnouncementCreate,
    AnnouncementUpdate,
    AnnouncementResponse,
)
from app.core.dependencies import get_current_user
from app.models.user.user import User

router = APIRouter(prefix="/announcements", tags=["announcements"])


# Public endpoint - get active announcements for frontend
@router.get("/active", response_model=list[AnnouncementResponse])
def get_active_announcements(db: Session = Depends(get_db)):
    return AnnouncementService.get_active_announcements(db)


# Admin endpoints
@router.get("/", response_model=list[AnnouncementResponse])
def get_all_announcements(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return AnnouncementService.get_all_announcements(db)


@router.post("/", response_model=AnnouncementResponse)
def create_announcement(
    data: AnnouncementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return AnnouncementService.create_announcement(data, db)


@router.put("/{id}", response_model=AnnouncementResponse)
def update_announcement(
    id,
    data: AnnouncementUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return AnnouncementService.update_announcement(id, data, db)


@router.delete("/{id}", status_code=204)
def delete_announcement(
    id,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return AnnouncementService.delete_announcement(id, db)
