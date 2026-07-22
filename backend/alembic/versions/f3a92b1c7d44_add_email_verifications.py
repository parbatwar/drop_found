"""add email verifications table

Revision ID: f3a92b1c7d44
Revises: 8c02279bd8a3
Create Date: 2026-07-22 00:00:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "f3a92b1c7d44"
down_revision: Union[str, Sequence[str], None] = "8c02279bd8a3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "email_verifications",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token"),
    )
    op.create_index("ix_email_verifications_token", "email_verifications", ["token"])


def downgrade() -> None:
    op.drop_index("ix_email_verifications_token", table_name="email_verifications")
    op.drop_table("email_verifications")
