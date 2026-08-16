"""퍼널 집계.

설계 결정을 코드에 명시한다. 퍼널은 정의를 어떻게 잡느냐에 따라 숫자가 달라지므로,
그 선택을 문서가 아니라 **코드에 남긴다**.

| 항목 | 선택 |
|------|------|
| 세션 정의 (웹) | 30분 무활동 시 종료 |
| 세션 정의 (앱) | **백그라운드 30분 초과 시 종료** — 포그라운드 침묵은 종료가 아니다 |
| 세션 키 | install_id 우선, 없으면 anonymous_id |
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
# 앱이 백그라운드에 이만큼 넘게 있었으면 세션이 끝난 것으로 본다.
APP_BACKGROUND_MINUTES = 30


def _session_key(df: pd.DataFrame) -> pd.Series:
    """세션을 묶는 기준.

    앱은 익명 ID 가 실행마다 바뀔 수 있어서, 그걸로 묶으면 한 번의 방문이
    여러 세션으로 쪼개진다. 스티칭과 같은 우선순위로 안정적인 키를 먼저 쓴다.
    """
    if "install_id" in df.columns:
        return df["install_id"].fillna(df["anonymous_id"])
    return df["anonymous_id"]


def sessionize(events: pd.DataFrame, gap_minutes: int = SESSION_GAP_MINUTES,
               background_minutes: int = APP_BACKGROUND_MINUTES) -> pd.DataFrame:
    """세션을 나눈다. **웹과 앱의 규칙이 다르다.**

    웹은 사용자가 떠났다는 신호가 없다. 브라우저가 알려주지 않으니 침묵으로
    추론할 수밖에 없고, 그래서 ``gap_minutes`` 무활동을 종료로 본다.

    앱은 다르다. 백그라운드로 갔다는 사실을 명시적으로 알려주므로 **추론할 필요가
    없다.** 그리고 이 차이가 실제로 숫자를 가른다 — 앱을 켜둔 채 긴 글을 읽는
    사용자는 이벤트를 안 보내지만 떠난 게 아니다. 무활동으로 자르면 한 사람의
    한 방문이 둘로 쪼개진다.

    생명주기 이벤트가 아예 없는 앱(구버전 등)은 신호가 없으므로 무활동 규칙으로
    되돌아간다 — 없는 신호를 있다고 가정하지 않는다.
    """
    df = events.copy()
    df["_key"] = _session_key(df)
    df = df.sort_values(["_key", "timestamp"]).copy()

    prev_ts = df.groupby("_key")["timestamp"].shift(1)
    gap = (df["timestamp"] - prev_ts).dt.total_seconds() / 60
    first = gap.isna()

    name = df["event_name"].map(lambda x: getattr(x, "value", x))
    prev_name = name.groupby(df["_key"]).shift(1)

    is_app = (
        df["platform"].map(lambda x: getattr(x, "value", x)).ne("WEB")
        if "platform" in df.columns
        else pd.Series(False, index=df.index)
    )
    # 이 키가 생명주기 신호를 보내는가. 안 보내면 앱이어도 무활동으로 판단한다.
    has_signal = (
        name.eq(EventName.APP_BACKGROUNDED.value)
        .groupby(df["_key"]).transform("any")
    )

    by_signal = is_app & has_signal
    # 앱: 직전이 백그라운드였고 그 상태가 임계를 넘겼을 때만 새 세션
    app_new = prev_name.eq(EventName.APP_BACKGROUNDED.value) & (gap >= background_minutes)
    # 웹(과 신호 없는 앱): 무활동
    web_new = gap >= gap_minutes

    new_session = first | app_new.where(by_signal, web_new)

    df["session_seq"] = new_session.groupby(df["_key"]).cumsum().astype(int)
    df["session_id"] = df["_key"].astype(str) + "-s" + df["session_seq"].astype(str)
    df = df.drop(columns=["_key"])

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
