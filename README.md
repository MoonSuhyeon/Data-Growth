# Data-Growth

> Airbnb형 숙박 플랫폼의 **예약 전환 최적화를 위한 데이터 아키텍처 및 Growth Analytics 시스템**

검색 → 숙소 조회 → 예약 → 결제 퍼널의 행동 데이터를 설계·수집하고,
전환율·이탈률·세그먼트별 성과를 분석하여 **CRO 의사결정과 A/B 테스트**로 연결합니다.

---

## 1. Architecture

```text
        숙박 예약 서비스 (React)
                  │  이벤트 발생
                  ↓
        [ FastAPI ] Event Collector          🆕
          POST /events  (batch)
                  │
                  ↓
        OLTP (PostgreSQL)                    ✅ 스키마 재사용
          User / Property / Room / Booking / Payment
                  │
                  ↓
        [ Python ] ETL  (pandas + SQL)       🆕
          정제 · 세션화 · 아이덴티티 스티칭
                  │
                  ↓
        Analytics Dataset                    🆕
                  │
        ┌─────────┼──────────┐
        ↓         ↓          ↓
      Funnel   Segment    Cohort
        └─────────┼──────────┘
                  ↓
        [ FastAPI ] Analytics API            🆕
          /funnel  /segment  /cohort  /experiment
                  │
                  ↓
        [ Streamlit ] Growth Dashboard       🆕
                  ↓
             CRO Insight
                  ↓
        [ Python ] A/B Test 분석             🆕
          scipy · statsmodels
```

---

## 2. Implementation

행동을 이벤트로 만들고, 운영 데이터와 분리해 적재한 뒤 집계한다.

| 단계 | 구현 | 핵심 |
|------|------|------|
| **Collect** | `api/v1/events.py` | Pydantic 스키마로 검증. 실패 이벤트는 버리지 않고 격리 테이블로 |
| **Stitch** | `analytics/etl/identity_stitch.py` | 로그인 시점에 `anonymous_id → user_id` 매핑, 과거 행동을 소급 결합 |
| **Sessionize** | `analytics/etl/sessionize.py` | 30분 무활동 기준 세션 분할 |
| **Aggregate** | `analytics/funnel/` | 단계별 unique user로 전환·이탈 산출 |
| **Experiment** | `analytics/experiments/` | 표본 수 산정 → 결정적 배정 → SRM 체크 → 검정 |

### Failure handling

분석 데이터는 조용히 틀리면 잘못된 의사결정으로 이어진다. 각 단계에서 오염을 차단한다.

```text
이벤트 스키마 검증 실패
    ↓ 격리 테이블 적재 (드롭하지 않음)
    ↓ retry — 스키마 수정 후 재처리
ETL 배치 실패
    ↓ retry — 멱등 재실행 (같은 날짜 재처리해도 중복 없음)
    ↓ fallback — 직전 성공 스냅샷 유지, 대시보드에 데이터 기준일 표시
스티칭 실패 (쿠키 삭제·기기 변경)
    ↓ validation — 익명 세션으로 남기고 결합률을 지표로 노출
실험 SRM 감지 (배정 비율 이상)
    ↓ 실험 결과 무효 처리 → 원인 규명 전까지 결론 금지
지표 급변
    ↓ human review — 트래킹 버그인지 실제 변화인지 판단
```

**대시보드에 데이터 기준 시각을 항상 표시한다.** 배치가 실패한 줄 모르고 옛 숫자를 보는 것이 가장 나쁘다.

---

## 3. Evaluation

> Phase 2~9 구현 완료. 아래는 **실제 측정값**이다.
> 재현: `python scripts/run_analytics.py` · 검증: `pytest` (19 tests)
> 데이터는 합성 트래픽이다. 파이프라인이 옳은지 확인하려면 **정답을 아는 데이터**가 필요해서,
> 시뮬레이터에 효과를 의도적으로 심고 분석이 그것을 되찾는지로 검증했다.

### 심어둔 효과 vs 되찾은 값

| 심어둔 값 | 측정값 | 판정 |
|-----------|--------|------|
| treatment 효과 +18% | **+18.7%** (p=0.0016) | 복원 |
| 모바일 예약시작 배수 0.66 | 모바일 24.3% vs 데스크톱 32.9% | 복원 |
| 배정 왜곡 55:45 | SRM 검출 (χ²=59.60, p<0.0001) | 검출 |
| 스키마 깨진 이벤트 0.4% | 격리 0.41% | 검출 |

