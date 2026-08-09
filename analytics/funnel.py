"""퍼널 집계.

설계 결정을 코드에 명시한다. 퍼널은 정의를 어떻게 잡느냐에 따라 숫자가 달라지므로,
그 선택을 문서가 아니라 **코드에 남긴다**.

| 항목 | 선택 |
|------|------|
| 세션 정의 | 30분 무활동 시 종료 |
| 퍼널 귀속 | 세션 내 도달 여부 (strict path 아님) |
| 중복 제거 | 단계별 unique 여정 기준 |
| 기간 경계 | 세션이 날짜를 넘으면 시작일에 귀속 |
"""
from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from analytics.etl.identity import journey_key
from tracking.taxonomy import FUNNEL_STEPS, EventName

SESSION_GAP_MINUTES = 30


def sessionize(events: pd.DataFrame, gap_minutes: int = SESSION_GAP_MINUTES) -> pd.DataFrame:
    """무활동 간격 기준으로 세션을 나눈다.

    같은 익명 ID 안에서 ``gap_minutes`` 이상 비면 새 세션으로 본다.
    """
    df = events.sort_values(["anonymous_id", "timestamp"]).copy()
    prev = df.groupby("anonymous_id")["timestamp"].shift(1)
    gap = (df["timestamp"] - prev).dt.total_seconds() / 60
    new_session = gap.isna() | (gap >= gap_minutes)
    df["session_seq"] = new_session.groupby(df["anonymous_id"]).cumsum().astype(int)
    df["session_id"] = df["anonymous_id"] + "-s" + df["session_seq"].astype(str)

    # 세션 시작일에 귀속시킨다 (자정을 넘겨도 한 세션은 한 날짜로)
    starts = df.groupby("session_id")["timestamp"].transform("min")
    df["session_date"] = starts.dt.normalize()
    return df.reset_index(drop=True)


@dataclass
class FunnelStep:
    step: int
    event: str
    users: int
    step_rate: float | None      # 직전 단계 대비
    overall_rate: float          # 최상단 대비
    drop: int


def compute(events: pd.DataFrame,
            steps: tuple[EventName, ...] = FUNNEL_STEPS) -> list[FunnelStep]:
    """단계별 unique 여정 수와 전환·이탈을 계산한다."""
    df = events.copy()
    df["_key"] = journey_key(df)

    reached: list[set] = []
    for ev in steps:
        keys = set(df.loc[df["event_name"] == ev.value, "_key"])
        # 앞 단계에 도달한 여정만 뒤 단계 후보가 된다
        if reached:
            keys &= reached[-1]
        reached.append(keys)

    out: list[FunnelStep] = []
    top = len(reached[0]) if reached else 0
    for i, (ev, s) in enumerate(zip(steps, reached)):
        prev = len(reached[i - 1]) if i else None
        out.append(
            FunnelStep(
                step=i + 1,
                event=ev.value,
                users=len(s),
                step_rate=round(len(s) / prev, 4) if prev else None,
                overall_rate=round(len(s) / top, 4) if top else 0.0,
                drop=(prev - len(s)) if prev else 0,
            )
        )
    return out


def to_frame(steps: list[FunnelStep]) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "step": s.step,
                "event": s.event,
                "users": s.users,
                "step_rate": s.step_rate,
                "overall_rate": s.overall_rate,
                "drop": s.drop,
            }
            for s in steps
        ]
    )


def conversion_rate(events: pd.DataFrame,
                    steps: tuple[EventName, ...] = FUNNEL_STEPS) -> float:
    """최상단 → 최하단 전체 전환율."""
    f = compute(events, steps)
    return f[-1].overall_rate if f else 0.0


def by_segment(events: pd.DataFrame, column: str,
               steps: tuple[EventName, ...] = FUNNEL_STEPS) -> pd.DataFrame:
    """세그먼트별 전환율. 전체 평균이 가리는 것을 드러낸다."""
    rows = []
    for key, g in events.groupby(column, observed=True):
        f = compute(g, steps)
        row = {column: key, "top_users": f[0].users, "cvr": f[-1].overall_rate}
        for s in f[1:]:
            row[f"{s.event}_rate"] = s.step_rate
        rows.append(row)
    return pd.DataFrame(rows).sort_values("cvr", ascending=False).reset_index(drop=True)


__all__ = [
    "FunnelStep", "SESSION_GAP_MINUTES", "by_segment", "compute",
    "conversion_rate", "sessionize", "to_frame",
]
