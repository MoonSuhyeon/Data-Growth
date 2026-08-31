"""판매 기회 API — 생성 · 목록 · 상세.

여기서 고정하는 것은 점수의 값이 아니라 **기회가 될 수 없는 것을 점수로 누르지
않고 거절하는가**이다. 낮은 점수로 만들어 두면 목록 아래쪽에 살아남고, 언젠가
발송된다. 거절은 되돌릴 수 있지만 발송은 되돌릴 수 없다.
"""
from __future__ import annotations

import asyncio
import os

import pytest

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_sales_opportunity.db")
os.environ.setdefault("JWT_SECRET", "test-secret")

def _rows(region, ptype, predicted, n=10):
    return [{"region": region, "property_type": ptype, "predicted": predicted}] * n


#: 에이전트가 예측 서비스에서 읽어 온 모양. **지역 이름이 영문으로 온다** —
#: 정규화는 scoring 쪽 규칙이고, 이 픽스처가 그 연결이 살아 있는지를 지킨다.
#:
#: 시드에 있는 시장을 덮되 **서울 APARTMENT 는 일부러 뺀다** —
#: "수요를 못 찾으면 점수를 지어내지 않는다" 를 검사할 구멍이 필요하다.
FORECAST = {
    "rows": (
        _rows("Jeju", "PENSION", 2.4)
        + _rows("Jeju", "HOUSE", 2.1)
        + _rows("Gangneung", "PENSION", 1.8)
        + _rows("Gangneung", "HOUSE", 1.5)
        + _rows("Gyeongju", "HOUSE", 1.6)
        + _rows("Gyeongju", "GUESTHOUSE", 1.4)
        + _rows("Busan", "PENSION", 1.1)
    ),
    # 예측 서비스가 실제로 주는 모양 — **영문 키다.** 한글로 적어 두면
    # 정규화가 빠져도 테스트가 통과해 버린다.
    "wape_by_region": {"Jeju": 0.3448, "Busan": 0.42,
                       "Gangneung": 0.31, "Gyeongju": 0.38},
}


#: 이 모듈 전용 이벤트 루프.
#:
#: `asyncio.get_event_loop()` 를 쓰면 **다른 테스트 파일이 `asyncio.run()` 으로
#: 기본 루프를 닫아 버린 뒤** 닫힌 루프를 받아 `RuntimeError` 가 난다. 단독으로
#: 돌리면 멀쩡하고 같이 돌리면 깨지는, 순서에 기대는 실패였다.
_loop = None


def run_async(coro):
    global _loop
    if _loop is None or _loop.is_closed():
        _loop = asyncio.new_event_loop()
    return _loop.run_until_complete(coro)


@pytest.fixture(scope="module")
def client():
    """**기회 표를 비우고 시작한다.**

    이 파일은 기회를 만들어 두고 다음 검사가 그것을 읽는 구조라, 앞선 실행이
    남긴 행이 있으면 "이미 열려 있는 기회" 로 걸려 두 번째 실행부터 실패한다.
    한 번만 통과하는 테스트는 아무도 안 돌리게 된다.

    **DB 파일을 지우지 않는다.** 이제 테스트 전체가 한 DB 를 공유하므로
    (`tests/conftest.py`), 파일을 지우면 남의 데이터까지 날아간다.
    이 파일이 더럽히는 것은 `opportunities` 뿐이니 그것만 비운다.
    """
    from fastapi.testclient import TestClient
    from sqlalchemy import delete

    from app.main import app

    with TestClient(app) as c:
        async def clear():
            from app.core.database import AsyncSessionLocal
            from app.models import Opportunity
            async with AsyncSessionLocal() as s:
                await s.execute(delete(Opportunity))
                await s.commit()

        run_async(clear())
        yield c