### 수집

| 항목 | 측정값 |
|------|--------|
| 수신 이벤트 | 23,647건 (방문자 12,000명 · 28일) |
| 수용 / 격리 | 23,550 / **97** |
| 검증 실패율 | 0.41% |

격리 사유 예: `search_performed: 필수 속성 누락 ['search_id']`.
**드롭하지 않고 격리**하므로 스키마를 고친 뒤 재처리할 수 있다.

### 아이덴티티 스티칭

| 기준 | 결합률 |
|------|--------|
| 로그인 이력이 있는 방문자 | **100%** (그 방문자의 익명 구간 전체가 결합) |
| 전체 익명 이벤트 | 14.5% (2,964건) |

두 숫자가 다른 이유는 **대부분의 방문자가 로그인 전에 이탈**하기 때문이다.
낮은 쪽이 실패가 아니라 퍼널의 모양이다. 지표를 볼 때 분모를 명시해야 하는 사례다.

### 예약 퍼널

| # | 단계 | 도달 | 직전 대비 | 최상단 대비 | 이탈 |
|---|------|------|-----------|-------------|------|
| 1 | search_performed | 11,956 | — | 100.0% | — |
| 2 | property_viewed | 7,326 | 61.3% | 61.3% | 4,630 |
| 3 | **booking_started** | 2,021 | **27.6%** | 16.9% | **5,305** |
| 4 | payment_started | 1,233 | 61.0% | 10.3% | 788 |
| 5 | booking_completed | 934 | 75.8% | **7.8%** | 299 |

**최대 병목은 `booking_started`** 다. 조회는 했는데 예약을 시작하지 않는 구간에서 5,305명이 빠진다.

### 세그먼트 — 전체 평균이 가리는 것

| 디바이스 | 방문자 | 최종 CVR | 예약 시작률 |
|----------|--------|----------|-------------|
| DESKTOP | 3,975 | 9.91% | 32.9% |
| TABLET | 1,061 | 7.82% | 28.7% |
| **MOBILE** | 6,920 | **6.60%** | **24.3%** |

트래픽의 58%를 차지하는 모바일이 데스크톱보다 예약 시작률이 **8.6%p 낮다.**
전체 CVR 7.81%만 보면 보이지 않는다. CRO 가설은 여기서 나온다.

### A/B 실험 — 설계를 먼저 고정한다

```text
가설    모바일 상세 페이지에 sticky CTA 를 노출하면 예약 시작률이 오른다
기준선  24.31%   MDE 10%(상대)   α 0.05   power 0.80
→ 그룹당 필요 표본 5,049명
```

| 절차 | 결과 |
|------|------|
| 배정 | control 2,151 / treatment 2,081 (결정적 해시 배정) |
| **SRM 체크** | 정상 (χ²=1.158, p=0.2819) |
| **표본 충족** | ❌ 2,151 < 5,049 — **실제 운영이라면 여기서 결론을 내지 않는다** |
| 검정 | 22.32% → 26.48% (**+18.7%**), p=0.0016, 95% CI [+1.58%p, +6.75%p] |

표본이 부족한데 p 값이 작게 나왔다. 이것이 **peeking 이 위험한 이유**다.
목표 표본을 채우기 전에 결과를 보면 우연한 유의성을 진짜 효과로 착각하게 된다.
파이프라인은 유의성과 별개로 **표본 미달을 경고**한다.

SRM 검출 확인 — 배정을 일부러 55:45 로 틀었을 때:

```text
{'control': 3299, 'treatment': 2701} → SRM 이상 (χ²=59.601, p<0.0001)
→ 50:50 을 기대했는데 배정이 틀어졌다. 결과 해석을 멈춰야 한다.
```

### 남은 목표치

| 항목 | 목표 | 상태 |
|------|------|------|
| `POST /events` P95 | < 50 ms | FastAPI 라우터 배선 후 |
| ETL 세션화 소요 | 일 100만 건 < 10분 | 규모 확대 후 |
| 퍼널 집계 쿼리 | < 3초 | DB 적재 후 |

---

## 4. Engineering Decisions

