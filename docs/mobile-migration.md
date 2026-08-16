# Mobile Migration Plan

Status: **Phase 0 done** · the contract is platform-neutral and verified with
simulated app conditions. The app itself is deferred — see *Why the app is deferred*.

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
| **1** | Cross-platform identity — join `install_id ↔ user_id ↔ anonymous_id`, handle reinstall | A user's web session and app session resolve to one journey |
| **2** | Redefine sessions — app lifecycle (foreground/background) instead of page inactivity; keep web and app rules separate | Background-then-return is pinned by test as one session or two, explicitly |
| **3** | **Experiment delivery** — `GET /experiments/assignments` for remote assignment; add `app_version` as an SRM dimension | An experiment can be switched on and off without a release; mixed-version traffic is detected |
| **4** | The app — booking funnel screens plus a tracking SDK with an event queue, offline buffer and batched upload | Start a booking in airplane mode, reconnect, and it is counted **once** |
| **5** | Run the sticky-CTA experiment | Reaches its planned sample, passes SRM, then a conclusion is drawn |
| **6** | Add `platform` to the dashboard | Web and app funnels compared side by side |

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
- [ ] An event produced offline is counted **exactly once** after reconnection
- [ ] Web and app journeys for the same person resolve to one identity, including
      after a reinstall
- [ ] SRM behaves correctly while multiple app versions are live
- [ ] The sticky-CTA experiment reaches its planned sample before a result is read

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
