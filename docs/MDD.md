# MDD — Module Design Document

> Building Blocks / 模块、接口、数据与契约。本文只定义首个原型需要的边界；不把以后可能出现的平台功能提前塞进来。

## Metadata

- document_id: MDD-0001
- status: accepted-for-planning
- source_add: ADD-0001
- last_updated: 2026-09-23

## Stack Decision

首个原型采用最小静态 Web 技术栈：

- HTML / CSS / 原生 JavaScript；
- Ink 作为案例源语言；
- Inky 作为人工编辑与试玩工具；
- inkjs 作为编译器与浏览器运行时；
- Node.js 只用于本地构建和自动测试；
- npm 负责开发依赖与 lockfile；
- GitHub Pages 托管构建后的静态 `dist/`；
- 不采用 React / Vue / Svelte，不使用数据库，不运行服务端应用。

为了减少依赖，浏览器端不再另加打包框架。构建脚本直接：

1. 用 inkjs 编译 `story.ink`；
2. 把 inkjs 浏览器 runtime 复制到 `dist/assets/ink.js`；
3. 复制通用 `player.js`、CSS 和 HTML 模板；
4. 为案例生成静态目录。

inkjs 当前 `package.json` 的 `main` 指向 `dist/ink-full.js`，其 README 也提供了 browser/serverless 模板，因此这一做法与上游用法一致。

## Project Layout

```text
README.md
package.json
package-lock.json
.gitignore

content/
  cases/
    jieti-water-001/
      manifest.json
      book.md
      story.ink

src/
  player.js
  style.css
  case.html
  index.html

scripts/
  build.cjs

tests/
  case-contract.test.cjs
  story-learning.test.cjs
  build-output.test.cjs

dist/                     # generated; not source of truth

docs/
  URD.md
  ADD.md
  MDD.md
  TDD.md
  RMD.md
  TRACE.md
  CHANGELOG.md
  PARKING_LOT.md

.vibe/
okf/
.github/
  workflows/
    pages.yml             # RMD later task
```

`dist/` 是生成物，默认不提交到 Git；GitHub Actions 或本地构建重新生成。

## Module List

| ID | Module | Related DP | Responsibility | Non-Responsibility |
| --- | --- | --- | --- | --- |
| MDD-MOD-001 | Case Package | ADD-DP-001, ADD-DP-002, ADD-DP-004, ADD-DP-005 | 保存单个案例的 manifest、教材正文块、Ink 分支、案例内状态与复盘。 | 不负责网页 UI、构建、部署；不写跨案例评分。 |
| MDD-MOD-002 | Static Builder | ADD-DP-006 | 校验案例包、编译 Ink、生成案例静态目录、复制通用 runtime/assets，并生成案例索引。 | 不决定教学内容；不解释具体学习状态。 |
| MDD-MOD-003 | Generic Player | ADD-DP-003 | 在浏览器载入 manifest + story JSON，逐段显示文本和选择，驱动 Ink Story，提供重新开始。 | 不包含 `jieti-water-001` 或《界体》的正确答案、分支、评分规则。 |
| MDD-MOD-004 | Pages Deployment | URD-CON-001, URD-REQ-009 | 在测试与构建通过后，把 `dist/` 发布到 GitHub Pages。 | 不生成案例内容，不修改教材正文。 |

## Module Dependency Notes

| Module | Depends On | Why | Coupling Risk |
| --- | --- | --- | --- |
| MDD-MOD-001 Case Package | none inside runtime | 内容源必须可独立编辑与审查。 | low |
| MDD-MOD-002 Static Builder | MDD-MOD-001 + inkjs compiler | 构建需要读取案例包并编译 Ink。 | low; directional |
| MDD-MOD-003 Generic Player | built manifest/story + inkjs runtime | 浏览器需要运行编译后的故事。 | low; no case-specific dependency |
| MDD-MOD-004 Pages Deployment | MDD-MOD-002 output | 只发布测试通过的静态产物。 | low; directional |

## Case Package Contract

### `manifest.json`

MVP schema：

```json
{
  "schema_version": 1,
  "case_id": "jieti-water-001",
  "title": "教学楼为什么多用了 18% 的水？",
  "language": "zh-CN",
  "textbook": {
    "chapter_id": "01-jieti",
    "placement": "opening-practice"
  },
  "story_source": "story.ink",
  "book_fragment": "book.md"
}
```

Rules:

1. `case_id` 与案例目录名完全相同。
2. `case_id` 一旦进入已发布教材，原则上不改；展示标题可以改。
3. `title` 在第一次关键选择之前不得泄露《界体》方法名。
4. `story_source` 与 `book_fragment` 必须指向同目录现有文件。
5. Web route 由 builder 统一推导为 `cases/<case_id>/`，manifest 不重复保存 route，避免双份事实源。

### `book.md`

使用 YAML frontmatter：

```markdown
---
case_id: jieti-water-001
chapter_id: 01-jieti
placement: opening-practice
---

<可直接进入教材正文的内容>
```

正文必须包含：