| 결정 | 채택 | 이유와 대안 |
|------|------|-------------|
| 수집 방식 | **자체 Collector API** | 상용 도구는 클라이언트 이벤트에 강하지만 결제 완료 같은 **서버 사이드 사실**과 익명→회원 결합을 함께 다루기 어렵다 |
| 저장 구조 | **OLTP / Analytics 분리** | 대시보드가 운영 테이블을 반복 집계하면 예약·결제 트랜잭션 성능을 갉아먹는다 |
| 처리 방식 | **배치 ETL** | 퍼널·코호트는 일 단위 분석이다. 스트리밍 인프라를 들일 요구가 아직 없다 |
| 식별자 | **소급 결합** | 로그인 이후만 보면 전환의 앞단이 통째로 사라진다 |
| 재고 점유 | **DB UNIQUE + TTL** | 비관적 락은 대기를 만들고 낙관적 락은 재시도가 복잡하다. 제약은 충돌을 즉시 실패로 만든다 |
| 대시보드 | **Streamlit** | 화면 하나를 위해 별도 프론트엔드를 유지보수할 이유가 없다 |
| 실험 절차 | **표본 수 사전 확정** | 매일 결과를 보면 유의하다는 결론이 우연히 나온다(peeking) |

### Trade-offs

| 얻은 것 | 포기한 것 |
|---------|-----------|
| 서버·클라이언트 이벤트를 한 스키마로 다룬다 | 봇 필터링·크로스 디바이스 식별을 **직접 만들어야** 한다 |
| 운영 DB 성능이 분석 부하와 무관해진다 | 데이터가 **한 단계 늦게** 보인다 |
| 인프라가 가볍다 | 이벤트가 늘면 **배치 ETL이 먼저 한계**에 닿는다 |
| 로그인 전 행동을 잃지 않는다 | 쿠키 삭제·기기 변경 시 **여정이 끊긴다** |
| 이중 예약이 원천 차단된다 | 충돌이 **사용자에게 즉시 실패로 노출**된다 |
| 실험 결론을 신뢰할 수 있다 | 목표 표본까지 **기다려야 한다** |

---

## 5. Operations

> 테스트·배포·관측은 구현과 함께 붙인다. 아래는 **적용할 구성**이며, 현재 구축된 항목은 ✅로 표시했다.

### Testing

| 대상 | 검증 내용 |
|------|-----------|
| 이벤트 스키마 | 필수 속성 누락·타입 불일치가 격리 테이블로 가는지 |
| **세션화 경계** | 30분 경계, 자정 넘김, 동시 다중 탭 |
| **스티칭** | 로그인 시 과거 익명 이벤트가 정확히 결합되는지 |
| 퍼널 SQL | 골든 데이터셋으로 단계별 전환율이 기대값과 일치하는지 |
| 실험 배정 | 같은 user_id가 항상 같은 그룹에 들어가는지 (결정적 배정) |
| ETL 멱등성 | 같은 날짜를 두 번 처리해도 중복이 생기지 않는지 |

### CI/CD

```text
push → ruff · black
     → pytest
     → alembic upgrade --sql     마이그레이션 dry-run
     → 퍼널 골든 테스트
     → docker build
```

### Container

`Dockerfile`(Collector · Analytics API) + `docker-compose.yml`(PostgreSQL · API · Streamlit · ETL 워커).

### Observability

| 항목 | 노출 |
|------|------|
| 수집률 | 초당 이벤트 수, 검증 실패율 |
| **데이터 기준 시각** | 대시보드 상단에 항상 표시 — 배치 실패를 모르고 옛 숫자를 보는 것이 가장 나쁘다 |
| ETL 배치 | 성공·실패·소요시간 |
| 스티칭 결합률 | 익명 세션이 회원으로 이어진 비율 |
| 실험 SRM | 배정 비율 이상 감지 알림 |

### Scalability

병목은 **Collector 쓰기와 배치 ETL**이다.

- 1차: 이벤트 테이블 월 단위 파티셔닝, 배치 삽입
- 2차: ETL을 전체 재계산이 아닌 증분 처리로
- 그 이상: Collector와 적재 사이에 큐(Kafka)를 넣어 쓰기 스파이크를 흡수

---

## 문서 성격

이 문서는 **구현 명세(Spec)** 입니다. 완성된 결과물이 아니라 만들어 가는 목표 상태를 기술합니다.
각 항목의 진행 상태는 다음 표기로 구분합니다.

| 표기 | 의미 |
|------|------|
| ✅ | 구현 완료 |
| 🔨 | 진행 중 |
| 🆕 | 예정 |

예약 트랜잭션 백엔드(FastAPI + PostgreSQL, 40여 개 테이블)를 기반으로, 그 위에 **이벤트 트래킹 · 퍼널 분석 · 실험 체계**를 얹는 것이 이 프로젝트의 범위입니다.

