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

A planted **+18%** effect recovered as **+18.7%** (p = 0.0016) · SRM detected at χ² = 59.60 · **72 Python tests + 38 TypeScript tests**

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
        │    property_id · region · properties                     │
        │    platform (WEB/IOS/ANDROID) · install_id? · app_ver?   │
        │    sent_at (client) + received_at (server)               │
        │                                                          │
        │  DEDUPE on event_id — redelivery is normal, not an       │
        │  exception, once a client buffers offline and retries    │
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
        │  │ web  30-min silence    │  │ install_id first, then │  │
        │  │ app  background > 30m  │  │ anonymous_id           │  │
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
| Testing | pytest — 72 tests · vitest — 38 tests (SDK · one rendered funnel thread over MSW · contract wiring) |

---

## Trade-offs

Validated against synthetic traffic with planted effects — the pipeline has to
recover what the simulator injected.

| Planted | Recovered |
|---|---|
| Treatment effect **+18%** | **+18.7%**, p = 0.0016 |
| Mobile booking-start multiplier 0.66 | Mobile 24.0% vs Desktop 35.2% |
| Assignment skewed to 55:45 | SRM detected, χ² = 59.60, p < 0.0001 |
| One app version skewed to 55:45, overall balanced | Overall SRM **passes**; the stratified check names `1.3.0` |
| Sticky-CTA effect **+18%**, delivered over real HTTP | Assignment → ingest → SRM → **+18%** recovered, SRM healthy |
| Malformed events 0.4% | 0.41% quarantined |

### A contract check that was generated and then ignored

**Buys** — the drift defence works now, which it did not before. `gen-types.mjs`
turns three services' committed schemas into TypeScript, and the README claimed that
a service changing its response shape would **break the console build**. It did not:
every console page re-declared the response shape inline, so the generated types
were imported by nothing.

The proof was accidental. Renaming `SegmentRow.region` to `key` in ML-Product left
the build green and the page about to render `undefined`. Pointing the pages at the
generated types surfaced **six** errors at once, and two were latent crashes rather
than cosmetic drift: `violations` is optional in the contract but was read as
required (`.length` on undefined), and `decision` is an open map that the page
treated as a fixed shape.

**Costs** — a generated type is only as good as the schema behind it.
`/support/sessions/{id}` used to return an untyped `dict`, which left exactly one
response hand-written on the console side; the fix belonged in the service, and the
agent repository now returns a typed `SessionOut`. The lesson generalises: a missing
schema does not stay in the service that omitted it — it surfaces as guesswork in
every consumer.

**A type cannot protect itself.** Anyone writing an inline type again silently undoes
this, and no build breaks when they do — which is exactly how it broke the first
time. So the wiring itself is asserted in `contract-wiring.test.ts`, and that test
was verified by reverting a page and watching it fail.

### More than one segmentation axis

**Buys** — the claim *"an average hides things"* stops being about one axis. The
funnel was cut by `device_type` and nothing else, so a channel problem was visible
and a **product** problem was not: which kinds of property convert, and where the
forecast is weakest, were both invisible. Region and property type are now axes in
both the funnel and the model's error report, and the console lets a reader switch
between them instead of showing one table the pipeline chose in advance.

The forecast error turns out to spread **1.9× across regions** (WAPE 0.275 in Seoul
to 0.516 in Gyeongju) but only **1.2× across property types**. That is itself the
finding: for this model, where a property *is* matters far more than what it *is*,
and one axis alone could not have said so.

**Costs** — the axes do not share a denominator. `search_performed` carries no
property, so a product-type funnel cannot start where the device funnel starts; it
begins at `property_viewed`, and the console has to say so or the two tables will be
compared as if they were the same measurement.

**Property type is a dimension, not an event field.** It is joined from
`PROPERTY_CATALOG` rather than stamped onto each event, because it describes the
property and not the behaviour — writing it into the event stream would make every
historical record a lie the moment a property is reclassified.

### One rendered thread instead of many mocked units

**Buys** — coverage of the seams. Unit tests already cover each part; what they
cannot see is the space between them. Rendering one thread — list → region →
property → *예약하기* — through **MSW at the network boundary** found two defects
that no unit test could have:

- The assignment hook returned early on a cache hit and skipped tagging the
  tracker. From the **second** property onward the page rendered `treatment`
  while its events carried no arm at all. The screen looked correct, which is
  precisely why this class of bug survives review.
