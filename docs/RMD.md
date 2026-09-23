# RMD — Route / Runbook / Execution Map Document

> Build Path / 实现顺序、停止条件、回退点和 Git checkpoint。

## Metadata

- document_id: RMD-0001
- status: accepted
- source_docs: URD-0001, ADD-0001, MDD-0001, TDD-0001
- last_updated: 2026-09-23

## Project Setup

| ID | Item | Decision | Command / File | Done When |
| --- | --- | --- | --- | --- |
| RMD-SETUP-001 | stack | static HTML/CSS/JS + Ink/inkjs + Node build tooling | package.json | stack recorded and no app framework added |
| RMD-SETUP-002 | package manager | npm | `npm install` | package-lock.json exists |
| RMD-SETUP-003 | runtime/build dependency | inkjs | package.json | exact resolved version locked |
| RMD-SETUP-004 | ignore rules | ignore node_modules, dist, OS/editor junk, secrets | .gitignore | generated/local files absent from git diff |
| RMD-SETUP-005 | tests | Node built-in test runner | tests/ | `npm test` executes |
| RMD-SETUP-006 | git | existing GitHub repo + feature branches + PR | current repo | clean starting state before each slice |

## Execution Strategy

- strategy: contracts/tests first; one thin vertical slice at a time
- risk posture: standard
- default branch: main
- current planning PR: #1
- implementation branch style: one branch per RMD task
- merge style: prefer squash
- generated `dist/`: do not commit unless a later Pages constraint requires a deliberate change
- first implementation slice: case contract + minimum compile/test plumbing

## Ordered Tasks

| ID | Task | Depends On | Inputs | Outputs | Test / Check Command | Branch | Done When |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RMD-TASK-001 | 建立最小 JS/Ink 项目、案例契约与第一批 contract tests | Build Path approval | MDD case schema, TDD-011..013 | package.json, .gitignore, build/test skeleton, `jieti-water-001/manifest.json`, `book.md`, compileable story skeleton | `npm test` | `feat/rmd-task-001-case-contract-clean` | case identity/required-file/compile tests pass; docs/TRACE updated |
| RMD-TASK-002 | 完成《界体》“用水增加 18%”Ink 分支、学习状态与条件复盘 | RMD-TASK-001 | URD learning goals, TDD PATH-A/B | full `story.ink`; story behavior tests | `npm test -- story-learning` if supported, otherwise `npm test` | `feat/rmd-task-002-jieti-story` | PATH-A/PATH-B pass; wrong path可修正; debrief varies by state |
| RMD-TASK-003 | 实现通用播放器与单案例静态 build | RMD-TASK-002 | MDD-API-002..004 | `src/player.js`, templates/styles, `scripts/build.cjs`, generated local dist | `npm run check` | `feat/rmd-task-003-generic-player` | local static server 可完整试玩；player 无 case-specific logic |
| RMD-TASK-004 | 泛化案例 registry/build，并发布 GitHub Pages | RMD-TASK-003 | DP-006, TDD-009/021 | `cases/index.json`, Pages workflow, deployed route | `npm run check` + Pages smoke | `feat/rmd-task-004-pages` | public Pages URL 可从桌面/手机完成案例；无需 CDN/后端 |
| RMD-TASK-005 | 将最终 `book.md` 互动块回写《界体》教材正文并验证链接/离线练习 | RMD-TASK-004 | accepted book fragment + public route | textbook body revision source / artifact update | content review + link/QR smoke | `docs/rmd-task-005-textbook-integration` | 正文真正包含互动块；无网页也可做最小练习；数字版链接有效 |

## First Three Tasks in Plain Language

### 1. 先把“一个案例是什么”钉死

不写漂亮网页。先让仓库知道：

- 这个案例的稳定 ID 是什么；
- 哪段是正文；
- 哪个文件是 Ink；
- 怎样判断它们没串错；
- Ink 至少能被编译。

这样后面不会出现网页做好了才发现正文和案例 ID 对不上。

### 2. 再只做教学逻辑

用 Inky / Ink 把《界体》案例写完整：

- 不给方法标签；
- 允许先误判；
- 给新证据；
- 允许修正；
- 根据实际路径做复盘。

这一阶段不用关心网页长什么样。

### 3. 最后做一个“什么案例都能播”的网页壳

网页只认识 Ink Story，不认识《界体》。先本地跑通，再进入 Pages 发布。

## 🔴 Git Checkpoints

| ID | RMD Task | Branch | Commit Message | PR | Merge Status | Required Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| RMD-GIT-001 | RMD-TASK-001 | `feat/rmd-task-001-case-contract-clean` | `feat: implement RMD-TASK-001 case contract` | pending | pending | npm test output + contract diff |
| RMD-GIT-002 | RMD-TASK-002 | `feat/rmd-task-002-jieti-story` | `feat: implement RMD-TASK-002 jieti story` | pending | pending | PATH-A/B test output + Inky/manual review note |
| RMD-GIT-003 | RMD-TASK-003 | `feat/rmd-task-003-generic-player` | `feat: implement RMD-TASK-003 generic player` | pending | pending | npm run check + local browser smoke |
| RMD-GIT-004 | RMD-TASK-004 | `feat/rmd-task-004-pages` | `feat: implement RMD-TASK-004 pages deployment` | pending | pending | Actions/Pages status + public smoke |
| RMD-GIT-005 | RMD-TASK-005 | `docs/rmd-task-005-textbook-integration` | `docs: integrate RMD-TASK-005 into textbook body` | pending | pending | textbook diff / artifact check |

