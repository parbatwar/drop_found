from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class FollowCreate(BaseModel):
    seller_id: UUID


class FollowResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    seller_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
