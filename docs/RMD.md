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
| RMD-GIT-001 | RMD-TASK-001 | `feat/rmd-task-001-case-contract-clean` | `feat: implement RMD-TASK-001 case contract` | #3 | merged | 3/3 tests + compile check |
| RMD-GIT-002 | RMD-TASK-002 | `feat/rmd-task-002-jieti-story` | `feat: implement RMD-TASK-002 jieti story` | #5 | merged | 10/10 tests + source review |
| RMD-GIT-003 | RMD-TASK-003 | `feat/rmd-task-003-generic-player` | `feat: implement RMD-TASK-003 generic player` | #6 | merged | 17/17 tests + build + headless Chrome smoke |
| RMD-GIT-004 | RMD-TASK-004 | `feat/rmd-task-004-pages` | `feat: implement RMD-TASK-004 pages deployment` | #7 | completed | 19/19 tests + successful Actions deployment + public desktop/mobile smoke |
| RMD-GIT-005 | RMD-TASK-005 | `docs/rmd-task-005-textbook-integration` | `docs: integrate RMD-TASK-005 into textbook body` | #9 | merged | 21/21 tests + book contract + DOCX/EPUB artifact QA |

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

- status: **merged / completed**
- branch: `feat/rmd-task-001-case-contract-clean`
- pull request: #3
- case_id: `jieti-water-001`
- dependency lock: npm `inkjs` 2.4.0
- code/test head verified: `957f2df3c17756d2f63a1f5be513a79ce59553a5`
- GitHub Actions run: `35906691564`

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

RMD-GIT-001 completed successfully.

- PR #3 merged into `main` as squash commit `17f76760513769fcdfeb65f0c631ad474fde6451`.
- RMD-TASK-001 is complete.
- RMD-TASK-002 is now unblocked, but has not started in this bookkeeping change.


## RMD-TASK-002 Execution Record

- status: **merged / completed**
- branch: `feat/rmd-task-002-jieti-story`
- pull request: #5
- case_id: `jieti-water-001`
- GitHub Actions run: `35935288962`
- compiled story JSON: 9122 bytes

### Source boundary

The story's case facts were checked against the current textbook example “18% 的用水增长到底属于谁？”:

- monthly use: 1000 m³ → 1180 m³;
- initial claim: “楼内漏水 180 m³”;
- the building main meter includes rooftop cooling makeup, outdoor irrigation temporary connection, and construction use;
- irrigation 70 m³ and construction 50 m³ leave 60 m³ to explain;
- submeter evidence: cooling makeup +45 m³; toilets + laboratory +15 m³;
- the action changes from broad leak inspection to checking cooling-system makeup and blowdown control.

The interactive layer changes **when** these facts are revealed and asks the learner to act on them. It does not add measurements or hidden events.

The final switch prompt is also source-bounded: the current 《界体》 method boundary states that quantitative balance after the boundary is defined belongs to 《衡算》.

### Implemented learning flow

PATH-A:

```text
observe 1000 → 1180
→ check what the main meter includes
→ separate cross-boundary temporary uses
→ reveal 70 + 50 → 60 remaining
→ inspect submeter
→ reveal +45 cooling / +15 toilets+lab
→ recognize that attribution and action changed
→ debrief
→ choose a quantity-balance next move
```

PATH-B:

```text
observe 1000 → 1180
→ prematurely call all 180 m³ leakage
→ receive main-meter scope evidence
→ revise the boundary
→ reveal 70 + 50 → 60 remaining
→ prematurely stop once more
→ continue after feedback
→ reveal submeter evidence
→ debrief reflects both revisions
```

Additional feedback path:

- expanding the boundary to the whole campus is allowed as a learner choice;
- the story explains that a larger boundary is not automatically better;
- the learner can return to the smallest boundary sufficient for the current action.

### Learning-state variables

The story records process rather than a score:

```text
checked_boundary
premature_leak_claim
revised_after_evidence
checked_temporary_records
checked_submeter
stopped_too_early
overexpanded_boundary
ignored_boundary_evidence
recognized_action_change
recognized_switch_to_balance
debrief_reached
case_complete
```

### Automated evidence

GitHub Actions run `35935107490`:

- `npm ci` — passed;
- `npm test` — **10 passed, 0 failed**;
- `npm run check:case` — passed;
- full story compiled successfully with inkjs 2.4.0.

The story tests cover:

