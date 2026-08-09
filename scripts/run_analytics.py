"""Phase 2~9 파이프라인 — 수집 → 세션화 → 스티칭 → 퍼널 → 세그먼트 → 실험.

    python scripts/run_analytics.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from analytics.collector import EventCollector                    # noqa: E402
from analytics.etl.identity import journey_key, stitch            # noqa: E402
from analytics.experiments.stats import (                         # noqa: E402
    assign, check_srm, required_sample_size, two_proportion_test,
)
from analytics.funnel import by_segment, compute, sessionize, to_frame   # noqa: E402
from analytics.simulator import SimConfig, simulate               # noqa: E402
from tracking.taxonomy import EventName                           # noqa: E402

BAR = "=" * 72
REPORTS = ROOT / "reports"


def main() -> int:
    pd.set_option("display.width", 120)
    REPORTS.mkdir(exist_ok=True)

    print(BAR)
    print("Phase 2~3  이벤트 수집 — 검증 실패는 격리한다")
    raw, truth = simulate(SimConfig(n_visitors=12_000, seed=42))
    collector = EventCollector()
    result = collector.collect(raw)
    print(f"  수신 {result.total:,}건 → 수용 {len(result.accepted):,} / "
          f"격리 {len(result.quarantined):,}")
    print(f"  검증 실패율 {result.failure_rate:.4%}  (목표 < 0.1%)")
    if result.quarantined:
        print(f"  격리 사유 예: {result.quarantined[0].reason}")

    df = pd.DataFrame([e.model_dump() for e in collector.store])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["event_name"] = df["event_name"].map(lambda x: x.value if hasattr(x, "value") else x)
    df["device_type"] = df["device_type"].map(lambda x: x.value if hasattr(x, "value") else x)
    df["variant"] = df["properties"].map(lambda p: (p or {}).get("variant"))

    print()
    print(BAR)
    print("Phase 5  세션화 · 아이덴티티 스티칭")
    df = sessionize(df)
    print(f"  세션 {df['session_id'].nunique():,}개 "
          f"(평균 {len(df) / df['session_id'].nunique():.1f} 이벤트/세션)")

    df, rep = stitch(df)
    print(f"  {rep}")
    print(f"  → 로그인 이전 익명 이벤트 {rep.stitched:,}건이 회원 여정에 소급 결합됐다")

    print()
    print(BAR)
    print("Phase 6  예약 퍼널")
    steps = compute(df)
    f = to_frame(steps)
    f["step_rate"] = f["step_rate"].map(lambda v: f"{v:.1%}" if pd.notna(v) else "—")
    f["overall_rate"] = f["overall_rate"].map(lambda v: f"{v:.1%}")
    print(f.to_string(index=False))
    cvr = steps[-1].overall_rate
    print(f"\n  최종 전환율 {cvr:.2%}")

    biggest = max(steps[1:], key=lambda s: s.drop)
    print(f"  최대 이탈 구간: {biggest.event} (직전 대비 {biggest.step_rate:.1%}, "
          f"{biggest.drop:,}명 이탈)")

    print()
    print(BAR)
    print("Phase 8  세그먼트 분석 — 전체 평균이 가리는 것")
    seg = by_segment(df, "device_type")
    show = seg[["device_type", "top_users", "cvr", "booking_started_rate"]].copy()
    show["cvr"] = show["cvr"].map(lambda v: f"{v:.2%}")
    show["booking_started_rate"] = show["booking_started_rate"].map(lambda v: f"{v:.1%}")
    print(show.to_string(index=False))

    mobile = seg[seg["device_type"] == "MOBILE"].iloc[0]
    desktop = seg[seg["device_type"] == "DESKTOP"].iloc[0]
    gap = desktop["booking_started_rate"] - mobile["booking_started_rate"]
    print(f"\n  모바일 예약 시작률이 데스크톱보다 {gap:.1%}p 낮다 → CRO 가설의 출발점")

    print()
    print(BAR)
    print("Phase 9  A/B 실험 — 설계가 먼저다")
    baseline = float(mobile["booking_started_rate"])
    mde = 0.10
    n_need = required_sample_size(baseline, mde=mde, alpha=0.05, power=0.80)
    print(f"  가설   모바일 상세 페이지에 sticky CTA 를 노출하면 예약 시작률이 오른다")
    print(f"  기준선 {baseline:.2%} · MDE {mde:.0%}(상대) · α 0.05 · power 0.80")
    print(f"  → 그룹당 필요 표본 {n_need:,}명")

    mob = df[df["device_type"] == "MOBILE"].copy()
    mob["_key"] = journey_key(mob)
    exposed = mob[mob["event_name"] == EventName.PROPERTY_VIEWED.value]
    started = set(mob.loc[mob["event_name"] == EventName.BOOKING_STARTED.value, "_key"])

    counts, conv = {}, {}
    for variant in ("control", "treatment"):
        keys = set(exposed.loc[exposed["variant"] == variant, "_key"])
        counts[variant] = len(keys)
        conv[variant] = len(keys & started)

    print(f"\n  노출 control {counts['control']:,} / treatment {counts['treatment']:,}")
    srm = check_srm(counts)
    print(f"  {srm}")

    if counts["control"] < n_need:
        print(f"  ⚠ 표본 부족 ({counts['control']:,} < {n_need:,}) — "
              f"실제 운영이라면 여기서 결론을 내지 않는다")

    test = two_proportion_test(conv["control"], counts["control"],
                               conv["treatment"], counts["treatment"])
    print(f"  {test}")
    print(f"  심어둔 실제 효과: 모바일 예약 시작률 +{truth['treatment_lift_on_mobile_booking_started']:.0%}")

    print()
    print("  SRM 검출 확인 — 배정이 55:45 로 틀어진 경우")
    bad_raw, _ = simulate(SimConfig(n_visitors=6_000, seed=9, weights=(0.55, 0.45)))
    bad_counts = {"control": 0, "treatment": 0}
    seen = set()
    for e in bad_raw:
        a = e["anonymous_id"]
        if a in seen:
            continue
        seen.add(a)
        bad_counts[assign(a, "exp_mobile_sticky_cta", weights=(0.55, 0.45))] += 1
    bad_srm = check_srm(bad_counts)
    print(f"    {bad_counts} → {bad_srm}")
    print("    → 50:50 을 기대했는데 배정이 틀어졌다. 결과 해석을 멈춰야 한다.")

    to_frame(steps).to_csv(REPORTS / "funnel.csv", index=False)
    seg.to_csv(REPORTS / "segment_device.csv", index=False)

    print()
    print(BAR)
    print("요약")
    print(f"  이벤트 {result.total:,}건 · 검증 실패율 {result.failure_rate:.4%}")
    print(f"  스티칭 성공률 {rep.stitch_rate:.2%}")
    print(f"  최종 전환율 {cvr:.2%} · 최대 이탈 {biggest.event}")
    print(f"  모바일 실험 {test.relative_lift:+.1%} (p={test.p_value:.4f})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
