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
status: task_004_pages_enablement_blocked
---

# 顺序

1. **案例契约**：稳定 case ID、manifest、book.md、可编译 Ink 骨架和 contract tests。
2. **教学逻辑**：完成《界体》分支、学习状态和条件复盘。
3. **通用播放器**：任何编译后的案例都能在同一网页壳中运行。
4. **GitHub Pages**：生成案例索引并公开部署。
5. **教材回写**：把验证后的 `book.md` 正式放进《界体》正文。

# 当前状态

RMD-TASK-001 至 RMD-TASK-003 已完成。RMD-TASK-004 已合入 main；生产构建与 Pages artifact 上传成功，但仓库尚未启用 Pages，因此公开部署被仓库设置阻塞。

# Current checkpoint

RMD-TASK-004 code is merged into `main` as `bbbeca30c6a0242d7860d04686b7d9b4a6d3ae05`.

Production workflow `35938292249`:

- build: success;
- full checks: success;
- Pages artifact upload: success;
- configure Pages: failed because no Pages site is enabled for the repository;
- deploy: skipped.

Owner action required:

`Settings → Pages → Build and deployment → Source → GitHub Actions`

After enablement, rerun the Pages workflow. RMD-TASK-004 remains incomplete until the public deployment and smoke tests pass. RMD-TASK-005 remains blocked.
