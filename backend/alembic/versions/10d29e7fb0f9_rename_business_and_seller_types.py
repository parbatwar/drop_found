"""rename_business_and_seller_types

Revision ID: 10d29e7fb0f9
Revises: f3a92b1c7d44
Create Date: 2026-08-01 17:36:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "10d29e7fb0f9"
down_revision: Union[str, Sequence[str], None] = "f3a92b1c7d44"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Rename enum values directly (simplest approach)
    op.execute("ALTER TYPE businesstype RENAME VALUE 'individual' TO 'unregistered'")
    op.execute("ALTER TYPE sellertype RENAME VALUE 'thrift' TO 'thrift_shop'")
    op.execute("ALTER TYPE sellertype RENAME VALUE 'retailer' TO 'retail_shop'")


def downgrade() -> None:
    # Rollback to old values
    op.execute("ALTER TYPE businesstype RENAME VALUE 'unregistered' TO 'individual'")
    op.execute("ALTER TYPE sellertype RENAME VALUE 'thrift_shop' TO 'thrift'")
    op.execute("ALTER TYPE sellertype RENAME VALUE 'retail_shop' TO 'retailer'")
