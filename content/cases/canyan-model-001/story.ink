// RMD-TASK-007 / Chapter 5
// Source facts are limited to the current textbook 《参验》 worked example.

VAR trusted_93_immediately = false
VAR redesign_items = ""
VAR revised_design = false
VAR recognized_independence = false
VAR debrief_reached = false
VAR case_complete = false

团队比较模型 A 与 B。
A 在旧测试集上准确率 88%，B 达到 93%。

现在能直接宣布 B 更好吗？

* [能。93% 明显高于 88%，先采用 B。]
    ~ trusted_93_immediately = true
    数字更高，但你还不知道比较结构有没有把同一个偏差同时带进训练和测试。
    -> leakage

* [先检查训练集、测试集和评测流程是否真正独立。]
    -> leakage

=== leakage ===

后来发现：训练集和测试集按“样本”随机切分，同一个用户的多条记录可能同时出现在两边，形成数据泄漏。

现在重新设计试验。哪些动作能直接切断或减少这次共同偏差来源？

=== redesign ===

# ui:type=multi
# ui:bind=redesign_items
# ui:option=user_group::按用户而不是按样本分组
# ui:option=independent_test::保留未参与调参的独立测试集
# ui:option=separate_eval::让评测脚本与训练流水线分离
# ui:option=external_data::再用另一来源数据复验
# ui:min=1
# ui:max=4
# ui:submit=提交试验设计
* [继续]
    {redesign_items == "user_group,independent_test,separate_eval,external_data":
        你没有只“多跑几次”，而是同时改变了数据分组、最终测试、评测流程和证据来源。
        -> reevaluate
    }
    ~ revised_design = true
    你选中的动作能增加信息，但教材给出的重设计还包括：
    按用户分组、独立测试集、训练与评测分离，以及另一来源数据复验。
    -> redesign

=== reevaluate ===

重新评估后：
A = 87.5%，B = 88.1%，差异明显缩小。

这次真正增加证据的关键是什么？

* [把同一套流程再跑一百次；次数越多越独立。]
    同一数据泄漏或同一错误模型重复一百次，仍然可能同源同误。
    -> independence_retry

* [换掉共同偏差来源，让比较结构和证据来源更独立。]
    ~ recognized_independence = true
    -> debrief

=== independence_retry ===

* [把重点改为“是否增加了不共享原偏差的新信息”。]
    ~ recognized_independence = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{trusted_93_immediately:
你一开始让 93% 直接赢了。这个案例说明：更高的结果只有在比较结构可信时才有意义。
}

{revised_design:
你第一次没有把教材给出的四项重设计全部纳入，后来补齐了。真正重要的不是动作数量，而是它们分别切断了哪些共同偏差来源。
}

你刚才做的核心动作，在本书中叫作《参验》：
在看结果前规定判据，建立可比较的分组与对照，并用不共享同一偏差来源的复验来增加证据。

这里从 93% 到 88.1% 的变化，不是在证明 B 一定不好，而是在说明原来的“93% 对 88%”比较混入了数据泄漏，不能直接当作可靠优势。

-> finish

=== finish ===
~ case_complete = true
-> END
