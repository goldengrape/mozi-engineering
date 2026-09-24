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
status: task_003_checkpoint_ready
---

# 顺序

1. **案例契约**：稳定 case ID、manifest、book.md、可编译 Ink 骨架和 contract tests。
2. **教学逻辑**：完成《界体》分支、学习状态和条件复盘。
3. **通用播放器**：任何编译后的案例都能在同一网页壳中运行。
4. **GitHub Pages**：生成案例索引并公开部署。
5. **教材回写**：把验证后的 `book.md` 正式放进《界体》正文。

# 当前状态

RMD-TASK-001 与 RMD-TASK-002 已合入 main。RMD-TASK-003 已实现并通过自动测试、静态构建与 headless Chrome 烟测，当前停在 RMD-GIT-003 merge checkpoint。

# Current checkpoint

RMD-TASK-003 is implemented on `feat/rmd-task-003-generic-player`.

Evidence:

- GitHub Actions run `35936809001`: 17 tests passed, 0 failed;
- `npm run build` produced the full single-case static output;
- the player has no case-specific pedagogy;
- generated HTML uses local runtime assets only;
- headless Chrome loaded the locally served generated case and rendered the opening plus both first choices;
- the generic player test walks the real case through completion.

PR #6 remains draft and unmerged. RMD-TASK-004 is blocked until merge approval.
