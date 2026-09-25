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

GitHub Actions run `36071993875` at implementation head `5c030c05b833a72739d3028b9a0e4a8d94f16c6a`:

- 66 tests passed, 0 failed;
- TDD2-TEST-039..045 passed;
- static build generated 21 routes;
- primary case validation passed;
- headless Chrome regression smoke passed.

## Remaining gate

Production smoke for `longitudinal-ai-timeline-001` cannot occur before PR #16 is merged and GitHub Pages redeploys the new route.

Therefore RMD-GIT-012 is checkpoint-ready but still awaits explicit merge approval.
