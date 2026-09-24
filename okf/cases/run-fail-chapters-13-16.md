---
type: cases
title: 运行与守败第 13–16 章互动案例
description: 序作、通滞、防误、限败四章的来源边界、互动动作与验证证据。
source_ids:
  - RMD-TASK-010
  - TDD2-TEST-026
  - TDD2-TEST-027
  - TDD2-TEST-028
  - TDD2-TEST-029
  - TDD2-TEST-030
status: checkpoint_ready
---

# Cases

## 序作 — xuzuo-bridge-001

Source facts:

- A 支模、B 绑扎钢筋、C 安装预埋件、D 隐蔽验收、E 浇筑、F 养护、G 拆模；
- 真实依赖：A→B/C，B/C→D，D→E，E→F，F 达到规定状态后→G；
- B/C 若互不遮挡可以并行；
- 一台吊机造成的是资源冲突，不是逻辑依赖；
- E 会遮蔽钢筋和预埋件，因此 D 必须作为 E 前的放行点。

Interaction:

`rank A→B/C→D→E→F→G → resource-vs-logic judgment → release-point judgment → debrief`

The rank UI combines B/C into one design-derived parallel stage so the exercise does not invent a false B→C or C→B precedence.

## 通滞 — tongzhi-packaging-001

Source facts:

- four capacities = 12, 15, 8, 20 件/小时;
- current long-run throughput is limited to about 8;
- packaging 20→40 does not change whole-flow throughput;
- upstream continuing at 15 increases WIP;
- raising stage 3 from 8 to 14 moves the limit to stage 1 at 12.

Interaction:

`number initial throughput → packaging temptation → WIP consequence → number new throughput → moving-bottleneck judgment → debrief`

## 防误 — fangwu-gas-001

Source facts:

- nitrogen and flammable-gas quick connectors initially have identical shape and only color labels;
- low light, color-vision differences, missing labels or distraction leave the wrong path reachable;
- redesign uses different keying, different mechanical dimensions and full-lock interlock;
- verification attacks reverse insertion, partial insertion, cross-connection and interlock bypass.

Interaction:

`label-dependence temptation → multi structural controls → multi attack paths → debrief`

## 限败 — xianbai-battery-001

Source facts:

- battery module temperature rises above alarm threshold;
- stop module charge/discharge;
- disconnect module contactor and cut adjacent propagation path;
- reduce cabinet power, strengthen cooling and monitor adjacent modules;
- repair/replace;
- verify insulation, temperature rise, communication and function;
- only then restore Normal;
- “alarm → restart” is the explicit failure path.

Interaction:

`restart temptation → rank stop/isolate/degrade/repair/verify/restore → repaired-vs-verified judgment → debrief`

# Verification

Actions run `35963452549`:

- 51 tests passed, 0 failed;
- TDD2-TEST-026..030 passed;
- all previous chapter and runtime regressions passed;
- static build generates all sixteen authored chapter cases;
- primary case validation and headless Chrome smoke passed.

# Current gate

PR #14 is unmerged. RMD-TASK-011 is blocked until RMD-GIT-010 merge approval.
