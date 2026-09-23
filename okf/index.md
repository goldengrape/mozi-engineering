---
okf_version: "0.1"
---

# OKF Bundle Index

> Derived from `docs/`. Do not introduce new requirements here.

## Current phase

The project is at the **ADD / Design Split checkpoint**.

URD-0001 is accepted. The owner added one important requirement: interactive tasks must be designed as part of the textbook body, while the web runtime executes the branching behavior.

No feature implementation should start before ADD-0001 is accepted.

## Current design summary

- stable case package identity
- textbook-body insert (`book.md`)
- Ink source (`story.ink`)
- generic browser player using inkjs
- learning-state variables inside Ink
- state-aware debrief inside Ink
- generic case registry/build convention

The design is currently classified as **decoupled**, with two intentional one-way dependencies: learning state → debrief, and case manifest → registry/build.

## Source documents

- `docs/URD.md` — accepted user intent, scope and acceptance criteria.
- `docs/ADD.md` — current Design Split and coupling analysis.
- `docs/MDD.md` — blocked until ADD approval.
- `docs/TDD.md` — blocked until ADD/MDD provide interfaces.
- `docs/RMD.md` — implementation blocked.
- `docs/TRACE.md` — current project map.
