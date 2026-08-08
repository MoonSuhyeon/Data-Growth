# Data-Growth

> Airbnb형 숙박 플랫폼의 **예약 전환 최적화를 위한 데이터 아키텍처 및 Growth Analytics 시스템**
>
> 검색 → 숙소 조회 → 예약 → 결제 퍼널의 행동 데이터를 설계하고, 전환율·이탈률·세그먼트별 성과를 분석하여 **CRO 의사결정을 지원하는 Growth Dashboard**를 구축합니다.

---

## 프로젝트 개요

Data-Growth는 숙박 플랫폼의 고객 행동 데이터를 기반으로 **예약 전환율(CVR)을 개선하기 위한 데이터 설계 및 분석 프로젝트**입니다.

단순히 데이터를 수집하거나 대시보드를 만드는 것이 아니라,

```text
사용자 행동
   ↓
이벤트 설계
   ↓
데이터 수집
   ↓
데이터 모델링
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

으로 이어지는 **Growth Analytics Pipeline**을 설계합니다.

---

# Problem

숙박 플랫폼에서는 사용자가 숙소를 검색하고 상세 정보를 확인한 뒤 예약과 결제까지 이동하지만, 모든 사용자가 예약을 완료하지는 않습니다.

```text
검색
 ↓
숙소 조회
 ↓
숙소 상세
 ↓
예약 시작
 ↓
예약 정보 입력
 ↓
결제
 ↓
예약 완료
```

각 단계에서 사용자가 이탈하면 최종 예약 전환율이 감소합니다.

따라서 단순히 전체 예약 수를 보는 것이 아니라,

* 어느 단계에서 이탈하는가?
* 어떤 지역에서 이탈률이 높은가?
* 어떤 숙소 유형의 전환율이 낮은가?
* 신규 고객과 기존 고객의 행동 차이는 무엇인가?
* 모바일과 PC의 전환율 차이는 무엇인가?
* 검색 결과 → 숙소 상세 조회 → 예약으로 이어지는 과정에서 어떤 요인이 전환을 방해하는가?

를 데이터로 확인할 수 있는 구조가 필요합니다.

---

# Project Goal

### 1. 고객 행동 데이터 구조 설계

검색·숙소 조회·예약·결제 과정에서 발생하는 사용자 행동을 이벤트 단위로 정의합니다.

### 2. 예약 Funnel 데이터 구축

사용자 행동을 퍼널 단계별로 연결하여 전환율과 이탈률을 분석할 수 있도록 설계합니다.

### 3. Growth KPI 설계

예약 전환율, 이탈률, 검색→상세 조회율, 상세→예약 시작률 등 핵심 Growth KPI를 정의합니다.

### 4. CRO Dashboard 구축

지역·숙소·고객 세그먼트별 예약 성과를 비교하고 전환 저해 구간을 빠르게 발견할 수 있도록 Dashboard를 구성합니다.

### 5. Experimentation

데이터에서 발견한 문제를 기반으로 전환 개선 가설을 수립하고 A/B Test를 통해 검증합니다.

---

# 주요 업무

## 1. 사용자 행동 데이터 설계

숙박 플랫폼의 핵심 고객 여정을 이벤트 단위로 정의합니다.

```text
검색
 ↓
숙소 조회
 ↓
숙소 상세 조회
 ↓
예약 시작
 ↓
예약 정보 입력
 ↓
결제 시작
 ↓
예약 완료
```

각 행동을 분석 가능한 이벤트로 구조화합니다.

예:

```text
search_performed
property_viewed
room_viewed
booking_started
booking_info_submitted
payment_started
booking_completed
booking_cancelled
```

이벤트에는 분석에 필요한 공통 속성을 포함합니다.

```text
event_name
user_id
session_id
property_id
room_id
search_id
device_type
location
timestamp
```

이를 통해 개별 사용자 행동을 하나의 고객 여정으로 연결합니다.

---

# 2. 예약 Funnel 데이터 아키텍처 설계

사용자 행동 데이터를 예약 Funnel 분석에 사용할 수 있도록 데이터 구조를 설계합니다.

```text
                     User
                      │
                      ↓
                 Search Event
                      │
                      ↓
               Property View
                      │
                      ↓
               Booking Start
                      │
                      ↓
               Payment Start
                      │
                      ↓
              Booking Complete
```

각 Funnel 단계의 사용자 수를 집계하여 전환율과 이탈률을 계산합니다.

### 핵심 지표

```text
Search → Property View
상세 조회율