def prospects(client) -> list[dict]:
    """시드에 들어간 미입점 숙소. API 가 없으므로 DB 에서 직접 읽는다."""
    from sqlalchemy import select

    from app.core.database import AsyncSessionLocal
    from app.models import Prospect

    async def _load():
        async with AsyncSessionLocal() as s:
            rows = (await s.execute(select(Prospect))).scalars().all()
            return [{"id": str(p.id), "name": p.name, "region": p.region,
                     "property_type": p.property_type.value
                     if hasattr(p.property_type, "value") else p.property_type,
                     "rating": float(p.rating) if p.rating is not None else None,
                     "email": p.contact_email, "phone": p.contact_phone}
                    for p in rows]

    return run_async(_load())


def pick(client, **want) -> dict:
    for p in prospects(client):
        if all(p.get(k) == v for k, v in want.items()):
            return p
    pytest.skip(f"시드에 조건에 맞는 후보가 없다: {want}")


def create(client, prospect_id, forecast=None, product="LISTING"):
    return client.post("/api/v1/sales/opportunities", json={
        "prospect_id": prospect_id,
        "forecast": forecast if forecast is not None else FORECAST,
        "product": product,
    })


# ── 생성 ─────────────────────────────────────────────────────

def test_후보_하나가_기회가_된다(client):
    p = pick(client, name="조천 돌담 독채")
    r = create(client, p["id"])
    assert r.status_code == 201, r.text

    body = r.json()
    assert body["score"] > 0
    assert body["status"] == "QUALIFIED"
    assert body["target_name"] == "조천 돌담 독채"


def test_우리가_없는_동네가_점수와_근거에_실제로_드러난다(client):
    """시드가 `REGIONS` 의 동네를 그대로 쓰면 모든 후보의 위치 축이 0 이 되어
    점수가 낮은 쪽에 뭉치고, 근거에 위치 이야기가 한 번도 안 나온다.
    화면에서 "왜 이 숙소인가" 를 펼칠 재료가 사라지는 회귀다."""
    # 앞 검사가 만들어 둔 것을 읽는다 — 같은 후보로 또 만들면 중복으로 막힌다.
    listed = client.get("/api/v1/sales/opportunities").json()
    oid = next(o["id"] for o in listed if o["target_name"] == "조천 돌담 독채")
    empty = client.get(f"/api/v1/sales/opportunities/{oid}").json()

    # 사천은 우리 숙소가 이미 있는 동네다. 대비가 있어야 축이 실제로 도는지 보인다.
    covered = create(client, pick(client, name="사천 솔밭 단독주택")["id"]).json()

    assert empty["score_breakdown"]["fit_axes"]["area"] == 1.0
    assert any("조천" in r for r in empty["score_breakdown"]["fit_reasons"])
    assert covered["score_breakdown"]["fit_axes"]["area"] < 1.0
    assert empty["score"] > covered["score"]


def test_점수의_내역이_남는다(client):
    """총점만 남기면 87점이 "시장이 커서" 인지 "숙소가 맞아서" 인지 알 수 없다."""
    p = pick(client, name="안덕 바다뷰 펜션")
    body = create(client, p["id"]).json()

    bd = body["score_breakdown"]
    assert set(bd) >= {"gap_score", "fit_score", "fit_axes", "market"}
    assert set(bd["fit_axes"]) == {"capacity", "rating", "area"}
    assert bd["market"]["region"] == "제주"      # 정규화가 살아 있다


def test_왜_이_숙소인지를_문장으로_남긴다(client):
    p = pick(client, name="표선 정원 단독주택")
    body = create(client, p["id"]).json()
    assert "제주" in body["rationale"]


def test_신뢰도가_점수와_따로_남는다(client):
    """**영문 지역 키의 오차가 실제로 붙는지**까지 본다.

    정규화를 빠뜨리면 wape 가 NaN 이 되어 신뢰도가 영원히 `unknown` 으로 나온다.
    에러가 안 나므로 값을 확인하지 않으면 못 잡는다.
    """
    p = pick(client, name="강문 오션 펜션")     # 강릉 · wape 0.31 → high
    body = create(client, p["id"]).json()

    assert body["confidence"] == "high"
    assert body["score_breakdown"]["market"]["wape"] == 0.31


def test_연락_수단이_없으면_기회가_아니다(client):
    """점수로 누르면 목록 아래쪽에 살아남아 언젠가 발송된다."""
    p = pick(client, name="한림 연락처없는 펜션")
    r = create(client, p["id"])
    assert r.status_code == 409
    assert "연락" in r.json()["detail"]