- A 404 on the property fetch escaped as an unhandled rejection. The page still
  said *"숙소를 찾을 수 없습니다"*, so it looked fine and logged an error on every
  miss.

Intercepting at the network — rather than `vi.mock`-ing the API module — is what
made this possible. Mocking the module would have hidden the very layers that
break in practice: the path, the query string, the interceptors, the parsing.

**Costs** — the mock is now a second definition of the server's behaviour, and
two definitions drift. The handlers pin that risk down by reusing the seed's
vocabulary (`ROOM_ONLY` / `BREAKFAST` / `HALF_BOARD`) and by answering 404 with a
real 404 rather than `200 + null`, so a screen cannot pass against a shape the
server would never send. `onUnhandledRequest: 'error'` closes the other half: a
request with no handler fails the test instead of passing quietly.

**One set of handlers, two consumers.** `npm test` and `npm run dev:mock` load the
same file. Two sets would drift the moment one is edited, and then the tests would
be passing against responses that no longer exist. Mocking stays **off by default**
in dev for the same reason — a mock that is always on hides a backend that is down.

### An unreachable client is not a control-group member

**Buys** — the control group stays what it claims to be. When the assignment call
fails, the page still has to render something, so it renders the control UI. What
it does *not* do is record that person as `control`. Those two look like the same
decision and are not: clients that cannot reach the endpoint are the ones on bad
networks, bad networks convert worse, and counting them as control drags the
control conversion rate down. The experiment then wins for a reason that has
nothing to do with the CTA — the bias that remote assignment removed comes back
in through the measurement instead, pointing the other way.

**Costs** — the exposure event waits for the assignment response, so it fires
later than a page-view event otherwise would, and a user who leaves within that
window is not counted at all. That undercounts exposures. It is the right side to
err on: an exposure with no arm cannot go in any denominator, so recording it
early buys a row that no analysis can use.

**Same rule at the page level.** The sticky bar is `md:hidden` and the analysis
filters to `device_type == MOBILE`, because desktop users are assigned but never
see the treatment. Leaving them in would dilute the effect toward zero with
people the change could not have reached.

### Exactly-once by making retries identical, not by retrying less

**Buys** — an event produced with no network is counted once and only once after
reconnect. The client cannot achieve that by trying to send exactly once; over a
network that is not possible, because a lost *response* is indistinguishable from
a lost *request*. So the SDK does the opposite: it assigns `event_id` **when the
event is queued**, and resends the same ID until the server acknowledges. Folding
duplicates is the server's job. Generating the ID at send time instead would make
every retry a new event and quietly inflate the funnel.

**Costs** — the server now carries dedupe state, which is memory that grows with
traffic and would need a TTL or a store behind it in production. And the client
must send more than once on purpose: on `pagehide` the queue is beaconed but
**not** cleared, because a beacon gives no response to trust. That double-send is
deliberate, and it is only safe because the server folds it.

**A dropped event is reported, not silenced.** The queue has a ceiling — storage
does — so past it the oldest events are discarded and the count is handed to a
callback. An offline buffer that silently forgets is worse than no buffer,
because the loss is invisible in exactly the sessions that mattered.

### Assignment on the server instead of in the client

**Buys** — an experiment stops being something you ship. Turning one on, off, or
changing its split is an edit to a registry, not a release. That matters because
the moment a variant is gated on an app version, the treatment group becomes
*"people who updated"*: the split is decided by adoption rate rather than by a
random draw, and SRM fires at **every** adoption level (χ² = 16,380 / 3,256 /
1,114 / 9,641 at 5 / 30 / 62 / 85% adoption). An alarm that always fires gets
ignored, and then it cannot catch the real assignment bug either. With remote
assignment the same traffic stays healthy (χ² = 0.00 / 0.00 / 0.52 / 0.35).

**Costs** — an extra network call before the first render, on the critical path.
A client that cannot reach the endpoint has no variant, so the fallback has to be
decided rather than assumed. Assignment is a deterministic hash of the unit ID, so
the answer is stable without storing state — but a cached wrong answer is now a
data problem, not just a rendering one.

**A client that is not eligible is told so.** It does not receive `control`.
Filling ineligible users into the control group reintroduces exactly the
confound the endpoint exists to remove — the control group would quietly become
"everyone who did not update".

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

### Session rules that differ by platform, on purpose

The web has no signal that a visitor left. The browser does not say so, so silence
has to stand in for departure — 30 minutes of it ends a session.

