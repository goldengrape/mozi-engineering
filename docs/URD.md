# URD — User Requirement Document

> Source of truth for user intent. Do not put implementation design here.

## Metadata

- project: mozi-engineering
- document_id: URD-0001
- status: accepted
- owner: goldengrape
- last_updated: 2026-09-23
- document_strength: standard
- checkpoint_accepted: 2026-09-23

## Project Goal

| ID | Goal | Status |
| --- | --- | --- |
| URD-GOAL-001 | 把《造物之理 / 墨经补完》中的工程方法，从“读者看作者正确分析”扩展为“学习者在无标签情境中自己判断、取证、修正并调用方法”的互动学习体验。 | accepted |
| URD-GOAL-002 | 用一个小型可运行原型验证：分支互动是否能比普通章末练习更有效地训练方法选择、方法切换、反馈、检索与迁移。 | accepted |
| URD-GOAL-003 | 互动练习属于教材正文的教学结构：正文中直接安排互动任务，网页承担可运行的分支体验，而不是把练习整体移到教材之外。 | accepted |

## Target Users / Roles

| ID | Role | Need / Motivation | Notes |
| --- | --- | --- | --- |
| URD-ROLE-001 | 《造物之理》的学习者 / 自学读者 | 不只知道十六篇“是什么”，还要在现实问题没有章节标题时知道先做什么、何时换方法。 | primary |
| URD-ROLE-002 | 使用教材组织课程或讨论的教师 / 带领者 | 需要可直接分配的互动案例，并能把互动结果带回正文讨论。 | secondary; not required for first prototype |

## Core Scenarios

| ID | Scenario | Primary Actor | Expected Outcome |
| --- | --- | --- | --- |
| URD-SCEN-001 | 学习者在教材正文中遇到一个没有方法名提示的互动任务，先做判断，再进入可运行案例逐步获得新证据或后果。 | URD-ROLE-001 | 学习者必须主动判断，而不是从章节标题猜题型。 |
| URD-SCEN-002 | 学习者沿着不同路径调查同一问题；错误选择不会立即只显示“答错”，而会产生可理解的后果或暴露新的信息。 | URD-ROLE-001 | 反馈指出下一次判断应该改变什么。 |
| URD-SCEN-003 | 一个案例中可能先后调用多个方法，并允许从后续问题返回前面的方法。 | URD-ROLE-001 | 学习者练习“何时切换方法”，而不是把十六篇当成十六个孤立章节。 |
| URD-SCEN-004 | 案例结束后显示学习者实际做过的关键动作，并把这些动作映射回《界体》《衡算》《定准》等方法名。 | URD-ROLE-001 | 方法名附着在已经发生过的判断动作上。 |
| URD-SCEN-005 | 纸书正文保留互动任务的开场、动作要求和无网页时也能理解的最小练习；EPUB / 数字版可直接点击，纸书可通过二维码或短链接进入同一网页案例。 | URD-ROLE-001 | 互动任务在正文中成立；网页增强练习，而不是把正文挖空。 |

## In Scope

