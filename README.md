# Identity Stitching and Experiment Design for Conversion Optimization

*Personal project*

![Data / Experimentation](https://img.shields.io/badge/Data%20%2F%20Experimentation-0B1220?style=for-the-badge)

![event tracking](https://img.shields.io/badge/event%20tracking-1D4ED8?style=for-the-badge) ![identity stitching](https://img.shields.io/badge/identity%20stitching-1D4ED8?style=for-the-badge) ![funnel analytics](https://img.shields.io/badge/funnel%20analytics-1D4ED8?style=for-the-badge) ![experiment design](https://img.shields.io/badge/experiment%20design-B45309?style=for-the-badge) ![statistical validation](https://img.shields.io/badge/statistical%20validation-B45309?style=for-the-badge)

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

A planted **+18%** effect recovered as **+18.7%** (p = 0.0016) · SRM detected at χ² = 59.60 · **19 tests**

---

## Architecture

```
              ┌────────────────────────────────────────────────┐
              │          BOOKING SERVICE  (Next.js)            │
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
        │  User (is_guest) · Property · RoomType · Room · StayDate │
        │  RoomHold · Booking · BookingRoom · Payment · Refund     │
        │  RatePlan · PeakDate · Coupon · Point · Review           │
        │                                                          │
        │  StayDate = property × room_type × one night             │
        │  RoomHold: UNIQUE(stay_date_id, room_id) + TTL           │
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
              │           OPERATOR CONSOLE  (Next.js)        │
              │                                              │
              │  growth      funnel · segment · experiment   │
              │  forecast    ──→ ML-Product          :8001   │
              │  content     ──→ RAG-Marketing       :8002   │
              │  support     ──→ Agent-CS            :8003   │
              │  + properties · bookings · refunds · coupons │
              │                                              │
              │  BFF (app/api/*) absorbs each service's      │
              │  response shape, so a change there does not  │
              │  reach the screens. Types are generated from │
              │  their committed `openapi.json`.             │
              └──────────────────────────────────────────────┘
```

The console is where the loop closes: the forecast points at properties with low
demand, content generation writes copy for exactly those, the experiment framework
decides whether the copy worked, and the support agent's cancellations feed
inventory back into the forecast. **Four repositories, one operator's screen.**

---

## Stack

| | |
|---|---|
| Language | Python 3.11 |
| Collector / API | FastAPI · Pydantic v2 |
| Storage | PostgreSQL · SQLAlchemy 2.0 (async) · Alembic |
| Processing | pandas · SQL |
| Statistics | scipy — power, z-test and χ² implemented directly |
| Console & booking UI | Next.js 15 · React 19 · TypeScript · Tailwind 4 · Zustand |
| Service boundary | BFF route handlers · types generated from each service's `openapi.json` |
| Testing | pytest — 19 tests |

---

## Trade-offs

Validated against synthetic traffic with planted effects — the pipeline has to
recover what the simulator injected.

| Planted | Recovered |
|---|---|
| Treatment effect **+18%** | **+18.7%**, p = 0.0016 |
| Mobile booking-start multiplier 0.66 | Mobile 24.3% vs Desktop 32.9% |
| Assignment skewed to 55:45 | SRM detected, χ² = 59.60, p < 0.0001 |
| Malformed events 0.4% | 0.41% quarantined |

### Own collector instead of GA4 or GTM

**Buys** — server-side facts such as payment completion and the anonymous→account
join live in one schema, under one definition. Stitching reaches **100%** of the
anonymous events belonging to a visitor who eventually logs in.
**Costs** — bot filtering, cross-device identity and consent handling are all
now things to build. A hosted tool would have provided them.

Stitching is also reported at **14.5%** of *all* anonymous events, because most
visitors leave before logging in. The low number is the shape of the funnel, not
a defect — which is why the denominator is always stated.

### OLTP and analytics kept separate

**Buys** — dashboards never repeat-aggregate booking tables, so analysis load
cannot degrade the transaction path. Funnel queries target a dataset shaped for
them.
**Costs** — data is one processing step behind, so the dashboard always shows a
data-as-of timestamp rather than pretending to be live.

### Batch ETL instead of streaming

**Buys** — no queue or stream processor to operate for analysis that is read
daily. Reprocessing a day is idempotent and safe.
**Costs** — this is the first thing that breaks as volume grows. Event tables are
partitioned monthly to delay that, and a queue in front of the collector is the
planned next step, not a current one.

### A database constraint instead of a lock for room holds

**Buys** — `UNIQUE(stay_date_id, room_id)` with a TTL makes double booking
impossible rather than unlikely, and a conflict fails immediately instead of
waiting on a lock.
**Costs** — the loser of a race sees an immediate failure. There is no queue and
no retry-until-available.

### One table for the listing and the place

A cinema separates what you watch from where you watch it, so a showing is a
join of the two. Lodging has no such split — **the listing is the place.** The
schema therefore keeps the description, the photos, the reviews and the address
on a single `properties` row, and the bookable unit becomes
`StayDate = property × room_type × one night`.

**Buys** — a search result, a detail page and a map pin all read one row, so
there is no join to keep consistent and no way for the two halves to disagree.
The inventory unit stays one row per night, which is exactly the grain the
demand model and the funnel both count in.
**Costs** — a host operating several buildings has no entity above the listing,
so cross-property reporting has to group by `region` or `host_name` rather than
follow a foreign key. Adding that later means a real migration, not a view.

### Sample size fixed before the result is read

The clearest result in this repository is a refusal.

A run produced **p = 0.0016** — with **2,151** of the **5,049** required per
group. The pipeline reports the significance and flags the shortfall, because a
small p-value on an under-powered sample is exactly what peeking produces.

**Buys** — a conclusion that survives scrutiny, and SRM detection that catches
assignment drift before interpretation begins.
**Costs** — waiting. An experiment cannot be called early even when the number
looks good.

### Quarantine instead of dropping malformed events

**Buys** — 0.41% of events failed validation and were kept, so the schema can be
fixed and the events reprocessed. Failure rate itself becomes a collection-quality
metric.
**Costs** — an extra table and a reprocessing path to maintain.

## Run locally

```bash
pip install -r backend/requirements.txt
pytest                            # 19 tests
python scripts/run_analytics.py   # collect → stitch → funnel → experiment

# booking API + console — no database to install
cp backend/.env.demo backend/.env
uvicorn app.main:app --app-dir backend --reload   # :8000, SQLite, seeds itself

cd frontend && npm install && npm run dev         # :3000
```

**No PostgreSQL required to run it.** The models use dialect-neutral column types,
so the same schema builds on SQLite; the app creates it and seeds 41 properties on
first boot. PostgreSQL stays the production path and Alembic owns it — the demo
path builds from the models instead, and the two are kept separate on purpose.

The console calls three other services. Each is optional: if one is not running,
that screen says so and the rest keep working.

| Service | Port | Repository |
|---|---|---|
| Booking API | 8000 | this repository |
| Demand forecast | 8001 | [ML-Product](https://github.com/MoonSuhyeon/ML-Product) |
| Content generation | 8002 | [RAG-Marketing](https://github.com/MoonSuhyeon/RAG-Marketing) |
| Support agent | 8003 | [Agent-Customer-Support](https://github.com/MoonSuhyeon/Agent-Customer-Support) |

## Docs

| | |
|---|---|
| `tracking/taxonomy.py` | Event definitions and required properties |
| `analytics/etl/identity.py` | Anonymous → account stitching |
| `analytics/experiments/stats.py` | Power, assignment, SRM, z-test |
| `analytics/simulator.py` | Traffic with planted effects, for validation |
| `docs/erd.dbml` | Booking domain schema — 57 tables, generated from the models |
| `backend/app/models/base.py` | SQLAlchemy models, the source of the schema |
| `backend/app/seed.py` | Demo data — regions match the demand-forecasting project |
