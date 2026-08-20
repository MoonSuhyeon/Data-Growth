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
from analytics.features import AWAITING_APP, adoption, unused            # noqa: E402
from analytics.funnel import by_segment, compute, sessionize, to_frame   # noqa: E402
from analytics.retention import churn, label_visits, retention           # noqa: E402
from analytics.targets import evaluate as evaluate_targets               # noqa: E402
from analytics.targets import summary as target_summary                  # noqa: E402
from analytics.revenue import by_segment as revenue_by_segment           # noqa: E402
from analytics.revenue import cohort_revenue, summarize                  # noqa: E402
from analytics.retention import to_frame as retention_frame              # noqa: E402
from analytics.simulator import PROPERTY_CATALOG, SimConfig, simulate   # noqa: E402
from tracking.taxonomy import FUNNEL_STEPS, EventName             # noqa: E402

BAR = "=" * 72
REPORTS = ROOT / "reports"


def _fmt(seg, axis: str, first: str = "booking_started_rate"):
    """세그먼트 표를 읽을 수 있게 만든다.

    축마다 컬럼 이름이 달라서 포맷을 세 번 쓰게 되는데, 그러면 한 곳만 고치고
    나머지를 놓친다. 같은 표는 같은 함수로 찍는다.
    """
    cols = [axis, "top_users", "cvr"] + ([first] if first in seg.columns else [])
    show = seg[cols].copy()
    show["cvr"] = show["cvr"].map(lambda v: f"{v:.2%}")
    if first in show.columns:
        show[first] = show[first].map(lambda v: f"{v:.1%}")
    return show


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
    # 숙소 유형은 이벤트에 없다. 차원 테이블에서 조인해 온다 — 사실과 속성을
    # 나눠 둔 대가이자 이유다.
    df["property_type"] = df["property_id"].map(
        lambda pid: (PROPERTY_CATALOG.get(pid) or {}).get("property_type")
    )

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

    # 재방문 라벨은 **스티칭 뒤에** 붙인다. 앞에 붙이면 로그인 전 방문과 로그인 후
    # 방문이 서로 다른 사람으로 갈리고, 돌아온 사람이 신규로 세어진다 — 스티칭이
    # 이으려던 바로 그 연결을 라벨이 다시 끊는 셈이다.
    #
    # 그리고 이건 이벤트가 아니라 분석이 붙이는 값이다. 클라이언트가 자기 방문
    # 순번을 알아야 한다면 쿠키가 지워지는 순간 그 값이 거짓이 된다.
    df = label_visits(df)
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
    print(_fmt(seg, "device_type").to_string(index=False))

    mobile = seg[seg["device_type"] == "MOBILE"].iloc[0]
    desktop = seg[seg["device_type"] == "DESKTOP"].iloc[0]
    gap = desktop["booking_started_rate"] - mobile["booking_started_rate"]
    print(f"\n  모바일 예약 시작률이 데스크톱보다 {gap:.1%}p 낮다 → CRO 가설의 출발점")

    # ── 축이 하나뿐이면 "평균이 가리는 것을 드러낸다"가 반쪽이다.
    #    디바이스만 보면 채널 문제는 보이지만 **무엇을 파느냐**는 안 보인다.
    print("\n  지역별")
    reg = by_segment(df, "region")
    print(_fmt(reg, "region").to_string(index=False))

    # 상품 축은 퍼널 시작점이 다르다. `search_performed` 에는 숙소가 없어서
    # 어느 유형에도 귀속되지 않는다 — 그대로 쪼개면 모든 유형의 1단계가 0 이 된다.
    print("\n  숙소 유형별 (조회부터 — 검색은 숙소에 귀속되지 않는다)")
    pt = by_segment(df, "property_type", steps=FUNNEL_STEPS[1:])
    print(_fmt(pt, "property_type", first="booking_started_rate").to_string(index=False))

    print("\n  신규 vs 재방문")
    vt = by_segment(df, "visit_type")
    print(_fmt(vt, "visit_type").to_string(index=False))

    print()
    print(BAR)
    print("Phase 8b  리텐션 — 온 사람이 다시 오는가")
    ret = retention(df)
    print(f"  사람 {ret.people:,}명 · 세션 {ret.sessions:,}개 "
          f"(1인당 {ret.sessions / ret.people:.2f})")
    print(f"  재방문율 {ret.return_rate:.1%}")
    rf = retention_frame(ret).copy()
    rf["return_rate"] = rf["return_rate"].map(lambda v: f"{v:.1%}")
    print(rf.to_string(index=False))
    print("  ※ 마지막 코호트는 다시 올 시간이 없었을 뿐이다 — 제품이 나빠진 게 아니다")

    ch = churn(df, within_days=7)
    print()
    print("  D+7 이탈률 (창을 같게 맞춰야 코호트끼리 비교된다)")
    show_ch = ch.copy()
    show_ch["d7_churn_rate"] = show_ch["d7_churn_rate"].map(lambda v: f"{v:.1%}")
    print(show_ch.to_string(index=False))
    print("  ※ 7일이 안 찬 코호트는 뺐다 — 넣으면 이탈률이 100% 가까이 나온다")

    print()
    print(BAR)
    print("Phase 8c  매출 — 샀는가가 아니라 얼마어치 샀는가")
    rev = summarize(df)
    print(f"  총매출 {rev.gross_revenue:,}원 · 주문 {rev.orders:,}건 · "
          f"구매자 {rev.buyers:,}/{rev.people:,}명 ({rev.purchase_rate:.1%})")
    print(f"  AOV {rev.aov:,.0f}원 (주문당) · ARPPU {rev.arppu:,.0f}원 (구매자당) · "
          f"ARPU {rev.arpu:,.0f}원 (방문자당)")
    print(f"  순매출 {rev.net_revenue:,}원 (환불 {rev.refunded:,}원 · "
          f"취소 {rev.cancellations:,}건, 주문 대비 {rev.cancellation_rate:.1%})")
    print("  ※ AOV·ARPU 는 총매출 기준이다 — 주문 시점의 값이고 환불은 나중에 일어난다")
    print("  ※ ARPU 를 LTV 라고 부르지 않는다 — 30일 창에서 잰 값이고 생애가 아니다")

    print()
    print("  디바이스별 매출 — 전환율이 같아도 객단가는 다를 수 있다")
    print(revenue_by_segment(df, "device_type").to_string(index=False))

    cr = cohort_revenue(df, within_days=7)
    print()
    print("  코호트별 D+7 누적 1인당 매출 — LTV 로 갈 수 있는 정직한 형태")
    print(cr.to_string(index=False))

    print()
    print(BAR)
    print("Phase 8e  목표 대조 — 선을 먼저 긋고 재는 것")
    mobile_rate = float(seg.loc[seg["device_type"] == "MOBILE", "booking_started_rate"].iloc[0])
    measured = {
        "funnel.cvr": float(cvr),
        "funnel.mobile_booking_started": mobile_rate,
        "retention.return_rate": float(ret.return_rate),
        "revenue.arpu": float(rev.arpu),
        "collection.failure_rate": float(result.failure_rate),
        "revenue.cancellation_rate": float(rev.cancellation_rate),
    }
    tgt_rows = evaluate_targets(measured)
    MARK = {"met": "달성", "below": "미달", "breach": "이탈", "unknown": "미측정"}
    for r in tgt_rows:
        v = r["value"]
        shown = "-" if v is None else (f"{v:,.0f}원" if r["unit"] == "won" else f"{v:.2%}")
        goal = f"{r['goal']:,.0f}원" if r["unit"] == "won" else f"{r['goal']:.2%}"
        print(f"  [{MARK[r['status']]}] {r['label']:16} {shown:>10}  (목표 {goal})")
    tsum = target_summary(tgt_rows)
    print(f"  달성 {tsum['met']} · 미달 {tsum['below']} · 이탈 {tsum['breach']}")
    print("  ※ '미달' 은 개선 과제, '이탈' 은 사고다 — 한 색으로 뭉개지 않는다")

    print()
    print(BAR)
    print("Phase 8d  기능 사용률 — 퍼널에 안 들어가는 것들")
    ad = adoption(df)
    show_ad = ad.copy()
    show_ad["adoption_rate"] = show_ad["adoption_rate"].map(lambda v: f"{v:.1%}")
    print(show_ad.to_string(index=False))
    print("  ※ 분모는 전체가 아니라 **그 기능에 닿을 수 있었던 사람**이다")
    missing = unused(df, expected=set(AWAITING_APP))
    if missing:
        print(f"  ⚠ 계약에 정의됐는데 한 번도 발생하지 않은 이벤트: {', '.join(missing)}")
    else:
        print("  계약에 정의된 이벤트가 전부 발생한다 (앱 생명주기 2종은 앱을 기다리는 중)")

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
        # 축을 하나만 내보내면 콘솔도 축이 하나가 된다. 축 이름을 키로 쓴다 —
        # 나중에 축이 늘어도 콘솔이 순회만 하면 되도록.
        "segments": seg.to_dict(orient="records"),
        "segments_by": {
            "device_type": seg.to_dict(orient="records"),
            "region": reg.to_dict(orient="records"),
            # 상품 축은 조회부터 센다. 검색은 숙소에 귀속되지 않아서 같은
            # 분모를 쓸 수 없다 — 그 사실을 콘솔이 알아야 표에 적을 수 있다.
            "property_type": pt.to_dict(orient="records"),
            "visit_type": vt.to_dict(orient="records"),
        },
        "segments_note": {
            "property_type": "검색은 숙소에 귀속되지 않아 조회(property_viewed)부터 센다",
            "visit_type": "스티칭 이후에 판정한다 — 로그인 전후 방문이 갈리면 돌아온 사람이 신규로 세어진다",
        },
        "retention": {
            "people": int(ret.people),
            "returned": int(ret.returned),
            "sessions": int(ret.sessions),
            "return_rate": round(float(ret.return_rate), 4),
            "cohorts": [
                {"cohort": c, "people": int(n), "returned": int(r),
                 "return_rate": round(r / n, 4) if n else 0.0}
                for c, (n, r) in ret.by_cohort.items()
            ],
            # 마지막 코호트가 낮은 건 제품 문제가 아니라 관측 창 문제다.
            # 화면이 이걸 안 적으면 읽는 사람이 리텐션이 무너졌다고 읽는다.
            "note": "마지막 코호트는 다시 올 시간이 적었다 (우측 절단)",
            # 창을 7일로 고정한 이탈률. 창이 안 찬 코호트는 빠져 있다.
            "churn_d7": ch.to_dict(orient="records"),
        },
        "revenue": {
            "gross_revenue": int(rev.gross_revenue),
            "orders": int(rev.orders),
            "buyers": int(rev.buyers),
            "people": int(rev.people),
            "purchase_rate": round(float(rev.purchase_rate), 4),
            # 셋을 따로 내보낸다. 하나만 주면 화면이 어느 정의인지 모른다.
            "aov": float(rev.aov),
            "arppu": float(rev.arppu),
            "arpu": float(rev.arpu),
            "by_device": revenue_by_segment(df, "device_type").to_dict(orient="records"),
            "cohort_d7": cr.to_dict(orient="records"),
            "refunded": int(rev.refunded),
            "net_revenue": int(rev.net_revenue),
            "cancellations": int(rev.cancellations),
            "cancellation_rate": round(float(rev.cancellation_rate), 4),
            "notes": [
                "AOV·ARPU 는 총매출 기준이다 — 주문 시점의 값이고 환불은 나중에 일어난다",
                "ARPU 를 LTV 라고 부르지 않는다 — 30일 창에서 잰 값이고 생애가 아니다",
            ],
        },
        "targets": {
            "rows": tgt_rows,
            "summary": tsum,
            # 목표가 코드가 아니라 파일에 있다는 사실을 화면도 알려야 한다.
            "declared_in": "analytics/targets.py",
        },
        "features": {
            "rows": ad.to_dict(orient="records"),
            # 분모가 무엇인지 화면이 같이 말해야 한다. 안 그러면 읽는 사람이
            # 전체 방문자로 나눈 값이라고 오해한다.
            "note": "분모는 전체가 아니라 그 기능에 닿을 수 있었던 사람이다",
            "never_emitted": missing,
            "awaiting_app": sorted(AWAITING_APP),
        },
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
