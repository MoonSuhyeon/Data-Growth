"""매출 지표.

이벤트에 ``amount`` 가 실려 오는데 지금껏 아무도 읽지 않았다. 퍼널은 "샀는가"만
묻고 **"얼마어치 샀는가"** 는 안 물었다. 상품을 기획하려면 두 번째가 필요하다 —
전환율이 같아도 객단가가 다르면 다른 상품이다.

**정의를 먼저 못 박는 게 이 파일의 목적이다.** AOV·ARPU·ARPPU 는 자주 섞여 쓰이고,
섞이면 같은 이름으로 다른 숫자를 보고하게 된다.
"""
from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from analytics.etl.identity import journey_key
from tracking.taxonomy import EventName

#: 돈이 들어오는 이벤트.
REVENUE_EVENT = EventName.BOOKING_COMPLETED
#: 돈이 나가는 이벤트. ``amount`` 는 **환불된 금액**이다.
REFUND_EVENT = EventName.BOOKING_CANCELLED


@dataclass
class RevenueReport:
    """관측 기간 안의 매출. **생애가치가 아니다** — 아래 ``arpu`` 주석 참고."""

    gross_revenue: int
    refunded: int
    orders: int
    cancellations: int
    buyers: int
    people: int

    @property
    def net_revenue(self) -> int:
        """순매출 = 받은 돈 − 돌려준 돈.

        ``amount`` 를 "이 이벤트에서 움직인 금액"으로 정의했기 때문에 뺄셈이 된다.
        완료는 받은 돈, 취소는 돌려준 돈이다. 전액 환불이 아닐 수 있으므로
        취소 건수로는 계산할 수 없고 금액이 실려 와야 한다.
        """
        return self.gross_revenue - self.refunded

    @property
    def cancellation_rate(self) -> float:
        return round(self.cancellations / self.orders, 4) if self.orders else 0.0

    @property
    def aov(self) -> float:
        """평균 주문금액 = 매출 / **주문 수**."""
        return round(self.gross_revenue / self.orders, 1) if self.orders else 0.0

    @property
    def arppu(self) -> float:
        """구매자 1인당 매출 = 매출 / **구매한 사람 수**.

        한 사람이 두 번 사면 AOV 보다 커진다. 둘이 같으면 재구매가 없다는 뜻이다.
        """
        return round(self.gross_revenue / self.buyers, 1) if self.buyers else 0.0

    @property
    def arpu(self) -> float:
        """방문자 1인당 매출 = 매출 / **전체 사람 수**(안 산 사람 포함).

        **이걸 LTV 라고 부르지 않는다.** 관측 창이 30일이고 그 안에서 잰 값이다.
        생애가치는 그 사람이 앞으로 쓸 돈까지 포함해야 하는데, 30일 창에서는
        앞으로가 관측되지 않았다. 이름을 LTV 로 붙이는 순간 없는 정보를 있다고
        말하는 게 된다.
        """
        return round(self.gross_revenue / self.people, 1) if self.people else 0.0

    @property
    def purchase_rate(self) -> float:
        return round(self.buyers / self.people, 4) if self.people else 0.0

    def __str__(self) -> str:
        return (
            f"gross={self.gross_revenue:,} refunded={self.refunded:,} "
            f"net={self.net_revenue:,} orders={self.orders:,} "
            f"buyers={self.buyers:,}/{self.people:,} "
            f"aov={self.aov:,.0f} arppu={self.arppu:,.0f} arpu={self.arpu:,.0f}"
        )


def summarize(events: pd.DataFrame) -> RevenueReport:
    """관측 기간 전체의 매출.

    총매출과 순매출을 **둘 다** 낸다. AOV·ARPU 는 총매출 기준이다 — 주문이 일어난
    시점의 값이기 때문이고, 환불은 나중에 다른 시점에 일어난다. 둘을 한 지표에
    섞으면 "언제 기준인지"가 사라진다.
    """
    df = events.copy()
    df["_key"] = journey_key(df)

    orders = df[df["event_name"] == REVENUE_EVENT.value]
    paid = orders[orders["amount"].notna()]

    cancels = df[df["event_name"] == REFUND_EVENT.value]
    refunds = cancels[cancels["amount"].notna()]

    return RevenueReport(
        gross_revenue=int(paid["amount"].sum()),
        refunded=int(refunds["amount"].sum()),
        orders=int(len(paid)),
        cancellations=int(len(cancels)),
        buyers=int(paid["_key"].nunique()),
        people=int(df["_key"].nunique()),
    )


def by_segment(events: pd.DataFrame, column: str) -> pd.DataFrame:
    """세그먼트별 매출.

    전환율이 같아도 객단가가 다를 수 있다. 그 차이는 퍼널에서 안 보인다.
    """
    rows = []
    for key, g in events.groupby(column, observed=True):
        r = summarize(g)
        rows.append({
            column: key,
            "people": r.people,
            "buyers": r.buyers,
            "gross_revenue": r.gross_revenue,
            "aov": r.aov,
            "arpu": r.arpu,
        })
    return pd.DataFrame(rows).sort_values("arpu", ascending=False).reset_index(drop=True)


def cohort_revenue(labelled: pd.DataFrame, within_days: int = 7) -> pd.DataFrame:
    """코호트별 **D+N 누적 1인당 매출**.

    LTV 를 향해 갈 수 있는 유일한 정직한 형태다. 코호트마다 "첫 방문 후 N일 안에
    1인당 얼마를 썼나"를 재면 서로 비교할 수 있다.

    **관측 기간이 N일이 안 되는 코호트는 제외한다.** 포함하면 최근 코호트가 돈을
    덜 쓴 것처럼 보이는데, 사실은 쓸 시간이 없었던 것이다. 리텐션에서 마지막
    코호트의 재방문율이 낮게 나오던 것과 정확히 같은 우측 절단이다.
    """
    df = labelled.copy()
    df["_key"] = journey_key(df)

    observed_until = df["timestamp"].max()
    first_seen = df.groupby("_key")["timestamp"].transform("min")
    df["_first_seen"] = first_seen
    df["_age_days"] = (df["timestamp"] - first_seen).dt.total_seconds() / 86400
    df["cohort"] = df["_first_seen"].dt.to_period("W").astype(str).str.slice(0, 10)

    rows = []
    for cohort, g in df.groupby("cohort"):
        cohort_start = g["_first_seen"].max()
        if (observed_until - cohort_start).days < within_days:
            # 아직 N일이 안 찼다. 넣으면 안 쓴 것처럼 보인다.
            continue
        window = g[g["_age_days"] <= within_days]
        paid = window[
            (window["event_name"] == REVENUE_EVENT.value) & window["amount"].notna()
        ]
        people = g["_key"].nunique()
        rows.append({
            "cohort": str(cohort),
            "people": int(people),
            f"d{within_days}_revenue": int(paid["amount"].sum()),
            f"d{within_days}_arpu": round(float(paid["amount"].sum()) / people, 1) if people else 0.0,
        })
    cols = ["cohort", "people", f"d{within_days}_revenue", f"d{within_days}_arpu"]
    if not rows:
        # 창이 안 찬 코호트를 전부 빼면 빈 결과가 된다. 컬럼은 남긴다.
        return pd.DataFrame(columns=cols)
    return pd.DataFrame(rows)[cols].sort_values("cohort").reset_index(drop=True)


__all__ = ["REVENUE_EVENT", "RevenueReport", "by_segment", "cohort_revenue", "summarize"]
