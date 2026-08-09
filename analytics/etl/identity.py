"""아이덴티티 스티칭 — 이 프로젝트의 기술적 핵심.

검색하고 숙소를 둘러보는 행동은 대부분 **로그인 전**에 일어난다.
이 구간을 버리면 "어디서 왜 이탈했는가"를 영영 알 수 없고, 개선은 추측이 된다.

로그인 시점에 ``anonymous_id → user_id`` 매핑을 만들고,
**그 익명 ID 의 과거 이벤트까지 소급해서** 회원 여정에 붙인다.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import pandas as pd


@dataclass
class StitchReport:
    total_events: int = 0
    already_identified: int = 0
    stitched: int = 0
    still_anonymous: int = 0
    mapped_anonymous_ids: int = 0

    @property
    def stitch_rate(self) -> float:
        """익명 이벤트 중 회원에게 결합된 비율."""
        anon = self.stitched + self.still_anonymous
        return round(self.stitched / anon, 4) if anon else 0.0

    def __str__(self) -> str:
        return (
            f"events={self.total_events} identified={self.already_identified} "
            f"stitched={self.stitched} anonymous={self.still_anonymous} "
            f"stitch_rate={self.stitch_rate:.2%}"
        )


def build_identity_map(events: pd.DataFrame) -> pd.DataFrame:
    """``anonymous_id → user_id`` 매핑.

    같은 익명 ID 가 여러 회원으로 이어질 수 있다(공용 기기).
    **가장 이른 로그인**을 채택한다 — 그 세션의 앞부분 행동은 그 회원의 것으로 보는 게 자연스럽다.
    """
    identified = events[events["user_id"].notna()]
    if identified.empty:
        return pd.DataFrame(columns=["anonymous_id", "user_id", "identified_at"])

    first = (
        identified.sort_values("timestamp")
        .groupby("anonymous_id", as_index=False)
        .first()[["anonymous_id", "user_id", "timestamp"]]
        .rename(columns={"timestamp": "identified_at"})
    )
    return first


def stitch(events: pd.DataFrame) -> tuple[pd.DataFrame, StitchReport]:
    """익명 이벤트에 user_id 를 소급 부여한다.

    Returns:
        (resolved_user_id 컬럼이 추가된 이벤트, 리포트)
    """
    df = events.copy()
    report = StitchReport(total_events=len(df))
    report.already_identified = int(df["user_id"].notna().sum())

    imap = build_identity_map(df)
    report.mapped_anonymous_ids = len(imap)

    if imap.empty:
        df["resolved_user_id"] = df["user_id"]
        report.still_anonymous = int(df["resolved_user_id"].isna().sum())
        return df, report

    df = df.merge(
        imap[["anonymous_id", "user_id"]].rename(columns={"user_id": "_mapped"}),
        on="anonymous_id",
        how="left",
    )
    df["resolved_user_id"] = df["user_id"].fillna(df["_mapped"])
    df = df.drop(columns=["_mapped"])

    newly = df["user_id"].isna() & df["resolved_user_id"].notna()
    report.stitched = int(newly.sum())
    report.still_anonymous = int(df["resolved_user_id"].isna().sum())
    return df, report


def journey_key(events: pd.DataFrame) -> pd.Series:
    """분석의 기본 단위.

    회원이면 user_id, 끝까지 익명이면 anonymous_id 를 쓴다.
    익명 방문자를 분석에서 제외하지 않기 위한 장치다.
    """
    col = "resolved_user_id" if "resolved_user_id" in events.columns else "user_id"
    return events[col].fillna(events["anonymous_id"])


__all__ = ["StitchReport", "build_identity_map", "journey_key", "stitch"]
