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

    for _ in range(cfg.n_visitors):
        anon = f"anon-{uuid.UUID(int=rng.getrandbits(128)).hex[:12]}"
        device = _pick_device(rng)
        # 기본값은 전부 웹이다. 앱이 없으니 모바일 58% 도 모바일 브라우저다.
        # app_share 를 켜면 앱 트래픽을 섞어 파이프라인 쪽을 미리 확인할 수 있다.
        if rng.random() < cfg.app_share:
            platform = Platform.IOS if rng.random() < 0.5 else Platform.ANDROID
            device = DeviceType.MOBILE  # 앱은 모바일 기기에서만 돈다
        else:
            platform = Platform.WEB
        install_id = f"inst-{uuid.UUID(int=rng.getrandbits(128)).hex[:12]}"
        app_version = rng.choice(("1.0.0", "1.1.0", "1.2.0")) 
        region = rng.choice(REGIONS)
        variant = assign(anon, cfg.experiment_id,
                         weights=cfg.weights)
        t = start + timedelta(
            days=rng.randrange(cfg.days),
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
        uid: str | None = None

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
        if rng.random() < LOGIN_PROB:
            user_seq += 1
            uid = f"U{user_seq:06d}"
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
