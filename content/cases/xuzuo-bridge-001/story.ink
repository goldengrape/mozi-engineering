// RMD-TASK-010 / Chapter 13
// Source facts are limited to the current textbook 《序作》 worked example.

VAR ordered_stages = ""
VAR revised_order = false
VAR separated_resource_conflict = false
VAR recognized_release_point = false
VAR debrief_reached = false
VAR case_complete = false

桥面小段施工包含：
A 支模；B 绑扎钢筋；C 安装预埋件；D 隐蔽验收；E 浇筑混凝土；F 养护；G 拆模。

教材给出的真实依赖是：
A→B/C，B/C→D，D→E，E→F，F 达到规定状态后→G。
B 与 C 若互不遮挡，可以并行。

请按状态依赖排列六个阶段。

# ui:type=rank
# ui:bind=ordered_stages
# ui:option=A::A 支模
# ui:option=BC::B 绑扎钢筋 / C 安装预埋件（可并行阶段）
# ui:option=D::D 隐蔽验收
# ui:option=E::E 浇筑混凝土
# ui:option=F::F 养护
# ui:option=G::G 拆模
# ui:submit=提交顺序
+ [继续]
    {ordered_stages == "A,BC,D,E,F,G":
        你按真实状态依赖排出了主链，同时没有强迫 B、C 互相等待。
        -> crane
    }

    ~ revised_order = true
    这条流程的主链应是：
    A → B/C → D → E → F → G。
    B、C 若互不遮挡，不需要彼此制造先后。
    -> retry_order

=== retry_order ===

* [按 A → B/C → D → E → F → G 重排。]
    ~ ordered_stages = "A,BC,D,E,F,G"
    -> crane

=== crane ===

现在假设现场只有一台吊机，导致 B、C 不能同时作业。
这是否应该在逻辑依赖图里加一条 B→C 或 C→B？

* [应该。现场做不到并行，就说明它们必然有逻辑先后。]
    只有一台吊机限制的是资源。
    增加资源以后，如果 B、C 仍互不遮挡，它们就可以并行，所以这不是状态依赖。
    -> crane_retry

* [不应该。把它另记为资源冲突，不把资源不足伪装成逻辑边。]
    ~ separated_resource_conflict = true
    -> release_point

=== crane_retry ===

* [把“一台吊机”从逻辑依赖中移出，单独作为资源约束。]
    ~ separated_resource_conflict = true
    -> release_point

=== release_point ===

E 浇筑混凝土一旦执行，会遮蔽钢筋和预埋件。
因此 D 隐蔽验收应该怎样处理？

* [D 可以放到 E 以后，只要最终还能检查记录。]
    E 会遮蔽前序结果。等浇筑以后再把 D 当普通检查，已经失去原来的可见状态。
    -> release_retry

* [D 必须在 E 前完成，并作为 E 的放行点。]
    ~ recognized_release_point = true
    -> debrief

=== release_retry ===

* [把 D 放在 E 前，并把它定义成不可逆动作前的放行检查。]
    ~ recognized_release_point = true
    -> debrief

=== debrief ===

~ debrief_reached = true

复盘：

{revised_order:
你第一次把流程顺序排错，后来回到“每一步需要什么前置状态”重排，而不是按习惯顺序硬排。
}

你刚才做的核心动作，在本书中叫作《序作》：
先写前置状态和完成状态，只让真实状态依赖进入先后关系。

这道题里，B 与 C 可以并行；“只有一台吊机”只是资源冲突。
D 必须在 E 前作为放行点，因为 E 会遮蔽钢筋和预埋件。

-> finish

=== finish ===
~ case_complete = true
-> END
