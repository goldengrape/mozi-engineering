---
okf_version: "0.1"
---

# OKF Bundle Index

> Derived from `docs/`. Do not introduce new requirements here.

## Current phase

The project is at **RMD-GIT-006 merge checkpoint**. The full-book curriculum registry and generic choice/multi/number/rank protocol are implemented and tested.

- first prototype: `jieti-water-001`, based on the textbook's “教学楼用水增加 18%” case;
- interactive task belongs in the textbook body;
- MVP has no accounts, teacher dashboard, backend database, or runtime AI question generation;
- first learning mechanism to validate: unlabeled judgment → branch consequence/new evidence → method switching/revision → debrief;
- ADD design is decoupled and accepted.

RMD-TASK-001..005 are complete and merged. Phase 2 starts with a full-book curriculum registry and generic structured interaction primitives.

## Current architecture

- **Case Package**: `manifest.json` + `book.md` + `story.ink`
- **Static Builder**: validates case packages, compiles Ink, generates routes/assets
- **Generic Player**: plain browser JS + inkjs; no case-specific pedagogy
- **Pages Deployment**: publishes tested `dist/`

The browser runtime must not contain `jieti-water-001` or 《界体》-specific decision logic.

## Current test model

- contract tests for case identity / required files / compilation / build output;
- story-path tests for no label leakage, real branch divergence, recoverable wrong path, state-aware debrief;
- manual browser/accessibility smoke;
- textbook-body review for `book.md`.

Software test success validates the mechanism implementation, not long-term learning effectiveness.

## Accepted build path

1. case contract + minimum compile/test plumbing;
2. full Ink learning story + state/debrief;
3. generic player + static build;
4. case registry + GitHub Pages;
5. integrate accepted `book.md` into the actual textbook body.

## Focused concept pages

- [教材正文中的互动任务](requirements/textbook-interaction.md) — 正文和网页分别承担什么。
- [Ink + 静态网页架构](decisions/ink-static-architecture.md) — 为什么教学逻辑留在 Ink、播放器保持通用。
- [首个互动案例的构建路径](paths/mvp-build-path.md) — 已完成的单案例 MVP 路径。
- [全书互动扩展路径](paths/full-book-expansion.md) — 十六章、混合复习与贯穿案例的 Phase 2 路径。
- [jieti-water-001 案例逻辑](cases/jieti-water-001.md) — 证据释放、学习状态、复盘与方法切换边界。
- [通用播放器与静态构建](decisions/generic-player-build.md) — Web runtime、build output 和无案例耦合边界。
- [GitHub Pages 发布](deployment/github-pages.md) — registry 扩展、project Pages 路径与生产部署门槛。

## Source documents

- `docs/URD.md` — accepted user intent and scope.
- `docs/ADD.md` — accepted Design Split and coupling analysis.
- `docs/MDD.md` — module/interface contracts.
- `docs/TDD.md` — test oracles and path fixtures.
- `docs/RMD.md` — current Build Path checkpoint.
- `docs/TRACE.md` — full trace.
