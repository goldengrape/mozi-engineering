# TRACE — Project Map / Traceability

> Human-readable trace index. Machine-readable copy lives in `.vibe/trace.json`.

## Current Trace

| Source ID | Relation | Target ID / Path | Notes |
| --- | --- | --- | --- |
| URD-GOAL-001 | described_in | docs/URD.md | 互动教材总体学习目标 |
| URD-GOAL-002 | described_in | docs/URD.md | 首个原型验证目标 |
| URD-REQ-001..010 | specified_in | docs/URD.md | 当前需求事实来源 |
| URD-AC-001..008 | specified_in | docs/URD.md | 当前验收标准 |
| URD-0001 | gates | ADD-0001 | 用户确认后才进入 Design Split |
| ADD-0001 | gates | MDD-0001 | 模块设计不得先于功能拆分 |
| MDD-0001 | informs | TDD-0001 | 公共接口需有测试契约 |
| TDD-0001 | gates | RMD-0001 | 无测试 oracle 不开始实现 |

## Trace Update Rule

当 URD、ADD、MDD、TDD、RMD 或 OKF 变化时，在同一变更集更新本文件和 `.vibe/trace.json`。
