"""이상 징후 감지.

목표선은 **절대적인 선**을 본다. 이 파일은 **변화**를 본다 — 어제까지 9.5% 였다가
오늘 6% 가 되면 목표선은 원래도 미달이었으니 아무 말도 안 하는데, 그건 사고다.

**여기서 가장 중요한 건 안 우는 것이다.** SRM 에서 이미 적은 교훈이 그대로 적용된다:
항상 울리는 경보는 무시되고, 무시되면 진짜 실패도 못 잡는다.
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd

from analytics.anomaly import Rule, Severity, detect
from analytics.funnel import sessionize
from tracking.taxonomy import EventName

T0 = datetime(2025, 6, 1, 10, 0)


def journey(anon: str, when: datetime, *, convert: bool, device="MOBILE",
            amount=100_000) -> list[dict]:
    """한 사람의 여정. 전환 여부를 지정한다."""
    base = dict(anonymous_id=anon, user_id=None, device_type=device, amount=None)
    rows = [
        {**base, "event_name": EventName.SEARCH_PERFORMED.value, "timestamp": when},
        {**base, "event_name": EventName.PROPERTY_VIEWED.value,
         "timestamp": when + timedelta(minutes=1), "property_id": "P1"},
    ]
    if convert:
        for i, n in enumerate((EventName.BOOKING_STARTED, EventName.PAYMENT_STARTED), start=2):
            rows.append({**base, "event_name": n.value,
                         "timestamp": when + timedelta(minutes=i), "property_id": "P1"})
        rows.append({**base, "event_name": EventName.BOOKING_COMPLETED.value,
                     "timestamp": when + timedelta(minutes=4),
                     "property_id": "P1", "booking_id": f"B{anon}", "amount": amount})
    return rows


def frame(n: int, converters: int, *, tag: str, device="MOBILE") -> pd.DataFrame:
    rows: list[dict] = []
    for i in range(n):
        rows += journey(f"{tag}{i}", T0 + timedelta(minutes=i * 7),
                        convert=i < converters, device=device)
    df = pd.DataFrame(rows)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    return sessionize(df)


# ─────────────────────────────── 잡아야 하는 것
def test_a_real_collapse_is_reported():
    """전환율이 절반으로 무너지면 잡아야 한다."""
    base = frame(1_000, 200, tag="b")     # 20%
    cur = frame(1_000, 80, tag="c")       # 8%
    rep = detect(base, cur)
    assert not rep.healthy
    cvr = next(f for f in rep.findings if f.metric == "funnel.cvr")
    assert cvr.current < cvr.baseline
    assert cvr.severity is Severity.ALERT     # 상대 60% 하락은 경보다
    assert "표본" in cvr.reason, "왜 그렇게 판단했는지 없으면 받는 사람이 확인 못 한다"


def test_a_finding_carries_both_numbers():
    """"나빠졌다" 만으로는 아무도 움직이지 않는다."""
    rep = detect(frame(1_000, 200, tag="b"), frame(1_000, 100, tag="c"))
    f = rep.findings[0]
    assert f.baseline > 0 and f.current >= 0
    assert f.change < 0


# ─────────────────────────────── 울면 안 되는 것
def test_no_alarm_when_nothing_changed():
    same = frame(1_000, 200, tag="x")
    assert detect(same, same).healthy


def test_improvement_is_not_an_alarm():
    """좋아진 것을 경보로 울리면 그 경보는 하루 만에 무시된다."""
    rep = detect(frame(1_000, 100, tag="b"), frame(1_000, 300, tag="c"))
    assert rep.healthy


def test_a_small_sample_is_skipped_not_judged():
    """100명짜리 구간의 전환율은 하루에도 크게 흔들린다.

    그 흔들림을 경보로 바꾸면 매일 울리고, 그러면 아무도 안 본다.
    **"판정하지 않음" 과 "이상 없음" 은 다르다** — 그래서 skipped 에 남긴다.
    """
    rep = detect(frame(20, 8, tag="b"), frame(20, 1, tag="c"))
    assert rep.healthy
    assert any("표본 부족" in s for s in rep.skipped)


def test_a_big_relative_move_on_a_tiny_number_is_ignored():
    """0.2% → 0.4% 는 100% 증가지만 실제로는 아무 일도 아니다."""
    r = Rule("funnel.cvr", "전환율", worse="down", rel=0.10, abs_=0.05)
    base = frame(1_000, 500, tag="b")      # 50%
    cur = frame(1_000, 460, tag="c")       # 46% — 상대 8%, 절대 0.04
    assert detect(base, cur, rules=(r,)).healthy


def test_an_empty_window_is_not_an_anomaly():
    """비교할 게 없는 것과 나빠진 것은 다르다."""
    rep = detect(pd.DataFrame(), frame(500, 100, tag="c"))
    assert rep.healthy
    assert rep.skipped


# ─────────────────────────────── 평균이 가리는 것
def test_one_segment_collapsing_is_caught_even_if_the_total_holds():
    """전체는 멀쩡한데 한 세그먼트만 무너지는 경우. 층별 SRM 과 같은 발상이다."""
    base = pd.concat([
        frame(600, 120, tag="bm", device="MOBILE"),
        frame(600, 120, tag="bd", device="DESKTOP"),
    ])
    cur = pd.concat([
        frame(600, 30, tag="cm", device="MOBILE"),     # 모바일만 무너짐
        frame(600, 210, tag="cd", device="DESKTOP"),   # 데스크톱이 메움
    ])
    rep = detect(base, cur)
    assert any(f.metric.startswith("segment.MOBILE") for f in rep.findings), (
        f"모바일 붕괴를 못 잡았다: {[f.metric for f in rep.findings]}"
    )


def test_direction_matters():
    """전환율이 오른 것과 취소율이 오른 것은 다르다."""
    up_is_bad = Rule("revenue.cancellation_rate", "취소율", worse="up",
                     rel=0.10, abs_=0.01, min_sample=100)
    down_is_bad = Rule("funnel.cvr", "전환율", worse="down",
                       rel=0.10, abs_=0.01, min_sample=100)
    base, cur = frame(1_000, 100, tag="b"), frame(1_000, 300, tag="c")
    assert detect(base, cur, rules=(down_is_bad,)).healthy      # 전환율 상승은 정상
    assert detect(base, cur, rules=(up_is_bad,)).healthy        # 취소율은 안 변했다
