// RMD-TASK-009 / Chapter 9
// Source facts are limited to the current textbook 《定动》 worked example.

VAR constrained_dofs = ""
VAR revised_dofs = false
VAR chose_exact_constraint = false
VAR recognized_full_condition_test = false
VAR debrief_reached = false
VAR case_complete = false

某滑台只需要沿 X 方向平移。
刚体有 6 个自由度：Tx、Ty、Tz、Rx、Ry、Rz。

请选择应该被约束的五个自由度。

-> dof_select

=== dof_select ===

# ui:type=multi
# ui:bind=constrained_dofs
# ui:option=Tx::Tx
# ui:option=Ty::Ty
# ui:option=Tz::Tz
# ui:option=Rx::Rx
# ui:option=Ry::Ry
# ui:option=Rz::Rz
# ui:min=5
# ui:max=5
# ui:submit=提交约束集合
+ [继续]
    {constrained_dofs == "Ty,Tz,Rx,Ry,Rz":
        你保留了 Tx，并约束其余五个自由度。
        -> guide_arrangement
    }

    ~ revised_dofs = true
    目标运动只有沿 X 的平移，因此 Tx 必须保留。
    Ty、Tz、Rx、Ry、Rz 才是需要限制的五个自由度。
    -> dof_select

=== guide_arrangement ===

两根平行导轨如果都被当成完整定位基准，会怎样？

* [更稳。两个完整基准对同一自由度重复限制，总能增加稳定性。]
    理想几何下看似更稳，但微小不平行、热伸长或安装误差会让两套约束互相争夺。
    -> arrangement_retry

* [可能过约束。一侧承担主要定位，另一侧支承并允许微小补偿更稳妥。]
    ~ chose_exact_constraint = true
    -> verification

=== arrangement_retry ===

* [改为一侧主定位，另一侧支承并保留微小补偿自由度。]
    ~ chose_exact_constraint = true
    -> verification

=== verification ===

这种安排只在静止装配时“看起来能动”，够了吗？

* [够。能装上并推得动一次，就说明约束关系成立。]
    教材要求继续在全行程、常载荷和温升条件下试动。
    -> verification_retry

* [不够。还要在全行程、常载荷和温升条件下试动。]
    ~ recognized_full_condition_test = true
    -> debrief

=== verification_retry ===

* [补做全行程、常载荷和温升条件下的试动。]
    ~ recognized_full_condition_test = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{revised_dofs:
你第一次把要保留和要消除的自由度混在一起，后来先把目标运动重新写清楚。
}

你刚才做的核心动作，在本书中叫作《定动》：
先规定“该怎么动”，再配置足够但不过多的约束。

这道题中，Tx 必须保留；Ty、Tz、Rx、Ry、Rz 需要被约束。
两根导轨都刚性承担完整定位，会在不平行、热伸长或安装误差存在时形成约束争夺和卡滞。

约束数量不是越多越好。

-> finish

=== finish ===
~ case_complete = true
-> END
