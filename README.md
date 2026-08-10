# Conversion Optimization You Can Actually Trust

*Personal project*

Most of a booking funnel happens before anyone logs in. People search, open
listings, compare, and leave — **and the account that would identify them does
not exist yet.** If analytics starts at login, the entire front half of the
funnel is invisible, and every improvement idea becomes a guess.

Once the funnel is visible, a second problem shows up. A dashboard will happily
report that conversion rose 18% and that the result is statistically
significant. **Both statements can be true and the conclusion still wrong** — if
the sample never reached its target, if assignment drifted from 50/50, or if
someone checked the numbers every morning until they looked good.

So the question this project answers is not "what is our conversion rate" but
**"can I trust this number, and can I trust the experiment that says I improved
it?"**

I built an analytics pipeline where **events are defined before they are
collected, anonymous behavior is stitched back onto the account it turns into,
and experiments are designed — sample size fixed, assignment verified, sanity
checked — before anyone is allowed to read the result.**

---

## Architecture

```
              ┌────────────────────────────────────────────────┐
              │             BOOKING SERVICE  (React)           │
              │  search · listing · rooms · booking · payment  │
              └───────────────────────┬────────────────────────┘
                                      │  events
                                      ▼
        ┌──────────────────────────────────────────────────────────┐
        │              EVENT COLLECTOR   POST /events              │
        │                                                          │
        │  TAXONOMY  defined before collection                     │
        │    search_performed · property_viewed · room_viewed      │
        │    wishlist_added · booking_started · info_submitted     │
        │    payment_started · booking_completed · cancelled       │
        │                                                          │
        │  every event carries                                     │
        │    anonymous_id · user_id? · session_id · device         │
        │    property_id · region · timestamp · properties         │
        │                                                          │
        │        ┌──────────────┬────────────────────────┐         │
        │        │ schema ok    │ schema fail            │         │
        │        │ → store      │ → QUARANTINE           │         │
        │        │              │   never dropped        │         │
        │        │              │   reprocess after fix  │         │
        │        └──────────────┴────────────────────────┘         │
        └───────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
        ┌──────────────────────────────────────────────────────────┐
        │                    OLTP  (PostgreSQL)                    │
        │                                                          │
        │  User (is_guest) · Property · Room · Availability        │
        │  RoomHold · Booking · Payment · Refund                   │
        │  CancellationPolicy · Coupon · Point · Review            │
        │                                                          │
        │  RoomHold: UNIQUE(room_id, stay_date) + 10m TTL          │
        │  double booking fails at the constraint, not in code     │
        └───────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
        ┌──────────────────────────────────────────────────────────┐
        │                          ETL                             │
        │                                                          │
        │  ┌────────────────────────┐  ┌────────────────────────┐  │
        │  │ SESSIONIZE             │  │ IDENTITY STITCH        │  │
        │  │ 30-min inactivity gap  │  │                        │  │
        │  │ session pinned to its  │  │ anonymous_id ─┐        │  │
        │  │ start date, even       │  │   search      │        │  │
        │  │ across midnight        │  │   view        │ before │  │
        │  └────────────────────────┘  │   start ──────┘ login  │  │
        │                              │      ↓                 │  │
        │  idempotent: same day can    │   login → user_id      │  │
        │  be reprocessed safely       │      ↓                 │  │
        │                              │  past events joined    │  │
        │                              │  retroactively         │  │
        │                              │  shared device → the   │  │
        │                              │  earliest login wins   │  │
        │                              └────────────────────────┘  │
        └───────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
        ┌──────────────────────────────────────────────────────────┐
        │                   ANALYTICS DATASET                      │
        │            separate from OLTP by design                  │
        │   dashboards never repeat-aggregate booking tables       │
        └───┬──────────────────┬───────────────────┬───────────────┘
            ▼                  ▼                   ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐
    │   FUNNEL     │   │   SEGMENT    │   │     COHORT       │
    │              │   │              │   │                  │
    │ search       │   │ device       │   │ first-booking    │
    │ → view       │   │ region       │   │ retention        │
    │ → start      │   │ property type│   │                  │
    │ → payment    │   │ new/return   │   │                  │
    │ → complete   │   │              │   │                  │
    │              │   │              │   │                  │
    │ unique       │   │              │   │                  │
    │ journeys,    │   │              │   │                  │
    │ reach-based  │   │              │   │                  │
    └──────────────┘   └──────────────┘   └──────────────────┘
                                    │
                                    ▼
        ┌──────────────────────────────────────────────────────────┐
        │                     EXPERIMENTS                          │
        │              design first, read result last              │
        │                                                          │
        │  1  POWER      n per group from baseline, MDE, α, power   │
        │  2  ASSIGN     hash(experiment_id + unit) — deterministic │
        │                same user always lands in the same arm     │
        │  3  SRM        χ² goodness-of-fit at α = 0.001            │
        │                mismatch → stop interpreting              │
        │  4  TEST       two-proportion z + CI on absolute lift     │
        │                                                          │
        │  under-powered samples are flagged even when p is small  │
        └───────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
              ┌──────────────────────────────────────────────┐
              │            GROWTH DASHBOARD  (Streamlit)     │
              │  executive · funnel · segment · experiment   │
              │  data-as-of timestamp always shown           │
              └──────────────────────────────────────────────┘
```

