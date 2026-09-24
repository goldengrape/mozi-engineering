// RMD-TASK-009 / Chapter 11
// Source facts are limited to the current textbook 《相衡》 worked example.

VAR repeated_same_relation = false
VAR surface_component = 0
VAR instrument_bias = 0
VAR recognized_common_bias = false
VAR debrief_reached = false
VAR case_complete = false

第一次读数 r₁ = 18 μm。
设真实表面分量为 s，仪器零偏为 b，因此 r₁=s+b。

下一步怎样获得真正的新信息？

* [保持同一布置再测一次。重复次数更多，两个未知量自然会分开。]
    ~ repeated_same_relation = true
    同一比较关系再测，只会再次得到 s+b 这种混合关系。
    要分开两个未知量，需要改变它们进入读数的方式。
    -> reversal_retry

* [把仪器反转，让表面分量变号而仪器零偏保持同号。]
    -> reversal

=== reversal_retry ===

* [改为反转仪器，让 s 变号而 b 保持同号。]
    -> reversal

=== reversal ===

反转后得到 r₂ = 6 μm，此时 r₂=−s+b。

先求 s。

# ui:type=number
# ui:bind=surface_component
# ui:min=-100
# ui:max=100
# ui:step=1
# ui:unit=μm
# ui:submit=提交 s
* [继续]
    {surface_component == 6:
        由 (r₁−r₂)/2 得 s=6 μm。
    }
    {surface_component != 6:
        s=(18−6)/2=6 μm。
    }
    -> bias

=== bias ===

再求 b。

# ui:type=number
# ui:bind=instrument_bias
# ui:min=-100
# ui:max=100
# ui:step=1
# ui:unit=μm
# ui:submit=提交 b
* [继续]
    {instrument_bias == 12:
        由 (r₁+r₂)/2 得 b=12 μm。
    }
    {instrument_bias != 12:
        b=(18+6)/2=12 μm。
    }
    -> common_bias

=== common_bias ===

如果两次布置都受同一个温度模型偏差影响，反转以后这个共同偏差会自动消失吗？

* [会。只要反转过一次，所有系统偏差都会被消掉。]
    反转只分离那些在两种关系中以不同方式进入观测的偏差。
    共同温度模型偏差仍可能同样进入两次读数。
    -> common_bias_retry

* [不会。还需要引入不共享该偏差来源的新比较关系。]
    ~ recognized_common_bias = true
    -> debrief

=== common_bias_retry ===

* [承认反转也有边界，并寻找不同偏差来源的新关系。]
    ~ recognized_common_bias = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{repeated_same_relation:
你一开始想在原关系上多测几次。这个案例说明，重复同一关系可以减少随机波动，却不会自动增加分离共同偏差所需的独立约束。
}

你刚才做的核心动作，在本书中叫作《相衡》：
改变比较关系，让不同未知偏差以不同符号或作用方式进入观测。

这里：
r₁=18 μm=s+b，
r₂=6 μm=−s+b，
因此 s=6 μm，b=12 μm。

第二次测量有价值，不是因为“又测了一次”，而是因为关系变了。

-> finish

=== finish ===
~ case_complete = true
-> END
