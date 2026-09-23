# ADD — Axiomatic Design Document

> Design Split / 功能拆分与耦合检查。目标不是先挑框架，而是让每个学习功能有清楚的实现责任，并尽量避免“改一个案例就要改网页、改教材、改测试”的连锁反应。

## Metadata

- document_id: ADD-0001
- status: accepted
- source_urd: URD-0001
- last_updated: 2026-09-23

## Design Intent

首个原型只验证一个核心闭环：

**正文遇到无标签任务 → 进入《界体》互动案例 → 做选择 → 获得新证据/后果 → 必要时修改判断 → 结尾复盘 → 回到教材继续学习。**

技术选择服从这个闭环。当前不引入账号、后端数据库、教师后台、运行时 AI 出题或大型前端框架。

## Functional Requirements

| ID | Source | Functional Requirement | Notes |
| --- | --- | --- | --- |
| ADD-FR-001 | URD-REQ-011, URD-REQ-012 | 每个互动案例必须有一个可直接进入教材正文的“正文块”，并与网页案例共享稳定身份。 | 正文块不是附录说明。 |
| ADD-FR-002 | URD-REQ-002..005 | 案例内容必须支持无标签选择、逐步揭示证据、选择后果和允许修正判断的分支。 | 首个案例为《界体》用水增加 18%。 |
| ADD-FR-003 | URD-REQ-001, URD-CON-001 | 浏览器端应能在 GitHub Pages 上运行任意已发布案例，不需要为每个案例写一套页面代码。 | 静态托管。 |
| ADD-FR-004 | URD-REQ-006 | 案例应记住本次会话中的关键学习动作，并允许后续文本根据这些动作变化。 | MVP 不要求账号或跨设备同步。 |
| ADD-FR-005 | URD-REQ-007 | 结尾应根据本次路径生成复盘，把动作映射回教材方法并指出关键修正。 | 复盘依赖 FR-004 的状态。 |
| ADD-FR-006 | URD-REQ-008, URD-REQ-009 | 新增或改写案例时，应主要改案例包本身；通用网页播放器和发布流程不应随案例内容反复修改。 | 控制内容/UI/发布耦合。 |

## Design Parameters

| ID | Satisfies FR | Design Parameter | Rationale |
| --- | --- | --- | --- |
| ADD-DP-001 | ADD-FR-001 | **案例包正文契约**：每个案例目录有稳定 `case_id`、`manifest.json` 与 `book.md`。其中 `book.md` 保存可放入教材正文的互动块，manifest 保存正文位置、网页路径等机器可读信息。 | 让“教材正文里的练习”成为一等产物，不依赖网站 README 或人工记忆。 |
| ADD-DP-002 | ADD-FR-002 | **Ink 故事源文件**：每个案例用 `story.ink` 表达分支、逐步信息、后果和可回转路径；Inky 用于作者编辑与人工试玩。 | Ink 本来就是互动叙事脚本，适合把“行动→新证据→再判断”写成可审阅文本。 |
| ADD-DP-003 | ADD-FR-003 | **通用静态播放器**：一个不含具体案例逻辑的 HTML/CSS/JS shell，使用 inkjs 载入并运行故事。 | inkjs 的官方仓库说明其可在浏览器运行，并提供 serverless/browser 模板；适合 GitHub Pages。 |
| ADD-DP-004 | ADD-FR-004 | **学习状态契约**：用约定的 Ink 变量记录关键动作，例如 `checked_boundary`、`premature_attribution`、`revised_after_evidence`；播放器只负责运行，不解释具体变量。 | 把教学状态留在案例脚本中，避免 JS 硬编码《界体》逻辑。 |
| ADD-DP-005 | ADD-FR-005 | **Ink 复盘段约定**：案例结束节点根据标准状态变量选择复盘文本，并输出教材方法映射；不另建评分引擎。 | 复盘必须读取 DP-004，因此形成有意的单向依赖。 |
| ADD-DP-006 | ADD-FR-006 | **案例注册与构建约定**：构建脚本读取各案例 manifest，生成案例索引/静态产物；新增案例不改播放器源码。 | 把扩展成本限制在新增案例目录与测试。 |

## Proposed Case Package

这是设计边界，不是最终 MDD 文件清单：

```text
content/
  cases/
    jieti-water-001/
      manifest.json
      book.md
      story.ink
```

建议稳定 ID：

```text
case_id = jieti-water-001
```

稳定 ID 一旦进入教材正文后原则上不改名；展示标题可以改变。

## FR / DP Design Matrix

`X` 表示某 DP 直接影响该 FR。

