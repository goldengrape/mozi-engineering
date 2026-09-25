# RMD-TASK-012 Publication QA

Date: 2026-09-24

## Baseline

The publication candidates are generated from the currently accessible v0.5.3 source artifacts.

The earlier v0.5.4 bytes are not available in the current conversation, so these files are deliberately not relabeled as v0.5.4/v0.5.5.

## Candidate artifacts

### Word

Filename:

`墨经补完_跨时代工程学教材_v0.5.3_全书互动练习集成候选版.docx`

SHA-256:

`55320b296cfff22797c7f1db3a209670c82d4224c99dfcdfcf61285cc380445a`

Structural checks:

- 21 unique case hyperlinks;
- 1 whole-site hyperlink;
- 21 occurrences of the no-web fallback marker;
- stable routes match `content/publication_map.json`.

Render evidence:

- LibreOffice/PDF render: 157 pages;
- the 30 pages containing any of the following markers were individually enlarged and visually inspected:
  - 网页版互动练习;
  - 扫码打开同一案例;
  - 如果现在不能打开网页;
  - 做完再看;
  - 贯穿互动练习.
- inspected pages: 10, 11, 15, 18, 19, 22, 23, 27, 32, 36, 37, 41, 42, 45, 48, 49, 53, 57, 61, 62, 66, 71, 75, 87, 88, 89, 90, 91, 92, 94;
- no clipping, overlap, broken QR rendering, or interaction-block/formula collision was observed on those pages.

Qualification:

This is a publication **candidate**, not a claim that all 157 pages received a fresh page-by-page visual review in this pass.

### EPUB

Filename:

`造物之理_跨时代工程方法导论_v0.5.3_全书互动练习集成候选版.epub`

SHA-256:

`32eb06cd15dfa12655bceef426369bdf036645ac2bf498384d38b8e5f9d2bd8f`

Structural checks:

- EPUB `mimetype` is the first ZIP entry and is stored uncompressed;
- 21 XML/XHTML/OPF/NCX/container documents parse successfully;
- 21 `interactive-entry` sections are present;
- 21 unique case routes are present;
- each case route appears as a clickable link plus visible URL text;
- one whole-site interaction-index link is present;
- no remote interaction script is embedded;
- no QR image payload is added to EPUB.

Qualification:

This pass establishes package/XML/link integrity. It does not claim exhaustive visual QA in multiple EPUB reader engines.

## Repository / runtime evidence

Final PR-head GitHub Actions run `36072921793` at `6f53121085666564c642f2d21149923fc76fbd79`:

- 66 tests passed, 0 failed;
- TDD2-TEST-039..045 passed;
- static build generated 21 routes;
- primary case validation passed;
- headless Chrome regression smoke passed.

## Production closure

PR #16 merged as `fc358c35068aabceee6860d3ed8b4cb984aa1d73`.

Pages workflow `36076953380` completed successfully and emitted artifact `10840536460` with digest:

`sha256:491b89a10a1bcb2fde514d8fa500b010cd025ed954208976ca1eca46a03bef94`

Public resolution checks passed for:

- the site home;
- `/cases/longitudinal-ai-timeline-001/`;
- its `manifest.json`;
- its compiled `story.json`.

The exact deployed artifact was separately rendered in Chromium at 1440×1000 and 390×844. At both widths:

- the home showed one 贯穿案例 section and the longitudinal entry;
- the longitudinal opening and both first choices were visible;
- no horizontal overflow was observed;
- selecting the first choice advanced the story;
- no console or page errors were observed.

The QA browser environment could not navigate the public GitHub Pages host directly. The evidence therefore combines public URL resolution with Chromium rendering of the exact Pages artifact rather than claiming a live-public-browser render.

RMD-GIT-012 is complete and Phase 2 is closed.