- TDD-TEST-002 / 017 — no method-label leakage before the first choice;
- TDD-TEST-003 / 018 — real branch divergence;
- TDD-TEST-004 — premature attribution remains recoverable;
- TDD-TEST-005 — debrief varies with earlier actions;
- TDD-TEST-006 — 《界体》 is named in debrief and 《衡算》 at the switch condition;
- TDD-TEST-019 — both fixed paths reach debrief and completion;
- explicit boundary-too-wide feedback and recovery.

### Git checkpoint

RMD-GIT-002 completed successfully.

- PR #5 merged into `main` as squash commit `fd7619a512567cb4366c97ac933192a14fb59f53`.
- RMD-TASK-002 is complete.
- RMD-TASK-003 was authorized by the same owner instruction to continue execution and has been implemented on its own branch.


## RMD-TASK-003 Execution Record

- status: **merged / completed**
- branch: `feat/rmd-task-003-generic-player`
- pull request: #6
- implementation head verified: `4558106ec426cb534eeeadec2d4bc9ccc00eeca9`
- GitHub Actions run: `35936809001`

### Delivered

Generic browser layer:

- `src/player.js` — case-agnostic Ink player;
- `src/case.html` — generated-case shell;
- `src/index.html` — local exercise index;
- `src/style.css` — mobile-first reading/choice styles, visible focus and reduced-motion rule.

Build/runtime layer:

- `scripts/build.cjs` validates case packages before writing output;
- Ink source is compiled to `story.json`;
- npm's locked local `inkjs` runtime is copied to `dist/assets/ink.js`;
- no CDN is required;
- duplicate case IDs abort before rewriting an existing output directory;
- `scripts/serve.cjs` serves `dist/` using Node's built-in HTTP server.

Generated contract:

```text
dist/
  index.html
  assets/
    ink.js
    player.js
    style.css
  cases/
    index.json
    jieti-water-001/
      index.html
      manifest.json
      story.json
```

### Decoupling evidence

`src/player.js` knows only:

- story output text;
- current choices;
- completion;
- restart;
- load failure.

Automated TDD-TEST-020 rejects case-specific terms or state such as `jieti-water-001`, 《界体》, 漏水 or `checked_boundary` inside the player.

All pedagogical branching remains in `story.ink`.

### Automated evidence

GitHub Actions run `35936809001`:

- locked dependency install — passed;
- `npm test` — **17 passed, 0 failed**;
- `npm run build` — passed; built 1 case;
- `npm run check:case` — passed;
- headless Chrome static-browser smoke — passed.

Covered Task 003 oracles include:

- TDD-TEST-014 — static output contract and duplicate-ID preflight failure;
- TDD-TEST-015 — generic player renders choices, handles load error/retry, and can restart;
- TDD-TEST-020 — no case-specific pedagogy in `src/player.js`;
- TDD-TEST-021 — generated page uses local runtime assets, not a remote CDN;
- additional runtime path test — the generic player carries the real case through a complete PATH-A to the 《界体》→《衡算》 switch and completion.

### Browser smoke

CI starts `npm run serve`, opens the generated route in real headless Chrome, executes the local inkjs runtime and player, and verifies that the rendered DOM contains:

- the “1000 m³” opening;
- the “先查主表究竟把哪些用水算在一起” choice;
- the “先按‘楼内漏水 180 m³’处理” choice.

The complete click path is separately exercised through the same generic player code with the real inkjs Story runtime in Node's test harness.

Visual/mobile-device review is still appropriate before public release; it belongs naturally with RMD-TASK-004 Pages smoke rather than changing Task 003's runtime architecture.

### Git checkpoint

RMD-GIT-003 completed successfully.

- PR #6 merged into `main` as squash commit `bb50df7de0a609e8e1168cc07b8c56d9e2b3cf6c`.
- RMD-TASK-003 is complete.
- RMD-TASK-004 is now active on its own branch.


## RMD-TASK-004 Execution Record — pre-deploy checkpoint

- status: **completed**
- branch: `feat/rmd-task-004-pages`
- pull request: #7
- project-check head: `0091107e045e687dc56b9bd18f891051bfcd0696`
- GitHub Actions run: `35937736546`

### Registry hardening

TDD-TEST-009 now creates a second fixture case and verifies that:

- the builder produces two registry entries;
- both case routes are generated;
- the home page lists both cases;
- `src/player.js` remains byte-for-byte unchanged.

This is the first direct automated evidence that adding another authored case does not require case-specific player changes.

### GitHub Pages path safety

