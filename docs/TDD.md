# TDD — Test-Driven Document

> Check Plan / 先写清楚“什么证据算通过”，再写实现。自动测试验证结构与可重复行为；人工检查验证阅读体验和教材位置。它们都不能单独证明长期学习效果。

## Metadata

- document_id: TDD-0001
- status: ready-for-build-path
- source_docs: URD-0001, ADD-0001, MDD-0001
- last_updated: 2026-09-23

## Test Strategy

MVP 使用三层验证：

1. **contract tests**：案例身份、manifest、book.md、编译和 build output；
2. **story behavior tests**：从 Ink runtime 真实走分支，检查状态与复盘；
3. **manual smoke/content review**：手机/桌面、键盘、GitHub Pages 路径、教材正文块。

不把“自动测试通过”误写成“已经证明学习效果更好”。首轮只验证设计机制按预期工作。

## Acceptance Tests

| ID | Source AC | Scenario | Given | When | Then | Oracle |
| --- | --- | --- | --- | --- | --- | --- |
| TDD-TEST-001 | URD-AC-009, URD-AC-010 | 教材正文块与案例身份一致 | 案例目录、manifest、book.md | 读取案例包 | 三处 case ID 一致；book.md 具有 chapter/placement；正文含开场、第一次动作、互动入口占位、离线最小练习 | 自动 contract test 全部断言通过 |
| TDD-TEST-002 | URD-AC-003 | 第一次判断不泄题 | 编译后的首个案例 | 从故事开始读到第一次 choice | 标题、输出和 choice prompt 不出现“本题请使用《界体》”或把方法名当题型标签 | story test + content review |
| TDD-TEST-003 | URD-AC-002 | 真分支存在 | 同一个新故事状态 | 分别走两条不同首要选择路径 | 至少一处后续文本、choice 集或 Ink 状态不同；两条路径最终都可继续到复盘 | story test 走两条路径并比较 |
| TDD-TEST-004 | URD-AC-004 | 错误路径产生可修正后果 | 选择一个“过早把增加用水认定为漏水”的路径 | 系统给出后续证据后继续 | 不只显示“错”；学习者仍有机会重新检查问题范围并改变判断 | story test + 脚本审查 |
| TDD-TEST-005 | URD-AC-005 | 先前行动改变反馈 | 两条具有不同学习状态的完成路径 | 到达 debrief | 至少一段复盘文字因前面状态不同而不同 | story test 比较 debrief output |
| TDD-TEST-006 | URD-AC-006 | 方法名在复盘时挂回动作 | 完成案例 | 进入 debrief | 复盘明确说明某个已做动作对应《界体》，而不是在开场泄题 | story test 搜索 debrief + 人工审查 |
| TDD-TEST-007 | URD-AC-001 | 静态站可运行 | build 完成 | 在本地静态 server 打开案例 route | 无服务端 API 也能完成故事 | manual/local smoke |
| TDD-TEST-008 | URD-AC-007 | 文档到实现可追踪 | 完成一个 RMD slice | 审查 commit/TRACE | requirement → FR/DP → module/API → test → RMD task 有链接 | TRACE review |
| TDD-TEST-009 | URD-REQ-008 | 新增案例不改播放器 | 增加第二个最小 fixture case | 运行 build/tests | 新 route 自动出现；`src/player.js` 无需修改 | build-output test / git diff review |
| TDD-TEST-010 | URD-CON-007 | 正文即使无网页也不空洞 | 只阅读 book.md | 不打开链接 | 学习者仍能完成第一次判断和最小替代练习 | content review |

## Contract Tests