Property View → Booking Start
예약 시작 전환율

Booking Start → Payment
결제 진입률

Payment → Booking Complete
결제 완료율

Search → Booking Complete
전체 예약 전환율
```

---

# 3. Growth KPI 설계

숙박 플랫폼의 핵심 Growth KPI를 정의하고 데이터로 산출합니다.

### Acquisition

* 방문자 수
* 신규 사용자 비율
* 채널별 유입 사용자
* 지역별 유입

### Engagement

* 검색 횟수
* 숙소 상세 조회율
* 숙소 찜률
* 평균 숙소 조회 수
* Session Duration

### Conversion

* 예약 전환율
* 검색→예약 전환율
* 숙소 상세→예약 전환율
* 결제 완료율
* Funnel 단계별 이탈률

### Retention

* 재방문율
* 재예약률
* 고객별 예약 횟수
* Cohort Retention

### Revenue

* 예약 매출
* 객단가
* 고객별 매출
* 지역별 매출
* 숙소별 매출

---

# 4. 고객 행동 기반 CRO 분석

예약 Funnel을 기반으로 전환 저해 구간을 분석합니다.

예:

```text
검색 사용자
10,000명
    ↓
숙소 상세 조회
6,000명
    ↓
예약 시작
2,000명
    ↓
결제
1,200명
    ↓
예약 완료
900명
```

이를 통해:

```text
상세 조회
60%

예약 시작
33.3%

결제 진입
60%

예약 완료
75%

최종 전환율
9%
```

처럼 단계별 병목을 확인합니다.

---

# 5. 지역·숙소·고객 세그먼트 분석

전체 평균 전환율만 보는 것이 아니라 세그먼트별 차이를 분석합니다.

### 지역

```text
서울
부산
제주
강릉
경주
...
```

### 숙소 유형

```text
아파트
호텔
게스트하우스
독채
펜션
...
```

### 고객

```text
신규 고객
기존 고객

1회 예약
2회 이상 예약

가격 민감 고객
고가 숙소 선호 고객
```

### 디바이스

```text
Mobile
Desktop
Tablet
```

이를 조합하여 특정 세그먼트에서 전환율이 낮은 원인을 탐색합니다.

---

# 6. Growth Dashboard 구축

전환 최적화 의사결정을 지원하는 Dashboard를 구축합니다.

## Executive Dashboard

```text
┌────────────────────────────────────────┐
│ Booking CVR        Revenue             │
│ 9.0%               ₩120M               │
│                                        │
│ Booking Count      AOV                 │
│ 900                ₩133K               │
└────────────────────────────────────────┘
```

## Funnel Dashboard

```text
Search
  ↓ 60%
Property View
  ↓ 33%
Booking Start
  ↓ 60%
Payment
  ↓ 75%
Booking Complete
```

## Segment Dashboard

```text
지역별 CVR

서울     11.2%
부산      9.8%
제주      7.1%
강릉      6.4%
```

## Property Dashboard

```text
숙소 유형별

호텔          12.1%
아파트         9.8%
게스트하우스    8.2%
펜션           6.9%
```

이를 통해 Growth Team이 **어디서 문제가 발생하고 있는지 → 어떤 고객에게 발생하는지 → 어떤 액션이 필요한지**를 한 화면에서 확인할 수 있도록 구성합니다.

---

# 7. CRO 가설 수립

Dashboard에서 발견한 전환 저해 요인을 개선 가설로 전환합니다.

예:

### 문제

모바일에서 숙소 상세 → 예약 시작 전환율이 Desktop보다 낮음.

```text
Desktop
12.4%

Mobile
7.8%
```

### 가설

모바일 숙소 상세 페이지에서 예약 CTA가 충분히 노출되지 않아 예약 시작률이 낮을 것이다.

### 실험

```text
Control
기존 CTA

        VS

Treatment
하단 Sticky CTA
```

### KPI

Primary:

```text
Booking Start Rate
```

Secondary:

```text
Booking Conversion Rate
Payment Completion Rate
```

---

# 8. A/B Test 설계 및 검증

실험군과 대조군을 정의하고 전환율 차이를 측정합니다.

```text
             User
               │
        ┌──────┴──────┐
        ↓             ↓
    Control       Treatment
        │             │
    기존 UI        개선 UI
        │             │
        └──────┬──────┘
               ↓
          Conversion
               ↓
        Statistical Test
               ↓
          Experiment
          Conclusion
