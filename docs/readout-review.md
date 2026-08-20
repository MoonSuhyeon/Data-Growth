# Readout Review — Where an LLM Belongs, and Where It Does Not

> Status: **C1–C2 built; C3 onward still design.** The pre-registration file and
> the deterministic rule checker exist and gate the pipeline — see
> `preregistrations/` and `analytics/preregistration.py`. Nothing here involves a
> model yet, which is the point: the rule-shaped checks were built first so the
> model's job is visibly the remainder.
>
> A proposal came up to have an LLM interpret analysis output and evaluate
> significance and validity. This document works out which half of that is a good
> idea and which half would invalidate the argument this repository is built on.
>
> Companion: `bank-transfer-demo/docs/multi-agent-orchestration.md`. That document
> ends at *"can we say whether the agent's action worked?"* — this one is about who
> gets to answer.

---

## The claim this repository makes

> **An experiment result is only trustworthy if the design was fixed in advance.**

Everything here follows from that. Sample size is computed before the test runs.
SRM is checked *before* conversion is read. α and MDE are pinned. The end-to-end
test asserts the order, not just the numbers:

```python
# tests/test_experiment_end_to_end.py
srm = check_srm(exposed)
assert srm.healthy, f"배정이 틀어졌다 — 전환율을 읽으면 안 된다 ({srm})"
```

**Any addition that makes the verdict negotiable removes the claim.** That is the
lens for the proposal.

---

## The literal proposal breaks it

### Everything about significance is already deterministic

| Function | Answers |
|---|---|
| `required_sample_size()` | How many per arm, before the test |
| `check_srm()` | χ², p, healthy |
| `check_srm_by()` | Per-stratum χ², which strata are bad |
| `two_proportion_test()` | p, CI, relative lift, significant |

An LLM has nothing to add here. A p-value is a computation with one answer, not an
opinion, and every one of these is already pinned by tests.

### And a language model asked "is this significant?" will always find something to say

Show it p = 0.06 and it writes *"a trend is visible but the sample should be
extended."* Show it p = 0.04 and it writes *"the effect is significant."* Show it
the same p twice with different framing and it may not agree with itself.

That is not a bug to prompt around. **It is what a text model does**, and it makes
the model a judge that can be argued with. Putting a persuadable judge in the
verdict path is precisely the failure this repository exists to argue against.

**Verdict: an LLM must never decide significance or validity.**

---

## The real test of the idea

> **What validity threat can an LLM catch that a rule cannot?**

If there is no answer, the proposal is decoration. And for most threats, the rule
wins outright:

| Threat | Caught by |
|---|---|
| Sample below plan | Arithmetic |
| Assignment skew | χ² |
| Conversion read before SRM | Code path assertion |
| Multiple metrics, no correction | Counting the metrics |
| One version's split broken | `check_srm_by()` |

None of these need a language model, and using one would make them slower, less
reliable and unauditable.

---

## But there is an answer: prose against numbers

What a rule cannot read is **the sentence a human wrote about the result.** An LLM
is not good at judging the number; it is good at noticing that the sentence claims
more than the number supports.

| Threat | Why it is LLM-shaped | Example |
|---|---|---|
| **Hypothesis / metric mismatch** | Compares a prose hypothesis against the metric actually tested | Hypothesis says *booking-start rate*; the conclusion says *revenue went up* |
| **HARKing** | Compares narrative claims against what was pre-registered | *"The effect was especially strong on mobile"* — that segment was never pre-registered |
| **Causal overreach** | Measures the strength of a claim against what the design supports | *"The discount raised occupancy"* when the data supports *"the treated group was higher than the holdout"* |
| **External confounds** | Reads unstructured context — deploy logs, calendars, campaign schedules | A release shipped mid-experiment; a holiday fell inside the window |

All four are the same shape: **the written claim is stronger than the computation
behind it.** That is an audit, not a verdict.

> **The computation rules. The model audits the sentence.**

---

## Design: a one-way gate

This is the condition that makes the idea safe rather than corrosive.

> **The model may raise doubt. It may never resolve it.**

| Model output | Effect |
|---|---|
| *"This readout is not trustworthy because…"* | **Blocks.** A human must respond |
| *"This readout looks fine"* | **No effect at all.** Nothing is unblocked |

