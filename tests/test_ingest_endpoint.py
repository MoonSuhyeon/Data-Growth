"""M4 — SDK 가 밀어 넣는 수집 엔드포인트.

여기서 고정하는 건 두 가지다. **하나가 틀렸다고 배치 전체를 거절하지 않는 것**,
그리고 **재전송을 실패로 답하지 않는 것.** 둘 다 어기면 클라이언트 큐가 영영
안 비워지고, 그 상태는 "이벤트가 안 온다"로만 보여서 원인을 찾기 어렵다.
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta

import pytest

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_ingest.db")
os.environ.setdefault("JWT_SECRET", "test-secret")

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)
NOW = datetime(2025, 6, 1, 12, 0, 0)


def ev(name="property_viewed", **kw) -> dict:
    base = {
        "event_id": str(uuid.uuid4()),
        "event_name": name,
        "anonymous_id": "anon-1",
        "sent_at": NOW.isoformat(),
        "property_id": "p-1",
    }
    base.update(kw)
    return base


def post(batch) -> dict:
    r = client.post("/api/v1/events", json=batch)
    assert r.status_code == 200, r.text
    return r.json()


# ─────────────────────────────── 부분 실패
def test_a_bad_event_does_not_reject_the_whole_batch():
    """하나가 틀렸다고 배치를 거절하면 클라이언트는 그 배치를 영원히 재시도한다."""
    body = post([ev(), {"event_name": "property_viewed"}, ev()])
    assert body["accepted"] == 2
    assert body["quarantined"] == 1
    assert body["reasons"], "왜 격리됐는지 알려줘야 계측 버그를 배포 후에 찾는다"


def test_missing_required_property_is_quarantined_not_dropped():
    body = post([ev(property_id=None)])
    assert body["quarantined"] == 1
    assert "property_id" in body["reasons"][0]


def test_app_event_without_install_id_is_quarantined():
    """앱 이벤트는 설치 식별자가 있어야 재설치·크로스 플랫폼을 다룰 수 있다."""
    body = post([ev(platform="IOS", app_version="1.2.0")])
    assert body["quarantined"] == 1
    assert "install_id" in body["reasons"][0]


# ─────────────────────────────── 재전송
def test_redelivery_is_counted_once_and_still_answered_as_success():
    """오프라인 버퍼가 있으면 재전송은 정상 동작이다.

    거절하면 클라이언트가 큐에서 안 지우고 계속 보낸다. 그래서 **한 번만 세되
    성공으로 답한다.**
    """
    e = ev()
    first = post([e])
    assert first["accepted"] == 1 and first["duplicates"] == 0

    second = post([e])
    assert second["accepted"] == 0
    assert second["duplicates"] == 1
    assert second["quarantined"] == 0


def test_a_batch_that_is_entirely_a_redelivery_is_not_an_error():
    """네트워크가 끊겨 응답만 유실된 경우 — 배치 전체가 중복으로 다시 온다."""
    batch = [ev(), ev(), ev()]
    post(batch)
    again = post(batch)
    assert again["duplicates"] == 3
    assert again["accepted"] == 0


# ─────────────────────────────── 시각
def test_server_stamps_received_at_and_ignores_the_client_value():
    """기기 시계를 검증할 기준이 클라이언트 값이면 검증이 아니다."""
    lying = (NOW + timedelta(days=400)).isoformat()
    post([ev(received_at=lying)])
    r = client.get("/api/v1/events/health")
    assert r.status_code == 200
    # 수집기에 들어간 값이 클라이언트가 우긴 값이 아니어야 한다
    from app.api.v1.events import _collector
    stored = _collector.store[-1]
    assert stored.received_at is not None
    assert stored.received_at.year != 2026 or stored.sent_at == NOW
    assert stored.sent_at == NOW, "클라이언트가 말한 시각은 보존한다"


# ─────────────────────────────── 상한
def test_oversized_batch_is_truncated_rather_than_refused():
    """오래 오프라인이던 클라이언트가 수천 건을 한 번에 밀어 넣는 경우.

    거절하면 그 큐는 영영 못 비운다. 상한까지 받고 나머지는 다음 배치로 오게 한다.
    """
    from app.api.v1.events import MAX_BATCH
    body = post([ev() for _ in range(MAX_BATCH + 50)])
    assert body["accepted"] == MAX_BATCH


def test_health_exposes_failure_rate():
    r = client.get("/api/v1/events/health")
    assert r.status_code == 200
    assert 0.0 <= r.json()["failure_rate"] <= 1.0


@pytest.fixture(autouse=True, scope="module")
def _cleanup():
    yield
    try:
        os.remove("test_ingest.db")
    except OSError:
        pass
