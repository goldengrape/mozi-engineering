---
type: cases
title: 察物第 2–5 章互动案例
description: 衡算、定准、传准、参验四章的来源边界、互动机制和验证证据。
source_ids:
  - RMD-TASK-007
  - TDD2-TEST-010
  - TDD2-TEST-011
  - TDD2-TEST-012
  - TDD2-TEST-013
  - TDD2-TEST-014
  - TDD2-TEST-015
status: checkpoint_ready
---

# Cases

## 衡算 — hengsuan-balance-001

Source facts: 100 in, 72 product out, 8 tail-gas out, +15 inventory; 5 kg/h remains unexplained.

Interaction:

`number → hold/name choice → multi investigation → false-closure judgment`

Training target: keep the residual separate from its cause and preserve exchange / internal-process / measurement-record evidence paths.

## 定准 — dingzhun-torque-001

Source facts: 50 N·m tool; June 1 passed; August 20 dropped; September 1 produces about 52 N·m at a 50 N·m setting.

Interaction:

`state → last-trusted-time trace → recalibrate/verify → debrief`

Training target: a reference is a stateful object; adjusting the current value does not erase historical impact.

## 传准 — chuanzhun-benchmark-001

Source graph:

`A→B, B→C, B→D, C→E`

B later shifts +3 mm.

Interaction:

`multi minimum-impact set → retry → provenance-record judgment`

Expected minimum affected set: C, D, E. A is upstream and is not derived from B.

## 参验 — canyan-model-001

Source facts: A=88%, B=93%; sample-level splitting leaks records from the same user across train/test; redesigned evaluation yields A=87.5%, B=88.1%.

Interaction:

`initial result judgment → leakage reveal → multi redesign → new result → independence judgment`

Training target: additional repetitions do not become independent evidence if they retain the same bias source.

# Verification

Actions run `35951410738`:

- 36 tests passed, 0 failed;
- all four new stories compile;
- tested correction paths complete;
- static build generates five cases;
- existing Chapter 1 browser smoke remains green.

# Current gate

PR #11 is unmerged. RMD-TASK-008 is blocked until RMD-GIT-007 merge approval.
