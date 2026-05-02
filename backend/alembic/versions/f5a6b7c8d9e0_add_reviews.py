"""Add reviews tables (4단계 Module 1)

Revision ID: f5a6b7c8d9e0
Revises: e4f5a6b7c8d9
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'f5a6b7c8d9e0'
down_revision: Union[str, None] = 'e4f5a6b7c8d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'reviews',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('movie_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('movies.id'), nullable=False),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=False),  # 1-5
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('status_code', sa.String(30), sa.ForeignKey('review_status_codes.code'), nullable=False, server_default='ACTIVE'),
        sa.Column('is_spoiler', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('helpful_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.UniqueConstraint('user_id', 'movie_id', name='uq_user_movie_review'),
    )
    op.create_index('ix_reviews_movie_id', 'reviews', ['movie_id'])
    op.create_index('ix_reviews_user_id', 'reviews', ['user_id'])

    op.create_table(
        'review_helpfuls',
        sa.Column('review_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('reviews.id'), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )

    op.create_table(
        'review_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('review_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('reviews.id'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('reason', sa.String(200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.UniqueConstraint('review_id', 'user_id', name='uq_review_report'),
    )

    # Add rating stats to movies
    op.add_column('movies', sa.Column('avg_rating', sa.Numeric(3, 2), nullable=True))
    op.add_column('movies', sa.Column('review_count', sa.Integer(), nullable=True, server_default='0'))


def downgrade() -> None:
    op.drop_column('movies', 'review_count')
    op.drop_column('movies', 'avg_rating')
    op.drop_table('review_reports')
    op.drop_table('review_helpfuls')
    op.drop_index('ix_reviews_user_id', table_name='reviews')
    op.drop_index('ix_reviews_movie_id', table_name='reviews')
    op.drop_table('reviews')
