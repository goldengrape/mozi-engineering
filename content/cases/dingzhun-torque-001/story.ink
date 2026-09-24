// RMD-TASK-007 / Chapter 3
// Source facts are limited to the current textbook 《定准》 worked example.

VAR adjusted_only = false
VAR traced_from = ""
VAR recognized_state_change = false
VAR verified_before_return = false
VAR debrief_reached = false
VAR case_complete = false

某扭矩扳手用于 50 N·m 紧固。
6 月 1 日复查合格；8 月 20 日跌落。
9 月 1 日抽检时，在参考装置上设定 50 N·m，却稳定输出约 52 N·m。

你现在第一步怎么做？

* [把扳手调回 50 N·m，然后继续使用。]
    ~ adjusted_only = true
    调整可以改变当前输出，却没有回答两个问题：
    这把扳手现在是什么状态？过去哪些结果已经受它影响？
    -> set_state

* [先把状态改为“有疑—停用”，再查影响范围。]
    ~ recognized_state_change = true
    -> trace_start

=== set_state ===

* [先停用，把它标为有疑，再追查历史。]
    ~ recognized_state_change = true
    -> trace_start

=== trace_start ===

在没有任何中间见证检查的前提下，哪个追查范围最能守住“最近一次可信状态”？

* [只查 9 月 1 日当天，因为偏差是在当天发现的。]
    ~ traced_from = "sep1"
    发现偏差的时点不等于偏差开始的时点。
    不能假定 9 月 1 日以前都没有问题。
    -> trace_correction

* [只查 8 月 20 日跌落以后的记录。]
    ~ traced_from = "aug20"
    跌落是强烈的事件触发点，所以这之后尤其值得追查。
    但没有中间见证检查时，教材并没有把 8 月 20 日证明成“偏差刚好从这里开始”。
    -> trace_correction

* [从 6 月 1 日最后一次合格以后进入追查，并优先关注 8 月 20 日跌落以后。]
    ~ traced_from = "jun1"
    这保留了最后一次可信时点，同时把跌落后的记录放在更高优先级。
    -> recalibrate

=== trace_correction ===

教材给出的最近一次可信时点是 6 月 1 日。
如果跌落前后有中间见证检查，可以进一步缩小范围；现在没有这条证据。

* [改为从 6 月 1 日以后追查，并优先检查跌落后的记录。]
    ~ traced_from = "jun1"
    -> recalibrate

=== recalibrate ===

扳手重新校准以后，下一步是什么？

* [已经调回 50 N·m，可以立即恢复工作。]
    调整不是恢复可信状态的充分条件。
    -> verify_return

* [再次验证，确认满足判据以后再恢复工作状态。]
    ~ verified_before_return = true
    -> debrief

=== verify_return ===

* [重新验证，再决定是否恢复。]
    ~ verified_before_return = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{adjusted_only:
你一开始把问题当成“把数字调回来”。但参照对象一旦失准，问题不仅是当前值，还包括状态和历史影响范围。
}

你刚才做的核心动作，在本书中叫作《定准》：
把参照看成一个会漂移、会受事件影响、具有“可用 / 有疑 / 停用 / 重新校准”等状态的工程对象。

这道题里，6 月 1 日是最后一次已知合格时点；8 月 20 日跌落是必须触发额外检查的事件；9 月 1 日只是发现约 52 N·m 偏差的时点。

重新校准以后仍要再次验证，才能恢复工作状态。

-> finish

=== finish ===
~ case_complete = true
-> END
