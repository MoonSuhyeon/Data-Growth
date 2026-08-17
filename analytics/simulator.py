"""사용자 여정 시뮬레이터.

실제 서비스 트래픽 대신 쓰는 합성 데이터다. 분석 파이프라인이 옳은지 검증하려면
**정답을 아는 데이터**가 필요하다. 시뮬레이터는 다음을 의도적으로 심는다.

- 단계별 이탈 (퍼널이 실제로 좁아진다)
- 모바일의 낮은 예약 시작률 (세그먼트 분석이 찾아내야 할 신호)
- 여정 중간의 로그인 (스티칭이 붙여야 할 구간)
- 스키마가 깨진 이벤트 (격리가 잡아내야 할 대상)
"""
from __future__ import annotations

import random
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta

from analytics.experiments.stats import assign
from tracking.taxonomy import DeviceType, EventName, Platform

REGIONS = ("Seoul", "Busan", "Jeju", "Gangneung", "Gyeongju")
PROPERTY_TYPES = ("APARTMENT", "HOTEL", "GUESTHOUSE", "PENSION", "HOUSE")


def _build_catalog(n: int = 100) -> dict[str, dict[str, str]]:
    """숙소 목록 — **차원 테이블이지 이벤트가 아니다.**

    유형을 이벤트에 싣지 않은 것이 의도다. 숙소 유형은 **숙소의 속성이지 행동의
    사실이 아니다.** 이벤트에 박아 두면 숙소가 재분류되는 순간 과거 이벤트가
    거짓이 되고, 그걸 되돌릴 방법이 없다. 사실은 이벤트에, 속성은 여기에 둔다.

    난수도 시뮬레이션과 분리했다. 재고는 실험마다 바뀌는 게 아니라 주어진
    것이고, 여기서 ``cfg.seed`` 를 쓰면 난수 소비 순서가 밀려 이미 보고한
    퍼널·실험 수치가 전부 달라진다.
    """
    rng = random.Random(20250601)
    return {
        f"P{i:04d}": {"property_type": rng.choice(PROPERTY_TYPES)}
        for i in range(1, n + 1)
    }


#: ``property_id`` → 속성. 분석 쪽이 이걸 조인해서 상품 축을 만든다.
PROPERTY_CATALOG = _build_catalog()

# 단계별 통과 확률 (기본값). 모바일은 예약 시작에서 크게 떨어진다.
BASE_RATES = {
    EventName.PROPERTY_VIEWED: 0.62,
    EventName.BOOKING_STARTED: 0.34,
    EventName.PAYMENT_STARTED: 0.61,
    EventName.BOOKING_COMPLETED: 0.76,
}
DEVICE_MULTIPLIER = {
    DeviceType.MOBILE: {EventName.BOOKING_STARTED: 0.66},   # ← 심어둔 문제
    DeviceType.DESKTOP: {},
    DeviceType.TABLET: {EventName.BOOKING_STARTED: 0.85},
}
DEVICE_MIX = ((DeviceType.MOBILE, 0.58), (DeviceType.DESKTOP, 0.33), (DeviceType.TABLET, 0.09))

LOGIN_PROB = 0.72          # 예약 시작 시점에 로그인할 확률
BROKEN_EVENT_RATE = 0.004  # 스키마가 깨진 이벤트 비율


@dataclass
class SimConfig:
    n_visitors: int = 12_000
    days: int = 28
    seed: int = 42
    experiment_id: str = "exp_mobile_sticky_cta"
    # treatment 가 모바일 예약 시작률에 주는 상대 효과
    treatment_lift: float = 0.18
    # SRM 을 일부러 만들 때 쓰는 배정 가중치
    weights: tuple[float, float] = (0.5, 0.5)

    # --- 전송 계층의 현실 --------------------------------------------
    # 오프라인 버퍼와 재시도가 있으면 같은 이벤트가 두 번 도착한다.
    # 예외가 아니라 정상 동작이라, 파이프라인이 이걸 견디는지 확인해야 한다.
    duplicate_rate: float = 0.0
    # 기기 시계가 틀어진 비율. 앱에서는 흔하고, 그대로 믿으면 순서가 무너진다.
    clock_skew_rate: float = 0.0
    clock_skew_hours: float = 30.0

    # 앱에서 들어오는 방문자 비율. **기본값은 0 이다 — 지금 앱이 없다.**
    # 파이프라인이 앱 트래픽을 받을 수 있는지 확인할 때만 켠다.
    app_share: float = 0.0

    # 이미 왔던 사람이 다시 오는 비율.
    #
    # **0 이면 스티칭이 시험되지 않는다.** 모든 방문자가 한 번에 끝나면 익명으로
    # 둘러보다 나중에 로그인하는 사람이 없고, 그러면 "로그인 전 행동을 소급해서
    # 잇는다"는 이 파이프라인의 핵심 주장이 검증되지 않는다. 쉬운 경우만 도는
    # 데이터로 어려운 주장을 하는 셈이다.
    returning_rate: float = 0.28
    # 재방문까지 걸리는 날. 세션 경계와 코호트 리텐션이 여기에 달렸다.
    return_gap_days: tuple[int, int] = (1, 14)


