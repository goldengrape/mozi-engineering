# TRACE — Project Map / Traceability

> Human-readable trace index. Machine-readable copy lives in `.vibe/trace.json`.

## Current Phase

MVP RMD-TASK-001..005 are complete and merged. Phase 2 full-book expansion is active at RMD-TASK-006: curriculum registry + generic structured Ink primitives.

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
| RMD-TASK-001 | checkpointed_by | RMD-GIT-001 | PR #3; CI run 35906458582 passed 3/3 tests |
| RMD-TASK-002 | checkpointed_by | RMD-GIT-002 | PR #5; CI run 35935107490 passed 10/10 tests |
| RMD-TASK-003 | checkpointed_by | RMD-GIT-003 | PR #6; CI run 35936809001 passed 17/17 tests + build + Chrome smoke |
| RMD-TASK-004 | checkpointed_by | RMD-GIT-004 | PR #7; pre-deploy CI 35937736546 passed 19/19 tests |
| RMD-TASK-005 | checkpointed_by | RMD-GIT-005 | PR #9 merged as 9402a213b0bb527f189d06c7dcb44d3ea4c492c6 |

## AI Retrieval

| Source ID | Relation | Target Path | Notes |
| --- | --- | --- | --- |
| URD-REQ-011..012 | summarized_by | okf/requirements/textbook-interaction.md | 教材正文集成与稳定 case identity |
| ADD-DP-002..005 | summarized_by | okf/decisions/ink-static-architecture.md | Ink / generic player 边界 |
| RMD-TASK-001..005 | summarized_by | okf/paths/mvp-build-path.md | implementation route |

## Execution Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-001 | implemented_on | feat/rmd-task-001-case-contract-clean | case contract / Ink skeleton / tests |
| RMD-GIT-001 | merged_by | RMD-PR-003 | PR #3 merged to main as 17f76760513769fcdfeb65f0c631ad474fde6451 |
| TDD-TEST-001/011/012/013 | evidenced_by | Actions run 35906691564 | npm test: 3 passed, 0 failed |
| MDD-API-001/002 | evidenced_by | npm run check:case | case contract and Ink compile validated |

## RMD-TASK-002 Execution Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-002 | implemented_on | feat/rmd-task-002-jieti-story | full Ink branch logic, learning state, state-aware debrief |
| RMD-GIT-002 | merged_by | RMD-PR-005 | PR #5 merged to main as fd7619a512567cb4366c97ac933192a14fb59f53 |
| TDD-TEST-002..006/017..019 | evidenced_by | Actions run 35935288962 | npm test: 10 passed, 0 failed |
| ADD-DP-002/004/005 | realized_in | content/cases/jieti-water-001/story.ink | pedagogy, state and debrief remain in Ink |
| RMD-TASK-002 | summarized_by | okf/cases/jieti-water-001.md | concise AI retrieval page |

## RMD-TASK-003 Execution Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-003 | implemented_on | feat/rmd-task-003-generic-player | generic player, static builder, local server, tests |
| RMD-GIT-003 | merged_by | RMD-PR-006 | PR #6 merged to main as bb50df7de0a609e8e1168cc07b8c56d9e2b3cf6c |
| TDD-TEST-014/015/020/021 | evidenced_by | Actions run 35936809001 | 17/17 project tests passed |
| TDD-TEST-007 | evidenced_by | Actions run 35936809001 | generated site opened in headless Chrome through local static server |
| MDD-API-003 | realized_in | scripts/build.cjs | preflight validate/compile then disposable dist build |
| MDD-API-004 | realized_in | src/player.js | generic Ink text/choice/restart/error runtime |
| RMD-TASK-003 | summarized_by | okf/decisions/generic-player-build.md | concise runtime/build retrieval page |

## RMD-TASK-004 Pre-deploy Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-004 | implemented_on | feat/rmd-task-004-pages | registry hardening + Pages workflow |
| RMD-GIT-004 | merged_by | RMD-PR-007 | PR #7 merged to main as bbbeca30c6a0242d7860d04686b7d9b4a6d3ae05 |
| TDD-TEST-009 | evidenced_by | Actions run 35937736546 | second case generated with unchanged player |
| TDD-TEST-021 | strengthened_by | tests/build-output.test.cjs | repository-relative asset links for project Pages |
| MDD-MOD-004 | realized_in | .github/workflows/pages.yml | upload dist artifact and deploy to github-pages environment |
| RMD-TASK-004 | summarized_by | okf/deployment/github-pages.md | concise deployment retrieval page |

## RMD-TASK-004 Production Attempt

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-GIT-004 | merged_as | bbbeca30c6a0242d7860d04686b7d9b4a6d3ae05 | PR #7 merged to main |
| RMD-TASK-004 | deployment_attempted_by | Actions run 35938292249 | build + artifact upload succeeded |
| Actions run 35938292249 | deployment_succeeded | https://goldengrape.github.io/mozi-engineering/ | Configure + Deploy succeeded after Pages enablement |
| public Pages smoke | evidenced_by | Actions run 35940775884 | all required public routes 200; desktop + 390px Chrome smoke passed |

