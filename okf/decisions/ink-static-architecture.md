---
type: decision
title: Ink + 静态网页架构
description: 首个原型为什么采用 Ink/inkjs 与通用静态播放器。
source_ids:
  - ADD-DP-002
  - ADD-DP-003
  - ADD-DP-004
  - ADD-DP-005
  - MDD-MOD-001
  - MDD-MOD-002
  - MDD-MOD-003
status: accepted
---

# 决定

案例特定的教学逻辑全部留在 Ink：

- 分支；
- 新证据；
- 错误路径的后果；
- 学习状态；
- 条件复盘。

JavaScript 播放器只负责通用运行和显示，不知道《界体》的“正确答案”。

# 技术边界

首个版本使用：

- HTML / CSS / 原生 JavaScript；
- Ink / Inky；
- inkjs；
- Node.js 构建与测试；
- GitHub Pages 静态托管。

当前不使用前端框架、数据库、账号、云同步或运行时 LLM。

# 为什么

这样新增案例时，主要增加新的案例包，而不是修改播放器。它保持了 ADD 中的 decoupled 结构。
