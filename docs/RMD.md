# RMD — Route / Runbook / Execution Map Document

> Build Path / 实现顺序、停止条件、回退点和 Git checkpoint。

## Metadata

- document_id: RMD-0001
- status: blocked — awaiting URD / ADD / MDD / TDD
- source_docs: URD-0001
- last_updated: 2026-09-23

## Current Stop Conditions

| ID | Condition | Action |
| --- | --- | --- |
| RMD-STOP-001 | URD-0001 尚未得到项目所有者确认 | 回到 URD checkpoint，不开始功能实现 |
| RMD-STOP-002 | 尚未定义测试 oracle | 回到 TDD |
| RMD-STOP-003 | 首次实现 push / merge 前 | 显示 branch、测试结果与目标操作，取得明确许可 |

## Planned Git Discipline

后续每个小实现切片使用独立分支，更新相关文档与 TRACE，运行测试，形成 commit / PR 检查点。默认不在 main 上直接堆叠功能实现。
