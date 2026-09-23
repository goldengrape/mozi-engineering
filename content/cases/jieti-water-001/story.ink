VAR checked_boundary = false
VAR premature_leak_claim = false
VAR revised_after_evidence = false
VAR debrief_reached = false
VAR case_complete = false

某教学楼月用水从 1000 m³ 增到 1180 m³。
最初有人直接判断：“楼内漏水 180 m³”。

你现在只有这条信息。第一步做什么？

* [先查主表究竟把哪些用水算在一起。]
    ~ checked_boundary = true
    你暂时不把 180 m³ 命名成某个原因。
    -> prototype_end

* [先按“楼内漏水 180 m³”处理。]
    ~ premature_leak_claim = true
    你先把账面增长当成了原因。
    -> prototype_end

=== prototype_end ===

这是 RMD-TASK-001 的可编译骨架。
完整的新证据、修正路径和结尾复盘将在 RMD-TASK-002 中编写。

~ debrief_reached = true
~ case_complete = true
-> END
