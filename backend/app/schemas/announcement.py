# app/schemas/announcement.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class AnnouncementCreate(BaseModel):
    content: str
    is_active: bool = True
    display_order: int = 0


class AnnouncementUpdate(BaseModel):
    content: str | None = None
    is_active: bool | None = None
    display_order: int | None = None


class AnnouncementResponse(BaseModel):
    id: UUID
    content: str
    is_active: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
