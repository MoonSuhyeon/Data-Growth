"""Add audience_types table and audience_breakdown to bookings

Revision ID: e2f3a4b5c6d7
Revises: d1e2f3a4b5c6
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import uuid

revision: str = 'e2f3a4b5c6d7'
down_revision: Union[str, None] = 'd1e2f3a4b5c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'audience_types',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('code', sa.String(20), unique=True, nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('discount_amount', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )

    op.add_column('bookings', sa.Column('audience_breakdown', sa.JSON(), nullable=True))

    # 시드 데이터
    seed = [
        ('ADULT',    '성인',   0),
        ('TEEN',     '청소년', -2000),
        ('SENIOR',   '경로',   -3000),
        ('DISABLED', '우대',   -3000),
    ]
    for code, name, discount in seed:
        op.execute(
            f"INSERT INTO audience_types (id, code, name, discount_amount, is_active, created_at) "
            f"VALUES ('{uuid.uuid4()}', '{code}', '{name}', {discount}, true, now())"
        )


def downgrade() -> None:
    op.drop_column('bookings', 'audience_breakdown')
    op.drop_table('audience_types')
