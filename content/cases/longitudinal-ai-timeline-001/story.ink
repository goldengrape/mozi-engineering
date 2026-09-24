// RMD-TASK-012 / longitudinal case / Appendix G
// Source facts are limited to Appendix G1-G10.
// Method labels are withheld until the final debrief.

VAR fixed_boundary_before_regeneration = false
VAR functions = ""
VAR decoupled_schema = false
VAR provenance_checks = ""
VAR wrote_reproducible_definition = false
VAR tolerance_split = false
VAR flow_corrections = ""
VAR prevention_controls = ""
VAR recovery_order = ""
VAR debrief_reached = false
VAR case_complete = false

对象是一门数字人文课程的小作业：
做一个可交互的“历史灾异时间线”网页。
用户可以按年份浏览旱、水、蝗、疫等记录，点开节点看到原文出处；
页面需要在课堂演示时离线可用。

第一次提示只有：
“做一个好看的明代灾异时间线，点节点显示原文和出处。”

页面很快做出来了，但抽查三条后发现：
一条年份错了，一条卷数是模型补出的，两个重复记载又被当成两场不同灾害。

你先做什么？

* [换一个模型，再用更强的提示词生成一次。]
    更换实现者可能改变输出，却没有回答哪些记录算同一事件、哪些字段必须来自史料、这一轮到底做什么。
    -> boundary_retry

* [先写清对象、边界、计数方式和必须由史料提供的字段，再重新生成。]
    ~ fixed_boundary_before_regeneration = true
    -> functions_step

=== boundary_retry ===

* [先把“什么算进来、怎样计、哪些字段不得由 AI 补”写清。]
    ~ fixed_boundary_before_regeneration = true
    -> functions_step

=== functions_step ===

下一步，有人提议直接定技术栈：“React、SQLite、Python，再加一个关系图。”

先从下面九项中选出教材列出的六项“必须发生的作用”。

# ui:type=multi
# ui:bind=functions
# ui:option=store::保存史料条目及其出处
# ui:option=event_record::区分“历史事件”与“文献中的一次记载”
# ui:option=filter::支持按时间和灾异类型筛选
# ui:option=source_view::点开节点显示原文、卷次和整理来源
# ui:option=uncertain::允许把条目标为“存疑”，并保留人工修订
# ui:option=offline::课堂断网时仍能展示已经核验的数据
# ui:option=react::使用 React
# ui:option=sqlite::使用 SQLite
# ui:option=graph::增加关系图
# ui:min=6
# ui:max=6
# ui:submit=提交功能清单
+ [继续]
    {functions == "store,event_record,filter,source_view,uncertain,offline":
        你保留的是必须发生的作用，而不是当前技术栈。
        -> coupling
    }

    React、SQLite、关系图都可能是实现选择，不是这六项作用本身。
    教材要求先稳定功能，再选技术栈。
    -> functions_step

=== coupling ===

第一版里，数据库字段名被前端组件、筛选器、图表和导出脚本直接引用。
把 event_type 改成 disaster_type 后，四处一起报错。

怎样改更合适？

* [把四处引用全部一起改掉，以后字段再变就再同步修改。]
    这能修当前报错，却保留了数据库内部命名向多个界面直接传播的关系。
    -> coupling_retry

* [增加稳定的数据接口层；数据库内部怎么存可以改，前端只依赖公开 schema。]
    ~ decoupled_schema = true
    -> evidence

=== coupling_retry ===

* [把多个界面对数据库内部命名的直接依赖收进稳定接口。]
    ~ decoupled_schema = true
    -> evidence

=== evidence ===

接下来要处理 AI 给出的出处。
每条网页记录至少保留来源链：
原始出处 → 使用版本/影印本 → 人工转录或 OCR → 清洗记录 → 结构化 JSON → 页面节点。

验证时，从下面五项中选择教材认为真正增加证据独立性的四项。

# ui:type=multi
# ui:bind=provenance_checks
# ui:option=original::抽样回到原始史料
# ui:option=student::让另一名同学独立核对
# ui:option=other_path::对关键条目使用不同来源或不同检索路径
# ui:option=gate::预先约定出处不完整的条目不得进入正式展示
# ui:option=same_ai::让同一个 AI 连续三次回答同一卷数
# ui:min=4
# ui:max=4
# ui:submit=提交验证动作
+ [继续]
    {provenance_checks == "original,student,other_path,gate":
        你没有把“同一个 AI 连续三次一致”当成三份独立证据。
        -> definition
    }

    同一个 AI 重复回答仍可能同源同误。
    这里要回原始史料、独立核对、换来源/检索路径，并提前设置正式展示的证据门槛。
    -> evidence

=== definition ===

现在要把“做得有古籍感、像一条有呼吸感的时间线”交给另一个未参与原设计的实现者。

哪一种表达更可能让关键关系复现？

* [保留这些审美描述，让新实现者自由理解；只要看起来相近就算成功。]
    外貌形容没有固定事件合并、字段显示、核验状态和响应式关系。
    新实现者即使做得漂亮，也可能把关键关系重新猜一遍。
    -> definition_retry

