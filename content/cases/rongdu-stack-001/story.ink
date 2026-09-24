// RMD-TASK-009 / Chapter 10
// Source facts are limited to the current textbook 《容度》 worked example.

VAR worst_deviation = 0
VAR trusted_piecewise_pass = false
VAR recognized_function_window = false
VAR recognized_design_tradeoff = false
VAR debrief_reached = false
VAR case_complete = false

三个串联尺寸为：
A = 20±0.1 mm
B = 30±0.2 mm
C = 50±0.1 mm

名义总长是 100 mm。

按最坏情况叠加，总长相对 100 mm 的最大绝对偏差是多少？

# ui:type=number
# ui:bind=worst_deviation
# ui:min=0
# ui:max=2
# ui:step=0.05
# ui:unit=mm
# ui:submit=提交最坏偏差
* [继续]
    {worst_deviation == 0.4:
        三项局部偏差最坏同向累积，总差是 ±0.4 mm。
    }
    {worst_deviation != 0.4:
        最坏情况把三个局部偏差的绝对值相加：0.1+0.2+0.1=0.4 mm。
    }
    -> compare_window

=== compare_window ===

所以总长最坏范围是 99.6—100.4 mm。
功能窗口要求 99.7—100.3 mm。

三个零件都各自在自己的公差内，能否据此保证总成合格？

* [能。单件都合格，总成自然合格。]
    ~ trusted_piecewise_pass = true
    单件合规不能替代偏差传播分析。
    这里最坏组合已经越过功能窗口。
    -> remedy

* [不能。还要检查偏差怎样累积到关键功能量。]
    ~ recognized_function_window = true
    -> remedy

=== remedy ===

教材给出两类修改：

一种是把局部容差重新分配为 ±0.05、±0.10、±0.05 mm，使最坏总差降到 ±0.20 mm；
另一种是改变结构、增加可调垫片，让功能不再直接承担全部尺寸链。

应该机械地把所有公差一起收紧吗？

* [应该。公差越紧越好，不必再看别的条件。]
    教材明确提醒：先改哪一种要看制造能力、成本和失效后果。
    -> remedy_retry

* [不应该。要比较制造能力、成本和失效后果，再选局部容差或结构调整。]
    ~ recognized_design_tradeoff = true
    -> debrief

=== remedy_retry ===

* [把功能窗口放在前面，再比较容差重分配与结构调整。]
    ~ recognized_design_tradeoff = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{trusted_piecewise_pass:
你一开始把“单件合格”当成“系统合格”，后来通过尺寸链看到了最坏组合。
}

你刚才做的核心动作，在本书中叫作《容度》：
先写功能窗口，再分析局部差异怎样传播和累积，最后分配允许差异或改变结构。

这里三个零件都可以单独合格，但 ±0.4 mm 的最坏总差会把 100 mm 总长推到 99.6—100.4 mm，超出 99.7—100.3 mm 的功能窗口。

-> finish

=== finish ===
~ case_complete = true
-> END
