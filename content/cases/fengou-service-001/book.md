---
case_id: fengou-service-001
chapter_id: 08-fengou
placement: worked-example-practice
---

### 互动任务：把一个服务拆成三个，真的更简单了吗？

一个订单系统原来包含下单、库存、计费。团队计划拆成三个微服务。

**先别问“能不能拆”。每增加一道分界，会新增哪些接口责任？拆分收益是否值得这些代价？**

<!-- interactive-entry: fengou-service-001 -->

**网页版互动练习：** https://goldengrape.github.io/mozi-engineering/cases/fengou-service-001/

**如果现在不能打开网页：**

1. 列出拆成三个服务后新增的接口责任；
2. 比较方案 A 的 3 组双向协作关系和方案 B 的稳定事件接口；
3. 再考虑一种边界条件：两个功能必须共享同一事务或同一高速内存状态时，是否仍应强行拆开。

> 来源约束：下单/库存/计费、七类接口责任、方案 A/B，以及同一事务/高速内存状态的边界条件均来自现行教材《分构》完整例题。