An app does say so. It reports being backgrounded, which means the boundary can be
**read rather than inferred**. That difference is not cosmetic: someone reading a
long listing with the app open sends no events for 45 minutes and has not left.
The inactivity rule splits that single visit in two; the lifecycle rule does not.

**Buys** — an answer to "is 20 minutes in the background a new session?" that lives
in one constant and one test rather than in someone's head. App visits are keyed by
`install_id`, so a relaunch that rotates the anonymous ID no longer fragments them.
**Costs** — two rules to keep straight, and an app that sends no lifecycle events at
all must fall back to inactivity. The fallback is deliberate: assuming a signal that
was never sent would collapse an entire install into one endless session.

### Two identity keys instead of one

`anonymous_id` is a cookie. An app has no cookie — it has an install ID, and the
two differ in how long they survive: relaunching an app can rotate the anonymous
ID, while the install ID lasts until the app is deleted. Resolving by the more
stable key first means app visits split across several anonymous IDs collapse
into one journey **before anyone logs in**.

**Buys** — a web session and an app session for the same person resolve to one
journey once either side logs in, and pre-login app browsing stops fragmenting.
On conflict — a shared device where the two keys point at different accounts —
the more stable key wins, which is decided in code rather than left to merge order.
**Costs** — reinstalling wipes the only link the device had, so the pre-login half
of the old install can never be recovered. That is a limit, not a bug: the report
counts reinstalls instead of quietly attributing those events to someone.

### A platform-neutral contract before there is a second platform

There is no app. Every event today comes from a browser — including the 58% that
`device_type` calls mobile. So the contract could have kept one `timestamp` and
skipped `platform` entirely, and nothing would break this week.

It was widened anyway, because **the cost of widening it later is not symmetric.**
A contract fixed after data has accumulated cannot repair the data that arrived
under the old one. `sent_at` alone cannot be split into client and server time
retroactively; a redelivered event already counted twice cannot be found again.

**Buys** — duplicate delivery at 25% leaves every funnel step unchanged, and clock
skew at 15% leaves the session count unchanged, both pinned by test. `device_type`
and `platform` stay separate axes, so "mobile converts worst" can later be split
into a web problem and an app problem rather than staying one blurred number.
**Costs** — fields that nothing populates yet, and a validation rule (`install_id`
required for app events) that no current traffic exercises. Carrying an unused
column is the price of not having to backfill one.

### Quarantine instead of dropping malformed events

**Buys** — 0.41% of events failed validation and were kept, so the schema can be
fixed and the events reprocessed. Failure rate itself becomes a collection-quality
metric.
**Costs** — an extra table and a reprocessing path to maintain.

## Run locally

```bash
pip install -r backend/requirements.txt
pytest                            # 72 tests
cd frontend && npm test           # 38 tests (SDK · funnel thread · contract wiring)
cd frontend && npm run dev:mock    # 백엔드 없이 화면만 띄운다 (MSW)
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
| `analytics/experiments/stats.py` | Power, assignment, SRM (overall and stratified), z-test |
| `analytics/experiments/registry.py` | Which experiments are live, and who is eligible |
| `frontend/src/lib/tracking/` | Client SDK — queue, offline buffer, batched upload |
| `frontend/src/lib/experiments.ts` | Asks the server which arm, and refuses to guess |
| `frontend/src/mocks/` | One set of MSW handlers, shared by tests and `dev:mock` |
| `frontend/src/types/contract-wiring.test.ts` | Guards that the generated types are actually imported |
| `analytics/simulator.py` — `PROPERTY_CATALOG` | Property attributes as a dimension, deliberately not on the event |
| `frontend/app/(booking)/booking-thread.test.tsx` | One funnel thread, rendered — checks the seams |
| `backend/app/api/v1/events.py` | Ingest endpoint — partial failure stays partial |
| `analytics/simulator.py` | Traffic with planted effects, for validation |
| `docs/erd.dbml` | Booking domain schema — 57 tables, generated from the models |
| `docs/mobile-migration.md` | What mobile breaks, and the order it was fixed in |
| `docs/readout-review.md` | Design review — where an LLM belongs in result review, and where it does not |
| `docs/external-market-report.md` | Design review — moving from first-party experiments to third-party observation |
| `backend/app/models/base.py` | SQLAlchemy models, the source of the schema |
| `backend/app/seed.py` | Demo data — regions match the demand-forecasting project |