## RMD-TASK-004 Completion Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-004 | deployed_to | https://goldengrape.github.io/mozi-engineering/ | GitHub Actions Pages source |
| CI-RUN-35938292249 | deployment_succeeded | production Pages | Configure + Deploy succeeded after source switch |
| CI-RUN-35940775884 | public_smoke_passed | production Pages | all required routes 200; desktop and 390px Chrome rendering passed |
| RMD-TASK-004 | completed_before | RMD-TASK-005 | gate satisfied |

## RMD-TASK-005 Execution Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-005 | implemented_on | docs/rmd-task-005-textbook-integration | real public route bound into book.md |
| TDD-TEST-010 | evidenced_by | book.md + publication candidates | no-web first judgment remains executable |
| URD-REQ-011/012 | realized_in | Chapter 1 publication insertion | stable case identity +正文入口 |
| RMD-TASK-005 | artifact_candidate | DOCX v0.5.3 interactive candidate | 144-page render; pages 10–29 inspected; 124 other pages render-identical |
| RMD-TASK-005 | artifact_candidate | EPUB v0.5.3 interactive candidate | package/XML/link/QR checks passed |
| publication baseline | caveat | v0.5.4 | earlier terminology artifact bytes unavailable; no false version relabeling |

## RMD-GIT-005 Checkpoint Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-GIT-005 | reviewed_by | RMD-PR-009 | PR #9, draft pending merge approval |
| TDD-TEST-010 | evidenced_by | Actions run 35942052613 | no-web/textbook contract included in 21/21 passing tests |
| RMD-TASK-005 | evidenced_by | Actions run 35942052613 | build, case validation and browser smoke passed |

## Phase 2 Source → Runtime

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| textbook chapters 1–16 | represented_in | content/curriculum.json | source-derived chapter/method/worked-example fields |
| content/curriculum.json design | constrained_by | docs/INTERACTION_PROTOCOL.md | choice / multi / number / rank only in Task 006 |
| docs/INTERACTION_PROTOCOL.md | verified_by | TDD2-TEST-005..009 | tags, validation, real Ink primitive fixture |
| RMD-TASK-006 | verified_by | TDD2-TEST-001..009 | full-book registry + generic runtime |
| RMD-TASK-006 | summarized_by | okf/paths/full-book-expansion.md | Phase 2 slices |

## RMD-TASK-006 Execution Evidence

| Source ID | Relation | Target | Notes |
| --- | --- | --- | --- |
| RMD-TASK-006 | implemented_on | feat/rmd-task-006-curriculum-primitives | curriculum registry + generic primitive runtime |
| RMD-GIT-006 | reviewed_by | RMD-PR-010 | PR #10 |
| TDD2-TEST-001..009 | evidenced_by | Actions run 35949487336 | 30/30 total tests passed |
| INTERACTION-PROTOCOL-001 | realized_in | src/player.js | multi / number / rank; answer meaning remains in Ink |
| CURRICULUM-001 | realized_in | content/curriculum.json | 16 textbook chapters in source order |

## Gates

| Source | Relation | Target | Status |
| --- | --- | --- | --- |
| URD-0001 | accepted_before | ADD-0001 | satisfied |
| ADD-0001 | accepted_before | MDD-0001 / TDD-0001 / RMD-0001 | satisfied |
| RMD-0001 Build Path | accepted_before | RMD-TASK-001 | satisfied |
| RMD-GIT-001 | completed_before | RMD-TASK-002 | satisfied |
| RMD-GIT-002 | completed_before | RMD-TASK-003 | satisfied |
| RMD-GIT-003 | completed_before | RMD-TASK-004 | satisfied |
| RMD-GIT-004 | completed_by | production Pages deployment | workflow 35938292249 rerun succeeded after Source = GitHub Actions |
| repository Pages source mode | configured_as | GitHub Actions | satisfied |
| production Pages smoke | completed_before | RMD-TASK-005 | satisfied |

## Trace Update Rule

当 URD、ADD、MDD、TDD、RMD、实现任务或 OKF 变化时，在同一变更集更新本文件和 `.vibe/trace.json`。若 ID 关系不确定，先记录问题，不得猜造链接。


## Phase 2 Build Path

| Source | Relation | Target | Status |
| --- | --- | --- | --- |
| RMD-GIT-005 | completed_before | RMD-TASK-006 | satisfied |
| RMD-GIT-006 | gates | RMD-TASK-007 | **waiting for merge approval** |
| RMD-GIT-007 | gates | RMD-TASK-008 | pending |
| RMD-GIT-008 | gates | RMD-TASK-009 | pending |
| RMD-GIT-009 | gates | RMD-TASK-010 | pending |
| RMD-GIT-010 | gates | RMD-TASK-011 | pending |
| RMD-GIT-011 | gates | RMD-TASK-012 | pending |