A new build test verifies that generated HTML uses repository-relative links:

- home page: `./assets/...` and `./cases/<case_id>/`;
- case page: `../../assets/...`;
- no root-absolute `/assets/` dependency.

This is required for project Pages deployment under a repository base path such as:

```text
https://goldengrape.github.io/mozi-engineering/
```

### Pages workflow

`.github/workflows/pages.yml` follows the official GitHub Pages Actions pattern and uses:

- `actions/checkout@v4`;
- `actions/setup-node@v4`;
- `actions/upload-pages-artifact@v3`;
- `actions/configure-pages@v5`;
- `actions/deploy-pages@v5`.

On a push to `main` it:

1. installs locked dependencies;
2. runs `npm run check`;
3. uploads only generated `dist/`;
4. deploys the artifact to the `github-pages` environment.

Deployment credentials are limited to the deploy job:

```text
pages: write
id-token: write
```

The Pages workflow is intentionally not run from this feature branch. Production deployment happens only after the Task 004 PR is explicitly approved and merged into `main`.

### Pre-deploy evidence

GitHub Actions run `35937736546`:

- `npm test` — **19 passed, 0 failed**;
- `npm run build` — passed;
- `npm run check:case` — passed;
- local headless Chrome smoke — passed.

New Task 004 checks include:

- TDD-TEST-009 — second case registry generation without player modification;
- project-Pages relative-path safety.

### Remaining completion evidence

RMD-TASK-004 is not yet marked complete because its definition of done requires a public Pages deployment.

After PR #7 merge, the Pages workflow must:

1. deploy successfully from `main`;
2. return a public Pages URL;
3. allow the public `jieti-water-001` route to render the opening and choices;
4. be checked at desktop and mobile-width conditions;
5. remain independent of a CDN or backend.

RMD-GIT-004 therefore acts as a **pre-deploy merge checkpoint**. RMD-TASK-005 remains blocked until public Pages smoke succeeds.


### Production deployment attempt

PR #7 was explicitly approved and merged into `main` as squash commit:

`bbbeca30c6a0242d7860d04686b7d9b4a6d3ae05`

This triggered production workflow run `35938292249`.

Result:

- build job — **success**;
- full project checks — success;
- Pages artifact upload — success;
- deploy job — **failed at Configure Pages**;
- `actions/deploy-pages` was skipped because no Pages site exists yet for the repository.

The initial GitHub error was that the Pages site could not be found. After the owner enabled Pages, rerun of workflow `35938292249` completed both Configure Pages and Deploy successfully.

This is a repository-administration state, not a build failure.

### What the public smoke revealed

The deployment action reported success and returned `https://goldengrape.github.io/mozi-engineering/`, but the live site is still being generated by Jekyll from the repository source rather than serving the uploaded `dist/` artifact.

Public diagnostics show:

- `/mozi-engineering/` → HTTP 200;
- public root HTML contains `meta name="generator" content="Jekyll v3.10.0"`;
- public root HTML does not match the built `dist/index.html` hash;
- `/mozi-engineering/assets/style.css` → 404;
- `/mozi-engineering/cases/index.json` → 404;
- `/mozi-engineering/cases/jieti-water-001/index.html` → 404;
- the downloaded production Pages artifact does contain `assets/`, `cases/index.json`, and the full case directory.

Therefore the live site is still using branch/Jekyll publishing rather than the Actions artifact.

### Owner action required

In the repository UI, set exactly:

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

The important part is **Source = GitHub Actions**, not merely “Pages enabled”. Then rerun `Deploy GitHub Pages`.

### Current gate

RMD-TASK-004 remains **not complete** until the live site is actually serving the Actions-deployed artifact and the public smoke checks pass.

RMD-TASK-005 remains blocked.


### Final Pages completion evidence

After the repository Pages **Source** was switched to `GitHub Actions`, the deploy job from workflow run `35938292249` was rerun and completed successfully.

Live site:

`https://goldengrape.github.io/mozi-engineering/`

Final public smoke run `35940775884` verified:

- home page → HTTP 200;
- `assets/style.css` → HTTP 200;
- `assets/ink.js` → HTTP 200;
- `assets/player.js` → HTTP 200;
- `cases/index.json` → HTTP 200;
- `cases/jieti-water-001/` → HTTP 200;
- case `manifest.json` → HTTP 200;
- case `story.json` → HTTP 200;
- public root matches the generated `dist/index.html`;
- public case HTML has no remote script dependency;
- headless Chrome renders the live case at 1440×1000;
- headless Chrome renders the same live case at 390×844;
- both widths show the 1000 → 1180 opening and both first learner choices.

