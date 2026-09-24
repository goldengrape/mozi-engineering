---
type: implementation_path
title: 首个互动案例的构建路径
description: 从案例契约到教材正文集成的五个实现切片。
source_ids:
  - RMD-TASK-001
  - RMD-TASK-002
  - RMD-TASK-003
  - RMD-TASK-004
  - RMD-TASK-005
status: task_004_predeploy_checkpoint_ready
---

# 顺序

1. **案例契约**：稳定 case ID、manifest、book.md、可编译 Ink 骨架和 contract tests。
2. **教学逻辑**：完成《界体》分支、学习状态和条件复盘。
3. **通用播放器**：任何编译后的案例都能在同一网页壳中运行。
4. **GitHub Pages**：生成案例索引并公开部署。
5. **教材回写**：把验证后的 `book.md` 正式放进《界体》正文。

# 当前状态

RMD-TASK-001 至 RMD-TASK-003 已合入 main。RMD-TASK-004 的 registry 与 Pages workflow 已实现并通过 19/19 分支测试；公网部署等待 PR #7 合并。

# Current checkpoint

RMD-TASK-004 is implemented on `feat/rmd-task-004-pages` through the pre-deploy checkpoint.

Evidence:

- GitHub Actions run `35937736546`: 19 tests passed, 0 failed;
- second fixture case is registered and built without changing `src/player.js`;
- generated links are repository-relative and suitable for project Pages;
- the Pages workflow uploads only generated `dist/`;
- production deployment is restricted to pushes on `main`.

PR #7 remains draft and unmerged. A successful public Pages deployment and smoke test are still required before RMD-TASK-004 is complete and RMD-TASK-005 can start.