---

## 목적

```text
사용자 행동
   ↓
이벤트 설계
   ↓
수집 (FastAPI Collector)
   ↓
데이터 모델링 (OLTP / Analytics 분리)
   ↓
KPI / Funnel 분석
   ↓
전환 저해 요인 발견
   ↓
CRO 가설 수립
   ↓
A/B Test
   ↓
성과 측정
```

대시보드를 만드는 것이 목적이 아니라, **어디서 왜 이탈하는지 찾아 실험으로 검증하는 루프**를 만드는 것이 목적입니다.

---

## 문제 정의

```text
검색 → 숙소 조회 → 숙소 상세 → 예약 시작 → 예약 정보 입력 → 결제 → 예약 완료
```

각 단계에서 이탈이 발생하지만, 전체 예약 수만 보면 원인을 알 수 없습니다.

- 어느 단계에서 이탈하는가?
- 어떤 지역·숙소 유형의 전환율이 낮은가?
- 신규 고객과 재방문 고객의 행동은 어떻게 다른가?
- 모바일과 PC의 차이는?
- **로그인 전 행동과 로그인 후 행동을 어떻게 하나의 여정으로 잇는가?**

마지막 항목이 이 프로젝트의 기술적 핵심입니다.

---

## 기술 범위

### 예약 도메인 모델 🔨

전환 분석의 토대는 예약 트랜잭션 스키마입니다. 핵심 엔티티는 다음과 같습니다.

| 엔티티 | 역할 |
|--------|------|
| `Property` | 숙소 |
| `Room` | 객실 — **재고 단위** |
| `Availability` | 날짜별 재고·가격 |
| `RoomHold` | 결제 전 임시 점유 |
| `Booking` | 예약 |
| `Payment` / `Refund` | 결제·환불 |
| `CancellationPolicy` | 취소·환불 규정 |
| `User` | 회원 / **비회원**(`is_guest`) |
| `Coupon` / `Point` / `Membership` | 프로모션 수단 |
| `Review` / `Wishlist` | 참여 행동 |

**재고 점유 동시성**: 같은 객실·날짜에 대한 이중 예약을 막기 위해 `RoomHold` 테이블에 `UNIQUE(room_id, stay_date)` 제약 + 10분 TTL + lazy cleanup을 사용합니다.

```text
객실 선택 → RoomHold 생성 (UNIQUE 충돌 시 즉시 실패)
       ↓
결제 완료 → RoomHold 삭제 + Booking 생성
       ↓
만료(10분) → 다음 요청 시 만료 Hold 정리 후 재시도
```

> 비관적 락(`SELECT FOR UPDATE`)은 대기가 발생하고, 낙관적 락은 재시도 로직이 복잡해집니다. **DB 제약으로 충돌을 즉시 감지**하는 방식을 택했습니다.

> 상태값은 enum이 아니라 **코드 테이블(Lookup Table)** 로 관리합니다. 운영 중 값 추가·한국어 표시명·정렬순서·활성화 여부를 DB에서 다룰 수 있어야 하기 때문입니다. 이벤트 타입과 실험 상태에도 같은 패턴을 적용합니다.

### Event Taxonomy 🆕

```text
search_performed
property_viewed
room_viewed
wishlist_added
booking_started
booking_info_submitted
payment_started
booking_completed
booking_cancelled
```

공통 속성:

```text
event_id · event_name · anonymous_id · user_id · session_id
property_id · room_id · search_id
device_type · referrer · timestamp · properties(JSONB)
```

**명명 규칙**: `<object>_<past_tense_verb>`. 이벤트 스키마는 Pydantic 모델로 정의하고, Collector에서 검증 실패한 이벤트는 별도 테이블에 격리합니다.

> 이벤트 정의는 **수집보다 먼저** 확정합니다. 이름과 속성의 의미가 흔들리면 나중에 쌓인 데이터 전체를 신뢰할 수 없게 됩니다.

### 아이덴티티 스티칭 🆕

로그인 전 익명 행동과 로그인 후 행동을 하나의 여정으로 잇습니다.

```text
anonymous_id (쿠키)
      │
      │  search_performed
      │  property_viewed        ← 로그인 전
      │  booking_started
      ↓
   login / signup
      │
      ↓
   user_id 부여
      │
      ↓
  identity_map(anonymous_id → user_id)로
  과거 이벤트 소급 결합
      │
      │  payment_started        ← 로그인 후
      │  booking_completed
```

