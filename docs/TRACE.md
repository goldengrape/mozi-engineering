# TRACE — Project Map / Traceability

> Human-readable trace index. Machine-readable copy lives in `.vibe/trace.json`.

## Current Trace

| Source ID | Relation | Target ID / Path | Notes |
| --- | --- | --- | --- |
| URD-GOAL-001..003 | specified_in | docs/URD.md | 互动教材目标；含“必须进入教材正文” |
| URD-REQ-001..012 | specified_in | docs/URD.md | 当前需求事实来源 |
| URD-AC-001..010 | specified_in | docs/URD.md | 当前验收标准 |
| URD-0001 | accepted_before | ADD-0001 | 2026-09-23 已通过 Idea Brief checkpoint |
| URD-REQ-011 | refines_to | ADD-FR-001 | 教材正文集成 |
| URD-REQ-002..005 | refines_to | ADD-FR-002 | 无标签分支与反馈 |
| URD-REQ-001 | refines_to | ADD-FR-003 | GitHub Pages 静态运行 |
| URD-REQ-006 | refines_to | ADD-FR-004 | 会话内学习状态 |
| URD-REQ-007 | refines_to | ADD-FR-005 | 路径复盘 |
| URD-REQ-008..009 | refines_to | ADD-FR-006 | 可扩展案例包与 Git 追踪 |
| ADD-FR-001 | satisfied_by | ADD-DP-001 | case manifest + book.md |
| ADD-FR-002 | satisfied_by | ADD-DP-002 | story.ink |
| ADD-FR-003 | satisfied_by | ADD-DP-003 | generic inkjs player |
| ADD-FR-004 | satisfied_by | ADD-DP-004 | Ink learning-state contract |
| ADD-FR-005 | satisfied_by | ADD-DP-005 | state-aware Ink debrief |
| ADD-FR-006 | satisfied_by | ADD-DP-006 | registry/build convention |
| ADD-0001 | gates | MDD-0001 | 等待项目所有者确认 Design Split |
| MDD-0001 | informs | TDD-0001 | 公共接口需有测试契约 |
| TDD-0001 | gates | RMD-0001 | 无测试 oracle 不开始实现 |

## Trace Update Rule

当 URD、ADD、MDD、TDD、RMD 或 OKF 变化时，在同一变更集更新本文件和 `.vibe/trace.json`。
