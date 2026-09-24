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
status: pages_source_mode_blocked
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

# Owner action required

`Settings → Pages → Build and deployment → Source → GitHub Actions`

The exact **Source** must be `GitHub Actions`, not `Deploy from a branch`. Then rerun the production Pages workflow.

# Remaining gate

Task 004 remains incomplete until the public home page and `cases/jieti-water-001/` route pass desktop/mobile-width smoke checks. Only then may RMD-TASK-005 begin.
