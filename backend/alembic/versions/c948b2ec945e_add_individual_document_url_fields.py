"""add_individual_document_url_fields

Revision ID: c948b2ec945e
Revises: dbab68f3d5b3
Create Date: 2026-07-23 00:00:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "c948b2ec945e"  # ✅ Use the actual ID from the filename
down_revision: Union[str, Sequence[str], None] = "dbab68f3d5b3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ✅ Add individual document URL columns
    op.add_column(
        "seller_profiles",
        sa.Column("identity_front_url", sa.String(500), nullable=True),
    )
    op.add_column(
        "seller_profiles", sa.Column("identity_back_url", sa.String(500), nullable=True)
    )
    op.add_column(
        "seller_profiles",
        sa.Column("pan_certificate_url", sa.String(500), nullable=True),
    )
    op.add_column(
        "seller_profiles",
        sa.Column("registration_certificate_url", sa.String(500), nullable=True),
    )
    op.add_column(
        "seller_profiles",
        sa.Column("business_address_proof", sa.String(500), nullable=True),
    )


def downgrade() -> None:
    # ✅ Remove columns (if needed)
    op.drop_column("seller_profiles", "business_address_proof")
    op.drop_column("seller_profiles", "registration_certificate_url")
    op.drop_column("seller_profiles", "pan_certificate_url")
    op.drop_column("seller_profiles", "identity_back_url")
    op.drop_column("seller_profiles", "identity_front_url")