- 无标签开场情境；
- 第一次需要学习者做出的动作或判断；
- “互动版”入口占位，出版时由稳定 case ID 生成 URL / 二维码；
- 没有网络或使用纸书时仍可做的最小替代练习；
- 不在第一次判断前告诉学习者“本题使用《界体》”。

`book.md` 不是网页内容的摘要，而是教材正文的一部分。

### `story.ink`

MVP rules：

- 所有案例特定分支、证据、后果与复盘均在 Ink；
- 首次关键选择前不显示《界体》方法标签；
- 至少包含两个会改变后续内容或状态的选择点；
- 至少一个“过早判断”路径允许学习者根据新证据修改判断；
- 案例内状态使用清楚的变量名；
- 保留两个通用结束变量：
  - `case_complete`：故事已完成；
  - `debrief_reached`：已进入结尾复盘；
- 其余变量是案例局部事实，不强行做跨十六篇的统一评分 schema；
- 结尾复盘由 Ink 条件分支生成，而不是交给 JS 根据分数猜测。

首个案例预期状态示例：

```text
checked_boundary
premature_leak_claim
revised_after_evidence
case_complete
debrief_reached
```

这只是 MDD 允许的状态集合，不代表当前已写定具体剧情文字。

## Build Output Contract

对 `jieti-water-001`，构建后产生：

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

稳定公开路径：

```text
/cases/jieti-water-001/
```

在 GitHub project Pages 上，完整地址会包含仓库 base path；正文出版层不应手抄拼接地址，而应从 case ID / 发布配置生成。

## Public Interfaces

### MDD-API-001 — `loadCasePackage(caseDir)`

Owner: MDD-MOD-002

Inputs:
- path to a case directory

Outputs:
- normalized manifest
- book metadata
- Ink source text

Preconditions:
- directory exists
- manifest is valid JSON
- required files exist

Postconditions:
- returned `case_id` equals directory name
- book frontmatter case ID equals manifest case ID

Failure behavior:
- fail build with a clear path + reason
- never silently invent missing metadata

Side effects:
- none

### MDD-API-002 — `compileStory(inkSource)`

Owner: MDD-MOD-002

Inputs:
- UTF-8 Ink source

Outputs:
- Ink JSON string

Preconditions:
- source is non-empty

Postconditions:
- inkjs can instantiate a `Story` from the output

Failure behavior:
- fail build; include compiler error

Side effects:
- none

### MDD-API-003 — `buildSite(sourceRoot, outDir)`

Owner: MDD-MOD-002

Inputs:
- `content/cases/`
- generic page/assets sources
- output directory

Outputs:
- Build Output Contract above

Preconditions:
- every discovered case passes MDD-API-001
- every story passes MDD-API-002

Postconditions:
- each case ID has exactly one route
- `cases/index.json` contains every built case exactly once
- generated HTML references local runtime assets, not a mandatory CDN

Failure behavior:
- abort build before partial deployment

Side effects:
- rewrites `outDir`

### MDD-API-004 — `bootPlayer({root, manifestUrl, storyUrl})`

Owner: MDD-MOD-003

Inputs:
- root DOM element
- manifest URL
- compiled story URL

Outputs:
- interactive story UI in `root`

Preconditions:
- `window.inkjs.Story` is available
- manifest/story fetch succeeds

Postconditions:
- story output is rendered in order
- current Ink choices render as keyboard-focusable buttons
- selecting a button calls the matching Ink choice and continues
- when story ends, a restart action is offered

Failure behavior:
- show a readable in-page error and keep page usable enough to retry
- do not fabricate story content

Side effects:
- DOM updates only; no server write, no account state

## Rendering / Accessibility Constraints

- `lang="zh-CN"`;
- mobile-first readable width and font size;
- choices use real `button` elements;
- visible keyboard focus;
- output container uses appropriate live-region behavior without rereading the entire page on every update;
- respect `prefers-reduced-motion`;
- no required hover interaction;
- no audio dependency;
- MVP story state lives in the Ink Story instance only; reload starts over.

## Security / Content Handling

MVP has no user-generated HTML. The player should render ordinary story text with `textContent` by default rather than injecting arbitrary `innerHTML`. If later we need emphasis or structured markup, add an explicit, tested rendering contract rather than enabling arbitrary HTML silently.

## Implementation Style Constraints

- plain JavaScript; no framework unless a later requirement justifies it;
- no case-specific branching in `src/player.js`;
- no duplicated list of cases hard-coded in multiple files;
- build errors are explicit and stop publication;
- generated `dist/` is disposable;
- keep functions small enough to unit-test with Node built-ins;
- no analytics in MVP.

## MDD Completion Gate

- [x] Each module maps back to at least one DP or deployment constraint.
- [x] Each module has a narrow responsibility and explicit non-responsibility.
- [x] Public interfaces have inputs, outputs, side effects, and failure behavior.
- [x] Case data and build output contracts are explicit.
- [x] No URD prose is duplicated beyond what is required to state contracts.
- [x] Player does not own pedagogical branching.