| ID | Interface | Contract Checked | Valid Case | Invalid Case | Oracle |
| --- | --- | --- | --- | --- | --- |
| TDD-TEST-011 | MDD-API-001 loadCasePackage | case_id / folder / book frontmatter 一致 | `jieti-water-001` 全部一致 | 改一个 fixture 的 case_id | valid passes; invalid throws named validation error |
| TDD-TEST-012 | MDD-API-001 loadCasePackage | required files | manifest/book/story 都存在 | 缺 story.ink | invalid build fails before compile |
| TDD-TEST-013 | MDD-API-002 compileStory | Ink 可编译并实例化 | valid story.ink | syntax-broken fixture | valid returns JSON and Story starts; invalid reports compiler failure |
| TDD-TEST-014 | MDD-API-003 buildSite | static output contract | one valid case | duplicate case IDs | valid creates one route/index entry; duplicate ID aborts |
| TDD-TEST-015 | MDD-API-004 bootPlayer | case-agnostic runtime | generic compiled fixture | fetch failure | valid shows story/choices; failure shows readable error |

## Negative / Boundary Tests

| ID | Related Requirement or Interface | Case | Expected Failure |
| --- | --- | --- | --- |
| TDD-TEST-016 | MDD-API-001 | folder name differs from manifest case_id | build stops with identity mismatch |
| TDD-TEST-017 | URD-REQ-003 | manifest title or first output contains explicit method label | content test fails |
| TDD-TEST-018 | URD-REQ-004 | every choice reconverges immediately with no changed state/content | branch-divergence test fails |
| TDD-TEST-019 | URD-REQ-007 | story can end with `debrief_reached == false` | completion test fails |
| TDD-TEST-020 | ADD-DP-003 | `src/player.js` contains `jieti-water-001` or《界体》专用逻辑 | generic-player test fails |
| TDD-TEST-021 | MDD-API-003 | generated HTML requires a remote CDN script to run | offline/static-dependency check fails |

## Story Path Fixtures

为避免“只测试 happy path”，首个案例至少固定两条自动路径。具体 choice 文案可调整，但语义动作保持：

### PATH-A — 先检查问题范围

```text
observe increase
→ ask what is included in the meter / current boundary
→ discover cooling tower + irrigation + temporary construction share the main meter
→ refine boundary
→ debrief
```

Expected learning state:

```text
checked_boundary = true
premature_leak_claim = false
debrief_reached = true
case_complete = true
```

### PATH-B — 先认定漏水，随后修正

```text
observe increase
→ claim/act as if leak is the cause
→ receive evidence that several legitimate uses share the meter
→ reconsider what belongs to the current problem
→ revise boundary
→ debrief
```

Expected learning state:

```text
premature_leak_claim = true
revised_after_evidence = true
checked_boundary = true
debrief_reached = true
case_complete = true
```

PATH-B 的目的不是惩罚“答错”，而是验证 learner 能经历 **判断 → 新证据 → 修正**。

## Browser / Accessibility Smoke

人工验收至少覆盖：

- desktop Chromium-family browser；
- one mobile browser or device emulation；
- keyboard-only choice selection；
- visible focus；
- 320–390 CSS px 宽度下无横向滚动导致的主要内容丢失；
- reduced-motion preference 下没有依赖动画才能理解的信息；
- restart 能回到全新 story state。

首个 MVP 不承诺完整 WCAG 合规审计；发现可访问性阻塞问题必须在发布前修正。

## Textbook Integration Review

`book.md` 通过以下人工检查才可用于正文：

1. 放在《界体》方法名和正式讲解之前仍然读得通；
2. 学习者第一次要做的是判断/行动，不是回忆术语；
3. 网页入口被拿掉后，纸书读者仍能做一个最小版本；
4. 互动版完成后返回正文时，正文能自然揭示“刚才这个动作叫界体”；
5. 不把 QR code 或 URL 当成唯一教学内容。

## Commands

计划中的统一命令：

```bash
npm test
npm run build
npm run check
```

约定：

```text
npm test      = node --test tests/*.test.cjs
npm run build = node scripts/build.cjs
npm run check = npm test && npm run build
```

如果命令尚未实现，不得声称测试已通过。

## TDD Completion Gate

- [x] Every acceptance criterion maps to a test or explicit deferral.
- [x] Public interfaces have contract tests.
- [x] Invalid inputs and key boundary conditions are covered.
- [x] Every automated test has a concrete oracle.
- [x] Human content/accessibility checks are separated from automated checks.
- [x] Long-term learning-effect claims are not inferred from software test success.
