---
type: decision
title: 通用播放器与静态构建
description: RMD-TASK-003 的 Web runtime、build output、测试证据与无案例耦合边界。
source_ids:
  - ADD-DP-003
  - ADD-DP-006
  - MDD-MOD-002
  - MDD-MOD-003
  - MDD-API-003
  - MDD-API-004
  - TDD-TEST-007
  - TDD-TEST-014
  - TDD-TEST-015
  - TDD-TEST-020
  - TDD-TEST-021
  - RMD-TASK-003
status: checkpoint_ready
---

# Runtime boundary

`src/player.js` is generic. It knows only:

- Ink text output;
- current choices;
- completion;
- restart;
- load failure.

It contains no case ID, method name, leakage logic, or learning-state interpretation. Case-specific pedagogy remains in `story.ink`.

# Static build

`scripts/build.cjs`:

1. validates all case packages before touching output;
2. compiles Ink to `story.json`;
3. copies the locked local inkjs browser runtime;
4. copies the generic player and CSS;
5. generates per-case HTML and a case registry;
6. writes disposable `dist/`.

Generated pages require no remote CDN.

# Verification

GitHub Actions run `35936809001`:

- 17 tests passed, 0 failed;
- static build passed;
- primary case validation passed;
- headless Chrome loaded the locally served generated page and rendered the opening plus both first choices.

The generic-player runtime test also walks `jieti-water-001` through a complete real path and reaches completion.

# Current gate

PR #6 is unmerged. RMD-TASK-004 remains blocked until RMD-GIT-003 merge approval.