def _pick_device(rng: random.Random) -> DeviceType:
    r = rng.random()
    acc = 0.0
    for d, w in DEVICE_MIX:
        acc += w
        if r < acc:
            return d
    return DeviceType.DESKTOP


def simulate(cfg: SimConfig | None = None) -> tuple[list[dict], dict]:
    """이벤트 원본(dict)과 정답 메타데이터를 만든다.

    Returns:
        (raw_events, truth) — truth 에는 심어둔 효과가 들어 있다.
    """
    cfg = cfg or SimConfig()
    rng = random.Random(cfg.seed)
    start = datetime(2025, 6, 1)
    events: list[dict] = []
    user_seq = 0

    # 이미 다녀간 사람들. 재방문은 여기서 고른다.
    #
    # 기기·플랫폼을 사람에 고정한 것은 단순화다. 실제로는 집에서 폰, 회사에서
    # 데스크톱으로 오는 사람이 있고 그게 디바이스 귀속을 어렵게 만든다 — 그건
    # 크로스 디바이스 문제라 `app_share` 쪽에서 따로 다룬다.
    people: list[dict] = []

    for _ in range(cfg.n_visitors):
        person = None
        day: int | None = None

        if people and rng.random() < cfg.returning_rate:
            candidate = people[rng.randrange(len(people))]
            lo, hi = cfg.return_gap_days
            when = candidate["last_day"] + rng.randint(lo, hi)
            if when < cfg.days:
                person, day = candidate, when
            # 관측 기간을 넘으면 **그 방문은 일어나지 않은 것으로 둔다.**
            #
            # 끝날짜로 깎으면 늦게 온 코호트일수록 재방문율이 높아 보인다 — 돌아올
            # 시간이 없었던 사람까지 마지막 날 돌아온 것으로 기록되기 때문이다.
            # 실제로는 반대다. 관측 창 끝에 걸린 사람은 아직 안 돌아온 것이고,
            # 그 우측 절단이 코호트를 나눠 봐야 하는 이유 그 자체다.

        anon = person["anon"] if person else f"anon-{uuid.UUID(int=rng.getrandbits(128)).hex[:12]}"
        device = person["device"] if person else _pick_device(rng)
        # 기본값은 전부 웹이다. 앱이 없으니 모바일 58% 도 모바일 브라우저다.
        # app_share 를 켜면 앱 트래픽을 섞어 파이프라인 쪽을 미리 확인할 수 있다.
        if person:
            platform = person["platform"]
            install_id = person["install_id"]
            app_version = person["app_version"]
            region = person["region"]
        else:
            if rng.random() < cfg.app_share:
                platform = Platform.IOS if rng.random() < 0.5 else Platform.ANDROID
                device = DeviceType.MOBILE  # 앱은 모바일 기기에서만 돈다
            else:
                platform = Platform.WEB
            install_id = f"inst-{uuid.UUID(int=rng.getrandbits(128)).hex[:12]}"
            app_version = rng.choice(("1.0.0", "1.1.0", "1.2.0"))
            region = rng.choice(REGIONS)

        # 배정은 익명 ID 의 결정적 해시다. 재방문이어도 **같은 군에 들어간다** —
        # 그러지 않으면 한 사람의 행동이 두 군에 흩어져 실험이 무의미해진다.
        variant = assign(anon, cfg.experiment_id, weights=cfg.weights)

        if day is None:
            day = rng.randrange(cfg.days)
        t = start + timedelta(
            days=day,
            hours=rng.randrange(7, 24),
            minutes=rng.randrange(60),
        )

        def emit(name: EventName, ts: datetime, uid: str | None, **extra) -> None:
            # 서버가 받은 시각. 실제로는 수집기가 찍지만 시뮬레이션에서는
            # 서버도 우리가 흉내 내야 해서 여기서 만든다.
            received = ts + timedelta(seconds=rng.uniform(0.2, 3.0))

            # 기기 시계가 틀어진 경우. 클라이언트가 말하는 시각만 바뀌고
            # 실제 발생 순서는 그대로다 — 그대로 믿으면 순서가 뒤집힌다.
            sent = ts
            if rng.random() < cfg.clock_skew_rate:
                sent = ts - timedelta(hours=cfg.clock_skew_hours)

            ev = {
                "event_id": uuid.UUID(int=rng.getrandbits(128)).hex,
                "event_name": name.value,
                "anonymous_id": anon,
                "user_id": uid,
                "sent_at": sent.isoformat(),
                "received_at": received.isoformat(),
                "platform": platform.value,
                "device_type": device.value,
                "region": region,
                "properties": {"variant": variant},
            }
            if platform is not Platform.WEB:
                ev["install_id"] = install_id
                ev["app_version"] = app_version
            ev.update(extra)
            # 일부 이벤트는 필수 속성을 일부러 빠뜨린다 → 격리 대상
            if rng.random() < BROKEN_EVENT_RATE:
                for f in ("property_id", "search_id", "booking_id"):
                    ev.pop(f, None)
            events.append(ev)
            # 재전송. 같은 event_id 로 한 번 더 보낸다.
            if rng.random() < cfg.duplicate_rate:
                events.append(dict(ev))

        search_id = f"srch-{rng.randrange(10**9)}"
        prop_id = f"P{rng.randrange(1, 101):04d}"
        # 지난 방문에서 로그인했으면 이번에는 처음부터 회원이다. 아니면 익명으로
        # 시작하고, 이번에 로그인하면 **지난 방문의 익명 이벤트까지** 소급해서
        # 이어져야 한다 — 스티칭이 실제로 어려운 경우가 이것이다.
        uid: str | None = person["user_id"] if person else None

        if person:
            person["last_day"] = day
            person["visits"] += 1
        else:
            person = {
                "anon": anon, "device": device, "platform": platform,
                "install_id": install_id, "app_version": app_version,
                "region": region, "user_id": None, "last_day": day, "visits": 1,
            }
            people.append(person)

        emit(EventName.SEARCH_PERFORMED, t, uid, search_id=search_id)

        if rng.random() >= BASE_RATES[EventName.PROPERTY_VIEWED]:
            continue
        t += timedelta(minutes=rng.randrange(1, 6))
        emit(EventName.PROPERTY_VIEWED, t, uid, property_id=prop_id, search_id=search_id)

        # 예약 시작 — 디바이스 효과와 실험 효과가 여기에 걸린다
        p = BASE_RATES[EventName.BOOKING_STARTED]
        p *= DEVICE_MULTIPLIER[device].get(EventName.BOOKING_STARTED, 1.0)
        if variant == "treatment" and device is DeviceType.MOBILE:
            p *= 1 + cfg.treatment_lift
        if rng.random() >= min(p, 0.99):
            continue

        # 이 시점에 로그인한다 → 앞선 이벤트는 익명으로 남아 있다
        if uid is None and rng.random() < LOGIN_PROB:
            user_seq += 1
            uid = f"U{user_seq:06d}"
            person["user_id"] = uid
        t += timedelta(minutes=rng.randrange(1, 9))
        emit(EventName.BOOKING_STARTED, t, uid, property_id=prop_id)

        if rng.random() >= BASE_RATES[EventName.PAYMENT_STARTED]:
            continue
        t += timedelta(minutes=rng.randrange(1, 5))
        emit(EventName.PAYMENT_STARTED, t, uid, property_id=prop_id)

        if rng.random() >= BASE_RATES[EventName.BOOKING_COMPLETED]:
            continue
        t += timedelta(minutes=rng.randrange(1, 4))
        emit(
            EventName.BOOKING_COMPLETED, t, uid,
            property_id=prop_id,
            booking_id=f"B{rng.randrange(10**8):08d}",
            amount=rng.randrange(6, 30) * 10_000,
        )

    truth = {
        "experiment_id": cfg.experiment_id,
        "treatment_lift_on_mobile_booking_started": cfg.treatment_lift,
        "mobile_booking_started_multiplier": DEVICE_MULTIPLIER[DeviceType.MOBILE][
            EventName.BOOKING_STARTED
        ],
        "login_prob_at_booking_started": LOGIN_PROB,
        "broken_event_rate": BROKEN_EVENT_RATE,
        "n_visitors": cfg.n_visitors,
    }
    return events, truth


__all__ = ["BASE_RATES", "DEVICE_MULTIPLIER", "SimConfig", "simulate"]
