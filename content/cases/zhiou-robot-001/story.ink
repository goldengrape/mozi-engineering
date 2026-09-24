// RMD-TASK-008 / Chapter 7
// Source facts are limited to the current textbook 《制耦》 worked example.

VAR removable_edges = ""
VAR revised_edges = false
VAR recognized_order_not_reason = false
VAR debrief_reached = false
VAR case_complete = false

仓储机器人有五个功能：
L 定位、N 导航、O 避障、T 任务调度、P 电源管理。

旧设计把“定位更新频率”直接写进 N、O、T、P 四处。
因此 L 的定义改变会传播到四项功能：
L→N、L→O、L→T、L→P。

逐边审查以后，你认为哪些边可以删除而不损害整体功能？

-> edge_review

=== edge_review ===

# ui:type=multi
# ui:bind=removable_edges
# ui:option=LN::L→N
# ui:option=LO::L→O
# ui:option=LT::L→T
# ui:option=LP::L→P
# ui:min=1
# ui:max=4
# ui:submit=提交可删除边
+ [继续]
    {removable_edges == "LT,LP":
        你保留了 N、O 对定位时序的需要，并删除了 T、P 对定位频率的直接依赖。
        -> redesign
    }

    ~ revised_edges = true
    逐边看功能理由：

    N、O 确实需要定位时序；
    T 只需要“位置是否达到任务点”的稳定接口；
    P 只需要标准化的功率请求。

    所以教材判定 L→T 与 L→P 属于无益耦合。
    -> edge_review

=== redesign ===

改成“定位服务输出位置+时间戳”“运动层输出功率请求”以后，
L 改定位频率只需要影响 N、O，T、P 不再修改。

如果改变传播矩阵已经能排成漂亮的下三角，能否仅凭这一点证明设计已经良好？

* [能。只要传播可以排序，依赖结构就是合理的。]
    排序只说明传播能按某个方向排列。
    它不回答每一条边为什么必须存在。
    -> ordering_retry

* [不能。可排序只描述结构，每条依赖仍要检查功能理由。]
    ~ recognized_order_not_reason = true
    -> debrief

=== ordering_retry ===

* [把“能否排序”和“这条牵连是否必要”分开判断。]
    ~ recognized_order_not_reason = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{revised_edges:
你第一次删除的边过多或过少，后来回到逐边功能理由重新裁决。
}

你刚才做的核心动作，在本书中叫作《制耦》：
先把改变传播画出来，再逐条问“去掉以后整体功能还能否成立”。

这道题的改进不来自把矩阵排漂亮，而来自删除 L→T、L→P 两条没有功能理由的依赖，同时保留 N、O 所需的定位时序关系。

-> finish

=== finish ===
~ case_complete = true
-> END
