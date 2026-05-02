"""Add seat_change_histories table

Revision ID: f9a0b1c2d3e4
Revises: e8f9a0b1c2d3
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'f9a0b1c2d3e4'
down_revision: Union[str, None] = 'e8f9a0b1c2d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'seat_change_histories',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=False),
        sa.Column('old_seat_ids', sa.JSON(), nullable=False),
        sa.Column('new_seat_ids', sa.JSON(), nullable=False),
        sa.Column('changed_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('reason', sa.Text(), nullable=True),
    )

    op.create_index('ix_seat_change_histories_booking_id', 'seat_change_histories', ['booking_id'])


def downgrade() -> None:
    op.drop_index('ix_seat_change_histories_booking_id', table_name='seat_change_histories')
    op.drop_table('seat_change_histories')