RMD-TASK-004 is therefore **complete**.

RMD-TASK-005 is now unblocked and ready to integrate the validated interaction block into the textbook body.


## RMD-TASK-005 Execution Record

- status: **merged / completed**
- branch: `docs/rmd-task-005-textbook-integration`
- case_id: `jieti-water-001`
- public route: `https://goldengrape.github.io/mozi-engineering/cases/jieti-water-001/`

### Repository textbook block

`content/cases/jieti-water-001/book.md` now contains the real public route instead of a publication-time placeholder.

It preserves the accepted structure:

1. unlabeled opening fact;
2. first learner judgment — “你第一步会查什么？为什么？”;
3. public interactive entry;
4. paper/no-web fallback;
5. explicit instruction not to name the 180 m³ difference as a cause before evidence.

Two repository contract tests were added for the stable public URL, no-web task, and no method-label answer before the first judgment.

### Publication artifact integration

The currently available publication-source files in this conversation are:

- `墨经补完_跨时代工程学教材_v0.5.3_插图版(1).docx`
- `造物之理_跨时代工程方法导论_v0.5.3(1).epub`

The validated interaction block was inserted into the existing Chapter 1 section:

`3. 完整例题：18% 的用水增长到底属于谁？`

The body order is now:

```text
existing opening fact
→ 先不要翻看完整分析
→ 先做判断
→ first-action question
→ public link + QR code
→ no-web two-item paper task
→ “不要先把 180 m³ 命名成某个原因”
→ 做完再看：完整分析
→ existing 第一界 / 第二界 / 第三界 worked explanation
```

No new case measurements or events were added.

### Generated candidate artifacts

Because the accessible publication baseline is v0.5.3, the generated files are deliberately named **candidate** artifacts rather than pretending to supersede a later release:

- `墨经补完_跨时代工程学教材_v0.5.3_互动练习集成候选版.docx`
  - SHA-256: `dca82a137c875d4aa6970812207112e3c336e007c32afa5af1bd674a22aca261`
- `造物之理_跨时代工程方法导论_v0.5.3_互动练习集成候选版.epub`
  - SHA-256: `ae590571f2d9e45fd1a0e52f7501ed023dc9e7c641dda9b404d4b4c12098d16e`
- QR payload:
  - `https://goldengrape.github.io/mozi-engineering/cases/jieti-water-001/`
  - decoded locally and matched exactly.

### DOCX QA

The DOCX was rendered using the required Word-document QA path.

Result:

- 144 rendered pages;
- changed render region: pages 10–29;
- pages 1–9 and 30–144 are byte-for-byte identical to the original rendered pages — 124 unchanged pages;
- every changed page 10–29 was visually inspected;
- the new interactive block has no clipping or overlap;
- the QR code is legible and centered;
- the visible full URL and Word hyperlink relationship both point to the public route;
- existing worked-example content follows the “做完再看：完整分析” divider.

### EPUB QA

The EPUB candidate passed:

- ZIP integrity check;
- required `mimetype` first and stored uncompressed;
- XML parsing for XHTML / OPF / NCX / container files;
- QR image present in package and OPF manifest;
- external interactive hyperlink present;
- no embedded interactive script — EPUB remains a reading artifact that links to the web runtime.

### Publication baseline note

An earlier v0.5.4 terminology-revision artifact is referenced in project history, but its DOCX/EPUB bytes are not available in the current conversation file surface.

Therefore this task does **not** relabel the generated v0.5.3-based candidates as v0.5.4 or v0.5.5.

If v0.5.4 remains the canonical publishing baseline, replay this localized Chapter 1 insertion onto those files before declaring a new release. The repository `book.md`, public case URL, QR payload and insertion design are already stable.

### Repository CI

PR #9 head was verified by GitHub Actions run `35942052613`:

- `npm test` — **21 passed, 0 failed**;
- the two new Task 005 book-integration tests passed;
- `npm run build` — passed;
- `npm run check:case` — passed;
- local headless Chrome case smoke — passed.

### Git checkpoint

RMD-GIT-005 is ready for review.

- pull request: #9;
- merge status: **merged**;
- PR #9 merged into `main` as `9402a213b0bb527f189d06c7dcb44d3ea4c492c6`;
- post-merge Pages build/deploy run `35942538225` succeeded.