| ID | Requirement | Priority | Notes |
| --- | --- | --- | --- |
| URD-REQ-001 | 提供一个可在普通现代浏览器中打开的互动案例入口。 | must | 面向 GitHub Pages 发布。 |
| URD-REQ-002 | 第一个可运行原型使用《界体》“教学楼用水增加 18%”案例，并形成完整的端到端分支体验。 | must | 项目所有者已确认。 |
| URD-REQ-003 | 案例开始时不得直接告诉学习者“本题应该使用哪一篇”。 | must | 训练方法检索，而非章节内猜题。 |
| URD-REQ-004 | 选择应改变后续信息、后果、反馈或可选动作，而不是只做静态选择题判分。 | must | 分支必须承担学习作用。 |
| URD-REQ-005 | 反馈应解释判断依据与下一步，而不是只给“正确 / 错误”。 | must | 对典型误区提供针对性反馈。 |
| URD-REQ-006 | 一个案例允许记录本次学习过程中的关键状态，例如是否检查过边界、是否过早归因、是否根据新证据修改判断。 | must | MVP 只要求会话内状态。 |
| URD-REQ-007 | 案例结束时给出简短复盘：学习者做过哪些动作、对应哪些方法、哪里发生过方法切换。 | must | 不做人格评分或总分排名。 |
| URD-REQ-008 | 互动内容源文件应与网页展示层分离，便于后续扩展到更多案例。 | should | 具体实现方案在 ADD/MDD 决定。 |
| URD-REQ-009 | 项目文档、互动内容与实现代码都在 Git 中可追踪，并采用小步 checkpoint。 | must | 遵循 vibe-coding-skill。 |
| URD-REQ-010 | 互动练习应保持教材的核心边界：十六篇是启发式方法，不是万能算法；跨领域使用时允许明确“类比到这里停止”。 | must | 为后续 Transfer / Stop 案例预留。 |
| URD-REQ-011 | 首个互动任务必须作为《界体》正文的一部分设计，而不是只放在独立“练习网站”或附录；正文至少包含开场情境、第一次动作要求、进入互动版本的入口和无网页时可执行的最小替代练习。 | must | 用户明确要求“需要放入教材正文”。 |
| URD-REQ-012 | 网页案例与教材正文必须共享稳定的案例身份，避免正文链接、网页路径和案例内容在修订中失配。 | must | 具体采用何种 ID 由 ADD 决定。 |

## Out of Scope

| ID | Item | Reason |
| --- | --- | --- |
| URD-OOS-001 | 第一个版本一次性覆盖十六篇全部互动案例 | 先验证互动学习形式，避免在未经验证的交互模型上扩写大量内容。 |
| URD-OOS-002 | 用户账号、登录、云端进度同步 | 项目所有者已确认 MVP 暂不需要。 |
| URD-OOS-003 | 教师后台、班级管理、成绩册 | 项目所有者已确认 MVP 暂不需要。 |
| URD-OOS-004 | 在线支付、商业化功能 | 与当前学习原型无关。 |
| URD-OOS-005 | 运行时由生成式 AI 即时生成教学内容 | 项目所有者已确认 MVP 暂不做动态 AI 出题。 |
| URD-OOS-006 | 把整本教材内容复制到互动站点 | 互动任务进入教材正文；网页只承担需要运行时才能成立的分支、状态和即时反馈。 |

## Acceptance Criteria

| ID | Related Requirement | Statement | Oracle |
| --- | --- | --- | --- |
| URD-AC-001 | URD-REQ-001 | 从项目的 GitHub Pages 地址进入后，学习者可以开始互动案例，无需安装桌面软件。 | 在桌面浏览器和至少一种手机浏览器手工完成一次端到端流程。 |
| URD-AC-002 | URD-REQ-002 | 《界体》“教学楼用水增加 18%”案例可以从开场走到结尾复盘，且存在两个以上会产生不同后续内容的选择点。 | 走两条不同路径，确认后续文本/选择/状态不同且均能完成。 |
| URD-AC-003 | URD-REQ-003 | 开场与第一次关键选择前不出现“本题请使用《界体》”之类标签。 | 内容审查。 |
| URD-AC-004 | URD-REQ-004 / URD-REQ-005 | 至少一个典型错误路径通过后果或新证据引导学习者修正判断，而不是立即只显示“错误”。 | 脚本审查 + 手工走错路径。 |
| URD-AC-005 | URD-REQ-006 | 系统能依据先前至少一个选择改变后续反馈或复盘。 | 用两组选择完成案例，比较结尾反馈。 |
| URD-AC-006 | URD-REQ-007 | 结尾复盘能指出至少一个“你刚才实际做的是……”并映射到教材方法名。 | 内容审查。 |
| URD-AC-007 | URD-REQ-009 | 每个实现切片有可追踪的需求、测试与 Git checkpoint。 | TRACE / RMD / PR 历史审查。 |
| URD-AC-008 | URD-REQ-010 | 若案例发生跨领域迁移，至少能表达“可迁移关系”和“停止类比的条件”。 | 对含 Transfer / Stop 的后续案例做内容审查；首个《界体》原型可暂不触发。 |
| URD-AC-009 | URD-REQ-011 | 《界体》正文草稿中存在可直接排版的互动块：开场情境、第一次动作要求、网页入口说明、无网页时的最小替代练习。 | 审查教材插入稿；该块不得只存在于 README、附录或网站首页。 |
| URD-AC-010 | URD-REQ-012 | 教材插入稿与网页案例引用同一个稳定 case ID / 路径，修订案例时无需人工在多个位置猜测对应关系。 | 检查案例元数据、正文插入稿和网页路由的一致性。 |

