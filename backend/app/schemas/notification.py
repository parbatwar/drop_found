from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    notification_type: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationUpdate(BaseModel):
    is_read: bool
