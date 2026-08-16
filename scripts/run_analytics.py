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
    assign, check_srm, check_srm_by, required_sample_size, two_proportion_test,
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
    # 전송 계층의 현실을 켠 채로 돌린다. 중복 전송과 시계 오차가 있어도
    # 퍼널이 부풀지 않아야 한다 — 그게 계약 확장의 목적이다.
    raw, truth = simulate(SimConfig(
        n_visitors=12_000, seed=42,
        duplicate_rate=0.03, clock_skew_rate=0.02,
    ))
    collector = EventCollector()
    result = collector.collect(raw)
    print(f"  수신 {result.total:,}건 → 수용 {len(result.accepted):,} / "
          f"격리 {len(result.quarantined):,} / 중복 {len(result.duplicates):,}")
    print(f"  검증 실패율 {result.failure_rate:.4%}  (목표 < 0.1%)")
    print(f"  재전송 비율 {result.duplicate_rate:.2%} — event_id 로 한 번만 센다")
    skewed = sum(1 for e in collector.store
                 if e.clock_skew and abs(e.clock_skew).total_seconds() > 6 * 3600)
    print(f"  시계가 6시간 넘게 틀어진 이벤트 {skewed:,}건 → 서버 수신 시각으로 정렬")
    if result.quarantined:
        print(f"  격리 사유 예: {result.quarantined[0].reason}")

    # timestamp 는 필드가 아니라 판단 결과다 — 기기 시계가 크게 틀어졌으면
    # 서버 수신 시각을 쓴다. model_dump 에 안 들어오므로 직접 얹는다.
    df = pd.DataFrame([{**e.model_dump(), "timestamp": e.timestamp} for e in collector.store])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["platform"] = df["platform"].map(lambda x: x.value if hasattr(x, "value") else x)
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
    by_key = ", ".join(f"{k} {v:,}" for k, v in rep.stitched_by_key.items() if v)
    print(f"  결합에 쓰인 식별자: {by_key or '없음'}")
    print("  ※ 지금 트래픽은 전부 웹이라 install_id 로 풀린 건이 없다. "
          "앱이 붙으면 그쪽이 채워진다")

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

    # 앱 버전을 SRM 차원에 넣는다. 전체는 멀쩡한데 한 버전만 틀어진 경우를
    # 전체 비율만 봐서는 못 잡는다 — 다른 버전이 그 왜곡을 덮어 가린다.
    ver_col = exposed["app_version"].fillna("web") if "app_version" in exposed else None
    if ver_col is not None:
        by_version: dict[str, dict[str, int]] = {}
        for (ver, variant), grp in exposed.groupby([ver_col, exposed["variant"]]):
            by_version.setdefault(str(ver), {"control": 0, "treatment": 0})
            by_version[str(ver)][str(variant)] = int(grp["_key"].nunique())
        strat = check_srm_by(by_version)
        print(f"  {strat}")
        print("  ※ 지금은 전부 웹이라 층이 하나다. 앱이 붙으면 버전별로 갈린다")

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

    # 운영 콘솔의 그로스 대시보드가 읽는 파일.
    # 콘솔이 파이프라인을 다시 돌리지 않는다 — 여기서 잰 것을 그대로 보여준다.
    import json
    (REPORTS / "growth.json").write_text(json.dumps({
        "measured_by": "scripts/run_analytics.py",
        "collection": {
            "total": int(result.total),
            "accepted": int(len(result.accepted)),
            "quarantined": int(len(result.quarantined)),
            "duplicates": int(len(result.duplicates)),
            "failure_rate": round(float(result.failure_rate), 6),
            "duplicate_rate": round(float(result.duplicate_rate), 6),
        },
        "identity": {
            "sessions": int(df["session_id"].nunique()),
            "stitched_events": int(rep.stitched),
            "stitch_rate": round(float(rep.stitch_rate), 4),
            "stitched_by_key": {k: int(v) for k, v in rep.stitched_by_key.items()},
            "cross_platform_users": int(rep.cross_platform_users),
            "reinstalled_users": int(rep.reinstalled_users),
        },
        "funnel": {
            "steps": [
                # 첫 단계는 직전이 없어 step_rate 가 None 이다. 0 으로 바꾸지 않는다 —
                # "통과율 0%" 와 "직전 단계가 없음" 은 다른 뜻이다.
                {"event": st.event, "users": int(st.users),
                 "step_rate": None if st.step_rate is None else round(float(st.step_rate), 4)}
                for st in steps
            ],
            "cvr": round(float(cvr), 4),
            "biggest_drop": biggest.event,
        },
        "segments": seg.to_dict(orient="records"),
        "experiment": {
            "name": "exp_mobile_sticky_cta",
            "hypothesis": "모바일 상세 페이지에 sticky CTA 를 노출하면 예약 시작률이 오른다",
            "baseline": round(float(baseline), 4),
            "mde": mde,
            "required_per_group": int(n_need),
            "exposed": {k: int(v) for k, v in counts.items()},
            "converted": {k: int(v) for k, v in conv.items()},
            "underpowered": bool(counts["control"] < n_need),
            "relative_lift": round(float(test.relative_lift), 4),
            "p_value": round(float(test.p_value), 6),
            "srm_healthy": bool(srm.healthy),
            "srm_chi_square": round(float(srm.chi_square), 3),
            "planted_lift": float(truth["treatment_lift_on_mobile_booking_started"]),
        },
    }, ensure_ascii=False, indent=2), encoding="utf-8")

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
