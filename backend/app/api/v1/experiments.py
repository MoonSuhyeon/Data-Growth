"""실험 배정 — 클라이언트는 묻고 따를 뿐 스스로 정하지 않는다.

배정을 클라이언트에 두면 **배포할 수 있는 속도가 곧 실험을 바꿀 수 있는 속도**가
된다. 웹은 몇 분이라 티가 안 나지만, 앱은 스토어 심사에 며칠이고 사용자가
업데이트를 안 하면 영영이다.

그 상태에서 변형이 앱 버전에 묶이면 treatment 그룹이 "업데이트한 사람"이 되고,
배정 비율이 난수가 아니라 업데이트 채택률로 정해진다. SRM 이 항상 울리게 되고,
항상 울리는 경보는 무시된다 — 진짜 배정 버그가 왔을 때도 못 잡는다.

    GET /api/v1/experiments/assignments?unit_id=...&platform=...&app_version=...
"""
from __future__ import annotations

from fastapi import APIRouter, Query
from pydantic import BaseModel

from analytics.experiments.registry import Status, default_registry

router = APIRouter()

# 프로세스 하나가 들고 있는 실험 목록. 배포가 아니라 이 목록을 바꾸면 실험이 바뀐다.
_registry = default_registry()


class AssignmentOut(BaseModel):
    experiment_id: str
    status: Status
    # status 가 assigned 일 때만 값이 있다. 참여 못 하는 사용자를 control 로
    # 채우지 않는다 — 그러면 이 엔드포인트가 없애려던 교락이 그대로 생긴다.
    variant: str | None = None
    reason: str | None = None


class AssignmentsResponse(BaseModel):
    unit_id: str
    platform: str
    app_version: str | None = None
    assignments: list[AssignmentOut]


@router.get("/assignments", response_model=AssignmentsResponse)
def assignments(
    unit_id: str = Query(min_length=1, description="익명 ID 또는 설치 ID"),
    platform: str = Query("WEB"),
    app_version: str | None = Query(None),
) -> AssignmentsResponse:
    """이 사용자가 어느 그룹인지 서버가 답한다.

    같은 ``unit_id`` 는 항상 같은 답을 받는다. 결정적 해시라 상태를 저장하지 않고도
    재방문에서 그룹이 바뀌지 않는다.
    """
    rows = _registry.assignments(unit_id, platform, app_version)
    return AssignmentsResponse(
        unit_id=unit_id,
        platform=platform,
        app_version=app_version,
        assignments=[
            AssignmentOut(
                experiment_id=a.experiment_id,
                status=a.status,
                variant=a.variant,
                reason=a.reason,
            )
            for a in rows
        ],
    )
