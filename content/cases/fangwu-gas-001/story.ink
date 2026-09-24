// RMD-TASK-010 / Chapter 15
// Source facts are limited to the current textbook 《防误》 worked example.

VAR relied_on_label = false
VAR structural_measures = ""
VAR attack_paths = ""
VAR revised_attack = false
VAR debrief_reached = false
VAR case_complete = false

实验室有氮气与可燃气体两种供气接口。
两种快速接头外形完全相同，只贴不同颜色标签。

光线差、色觉差异、标签脱落或操作者分心时，误接路径仍然存在。

你先怎么改？

* [保留完全相同的接头，只要求操作者更认真看颜色标签。]
    ~ relied_on_label = true
    提醒和培训有价值，但危险动作仍然完全可达。
    如果操作者没看清、标签脱落或分心，结构本身不会阻止误接。
    -> structure

* [把已经能预见的误接改写成结构问题。]
    -> structure

=== structure ===

请选择教材例题给出的三项结构措施。

# ui:type=multi
# ui:bind=structural_measures
# ui:option=key::两类接口使用不同键位
# ui:option=size::两类接口使用不同机械尺寸
# ui:option=interlock::危险气体阀只有在正确接头完全锁定后才可开启
# ui:option=color::继续只靠不同颜色标签
# ui:min=3
# ui:max=3
# ui:submit=提交结构措施
+ [继续]
    {structural_measures == "key,size,interlock":
        你把误接从“必须一直记得”转成了几何与联锁约束。
        -> attack
    }

    颜色标签仍然依赖持续注意力。
    教材给出的结构改进是不同键位、不同机械尺寸，以及正确接头完全锁定后的阀门联锁。
    -> structure

=== attack ===

设计完成以后，验证时要主动攻击哪些错误路径？

# ui:type=multi
# ui:bind=attack_paths
# ui:option=reverse::反插
# ui:option=partial::半插
# ui:option=cross::跨接
# ui:option=bypass::绕过联锁
# ui:min=1
# ui:max=4
# ui:submit=提交攻击路径
+ [继续]
    {attack_paths == "reverse,partial,cross,bypass":
        你没有只测试正确连接，而是把四条已知错误路径都拿来攻击设计。
        -> debrief
    }

    ~ revised_attack = true
    这次攻击还没有覆盖教材例题列出的全部路径：
    反插、半插、跨接、绕过联锁。
    -> attack

=== debrief ===

~ debrief_reached = true

复盘：

{relied_on_label:
你一开始仍把正确性主要压在人的持续注意力上，后来把误接路径转成了结构约束。
}

{revised_attack:
你第一次没有把已知错法全部拿来攻击，后来补齐了反插、半插、跨接和绕过联锁。
}

你刚才做的核心动作，在本书中叫作《防误》：
对已经能够预见的高后果错误，尽量让错误动作本身不可完成或显著更难，而不是只提醒“不要做错”。

防误验证也不能只走正确路径；必须故意错用，寻找仍能绕过结构的办法。

-> finish

=== finish ===
~ case_complete = true
-> END
