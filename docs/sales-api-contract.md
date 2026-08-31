# 영업 파이프라인 API 계약

`/admin/sales` 와 `/admin/sales/:id` 를 만들기 위해 필요한 것만 적는다.
아래 응답은 **실제로 찍어 본 것**이고, 손으로 지어낸 모양이 아니다.

---

## 화면은 `/api/sales/*` 하나만 안다

```
브라우저 ── /api/sales/... ──▶ BFF (app/api/sales/[...path]/route.ts)
                                 ├─ GET  → 예약 백엔드 /api/v1/sales/...
                                 └─ POST → 예측 서비스에서 수요를 읽어 본문에 실은 뒤 백엔드로
```

`/api/v1/*` 도 `next.config` rewrite 로 백엔드에 닿지만 **화면은 그 경로를 쓰지
않는다.** 생성만 예측 서비스를 함께 불러야 해서 두 경로를 섞으면 어느 것이
어디로 가는지 화면 코드에서 알 수 없게 된다.

호출은 기존 헬퍼를 그대로 쓴다 — `fetchService` 가 503 을 `ServiceUnavailable`
로 바꿔 주므로 화면은 `ServiceDownNotice` 를 그리면 된다.

```ts
import { fetchService, ServiceUnavailable } from '@/components/ServiceState'

const rows = await fetchService<OpportunityRow[]>('/api/sales/opportunities')
```

---

## 1. 후보 목록

```
GET /api/sales/prospects?region=제주
```

```json
{
  "id": "d4e9d836-9d4d-4e61-a587-bd881b3e2c22",
  "name": "사천 솔밭 단독주택",
  "region": "강릉",
  "area": "사천",
  "property_type": "HOUSE",
  "capacity": 6,
  "rating": 4.1,
  "contactable": true,
  "has_open_opportunity": false
}
```

배열로 온다. 이미 입점한 숙소는 빠진다.

**점수 필드는 없다.** 목록에서 점수를 매기려면 후보마다 시장 표를 만들어야 하고,
그러면 화면을 열 때마다 예측 서비스를 부르게 된다. 더 나쁜 것은 그 값이 기회로
굳힌 점수와 **다른 시점의 것**이 되어 두 화면이 서로 다른 숫자를 말하는 것이다.

화면이 쓸 것:
- `contactable: false` → "기회 만들기" 를 비활성화하고 이유를 보여준다.
  누르고 나서 409 를 보는 것보다 낫다.
- `has_open_opportunity: true` → 버튼 대신 "기회 보기" 링크.

---

## 2. 기회 생성

```
POST /api/sales/opportunities
{ "prospect_id": "e0c9b69f-...", "product": "LISTING" }
```

`product` 는 생략하면 `"LISTING"`. **수요는 보내지 않는다** — BFF 가 예측
서비스에서 읽어 붙인다.

성공은 `201` 이고 본문은 아래 **상세**와 같은 모양이다.

### 거절 (모두 `{ "detail": "..." }`)

| 코드 | 언제 | `detail` 예 |
|---|---|---|
| `404` | 후보가 없음 | `그런 후보가 없습니다` |
| `409` | 이미 입점함 | `이미 입점한 숙소입니다 — 획득 대상이 아닙니다` |
| `409` | 연락 수단 없음 | `연락 수단이 없어 영업할 수 없습니다` |
| `409` | 열린 기회 중복 | `이 후보에 열려 있는 기회가 이미 있습니다` |
| `409` | 시장 수요 없음 | `이 후보가 속한 시장의 수요를 찾을 수 없습니다` |
| `409` | 영업 대상 아님 | `영업 대상이 아닙니다: 평점 2.6 — 최소 기준 3.0 미달` |
| `503` | 예측 서비스 다운 | `수요 예측을 읽을 수 없어 기회를 만들지 못했습니다 (...)` |

**409 는 그대로 보여줘도 되는 문장이다.** 화면이 다시 쓰지 말 것 — 규칙이
바뀌면 두 곳을 고쳐야 하고, 한쪽만 고치면 화면이 거짓말을 한다.

`503` 과 `409` 를 반드시 구분해야 한다. 앞은 "예측 서비스가 안 떠 있다",
뒤는 "이 시장에 수요가 없다" 다. 같은 회색 박스로 그리면 데모 중에 서비스가
죽었을 때 아무도 눈치채지 못한다.

---

## 3. 기회 목록

```
GET /api/sales/opportunities?mode=ACQUISITION&status=QUALIFIED
```

`mode` · `status` 는 선택. **점수 높은 순**으로 온다 (점수 없는 것은 뒤로).

```json
{
  "id": "5068e357-d098-4108-af5f-7938f4c5aa3f",
  "mode": "ACQUISITION",
  "status": "QUALIFIED",
  "product": "LISTING",
  "score": 20,
  "confidence": "high",
  "rationale": "제주 PENSION 시장은 숙소당 예측 수요 2.40 에 우리 공급이 2곳이다. 4인 규모가 이 시장 중앙값(4인)에 가깝다 · 평점 4.7.",
  "target_name": "애월 돌담 독채",
  "region": "제주",
  "property_type": "PENSION"
}
```

