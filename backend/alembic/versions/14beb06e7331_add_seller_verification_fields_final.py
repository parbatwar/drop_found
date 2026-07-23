# backend/alembic/versions/14beb06e7331_add_seller_verification_fields_final.py
"""add_seller_verification_fields_final

Revision ID: 14beb06e7331
Revises: 336900b10e75
Create Date: 2026-07-23 00:00:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "14beb06e7331"
down_revision: Union[str, Sequence[str], None] = "f3a92b1c7d44"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ✅ All columns already exist in the database
    # This migration is just a marker
    pass


def downgrade() -> None:
    pass
