"""add_business_phone_email_to_seller_profiles

Revision ID: [auto-generated]
Revises: 14beb06e7331
Create Date: 2026-07-23 00:00:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'dbab68f3d5b3'
down_revision: Union[str, Sequence[str], None] = "14beb06e7331"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "seller_profiles", sa.Column("business_phone", sa.String(20), nullable=True)
    )
    op.add_column(
        "seller_profiles", sa.Column("business_email", sa.String(255), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("seller_profiles", "business_email")
    op.drop_column("seller_profiles", "business_phone")
