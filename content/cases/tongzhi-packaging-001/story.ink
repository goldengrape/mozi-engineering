// RMD-TASK-010 / Chapter 14
// Source facts are limited to the current textbook 《通滞》 worked example.

VAR first_throughput = 0
VAR expected_packaging_gain = false
VAR second_throughput = 0
VAR recognized_moving_bottleneck = false
VAR debrief_reached = false
VAR case_complete = false

某流程四段有效能力分别为：
12、15、8、20 件/小时。

稳定情况下，整条流程的最大长期完成率先受哪一个数限制？
请输入整体完成率。

# ui:type=number
# ui:bind=first_throughput
# ui:min=0
# ui:max=50
# ui:step=1
# ui:unit=件/小时
# ui:submit=提交完成率
* [继续]
    {first_throughput == 8:
        第三段的 8 件/小时限制了整条流程。
    }
    {first_throughput != 8:
        串联必要段的长期完成率先受最小有效能力限制，这里是第三段 8 件/小时。
    }
    -> packaging

=== packaging ===

如果把第四段包装从 20 提到 40 件/小时，整体完成率会怎样？

* [明显提高，因为包装能力翻了一倍。]
    ~ expected_packaging_gain = true
    第四段本来就不是当前限制段。
    把它提到 40，整体仍先受第三段 8 件/小时限制。
    -> wip

* [仍约为 8 件/小时，因为第三段没有变化。]
    -> wip

=== wip ===

如果上游继续按 15 件/小时生产，而限制段仍只能处理 8 件/小时，最直接的结果是什么？

* [成品同步增加到 15 件/小时。]
    非限制段多做出来的量不能穿过 8 件/小时的限制，只会更多地进入等待和在制品。
    -> improve_constraint

* [在制品和等待增加，整体交付仍受 8 件/小时限制。]
    -> improve_constraint

=== improve_constraint ===

现在把第三段从 8 提高到 14 件/小时。
新的整体长期完成率上限是多少？

# ui:type=number
# ui:bind=second_throughput
# ui:min=0
# ui:max=50
# ui:step=1
# ui:unit=件/小时
# ui:submit=提交新完成率
* [继续]
    {second_throughput == 12:
        新的最小能力变成第一段 12 件/小时。
        -> moving_constraint
    }

    新能力是 12、15、14、20。
    所以限制已经转到第一段 12 件/小时。
    -> moving_constraint

=== moving_constraint ===

第三段已经从 8 提到 14。接下来还应永久把第三段叫作“瓶颈”并继续优先优化吗？

* [应该。既然它曾经是瓶颈，就应该一直优先优化。]
    改善以后限制已经移动。此时继续只优化第三段，整体收益会迅速下降。
    -> moving_retry

* [不应该。改善以后要重新测整体完成量，再识别新的限制段。]
    ~ recognized_moving_bottleneck = true
    -> debrief

=== moving_retry ===

* [重新识别限制段，而不是保留旧标签。]
    ~ recognized_moving_bottleneck = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{expected_packaging_gain:
你一开始把“局部能力翻倍”当成“整体一定变快”。这条路径暴露了局部速度与整体完成量之间的差别。
}

你刚才做的核心动作，在本书中叫作《通滞》：
量各段有效能力，找当前限制整体输出的段，优先改善，再用整体完成量复验，并重新识别移动后的限制。

原始能力 12、15、8、20 时，整体先受 8 限制；
第三段提高到 14 后，新的限制转到第一段 12。

-> finish

=== finish ===
~ case_complete = true
-> END