`status` 는 `OPEN` `QUALIFIED` `PROPOSED` `ENGAGED` `WON` `LOST`.
지금은 생성 시 `QUALIFIED` 로 들어간다 — 점수가 매겨진 순간 자격 판정이 끝나기 때문.

---

## 4. 기회 상세 — **"왜 87점인가" 를 펼치는 화면**

```
GET /api/sales/opportunities/{id}
```

목록의 필드 전부에 아래 셋이 더 붙는다.

```json
{
  "score_breakdown": {
    "gap_score": 0.32,
    "fit_score": 0.6167,
    "fit_axes": { "capacity": 1.0, "rating": 0.85, "area": 0.0 },
    "fit_reasons": ["4인 규모가 이 시장 중앙값(4인)에 가깝다", "평점 4.7"],
    "market": {
      "region": "제주", "property_type": "PENSION",
      "demand": 2.4, "supply": 2, "wape": 0.3448
    }
  },
  "next_action": "제안 생성",
  "prospect": {
    "id": "e0c9b69f-...", "name": "애월 돌담 독채", "area": "애월",
    "capacity": 4, "rating": 4.7,
    "contact_email": "aewol@example.com", "contact_phone": "064-100-0001",
    "source": "seed"
  }
}
```

### 화면이 지켜야 할 것 셋

**① 점수는 곱셈이다.** `score ≈ gap_score × fit_score × 100`.
두 막대를 나란히 그리고 사이에 `×` 를 두면 "시장이 커서" 인지 "숙소가 맞아서"
인지가 한눈에 갈린다. 합으로 그리면 이 설계가 화면에서 거짓말이 된다.

**② `confidence` 는 점수와 별개다.** 점수 옆 배지로 두되 점수를 깎아 보이게
하지 말 것. `high` · `low` · `unknown` 이고 `market.wape` 에서 온다.
- `low` → "예측 오차가 커 사람 확인 필요"
- `unknown` → "이 지역 오차를 잴 표본이 없었다" (오차 0 이 아니다)

**③ `market.wape` 는 `null` 일 수 있다.** 0 으로 그리면 "아주 정확하다" 로
읽힌다. 값이 없으면 숫자를 그리지 말고 `unknown` 배지로 대신한다.

`rationale` 은 이미 완성된 한 문장이다. 화면이 조각을 다시 조립하지 말 것 —
제안서도 같은 문장을 쓰므로 두 곳이 갈리면 안 된다.

---

## TypeScript 타입

`src/types/services/` 에 두면 기존 배치와 맞는다.

```ts
export type SalesMode = 'ACQUISITION' | 'EXPANSION'
export type OpportunityStatus =
  | 'OPEN' | 'QUALIFIED' | 'PROPOSED' | 'ENGAGED' | 'WON' | 'LOST'
export type Confidence = 'high' | 'low' | 'unknown'

export interface ProspectRow {
  id: string
  name: string
  region: string
  area: string | null
  property_type: string
  capacity: number | null
  rating: number | null
  contactable: boolean
  has_open_opportunity: boolean
}

export interface OpportunityRow {
  id: string
  mode: SalesMode
  status: OpportunityStatus
  product: string
  score: number | null
  confidence: Confidence | null
  rationale: string | null
  target_name: string | null
  region: string | null
  property_type: string | null
}

export interface ScoreBreakdown {
  gap_score: number
  fit_score: number
  fit_axes: { capacity: number; rating: number; area: number }
  fit_reasons: string[]
  market: {
    region: string
    property_type: string
    demand: number
    supply: number
    wape: number | null
  }
}

export interface OpportunityDetail extends OpportunityRow {
  score_breakdown: ScoreBreakdown | null
  next_action: string | null
  prospect: {
    id: string
    name: string
    area: string | null
    capacity: number | null
    rating: number | null
    contact_email: string | null
    contact_phone: string | null
    source: string
  } | null
}
```

---

## 아직 없는 것

`/admin/sales/:id` 에서 다음 단계로 넘어가려면 필요하지만 지금은 없다.
버튼 자리는 잡아 두되 비활성으로 두는 편이 낫다 — 나중에 화면 구조를 갈아엎지
않는다.

- **제안 생성** — RAG-Marketing 에 영업용 형식(`ONBOARDING_OFFER`)이 없다
- **승인 · 발송** — 알림 생성 API 가 없다 (읽기·읽음 처리만 있음)
- **상태 전이 API** — `PATCH /opportunities/{id}` 가 없다. 지금은 생성 시
  `QUALIFIED` 로 굳고 그 뒤로 못 움직인다
- **반응 추적** — 영업 이벤트(`proposal_viewed` 등)가 택소노미에 없다

## 실행

```bash
# 백엔드 (필수)
cd backend && uvicorn app.main:app --port 8000

# 예측 서비스 (기회 생성에만 필요 — 목록·상세는 없어도 된다)
cd ../ML-Product && uvicorn api.server:app --port 8001

cd frontend && npm run dev
```
