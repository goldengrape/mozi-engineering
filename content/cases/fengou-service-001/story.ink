// RMD-TASK-008 / Chapter 8
// Source facts are limited to the current textbook 《分构》 worked example.

VAR interface_duties = ""
VAR revised_interfaces = false
VAR chose_localized_boundary = false
VAR recognized_forced_split_cost = false
VAR debrief_reached = false
VAR case_complete = false

一个订单系统原来包含下单、库存、计费。
团队计划拆成三个微服务。

拆分会带来局部部署和责任清晰。
但每一道分界也会生出新的接口责任。

从下面九项中，选出教材明确列出的七类接口责任。

-> interface_review

=== interface_review ===

# ui:type=multi
# ui:bind=interface_duties
# ui:option=format::数据格式
# ui:option=version::版本
# ui:option=timeout::超时
# ui:option=idempotency::幂等
# ui:option=auth::鉴权
# ui:option=retry::重试
# ui:option=consistency::一致性
# ui:option=local_deploy::局部部署
# ui:option=clear_responsibility::责任清晰
# ui:min=7
# ui:max=7
# ui:submit=提交接口责任
+ [继续]
    {interface_duties == "format,version,timeout,idempotency,auth,retry,consistency":
        你把“拆分的收益”和“分界新增的责任”分开了。
        -> compare_schemes
    }

    ~ revised_interfaces = true
    局部部署和责任清晰是拆分可能带来的收益，不是接口责任。

    教材列出的接口责任是：
    数据格式、版本、超时、幂等、鉴权、重试和一致性。
    -> interface_review

=== compare_schemes ===

方案 A：三个服务完全独立，共产生 3 组双向协作关系。

方案 B：订单服务只通过稳定事件接口通知库存和计费，库存与计费彼此不直接依赖。

在教材给出的这两个方案中，哪一个让接口数量更少、变化传播更局部？

* [方案 A，因为服务彼此完全独立，拆得更彻底。]
    “拆得更多”不自动等于接口更少。
    A 产生 3 组双向协作关系。
    -> scheme_retry

* [方案 B，因为稳定事件接口减少了直接协作关系。]
    ~ chose_localized_boundary = true
    -> forced_split

=== scheme_retry ===

* [重新比较新增接口数量和变化传播范围，选择方案 B。]
    ~ chose_localized_boundary = true
    -> forced_split

=== forced_split ===

现在加入教材给出的边界条件：
如果某一功能每天都必须与另一个功能共享同一事务、同一高速内存状态，还应为了“模块化”强行拆开吗？

* [应当。模块越多越现代，远程接口只是实现细节。]
    这种拆分可能把原本内部的紧密关系变成脆弱的远程接口。
    分界本身并不免费。
    -> forced_split_retry

* [不一定。此时接口成本可能超过局部化收益，应重新判断宜分还是宜合。]
    ~ recognized_forced_split_cost = true
    -> debrief

=== forced_split_retry ===

* [把局部化收益和新增接口负担一起比较。]
    ~ recognized_forced_split_cost = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{revised_interfaces:
你第一次把“拆分收益”和“接口责任”混在一起，后来把两边分开列了。
}

你刚才做的核心动作，在本书中叫作《分构》：
从已经确定的功能和关系出发，提出候选分界，并同时计算局部化收益与新增接口责任。

这道题中，方案 B 的接口数量更少、变化传播更局部；
但如果两个功能必须共享同一事务或同一高速内存状态，强行拆分可能反而把内部调用变成脆弱的远程接口。

“可拆”不等于“值得拆”。

-> finish

=== finish ===
~ case_complete = true
-> END
