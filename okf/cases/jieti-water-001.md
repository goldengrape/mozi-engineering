---
type: case
title: jieti-water-001 案例逻辑
description: 《界体》“教学楼用水增加 18%”互动案例的证据释放、状态与复盘边界。
source_ids:
  - URD-REQ-003
  - URD-REQ-004
  - URD-REQ-005
  - URD-REQ-006
  - URD-REQ-007
  - RMD-TASK-002
  - TDD-TEST-002
  - TDD-TEST-003
  - TDD-TEST-004
  - TDD-TEST-005
  - TDD-TEST-006
  - TDD-TEST-019
status: checkpoint_ready
---

# Source facts

The interaction uses only the current textbook example:

- 1000 m³ → 1180 m³;
- initial claim: “楼内漏水 180 m³”;
- the main meter also includes rooftop cooling makeup, irrigation temporary connection, and construction use;
- irrigation 70 m³ + construction 50 m³ leaves 60 m³;
- cooling makeup +45 m³; toilets + laboratory +15 m³;
- action shifts from broad leak inspection to checking cooling-system makeup and blowdown control.

The interaction changes the **order of evidence** and the learner's decisions. It does not add measurements or events.

# Learning sequence

1. First choice is unlabeled.
2. The learner may inspect the main-meter boundary first, or prematurely call all 180 m³ leakage.
3. Main-meter scope evidence is revealed.
4. The learner can revise, ignore the evidence, or over-expand the boundary.
5. Temporary-use records reveal 70 + 50, leaving 60.
6. The learner may continue, or stop too early and receive feedback.
7. Submeter evidence reveals +45 cooling and +15 toilets/lab.
8. Debrief changes according to the earlier path.
9. Only in debrief is the core action named 《界体》.
10. A final action prompt demonstrates when the problem changes from boundary selection to quantity balance, revealing the switch to 《衡算》.

# Learning state

The story records actions, not a score:

- `checked_boundary`
- `premature_leak_claim`
- `revised_after_evidence`
- `checked_temporary_records`
- `checked_submeter`
- `stopped_too_early`
- `overexpanded_boundary`
- `ignored_boundary_evidence`
- `recognized_action_change`
- `recognized_switch_to_balance`
- `debrief_reached`
- `case_complete`

# Evidence

GitHub Actions run `35935107490`:

- 10 tests passed, 0 failed;
- no method-label leakage before first choice;
- real branch divergence;
- premature-attribution path is recoverable;
- debrief differs by path;
- both fixed paths complete;
- story compiles successfully with inkjs 2.4.0.

PR #5 remains unmerged until RMD-GIT-002 approval.
