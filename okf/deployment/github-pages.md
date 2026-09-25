---
type: deployment
title: GitHub Pages 发布
description: RMD-TASK-004 的 registry 扩展、project Pages 路径、Pages Actions 工作流与生产烟测门槛。
source_ids:
  - ADD-DP-006
  - MDD-MOD-004
  - TDD-TEST-009
  - TDD-TEST-021
  - RMD-TASK-004
status: complete
---

# Registry

The static builder discovers authored case packages and generates `cases/index.json`.

Task 004 adds a two-case fixture test proving that a second case can be built and listed without changing `src/player.js`.

# Project Pages paths

Generated HTML uses relative paths rather than root-absolute `/assets/` references. This allows the same build to work under a repository Pages base path:

`https://goldengrape.github.io/mozi-engineering/`

# Production workflow

`.github/workflows/pages.yml` runs only on pushes to `main` or manual dispatch.

It:

1. installs the locked npm dependency set;
2. runs the full project check;
3. uploads generated `dist/`;
4. configures GitHub Pages;
5. deploys to the `github-pages` environment.

Official Actions used by the current GitHub Pages starter pattern:

- `actions/upload-pages-artifact@v3`
- `actions/configure-pages@v5`
- `actions/deploy-pages@v5`

# Current evidence

Pre-deploy branch run `35937736546`:

- 19 tests passed, 0 failed;
- static build passed;
- local headless Chrome smoke passed;
- second-case registry test passed;
- project-Pages relative-path test passed.

# Production attempt

PR #7 merged to `main` as `bbbeca30c6a0242d7860d04686b7d9b4a6d3ae05`.

Workflow run `35938292249` successfully:

- ran project checks;
- built the site;
- uploaded the Pages artifact.

After the owner enabled Pages, the rerun completed `actions/configure-pages@v5` and `actions/deploy-pages@v5` successfully and returned `https://goldengrape.github.io/mozi-engineering/`.

Public diagnostics then showed that the live site is still a Jekyll branch build: the root HTML announces `Jekyll v3.10.0`, does not match `dist/index.html`, and all artifact-only assets/case paths return 404. The downloaded production artifact was inspected and contains the missing paths.

# Final state

Pages Source is now **GitHub Actions**.

Production deployment workflow `35938292249` succeeded after the source switch.

Public URL:

`https://goldengrape.github.io/mozi-engineering/`

Public smoke run `35940775884` verified:

- home, assets, registry, case route, manifest and story all return HTTP 200;
- live root matches the generated `dist/index.html`;
- public case HTML has no remote script dependency;
- live case renders correctly in headless Chrome at 1440×1000 and 390×844;
- both viewports show the opening and both first choices.

RMD-TASK-004 is complete. RMD-TASK-005 may begin.

# Phase 2 final deployment

PR #16 merged as `fc358c35068aabceee6860d3ed8b4cb984aa1d73`.

Post-merge Pages workflow `36076953380` completed successfully. Artifact `10840536460` has digest `sha256:491b89a10a1bcb2fde514d8fa500b010cd025ed954208976ca1eca46a03bef94`.

Final checks:

- production home resolves and exposes the 贯穿案例 group;
- `longitudinal-ai-timeline-001`, its manifest, and its compiled story resolve publicly;
- the exact deployed artifact rendered cleanly at 1440×1000 and 390×844;
- no horizontal overflow or console/page error was observed;
- the first longitudinal choice advanced the story in both viewports.

Public URL resolution and deployed-artifact Chromium rendering were checked separately because the QA browser environment could not navigate the public GitHub Pages host directly.

This satisfies RMD-GIT-012 and closes Phase 2.
