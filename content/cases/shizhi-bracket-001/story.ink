// RMD-TASK-009 / Chapter 12
// Source facts are limited to the current textbook 《示制》 worked example.

VAR missing_relations = ""
VAR revised_spec = false
VAR recognized_independent_reproduction = false
VAR debrief_reached = false
VAR case_complete = false

某支架图已经给出孔径、外形尺寸和板厚。
三家工厂都“按图加工”，孔的绝对位置却相差 0.6 mm，其中一家装配后无法对准。

从下面六项中，选出图样还缺少的三类关键定义。

-> spec_review

=== spec_review ===

# ui:type=multi
# ui:bind=missing_relations
# ui:option=datum::孔位置相对于哪个基准建立
# ui:option=flatness::接触面平面度
# ui:option=orientation::装配方向
# ui:option=hole_diameter::孔径
# ui:option=outline::外形尺寸
# ui:option=thickness::板厚
# ui:min=3
# ui:max=3
# ui:submit=提交缺失定义
+ [继续]
    {missing_relations == "datum,flatness,orientation":
        你把“已经写了什么”和“仍缺什么”分开了。
        -> revised_definition
    }

    ~ revised_spec = true
    孔径、外形尺寸和板厚已经在原图上。
    真正缺少的是孔位置基准、接触面平面度和装配方向。
    -> spec_review

=== revised_definition ===

修订后的定义先写功能接口：

A 面负责安装贴合；
B 边确定横向位置；
C 孔轴线与配对件同轴；
再以 A、B 建立孔位置，并给出直接影响装配的几何要求。

修订以后，怎样验证这份表达已经足够？

* [让原设计团队再读一遍，只要大家都觉得清楚就算通过。]
    原设计团队共享大量默会信息，未必能暴露表达里仍然缺失的关系。
    -> reproduction_retry

* [交给未参加设计讨论的第四家工厂独立试制，看能否复现目标关系。]
    ~ recognized_independent_reproduction = true
    -> debrief

=== reproduction_retry ===

* [改用未参与原设计的人独立复作来检验表达。]
    ~ recognized_independent_reproduction = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{revised_spec:
你第一次仍把“信息很多”和“关键关系充分”混在一起，后来把已给尺寸与缺失的基准、平面度和方向分开。
}

你刚才做的核心动作，在本书中叫作《示制》：
把关键设计关系写到可传递的载体中，再让不共享原设计者默会知识的人独立复现。

这道题的问题不是图纸“尺寸不够多”，而是孔位置没有稳定基准，接触面和平装方向也没有被充分定义。

表达是否充分，要由他人能否据此复现关键关系来检验。

-> finish

=== finish ===
~ case_complete = true
-> END
