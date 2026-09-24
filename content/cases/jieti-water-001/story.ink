// RMD-TASK-002
// Source facts are limited to the current textbook 《界体》 example
// “18% 的用水增长到底属于谁？”.
// The method-switch boundary follows the current 察物说明: quantity balance
// after the analysis boundary is defined belongs to 《衡算》.
// The interaction changes the order in which evidence is revealed;
// it does not add new measurements or events.

VAR checked_boundary = false
VAR premature_leak_claim = false
VAR revised_after_evidence = false
VAR checked_temporary_records = false
VAR checked_submeter = false
VAR stopped_too_early = false
VAR overexpanded_boundary = false
VAR ignored_boundary_evidence = false
VAR recognized_action_change = false
VAR recognized_switch_to_balance = false
VAR debrief_reached = false
VAR case_complete = false

某教学楼月用水从 1000 m³ 增到 1180 m³。
最初有人直接判断：“楼内漏水 180 m³”。

你现在只有这条信息。第一步做什么？

* [先查主表究竟把哪些用水算在一起。]
    ~ checked_boundary = true
    你先不把 180 m³ 命名成某个原因，而是检查这个数字对应的范围。
    -> main_meter_scope

* [先按“楼内漏水 180 m³”处理。]
    ~ premature_leak_claim = true
    你准备把 180 m³ 全部按楼内漏水处理。
    但在真正开始全面查漏以前，你仍要知道：主表这个数字究竟把哪些用水算在了一起。
    -> main_meter_scope

=== main_meter_scope ===

主表记录的不只是楼内日常使用。
这个边界还把屋顶冷却补水、室外绿化临时接管和施工用水都算进了“建筑使用”。

现在怎样处理这个新信息？

* [把这些跨界用水单独列出来，先查临时接管记录。]
    ~ checked_boundary = true
    {premature_leak_claim:
        ~ revised_after_evidence = true
        你撤回了“180 m³ 全部是楼内漏水”的暂定判断，先把问题重新划界。
    }
    -> temporary_records

* [仍把 180 m³ 全部当作楼内漏水。]
    ~ ignored_boundary_evidence = true
    这样做仍然可以去查漏，但你无法区分：账面增长究竟来自楼内，还是来自刚刚发现的其他用水。
    这个行动还不能回答“180 m³ 到底属于谁”。
    -> reconsider_scope

* [把边界扩大到整个校园，所有用水一起查。]
    ~ overexpanded_boundary = true
    边界扩大并不自动增加解释力。
    当前问题只要求解释这栋楼主表上的增长；把更多无关对象纳入，会让问题更杂。
    -> reconsider_scope

=== reconsider_scope ===

你需要一个足以改变当前判断、但又不过分扩张的边界。

* [回到主表，先把临时接管等跨界用水单独列出。]
    ~ checked_boundary = true
    {premature_leak_claim:
        ~ revised_after_evidence = true
    }
    -> temporary_records

=== temporary_records ===

~ checked_temporary_records = true

临时接管记录显示：
- 室外绿化：70 m³
- 施工用水：50 m³

把这两项从“日常教学使用”的问题中单列以后，尚待解释的增长从 180 m³ 变成 60 m³。

下一步呢？

* [60 m³ 还不能直接命名成原因；继续看分表。]
    -> submeter

* [已经改过一次边界，把剩下 60 m³ 直接当作漏水。]
    ~ stopped_too_early = true
    第一次改界已经改变了结论，这正说明边界会影响归因。
    但“剩下 60 m³”仍只是一个待解释的数字，还不是原因。
    -> after_early_stop

* [到这里停止：只要做过一次改界就够了。]
    ~ stopped_too_early = true
    “做过一次”不是停止条件。
    停止条件是：在相邻而合理的边界之间调整时，原因判断和行动不再因此改变。
    -> after_early_stop

=== after_early_stop ===

* [继续看分表，比较冷却系统与楼内其他用水。]
    -> submeter

=== submeter ===

~ checked_submeter = true

分表显示：
- 冷却补水比基线增加 45 m³；
- 卫生间与实验室合计只增加 15 m³。

此时下一步行动也改变了：
不再是“全面查漏”，而是先查冷却系统的补水与排污控制。

这组信息说明了什么？

* [改界改变了原因判断，也改变了下一步行动。]
    ~ recognized_action_change = true
    -> debrief

* [边界越大越可靠，还应该继续扩大到整个校园。]
    ~ overexpanded_boundary = true
    这里已经出现了足以改变行动的区分。
    继续无目的地扩大边界，只会把更多无关关系带进来；边界只需足以回答当前问题。
    -> debrief

* [只要这些数字能加起来，边界就一定取对了。]
    数量关系可以帮助检查问题，但“数字能对上”本身不能证明分析边界合理。
    这里真正被检验的是：换一个相邻合理的边界，原因判断和行动会不会改变。
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{premature_leak_claim:
你一开始把“增加 180 m³”直接当成了“楼内漏水 180 m³”。后来主表范围的新证据迫使你改写问题。这个修正本身很重要：错误路径不是结束，能否根据新证据重新取界才是训练重点。
}

{not premature_leak_claim:
你没有先给 180 m³ 命名成原因，而是先问“这个数字到底包含什么”。这让后面的证据有了正确的归属位置。
}

{stopped_too_early:
你中途曾想把剩余 60 m³ 直接命名成原因，或把“一次改界”当成停止条件。分表继续改变了行动，说明当合理改界仍会改变判断时，分析还没有结束。
}

{overexpanded_boundary:
你也试过把边界继续向外扩。这个案例提醒：边界不是越大越好；够用而且对当前行动稳定，才是停止的理由。
}

你刚才反复做的核心动作，在本书中叫作《界体》：
先说明当前问题，把一个可用的分析边界画出来，列出重要的跨界关系；如果改变边界会让归因或行动改变，就继续调整，直到相邻合理改界不再改变当前行动。

这个案例里，关键不是把 180、60、45、15 算得多复杂，而是看到：同一张主表，在不同问题边界下，会得到不同的原因判断和下一步措施。

如果接下来要继续追查“冷却系统增加的 45 m³ 在数量上怎样由各项出入构成”，你会先做什么？

* [把冷却系统作为已经明确的对象，核对前后数量与出入是否相合。]
    ~ recognized_switch_to_balance = true
    这时问题已经从“边界取在哪里”转向“数量关系是否相合”。
    在本书中，这就是从《界体》转向《衡算》的条件。
    -> finish

* [继续无目的地扩大边界，直到把整个校园都纳入。]
    这不会自动解释 45 m³ 的数量关系。
    当边界已经足以支持当前行动，下一步应换问题，而不是继续扩大范围。
    -> finish

=== finish ===

~ case_complete = true
-> END
