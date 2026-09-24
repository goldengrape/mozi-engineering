---
case_id: xianbai-battery-001
chapter_id: 16-xianbai
placement: worked-example-practice
---

### 互动任务：电池模块过热以后，不要把“停机”当成全部处理

储能柜某模块温度快速升到报警阈值以上。

**报警已经发生。接下来不能只写“停机处理”，要把停止增害、隔离、限害/降用、修复、复验和恢复分开。**

<!-- interactive-entry: xianbai-battery-001 -->

**网页版互动练习：** https://goldengrape.github.io/mozi-engineering/cases/xianbai-battery-001/

**如果现在不能打开网页：**

1. 写出 Normal → Detected → Isolated → Degraded/Safe → Repaired → Verified → Normal；
2. 分别写明“止”“隔”“限害/降用”在本例中具体做什么；
3. 把“更换模块”和“恢复 Normal”之间缺少的验证步骤补出来；
4. 解释为什么“报警—重启”会跳过故障控制和恢复验证。

> 来源约束：状态链、停止模块充放电、断开接触器并切断相邻传播路径、降低整柜功率/加强冷却/监视邻近模块、更换模块、绝缘/温升/通信/功能测试，以及“报警—重启”的失败路径，均来自现行教材《限败》完整例题。