* [写出年份排列、重复记载合并、多出处保留、节点字段、待核标记和页面宽度变化时关系不变等明确规则。]
    ~ wrote_reproducible_definition = true
    -> tolerance

=== definition_retry ===

* [把默会意图改成可检查、可由另一实现者复现的关系。]
    ~ wrote_reproducible_definition = true
    -> tolerance

=== tolerance ===

项目里哪些变化可以有范围，哪些不能用“差不多”处理？

* [只要页面整体好看，年份、出处和核验状态有小偏差也可以接受。]
    教材把视觉表现和史料事实分成两类容度。
    年份、原文、出处、核验状态一旦错，就是数据失败。
    -> tolerance_retry

* [节点轻微错落、动画速度、背景纹理可在范围内变化；年份、原文、出处、核验状态按证据要求处理。]
    ~ tolerance_split = true
    -> sequence

=== tolerance_retry ===

* [把表现容度与事实容度分开。]
    ~ tolerance_split = true
    -> sequence

=== sequence ===

数据流程原先写成：
OCR → 清洗 → 实体抽取 → 地名规范化 → 地理编码 → 数据库存储 → 页面展示。

教材指出：第一版时间线并不需要地理编码；原文保留必须发生在清洗之前；共用 API 或电脑造成的等待不一定是逻辑依赖。

从下面四项中选出三项应做的流程修正。

# ui:type=multi
# ui:bind=flow_corrections
# ui:option=raw_first::在清洗前保存原文，以便回查
# ui:option=defer_geo::第一版暂缓不需要的地理编码
# ui:option=resource::把共用 API/电脑造成的等待单列为资源冲突
# ui:option=serial_truth::保留 AI 生成的完整串行顺序，因为生成顺序就是逻辑依赖
# ui:min=3
# ui:max=3
# ui:submit=提交流程修正
+ [继续]
    {flow_corrections == "raw_first,defer_geo,resource":
        你把真实前置状态、可暂缓工作和资源冲突分开了。
        -> prevention
    }

    AI 恰好按某个顺序写出流程，不等于每条边都是逻辑依赖。
    原文要先保留；第一版可暂缓地理编码；共享资源造成的等待单独记录。
    -> sequence

=== prevention ===

“请勿编造出处”只是提醒。
从下面六项中选出教材给出的五项结构性防错措施。

# ui:type=multi
# ui:bind=prevention_controls
# ui:option=no_verify_empty::出处字段为空时禁止标成“已核验”
# ui:option=confirmed_only::正式展示只读取人工确认的数据集
# ui:option=separate_ai::AI 生成字段与史料原文分栏保存，不能覆盖原文
# ui:option=history::删除、合并事件必须保留修改记录
# ui:option=diff::关键数据更新前自动生成差异报告
# ui:option=remind::只在提示词里重复“不要幻觉”
# ui:min=5
# ui:max=5
# ui:submit=提交防错结构
+ [继续]
    {prevention_controls == "no_verify_empty,confirmed_only,separate_ai,history,diff":
        你改变了错误路径本身，而不是只增加提醒。
        -> failure
    }

    反复提醒并没有关闭错误路径。
    这里的结构动作是：空出处不能核验、正式展示只读人工确认数据、AI 字段不能覆盖原文、修改留痕、更新前出差异报告。
    -> prevention

=== failure ===

课堂现场网络突然断开，外部 API 不可用。
请排列故障被发现以后到恢复正常的四个阶段。

# ui:type=rank
# ui:bind=recovery_order
# ui:option=isolate::隔离外部调用
# ui:option=local::进入本地静态数据降级模式，只保留已核验数据和基本交互
# ui:option=test::网络恢复后先做数据与版本校验
# ui:option=normal::校验通过后恢复 Normal
# ui:submit=提交恢复顺序
+ [继续]
    {recovery_order == "isolate,local,test,normal":
        你没有把“网络恢复”直接等同于“系统已经恢复可信”。
        -> debrief
    }

    教材给出的逻辑是：
    先隔离外部调用 → 进入本地静态数据降级模式 → 网络恢复后先校验数据与版本 → 再恢复 Normal。
    -> failure

=== debrief ===

~ debrief_reached = true

复盘：

你一路处理的不是九道互不相干的小题，而是同一个作品从模糊意图走向可交付定义的连续变化：

- 先写清问题边界，对应《界体》；
- 从技术栈退回“必须发生什么”，对应《分任》；
- 收掉无益的字段改变传播，对应《制耦》；
- 保留来源链并引入异源复验，对应《传准》《参验》；
- 把默会意图写成另一实现者能复现的关系，对应《示制》；
- 区分表现容度和事实容度，对应《容度》；
- 按真实前置状态重排流程、把资源冲突单列，对应《序作》；
- 把“不要幻觉”改成错误路径不可达或可追查，对应《防误》；
- 网络失败后隔离、降级、复验再恢复，对应《限败》。

附录 G 没有为了凑齐十六篇而把其他方法强塞进这个项目。
它检验的是：实现者换成 AI 以后，边界、证据、依赖、允许差异、可复现定义和失败控制这些判断并没有自动消失。

-> finish

=== finish ===
~ case_complete = true
-> END
