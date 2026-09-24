---
type: requirement
title: 教材正文中的互动任务
description: 说明为什么互动练习必须进入教材正文，以及正文与网页各自承担什么。
source_ids:
  - URD-GOAL-003
  - URD-REQ-011
  - URD-REQ-012
  - URD-AC-009
  - URD-AC-010
status: accepted
---

# 核心要求

互动任务不是教材外部的“附加网站”。

每个案例都必须有一个可直接放入对应章节正文的 `book.md`，其中至少包含：

- 无标签开场情境；
- 第一次判断或动作；
- 互动网页入口；
- 没有网页时仍可执行的最小替代练习。

网页负责运行分支、记录本次路径和提供即时反馈；正文负责决定这个互动发生在学习流程的什么位置。

# 稳定身份

正文块、Ink 故事与网页 route 共享稳定 `case_id`。首个案例：

`jieti-water-001`

展示标题可以修改，已发布 case ID 原则上不改。


# Published first-case entry

The stable public entry for the first textbook task is:

`https://goldengrape.github.io/mozi-engineering/cases/jieti-water-001/`

The printed/Word form may pair this visible URL with a QR code. EPUB uses the same URL as a clickable link. The URL or QR is never the only exercise content; the no-web first-judgment task remains in the body.