---

## Results

Validated against synthetic traffic with known ground truth — effects are
planted in the simulator, and the pipeline has to recover them.

| Planted | Recovered |
|---|---|
| Treatment effect **+18%** | **+18.7%**, p = 0.0016 |
| Mobile booking-start multiplier 0.66 | Mobile 24.3% vs Desktop 32.9% |
| Assignment skewed to 55:45 | SRM detected, χ² = 59.60, p < 0.0001 |
| Malformed events 0.4% | 0.41% quarantined |

Funnel over 23,647 events from 12,000 visitors:

| Step | Users | Step rate | Drop |
|---|---|---|---|
| search_performed | 11,956 | — | — |
| property_viewed | 7,326 | 61.3% | 4,630 |
| **booking_started** | 2,021 | **27.6%** | **5,305** |
| payment_started | 1,233 | 61.0% | 788 |
| booking_completed | 934 | 75.8% | 299 |

Overall conversion 7.81%. The bottleneck is `booking_started`, and it is worse
on mobile — 24.3% vs 32.9% on desktop, on 58% of the traffic. That gap is the
hypothesis, not the dashboard.

**The most useful result is a negative one.** In the sample experiment the
p-value came out at 0.0016 while the sample had reached only 2,151 of the 5,049
required per group. The pipeline reports significance *and* refuses to call it,
because a small p-value on an under-powered sample is exactly what peeking
produces.

Stitching is reported against two denominators on purpose: **100%** of anonymous
events belonging to a visitor who eventually logs in, but **14.5%** of all
anonymous events — because most visitors leave before logging in. The low
number is the shape of the funnel, not a defect.

## Stack

| | |
|---|---|
| Language | Python 3.11 |
| Collector / API | FastAPI · Pydantic v2 |
| Storage | PostgreSQL · SQLAlchemy 2.0 (async) · Alembic |
| Processing | pandas · SQL |
| Statistics | scipy — power, z-test and χ² implemented directly |
| Dashboard | Streamlit |
| Event source | React 18 · TypeScript · Vite · Zustand |
| Testing | pytest — 19 tests |

## Run locally

```bash
pip install -r backend/requirements.txt
pytest                            # 19 tests
python scripts/run_analytics.py   # collect → stitch → funnel → experiment
```

## Docs

| | |
|---|---|
| `tracking/taxonomy.py` | Event definitions and required properties |
| `analytics/etl/identity.py` | Anonymous → account stitching |
| `analytics/experiments/stats.py` | Power, assignment, SRM, z-test |
| `analytics/simulator.py` | Traffic with planted effects, for validation |
| `docs/erd.dbml` | Booking domain schema |
