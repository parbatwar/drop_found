from sqlalchemy import Column, String
from app.database import Base


class PlatformSetting(Base):
    """
    Represents a key-value pair for platform-wide settings.
    """

    __tablename__ = "platform_settings"

    key = Column(String, primary_key=True)
    value = Column(String, nullable=False)
