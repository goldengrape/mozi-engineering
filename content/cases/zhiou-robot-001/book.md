---
case_id: zhiou-robot-001
chapter_id: 07-zhiou
placement: worked-example-practice
---

### 互动任务：一个参数为什么要改四个模块？

仓储机器人有五个功能：L 定位、N 导航、O 避障、T 任务调度、P 电源管理。旧设计把“定位更新频率”直接写进 N、O、T、P 四处。

**如果 L 的定义改变，哪些牵连真的有功能理由，哪些只是旧方案留下的依赖？**

<!-- interactive-entry: zhiou-robot-001 -->

**网页版互动练习：** https://goldengrape.github.io/mozi-engineering/cases/zhiou-robot-001/

**如果现在不能打开网页：**

1. 写出 L→N、L→O、L→T、L→P 四条改变传播边；
2. 对每一条问：“去掉它以后，整体功能还能否成立？”；
3. 圈出必须保留的边，划掉无益边；
4. 说明为什么“能排成下三角”还不足以证明设计良好。

> 来源约束：L/N/O/T/P 五项功能、四条原始传播边、L→T 与 L→P 的裁决，以及位置+时间戳和功率请求接口均来自现行教材《制耦》完整例题。
