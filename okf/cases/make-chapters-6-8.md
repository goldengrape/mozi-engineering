---
type: cases
title: 制物第 6–8 章互动案例
description: 分任、制耦、分构三章的来源边界、互动动作与验证证据。
source_ids:
  - RMD-TASK-008
  - TDD2-TEST-016
  - TDD2-TEST-017
  - TDD2-TEST-018
  - TDD2-TEST-019
  - TDD2-TEST-020
status: checkpoint_ready
---

# Cases

## 分任 — fenren-door-001

Source facts:

- 自动门需求：人员接近时自动开门、避免夹人、断电时可安全退出；
- 六项功能：感知通行请求、判断是否允许开启、产生开闭作用、保持状态、感知夹人风险、异常释放/人工退出；
- 感知可由红外、毫米波、压力垫实现；
- 执行可由电机、气缸、弹簧储能实现。

Interaction:

`multi function/implementation separation → replacement check → debrief`

Training target: separate “must happen” from “how it is currently implemented”.

## 制耦 — zhiou-robot-001

Source graph:

`L→N, L→O, L→T, L→P`

Source judgment:

- N/O need positioning timing;
- T only needs a stable “position reached task point” interface;
- P only needs a standardized power-request interface;
- therefore L→T and L→P are unnecessary propagation edges.

Interaction:

`multi edge removal → retry → ordering-vs-necessity judgment → debrief`

Training target: a sortable matrix does not prove each dependency has a functional reason.

## 分构 — fengou-service-001

Source facts:

- original system contains order, inventory and billing;
- splitting can bring local deployment and clearer responsibility;
- each boundary adds data-format, version, timeout, idempotency, authentication, retry and consistency duties;
- scheme A produces three bidirectional collaboration groups;
- scheme B uses stable event notification from order to inventory/billing, with no direct inventory-billing dependency;
- if two functions must share one transaction or high-speed memory state, forced separation may make the interface more fragile.

Interaction:

`multi interface-duty classification → scheme comparison → forced-split boundary check → debrief`

Training target: compare localization benefit and interface burden together.

# Verification

Actions run `35956839559`:

- 41 tests passed, 0 failed;
- chapters 6–8 compile and complete along tested recovery paths;
- static build generates eight authored cases;
- generic player remains free of every curriculum method name and case ID;
- existing browser smoke remains green.

# Current gate

PR #12 is unmerged. RMD-TASK-009 is blocked until RMD-GIT-008 merge approval.
