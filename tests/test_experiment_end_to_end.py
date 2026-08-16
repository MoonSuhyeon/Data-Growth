"""M6 — 배정부터 결론까지 한 줄로 이어 본다.

앞의 단계들은 각자 맞다는 걸 보였다. 여기서는 **실제 HTTP 표면을 통해** 그것들이
이어지는지 본다. 사슬이 끊기는 자리는 대개 부품 안이 아니라 부품 사이다.

    GET  /experiments/assignments   서버가 군을 정한다
      → 클라이언트가 그 변형을 이벤트에 싣는다
    POST /events                    수집기가 받는다
      → SRM 으로 배정을 확인하고
      → 그러고 나서야 전환율을 비교한다

**순서가 곧 주장이다.** SRM 을 통과하기 전에 전환율을 읽으면, 읽은 값이 처치의
효과인지 배정이 틀어진 결과인지 구분할 수 없다.
"""
from __future__ import annotations

import os
import random
import uuid
from datetime import datetime, timedelta

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_e2e.db")
os.environ.setdefault("JWT_SECRET", "test-secret")

from fastapi.testclient import TestClient  # noqa: E402

from analytics.experiments.stats import check_srm, two_proportion_test  # noqa: E402
from app.api.v1.events import _collector  # noqa: E402
from app.main import app  # noqa: E402

client = TestClient(app)

N_UNITS = 4_000
START = datetime(2025, 6, 1, 9, 0, 0)
# 처치가 실제로 듣는다고 가정하고 심어 두는 효과. 파이프라인이 이걸 되찾아야 한다.
CONTROL_RATE = 0.24
TREATMENT_LIFT = 1.18


def _assign_via_http(unit: str) -> str | None:
    r = client.get(
        "/api/v1/experiments/assignments",
        params={"unit_id": unit, "platform": "WEB"},
    )
    assert r.status_code == 200
    row = r.json()["assignments"][0]
    # 참여 못 하는 사용자는 변형이 없다. control 로 바꿔 채우지 않는다.
    return row["variant"] if row["status"] == "assigned" else None


def _event(name: str, unit: str, variant: str, when: datetime, **kw) -> dict:
    return {
        "event_id": str(uuid.uuid4()),
        "event_name": name,
        "anonymous_id": unit,
        "sent_at": when.isoformat(),
        "device_type": "MOBILE",
        "properties": {"variant": variant},
        **kw,
    }


def test_assignment_flows_through_ingest_to_a_conclusion():
    rng = random.Random(7)
    before = len(_collector.store)

    batch: list[dict] = []
    exposed = {"control": 0, "treatment": 0}
    converted = {"control": 0, "treatment": 0}

    for i in range(N_UNITS):
        unit = f"e2e-{i}"
        variant = _assign_via_http(unit)
        if variant is None:
            continue

        when = START + timedelta(minutes=i % 600)
        batch.append(_event("property_viewed", unit, variant, when, property_id="p-1"))
        exposed[variant] += 1

        rate = CONTROL_RATE * (TREATMENT_LIFT if variant == "treatment" else 1.0)
        if rng.random() < rate:
            batch.append(
                _event("booking_started", unit, variant,
                       when + timedelta(minutes=2), property_id="p-1")
            )
            converted[variant] += 1

    # ── 수집. 배치 상한을 넘으므로 나눠 보낸다 — 클라이언트가 하는 그대로.
    accepted = 0
    for i in range(0, len(batch), 200):
        body = client.post("/api/v1/events", json=batch[i:i + 200]).json()
        assert body["quarantined"] == 0, body["reasons"]
        accepted += body["accepted"]

    assert accepted == len(batch)
    assert len(_collector.store) - before == len(batch)

    # ── 1. 배정부터 확인한다. 여기서 걸리면 아래 숫자는 읽지 않는다.
    srm = check_srm(exposed)
    assert srm.healthy, f"배정이 틀어졌다 — 전환율을 읽으면 안 된다 ({srm})"

    # ── 2. 그러고 나서 전환율
    test = two_proportion_test(
        converted["control"], exposed["control"],
        converted["treatment"], exposed["treatment"],
    )
    assert test.significant, f"심은 효과를 못 찾았다 ({test})"
    # 심은 값은 +18%. 표본이 유한하므로 정확히 나오지는 않는다.
    assert 0.05 < test.relative_lift < 0.35, test.relative_lift


def test_the_same_unit_gets_the_same_variant_across_requests():
    """재방문에서 군이 바뀌면 그 사람의 이벤트는 두 군에 걸쳐 흩어진다."""
    first = _assign_via_http("e2e-stable")
    for _ in range(5):
        assert _assign_via_http("e2e-stable") == first


def test_events_carry_the_variant_the_server_assigned():
    """클라이언트가 임의로 정한 값이 아니라 서버가 준 값이 실려야 한다."""
    unit = "e2e-carry"
    variant = _assign_via_http(unit)
    assert variant is not None

    client.post("/api/v1/events",
                json=[_event("property_viewed", unit, variant, START, property_id="p-9")])

    stored = [e for e in _collector.store if e.anonymous_id == unit]
    assert stored, "수집되지 않았다"
    assert stored[-1].properties["variant"] == variant
