// RMD-TASK-007 / Chapter 2
// Source facts are limited to the current textbook 《衡算》 worked example.

VAR residual_guess = 0
VAR investigation_paths = ""
VAR guessed_loss = false
VAR revised_investigation = false
VAR recognized_false_closure = false
VAR debrief_reached = false
VAR case_complete = false

连续过程每小时进入原料 100 kg，产品流出 72 kg，尾气带出 8 kg。
储罐库存每小时增加 15 kg。
没有已知反应生成或消耗。

先不要给差额起名字。按现有记录，尚未解释的差额绝对值是多少？

# ui:type=number
# ui:bind=residual_guess
# ui:min=0
# ui:max=100
# ui:step=1
# ui:unit=kg/h
# ui:submit=提交数值
* [继续]
    {residual_guess == 5:
        你把 5 kg/h 留成了“尚未解释的不合”。
    }
    {residual_guess != 5:
        现有记录给出的应有库存增加是 100−72−8=20 kg/h，而实际增加 15 kg/h。
        所以账上有 5 kg/h 尚未解释。先把它留在账上，不急着解释。
    }
    -> name_or_hold

=== name_or_hold ===

现在怎样处理这 5 kg/h？

* [先把它叫作“损耗”，再去找损耗发生在哪里。]
    ~ guessed_loss = true
    “损耗”已经是原因判断，而当前只有一个差额。
    如果先命名，后面的调查很容易只寻找支持这个名字的证据。
    -> investigate

* [只把它记作残差，按不同类型的可能来源分别取证。]
    -> investigate

=== investigate ===

你要优先检查哪些方向？

# ui:type=multi
# ui:bind=investigation_paths
# ui:option=exchange::未计量排液或旁路等跨界交换
# ui:option=internal::未列出的副产物、吸附或挥发等内部过程
# ui:option=measurement::流量计、称量和库存估算等测量/记录
# ui:min=1
# ui:max=3
# ui:submit=提交调查方向
* [继续]
    {investigation_paths == "exchange,internal,measurement":
        你把三类来源都保留下来，没有让某一种猜测独占调查。
        -> false_closure
    }
    ~ revised_investigation = true
    你选中的方向可以查，但还不足以覆盖教材给出的三类来源。
    这 5 kg/h 既可能来自遗漏的跨界交换，也可能来自内部过程，还可能来自测量或记录。
    -> complete_investigation

=== complete_investigation ===

* [补齐三类调查，再继续。]
    ~ investigation_paths = "exchange,internal,measurement"
    -> false_closure

=== false_closure ===

调查还发现一个风险：如果所有流量计都使用同一批带有 2% 系统偏差的校准液，账面甚至可能重新闭合。

这时“账面闭合”能证明所有记录都正确吗？

* [能。只要残差回到 0，问题就已经解决。]
    闭合只说明这些数在当前关系下相合。
    如果多个量共享同一偏差，错误可以彼此抵消。
    -> debrief

* [不能。还要检查这些量是否共享同一偏差来源。]
    ~ recognized_false_closure = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{guessed_loss:
你曾经想先把 5 kg/h 叫作“损耗”。这个案例最重要的修正，是把“差额”与“原因”分开：差额先留下，原因要靠证据排查。
}

{revised_investigation:
你第一次没有保留全部三类调查路径，后来补齐了。总量关系负责把问题压缩成一个差额，却不能替你决定是哪一种原因。
}

你刚才做的核心动作，在本书中叫作《衡算》：记录存量与跨界出入，计算残差，再按交换、内部过程、测量/记录分别取证。

《衡算》能告诉你“还有 5 kg/h 没解释”，但不能把 5 kg/h 自动翻译成“损耗”。

{recognized_false_closure:
你也识别出了“假闭合”：共享偏差可以让账面重新相合，却不等于事实正确。
}

-> finish

=== finish ===
~ case_complete = true
-> END
