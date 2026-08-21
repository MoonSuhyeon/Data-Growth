"""콘솔이 읽는 필드가 백엔드에 실제로 있는가.

## 왜 필요한가

운영 콘솔이 `stats.now_showing_count` 를 읽고 있었다. 백엔드가 주는 이름은
`listed_count` 다 — 영화에서 숙박으로 이름을 바꾸다 만 흔적이고,
`PropertyBoardType.format` 과 같은 종류다.

**타입이 거짓말을 하면 컴파일러는 도와주지 않는다.** 화면이 응답 모양을 손으로
`interface` 에 적어 두는데, 거기 없는 필드를 `number` 라고 선언해 두면
`.toLocaleString()` 이 그대로 통과한다. 그래서 빌드도 타입체크도 조용했고,
사람이 그 화면을 열어야 터졌다.

## 왜 이 저장소에서만 이런 일이 나는가

외부 서비스 셋(forecast·content·support)은 커밋된 `openapi.json` 에서 타입을
**생성**한다(`frontend/scripts/gen-types.mjs`). 응답 모양이 바뀌면 콘솔 빌드가
깨진다.

같은 저장소 안의 예약 백엔드만 그 장치가 없다. 나란히 있으니 안 틀릴 거라고
본 것인데, 실제로 틀린 곳이 바로 여기다 — **가까이 있는 것이 더 조용히 낡는다.**

여기서는 타입 생성까지 가지 않고, 화면이 손으로 적어 둔 필드가 백엔드 스키마에
있는지만 대조한다. 값싸고, 이 종류의 사고를 정확히 잡는다.
"""
from __future__ import annotations

import os
import re
from pathlib import Path

import pytest

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_admin_stats.db")
os.environ.setdefault("JWT_SECRET", "test-secret")

FRONTEND = Path(__file__).resolve().parents[1] / "frontend"


def _declared_fields(source: str, interface: str) -> set[str]:
    """TS `interface` 본문에서 필드 이름을 뽑는다."""
    m = re.search(rf"interface\s+{interface}\s*\{{(.*?)\n\}}", source, re.S)
    assert m, f"{interface} 를 못 찾았다 — 이름이 바뀌었으면 이 테스트도 같이 고쳐야 한다"
    return set(re.findall(r"^\s*(\w+)\??\s*:", m.group(1), re.M))


def test_the_dashboard_reads_fields_that_exist():
    """화면의 `AdminStats` 와 백엔드의 `AdminStats` 가 같은 필드를 말하는가."""
    from app.schemas import AdminStats

    page = (FRONTEND / "app" / "(console)" / "admin" / "page.tsx").read_text(encoding="utf-8")
    screen = _declared_fields(page, "AdminStats")
    server = set(AdminStats.model_fields)

    missing = screen - server
    assert not missing, (
        f"화면이 없는 필드를 읽는다: {sorted(missing)}. "
        f"백엔드가 주는 것: {sorted(server)}")


def test_the_movie_era_name_is_gone():
    """`now_showing_count` 는 상영관 시절의 이름이다.

    되살아났다면 이름 바꾸기가 또 덜 끝난 것이다.
    """
    page = (FRONTEND / "app" / "(console)" / "admin" / "page.tsx").read_text(encoding="utf-8")
    body = page.split('interface AdminStats')[1] if 'interface AdminStats' in page else page
    assert "stats.now_showing_count" not in page


@pytest.mark.parametrize("field", ["total_users", "today_bookings", "today_revenue", "listed_count"])
def test_every_card_has_a_backing_field(field: str):
    """카드 네 개가 각각 실재하는 필드를 쓴다."""
    from app.schemas import AdminStats

    assert field in AdminStats.model_fields

    page = (FRONTEND / "app" / "(console)" / "admin" / "page.tsx").read_text(encoding="utf-8")
    assert f"stats.{field}" in page, f"{field} 를 화면이 안 쓴다 — 카드가 빠졌을 수 있다"
