// RMD-TASK-011 / mixed transfer / Appendix F3
// No method labels appear before debrief.

VAR allowed_moving_boundary = false
VAR redesigned_field_comparison = false
VAR harvest_analysis = ""
VAR controlled_agri_failure = false
VAR debrief_reached = false
VAR case_complete = false

你要比较两种水肥管理方案，并让结果进入收获和仓储流程。

分析边界应该怎样处理？

* [永远固定在单个小区。只要一开始选定，就不要再因地下水、径流或根系范围变化而调整。]
    开放自然系统里的跨界作用会随时间和环境变化。
    固定边界本身不是目标；边界应服务于当前判断。
    -> boundary_retry

* [在单株、小区、田块、农场或流域之间按问题选择，并记录地下水、径流和根系范围造成的边界变化。]
    ~ allowed_moving_boundary = true
    -> trial_design

=== boundary_retry ===

* [允许边界随当前问题和环境关系重新检查。]
    ~ allowed_moving_boundary = true
    -> trial_design

=== trial_design ===

现在发现高肥力地块全给了处理组。
下一步怎么做？

* [保持原分组，只增加更多测量次数。]
    如果地块肥力与处理完全重合，再多测几次也不会把两个来源分开。
    -> trial_retry

* [重新设计分配，避免处理与地块条件完全重合，并按专业设计考虑随机区组、多地点或多年度证据。]
    ~ redesigned_field_comparison = true
    -> harvest

=== trial_retry ===

* [先解除地块条件与处理的混杂，再增加真正有区分力的证据。]
    ~ redesigned_field_comparison = true
    -> harvest

=== harvest ===

进入收获阶段。
附录同时提醒两类问题：物候/天气时间窗，以及收割、运输、烘干、仓储的容量限制。

哪些动作应该同时保留？

# ui:type=multi
# ui:bind=harvest_analysis
# ui:option=state_window::把播种、施肥、灌溉、收获写成状态依赖，并显式标出物候和天气时间窗
# ui:option=capacity::分析收割、运输、烘干、仓储的容量限制
# ui:option=all_schedule::把所有等待都当成同一种“工序顺序问题”
# ui:min=2
# ui:max=2
# ui:submit=提交收获分析
+ [继续]
    {harvest_analysis == "state_window,capacity":
        你把“什么时候能做”和“哪一段限制整体能力”分成了两个问题。
        -> failure
    }

    物候/天气窗口属于状态和时间条件；
    收割、运输、烘干、仓储还要单独看容量限制。
    两者不能压成同一种“排程”问题。
    -> harvest

=== failure ===

如果出现灌溉故障、污染或病害，下一步怎样处理？

* [继续维持原方案，等完整原因确认后再决定是否分区。]
    附录把这类情形作为需要先分区处置、限制传播，并在专业判据下恢复的问题。
    -> failure_retry

* [先按受影响区域处置并限制传播；恢复条件交给相应专业判据。]
    ~ controlled_agri_failure = true
    -> debrief

=== failure_retry ===

* [把“限制继续传播”和“最终解释原因”分开，先控制受影响范围。]
    ~ controlled_agri_failure = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

开放系统边界需要随地下水、径流、根系等关系重新检查，对应《界体》；
避免高肥力地块与处理完全重合、增加随机区组/多地点/多年度等区分性证据，对应《参验》；
显式写状态依赖与物候/天气时间窗，对应《序作》；
检查收割、运输、烘干和仓储的容量限制，对应《通滞》；
灌溉故障、污染或病害发生后分区处置并限制传播，对应《限败》。

到这里类比停止。
天气不是机械公差，农业的年际气候、空间异质性、病虫害和基因型×环境互作仍需专业农艺、统计和食品安全方法。

-> finish

=== finish ===
~ case_complete = true
-> END
