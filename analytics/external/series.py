"""외부 시계열 — **조회 창과 척도를 데이터에 붙여 다닌다.**

D1. 이 파일이 막는 사고는 하나같이 **에러 없이 틀린 숫자**를 만든다.

## 1. 상대 지수는 조회마다 척도가 다르다

네이버 데이터랩과 구글 트렌드가 주는 값은 절대 검색량이 아니라 **요청한 기간
안에서 최댓값을 100 으로 다시 스케일한 지수**다.

기간을 달리해 두 번 뽑아 이어 붙이면, 두 조각은 서로 다른 자를 쓴 것이다. 그래프는
멀쩡해 보이고 숫자는 뜻이 없다. 그래서 `ExternalSeries` 는 **자기가 어느 창에서
어떤 척도로 뽑혔는지 들고 다니고**, 척도가 다른 것끼리 잇는 것을 거절한다.

고치는 방법은 코드가 아니라 절차다: **모든 계열을 한 번의 요청, 한 창에서 뽑는다.**

## 2. 없는 것과 0 은 다르다

`광고선전비` 는 판관비 안의 한 줄이라 공시에 따라 본문에 있기도, 주석에만 있기도,
아예 안 쪼개져 있기도 하다. 없는 것을 0 으로 채우면 "그 해에 광고를 안 했다" 가
되고, 그건 데이터가 아니라 우리가 지어낸 사실이다.

**없음은 정상이다.** 예외가 아니라 `None` 이고, 그 위의 어떤 집계도 몇 개가
비었는지 같이 말해야 한다.

## 3. 분기 자료로 월별 이벤트 스터디를 할 수 없다

다년 창이라도 관측이 **4~12개**다. 검정력이 모자란 게 아니라 불가능하다. 미리 말하는
편이 그럴듯해 보이는 그래프를 그리는 것보다 정직하다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from enum import Enum


class ScaleKind(str, Enum):
    """값이 무엇으로 재어졌는가."""

    #: 원, 건수 등 그 자체로 뜻이 있는 값. 창이 달라도 이어 붙일 수 있다.
    ABSOLUTE = "absolute"
    #: 요청 창 안의 최댓값을 100 으로 둔 지수. **창이 다르면 다른 자다.**
    RELATIVE_INDEX = "relative_index"


@dataclass(frozen=True)
class FetchWindow:
    """언제 뽑았고 어느 구간을 달라고 했나.

    상대 지수의 자가 이 창이다. 데이터와 떼어 놓으면 나중에 읽는 사람이 두 계열을
    다른 자로 쟀다는 사실을 알 방법이 없다.
    """

    start: date
    end: date
    fetched_at: date

    def __post_init__(self) -> None:
        if self.end < self.start:
            raise ValueError("조회 창의 끝이 시작보다 앞이다")

    def __str__(self) -> str:
        return f"{self.start}~{self.end} (조회 {self.fetched_at})"


@dataclass(frozen=True)
class Observation:
    """한 시점의 값. **`None` 은 0 이 아니라 '모른다' 다.**"""

    at: date
    value: float | None
    #: 왜 없는지. "주석에만 있었다", "계정이 안 쪼개져 있었다" 같은 것.
    missing_reason: str = ""

    @property
    def present(self) -> bool:
        return self.value is not None


@dataclass
class ExternalSeries:
    """외부에서 가져온 한 계열."""

    source: str
    key: str
    window: FetchWindow
    scale: ScaleKind
    unit: str
    observations: list[Observation] = field(default_factory=list)

    def __post_init__(self) -> None:
        out = [o.at for o in self.observations
               if o.at < self.window.start or o.at > self.window.end]
        if out:
            raise ValueError(
                f"조회 창 밖의 관측이 있다: {out[:3]} — 창을 넘겨 붙였거나 창을 잘못 적었다")

    # ------------------------------------------------------------ 결측
    @property
    def missing(self) -> list[Observation]:
        return [o for o in self.observations if not o.present]

    @property
    def coverage(self) -> float:
        if not self.observations:
            return 0.0
        return 1 - len(self.missing) / len(self.observations)

    def values(self) -> list[float]:
        """있는 값만. **몇 개가 빠졌는지는 `missing` 으로 따로 물어야 한다.**

        여기서 0 으로 채우지 않는다. 채우는 순간 "광고를 안 했다" 가 되고, 그건
        데이터가 아니라 지어낸 사실이다.
        """
        return [o.value for o in self.observations if o.present]

    # ------------------------------------------------------------ 잇기
    def concat(self, other: ExternalSeries) -> ExternalSeries:
        """두 조각을 잇는다. **못 잇는 경우가 더 중요하다.**"""
        if self.key != other.key or self.source != other.source:
            raise ValueError(f"다른 계열이다: {self.source}/{self.key} vs "
                             f"{other.source}/{other.key}")
        if self.scale is not other.scale:
            raise ValueError(f"척도가 다르다 ({self.scale.value} vs {other.scale.value})")
        if self.scale is ScaleKind.RELATIVE_INDEX and self.window != other.window:
            raise ValueError(
                "상대 지수는 조회 창마다 자가 다르다 — "
                f"{self.window} 와 {other.window} 를 이으면 그래프는 멀쩡하고 숫자는 뜻이 없다. "
                "한 번의 요청, 한 창에서 다시 뽑아야 한다")
        if self.unit != other.unit:
            raise ValueError(f"단위가 다르다 ({self.unit} vs {other.unit})")

        merged = sorted({o.at: o for o in [*self.observations, *other.observations]}.values(),
                        key=lambda o: o.at)
        return ExternalSeries(
            source=self.source, key=self.key, unit=self.unit, scale=self.scale,
            window=FetchWindow(min(self.window.start, other.window.start),
                               max(self.window.end, other.window.end),
                               max(self.window.fetched_at, other.window.fetched_at)),
            observations=merged,
        )

    def __str__(self) -> str:
        gap = f", 결측 {len(self.missing)}" if self.missing else ""
        return (f"{self.source}/{self.key} · {len(self.observations)}개{gap} · "
                f"{self.scale.value} · {self.window}")


#: 이 밑으로는 어떤 시점별 추정도 하지 않는다.
#:
#: 분기 자료의 다년 창은 관측이 4~12개다. 이벤트 스터디는 시점마다 계수를 하나씩
#: 추정하므로, 관측보다 계수가 많아지는 지점이 금방 온다. 검정력이 낮은 게 아니라
#: **식이 서지 않는다.**
MIN_OBSERVATIONS_FOR_EVENT_STUDY = 12


def align(a: ExternalSeries, b: ExternalSeries) -> list[tuple[date, float, float]]:
    """두 계열을 같은 시점끼리 맞춘다. DiD 의 재료다.

    Raises:
        ValueError: 척도가 다르거나, 상대 지수인데 조회 창이 다를 때. 처치군과
            대조군을 **다른 자로 재고** 차이를 빼면 그 차이는 캠페인이 아니라
            자의 차이다.
    """
    if a.scale is not b.scale:
        raise ValueError(f"척도가 다른 두 계열을 맞출 수 없다 "
                         f"({a.scale.value} vs {b.scale.value})")
    if a.scale is ScaleKind.RELATIVE_INDEX and a.window != b.window:
        raise ValueError(
            "상대 지수 두 계열의 조회 창이 다르다 — 처치군과 대조군을 다른 자로 재고 "
            "차이를 빼면 그 차이는 캠페인이 아니라 자의 차이다")

    rhs = {o.at: o for o in b.observations}
    out = []
    for o in a.observations:
        m = rhs.get(o.at)
        if o.present and m is not None and m.present:
            out.append((o.at, float(o.value), float(m.value)))
    return out


__all__ = ["ExternalSeries", "FetchWindow", "MIN_OBSERVATIONS_FOR_EVENT_STUDY",
           "Observation", "ScaleKind", "align"]
