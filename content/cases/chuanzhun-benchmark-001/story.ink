// RMD-TASK-007 / Chapter 4
// Source facts are limited to the current textbook 《传准》 worked example.

VAR affected_nodes = ""
VAR revised_impact = false
VAR recognized_records_value = false
VAR debrief_reached = false
VAR case_complete = false

工程测量以 A 为上级依据。
A 校到 B，B 再校到 C、D，C 又用于 E。
后来发现 B 在施工中被碰动，高程偏移 +3 mm。

请选择现在应进入重测/复查集合的节点。

=== choose_impact ===

# ui:type=multi
# ui:bind=affected_nodes
# ui:option=A::A
# ui:option=C::C
# ui:option=D::D
# ui:option=E::E
# ui:min=1
# ui:max=4
# ui:submit=提交影响集合
* [继续]
    {affected_nodes == "C,D,E":
        你沿 B 的下游支链找到了 C、D、E。
        -> records
    }
    ~ revised_impact = true
    这个集合还不是最小影响集。
    B 直接影响 C、D，E 又由 C 继续派生；A 没有从 B 接受依据。
    -> choose_impact

=== records ===

如果每次传递只留下“最终数字”，不记录“来自谁、何时、当时状态”，会怎样？

* [仍能只重测 C、D、E，因为最终数字已经足够。]
    最终数字不能告诉你它从哪条支链来。
    没有来源记录，就只能扩大排查范围。
    -> records_retry

* [无法精确沿支链追查，只能扩大排查。]
    ~ recognized_records_value = true
    -> debrief

=== records_retry ===

* [承认需要来源、时间和状态记录，才能缩小影响集。]
    ~ recognized_records_value = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{revised_impact:
你第一次选的集合过大或过小，后来按实际比较关系重新追了一遍支链。
}

你刚才做的核心动作，在本书中叫作《传准》：
可信关系不是“同型号”或“同一个数字”，而是一次次实际比较建立出来的来源链。

B 失效以后，最小影响集是 {C,D,E}。
A 没有从 B 接受依据，所以不在本次追查集合中。

记录“来自谁、何时、当时状态”，正是为了在上游失效时只重建受影响的分支，而不是把整个系统全部作废。

-> finish

=== finish ===
~ case_complete = true
-> END
