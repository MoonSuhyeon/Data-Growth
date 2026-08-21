"""외부 관측 분석 데모 — **여기서는 "일으켰다" 를 쓸 수 없다.**

    python scripts/run_external_demo.py

같은 저장소 안에 두 체제가 있다.

    analytics/experiments/  1차 데이터, 무작위 배정, 홀드아웃
    analytics/causal/       3자 데이터, 배정 없음, 골라야 하는 대조군

두 번째에서 낼 수 있는 가장 센 문장이 첫 번째보다 얼마나 약한지를 보여 준다.
그 차이가 `docs/external-market-report.md` 가 쓸 값어치가 있다고 본 지점이다.
"""
from __future__ import annotations

import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from analytics.causal import did, pretrend  # noqa: E402
from analytics.external.series import (ExternalSeries, FetchWindow,  # noqa: E402
                                       Observation, ScaleKind, align)
from analytics.preregistration import load  # noqa: E402

BAR = "=" * 78
CAMPAIGN = date(2024, 7, 1)
WINDOW = FetchWindow(date(2023, 11, 1), date(2024, 12, 31), date(2026, 8, 21))
WOBBLE = (0.4, -0.3, 0.2, -0.5, 0.3, -0.2, 0.5, -0.4)


def brand(name: str, drift: float, lift: float) -> ExternalSeries:
    """검색량 지수 한 계열. 개입 전 8개월, 개입 후 6개월."""
    obs = []
    for i in range(8):
        w = WOBBLE[i % len(WOBBLE)]
        obs.append(Observation(CAMPAIGN - timedelta(days=30 * (8 - i)),
                               60 + 2.0 * i + drift * i + w))
    for i in range(6):
        obs.append(Observation(CAMPAIGN + timedelta(days=30 * i),
                               60 + 2.0 * (8 + i) + drift * (8 + i) + lift))
    return ExternalSeries("datalab", name, WINDOW, ScaleKind.RELATIVE_INDEX,
                          "index", obs)


def scenario(title: str, drift: float, lift: float) -> None:
    a = brand("숙박 플랫폼 A", drift, lift)
    b = brand("숙박 플랫폼 B", 0.0, 0.0)
    rows = align(a, b)

    print(f"\n── {title}")
    gate = pretrend.check(rows, CAMPAIGN)
    print(f"   문턱: {gate}")
    result = did.estimate(rows, CAMPAIGN, gate)
    print(f"   추정: {result}")
    print(f"   문장: {result.statement}")


def main() -> int:
    prereg = load("obs_lodging_campaign")

    print(BAR)
    print("외부 관측 분석 — 사전등록 → 문턱 → 추정")
    print(BAR)
    print(f"  사전등록  {prereg.id} ({prereg.kind}, {prereg.registered_at})")
    print(f"  방법      {prereg.design['method']}")
    print(f"  개입일    {prereg.design['intervention_date']} — 결과를 보고 옮기지 않는다")
    print(f"  문턱      평행추세, 최소 사전 {prereg.gates['min_pre_periods']}기, "
          f"허용 차이 {prereg.gates['pretrend_tolerance']:.0%}")

    print()
    print(BAR)
    print("두 계열의 조회 창이 같아야 한다")
    print(BAR)
    other = FetchWindow(date(2024, 1, 1), date(2025, 6, 30), date(2026, 8, 21))
    try:
        align(brand("A", 0.0, 10.0),
              ExternalSeries("datalab", "B", other, ScaleKind.RELATIVE_INDEX, "index",
                             [Observation(date(2024, 6, 1), 70.0)]))
    except ValueError as e:
        print(f"  거절: {e}")

    print()
    print(BAR)
    print("문턱이 추정을 막는가")
    print(BAR)
    scenario("개입 전 나란히 움직였다 (+10 을 심었다)", drift=0.0, lift=10.0)
    scenario("개입 전부터 벌어지고 있었다 (같은 +10)", drift=1.5, lift=10.0)

    print("\n" + BAR)
    print("두 번째에서도 개입 후 차이는 +10 그대로다. 그런데 추정하지 않는다 —")
    print("그 +10 이 캠페인 때문인지 원래 벌어지던 추세인지 이 설계로는 못 가른다.")
    print("주석을 달고 계수를 내놓는 방식은 쓰지 않는다. 읽는 사람은 계수를 읽고")
    print("단서는 안 읽기 때문이다.")
    print()
    print("문턱을 지나도 '일으켰다' 는 안 나온다. 무작위 배정이 없으면 그 단어를")
    print("쓸 자격이 없고, 자격 없는 단어를 못 쓰게 하는 것이 이 모듈의 전부다.")
    print(BAR)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
