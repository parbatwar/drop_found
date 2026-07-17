# app/services/announcement_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.social.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate


class AnnouncementService:

    @staticmethod
    def get_active_announcements(db: Session):
        """Get all active announcements for the frontend"""
        return (
            db.query(Announcement)
            .filter(Announcement.is_active == True)
            .order_by(Announcement.display_order)
            .all()
        )

    @staticmethod
    def get_all_announcements(db: Session):
        """Get all announcements for admin"""
        return db.query(Announcement).order_by(Announcement.display_order).all()

    @staticmethod
    def create_announcement(data: AnnouncementCreate, db: Session):
        announcement = Announcement(**data.model_dump())
        db.add(announcement)
        db.commit()
        db.refresh(announcement)
        return announcement

    @staticmethod
    def update_announcement(id, data: AnnouncementUpdate, db: Session):
        announcement = db.query(Announcement).filter(Announcement.id == id).first()
        if not announcement:
            raise HTTPException(status_code=404, detail="Announcement not found")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(announcement, key, value)

        db.commit()
        db.refresh(announcement)
        return announcement

    @staticmethod
    def delete_announcement(id, db: Session):
        announcement = db.query(Announcement).filter(Announcement.id == id).first()
        if not announcement:
            raise HTTPException(status_code=404, detail="Announcement not found")
        db.delete(announcement)
        db.commit()
        return None
