# Mobile Migration Plan

Status: **Phases 0–5 done on mobile web; the native app (4b) is deferred.**
The contract is platform-neutral, assignment no longer travels inside a release,
the tracking SDK delivers events exactly once across offline gaps, and the
sticky-CTA experiment is wired end to end — assignment → variant on events →
ingest → SRM → conclusion, verified through the real HTTP surfaces.

The SDK ships on the **web** client today. Writing it against a `QueueStorage`
interface rather than `localStorage` is what lets the same code run in React
Native later. The app itself is still deferred — see *Why the app is deferred*.

## Why mobile

This is not a platform expansion. It is the intervention this repository's own
measurement pointed at.

| Device | Share of traffic | booking_started rate | Final CVR |
|---|---|---|---|
| Desktop | 33% | 32.9% | 9.91% |
| Tablet | 9% | 28.7% | 7.82% |
| **Mobile** | **58%** | **24.3%** | **6.60%** |

Mobile carries most of the traffic and converts worst, and the gap opens at
`booking_started` — the step where the funnel already loses the most people
(27.6% pass rate, 5,305 users). The hypothesis has been written down since the
funnel analysis; it has never been tested in the environment it is about.

Building the app is how that hypothesis gets tested.

---

## What mobile breaks

The current pipeline assumes a browser. Five assumptions fail, and each one
corrupts a number rather than throwing an error — which is why they have to be
fixed before the app exists, not after.

| # | Current behaviour | Why it breaks on mobile |
|---|---|---|
| 1 | `anonymous_id` is a single opaque string | Web uses a cookie, the app uses an install ID. **Reinstalling makes a returning user look new.** The same person on web and app cannot be joined. |
| 2 | `sessionize(gap_minutes=30)` | The app is backgrounded, not closed. Is 20 minutes in the background a session end or not? The web rule silently mislabels app sessions. |
| 3 | Collector has **no deduplication** | Offline buffering plus retry makes duplicate delivery normal, not exceptional. Today a redelivered event is counted twice and inflates the funnel. |
| 4 | One `timestamp` field | Device clocks are wrong. Without separating when the client sent an event from when the server received it, ordering and session boundaries drift. |
| 5 | An experiment ships by deploying code | Store review takes days and **users do not update**. If variants are tied to app versions, assignment is confounded by version and SRM stops meaning anything. |

Number 5 is the important one. This repository's argument is that an experiment
result is only trustworthy if the design was fixed in advance. On mobile the
delivery mechanism itself becomes part of that design.

---

## Phases

Phases 0–3 need no app. They make the pipeline able to receive mobile traffic,
and they are verified with simulated mobile traffic before a single screen
exists.

| Phase | Work | How it is verified |
|---|---|---|
| **0** ✅ | Extend the event contract — `platform` (WEB/IOS/ANDROID) · `install_id` · `app_version` · `sent_at` / `received_at` · dedupe on `event_id` | **Done.** 25% duplicate delivery leaves every funnel step unchanged; 15% clock skew leaves session count unchanged; app events without `install_id` are quarantined. 11 tests |
| **1** ✅ | Cross-platform identity — join `install_id ↔ user_id ↔ anonymous_id`, handle reinstall | **Done.** A web session and an app session for the same person resolve to one journey; `install_id` joins app visits that `anonymous_id` alone would split; reinstall is counted, and the pre-login half of a wiped install is left unrecovered on purpose. 9 tests |
| **2** ✅ | Redefine sessions — app lifecycle (foreground/background) instead of page inactivity; keep web and app rules separate | **Done.** Backgrounded 20 min then returning is **one** session; beyond the threshold it is **two**; an app left in the *foreground* without events stays **one** where the inactivity rule would have split it. 9 tests |
| **3** ✅ | **Experiment delivery** — `GET /experiments/assignments` for remote assignment; `app_version` added as an SRM dimension | **Done.** A version-gated variant fires SRM at **every** adoption level (χ²=16,380 / 3,256 / 1,114 / 9,641 at 5/30/62/85% adoption) while remote assignment stays healthy at the same levels (χ²=0.00 / 0.00 / 0.52 / 0.35); an ineligible client gets `not_eligible`, never a silent `control`; an experiment is switched off without a release. 13 tests |
| **4a** ✅ | **Tracking SDK** — event queue, durable offline buffer, batched upload, backoff; `POST /api/v1/events` to receive it | **Done.** A booking started offline is counted **exactly once** after reconnect; a redelivered batch does not double-count; a 500 does not empty the queue; `sent_at` survives a two-day buffer as the *occurrence* time. 16 TS tests + 8 endpoint tests |
| **4b** | The app itself — booking funnel screens in React Native | The SDK runs unchanged behind an `AsyncStorage` adapter |
| **5** ✅ | Run the sticky-CTA experiment | **Wired.** A mobile-only sticky CTA renders for `treatment` only; exposure is logged **after** assignment resolves, so no exposure lands without an arm; a client that cannot reach the endpoint renders the control UI but is **not counted as control**. End to end over real HTTP: 4,000 units assigned → events ingested → SRM passes → a planted +18% lift is recovered. 3 tests + 5 TS tests. Real users are what is missing, not mechanism |
| **6** | Add `platform` to the dashboard | Web and app funnels compared side by side |

