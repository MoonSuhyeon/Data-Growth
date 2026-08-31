"""이벤트 저장소와 분석 API.

지금까지 수집한 이벤트는 **프로세스 메모리의 리스트**에만 있었다. 그래서 재시작하면
사라졌고, 격리본을 재처리한다는 약속도 프로세스가 사는 동안만 유효했다. 무엇보다
**기간으로 물어볼 수가 없어서**, 콘솔은 파이프라인이 미리 계산해 둔 JSON 한 장만
보여줄 수 있었다.
"""
from __future__ import annotations

import os
from datetime import datetime, timedelta

import pytest

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_sapi_app.db")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ["ANALYTICS_DB_URL"] = "sqlite:///./test_sapi_store.db"

from analytics.store import EventStore  # noqa: E402

T0 = datetime(2025, 6, 1, 10, 0)


def ev(eid: str, when: datetime, name="property_viewed", **kw) -> dict:
    base = {
        "event_id": eid, "event_name": name, "anonymous_id": "a1",
        "sent_at": when, "received_at": when, "platform": "WEB",
        "device_type": "MOBILE", "property_id": "P0001",
    }
    base.update(kw)
    return base


@pytest.fixture
def store(tmp_path):
    return EventStore(f"sqlite:///{tmp_path / 'ev.db'}")


# ─────────────────────────────── 보관
def test_events_survive_a_new_connection(tmp_path):
    """재시작해도 남는다. 이게 안 되면 재처리 약속이 성립하지 않는다."""
    url = f"sqlite:///{tmp_path / 'ev.db'}"
    EventStore(url).put([ev("e1", T0)])
    assert EventStore(url).count() == 1


def test_the_same_event_id_is_stored_once(store):
    """오프라인 버퍼가 있으면 재전송은 정상 동작이다.

    메모리 집합으로 거르면 재시작할 때마다 그 기억이 사라져서, 며칠 뒤 올라온
    재전송을 새 이벤트로 받는다. 저장소가 접어야 한다.
    """
    assert store.put([ev("e1", T0), ev("e2", T0)]) == 2
    assert store.put([ev("e1", T0), ev("e3", T0)]) == 1     # e1 은 이미 있다
    assert store.count() == 3


def test_duplicates_inside_one_batch_are_folded(store):
    assert store.put([ev("dup", T0), ev("dup", T0)]) == 1


def test_a_big_batch_does_not_blow_the_sql_variable_limit(store):
    """오프라인에서 며칠치를 한 번에 밀어 올리는 것은 **예외가 아니라 기본**이다.

    `IN (...)` 에 수천 개를 한 번에 넣으면 SQLite 가 "too many SQL variables" 로
    죽는다. 실제로 그렇게 깨졌다.
    """
    big = [ev(f"e{i}", T0) for i in range(3_000)]
    assert store.put(big) == 3_000
    assert store.put(big) == 0


def test_quarantined_events_are_kept_too(store):
    store.quarantine([({"bad": 1}, "필수 속성 누락")])
    assert store.quarantined_count() == 1


# ─────────────────────────────── 기간
def test_frame_is_cut_by_when_it_happened(store):
    """`sent_at` 으로 자른다. 서버 수신 시각으로 자르면 오프라인 버퍼에 갇혔던
    이벤트가 **도착한 주**에 끼어든다."""
    store.put([
        ev("old", T0),
        ev("new", T0 + timedelta(days=10)),
    ])
    assert len(store.frame(since=T0 + timedelta(days=5))) == 1
    assert len(store.frame(until=T0 + timedelta(days=5))) == 1
    assert len(store.frame()) == 2


def test_an_empty_window_still_has_columns(store):
    """빈 기간은 오류가 아니다.

    컬럼 없는 프레임을 주면 분석 함수가 KeyError 로 죽고, "데이터가 없다" 와
    "코드가 깨졌다" 가 섞인다.
    """
    df = store.frame(since=T0 + timedelta(days=999))
    assert df.empty
    for c in ("event_name", "anonymous_id", "sent_at", "amount"):
        assert c in df.columns


def test_span_reports_the_range(store):
    store.put([ev("a", T0), ev("b", T0 + timedelta(days=3))])
    lo, hi = store.span()
    assert lo == T0 and hi == T0 + timedelta(days=3)


# ─────────────────────────────── API
@pytest.fixture(scope="module")
def client():
    from fastapi.testclient import TestClient

    from analytics.simulator import simulate
    from app.api.v1 import analytics as mod
    from app.main import app

    raw, _ = simulate()
    rows = []
    for e in raw:
        r = dict(e)
        r["sent_at"] = datetime.fromisoformat(r["sent_at"])
        r["received_at"] = (
            datetime.fromisoformat(r["received_at"]) if r.get("received_at") else None
        )
        rows.append(r)
    mod._store.clear()
    mod._store.put(rows)

    yield TestClient(app)

    mod._store.clear()
    # 예약 DB 파일은 지우지 않는다 — 테스트 전체가 한 DB 를 공유한다
    # (`tests/conftest.py`). 이벤트 저장소는 이 파일만 쓰므로 그것만 지운다.
    try:
        os.remove("test_sapi_store.db")
    except OSError:
        pass


def test_a_narrower_window_gives_a_different_answer(client):
    """이게 안 되면 기간 선택은 장식이다."""
    whole = client.get("/api/v1/analytics/overview").json()
    week = client.get("/api/v1/analytics/overview",
                      params={"from": "2025-06-01", "to": "2025-06-08"}).json()
    assert week["window"]["events"] < whole["window"]["events"]
    assert week["cvr"] != whole["cvr"]


def test_the_response_says_what_it_measured(client):
    """요청한 기간과 **실제 데이터가 있는 기간**은 다를 수 있다."""
    b = client.get("/api/v1/analytics/overview",
                   params={"from": "2025-06-01", "to": "2025-06-08"}).json()
    w = b["window"]
    assert w["requested_from"] and w["requested_to"]
    assert w["data_from"] and w["data_to"]
    assert w["events"] > 0


def test_an_empty_window_is_zero_not_an_error(client):
    b = client.get("/api/v1/analytics/overview",
                   params={"from": "2030-01-01", "to": "2030-01-02"})
    assert b.status_code == 200
    assert b.json()["window"]["events"] == 0
    assert b.json()["cvr"] == 0.0


@pytest.mark.parametrize("axis", ["device_type", "region", "visit_type", "property_type"])
def test_every_declared_axis_works(client, axis):
    b = client.get("/api/v1/analytics/segments", params={"by": axis})
    assert b.status_code == 200, b.text
    body = b.json()
    assert body["dimension"] == axis
    assert body["rows"], f"{axis} 축이 빈 결과를 낸다"


def test_the_product_axis_says_its_denominator_differs(client):
    """검색은 숙소에 귀속되지 않는다. 분모가 다르면 응답이 말해야 한다."""
    b = client.get("/api/v1/analytics/segments", params={"by": "property_type"}).json()
    assert b["note"], "분모가 다른데 아무 말이 없으면 두 표가 같은 측정인 줄 알고 비교된다"


def test_an_axis_that_is_not_in_the_data_is_refused(client):
    r = client.get("/api/v1/analytics/segments", params={"by": "nonexistent"})
    assert r.status_code == 400
    assert "nonexistent" in r.json()["detail"]


def test_overview_carries_targets(client):
    """목표선 없이 숫자만 있으면 9.4% 가 좋은 건지 나쁜 건지 아무도 모른다."""
    t = client.get("/api/v1/analytics/overview").json()["targets"]
    assert t["rows"] and t["summary"]
    assert t["declared_in"].endswith("targets.py")
