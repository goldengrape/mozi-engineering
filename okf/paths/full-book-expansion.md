---
type: implementation_path
title: 全书互动扩展路径
description: 从单案例 MVP 扩展到十六章、混合复习和贯穿案例的 Phase 2 路径。
source_ids:
  - RMD-TASK-006
  - RMD-TASK-007
  - RMD-TASK-008
  - RMD-TASK-009
  - RMD-TASK-010
  - RMD-TASK-011
  - RMD-TASK-012
status: task_010_checkpoint_ready
---

# Core rule

全书扩展不把十六章做成十六个同形选择题。

Ink 继续拥有证据释放、学习状态、分支后果和复盘；浏览器只提供少量通用交互原语。

# Primitive set

- `choice` — 普通 Ink 选择；
- `multi` — 多项选择/分类/关系边选择；
- `number` — 数值预测与计算；
- `rank` — 顺序与状态依赖。

后续如果出现确实不能由这四种原语表达的学习动作，再以测试先行方式扩协议，不提前堆专用组件。

# Slices

1. **RMD-TASK-006**：十六章 curriculum registry + 通用 primitive protocol/runtime。
2. **RMD-TASK-007**：完成察物 2–5（衡算、定准、传准、参验）。
3. **RMD-TASK-008**：完成制物 6–8（分任、制耦、分构）。
4. **RMD-TASK-009**：完成制物 9–12（定动、容度、相衡、示制）。
5. **RMD-TASK-010**：完成运行/守败 13–16（序作、通滞、防误、限败）。
6. **RMD-TASK-011**：加入无方法标签的混合检索/迁移案例。
7. **RMD-TASK-012**：选择一条贯穿案例，并把稳定入口回写全书出版物。

# Source boundary

`content/curriculum.json` 明确区分：

- source-derived：章节、篇名、完整例题标题、所属部类；
- design-derived：case ID、互动原语、互动机制与实现状态。

不能用互动设计反向改写教材来源事实。


# Current checkpoint

RMD-TASK-009 merged as `099b54dd16bd66d3e49d3068a38899e0673a8b80`; post-merge Pages run `35962990512` passed.

RMD-TASK-010 is implemented on `feat/rmd-task-010-run-fail-cases`.

Evidence:

- Actions `35963452549`: 51 tests passed, 0 failed;
- chapters 13–16 compile and complete along tested correction paths;
- all sixteen curriculum chapters are published;
- static build generates sixteen authored chapter cases;
- TDD2-TEST-030 verifies case/chapter identity and no-web book fragments across the whole sixteen-chapter set;
- existing browser smoke remains green.

The chapter-level expansion is now complete. The next slice changes the learning problem: RMD-TASK-011 must present mixed, unlabeled cases that require method retrieval/transfer rather than chapter-local recognition.

PR #14 is unmerged. RMD-TASK-011 is blocked until merge approval.