> 비회원 예약을 `Booking`에 `guest_name`·`guest_phone` 컬럼으로 붙이지 않고 `users.is_guest` 플래그로 처리한 이유가 여기서 드러납니다. `Booking`이 항상 `user_id`를 참조하므로 **비회원 → 회원 전환 시에도 `user_id`가 유지**되고, 전환 전후 행동이 끊기지 않습니다.

### 퍼널 분석 🆕

```text
검색 사용자        10,000
    ↓ 60.0%
숙소 상세 조회      6,000
    ↓ 33.3%
예약 시작           2,000
    ↓ 60.0%
결제 진입           1,200
    ↓ 75.0%
예약 완료             900

최종 전환율          9.0%
```

**설계 결정 사항**:

| 항목 | 선택 |
|------|------|
| 세션 정의 | 30분 무활동 시 종료 |
| 퍼널 귀속 | 세션 내 순서 무관 도달 방식 (strict path 아님) |
| 중복 제거 | 단계별 unique user 기준 |
| 기간 경계 | 세션이 날짜를 넘으면 시작일에 귀속 |

### Growth KPI 🆕

| 영역 | 지표 |
|------|------|
| Acquisition | 방문자 수, 신규 비율, 채널별 유입, 지역별 유입 |
| Engagement | 검색 횟수, 상세 조회율, 위시리스트율, 세션 시간 |
| **Conversion** | 예약 전환율, 단계별 전환율, 결제 완료율, 이탈률 |
| Retention | 재방문율, 재예약률, Cohort Retention |
| Revenue | 예약 매출, 객단가(AOV), 지역·숙소별 매출 |

### A/B 테스트 통계 설계 🆕

**"전환율이 올랐다"만으로는 결론을 내지 않습니다.**

| 항목 | 방법 |
|------|------|
| 표본 수 산정 | Power Analysis (α=0.05, power=0.8, MDE 사전 정의) |
| 배정 | `hash(user_id + experiment_id)` 결정적 배정 |
| 건전성 체크 | **SRM(Sample Ratio Mismatch)** — 배정 비율 이상 감지 |
| 검정 | 비율 검정 (two-proportion z-test) |
| 조기 종료 방지 | 목표 표본 도달 전 결과 확인 금지 (**peeking 문제**) |
| 보조 지표 | Guardrail metric 동시 모니터링 |

> 표본 수를 먼저 정하지 않고 매일 결과를 들여다보면 유의하다는 결론이 우연히 나옵니다. 이 프로젝트는 **실험 설계 단계에서 MDE와 필요 표본을 문서화하는 것**을 필수 절차로 둡니다.

### 대시보드 🆕

Streamlit으로 구성 (Python 단일 스택 유지).

| 화면 | 내용 |
|------|------|
| Executive | CVR, 예약 건수, 매출, AOV |
| Funnel | 단계별 전환율·이탈률 |
| Segment | 지역 / 숙소 유형 / 고객 유형 / 디바이스별 CVR |
| Retention | Cohort 히트맵 |
| Experiment | 실험별 결과, 신뢰구간, SRM 상태 |

---

## 구현 로드맵

| Phase | 산출물 | 착수 조건 |
|-------|--------|-----------|
| **0** | 예약 도메인 ERD 확정 (`docs/erd.dbml`) | — |
| **1** | 스키마 Alembic 마이그레이션 (Property / Room / Availability / RoomHold) | Phase 0 |
| **2** | ✅  Event Taxonomy 정의 + Pydantic 이벤트 스키마 | Phase 0 |
| **3** | ✅  `POST /events` Collector API + 이벤트 테이블 | Phase 2 |
| **4** | ✅  프론트 이벤트 발신 (검색·조회·예약·결제 8종) | Phase 3 |
| **5** | ✅  ETL — 세션화 + 아이덴티티 스티칭 | Phase 4 |
| **6** | ✅  퍼널 집계 쿼리 + `/funnel` API | Phase 5 |
| **7** | Streamlit 대시보드 (Executive + Funnel) | Phase 6 |
| **8** | ✅  세그먼트 · 코호트 분석 | Phase 6 |
| **9** | ✅  A/B 실험 배정 + 통계 분석 모듈 | Phase 7 |
| **10** | 실험 대시보드 + SRM 체크 | Phase 9 |

**Phase 7까지가 최소 완성선**입니다. 실제 이벤트로 계산된 퍼널이 화면에 뜨면 프로젝트로서 성립합니다.

---

## 완료 정의 (DoD)

