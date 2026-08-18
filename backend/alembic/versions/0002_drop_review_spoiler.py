"""리뷰의 스포일러 표시를 걷어낸다.

영화 예매에서 숙박으로 도메인을 옮길 때 남은 잔재다. 숙소 리뷰에 "스포일러"는
뜻이 없고, 화면은 실제로 그 배지를 그리고 있었다.

**베이스라인을 고치지 않고 마이그레이션을 더한다.** ``0001`` 은 이미 배포된
스냅샷이고, 그걸 손대면 이미 마이그레이션한 쪽과 안 한 쪽의 스키마가 갈린다.
지운 것도 이력에 남는 편이 낫다 — 왜 없어졌는지 물을 자리가 생긴다.

되돌릴 수 있게 ``downgrade`` 를 둔다. 다만 **값은 되돌아오지 않는다.** 컬럼을
되살릴 수는 있어도 지워진 플래그는 복구할 수 없으므로 기본값 false 로 채운다.
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0002_drop_review_spoiler"
down_revision = "0001_lodging_baseline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column("reviews", "is_spoiler")


def downgrade() -> None:
    op.add_column(
        "reviews",
        sa.Column("is_spoiler", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    # 서버 기본값은 되살리는 동안만 필요하다. 남겨 두면 모델에 없는 기본값이
    # DB 에만 있게 되고, 그 불일치가 나중에 헷갈린다.
    op.alter_column("reviews", "is_spoiler", server_default=None)