## Constraints

| ID | Type | Constraint | Impact |
| --- | --- | --- | --- |
| URD-CON-001 | platform | 公开发布目标为 GitHub Pages。 | 首个版本优先采用可静态托管的前端结构。 |
| URD-CON-002 | cost | 首个原型尽量不依赖付费后端或必须常驻的服务器。 | 核心体验应在静态页面中成立。 |
| URD-CON-003 | content | 互动练习必须服从《造物之理 / 墨经补完》现有方法边界，不得为了游戏性改写方法含义。 | 教材内容是教学设计的来源约束。 |
| URD-CON-004 | learning | 重点是 practice、feedback、retrieval、transfer，而不是增加更多知识点。 | 功能优先服务“做判断”的次数与质量。 |
| URD-CON-005 | maintainability | 内容与渲染层应能独立修改，案例应能逐步增加。 | 设计阶段需降低故事内容与 UI 的耦合。 |
| URD-CON-006 | git | 仓库采用小步分支、测试、PR、checkpoint 流程。 | 不直接在 main 上堆叠未审阅功能。 |
| URD-CON-007 | publishing | 纸书、Word/PDF、EPUB 与网页的能力不同。 | 正文必须保留可读的练习入口与最小替代任务；分支运行时由网页承载。 |

## Assumptions

| ID | Assumption | Why acceptable now | Review trigger |
| --- | --- | --- | --- |
| URD-ASM-001 | 第一版以中文为唯一内容语言。 | 当前教材与讨论均以中文为主；不影响验证核心交互。 | 决定公开多语言发布时。 |
| URD-ASM-002 | 第一个原型使用《界体》“教学楼用水增加 18%”材料。 | 项目所有者已于 2026-09-23 确认。 | 若后续明确改案例。 |
| URD-ASM-003 | 首个原型无需账号，且暂不要求跨刷新 / 跨设备保存进度。 | 项目所有者已确认 MVP 暂不做账号；会话内状态足以验证核心机制。 | 需要跨设备同步、课堂统计或账号系统时。 |
| URD-ASM-004 | 可运行分支由网页承载，但互动任务的教学位置、开场与第一次动作必须进入对应教材正文。 | 项目所有者明确要求“需要放入教材正文”。 | 若以后形成原生交互 EPUB 或完整在线教材。 |

## Open Questions

| ID | Question | Blocks? | Owner | Resolution |
| --- | --- | --- | --- | --- |
| URD-Q-001 | 第一阶段验证成功后，下一批优先扩展“察物”五章，还是优先做一个跨四部的混合案例？ | no | user | prototype review 后决定 |
| URD-Q-002 | 后续是否需要教师可导出的学习记录？ | no | user | deferred; see PARKING_LOT |
| URD-Q-003 | 教材正文中的网页入口最终采用二维码、短链接，还是二者并存？ | no | publishing | 先用稳定 URL 占位；出版阶段决定排版形式 |

## URD Completion Gate

- [x] Target user or role is known.
- [x] Core task is known.
- [x] At least one measurable success criterion exists.
- [x] Scope and non-scope are separated.
- [x] Main constraints are recorded.
- [x] Assumptions and open questions are separated from confirmed requirements.
- [x] Content not needed for current version moved to `PARKING_LOT.md`.
- [x] Project owner accepted the Idea Brief checkpoint with one correction: interactive tasks must be placed in textbook body.

## Checkpoint Record

2026-09-23，项目所有者确认：

1. 首个原型使用《界体》“教学楼用水增加 18%”；
2. 互动练习需要进入教材正文；
3. MVP 暂不做账号、教师后台、动态 AI 出题；
4. 首轮成功标准聚焦“无标签判断、分支后果、方法切换、结尾复盘”。

URD-0001 因此进入 **accepted**，允许开始 ADD Design Split。
