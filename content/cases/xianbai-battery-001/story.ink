// RMD-TASK-010 / Chapter 16
// Source facts are limited to the current textbook 《限败》 worked example.

VAR control_order = ""
VAR tried_restart = false
VAR verified_before_normal = false
VAR debrief_reached = false
VAR case_complete = false

储能柜某模块温度快速升到报警阈值以上。
系统已经进入 Detected。

下一步怎么做？

* [先重启一次，看看报警是否消失。]
    ~ tried_restart = true
    这会在原因和影响范围不明时重新加能。
    “报警—重启”跳过了故障控制和恢复验证。
    -> control_sequence

* [把停止增害、隔离、限害/降用、修复、复验和恢复分开处理。]
    -> control_sequence

=== control_sequence ===

请排列报警之后的处置动作。

# ui:type=rank
# ui:bind=control_order
# ui:option=stop::停止该模块充放电
# ui:option=isolate::断开模块接触器并切断相邻传播路径
# ui:option=degrade::降低整柜功率、加强冷却并监视邻近模块
# ui:option=repair::维修或更换模块
# ui:option=verify::做绝缘、温升、通信和功能测试
# ui:option=normal::满足退出判据后恢复 Normal
# ui:submit=提交处置顺序
+ [继续]
    {control_order == "stop,isolate,degrade,repair,verify,normal":
        你把“止、隔、限害/降用、修复、复验、恢复”分成了不同阶段。
        -> repaired_state
    }

    教材例题的处置逻辑是：
    先停止该模块继续充放电；
    再隔离模块并切断相邻传播路径；
    然后限害/降用；
    修复后做系统级复验；
    满足退出判据才恢复 Normal。
    -> retry_control

=== retry_control ===

* [按止 → 隔 → 限害/降用 → 修复 → 复验 → 恢复重排。]
    ~ control_order = "stop,isolate,degrade,repair,verify,normal"
    -> repaired_state

=== repaired_state ===

模块已经更换。
现在可以直接恢复 Normal 吗？

* [可以。坏部件已经换掉，恢复运行就是维修完成的证明。]
    更换模块只说明完成了修复动作。
    教材还要求绝缘、温升、通信和功能测试，满足退出判据后才恢复。
    -> verification_retry

* [不可以。先做系统级复验，满足退出判据后再恢复。]
    ~ verified_before_normal = true
    -> debrief

=== verification_retry ===

* [补做绝缘、温升、通信和功能测试，再决定是否退出故障状态。]
    ~ verified_before_normal = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{tried_restart:
你一开始选择了“报警—重启”。这条路径的问题是：它在原因和影响范围不明时重新加能，同时跳过隔离、限害和恢复验证。
}

你刚才做的核心动作，在本书中叫作《限败》：
失败已经发生以后，把发现、停止增害、隔离、限制传播、降级、安全运行、修复、复验和恢复看成不同状态与动作。

本例可以概括为：
Normal → Detected → Isolated → Degraded/Safe → Repaired → Verified → Normal。

“修好了部件”不等于“系统已经证明可以恢复”。

-> finish

=== finish ===
~ case_complete = true
-> END
