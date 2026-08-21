# External Market Report — What Has to Change, and What Must Not

> Status: **D1–D3 built.** `analytics/external/` carries fetch windows and scales,
> `analytics/causal/` gates the estimate on parallel trends, and
> `preregistrations/obs_lodging_campaign.toml` fixes the control group before the
> outcomes are read. Run `python scripts/run_external_demo.py` — the same +10 is
> estimated in one scenario and refused in the other.
> A social/market analysis report has been proposed: DART filings and financial
> statements, verification that a marketing strategy was actually executed, search
> volume trends for a target segment, review text analysis, and a strategy
> recommendation. This document works out what that demands of this repository and
> of the agent repository — and pushes back on part of the assumed split.
>
> Companions: `docs/readout-review.md` (who may judge a result),
> `bank-transfer-demo/docs/multi-agent-orchestration.md` (who may act on one).

---

## 1. The regime change is the whole problem

Everything in this repository is **first-party and experimental**. The report asks
for something **third-party and observational**. These are not the same job with a
different data source; the difference decides which conclusions are even available.

| | This repository today | What the report needs |
|---|---|---|
| Source | Events I defined (`tracking/taxonomy.py`) | Public disclosures someone else defined |
| Schema control | Mine. Violations are quarantined | Theirs. Changes without notice |
| Intervention | I can assign a variant | **None. Observation only** |
| Counterfactual | A holdout I withheld on purpose | A comparison I have to argue for |
| Identity | `anonymous_id` → `user_id` stitching | No identity. Aggregates only |
| Granularity | Per event, per second | Per quarter (DART), per week (trends) |
| Strongest claim | *"The treatment caused +18%"* | *"This is consistent with, and I cannot rule out…"* |

**The asset that transfers is not the code. It is the refusal to overclaim.** And
that refusal has to be rebuilt with different tools, because the tool this
repository relies on — randomization — is unavailable.

---

## 2. One sentence in the brief hides two different questions

> *"최근 제품 마케팅 전략 및 수립이 이행되었는지 데이터 기반 검증"*

That contains two questions with completely different difficulty:

| | Question | Answerable? |
|---|---|---|
| **(a)** Was the strategy **executed**? | Did spend rise, did campaigns ship, did messaging change? | **Yes.** This is observation, and public data supports it |
| **(b)** Did it **work**? | Did the execution cause the outcome? | **Only weakly.** No randomization is possible |

**Most reports of this kind answer (a) and present it as (b).** Advertising spend
went up, search volume went up, therefore the campaign worked — with no account of
seasonality, of competitors moving at the same time, or of the trend that was
already rising before the campaign began.

Separating (a) from (b) explicitly, and stating what design strength each answer
has, is the single thing that would make this report better than the genre. It is
the same discipline as reading SRM before conversion: **establish what you are
allowed to say before you say it.**

---

## 3. Data sources and the traps in each

These are not incidental. Each one silently corrupts a number rather than throwing
an error — the same failure mode this repository already catalogues for mobile.

### DART / financial statements

Advertising spend (`광고선전비`) is the closest thing to direct evidence that a
marketing strategy was executed. Two constraints:

- **It is a line inside SG&A, not a headline account.** Depending on the filing it
  may appear in the statements, only in the notes, or not be broken out at all.
  The extractor has to handle absence as a normal case, not an error.
- **Cadence is quarterly or annual.** That is **4 to 12 observations for a multi-year
  window.** A monthly event study on this series is not underpowered — it is
  impossible. Any method chosen must survive single-digit sample sizes, and saying
  so up front is more honest than producing a confident-looking chart.

### Search volume (Naver DataLab / Google Trends)

- **The values are a relative index, rescaled to the maximum inside the requested
  period** — not absolute volume. Two pulls with different date ranges are on
  **different scales**. Concatenating them, or comparing across keyword groups,
  produces a chart that looks fine and means nothing.