The asymmetry is the point. A false flag costs one human review. A false clearance
costs a wrong business decision made with false confidence. **Hallucination is only
allowed to cost the cheap one.**

This is not a new philosophy for these repositories — it is the existing one applied
to measurement:

- `bank-transfer-demo/app/agent/policy_rag.py` — retrieval abstains rather than
  guessing when the evidence is weak
- `interrupt_before=["execute"]` — nothing changes state without a human
- `experiments/registry.py` — an ineligible client gets `not_eligible`, never a
  silent `control`

Each one refuses to manufacture a confident answer it does not have. A readout
auditor that could clear a result would be the first to break that pattern.

---

## The auditor must itself be measured

*"So an AI evaluates the AI?"* is the first question this will get. It needs an
answer that is structural, not rhetorical.

1. **It never touches the verdict** (above). Statistics decide; the model reviews
   the write-up. The loop is not closed on itself.
2. **Every flag is counted, along with whether a human accepted it.** That is the
   same adoption-rate instrument already built for AI recommendations in the banking
   project — recommendation versus what the human actually decided.
3. **A flag class with a low acceptance rate gets turned off.** An alarm that always
   fires is ignored, and an ignored alarm cannot catch the real thing either. That
   lesson is already written into this repository's SRM design; it applies to the
   auditor with no modification.

**The auditor becoming a measured subject is the most defensible part of this idea.**
It is the difference between adding AI and being able to say whether the AI helped.

---

## Phases

| | Work | How it is verified |
|---|---|---|
| **C1** ✅ | **Pre-registration file** — hypothesis, metric, MDE, α, segments, fixed *before* the run | Without this there is nothing to audit against. It comes before the model, not after |
| **C2** ✅ | **Rule checker** — sample vs plan, SRM, ordering, multiple comparisons. Deterministic, no model | Keeps the rule-shaped checks visibly out of the model's reach |
| **C3** | **Readout generator** — turns computed verdicts into prose. Changes no verdict | A test fails if any verdict value differs from `stats.py` output |
| **C4** | **LLM auditor** — pre-registration vs readout, the four threat classes above | Planted violations (swapped hypothesis, post-hoc segment) are caught |
| **C5** | **One-way gate** — flags block; "looks fine" grants nothing | A test asserts the gate stays shut when the model approves |
| **C6** | **Flag acceptance rate**, by flag class | Gives a basis for switching a noisy class off |

**Minimum completion line is C4.** Starting at C4 without C1–C2 produces *"the LLM
writes our report,"* which is common and proves nothing. **Pre-registration is what
makes an audit possible at all** — without a fixed prior claim, there is no such
thing as a claim that drifted.

---

## Traps worth writing down first

### The auditor becomes a rubber stamp

If reviewers learn that flags are usually noise, they will click through them. C6
exists to detect this, but the deeper defence is keeping the flag classes few and
each one narrow enough to be checkable by hand.

### Pre-registration becomes a formality

A pre-registration file written five minutes before the analysis, by the same person,
with the metric already known, audits nothing. The only real defence is timestamping
it into version control **before** the run — which is why C1 is a committed file and
not a database row.

### The model reads the numbers and starts judging them anyway

Give a model both the pre-registration and the p-value and it will volunteer an
opinion on the p-value. Its output must be **structurally constrained** — a fixed set
of flag classes with a span of text each — rather than free prose that happens to
avoid the verdict. If it can only emit `{flag_class, quoted_span, why}`, it cannot
emit a significance judgment even when it wants to.

### "We evaluate with an LLM" reads as fashion

The defence is the one-way gate and the acceptance rate. If neither is present, this
should not be built; a rule checker and a template would be more honest and would do
most of the work.

---

## Summary

| | |
|---|---|
| **Rejected** | An LLM that evaluates significance or validity. Significance is a computation, and a persuadable judge voids this repository's claim |
| **Accepted** | An LLM that audits the readout — mismatches between prose and numbers are exactly what rules cannot see |
| **Condition** | One-way gate. Doubt may be raised, never resolved |
| **Biggest win** | The auditor is itself measured by acceptance rate |
| **Prerequisite** | The pre-registration file (C1). Without a prior claim there is nothing to audit |

Done well this is the strongest of the three proposals on the table. Done badly it is
the most damaging. The fork is a single decision: **whether the model gets a vote on
the verdict, or only on the sentence.**
