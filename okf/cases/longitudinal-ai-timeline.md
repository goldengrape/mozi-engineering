---
type: cases
title: Appendix G 贯穿案例与全书出版集成
description: 同一历史灾异时间线项目的连续方法切换，以及 21 个互动入口的 Word/EPUB 发布契约。
source_ids:
  - RMD-TASK-012
  - TDD2-TEST-039
  - TDD2-TEST-040
  - TDD2-TEST-041
  - TDD2-TEST-042
  - TDD2-TEST-043
  - TDD2-TEST-044
  - TDD2-TEST-045
status: complete
---

# Longitudinal case

`longitudinal-ai-timeline-001` is grounded in Appendix G1–G10.

One digital-humanities timeline project moves continuously through:

- problem boundary;
- function vs technology stack;
- unnecessary change propagation;
- provenance and independent validation;
- reproducible external definition;
- presentation tolerance vs factual tolerance;
- true state precedence vs resource waiting;
- structural mistake-proofing;
- degraded offline mode and verified recovery.

Method labels remain hidden until the final debrief.

The case deliberately does **not** force all sixteen methods into one project. It follows the methods that Appendix G actually uses.

# Publication map

`content/publication_map.json` binds every published interactive object to the existing textbook:

- 16 chapter cases;
- 4 Appendix-F mixed practices;
- 1 Appendix-G longitudinal practice.

Each entry records:

- stable case ID;
- exact heading anchor;
- insertion offset;
- EPUB XHTML file;
- stable public route.

# Candidate artifacts

Word:

`墨经补完_跨时代工程学教材_v0.5.3_全书互动练习集成候选版.docx`

EPUB:

`造物之理_跨时代工程方法导论_v0.5.3_全书互动练习集成候选版.epub`

Both remain explicitly tied to the accessible v0.5.3 baseline.

# QA

Repository/runtime:

- Actions `36071993875`: 66/66 tests;
- build: 21 routes;
- case validation: passed;
- browser smoke: passed.

Word:

- 157-page render generated;
- 30 pages containing interaction-entry markers were individually inspected;
- no observed clipping/overlap/QR breakage on those pages.

EPUB:

- valid first uncompressed mimetype entry;
- all XML/XHTML package documents parse;
- 21 interaction sections / 21 unique case routes;
- no remote scripts or QR payload.

# Production closure

PR #16 merged as `fc358c35068aabceee6860d3ed8b4cb984aa1d73`.

Pages run `36076953380` completed successfully. The public home, longitudinal route, manifest and story resolve. The exact deployed Pages artifact passed Chromium smoke at 1440×1000 and 390×844 with no observed horizontal overflow or console/page errors, and the first choice advanced the story in both viewports.

RMD-GIT-012 is satisfied. Phase 2 is complete.
