"""Add guest user support

Revision ID: d1e2f3a4b5c6
Revises: c9d2e4f1b830
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'd1e2f3a4b5c6'
down_revision: Union[str, None] = 'c9d2e4f1b830'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('users', 'email', nullable=True)
    op.alter_column('users', 'hashed_password', nullable=True)
    op.add_column('users', sa.Column('is_guest', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('guest_expires_at', sa.DateTime(), nullable=True))
    op.create_index('ix_users_is_guest', 'users', ['is_guest'])


def downgrade() -> None:
    op.drop_index('ix_users_is_guest', table_name='users')
    op.drop_column('users', 'guest_expires_at')
    op.drop_column('users', 'is_guest')
    op.alter_column('users', 'hashed_password', nullable=False)
    op.alter_column('users', 'email', nullable=False)
