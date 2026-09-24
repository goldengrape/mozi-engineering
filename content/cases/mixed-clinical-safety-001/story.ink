// RMD-TASK-011 / mixed transfer / Appendix F1
// No method labels appear before debrief.

VAR separated_boundaries = false
VAR traced_calibration_branch = false
VAR safety_controls = ""
VAR controlled_event_before_final_diagnosis = false
VAR debrief_reached = false
VAR case_complete = false

某医疗机构同时遇到两件事：
一批检验结果可能受校准问题影响；
静脉给药差错也需要减少。

第一步怎样处理这两个问题？

* [把它们合并成一个“医疗质量问题”，先找一个统一原因。]
    两件事都关系到安全，但对象、证据和动作不同。
    如果先混成一个大问题，后面的追查和控制边界会变得含混。
    -> boundary_retry

* [先分开“检验系统可信度”“医生决策”“给药执行”三个问题边界。]
    ~ separated_boundaries = true
    -> calibration

=== boundary_retry ===

* [先把三个问题边界分开，再分别取证和处置。]
    ~ separated_boundaries = true
    -> calibration

=== calibration ===

现在确认存在一个异常校准批次。
下一步哪一个动作更能回答“过去哪些结果受影响”？

* [只把当前仪器重新调好，然后从现在开始继续使用。]
    当前状态修正了，不等于过去的影响范围已经消失。
    还需要沿异常校准批次追到受影响的检验结果与时间范围。
    -> calibration_retry

* [沿异常校准批次追查受影响的检验结果与时间范围。]
    ~ traced_calibration_branch = true
    -> medication

=== calibration_retry ===

* [补做来源和时间范围追查，不只修当前仪器。]
    ~ traced_calibration_branch = true
    -> medication

=== medication ===

现在转到另一个问题：减少静脉给药差错。
从下面五项中选出附录 F1 给出的四类结构性动作。

# ui:type=multi
# ui:bind=safety_controls
# ui:option=patient_id::患者识别
# ui:option=keying::接口钥合
# ui:option=permission::权限控制
# ui:option=scan::扫描核对
# ui:option=trace_lab::追踪异常校准批次的检验结果
# ui:min=4
# ui:max=4
# ui:submit=提交安全动作
+ [继续]
    {safety_controls == "patient_id,keying,permission,scan":
        你没有把检验可信度的追查动作误当成给药执行的防错动作。
        -> adverse_event
    }

    患者识别、接口钥合、权限和扫描核对属于这里的结构性防错动作。
    异常校准批次的结果追查属于前一个问题边界。
    -> medication

=== adverse_event ===

假定不良事件已经发生。
附录提醒：急危情形中，行动阈值常早于最终诊断阈值。

这时应怎样处理？

* [先等待最终诊断和完整根因确认，再开始控制后果。]
    等到原因完全确认才行动，可能错过先停止增害和限制传播的时机。
    -> event_retry

* [先停止继续增害、隔离错误来源、维持必要支持并监测；恢复前再复验。]
    ~ controlled_event_before_final_diagnosis = true
    -> debrief

=== event_retry ===

* [先控制继续增害和传播，再把根因分析作为后续工作。]
    ~ controlled_event_before_final_diagnosis = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

这道混合题没有先给方法名，因为现实里通常先出现的是症状。

你先把三个问题边界分开，对应《界体》；
异常校准批次先检查当前参照状态，再沿结果与时间范围追查，对应《定准》《传准》；
患者识别、接口钥合、权限和扫描核对，把可预见错误路径改写成结构约束，对应《防误》；
不良事件已经发生以后，先停止增害、隔离来源、维持必要支持、监测、恢复与复验，对应《限败》。

到这里类比停止。
本书可以帮助整理证据可信度、流程安全和故障控制，不能替代临床指南、医学统计、伦理审查或个体患者诊疗判断。

-> finish

=== finish ===
~ case_complete = true
-> END
