# TRACE — Project Map / Traceability

> Human-readable trace index. Machine-readable copy lives in `.vibe/trace.json`.

## Current Phase

URD-0001 and ADD-0001 are accepted. MDD-0001 and TDD-0001 are complete enough to define the first implementation route. RMD-0001 is accepted. RMD-TASK-001 is the active implementation slice.

## Requirement → Design

| Source ID | Relation | Target ID / Path | Notes |
| --- | --- | --- | --- |
| URD-GOAL-001..003 | specified_in | docs/URD.md | 互动学习目标；互动任务必须进入教材正文 |
| URD-REQ-001..012 | specified_in | docs/URD.md | 当前需求事实来源 |
| URD-AC-001..010 | specified_in | docs/URD.md | 当前验收标准 |
| URD-REQ-011 | refines_to | ADD-FR-001 | 教材正文集成 |
| URD-REQ-002..005 | refines_to | ADD-FR-002 | 无标签分支、逐步证据与反馈 |
| URD-REQ-001 | refines_to | ADD-FR-003 | GitHub Pages 静态运行 |
| URD-REQ-006 | refines_to | ADD-FR-004 | 会话内学习状态 |
| URD-REQ-007 | refines_to | ADD-FR-005 | 路径复盘 |
| URD-REQ-008..009 | refines_to | ADD-FR-006 | 可扩展案例包与 Git 追踪 |
| ADD-FR-001 | satisfied_by | ADD-DP-001 | manifest + book.md |
| ADD-FR-002 | satisfied_by | ADD-DP-002 | story.ink |
| ADD-FR-003 | satisfied_by | ADD-DP-003 | generic inkjs player |
| ADD-FR-004 | satisfied_by | ADD-DP-004 | Ink learning-state contract |
| ADD-FR-005 | satisfied_by | ADD-DP-005 | state-aware Ink debrief |
| ADD-FR-006 | satisfied_by | ADD-DP-006 | registry/build convention |

## Design → Modules / Interfaces

| Source ID | Relation | Target ID | Notes |
| --- | --- | --- | --- |
| ADD-DP-001 | implemented_by | MDD-MOD-001 | case package owns manifest + book fragment |
| ADD-DP-002 | implemented_by | MDD-MOD-001 | case package owns Ink source |
| ADD-DP-003 | implemented_by | MDD-MOD-003 | generic browser player |
| ADD-DP-004 | implemented_by | MDD-MOD-001 | case-local Ink state |
| ADD-DP-005 | implemented_by | MDD-MOD-001 | state-aware debrief in Ink |
| ADD-DP-006 | implemented_by | MDD-MOD-002 | static builder / registry |
| URD-CON-001 | implemented_by | MDD-MOD-004 | GitHub Pages deployment |
| MDD-MOD-002 | exposes | MDD-API-001 | loadCasePackage |
| MDD-MOD-002 | exposes | MDD-API-002 | compileStory |
| MDD-MOD-002 | exposes | MDD-API-003 | buildSite |
| MDD-MOD-003 | exposes | MDD-API-004 | bootPlayer |

## Interfaces / Requirements → Tests

| Source ID | Relation | Target ID | Notes |
| --- | --- | --- | --- |
| URD-AC-009..010 | verified_by | TDD-TEST-001 | textbook block / stable case identity |
| URD-AC-003 | verified_by | TDD-TEST-002 | no label leakage before first choice |
| URD-AC-002 | verified_by | TDD-TEST-003 | true branch divergence |
| URD-AC-004 | verified_by | TDD-TEST-004 | wrong path produces evidence and correction opportunity |
| URD-AC-005 | verified_by | TDD-TEST-005 | prior action changes debrief |
| URD-AC-006 | verified_by | TDD-TEST-006 | method mapping appears in debrief |
| URD-AC-001 | verified_by | TDD-TEST-007 | static browser run |
| MDD-API-001 | verified_by | TDD-TEST-011..012 | case contract |
| MDD-API-002 | verified_by | TDD-TEST-013 | Ink compile |
| MDD-API-003 | verified_by | TDD-TEST-014 | static build |
| MDD-API-004 | verified_by | TDD-TEST-015 | generic player |

## Tests → Build Path

| Source ID | Relation | Target ID | Notes |
| --- | --- | --- | --- |
| TDD-TEST-001,011..013 | scheduled_in | RMD-TASK-001 | case contract + compiler/test plumbing |
| TDD-TEST-002..006,018..019 | scheduled_in | RMD-TASK-002 | full Ink learning flow |
| TDD-TEST-007,014..015,020..021 | scheduled_in | RMD-TASK-003 | generic player + static build |
| TDD-TEST-009,021 | scheduled_in | RMD-TASK-004 | registry + Pages |
| TDD-TEST-010 | scheduled_in | RMD-TASK-005 | textbook-body integration |
| RMD-TASK-001 | checkpointed_by | RMD-GIT-001 | PR #2; CI run 35903687929 passed 3/3 tests |
| RMD-TASK-002 | checkpointed_by | RMD-GIT-002 | feature branch / tests / PR |
| RMD-TASK-003 | checkpointed_by | RMD-GIT-003 | feature branch / tests / PR |
| RMD-TASK-004 | checkpointed_by | RMD-GIT-004 | feature branch / tests / PR |
| RMD-TASK-005 | checkpointed_by | RMD-GIT-005 | docs/artifact integration checkpoint |

## AI Retrieval

| Source ID | Relation | Target Path | Notes |
| --- | --- | --- | --- |
| URD-REQ-011..012 | summarized_by | okf/requirements/textbook-interaction.md | 教材正文集成与稳定 case identity |
| ADD-DP-002..005 | summarized_by | okf/decisions/ink-static-architecture.md | Ink / generic player 边界 |
| RMD-TASK-001..005 | summarized_by | okf/paths/mvp-build-path.md | implementation route |

## Execution Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-001 | implemented_on | feat/rmd-task-001-case-contract | case contract / Ink skeleton / tests |
| RMD-GIT-001 | reviewed_by | RMD-PR-001 | PR #2, draft pending merge approval |
| TDD-TEST-001/011/012/013 | evidenced_by | Actions run 35903687929 | npm test: 3 passed, 0 failed |
| MDD-API-001/002 | evidenced_by | npm run check:case | case contract and Ink compile validated |

## Gates

| Source | Relation | Target | Status |
| --- | --- | --- | --- |
| URD-0001 | accepted_before | ADD-0001 | satisfied |
| ADD-0001 | accepted_before | MDD-0001 / TDD-0001 / RMD-0001 | satisfied |
| RMD-0001 Build Path | accepted_before | RMD-TASK-001 | satisfied |
| RMD-GIT-001 | gates | RMD-TASK-002 | **waiting for merge approval** |

## Trace Update Rule

当 URD、ADD、MDD、TDD、RMD、实现任务或 OKF 变化时，在同一变更集更新本文件和 `.vibe/trace.json`。若 ID 关系不确定，先记录问题，不得猜造链接。
