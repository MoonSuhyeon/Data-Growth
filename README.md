# Data-Growth

> Airbnb형 숙박 플랫폼의 **예약 전환 최적화를 위한 데이터 아키텍처 및 Growth Analytics 시스템**

검색 → 숙소 조회 → 예약 → 결제 퍼널의 행동 데이터를 설계·수집하고,
전환율·이탈률·세그먼트별 성과를 분석하여 **CRO 의사결정과 A/B 테스트**로 연결합니다.

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

## 1. 목적

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

## 2. 문제 정의

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

## 3. 아키텍처

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

## 4. 기술 범위

### 4-1. 예약 도메인 모델 🔨

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

### 4-2. Event Taxonomy 🆕

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

### 4-3. 아이덴티티 스티칭 🆕

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

### 4-4. 퍼널 분석 🆕

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

### 4-5. Growth KPI 🆕

| 영역 | 지표 |
|------|------|
| Acquisition | 방문자 수, 신규 비율, 채널별 유입, 지역별 유입 |
| Engagement | 검색 횟수, 상세 조회율, 위시리스트율, 세션 시간 |
| **Conversion** | 예약 전환율, 단계별 전환율, 결제 완료율, 이탈률 |
| Retention | 재방문율, 재예약률, Cohort Retention |
| Revenue | 예약 매출, 객단가(AOV), 지역·숙소별 매출 |

### 4-6. A/B 테스트 통계 설계 🆕

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

### 4-7. 대시보드 🆕

Streamlit으로 구성 (Python 단일 스택 유지).

| 화면 | 내용 |
|------|------|
| Executive | CVR, 예약 건수, 매출, AOV |
| Funnel | 단계별 전환율·이탈률 |
| Segment | 지역 / 숙소 유형 / 고객 유형 / 디바이스별 CVR |
| Retention | Cohort 히트맵 |
| Experiment | 실험별 결과, 신뢰구간, SRM 상태 |

---

## 5. 구현 로드맵

| Phase | 산출물 | 착수 조건 |
|-------|--------|-----------|
| **0** | 예약 도메인 ERD 확정 (`docs/erd.dbml`) | — |
| **1** | 스키마 Alembic 마이그레이션 (Property / Room / Availability / RoomHold) | Phase 0 |
| **2** | Event Taxonomy 정의 + Pydantic 이벤트 스키마 | Phase 0 |
| **3** | `POST /events` Collector API + 이벤트 테이블 | Phase 2 |
| **4** | 프론트 이벤트 발신 (검색·조회·예약·결제 8종) | Phase 3 |
| **5** | ETL — 세션화 + 아이덴티티 스티칭 | Phase 4 |
| **6** | 퍼널 집계 쿼리 + `/funnel` API | Phase 5 |
| **7** | Streamlit 대시보드 (Executive + Funnel) | Phase 6 |
| **8** | 세그먼트 · 코호트 분석 | Phase 6 |
| **9** | A/B 실험 배정 + 통계 분석 모듈 | Phase 7 |
| **10** | 실험 대시보드 + SRM 체크 | Phase 9 |

**Phase 7까지가 최소 완성선**입니다. 실제 이벤트로 계산된 퍼널이 화면에 뜨면 프로젝트로서 성립합니다.

---

## 6. 완료 정의 (DoD)

- [ ] 이벤트 8종이 정의되고 스키마 검증을 통과해 수집된다
- [ ] 로그인 전후 행동이 하나의 `user_id` 여정으로 연결된다
- [ ] 퍼널 5단계 전환율이 실제 수집 데이터로 계산된다
- [ ] 세그먼트별 CVR 차이가 대시보드에서 비교된다
- [ ] A/B 실험 1건이 **표본 수 산정 → 배정 → SRM 체크 → 유의성 검정**까지 완주한다
- [ ] 실험 설계 문서(가설·MDE·필요 표본·기간)가 실험 전에 작성된다
- [ ] Analytics 쿼리가 OLTP 테이블을 직접 반복 조회하지 않는다

---

## 7. 기술 스택

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

## 8. 프로젝트 구조 (목표)

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

## 9. 핵심 설계 원칙

1. **SSoT** — 예약·결제 원천은 OLTP. Analytics가 업무 데이터를 재정의하지 않는다
2. **Event Taxonomy** — 이벤트 이름과 속성의 의미를 먼저 정의하고 수집한다
3. **OLTP / Analytics 분리** — 대시보드가 운영 DB를 반복 집계하지 않는다
4. **아이덴티티 연결** — 익명 행동을 버리지 않는다. 전환의 앞단이 거기 있다
5. **실험은 설계가 먼저** — MDE와 필요 표본을 정하기 전에 실험을 시작하지 않는다
6. **평균보다 세그먼트** — 전체 CVR이 좋아도 특정 세그먼트가 무너지면 문제로 본다

---

## 10. 다른 레포와의 연결

| 방향 | 내용 |
|------|------|
| **→ ML-Product** | 검색·조회 이벤트를 수요 예측의 선행 지표 피처로 제공 |
| **ML-Product →** | 수요 예측 결과로 프로모션 실험 대상 선정 |
| **RAG-Marketing →** | 생성된 마케팅 콘텐츠를 A/B 테스트 소재로 수신 |
| **Agent-Customer-Support →** | CS 문의·취소 이벤트를 이탈 원인 분석에 반영 |

플랫폼 전체 구성은 [프로필 README](https://github.com/MoonSuhyeon)를 참고하세요.