| FR \ DP | DP-001 正文契约 | DP-002 Ink 内容 | DP-003 Web 播放器 | DP-004 状态契约 | DP-005 复盘 | DP-006 注册/构建 |
| --- | --- | --- | --- | --- | --- | --- |
| ADD-FR-001 正文集成 | X |  |  |  |  |  |
| ADD-FR-002 分支判断 |  | X |  |  |  |  |
| ADD-FR-003 静态运行 |  |  | X |  |  |  |
| ADD-FR-004 会话状态 |  |  |  | X |  |  |
| ADD-FR-005 路径复盘 |  |  |  | X | X |  |
| ADD-FR-006 案例扩展 | X |  |  |  |  | X |

## Matrix Classification

- classification: **decoupled**
- reason:
  - 前四项基本独立：正文块、互动内容、播放器、状态契约可以分别修改。
  - FR-005 有一条必要单向依赖：复盘必须读取已经发生过的学习状态，因此 DP-004 → DP-005。
  - FR-006 依赖稳定案例身份和 manifest，因此 DP-001 → DP-006。
  - 没有发现“改教材正文措辞就必须改播放器”“改一个案例就必须改全站 JS”这类无益回路。
- execution_order_if_decoupled:
  1. DP-001：先冻结案例 ID 与正文插入契约；
  2. DP-002 / DP-004：写 Ink 分支与关键状态；
  3. DP-005：根据状态写复盘；
  4. DP-003：用最小通用播放器跑通故事；
  5. DP-006：最后加入案例索引/构建自动化。

## Coupling Retry Log

| Attempt | Problem | Change Made | Result |
| --- | --- | --- | --- |
| 1 | 设想把“教材入口、案例文本、分支逻辑、复盘、网页 UI”全部写进一个 HTML/JS 文件。 | 把互动内容改由 Ink 表达，网页只做播放器。 | 消除了“改案例必须改 JS”的主要耦合，但教材正文仍与网页 URL/标题靠人工同步。 |
| 2 | 教材正文、网页路由和故事文件可能各自命名，长期容易失配。 | 引入稳定 `case_id` 和 manifest；正文插入稿与 story 放进同一个案例包。 | 正文与网页有共同身份，但复盘仍可能被另写成 JS 评分规则。 |
| 3 | 若 JS 解释每个案例的“正确行为/误区”，新增案例仍需改播放器。 | 把学习状态和复盘规则保留在 Ink 内；JS 只提供通用运行能力。 | 得到当前 decoupled 结构；剩余依赖均为必要单向依赖。 |

## Accepted Coupling

当前**没有需要登记为 Accepted Coupling 的无益耦合**。

两条有意保留的依赖：

1. `learning state → debrief`：复盘没有前面行为就失去意义；
2. `case manifest → registry/build`：发布层必须知道有哪些案例。

这两条都是明确的单向顺序，不形成回路。

## Technology Evidence

当前技术判断只用于证明方案可行，不把库细节写死为长期教材要求。

- Inkle 官方维护 `inkle/ink`，Ink 是互动叙事脚本语言。
- Inkle 官方维护 `inkle/inky`，可用于编写和测试 Ink 内容。
- 当前维护中的 `y-lohse/inkjs` 是 Ink 的 JavaScript 移植；其 package/README 明确提供浏览器运行时与 `inkjs/full` 编译入口。MVP 固定使用 npm `inkjs` 2.4.0。
- 因此 GitHub Pages 只需托管静态播放器与案例产物，不要求服务器端执行 Ink。

References:
- https://github.com/inkle/ink
- https://github.com/inkle/inky
- https://github.com/y-lohse/inkjs

## Non-goals at ADD Stage

本轮不决定：

- 是否使用 React/Vue/Svelte；
- 是否建立数据库；
- 是否实现登录；
- 是否实现云同步；
- 是否运行时调用 LLM；
- 是否把十六篇一次全部做完。

如果后续没有出现新的约束，MDD 应优先选择原生 HTML/CSS/JavaScript + inkjs 的最小实现，而不是引入框架。

## ADD Completion Gate

- [x] Every confirmed URD requirement that affects behavior has at least one FR or is explicitly deferred.
- [x] Every FR has a DP.
- [x] Design matrix is present.
- [x] Coupling classification is explicit.
- [x] Coupled design received structural retries.
- [x] Necessary remaining dependencies are recorded and directional.
- [x] No meaningless module split was introduced just to improve the matrix.

## Checkpoint Record

2026-09-23，项目所有者确认 ADD-0001 的四项结构判断：

1. 教材正文块是一等产物；
2. Ink 负责案例教学分支，JavaScript 保持通用；
3. 复盘读取 Ink 学习状态，不另造评分系统；
4. 接受当前 decoupled 结构与实现顺序。

ADD-0001 因此进入 **accepted**，允许继续 MDD / TDD / RMD。