- [ ] 이벤트 8종이 정의되고 스키마 검증을 통과해 수집된다
- [ ] 로그인 전후 행동이 하나의 `user_id` 여정으로 연결된다
- [ ] 퍼널 5단계 전환율이 실제 수집 데이터로 계산된다
- [ ] 세그먼트별 CVR 차이가 대시보드에서 비교된다
- [ ] A/B 실험 1건이 **표본 수 산정 → 배정 → SRM 체크 → 유의성 검정**까지 완주한다
- [ ] 실험 설계 문서(가설·MDE·필요 표본·기간)가 실험 전에 작성된다
- [ ] Analytics 쿼리가 OLTP 테이블을 직접 반복 조회하지 않는다

---

## 기술 스택

### 핵심 (Python / FastAPI)

| 영역 | 기술 |
|------|------|
| 언어 | Python 3.11 |
| API | **FastAPI**, Pydantic v2, Uvicorn |
| ORM | SQLAlchemy 2.0 (async), asyncpg |
| 마이그레이션 | Alembic |
| DB | PostgreSQL |
| 데이터 처리 | pandas, SQL |
| 통계 | scipy, statsmodels |
| 대시보드 | **Streamlit** |
| 시각화 | Plotly |
| 인증 | python-jose (JWT) |
| 테스트 | pytest |

### 이벤트 발생원

React 18 + TypeScript + Vite + Zustand — 예약 서비스 화면 + 트래킹 SDK

---

## 프로젝트 구조 (목표)

```text
Data-Growth/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/v1/
│   │   │   ├── properties.py       🔨
│   │   │   ├── bookings.py         🔨
│   │   │   ├── payments.py         ✅
│   │   │   ├── events.py           🆕  Collector
│   │   │   ├── funnel.py           🆕
│   │   │   ├── segment.py          🆕
│   │   │   ├── cohort.py           🆕
│   │   │   └── experiment.py       🆕
│   │   ├── models/
│   │   ├── schemas/
│   │   │   └── events.py           🆕  이벤트 스키마
│   │   └── services/
│   │       ├── room_hold.py        🔨  재고 점유
│   │       └── pricing.py          ✅
│   └── alembic/versions/
├── tracking/                        🆕
│   ├── taxonomy.py                 이벤트 정의
│   └── sdk/                        프론트 트래킹 SDK
├── analytics/                       🆕
│   ├── etl/
│   │   ├── sessionize.py
│   │   └── identity_stitch.py
│   ├── sql/
│   ├── funnel/
│   ├── segmentation/
│   ├── retention/
│   └── experiments/
│       ├── power.py                표본 수 산정
│       ├── assign.py               결정적 배정
│       └── analyze.py              검정 + SRM
├── dashboard/                       🆕  Streamlit
│   ├── Home.py
│   └── pages/
├── frontend/                        🔨  React (이벤트 발생원)
├── docs/
│   ├── erd.dbml
│   ├── data-dictionary.md          🆕
│   ├── event-taxonomy.md           🆕
│   ├── kpi-definition.md           🆕
│   └── experiment-design.md        🆕
└── requirements.txt
```

---

## 핵심 설계 원칙

1. **SSoT** — 예약·결제 원천은 OLTP. Analytics가 업무 데이터를 재정의하지 않는다
2. **Event Taxonomy** — 이벤트 이름과 속성의 의미를 먼저 정의하고 수집한다
3. **OLTP / Analytics 분리** — 대시보드가 운영 DB를 반복 집계하지 않는다
4. **아이덴티티 연결** — 익명 행동을 버리지 않는다. 전환의 앞단이 거기 있다
5. **실험은 설계가 먼저** — MDE와 필요 표본을 정하기 전에 실험을 시작하지 않는다
6. **평균보다 세그먼트** — 전체 CVR이 좋아도 특정 세그먼트가 무너지면 문제로 본다

---

## 다른 레포와의 연결

| 방향 | 내용 |
|------|------|
| **→ ML-Product** | 검색·조회 이벤트를 수요 예측의 선행 지표 피처로 제공 |
| **ML-Product →** | 수요 예측 결과로 프로모션 실험 대상 선정 |
| **RAG-Marketing →** | 생성된 마케팅 콘텐츠를 A/B 테스트 소재로 수신 |
| **Agent-Customer-Support →** | CS 문의·취소 이벤트를 이탈 원인 분석에 반영 |

플랫폼 전체 구성은 [프로필 README](https://github.com/MoonSuhyeon)를 참고하세요.
