"""아이덴티티 스티칭 — 이 프로젝트의 기술적 핵심.

검색하고 숙소를 둘러보는 행동은 대부분 **로그인 전**에 일어난다.
이 구간을 버리면 "어디서 왜 이탈했는가"를 영영 알 수 없고, 개선은 추측이 된다.

로그인 시점에 ``식별자 → user_id`` 매핑을 만들고,
**그 식별자의 과거 이벤트까지 소급해서** 회원 여정에 붙인다.

식별자가 하나가 아니다
----------------------
웹은 쿠키(``anonymous_id``)를 쓰고 앱은 설치 ID(``install_id``)를 쓴다.
둘의 안정성이 다르다.

    anonymous_id   쿠키를 지우거나 앱을 다시 켜면 바뀔 수 있다
    install_id     같은 설치 안에서는 유지된다 — 여러 anonymous_id 를 묶는다

그래서 **install_id 를 먼저 본다.** 로그인하지 않은 앱 방문이 여러 익명 ID 로
쪼개져 있어도 하나의 여정으로 모인다. 웹만 있던 시절에는 없던 결합이다.

되찾을 수 없는 것
----------------
**재설치하면 install_id 가 바뀐다.** 새 설치에서 로그인하면 그 이후는 이어지지만,
재설치 전의 *로그인하지 않은* 구간은 이을 방법이 없다 — 기기에 남은 유일한
연결고리가 사라졌기 때문이다. 파이프라인의 결함이 아니라 한계이고, 숨기지 않고
리포트에 센다.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import pandas as pd

# 안정적인 것부터. 충돌하면 앞의 것이 이긴다.
IDENTITY_KEYS: tuple[str, ...] = ("install_id", "anonymous_id")


@dataclass
class StitchReport:
    total_events: int = 0
    already_identified: int = 0
    stitched: int = 0
    still_anonymous: int = 0
    mapped_anonymous_ids: int = 0

    # 어느 식별자로 결합됐는가
    stitched_by_key: dict[str, int] = field(default_factory=dict)
    # 웹과 앱 양쪽에서 보인 회원 수
    cross_platform_users: int = 0
    # 같은 회원인데 설치 ID 가 여러 개 — 재설치했다는 뜻
    reinstalled_users: int = 0

    @property
    def stitch_rate(self) -> float:
        """익명 이벤트 중 회원에게 결합된 비율."""
        anon = self.stitched + self.still_anonymous
        return round(self.stitched / anon, 4) if anon else 0.0

    def __str__(self) -> str:
        base = (
            f"events={self.total_events} identified={self.already_identified} "
            f"stitched={self.stitched} anonymous={self.still_anonymous} "
            f"stitch_rate={self.stitch_rate:.2%}"
        )
        if self.cross_platform_users or self.reinstalled_users:
            base += (f" cross_platform={self.cross_platform_users}"
                     f" reinstalled={self.reinstalled_users}")
        return base


def _earliest_login(events: pd.DataFrame, key: str) -> pd.DataFrame:
    """식별자별 **가장 이른 로그인**.

    같은 식별자가 여러 회원으로 이어질 수 있다(공용 기기). 가장 이른 로그인을
    채택한다 — 그 앞부분 행동은 그 회원의 것으로 보는 게 자연스럽다.
    """
    sub = events[events[key].notna()]
    if sub.empty:
        return pd.DataFrame(columns=[key, "user_id", "identified_at"])
    return (
        sub.sort_values("timestamp")
        .groupby(key, as_index=False)
        .first()[[key, "user_id", "timestamp"]]
        .rename(columns={"timestamp": "identified_at"})
    )


def build_identity_map(events: pd.DataFrame) -> pd.DataFrame:
    """``식별자 → user_id`` 매핑. 식별자 종류를 한 표에 담는다.

    컬럼: ``key_type`` · ``key_value`` · ``user_id`` · ``identified_at``
    """
    cols = ["key_type", "key_value", "user_id", "identified_at"]
    identified = events[events["user_id"].notna()]
    if identified.empty:
        return pd.DataFrame(columns=cols)

    frames = []
    for key in IDENTITY_KEYS:
        if key not in identified.columns:
            continue
        m = _earliest_login(identified, key)
        if m.empty:
            continue
        m = m.rename(columns={key: "key_value"})
        m.insert(0, "key_type", key)
        frames.append(m[cols])

    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame(columns=cols)


def stitch(events: pd.DataFrame) -> tuple[pd.DataFrame, StitchReport]:
    """익명 이벤트에 user_id 를 소급 부여한다.

    Returns:
        (``resolved_user_id`` 컬럼이 추가된 이벤트, 리포트)
    """
    df = events.copy()
    report = StitchReport(total_events=len(df))
    report.already_identified = int(df["user_id"].notna().sum())

    imap = build_identity_map(df)

    resolved = df["user_id"].copy()
    for key in IDENTITY_KEYS:
        if key not in df.columns:
            continue
        part = imap[imap["key_type"] == key]
        if part.empty:
            continue

        lookup = part.set_index("key_value")["user_id"]
        candidate = df[key].map(lookup)
        # 아직 안 풀린 것만 채운다. 앞선(더 안정적인) 키가 정한 답을 덮지 않는다.
        fills = resolved.isna() & candidate.notna()
        report.stitched_by_key[key] = int(fills.sum())
        resolved = resolved.where(~fills, candidate)

        if key == "anonymous_id":
            report.mapped_anonymous_ids = int(part["key_value"].nunique())

    df["resolved_user_id"] = resolved

    newly = df["user_id"].isna() & df["resolved_user_id"].notna()
    report.stitched = int(newly.sum())
    report.still_anonymous = int(df["resolved_user_id"].isna().sum())

    # 웹과 앱 양쪽에서 보인 회원
    if "platform" in df.columns:
        known = df[df["resolved_user_id"].notna()]
        if not known.empty:
            plats = known.groupby("resolved_user_id")["platform"].nunique()
            report.cross_platform_users = int((plats > 1).sum())

    # 재설치 — 같은 회원에게 설치 ID 가 둘 이상
    if "install_id" in df.columns:
        known = df[df["resolved_user_id"].notna() & df["install_id"].notna()]
        if not known.empty:
            installs = known.groupby("resolved_user_id")["install_id"].nunique()
            report.reinstalled_users = int((installs > 1).sum())

    return df, report


def journey_key(events: pd.DataFrame) -> pd.Series:
    """분석의 기본 단위.

    회원이면 user_id. 끝까지 익명이면 기기 식별자를 쓰되 **안정적인 것부터** 고른다 —
    앱에서 익명으로 머문 방문이 여러 anonymous_id 로 쪼개지지 않게 한다.
    익명 방문자를 분석에서 제외하지 않기 위한 장치다.
    """
    col = "resolved_user_id" if "resolved_user_id" in events.columns else "user_id"
    out = events[col]
    if "install_id" in events.columns:
        out = out.fillna(events["install_id"])
    return out.fillna(events["anonymous_id"])


__all__ = ["IDENTITY_KEYS", "StitchReport", "build_identity_map", "journey_key", "stitch"]
