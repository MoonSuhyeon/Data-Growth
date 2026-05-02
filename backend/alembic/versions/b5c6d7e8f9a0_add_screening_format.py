"""Add screening_formats and movie_formats tables

Revision ID: b5c6d7e8f9a0
Revises: a4b5c6d7e8f9
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'b5c6d7e8f9a0'
down_revision: Union[str, None] = 'a4b5c6d7e8f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'screening_formats',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('code', sa.String(20), unique=True, nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('extra_charge', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('description', sa.Text(), nullable=True),
    )

    op.create_table(
        'movie_formats',
        sa.Column('movie_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('movies.id'), primary_key=True),
        sa.Column('format_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('screening_formats.id'), primary_key=True),
    )

    op.add_column('screenings', sa.Column('format_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('screening_formats.id'), nullable=True))


def downgrade() -> None:
    op.drop_column('screenings', 'format_id')
    op.drop_table('movie_formats')
    op.drop_table('screening_formats')
