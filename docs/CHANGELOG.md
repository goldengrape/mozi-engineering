# CHANGELOG — Project Docs

| Date | Changed By | Files | Summary | Trace Impact |
| --- | --- | --- | --- | --- |
| 2026-09-23 | ChatGPT | package.json, package-lock.json, .gitignore, content/cases/jieti-water-001/*, scripts/*, tests/*, .github/workflows/task1-checks.yml | 完成 RMD-TASK-001：固定案例契约、正文块、Ink 可编译骨架、契约/编译测试；GitHub Actions 3/3 通过，PR #3 等待 merge checkpoint。 | RMD-GIT-001 checkpoint-ready；RMD-TASK-002 仍被 merge gate 阻塞 |
| 2026-09-23 | ChatGPT | docs/ADD.md, docs/MDD.md, okf/decisions/ink-static-architecture.md | CI 暴露旧 `inkle/inkjs` 2.1.0 来源与当前 npm API 不一致；改用当前维护的 `y-lohse/inkjs` 并固定 2.4.0。 | 技术来源修正，不改变 ADD 功能边界 |
| 2026-09-23 | project owner + ChatGPT | docs/RMD.md, .vibe/doc_state.json | 项目所有者通过 Build Path checkpoint；RMD-0001 标为 accepted，授权开始 RMD-TASK-001。 | implementation_allowed=true；active_task=RMD-TASK-001 |
| 2026-09-23 | ChatGPT | okf/requirements/textbook-interaction.md, okf/decisions/ink-static-architecture.md, okf/paths/mvp-build-path.md, okf/index.md, docs/TRACE.md, .vibe/trace.json | 在不增加新需求的前提下，把正文集成、Ink 静态架构和 MVP Build Path 编译成 3 个短 OKF 检索页。 | 增加 accepted docs → OKF concept 的 summarized_by 链接 |
| 2026-09-23 | project owner + ChatGPT | docs/ADD.md, docs/MDD.md, docs/TDD.md, docs/RMD.md, docs/TRACE.md, .vibe/*, okf/index.md | 项目所有者通过 ADD checkpoint；冻结最小静态 Web + Ink/inkjs 架构；定义案例包、builder、generic player、Pages 模块与接口；建立自动/人工测试 oracle；形成 5 个 RMD 任务并停在 Build Path checkpoint。 | 增加 DP → MDD → TDD → RMD 全链路；implementation_allowed 仍为 false |
| 2026-09-23 | project owner + ChatGPT | docs/URD.md, docs/ADD.md, docs/MDD.md, docs/TDD.md, docs/RMD.md, docs/TRACE.md, .vibe/*, okf/index.md | 项目所有者通过 URD checkpoint，并要求互动任务进入教材正文；新增 URD-REQ-011/012；完成 ADD Design Split、三轮耦合重构，分类为 decoupled；按流程停在 ADD checkpoint。 | 建立 URD requirements → ADD FR/DP 追踪；实现仍被阻塞 |
| 2026-09-23 | ChatGPT + project owner request | README.md, docs/*, .vibe/*, okf/index.md | 按 Vibe Coding Skill 建立标准项目文档骨架；完成 URD-0001 草案并停在 Idea Brief checkpoint。 | 建立 URD → ADD → MDD/TDD → RMD 的阶段门 |
