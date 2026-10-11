"""lowercase existing emails

Revision ID: 7de0e5e0dcba
Revises: 1a792207891e
Create Date: 2026-10-11 20:17:17.172403

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7de0e5e0dcba'
down_revision: Union[str, Sequence[str], None] = '1a792207891e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE users SET email = lower(email)")



def downgrade() -> None:
    # The original casing can't be recovered, so there is nothing to undo.
    pass