# mozi-engineering

《造物之理 / 墨经补完》互动教材实验仓库。

本项目把现有教材中的十六种工程方法进一步做成可练习的互动学习体验：学习者先面对没有“题型标签”的现实情境，做出判断，获得新证据或后果，再决定下一步；系统随后帮助学习者识别自己实际调用了哪些方法、何时应该切换方法、哪些类比应该停止。

当前阶段优先验证一个最小互动原型，再决定是否扩展到全书。

## 当前工作方式

本仓库采用 [goldengrape/vibe-coding-skill](https://github.com/goldengrape/vibe-coding-skill) 的文档驱动流程：

- `docs/URD.md`：Idea Brief / 用户意图与范围
- `docs/ADD.md`：Design Split / 功能拆分与耦合检查
- `docs/MDD.md`：Building Blocks / 模块、接口与数据
- `docs/TDD.md`：Check Plan / 验收与测试
- `docs/RMD.md`：Build Path / 实现顺序与 Git 检查点
- `docs/TRACE.md`：Project Map / 需求到测试与任务的追踪

`docs/` 是项目事实来源；`okf/` 仅作为 AI 检索层；`.vibe/` 保存机器可读的项目状态。

## 当前状态

项目尚未进入编码。首先确认 `docs/URD.md` 的目标、范围、成功标准和未决问题，然后再进入架构设计。
