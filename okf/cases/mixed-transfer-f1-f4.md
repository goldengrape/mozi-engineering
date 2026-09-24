---
type: cases
title: 跨章混合检索与迁移练习
description: 基于附录 F1–F4 的四个无方法标签案例，用于训练从症状检索下一动作，而不是按章节名答题。
source_ids:
  - RMD-TASK-011
  - TDD2-TEST-031
  - TDD2-TEST-032
  - TDD2-TEST-033
  - TDD2-TEST-034
  - TDD2-TEST-035
  - TDD2-TEST-036
  - TDD2-TEST-037
  - TDD2-TEST-038
status: checkpoint_ready
---

# Design rule

Mixed cases do not publish a method answer before the debrief.

The learner sees:

`symptom / context → action choice → new evidence → method switch or correction → debrief mapping`

`content/practice_registry.json` stores Appendix-F source identity and interaction mechanism, but deliberately does not contain a public `target_methods` answer list.

# Cases

## F1 — mixed-clinical-safety-001

Source context: a medical institution has a batch of test results that may be affected by calibration problems while also trying to reduce IV medication errors.

Transfer sequence:

- separate laboratory trust, clinician decision and medication execution boundaries;
- trace an abnormal calibration batch to affected results/time range;
- distinguish patient-ID/keying/permission/scanning controls from calibration-result tracing;
- after an adverse event, control continued harm/propagation before complete root-cause certainty.

Debrief mapping: 界体 → 定准/传准 → 防误 → 限败.

Professional stop boundary is retained: this is not a clinical guideline or patient-specific decision aid.

## F2 — mixed-bio-repro-001

Source context: a treatment/phenotype study spans culture batches, reagent lots and instrument platforms.

Transfer sequence:

- define whether the object is intracellular mechanism, culture system or the whole experiment workflow;
- correct treatment/batch confounding and distinguish biological/technical repeats;
- move from same-device repetition to an independent platform / measurement principle / relation;
- externalize cell-line, passage, reagent, culture, software and analysis-script information for reproduction.

Debrief mapping: 界体 → 参验 → 相衡 → 示制.

Professional stop boundary is retained: biological variation is not automatically “error”.

## F3 — mixed-agri-transfer-001

Source context: compare two water/fertilizer strategies and then enter harvest/storage operations.

Transfer sequence:

- allow the analysis boundary to change with groundwater, runoff and root range;
- correct high-fertility plot / treatment confounding;
- separate state/time-window constraints from harvest/transport/drying/storage capacity constraints;
- after irrigation failure, contamination or disease, partition and limit spread under professional recovery criteria.

Debrief mapping: 界体 → 参验 → 序作/通滞 → 限败.

Professional stop boundary is retained: weather and biological/environmental variability are not mechanical tolerances.

## F4 — mixed-payment-ops-001

Source context: a payment/transaction operations system uses multiple data sources, risk models, account permissions and clearing stages.

Transfer sequence:

- use reconciliation residuals as clues without equating closure/non-closure with model validity;
- trace data/version lineage and separately inspect why changes propagate across business/risk modules;
- distinguish reconciliation from limits/minimum privilege/dual review/unreachable-state controls;
- after an incident, stop new exposure, isolate, limit spread, degrade if necessary, and verify recovery.

Debrief mapping: 衡算 → 定准/传准 → 制耦 → 防误 → 限败.

Professional stop boundary is retained: this does not explain market prices and is not an investment decision method.

# Registry / build

- chapter cases remain in `content/curriculum.json`;
- mixed practices live in `content/practice_registry.json`;
- the builder accepts either identity source, rejects cross-registry case-ID collisions, and preflights published packages before rewriting output;
- the public `cases/index.json` marks mixed entries as `kind: "mixed"` and omits a `method` field;
- the home page presents separate “逐章练习” and “混合迁移练习” sections.

# Verification

Actions run `35965518132`:

- 59 tests passed, 0 failed;
- TDD2-TEST-031..038 passed;
- all 16 chapter cases remain green;
- static build generates 20 routes = 16 chapter + 4 mixed;
- primary case validation and headless Chrome smoke passed.

# Current gate

RMD-GIT-011 is unmerged. RMD-TASK-012 remains blocked until explicit merge approval.