# Phase 2 — Full-book Ink expansion

2026-09-24，项目所有者确认继续把 Ink 互动层扩展到全书，并明确授权开始执行。

教材来源结构保持十六章：

- 察物：界体、衡算、定准、传准、参验；
- 制物：分任、制耦、分构、定动、容度、相衡、示制；
- 运行：序作、通滞；
- 守败：防误、限败。

Phase 2 不把十五个新案例简单复制成《界体》的按钮分支。互动原语保持少而通用，案例特定判断继续留在 Ink。

## Phase 2 Ordered Tasks

| ID | Task | Depends On | Main Outputs | Done When |
| --- | --- | --- | --- | --- |
| RMD-TASK-006 | 建立十六章 curriculum registry 与通用互动原语协议/runtime | RMD-TASK-005 | `content/curriculum.json`, `docs/INTERACTION_PROTOCOL.md`, generic multi/number/rank runtime, Phase 2 tests | 16 章来源结构固定；structured primitives 通过真实 Ink fixture；现有《界体》回归不破坏 |
| RMD-TASK-007 | 完成察物第 2–5 章互动案例 | RMD-TASK-006 | 衡算、定准、传准、参验 case packages + book fragments + story tests | 四章均有无标签开场、错误/修正路径、state-aware debrief；build 自动出现新 routes |
| RMD-TASK-008 | 完成制物第 6–8 章 | RMD-TASK-007 | 分任、制耦、分构 cases | 功能/依赖/分界三种学习动作可执行，JS 无篇目专用逻辑 |
| RMD-TASK-009 | 完成制物第 9–12 章 | RMD-TASK-008 | 定动、容度、相衡、示制 cases | 约束、数值预测、关系改变、独立复现均有可执行练习 |
| RMD-TASK-010 | 完成运行/守败第 13–16 章 | RMD-TASK-009 | 序作、通滞、防误、限败 cases | 排序、瓶颈预测、攻击设计、故障状态控制可执行 |
| RMD-TASK-011 | 加入跨章混合检索/迁移练习 | RMD-TASK-010 | 至少四个无方法标签 mixed cases | 学习者必须从症状判断下一动作，不能按章节标签答题 |
| RMD-TASK-012 | 建立一条贯穿案例并回写全书出版物 | RMD-TASK-011 | longitudinal case + full-book link/QR/no-web integration | Web/Word/EPUB 身份一致，全文入口与纸面替代练习通过 QA |

## Phase 2 Git Checkpoints

| ID | RMD Task | Branch | Merge Status | Required Evidence |
| --- | --- | --- | --- | --- |
| RMD-GIT-006 | RMD-TASK-006 | `feat/rmd-task-006-curriculum-primitives` | active | TDD2-TEST-001..009 + regression suite |
| RMD-GIT-007 | RMD-TASK-007 | `feat/rmd-task-007-observe-cases` | pending | chapter 2–5 path tests + build/browser smoke |
| RMD-GIT-008 | RMD-TASK-008 | `feat/rmd-task-008-make-cases-a` | pending | chapter 6–8 tests |
| RMD-GIT-009 | RMD-TASK-009 | `feat/rmd-task-009-make-cases-b` | pending | chapter 9–12 tests |
| RMD-GIT-010 | RMD-TASK-010 | `feat/rmd-task-010-run-fail-cases` | pending | chapter 13–16 tests |
| RMD-GIT-011 | RMD-TASK-011 | `feat/rmd-task-011-mixed-review` | pending | transfer/mixed-case tests |
| RMD-GIT-012 | RMD-TASK-012 | `docs/rmd-task-012-full-book-integration` | pending | publication QA + public route smoke |

## RMD-TASK-006 Scope

Source facts and interaction design are deliberately separated.

`content/curriculum.json` records the textbook-derived chapter/method/worked-example structure and, in a separate `design` object, the interactive primitive allocation.

Generic runtime protocol:

- `choice` — ordinary Ink choices;
- `multi` — checkbox-style selection/classification/edge selection;
- `number` — numeric prediction or calculation;
- `rank` — ordering/state precedence.

Structured interaction contract:

1. Ink emits generic `ui:` tags;
2. exactly one Ink commit choice is present;
3. the player validates the learner input;
4. the player writes only the declared Ink variable;
5. Ink resumes and owns interpretation, branching and feedback.

No answer key or method-specific scoring is allowed in JavaScript.
