"""테스트 전체가 **같은 DB 하나**를 쓰게 못 박는다.

## 무엇이 문제였나

여덟 개 테스트 파일이 각자 `os.environ.setdefault("DATABASE_URL", ...)` 로 자기
DB 를 잡으려 했다. 그런데 `setdefault` 는 **이미 값이 있으면 아무것도 하지
않는다.** 그래서 pytest 가 먼저 임포트한 파일 하나가 이기고, 나머지 일곱은 남의
DB 를 쓴다. 게다가 `app.core.database` 는 임포트 시점에 엔진을 한 번 만들므로,
나중에 환경변수를 바꿔도 소용이 없다.

결과는 **파일 순서에 따라 통과 여부가 갈리는 것**이었다. 단독으로 돌리면 되고,
같이 돌리면 깨지고, 순서를 바꾸면 또 달라졌다. 그런 테스트는 실패를 봐도 원인을
못 믿게 되고, 결국 아무도 안 돌린다.

## 어떻게 고쳤나

pytest 는 **테스트 모듈보다 `conftest.py` 를 먼저 임포트한다.** 여기서 값을
정하면 각 파일의 `setdefault` 는 전부 no-op 이 되고, 승자가 실행 순서에 따라
바뀌지 않는다. 파일들의 그 줄은 그대로 두었다 — 단독 실행(`pytest
tests/test_x.py`) 도 여전히 되어야 하고, 그때는 이 파일이 값을 정해 준다.

**DB 는 세션 시작에 한 번 지운다.** 앞선 실행이 남긴 행이 다음 실행을 깨뜨리는
일을 막는다. 파일별로 지우면 남의 데이터까지 날아가므로 여기서만 지운다.
"""
from __future__ import annotations

import os
from pathlib import Path

#: 테스트 전체가 공유하는 DB. 이름에 목적을 박아 둔다 — 데모용 `demo.db` 와
#: 섞이면 시연 중에 테스트가 데이터를 지우는 사고가 난다.
DB_FILE = Path(__file__).resolve().parents[1] / "test_suite.db"

os.environ.setdefault("DATABASE_URL", f"sqlite+aiosqlite:///./{DB_FILE.name}")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")

# 세션 시작 전에 지운다. `pytest_sessionstart` 훅은 이미 모듈이 임포트된 뒤라
# 늦다 — 그때는 엔진이 파일을 열고 있다.
if DB_FILE.exists():
    try:
        DB_FILE.unlink()
    except OSError:
        # 다른 프로세스가 잡고 있으면 지우지 못한다. 그래도 진행은 한다 —
        # 못 지운 것이 곧 실패는 아니고, 실패한다면 그 테스트가 말해 준다.
        pass
