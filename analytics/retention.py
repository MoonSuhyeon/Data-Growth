"""재방문과 리텐션.

퍼널은 "이번에 온 사람이 사는가"를 묻는다. 이 파일은 **"온 사람이 다시 오는가"**
를 묻는다. 상품을 기획하려면 두 번째 질문이 필요하다 — 한 번 사고 사라지는
사람들만 늘리는 성장과, 돌아오는 사람이 쌓이는 성장은 다른 것이고, 전환율만
보면 그 둘이 구분되지 않는다.

**세션이 단위다.** 방문이 곧 세션이므로, 같은 사람의 두 번째 세션부터가 재방문이다.
"""
from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from analytics.etl.identity import journey_key

#: 재방문 여부 라벨. 이벤트가 아니라 **분석이 붙이는 값**이다 — 이벤트에 실으면
#: 클라이언트가 자기가 몇 번째 방문인지 알아야 하고, 그건 쿠키가 지워지는 순간
#: 거짓이 된다. 서버가 가진 전체 이력에서 판정하는 쪽이 옳다.
NEW = "NEW"
RETURNING = "RETURNING"


def label_visits(events: pd.DataFrame) -> pd.DataFrame:
    """세션마다 ``visit_type`` 과 ``visit_seq`` 를 붙인다.

    ``sessionize()`` 를 먼저 돌려서 ``session_id`` 가 있어야 한다.
    """
    df = events.copy()
    if "session_id" not in df.columns:
        raise ValueError("sessionize() 를 먼저 돌려야 한다 — session_id 가 없다")

    df["_key"] = journey_key(df)
    first = df.groupby("session_id")["timestamp"].transform("min")
    df["_session_start"] = first

    # 사람별로 세션을 시간순으로 세운다. 같은 세션의 모든 이벤트가 같은 순번을 받는다.
    order = (
        df[["_key", "session_id", "_session_start"]]
        .drop_duplicates("session_id")
        .sort_values(["_key", "_session_start"])
    )
    order["visit_seq"] = order.groupby("_key").cumcount() + 1
    seq = order.set_index("session_id")["visit_seq"]

    df["visit_seq"] = df["session_id"].map(seq)
    df["visit_type"] = df["visit_seq"].map(lambda n: NEW if n == 1 else RETURNING)
    return df.drop(columns=["_session_start"])


@dataclass
class RetentionReport:
    people: int
    returned: int
    sessions: int
    #: 첫 방문 주차 → (사람 수, 다시 온 사람 수)
    by_cohort: dict[str, tuple[int, int]]

    @property
    def return_rate(self) -> float:
        return round(self.returned / self.people, 4) if self.people else 0.0

    def __str__(self) -> str:
        return (
            f"people={self.people} returned={self.returned} "
            f"return_rate={self.return_rate:.1%} sessions/person="
            f"{self.sessions / self.people:.2f}" if self.people else "people=0"
        )


def retention(labelled: pd.DataFrame) -> RetentionReport:
    """첫 방문 주차별로, 그 사람들이 다시 왔는지.

    **코호트를 나누는 이유가 있다.** 전체 재방문율은 관측 기간에 좌우된다 — 기간
    끝에 처음 온 사람은 다시 올 시간이 없었을 뿐인데 "안 돌아온 사람"으로 세어진다.
    그대로 두면 최근일수록 리텐션이 나빠 보이고, 그건 제품이 나빠진 게 아니다.
    코호트별로 보면 그 착시가 드러난다.
    """
    if "visit_seq" not in labelled.columns:
        raise ValueError("label_visits() 를 먼저 돌려야 한다")

    per_person = (
        labelled.groupby("_key")
        .agg(first_seen=("timestamp", "min"), visits=("visit_seq", "max"))
        .reset_index()
    )
    per_person["cohort"] = (
        per_person["first_seen"].dt.to_period("W").astype(str).str.slice(0, 10)
    )

    by_cohort: dict[str, tuple[int, int]] = {}
    for cohort, g in per_person.groupby("cohort"):
        by_cohort[str(cohort)] = (len(g), int((g["visits"] > 1).sum()))

    return RetentionReport(
        people=len(per_person),
        returned=int((per_person["visits"] > 1).sum()),
        sessions=int(labelled["session_id"].nunique()),
        by_cohort=dict(sorted(by_cohort.items())),
    )


def churn(labelled: pd.DataFrame, within_days: int = 7) -> pd.DataFrame:
    """코호트별 **D+N 이탈률** — N일 안에 다시 오지 않은 사람의 비율.

    ``retention()`` 의 재방문율은 "관측 기간 안에 언제든 다시 왔는가"라서 코호트마다
    창의 길이가 다르다. 비교하려면 창을 같게 맞춰야 하고, 그래서 N일을 고정한다.

    그리고 **N일이 안 찬 코호트는 제외한다.** 넣으면 최근 코호트의 이탈률이 100%
    가까이 나오는데, 떠난 게 아니라 돌아올 시간이 없었던 것이다. 이걸 그대로
    보고하면 "이탈이 급증했다"는 잘못된 경보가 된다.
    """
    if "visit_seq" not in labelled.columns:
        raise ValueError("label_visits() 를 먼저 돌려야 한다")

    df = labelled.copy()
    df["_key"] = journey_key(df)
    observed_until = df["timestamp"].max()

    first_seen = df.groupby("_key")["timestamp"].min().rename("first_seen")
    per_person = first_seen.to_frame()
    per_person["cohort"] = (
        per_person["first_seen"].dt.to_period("W").astype(str).str.slice(0, 10)
    )

    # 첫 방문 후 N일 안에 다시 왔는가
    joined = df.join(per_person["first_seen"], on="_key")
    age = (joined["timestamp"] - joined["first_seen"]).dt.total_seconds() / 86400
    returned_in_window = (
        joined.assign(_age=age)
        .query("_age > 0 and _age <= @within_days")["_key"]
        .unique()
    )
    per_person["returned"] = per_person.index.isin(returned_in_window)

    rows = []
    for cohort, g in per_person.groupby("cohort"):
        if (observed_until - g["first_seen"].max()).days < within_days:
            continue
        n = len(g)
        churned = int((~g["returned"]).sum())
        rows.append({
            "cohort": str(cohort),
            "people": n,
            "churned": churned,
            f"d{within_days}_churn_rate": round(churned / n, 4) if n else 0.0,
        })
    cols = ["cohort", "people", "churned", f"d{within_days}_churn_rate"]
    if not rows:
        # **빈 결과여도 컬럼은 있어야 한다.** 없으면 호출부가 KeyError 로 죽고,
        # "창이 안 찬 기간이다" 와 "코드가 깨졌다" 가 구분되지 않는다. 짧은 기간을
        # 물어보는 것은 오류가 아니라 정상적인 질문이다.
        return pd.DataFrame(columns=cols)
    return pd.DataFrame(rows)[cols].sort_values("cohort").reset_index(drop=True)


def to_frame(report: RetentionReport) -> pd.DataFrame:
    rows = [
        {
            "cohort": c,
            "people": n,
            "returned": r,
            "return_rate": round(r / n, 4) if n else 0.0,
        }
        for c, (n, r) in report.by_cohort.items()
    ]
    return pd.DataFrame(rows)


__all__ = [
    "NEW", "RETURNING", "RetentionReport", "churn", "label_visits", "retention",
    "to_frame",
]
