"""merge_heads_rename_types_and_docs

Revision ID: 1c690b7d30ab
Revises: 10d29e7fb0f9, c948b2ec945e
Create Date: 2026-08-01 17:39:43.350587

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1c690b7d30ab'
down_revision: Union[str, Sequence[str], None] = ('10d29e7fb0f9', 'c948b2ec945e')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