- The fix is to fetch every series in **one request over one window**, and to record
  the window with the data so a later reader cannot re-slice it by accident.

### Review text

- **Selection bias is extreme.** People who write reviews are disproportionately
  delighted or furious. The distribution is not the customer base.
- **Composition shift is worse than volume shift.** If a campaign brings in new
  customers, average rating can fall while nothing about the product got worse —
  the mix of who is reviewing changed. Reporting a rating drop as a quality drop
  would be the same error as reading an aggregate funnel without segmenting by
  device, which this repository already argues against.
- Therefore review analysis must report **by cohort of first contact**, not only in
  aggregate.

---

## 4. Method: the check that has to come first

Without randomization, a causal claim rests on a comparison someone chose. The order
matters as much as it does for SRM.

1. **Pick a control** — a competitor or a comparable product that did *not* run the
   campaign.
2. **Test the pre-trend.** Were the two series moving in parallel *before* the
   intervention? **If they were not, difference-in-differences says nothing**, and no
   amount of post-period difference rescues it.
3. **Only then** estimate the difference, as an event study around the campaign date
   or a DiD across the window.
4. **State the residual threats by name** — the competitor may have run their own
   campaign, a seasonal peak may sit inside the window, a platform algorithm may have
   changed.

Step 2 is the analogue of `check_srm()`: a gate that runs *before* the number of
interest is read, and that can veto reading it at all. Skipping it is the
observational equivalent of reading conversion through a broken assignment.

**A pre-trend that fails is a finding, not a failure.** The correct output is *"this
design cannot separate the campaign from the trend"* — which is exactly the sentence
that the readout auditor in `readout-review.md` exists to enforce.

---

## 5. Where each change belongs

The proposal assumed Data-Growth and Agent-Customer-Support. One of those is right;
the other is not the best fit.

| Piece | Home | Why |
|---|---|---|
| External ingestion (DART, trends, reviews) | **Data-Growth**, new `analytics/external/` | Aggregation lives here. But strictly separate from the event pipeline — see §6 |
| Observational inference (pre-trend, DiD, event study) | **Data-Growth**, new `analytics/causal/` | Sits beside `experiments/`, and the contrast between the two directories *is* the argument |
| Review text analysis, claim grounding, report prose | **RAG-Marketing** | It is already *"Hybrid RAG with **Fact Validation**"* with `/index`, `/search`, `/generate` and grounding. This is the machinery, already built |
| Approval gate, trace, abstain-on-weak-evidence | **Agent-CS — as a pattern, not as code** | See below |
| Pre-registration, one-way audit gate, flag adoption rate | `docs/readout-review.md` C1–C6 | This report is that document's first real subject |

### Why Agent-CS should barely change

Agent-Customer-Support is a **booking support** agent. Its single write tool is
`cancel_and_refund`; its retrieval is over cancellation policy. Bolting a market
research agent onto it would repeat the mistake already rejected in
`multi-agent-orchestration.md` — **adding agents instead of adding a reason for them
to exist.**

What that repository actually contributes here is three patterns worth copying:

- `interrupt_before=["execute"]` → the report is not published until flagged claims
  are answered
- the read/write tool split → gathering evidence is automatic; asserting a
  conclusion is not
- `policy_rag.py`'s abstain path → **if the evidence is weak, write no sentence**,
  rather than a hedged one

Copying three patterns is cheap. Moving a support agent into market research is not,
and it would damage a repository whose current story is clean.

---

## 6. What must not happen: external data inside the event contract

`tracking/taxonomy.py` defines `Event` — a first-party behavioural contract with
required properties, quarantine on violation, identity fields and clock-skew
handling. A DART line item is not an event. A search index is not an event.

Forcing them in breaks two things at once:

1. **Validation becomes meaningless.** `missing_required()` and the quarantine path
   are built around behaviour with a known schema. External records would have to be
   waved through, and once anything is waved through the failure rate stops being a
   quality signal.
