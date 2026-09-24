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
status: predeploy_checkpoint_ready
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

# Remaining gate

Task 004 is not complete until PR #7 is merged and the production Pages workflow succeeds from `main`.

After deployment, verify the public home page and `cases/jieti-water-001/` route at desktop and mobile-width conditions. Only then may RMD-TASK-005 begin.
