// RMD-TASK-011 / mixed transfer / Appendix F4
// No method labels appear before debrief.

VAR kept_reconciliation_as_clue = false
VAR lineage_and_propagation = ""
VAR operation_controls = ""
VAR controlled_exposure = false
VAR debrief_reached = false
VAR case_complete = false

一套支付/交易运营系统使用多个数据源、风险模型、账户权限和清算环节。

现在现金流、头寸、交易记录或账户关系出现对账不一致。
第一步怎样处理？

* [先认定估值模型一定错了，因为账没有闭合。]
    对账残差可以暴露问题，但不能自动替你判断是哪一种原因。
    而且反过来，即使账面闭合，也不表示估值模型必然正确。
    -> reconcile_retry

* [先做对账，把不一致保留成线索，再分别查数据、记录、账户关系和其他来源。]
    ~ kept_reconciliation_as_clue = true
    -> data_change

=== reconcile_retry ===

* [先把对账不一致当作线索，不把它直接命名成模型错误。]
    ~ kept_reconciliation_as_clue = true
    -> data_change

=== data_change ===

随后一个行情、基准、评级、模型输入或数据版本发生变更，多个业务和风险模块一起受影响。

哪些动作应该同时做？

# ui:type=multi
# ui:bind=lineage_and_propagation
# ui:option=lineage::追踪来源、版本、变更与受影响分支
# ui:option=edges::逐边检查一个参数或数据源为什么要牵动这些业务/风险模块
# ui:option=closed_report::只看最终报表是否重新闭合
# ui:min=2
# ui:max=2
# ui:submit=提交变更调查
+ [继续]
    {lineage_and_propagation == "lineage,edges":
        你同时保留了“它从哪里来”和“为什么要传播到这里”两个问题。
        -> operation_risk
    }

    最终报表闭合不能替代来源追踪和改变传播检查。
    这里要同时追版本/来源/影响分支，并逐边检查依赖是否真的必要。
    -> data_change

=== operation_risk ===

现在转到操作风险。
从下面五项中选出附录 F4 给出的四类结构控制。

# ui:type=multi
# ui:bind=operation_controls
# ui:option=limit::额度
# ui:option=least_privilege::最小权限
# ui:option=dual_review::双人复核
# ui:option=unreachable::不可越权状态
# ui:option=reconcile_again::再做一次对账
# ui:min=4
# ui:max=4
# ui:submit=提交操作控制
+ [继续]
    {operation_controls == "limit,least_privilege,dual_review,unreachable":
        你没有把“核对账目”和“阻止越权动作”混成同一个问题。
        -> incident
    }

    附录列出的操作风险结构控制是额度、最小权限、双人复核和不可越权状态。
    对账解决的是记录/关系不一致，不会自动让越权路径不可达。
    -> operation_risk

=== incident ===

如果运营事故已经发生并可能继续扩大，下一步怎样处理？

* [先把完整因果链全部查清，再决定是否停止新增暴露。]
    如果传播快于人工处置，等待完整因果确认可能让影响继续扩大。
    -> incident_retry

* [停止新增暴露，隔离账户/策略，限制传播，必要时降级服务，并在恢复前验证。]
    ~ controlled_exposure = true
    -> debrief

=== incident_retry ===

* [先控制新增暴露和传播，再继续根因分析与恢复验证。]
    ~ controlled_exposure = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

对现金流、头寸、交易记录和账户关系做对账，把残差当作线索，对应《衡算》；
追踪行情、基准、评级、模型输入和数据版本的来源、变更与影响分支，对应《定准》《传准》中的来源/可信链问题；
逐边问一个参数、数据源或权限变更为何牵动多个模块，对应《制耦》；
额度、最小权限、双人复核和不可越权状态，对应《防误》；
事故发生后停止新增暴露、隔离、限制传播、降级和恢复验证，对应《限败》。

到这里类比停止。
金融价格、信用、预期和流动性不是物质守恒量。本书可用于数据、流程、权限和运营风险的结构分析，不能替代金融经济学、风险计量、监管规则，也不能据此作投资判断。

-> finish

=== finish ===
~ case_complete = true
-> END
