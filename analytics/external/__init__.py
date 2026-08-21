"""외부 데이터 — **이벤트 파이프라인의 형제이지 공급자가 아니다.**

`docs/external-market-report.md` 의 D1.

DART 의 계정 한 줄은 이벤트가 아니다. 검색량 지수도 이벤트가 아니다. 억지로
`tracking/taxonomy.py` 의 `Event` 로 밀어 넣으면 두 가지가 한꺼번에 깨진다.

1. **검증이 무의미해진다.** `missing_required()` 와 격리는 스키마를 아는 행동
   데이터를 전제로 만들어졌다. 외부 레코드는 통과시켜 줄 수밖에 없고, 한 번
   통과시키기 시작하면 실패율이 품질 신호이기를 그만둔다.
2. **분석이 조용히 오적용된다.** `sessionize()` 와 퍼널은 "사람이 순서대로 뭔가
   한다" 를 가정한다. 분기 재무제표에 돌리면 **에러 없이 틀린 숫자**가 나온다.

그래서 이 패키지는 이벤트 파이프라인으로 아무것도 내보내지 않는다. 둘이 만나는
자리는 **어느 주장이 어느 체제에서 왔는지 밝히는 보고서 하나뿐**이다.
"""
from analytics.external.series import (FetchWindow, ScaleKind, ExternalSeries,
                                       Observation, align)

__all__ = ["ExternalSeries", "FetchWindow", "Observation", "ScaleKind", "align"]
