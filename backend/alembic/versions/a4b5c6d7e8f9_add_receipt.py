"""Add receipt table

Revision ID: a4b5c6d7e8f9
Revises: f3a4b5c6d7e8
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'a4b5c6d7e8f9'
down_revision: Union[str, None] = 'f3a4b5c6d7e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP TYPE IF EXISTS receipttypeenum")
    op.execute("CREATE TYPE receipttypeenum AS ENUM ('CASH', 'TAX', 'GENERAL')")

    op.create_table(
        'receipts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id'), unique=True, nullable=False),
        sa.Column('receipt_number', sa.String(50), unique=True, nullable=False),
        sa.Column('receipt_type', sa.String(20), nullable=False, server_default='GENERAL'),
        sa.Column('issued_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('total_amount', sa.Integer(), nullable=False),
        sa.Column('tax_amount', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('issuer_name', sa.String(100), nullable=True),
        sa.Column('issuer_registration_number', sa.String(20), nullable=True),
    )
    op.execute("ALTER TABLE receipts ALTER COLUMN receipt_type DROP DEFAULT")
    op.execute("ALTER TABLE receipts ALTER COLUMN receipt_type TYPE receipttypeenum USING receipt_type::receipttypeenum")
    op.execute("ALTER TABLE receipts ALTER COLUMN receipt_type SET DEFAULT 'GENERAL'::receipttypeenum")


def downgrade() -> None:
    op.drop_table('receipts')
    op.execute("DROP TYPE IF EXISTS receipttypeenum")