First implementation push and every merge remain explicit checkpoint actions.

## 🛑 Stop Conditions

| ID | Condition | Action |
| --- | --- | --- |
| RMD-STOP-001 | Build Path 尚未得到项目所有者确认 | 不创建 RMD-TASK-001 implementation branch |
| RMD-STOP-002 | 当前教材案例事实与 `story.ink` 计划发生冲突 | 回到教材来源 / URD 内容约束；不得凭一般知识补故事事实 |
| RMD-STOP-003 | ADD 的 decoupled 边界被实现打破，例如 JS 开始写《界体》专用判断 | 回到 ADD/MDD，重构边界后再继续 |
| RMD-STOP-004 | 公共接口缺契约或测试没有 oracle | 回到 MDD/TDD |
| RMD-STOP-005 | tests/checks fail | 不 commit/merge 完成态；修复或记录失败 |
| RMD-STOP-006 | `git status` 出现与当前任务无关的改动 | 停止并隔离改动，不混入 checkpoint |
| RMD-STOP-007 | secret、token、.env、本地缓存或 node_modules 出现在 diff | 移除并更新 .gitignore |
| RMD-STOP-008 | 首次 implementation push、任一 merge、删除或不可逆写操作 | 显示目标 branch/PR、测试和风险，取得明确许可 |

## Rollback Points

| ID | After Step | Rollback Action |
| --- | --- | --- |
| RMD-RB-001 | project/tooling initialized | revert RMD-TASK-001 commit; docs remain |
| RMD-RB-002 | case contract established | revert case package/tooling commit; preserve accepted URD/ADD/MDD/TDD |
| RMD-RB-003 | full Ink story added | revert story branch/PR without touching generic runtime |
| RMD-RB-004 | generic player built | revert player/build commit; story source remains usable in Inky |
| RMD-RB-005 | Pages deployed | disable/revert Pages workflow; local build remains |
| RMD-RB-006 | textbook body integrated | revert only the textbook insertion block while preserving web prototype |

## Documentation / Trace Rule per Task

每个 RMD task 完成时：

1. 更新 `docs/TRACE.md`；
2. 若设计事实改变，先更新对应 docs，再更新 OKF；
3. 更新 `docs/CHANGELOG.md`；
4. 只生成与本任务相关的 OKF concept pages，不复制整份 docs；
5. 运行 Ockham check：删除重复、未来功能和无法追踪的段落。

## RMD Completion Gate

- [x] Tasks ordered by dependency and risk.
- [x] Setup comes before feature implementation.
- [x] Interface/contracts and tests precede substantive runtime code.
- [x] Every task has a test/check command.
- [x] Every task ends in a Git checkpoint.
- [x] Stop conditions route back to the right document.
- [x] Rollback points exist at risky boundaries.
- [x] Textbook-body integration is a required task, not a parking-lot idea.

## Checkpoint Record

2026-09-23，项目所有者确认 Build Path：

1. 案例契约 → Ink 教学逻辑 → 通用播放器；
2. 之后发布 GitHub Pages；
3. 最后把验证后的 `book.md` 回写教材正文；
4. 每一步使用独立 branch / tests / PR checkpoint，并保留单独回退点。

RMD-0001 因此进入 **accepted**。RMD-TASK-001 已获准开始。


## RMD-TASK-001 Execution Record

- status: **checkpoint-ready / pending merge approval**
- branch: `feat/rmd-task-001-case-contract-clean`
- pull request: #2
- case_id: `jieti-water-001`
- dependency lock: npm `inkjs` 2.4.0
- code/test head verified: `ed1249a5aad8c0fe6f216dee143c1fa562908ade`
- GitHub Actions run: `35906458582`

### Evidence

Local replay of dependency-free contract checks:

- `node --check scripts/case-package.cjs` — passed
- `node --test tests/case-contract.test.cjs` — 2 passed, 0 failed

GitHub Actions with locked dependencies:

- `npm ci --ignore-scripts --no-audit --no-fund` — passed
- `npm test` — 3 passed, 0 failed
  - case identity / textbook metadata contract
  - missing story source negative case
  - Ink compile + runtime start
- `npm run check:case` — passed
  - case_id: `jieti-water-001`
  - chapter_id: `01-jieti`
  - compiled story JSON: 1273 bytes

### Correction made during the task

The first CI pass exposed that the earlier planning reference used the stale `inkle/inkjs` 2.1.0 repository state while the maintained npm package is represented by `y-lohse/inkjs`. The project followed the docs-first rule:

1. correct ADD/MDD and OKF source/version;
2. pin npm `inkjs` 2.4.0;
3. generate and commit `package-lock.json`;
4. rerun tests to green.

### Git checkpoint

RMD-GIT-001 is ready for review. No merge has been performed. RMD-TASK-002 must not start until PR #3 is merged or the owner explicitly approves a stacked-branch exception.
