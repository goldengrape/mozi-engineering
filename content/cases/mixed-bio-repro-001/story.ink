// RMD-TASK-011 / mixed transfer / Appendix F2
// No method labels appear before debrief.

VAR clarified_bio_boundary = false
VAR redesign_actions = ""
VAR chose_independent_relation = false
VAR reproduction_records = ""
VAR debrief_reached = false
VAR case_complete = false

研究某处理是否改变细胞表型。
实验跨多个培养批次、试剂批号和仪器平台进行。

第一步你最需要写清什么？

* [先把所有变化都叫作“实验误差”，再想办法把它们减小。]
    附录明确提醒：生物差异并不都属于误差。
    细胞亚群、基因型差异和真实随机性可能就是研究对象。
    -> bio_boundary_retry

* [先明确研究的是细胞内机制、培养体系还是完整实验流程，并记录边界怎样随传代和环境变化。]
    ~ clarified_bio_boundary = true
    -> confounding

=== bio_boundary_retry ===

* [先明确研究对象和边界，不把所有生物差异预先当成误差。]
    ~ clarified_bio_boundary = true
    -> confounding

=== confounding ===

进一步检查发现：批次与处理完全重合。
哪些动作直接针对这个证据问题？

# ui:type=multi
# ui:bind=redesign_actions
# ui:option=repeats::分清生物学重复与技术重复
# ui:option=endpoint::预设主要终点
# ui:option=unconfound::避免批次与处理完全重合
# ui:option=independent::引入独立来源复验
# ui:option=same_repeat::只在同一条件下增加更多技术重复
# ui:min=4
# ui:max=4
# ui:submit=提交重设计动作
+ [继续]
    {redesign_actions == "repeats,endpoint,unconfound,independent":
        你改变了比较结构和证据来源，而不只是把同源重复做得更多。
        -> common_bias
    }

    同一条件下增加更多技术重复，不能替代批次/处理解混和异源复验。
    这里需要分清重复类型、预设主要终点、避免批次与处理重合，并引入独立来源复验。
    -> confounding

=== common_bias ===

如果你还担心多个结果共享同一仪器或测量模型偏差，哪一种下一步更有信息？

* [继续在同一设备、同一测量原理上重复。]
    同一关系重复可以帮助估计随机波动，却未必暴露共同偏差。
    -> common_bias_retry

* [换独立平台、不同测量原理或换位关系，让共同偏差以不同方式进入观测。]
    ~ chose_independent_relation = true
    -> reproducibility

=== common_bias_retry ===

* [改用不共享原偏差来源的测量平台或关系。]
    ~ chose_independent_relation = true
    -> reproducibility

=== reproducibility ===

最后要让另一实验室复现关键关系。
从下面七项中选出附录明确要求记录的六类信息。

# ui:type=multi
# ui:bind=reproduction_records
# ui:option=cell_line::细胞系身份
# ui:option=passage::传代数
# ui:option=reagent::试剂批号
# ui:option=culture::培养条件
# ui:option=software::软件版本
# ui:option=script::分析脚本
# ui:option=final_claim::只记录最终结论
# ui:min=6
# ui:max=6
# ui:submit=提交复现记录
+ [继续]
    {reproduction_records == "cell_line,passage,reagent,culture,software,script":
        你把可复现关系写成了外部记录，而不是只保留最后结论。
        -> debrief
    }

    附录要求记录细胞系身份、传代数、试剂批号、培养条件、软件版本和分析脚本。
    只记录最终结论不足以让别人重建关键关系。
    -> reproducibility

=== debrief ===

~ debrief_reached = true

复盘：

先明确研究对象和变化边界，对应《界体》；
处理批次混杂、重复类型、预设终点和独立来源复验，对应《参验》；
用独立平台、不同测量原理或换位关系暴露共同偏差，对应《相衡》；
把细胞系、传代、试剂、培养、软件和脚本写成可复现记录，对应《示制》。

到这里类比停止。
生物差异并不都属于“误差”，本书也不替代生物统计、实验伦理与具体实验技术。

-> finish

=== finish ===
~ case_complete = true
-> END
