// RMD-TASK-008 / Chapter 6
// Source facts are limited to the current textbook 《分任》 worked example.

VAR selected_functions = ""
VAR revised_function_list = false
VAR recognized_function_implementation_split = false
VAR debrief_reached = false
VAR case_complete = false

需求是：“人员接近时自动开门，避免夹人，断电时可以安全退出。”

团队已经有人写下“红外传感器—电机—减速器—控制器”。

先不要沿用这张零件表。
从下面十项中，选出六项真正描述“必须发生什么”的功能。

-> select_functions

=== select_functions ===

# ui:type=multi
# ui:bind=selected_functions
# ui:option=sense::感知通行请求
# ui:option=permit::判断是否允许开启
# ui:option=actuate::产生开闭作用
# ui:option=hold::保持开启或关闭状态
# ui:option=pinch::感知夹人风险
# ui:option=release::异常时释放并允许人工退出
# ui:option=infrared::红外传感器
# ui:option=motor::电机
# ui:option=gearbox::减速器
# ui:option=controller::控制器
# ui:min=6
# ui:max=6
# ui:submit=提交功能清单
+ [继续]
    {selected_functions == "sense,permit,actuate,hold,pinch,release":
        你留下的是六个作用，没有把当前零件名当成不可替代的功能。
        -> replacement_check
    }

    ~ revised_function_list = true
    这份清单里仍混有“怎么做”的答案，或者漏掉了需求要求的作用。

    教材给出的功能清单是：
    感知通行请求、判断是否允许开启、产生开闭作用、保持开启或关闭状态、感知夹人风险、异常时释放并允许人工退出。

    红外传感器、电机、减速器、控制器属于实现手段，不是功能本身。
    -> select_functions

=== replacement_check ===

教材给出几组可替代实现：
感知可以用红外、毫米波或压力垫；
执行可以用电机、气缸或弹簧储能；
异常释放可以机械脱开，也可以由失电打开结构实现。

如果把“红外传感器”换成“压力垫”，最准确的说法是什么？

* [“感知通行请求”这个功能仍然存在，只是实现变了。]
    ~ recognized_function_implementation_split = true
    -> debrief

* [因为部件变了，所以原来的功能也必须改名为“压力垫功能”。]
    部件名变化不等于功能变化。
    如果不同技术仍完成同一作用，功能层应保持稳定。
    -> replacement_retry

=== replacement_retry ===

* [把“要发生什么”和“用什么实现”重新分成两层。]
    ~ recognized_function_implementation_split = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{revised_function_list:
你第一次的清单把功能和部件混在了一起，后来把具体实现剥离出去。
}

你刚才做的核心动作，在本书中叫作《分任》：
先从目标和硬约束出发，用作用描述“必须发生什么”，再把这些功能映射到具体实现。

这道题的关键不是找到“最先进的自动门零件”，而是先得到不被现有方案锁死的功能清单。

功能清单稳定以后，后面的《制耦》和《分构》才有清楚的对象可以继续分析。

-> finish

=== finish ===
~ case_complete = true
-> END
