"""기능 사용률.

퍼널은 **결제까지 가는 한 줄기**만 본다. 그 줄기에 안 들어가는 기능 — 찜, 객실
조회, 취소 — 은 아무리 많이 쓰여도 퍼널에 안 나타난다. 무엇을 더 만들지 정하려면
그쪽을 봐야 한다.

**분모가 이 파일의 요점이다.** "찜한 사람 / 전체 방문자"로 재면 퍼널 깊은 곳의
기능은 언제나 저조해 보인다. 찜은 숙소를 봐야 누를 수 있으므로, 분모는 **그
기능에 닿을 수 있었던 사람**이어야 한다. 분모를 잘못 잡으면 기능이 나쁜 것과
아무도 거기까지 못 간 것이 구분되지 않는다.
"""
from __future__ import annotations

import pandas as pd

from analytics.etl.identity import journey_key
from tracking.taxonomy import EventName

#: 기능 → 그 기능에 닿으려면 먼저 일어나야 하는 이벤트(관문).
#: ``None`` 이면 관문이 없다 — 전체 방문자가 분모다.
GATES: dict[EventName, EventName | None] = {
    EventName.SEARCH_PERFORMED: None,
    EventName.ROOM_VIEWED: EventName.PROPERTY_VIEWED,
    EventName.WISHLIST_ADDED: EventName.PROPERTY_VIEWED,
    EventName.BOOKING_INFO_SUBMITTED: EventName.BOOKING_STARTED,
    EventName.BOOKING_CANCELLED: EventName.BOOKING_COMPLETED,
}


def adoption(events: pd.DataFrame,
             gates: dict[EventName, EventName | None] | None = None) -> pd.DataFrame:
    """기능별 사용률.

    Returns:
        feature · gate · reachable · used · adoption_rate · uses_per_user
    """
    gates = GATES if gates is None else gates
    df = events.copy()
    df["_key"] = journey_key(df)
    everyone = df["_key"].nunique()

    rows = []
    for feature, gate in gates.items():
        if gate is None:
            reachable = everyone
            gate_name = "-"
        else:
            reachable = df.loc[df["event_name"] == gate.value, "_key"].nunique()
            gate_name = gate.value

        hits = df[df["event_name"] == feature.value]
        used = hits["_key"].nunique()
        rows.append({
            "feature": feature.value,
            "gate": gate_name,
            "reachable": int(reachable),
            "used": int(used),
            "adoption_rate": round(used / reachable, 4) if reachable else 0.0,
            # 한 사람이 몇 번 쓰는가. 사용률이 같아도 이 값이 다르면 다른 기능이다.
            "uses_per_user": round(len(hits) / used, 2) if used else 0.0,
        })
    return pd.DataFrame(rows).sort_values("adoption_rate", ascending=False).reset_index(drop=True)


def unused(events: pd.DataFrame, expected: set[str] | None = None) -> list[str]:
    """계약에 정의됐는데 **한 번도 발생하지 않은** 이벤트.

    수집 스키마가 거짓말을 하고 있는지 보는 검사다. 정의만 있고 아무도 안 만드는
    이벤트는 "우리는 이걸 잰다"는 주장만 남기고 실제로는 아무것도 안 잰다.

    ``expected`` 에 넣은 것은 제외한다 — **아직 없는 게 맞는 이벤트**가 있기
    때문이다. 앱 생명주기(``app_backgrounded``/``app_foregrounded``)는 앱이 없어서
    안 나오는 것이지 배선을 빠뜨린 게 아니다. 둘을 같은 경고로 묶으면 진짜 누락이
    묻힌다.
    """
    seen = set(events["event_name"].unique())
    skip = expected or set()
    return sorted(e.value for e in EventName if e.value not in seen and e.value not in skip)


#: 아직 없는 게 맞는 이벤트. 앱을 붙이면 이 목록에서 빠진다.
AWAITING_APP = frozenset({
    EventName.APP_BACKGROUNDED.value,
    EventName.APP_FOREGROUNDED.value,
})


__all__ = ["AWAITING_APP", "GATES", "adoption", "unused"]