```

단순히 전환율이 증가했는지만 보는 것이 아니라 표본 수, 전환 차이, 통계적 유의성 등을 고려하여 실험 결과를 판단합니다.

---

# Data Architecture

전체 데이터 흐름은 다음과 같이 구성합니다.

```text
                     Airbnb Clone
                          │
                          ↓
                  User Behavior
                          │
         ┌────────────────┼────────────────┐
         ↓                ↓                ↓
      Search          Property View      Booking
         │                │                │
         └────────────────┼────────────────┘
                          ↓
                    Event Tracking
                          │
                          ↓
                    Data Pipeline
                          │
                          ↓
                  Analytics Dataset
                          │
             ┌────────────┼────────────┐
             ↓            ↓            ↓
           Funnel      Segment       Cohort
             │            │            │
             └────────────┼────────────┘
                          ↓
                    Growth KPI
                          │
                          ↓
                   Growth Dashboard
                          │
                          ↓
                    CRO Insight
                          │
                          ↓
                    A/B Testing
                          │
                          ↓
                     Conversion
```

---

# 데이터 모델

## Event

사용자의 행동을 기록합니다.

```text
Event
├── event_id
├── event_name
├── user_id
├── session_id
├── property_id
├── room_id
├── timestamp
└── properties
```

## Search Event

```text
SearchEvent
├── search_id
├── user_id
├── location
├── check_in
├── check_out
├── guest_count
└── timestamp
```

## Property View

```text
PropertyView
├── event_id
├── user_id
├── property_id
├── session_id
└── timestamp
```

## Booking Event

```text
BookingEvent
├── booking_id
├── user_id
├── property_id
├── room_id
├── booking_status
├── amount
└── timestamp
```

---

# 핵심 데이터 설계 원칙

## 1. SSoT

예약·결제·숙소 정보는 원천 시스템을 기준으로 관리하고 Analytics 데이터가 원본 업무 데이터를 임의로 재정의하지 않도록 합니다.

```text
Booking DB
    ↓
Booking Event
    ↓
Analytics
```

---

## 2. Event Taxonomy

사용자 행동을 일관된 이벤트 명명 규칙으로 관리합니다.

```text
search_performed
property_viewed
booking_started
payment_started
booking_completed
```

이벤트 이름과 속성의 의미를 명확하게 정의하여 Funnel 분석의 일관성을 확보합니다.

---

## 3. 사용자 식별

익명 세션과 로그인 사용자의 행동을 연결할 수 있도록 식별자를 관리합니다.

```text
anonymous_id
      ↓
login
      ↓
user_id
```

이를 통해 로그인 이전 행동과 로그인 이후 행동을 연결하여 고객 여정을 분석할 수 있도록 확장합니다.

---

## 4. 분석용 데이터와 업무 데이터 분리

운영 DB의 트랜잭션 데이터를 직접 Dashboard에서 반복 집계하지 않고 분석 목적의 데이터셋을 별도로 구성합니다.

```text
OLTP
 │
 ├── User
 ├── Property
 ├── Booking
 └── Payment
       │
       ↓
Event / ETL
       │
       ↓
Analytics Dataset
       │
       ↓
Dashboard
```

이를 통해 운영 시스템의 성능과 분석 시스템의 요구사항을 분리합니다.

---

# Growth Dashboard 구조

```text
dashboard/
├── overview
│   ├── booking
│   ├── revenue
│   └── conversion
│
├── funnel
│   ├── search
│   ├── property_view
│   ├── booking
│   └── payment
│
├── segment
│   ├── region
│   ├── property_type
│   ├── customer
│   └── device
│
├── retention
│   └── cohort
│
└── experiment
    ├── ab_test
    └── result
```

---

# 기술 스택

* **Frontend**: React / TypeScript
* **Data Processing**: Python / pandas
* **Analytics**: SQL
* **Database**: PostgreSQL
* **Event Tracking**: Custom Event Tracking
* **Dashboard**: Streamlit / TypeScript 기반 Dashboard
* **Visualization**: Chart.js / Recharts
* **Experimentation**: Statistical Testing
* **Backend API**: FastAPI

---

# 프로젝트 구조

```text
data-growth/
│
├── backend/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   └── services/
│
├── tracking/
│   ├── events/
│   ├── taxonomy/
│   └── schemas/
│
├── analytics/
│   ├── sql/
│   ├── notebooks/
│   ├── funnel/
│   ├── segmentation/
│   ├── retention/
│   └── experiments/
│
├── dashboard/
│   ├── overview/
│   ├── funnel/
│   ├── segment/
│   ├── retention/
│   └── experiment/
│
└── docs/
    ├── data-dictionary.md
    ├── event-taxonomy.md
    ├── kpi-definition.md
    └── experiment-design.md
