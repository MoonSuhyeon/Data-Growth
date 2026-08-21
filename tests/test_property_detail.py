"""숙소 상세 조회 — **화면에서 숙소를 눌러도 안 열리던 이유.**

세 가지가 한 함수에 겹쳐 있었다.

1. **관계 이름이 영화 시절 그대로였다.** `PropertyBoardType.format` 을 참조했는데
   모델의 관계 이름은 `board_type` 이다. 그래서 **존재하는 숙소도 500** 이었다.
   목록은 이 관계를 안 타서 멀쩡했고, 그래서 "목록은 되는데 상세만 안 된다" 는
   모양이 됐다.

2. **없는 숙소에 `return None` 이었다.** 응답 모델이 지정돼 있으니 FastAPI 가
   `None` 을 그 모양으로 직렬화하려다 실패해서, 404 가 아니라 **500** 이 나갔다.

3. **UUID 가 아닌 문자열에 `ValueError`.** 주소창에 아무 문자열이나 넣는 것만으로
   500 이 났다. 그건 서버 문제가 아니라 없는 주소다.

화면은 이 셋을 전부 `.catch(() => setProperty(null))` 로 받아 "숙소를 찾을 수
없습니다" 로 그렸다. **서버가 터진 것과 없는 숙소가 구분되지 않았다** — 그래서
버그가 오래 살아남았다.
"""
from __future__ import annotations

import os

import pytest

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_property_detail.db")
os.environ.setdefault("JWT_SECRET", "test-secret")


# ─────────────────────────────── 1. 관계 이름 (모델과 라우터가 같은 말을 쓰는가)
def test_the_board_type_relationship_is_named_board_type():
    """이름을 바꾸다 만 흔적이 라우터에 남아 있었다.

    HTTP 를 태우지 않고도 잡을 수 있는 종류라 여기서 먼저 막는다 — 시드를 만드는
    비용 없이 매번 돈다.
    """
    from app.models.base import PropertyBoardType

    assert hasattr(PropertyBoardType, "board_type")
    assert not hasattr(PropertyBoardType, "format"), (
        "`format` 은 영화 상영관 시절의 이름이다 — 되살아났다면 라우터도 같이 되살아났을 것이다")


def test_the_router_does_not_reference_the_old_relationship_name():
    """소스를 읽어서 확인한다.

    `selectinload(PropertyBoardType.format)` 은 **불러오는 시점이 아니라 요청이
    들어온 시점에** 터진다. 그래서 import 만으로는 안 잡히고, 실제로 그 코드가
    남아 있는지 글자로 봐야 한다.
    """
    from pathlib import Path

    import app.api.v1.properties as mod

    src = Path(mod.__file__).read_text(encoding="utf-8")
    assert "PropertyBoardType.format" not in src
    assert "PropertyBoardType.board_type" in src


# ─────────────────────────────── 2·3. 없는 숙소는 404 다
@pytest.fixture(scope="module")
def client():
    """데모 시드를 한 번 만들고 재사용한다.

    시드가 이 파일에서 가장 비싼 부분이라 함수마다 만들면 테스트가 느려서 아무도
    안 돌리게 된다.
    """
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        yield c


def _first_property_id(client) -> str:
    rows = client.get("/api/v1/properties", params={"status": "LISTED"}).json()
    assert rows, "시드에 등록된 숙소가 있어야 이 파일이 성립한다"
    return rows[0]["id"]


def test_an_existing_property_opens(client):
    """**가장 중요한 검사.** 존재하는 숙소가 200 이어야 한다.

    예전에는 여기서 500 이 났고, 그게 "숙소를 눌러도 안 열린다" 의 실체였다.
    """
    body = client.get(f"/api/v1/properties/{_first_property_id(client)}")
    assert body.status_code == 200, body.text
    assert body.json()["id"]


def test_the_detail_carries_the_board_types(client):
    """관계를 실제로 타는지 본다.

    상태 코드만 보면 `selectinload` 를 지워도 통과한다 — 그러면 이 테스트는
    회귀를 못 잡는다.
    """
    detail = client.get(f"/api/v1/properties/{_first_property_id(client)}").json()
    assert "board_types" in detail
    assert "amenities" in detail


def test_a_missing_property_is_404_not_500(client):
    r = client.get("/api/v1/properties/00000000-0000-0000-0000-000000000000")
    assert r.status_code == 404, r.text


def test_a_malformed_id_is_404_not_500(client):
    """주소창에 아무 문자열이나 넣는 것으로 서버가 터지면 안 된다."""
    r = client.get("/api/v1/properties/not-a-uuid")
    assert r.status_code == 404, r.text


def test_the_404_says_something_the_screen_can_show(client):
    """이유 없는 404 는 화면이 설명할 수 없다."""
    r = client.get("/api/v1/properties/00000000-0000-0000-0000-000000000000")
    assert r.json().get("detail")
