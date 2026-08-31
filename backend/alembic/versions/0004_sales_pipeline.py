"""영업 파이프라인 — 미입점 숙소와 판매 기회.

플랫폼이 호스트에게 영업하는 과정을 담는다. 테이블 둘과 컬럼 하나가 전부다.

## 왜 `prospects` 를 `properties` 와 분리하는가

같은 테이블에 `is_listed` 플래그로 섞는 쪽이 언뜻 단순해 보인다. 그러면
예약·객실·리뷰·검색을 거는 **모든 질의가 "입점한 것만" 을 매번 붙여야 한다.**
한 군데라도 빠뜨리면 아직 우리 숙소가 아닌 곳이 고객에게 노출되고, 그건 조용히
일어난다 — 테스트가 실패하는 게 아니라 목록에 한 줄이 더 있을 뿐이다.

분리하면 그 사고가 구조적으로 불가능하다. 조인하지 않으면 섞일 수가 없다.
대가는 입점 성사 시 행을 옮겨야 한다는 것인데, 그건 **한 곳에서만** 일어나므로
빠뜨릴 자리가 하나뿐이다. 빠뜨릴 자리가 많은 쪽을 피한다.

## `properties.area` 를 지금 넣는 이유

적합도 계산에 지역 안의 세부 위치가 필요하다 — 같은 제주라도 이미 열 곳이 있는
동네와 한 곳도 없는 동네는 영업 가치가 다르다. **시드는 이 값을 처음부터 알고
있었는데** 컬럼이 없어 숙소 이름 문자열 안에만 남아 있었다. 이름에서 파싱할 수도
있지만 이름 형식이 바뀌면 조용히 틀린 값이 나온다.

`NULL` 을 허용하고 기존 행을 일괄로 채우지 않는다. 모르는 것을 그럴듯한 값으로
메우면 "아직 안 넣었다" 와 "정말 그 동네다" 가 구분되지 않는다.

## 기회 중복은 왜 DB 제약이 아닌가

같은 대상에 같은 상품으로 기회가 둘이면 중복 영업이 된다. 그런데 유니크 제약을
`(mode, prospect_id, product)` 에 걸면 **한 번 실패한 뒤 다시 시도할 수 없다** —
`LOST` 로 닫힌 과거 기회가 새 기회를 막는다. 상태까지 넣으면 이번엔 과거 이력이
한 상태당 한 줄로 제한된다.

그래서 "열려 있는 기회는 하나" 는 응용 계층에서 지킨다. 되돌릴 수 없는 외부 효과가
걸린 **발송 쪽에 제약을 건다** — 거기가 진짜로 막아야 할 자리다.
"""
from alembic import op

revision = "0004_sales_pipeline"
down_revision = "0003_property_cancellation_policy"
branch_labels = None
depends_on = None


DDL = [
    """ALTER TABLE properties ADD COLUMN area VARCHAR(50)""",
    """CREATE INDEX ix_properties_area ON properties (area)""",

    """CREATE TYPE salesmodeenum AS ENUM ('ACQUISITION', 'EXPANSION')""",
    """CREATE TYPE opportunitystatusenum AS ENUM (
        'OPEN', 'QUALIFIED', 'PROPOSED', 'ENGAGED', 'WON', 'LOST')""",

    """CREATE TABLE prospects (
	id UUID NOT NULL,
	name VARCHAR(255) NOT NULL,
	region VARCHAR(50) NOT NULL,
	area VARCHAR(50),
	property_type propertytypeenum NOT NULL,
	capacity INTEGER,
	rating NUMERIC(3, 2),
	contact_email VARCHAR(255),
	contact_phone VARCHAR(20),
	source VARCHAR(100) DEFAULT 'seed' NOT NULL,
	onboarded_at TIMESTAMP WITHOUT TIME ZONE,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id)
)""",
    """CREATE INDEX ix_prospects_region ON prospects (region)""",
    """CREATE INDEX ix_prospects_area ON prospects (area)""",
    """CREATE INDEX ix_prospects_property_type ON prospects (property_type)""",
    """CREATE INDEX ix_prospects_market ON prospects (region, property_type)""",

    """CREATE TABLE opportunities (
	id UUID NOT NULL,
	mode salesmodeenum NOT NULL,
	prospect_id UUID,
	host_name VARCHAR(100),
	product VARCHAR(50) NOT NULL,
	status opportunitystatusenum DEFAULT 'OPEN' NOT NULL,
	score INTEGER,
	score_breakdown JSON,
	rationale TEXT,
	confidence VARCHAR(10),
	next_action VARCHAR(100),
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
	updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(prospect_id) REFERENCES prospects (id)
)""",
    """CREATE INDEX ix_opportunities_mode ON opportunities (mode)""",
    """CREATE INDEX ix_opportunities_status ON opportunities (status)""",
    """CREATE INDEX ix_opportunities_host_name ON opportunities (host_name)""",
    """CREATE INDEX ix_opportunities_mode_status ON opportunities (mode, status)""",
]

TABLES = ["opportunities", "prospects"]
ENUMS = ["opportunitystatusenum", "salesmodeenum"]


def upgrade() -> None:
    for stmt in DDL:
        op.execute(stmt)


def downgrade() -> None:
    for name in TABLES:
        op.execute(f'DROP TABLE IF EXISTS "{name}" CASCADE')
    for name in ENUMS:
        op.execute(f'DROP TYPE IF EXISTS "{name}"')
    op.execute("DROP INDEX IF EXISTS ix_properties_area")
    op.execute("ALTER TABLE properties DROP COLUMN IF EXISTS area")