**Mobile web was already mobile-first.** The funnel pages use `flex-wrap`, an
`overflow-x-auto` date strip and `md:` breakpoints throughout; there were no
fixed pixel widths to unpick. Two real defects turned up instead, and both were
of the kind that a breakpoint audit would have missed:

- **13 console tables had no horizontal scroll container.** Six sat inside
  `rounded-xl overflow-hidden`, which *clips* the overflowing columns rather
  than scrolling them — the data is not merely awkward to reach, it is
  unreachable, with nothing on screen saying so. The other seven had no wrapper
  at all, so the **page** scrolled sideways instead of the table.
- **The property-detail skeleton was wider than the content it stood in for**
  (`w-56` against `w-40 md:w-56`), so on mobile the layout jumped the moment
  loading finished — directly above the CTA this experiment is about.

**Minimum completion line is Phase 5.** The app existing is not the goal; the
hypothesis being answered is.

---

## Technology

**React Native with Expo.**

| Option | Assessment |
|---|---|
| **React Native + Expo** | Continues the existing React/TypeScript frontend. The deciding factor is **EAS Update** — the JavaScript bundle can be replaced without store review, which directly relieves problem #5 above. |
| Flutter | Requires learning Dart and shares nothing with the existing frontend. |
| Two native apps | Twice the work for a single-person project, with no benefit here. |

Expo does not remove the constraint entirely — native changes still require a
release — but it moves experiment iteration off the store review path, which is
what the experiment design depends on.

---

## Definition of done

- [ ] App events join the **same funnel** as web events, not a parallel one
- [x] An event produced offline is counted **exactly once** after reconnection
- [ ] Web and app journeys for the same person resolve to one identity, including
      after a reinstall
- [x] SRM behaves correctly while multiple app versions are live
- [x] The sticky-CTA experiment reaches its planned sample before a result is read
      *(demonstrated on generated traffic; real users are still absent)*

---

## Prerequisites and open questions

~~**The service domain is unresolved.**~~ **Resolved** — the service was migrated
to lodging, so a client would now be built against a coherent domain.

---

## Why the app is deferred

The hypothesis does not need one.

**That 58% mobile traffic is already mobile *web*.** There is no app — the taxonomy
carries `device_type`, which is a *device*, not a *platform*. So the users dropping
at `booking_started` are in a mobile browser, and building an app fixes a different
place than the one that is broken.

The planned intervention makes this obvious: a **sticky CTA** is a web UI change.
It can be run today, on the responsive web, through the pipeline that already exists.

| | Tests the hypothesis | Cost |
|---|---|---|
| Build the app | Indirectly — traffic has to move there first | Expo, ~8 screens, USD 99/year |
| **Fix the mobile web** | **Directly — that is where the drop-off is** | Breakpoints, sticky CTA |

Phases 0–3 are still worth doing, and 0 is done: they are what makes the pipeline
able to *receive* app traffic, and every hard problem in this document lives there
rather than in the client. When an app is added it drops onto a contract that
already expects it.

**Distribution cost.** Store distribution needs an Apple developer account
(USD 99/year) and a Google Play account (USD 25 once). Without them the app can
only be shared through TestFlight or a sideloaded APK, which real users will not
install.

**Traffic.** The funnel numbers in this repository come from a simulator with
planted effects. A published app does not automatically produce real traffic, so
Phase 5 will most likely be validated the same way — against known ground truth
rather than real users. That is a limitation to state plainly rather than hide.
