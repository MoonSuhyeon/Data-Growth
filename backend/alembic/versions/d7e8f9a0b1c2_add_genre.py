"""Add genres and movie_genres tables

Revision ID: d7e8f9a0b1c2
Revises: c6d7e8f9a0b1
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'd7e8f9a0b1c2'
down_revision: Union[str, None] = 'c6d7e8f9a0b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'genres',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(50), unique=True, nullable=False),
    )

    op.create_table(
        'movie_genres',
        sa.Column('movie_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('movies.id'), primary_key=True),
        sa.Column('genre_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('genres.id'), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table('movie_genres')
    op.drop_table('genres')
