"""Add refund table and REFUNDED booking status

Revision ID: f3a4b5c6d7e8
Revises: e2f3a4b5c6d7
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

revision: str = 'f3a4b5c6d7e8'
down_revision: Union[str, None] = 'e2f3a4b5c6d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE bookingstatusenum ADD VALUE IF NOT EXISTS 'REFUNDED'")

    # Drop orphaned type if it exists from a previous partial run, then recreate
    op.execute("DROP TYPE IF EXISTS refundstatusenum")
    op.execute("CREATE TYPE refundstatusenum AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')")

    op.create_table(
        'refunds',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id'), unique=True, nullable=False),
        sa.Column('refund_amount', sa.Integer(), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('status', sa.String(20), nullable=False, server_default='PENDING'),
        sa.Column('requested_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('processed_at', sa.DateTime(), nullable=True),
    )
    op.execute("ALTER TABLE refunds ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE refunds ALTER COLUMN status TYPE refundstatusenum USING status::refundstatusenum")
    op.execute("ALTER TABLE refunds ALTER COLUMN status SET DEFAULT 'PENDING'::refundstatusenum")


def downgrade() -> None:
    op.drop_table('refunds')
    op.execute("DROP TYPE IF EXISTS refundstatusenum")
