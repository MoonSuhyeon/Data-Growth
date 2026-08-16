"""M2 — 앱 세션을 무활동이 아니라 생명주기로 나눈다.

웹에는 "떠났다"는 신호가 없다. 브라우저가 알려주지 않으니 침묵으로 추론할 수밖에
없고, 그래서 30분 무활동을 세션 종료로 본다.

앱은 다르다. 백그라운드로 갔다는 사실을 명시적으로 알려준다. **그리고 그 차이가
실제로 숫자를 가른다** — 앱을 켜둔 채 긴 글을 읽는 사람은 이벤트를 안 보내지만
떠난 게 아니다. 무활동으로 자르면 한 방문이 둘로 쪼개진다.

이 파일은 "백그라운드 20분은 세션 종료인가" 같은 질문에 **코드로 답을 고정한다.**
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd

from analytics.funnel import APP_BACKGROUND_MINUTES, SESSION_GAP_MINUTES, sessionize
from tracking.taxonomy import EventName

T0 = datetime(2025, 6, 1, 10, 0)


def ev(name: EventName, minutes: int, *, platform: str = "WEB",
       install: str | None = None, anon: str = "a1", **kw) -> dict:
    return {
        "event_id": f"e-{anon}-{install or 'web'}-{minutes}",
        "event_name": name.value,
        "anonymous_id": anon,
        "install_id": install,
        "platform": platform,
        "user_id": None,
        "timestamp": T0 + timedelta(minutes=minutes),
        **kw,
    }


def sessions(rows: list[dict]) -> int:
    return sessionize(pd.DataFrame(rows))["session_id"].nunique()


# ─────────────────────────────── 웹 — 규칙이 바뀌지 않았다
def test_web_still_splits_after_30_minutes_of_silence():
    assert sessions([
        ev(EventName.PROPERTY_VIEWED, 0, property_id="P1"),
        ev(EventName.PROPERTY_VIEWED, SESSION_GAP_MINUTES + 1, property_id="P1"),
    ]) == 2


def test_web_stays_one_session_within_the_gap():
    assert sessions([
        ev(EventName.PROPERTY_VIEWED, 0, property_id="P1"),
        ev(EventName.PROPERTY_VIEWED, SESSION_GAP_MINUTES - 1, property_id="P1"),
    ]) == 1


# ─────────────────────────────── 앱 — 질문에 답을 고정한다
def test_app_backgrounded_20_minutes_then_returning_is_ONE_session():
    """**백그라운드 20분은 세션 종료가 아니다.**

    임계(30분) 아래라 돌아온 것으로 본다. 이 답은 임의로 정한 게 아니라
    APP_BACKGROUND_MINUTES 하나에 묶여 있어서, 바꾸려면 그 값을 바꿔야 한다.
    """
    assert sessions([
        ev(EventName.PROPERTY_VIEWED, 0, platform="IOS", install="i1", property_id="P1"),
        ev(EventName.APP_BACKGROUNDED, 1, platform="IOS", install="i1"),
        ev(EventName.APP_FOREGROUNDED, 21, platform="IOS", install="i1"),
        ev(EventName.BOOKING_STARTED, 22, platform="IOS", install="i1", property_id="P1"),
    ]) == 1


def test_app_backgrounded_beyond_the_threshold_is_TWO_sessions():
    """임계를 넘게 백그라운드에 있었으면 종료로 본다."""
    over = APP_BACKGROUND_MINUTES + 5
    assert sessions([
        ev(EventName.PROPERTY_VIEWED, 0, platform="IOS", install="i1", property_id="P1"),
        ev(EventName.APP_BACKGROUNDED, 1, platform="IOS", install="i1"),
        ev(EventName.APP_FOREGROUNDED, 1 + over, platform="IOS", install="i1"),
    ]) == 2


def test_app_left_in_foreground_without_events_is_still_ONE_session():
    """이게 무활동 규칙과 갈리는 지점이다.

    앱을 켜둔 채 45분 동안 아무 이벤트도 없었다. 무활동으로 자르면 두 세션이지만
    사용자는 떠나지 않았다 — 백그라운드 신호가 없었으니 앱 안에 있었다.
    """
    quiet = SESSION_GAP_MINUTES + 15
    rows = [
        ev(EventName.APP_FOREGROUNDED, 0, platform="IOS", install="i1"),
        ev(EventName.PROPERTY_VIEWED, 1, platform="IOS", install="i1", property_id="P1"),
        ev(EventName.BOOKING_STARTED, 1 + quiet, platform="IOS", install="i1",
           property_id="P1"),
        # 신호를 보내는 설치임을 알리기 위해 한 번은 백그라운드가 있어야 한다
        ev(EventName.APP_BACKGROUNDED, 2 + quiet, platform="IOS", install="i1"),
    ]
    assert sessions(rows) == 1, "포그라운드 침묵은 세션 종료가 아니다"

    # 같은 데이터를 웹으로 두면 무활동 규칙이 적용돼 쪼개진다 — 규칙이 다르다는 증거
    as_web = [{**r, "platform": "WEB", "install_id": None} for r in rows
              if r["event_name"] not in ("app_backgrounded", "app_foregrounded")]
    assert sessions(as_web) == 2


# ─────────────────────────────── 신호가 없을 때
def test_app_without_lifecycle_events_falls_back_to_inactivity():
    """생명주기 이벤트를 안 보내는 앱(구버전 등)은 무활동으로 판단한다.

    없는 신호를 있다고 가정하면 그 설치의 모든 이벤트가 영원히 한 세션이 된다.
    """
    assert sessions([
        ev(EventName.PROPERTY_VIEWED, 0, platform="ANDROID", install="i2", property_id="P1"),
        ev(EventName.PROPERTY_VIEWED, SESSION_GAP_MINUTES + 1, platform="ANDROID",
           install="i2", property_id="P1"),
    ]) == 2


# ─────────────────────────────── 세션 키
def test_app_session_is_keyed_by_install_not_anonymous_id():
    """앱은 실행마다 익명 ID 가 바뀔 수 있다. 그걸로 묶으면 한 방문이 쪼개진다."""
    rows = [
        ev(EventName.PROPERTY_VIEWED, 0, platform="IOS", install="i1",
           anon="a1", property_id="P1"),
        ev(EventName.BOOKING_STARTED, 5, platform="IOS", install="i1",
           anon="a2", property_id="P1"),
    ]
    assert sessions(rows) == 1

    # 설치 ID 를 지우면 익명 ID 로 묶이므로 두 세션이 된다
    without = [{**r, "install_id": None} for r in rows]
    assert sessions(without) == 2


def test_session_still_belongs_to_its_start_date_across_midnight():
    """기존 규칙이 앱에서도 유지되는지 — 자정을 넘겨도 시작일에 귀속."""
    base = datetime(2025, 6, 1, 23, 50)
    df = pd.DataFrame([
        {**ev(EventName.PROPERTY_VIEWED, 0, platform="IOS", install="i1", property_id="P1"),
         "timestamp": base},
        {**ev(EventName.APP_BACKGROUNDED, 1, platform="IOS", install="i1"),
         "timestamp": base + timedelta(minutes=5)},
        {**ev(EventName.APP_FOREGROUNDED, 2, platform="IOS", install="i1"),
         "timestamp": base + timedelta(minutes=20)},
    ])
    out = sessionize(df)
    assert out["session_id"].nunique() == 1
    assert out["session_date"].nunique() == 1
    assert out["session_date"].iloc[0] == pd.Timestamp("2025-06-01")


# ─────────────────────────────── 퍼널과의 관계
def test_lifecycle_events_do_not_enter_the_funnel():
    """앱의 상태이지 사용자의 행동이 아니다. 퍼널 단계에 들어가면 안 된다."""
    from tracking.taxonomy import FUNNEL_STEPS, LIFECYCLE_EVENTS
    assert not (set(FUNNEL_STEPS) & LIFECYCLE_EVENTS)
