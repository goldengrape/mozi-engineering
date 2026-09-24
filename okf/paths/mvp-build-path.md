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
status: task_002_checkpoint_ready
---

# 顺序

1. **案例契约**：稳定 case ID、manifest、book.md、可编译 Ink 骨架和 contract tests。
2. **教学逻辑**：完成《界体》分支、学习状态和条件复盘。
3. **通用播放器**：任何编译后的案例都能在同一网页壳中运行。
4. **GitHub Pages**：生成案例索引并公开部署。
5. **教材回写**：把验证后的 `book.md` 正式放进《界体》正文。

# 当前状态

RMD-TASK-001 已合入 main。RMD-TASK-002 已实现并通过自动测试，当前停在 RMD-GIT-002 merge checkpoint。


# Current checkpoint

RMD-TASK-002 is implemented on `feat/rmd-task-002-jieti-story`.

Evidence:

- GitHub Actions run `35935107490`: 10 tests passed, 0 failed;
- both fixed learning paths reach a state-aware debrief;
- the premature “180 m³ = leakage” path is recoverable;
- the first decision does not reveal the method label;
- compiled story JSON is 9122 bytes.

PR #5 remains draft and unmerged. RMD-TASK-003 is blocked until merge approval.
