---
type: cases
title: 制物第 9–12 章互动案例
description: 定动、容度、相衡、示制四章的来源边界、互动动作与验证证据。
source_ids:
  - RMD-TASK-009
  - TDD2-TEST-021
  - TDD2-TEST-022
  - TDD2-TEST-023
  - TDD2-TEST-024
  - TDD2-TEST-025
status: checkpoint_ready
---

# Cases

## 定动 — dingdong-guide-001

Source facts:

- slider should retain Tx only;
- Ty/Tz/Rx/Ry/Rz must be constrained;
- two parallel guides acting as complete positioning bases duplicate constraints;
- slight non-parallelism, thermal expansion or installation error can create internal force and binding;
- one side may take primary positioning while the other supports and allows a small compensation freedom;
- verify through full travel, normal load and temperature rise.

Interaction:

`multi DOF selection → overconstraint correction → verification-condition judgment → debrief`

## 容度 — rongdu-stack-001

Source facts:

- A=20±0.1 mm, B=30±0.2 mm, C=50±0.1 mm;
- nominal total = 100 mm;
- worst-case deviation = ±0.4 mm, total range 99.6–100.4 mm;
- functional window = 99.7–100.3 mm;
- alternative local allocation ±0.05/±0.10/±0.05 mm gives ±0.20 mm worst-case total;
- structural alternative: adjustable shim;
- selection depends on manufacturing capability, cost and failure consequence.

Interaction:

`number worst-case prediction → single-part/system distinction → redesign tradeoff → debrief`

## 相衡 — xiangheng-reversal-001

Source facts:

- r₁=18 μm;
- after reversal r₂=6 μm;
- r₁=s+b, r₂=−s+b;
- therefore s=6 μm and b=12 μm;
- common temperature-model bias is not removed merely by reversal.

Interaction:

`same-relation temptation → explicit reversal correction → number s → number b → common-bias boundary → debrief`

## 示制 — shizhi-bracket-001

Source facts:

- original drawing already has hole diameter, outline dimensions and plate thickness;
- it lacks hole-position datum, contact-face flatness and assembly direction;
- three factories produce hole absolute-position differences of 0.6 mm; one cannot align in assembly;
- revised functional interfaces: A mounting contact, B lateral position, C hole axis coaxial with mating part;
- hole position is established from A/B;
- a fourth factory not involved in the design discussion independently reproduces the definition.

Interaction:

`multi missing-definition classification → functional-interface reveal → independent reproduction test → debrief`

# Verification

Actions run `35962501094`:

- 46 tests passed, 0 failed;
- chapters 9–12 compile and complete along tested correction paths;
- static build generates twelve authored cases;
- previous cases and generic player regressions remain green;
- browser smoke passed.

# Current gate

PR for RMD-TASK-009 is unmerged. RMD-TASK-010 is blocked until RMD-GIT-009 merge approval.