```

---

# 주요 분석 산출물

## Funnel Analysis

검색 → 숙소 조회 → 예약 → 결제 → 완료 단계별 전환율과 이탈률을 분석합니다.

## Segment Analysis

지역·숙소 유형·고객 유형·디바이스별 전환율 차이를 분석합니다.

## Cohort Analysis

가입 또는 첫 예약 시점을 기준으로 고객의 재방문·재예약 행동을 추적합니다.

## Revenue Analysis

예약 건수뿐 아니라 객단가와 고객별 매출을 함께 분석합니다.

## Experiment Analysis

CRO 가설을 A/B Test로 검증하고 실험 결과를 Dashboard에 연결합니다.

---

# 전체 Airbnb 플랫폼과의 연결

Data-Growth는 단독 분석 프로젝트가 아니라 Airbnb형 숙박 플랫폼의 **Growth Team을 담당하는 시스템**으로 설계합니다.

```text
                         Airbnb Platform
                                │
          ┌─────────────────────┼─────────────────────┐
          ↓                     ↓                     ↓
       Product               Marketing             Growth
          │                     │                     │
     ML-Product            RAG-Marketing          Data-Growth
          │                     │                     │
      수요 예측             숙소 정보 활용          CRO Analytics
      예약 수요             콘텐츠 생성             Dashboard
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ↓
                           Customer Support
                                │
                      Agent-Customer-Support
                                │
                       예약/취소/환불 자동화
```

### Product

**ML-Product**

```text
숙소·지역별 예약 수요 예측
        ↓
수요 변화 예측
        ↓
가격 / 재고 / 운영 의사결정
```

### Marketing

**RAG-Marketing**

```text
숙소 상세 정보
      ↓
RAG
      ↓
상품/숙소 콘텐츠 생성
      ↓
마케팅 활용
```

### Growth

**Data-Growth**

```text
고객 행동 데이터
      ↓
Funnel / Segment / Cohort
      ↓
Growth Dashboard
      ↓
CRO Insight
      ↓
A/B Test
      ↓
예약 전환율 개선
```

### Customer Support

**Agent-Customer-Support**

```text
고객 문의
      ↓
Agent
      ↓
숙소 / 예약 / 정책 조회
      ↓
취소 / 환불 / 문의 처리
      ↓
자동 응대
```

---

# 기대 효과

기존의 단순 Analytics가 아니라 다음과 같은 **Growth Loop**를 구축합니다.

```text
                    ┌───────────────┐
                    │ User Behavior │
                    └───────┬───────┘
                            ↓
                    Event Tracking
                            ↓
                     Data Analytics
                            ↓
                     Growth Dashboard
                            ↓
                       CRO Insight
                            ↓
                     Experimentation
                            ↓
                    Conversion Change
                            │
                            └──────────────→
                              User Behavior
```

이를 통해 **데이터 수집 → 분석 → 인사이트 → 실험 → 성과 측정**이 반복되는 데이터 기반 Growth 시스템을 구현합니다.

---

# 핵심 학습 포인트

### Data Architecture

* 사용자 행동 이벤트 설계
* Event Taxonomy
* 데이터 모델링
* OLTP / Analytics 데이터 분리
* ETL Pipeline

### Growth Analytics

* Funnel Analysis
* Cohort Analysis
* Segmentation
* Conversion Rate
* Retention
* LTV
* Revenue Analytics

### CRO

* 전환 저해 요인 분석
* Growth Hypothesis
* A/B Test
* 통계적 유의성 검증
* 실험 결과 분석

### Product Analytics

* 고객 행동 데이터 기반 문제 정의
* KPI 설계
* Dashboard 설계
* 데이터 기반 의사결정

---

# 프로젝트 한 줄 요약

> **Airbnb형 숙박 플랫폼의 고객 행동 데이터를 설계·수집하고, 예약 Funnel과 Growth KPI를 분석하여 CRO 의사결정을 지원하는 데이터 아키텍처 및 Growth Dashboard 구축 프로젝트**
