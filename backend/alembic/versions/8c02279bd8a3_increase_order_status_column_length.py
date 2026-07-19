"""increase_order_status_column_length

Revision ID: 8c02279bd8a3
Revises: ba36a01bdfef
Create Date: 2026-07-19 10:07:50.637118

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "8c02279bd8a3"
down_revision: Union[str, Sequence[str], None] = "ba36a01bdfef"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "orders",
        "status",
        existing_type=sa.VARCHAR(length=9),
        type_=sa.VARCHAR(length=50),
        existing_nullable=False,
    )


def downgrade():
    op.alter_column(
        "orders",
        "status",
        existing_type=sa.VARCHAR(length=50),
        type_=sa.VARCHAR(length=9),
        existing_nullable=False,
    )