def test_평점_미달은_점수가_아니라_거절이다(client):
    p = pick(client, name="광안리 저평점 펜션")
    r = create(client, p["id"])
    assert r.status_code == 409
    assert "영업 대상이 아닙니다" in r.json()["detail"]


def test_같은_후보에_열린_기회가_둘일_수_없다(client):
    p = pick(client, name="보문 한옥채")
    assert create(client, p["id"]).status_code == 201

    again = create(client, p["id"])
    assert again.status_code == 409
    assert "열려 있는" in again.json()["detail"]


def test_수요를_못_찾으면_점수를_지어내지_않는다(client):
    """예측에 없는 시장이면 만들지 않는다 — 없는 근거로 영업하지 않는다."""
    p = pick(client, name="망원 골목 아파트")     # 서울 · APARTMENT
    r = create(client, p["id"])                   # 예측에는 제주·부산 PENSION 뿐
    assert r.status_code == 409
    assert "수요" in r.json()["detail"]


def test_없는_후보는_404다(client):
    r = create(client, "00000000-0000-0000-0000-000000000000")
    assert r.status_code == 404


# ── 후보 목록 ────────────────────────────────────────────────

def test_후보_목록이_연락_가능_여부를_알려준다(client):
    """화면이 누르기 전에 알 수 있어야 한다 — 누르고 409 를 보는 것보다 낫다."""
    rows = client.get("/api/v1/sales/prospects").json()
    assert rows

    by_name = {r["name"]: r for r in rows}
    assert by_name["한림 연락처없는 펜션"]["contactable"] is False
    assert by_name["조천 돌담 독채"]["contactable"] is True


def test_후보_목록에는_점수가_없다(client):
    """목록에서 점수를 매기면 화면을 열 때마다 예측을 부르게 되고,
    그 값이 기회로 굳힌 점수와 다른 시점의 것이 되어 두 화면이 갈린다."""
    row = client.get("/api/v1/sales/prospects").json()[0]
    assert "score" not in row


def test_이미_기회가_열린_후보는_표시된다(client):
    rows = client.get("/api/v1/sales/prospects").json()
    assert any(r["has_open_opportunity"] for r in rows), (
        "앞선 테스트가 기회를 만들어 두었어야 한다")


def test_지역으로_거를_수_있다(client):
    rows = client.get("/api/v1/sales/prospects", params={"region": "제주"}).json()
    assert rows and all(r["region"] == "제주" for r in rows)


# ── 목록 · 상세 ──────────────────────────────────────────────

def test_목록은_점수가_높은_순이다(client):
    rows = client.get("/api/v1/sales/opportunities").json()
    assert rows, "앞선 테스트가 기회를 만들어 두었어야 한다"

    scores = [r["score"] for r in rows if r["score"] is not None]
    assert scores == sorted(scores, reverse=True)


def test_모드와_상태로_거를_수_있다(client):
    rows = client.get("/api/v1/sales/opportunities",
                      params={"mode": "ACQUISITION", "status": "QUALIFIED"}).json()
    assert rows
    assert all(r["mode"] == "ACQUISITION" and r["status"] == "QUALIFIED" for r in rows)

    none = client.get("/api/v1/sales/opportunities", params={"status": "WON"}).json()
    assert none == []


def test_상세는_산출_내역과_후보_정보를_함께_준다(client):
    """화면이 "왜 87점인가" 를 펼치려면 목록에 없는 것까지 있어야 한다."""
    first = client.get("/api/v1/sales/opportunities").json()[0]
    detail = client.get(f"/api/v1/sales/opportunities/{first['id']}").json()

    assert detail["score_breakdown"]["fit_reasons"]
    assert detail["prospect"]["name"]
    assert detail["prospect"]["contact_email"]
    assert detail["next_action"]


def test_없는_기회는_404다(client):
    r = client.get("/api/v1/sales/opportunities/00000000-0000-0000-0000-000000000000")
    assert r.status_code == 404
