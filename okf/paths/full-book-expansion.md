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
status: complete
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

RMD-TASK-011 merged as `29cc34f75f8c51636699bba82f421c15bd4d18fb`; post-merge Pages run `35968012671` passed.

RMD-TASK-012 is implemented on `docs/rmd-task-012-full-book-integration`.

Evidence:

- Appendix G longitudinal case `longitudinal-ai-timeline-001` is executable;
- publication map covers 16 chapter + 4 mixed + 1 longitudinal entries;
- Actions `36071993875`: 66 tests passed, 0 failed;
- static build generates 21 routes;
- Word v0.5.3 full-book candidate has 21 case links and a 157-page render; 30 interaction-marker pages were individually inspected;
- EPUB v0.5.3 full-book candidate has 21 interaction entries and passed package/XML/link integrity checks;
- artifact version remains explicitly tied to the accessible v0.5.3 baseline.

PR #16 merged as `fc358c35068aabceee6860d3ed8b4cb984aa1d73`.

Pages run `36076953380` completed successfully. Public resolution checks passed for the home, longitudinal route, manifest and story. The exact deployed artifact passed Chromium smoke at 1440×1000 and 390×844, with no observed horizontal overflow or console/page errors and a working first-step interaction.

RMD-GIT-012 is satisfied and Phase 2 is complete.