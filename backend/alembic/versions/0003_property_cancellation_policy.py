"""숙소가 취소 정책을 가리키게 한다.

환불 계산이 상담 에이전트에만 있던 것을 이 서비스로 옮기면서(`app/refund_policy.py`)
정책이 하나뿐이었다. 모든 숙소에 같은 구간이 적용됐다는 뜻이다.

실제로는 갈린다 — 성수기 펜션과 도심 호텔의 취소 규정이 같을 이유가 없다.
그래서 숙소가 코드를 가리키게 한다.

## 왜 테이블이 아니라 코드인가

정책은 **구간과 비율**이고, 그건 코드가 해석하는 규칙이다. 테이블에 넣으면
JSON 컬럼에 구간을 담게 되는데 그러면 잘못된 구간(겹치거나 순서가 뒤집힌)을
DB 가 막지 못한다. 지금 정책은 셋뿐이고, 늘어나면 그때 테이블로 옮긴다.

## `nullable=True` 인 이유

**기본값이 있는 것과 정책이 하나뿐인 것은 다르다.** 새 숙소를 만들 때마다
정책을 고르라고 강요하면 등록이 막히고, 그렇다고 없는 채로 환불을 계산할 수도
없다. 비어 있으면 `STANDARD` 로 보되, 응답이 어느 정책을 적용했는지 밝힌다.

이미 있는 숙소를 일괄로 `STANDARD` 로 채우지 않는 것도 같은 이유다. 채우면
"정하지 않았다" 와 "표준을 골랐다" 가 구분되지 않는다.
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0003_property_cancellation_policy"
down_revision = "0002_drop_review_spoiler"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "properties",
        sa.Column("cancellation_policy", sa.String(length=20), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("properties", "cancellation_policy")