2. **The analytics silently misapply.** `sessionize()`, `build_identity_map()` and
   the funnel all assume a person doing things in order. Run them over quarterly
   financials and they will return numbers — wrong ones, with no error.

**`analytics/external/` must be a sibling of the event pipeline, never a producer
into it.** The only place they legitimately meet is a report that shows both and is
explicit about which claims come from which regime.

---

## 7. Choosing the subject company

A recommendation, not a requirement: **pick a lodging company** (Yanolja, Yeogi
Eottae, or a hotel group).

- The whole portfolio stays in one domain. Region vocabulary, seasonality intuition
  and the booking funnel all carry over instead of being re-explained.
- It creates the contrast that makes this report worth reading:

  > *In the first-party stack I could withhold a holdout and claim causation. Looking
  > at this company from outside, I cannot. Here is precisely how much weaker the
  > conclusion has to be, and why.*

Almost nobody writes that paragraph. It demonstrates understanding of study design
rather than tool usage, and it turns two unrelated projects into one argument.

---

## 8. Phases

| | Work | How it is verified |
|---|---|---|
| **D1** ✅ | `analytics/external/` — each series records its **fetch window and scale** with the data | Two pulls of a relative index raise on `concat()` and on `align()`; missing is `None`, never `0` |
| **D2** ✅ | **Pre-registration** — what is tested, against which control, over which window | `[control]` names the comparator, its reason, **and the rejected candidates**. No MDE is promised where the sample cannot grow |
| **D3** ✅ | `analytics/causal/` — pre-trend test first, then DiD | A failing pre-trend returns `effect = None`. `estimate()` takes the pre-trend as a **required argument** — no default, so it cannot be skipped |
| **D4** | Execution evidence (question **a**) — spend, campaign traces, messaging change | Reported separately from effect, never merged into one claim |
| **D5** | Review analysis **by first-contact cohort** | Composition shift is separable from quality change |
| **D6** | Claim ledger + audit — every sentence links to evidence; the auditor flags claims stronger than their support | Planted overreach (*"the campaign raised sales"* from a correlational design) is caught |

**Minimum completion line is D3.** A report with pre-registration and an honest
pre-trend check beats a longer report with more charts and no design. D4–D6 make it
publishable; D1–D3 make it true.

---

## 9. Traps worth writing down first

### The report becomes a chart gallery

Five data sources produce a lot of plots, and plots feel like progress. The
deliverable is a **claim with a stated strength**, and every chart that does not
support a specific claim should be cut.

### Advertising spend gets read as strategy

Spend rising means money moved, not that a strategy existed or was coherent. The
gap between *"they spent more"* and *"they executed the strategy they announced"* has
to be crossed with evidence about **what** changed, not only **how much**.

### The recommendation is unfalsifiable

*"Strengthen the social channel and target the 20s segment"* cannot be wrong, and
therefore says nothing. A recommendation should name the metric it would move, the
size of the move that would count, and **what result would prove it wrong** — the
same discipline as fixing MDE before an experiment.

### Public data is treated as ground truth

Disclosures are prepared by the company, for a purpose. Review platforms filter and
rank. Search indices are modelled, not counted. Every source has an interest and a
method, and naming those is part of the analysis rather than a caveat at the end.

---

## 10. Summary

| | |
|---|---|
| Regime | First-party experimental → **third-party observational**. Randomization is gone; the discipline must survive without it |
| Central move | Split *"was it executed"* from *"did it work"*, and state the design strength of each |
| Gate | **Pre-trend before effect** — the observational counterpart of SRM before conversion |
| Changes here | `analytics/external/` (isolated from the event contract) and `analytics/causal/` |
| Changes in Agent-CS | **Minimal — three patterns copied, no new agent.** Report prose and grounding belong in RAG-Marketing, which already does fact validation |
| Prerequisite | `readout-review.md` C1. Without a pre-registered claim there is nothing to audit |
