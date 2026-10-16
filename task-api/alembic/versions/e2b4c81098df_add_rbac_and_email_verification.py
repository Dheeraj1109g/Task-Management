"""add rbac and email verification fields

Revision ID: e2b4c81098df
Revises: f859b40bfb56
Create Date: 2026-10-16 22:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e2b4c81098df'
down_revision: Union[str, Sequence[str], None] = 'f859b40bfb56'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add columns to users table
    op.add_column('users', sa.Column('role', sa.String(length=32), server_default='member', nullable=False))
    op.add_column('users', sa.Column('is_verified', sa.Boolean(), server_default='false', nullable=False))
    op.add_column('users', sa.Column('verification_token', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('verification_token_expires_at', sa.DateTime(timezone=True), nullable=True))
    op.create_index('ix_users_verification_token', 'users', ['verification_token'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_users_verification_token', table_name='users')
    op.drop_column('users', 'verification_token_expires_at')
    op.drop_column('users', 'verification_token')
    op.drop_column('users', 'is_verified')
    op.drop_column('users', 'role')
