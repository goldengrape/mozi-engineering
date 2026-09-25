# TDD Phase 2 — Full-book Ink expansion

> This document adds test oracles for the full-book expansion. It does not replace the accepted MVP TDD.

## Scope

Phase 2 extends the existing decoupled architecture from one published case to all sixteen textbook chapters.

Source-derived facts are kept in `content/curriculum.json`; interaction design remains a separate design field.

## Contract tests

| ID | Contract | Oracle |
| --- | --- | --- |
| TDD2-TEST-001 | curriculum covers the sixteen textbook methods in source order | exactly 16 entries; method order matches the textbook |
| TDD2-TEST-002 | source structure and interaction design stay distinguishable | every chapter has source chapter/example fields and separate design primitive/mechanism fields |
| TDD2-TEST-003 | published case identity matches its textbook chapter | manifest case/chapter IDs match the curriculum entry |
| TDD2-TEST-004 | static build publishes curriculum metadata | `dist/curriculum.json` exists and preserves 16 entries |
| TDD2-TEST-005 | generic UI tag grammar is parsed | multi/number/rank tags become one normalized configuration |
| TDD2-TEST-006 | malformed UI configuration is rejected | missing bind / malformed option throws instead of guessing |
| TDD2-TEST-007 | Ink tags survive story continuation | compiled Ink fixture exposes the expected first structured primitive |
| TDD2-TEST-008 | generic player executes multi, number and rank | one real Ink fixture completes all three and bound variables contain submitted values |
| TDD2-TEST-009 | validation occurs before Ink commit | invalid structured input leaves the Ink variable unchanged and shows readable feedback |

## Regression requirements

Existing tests remain required:

- the Chapter 1 《界体》 case still compiles and completes;
- `src/player.js` still contains no case-specific pedagogy;
- static build remains CDN-free;
- browser smoke continues to render the existing case.

## Structured primitive rule

For `multi`, `number`, and `rank`:

1. Ink emits the generic UI tags;
2. exactly one Ink commit choice is present;
3. the browser collects and validates the learner input;
4. the browser writes only the declared Ink variable;
5. Ink resumes and owns all interpretation, branching and feedback.

A primitive is not accepted if answer meaning or chapter-specific scoring is moved into JavaScript.

## Phase 2 execution slices

- RMD-TASK-006 — curriculum registry + primitive runtime
- RMD-TASK-007 — 察物 chapters 2–5
- RMD-TASK-008 — 制物 chapters 6–8
- RMD-TASK-009 — 制物 chapters 9–12
- RMD-TASK-010 — 运行 / 守败 chapters 13–16
- RMD-TASK-011 — mixed retrieval/transfer cases
- RMD-TASK-012 — longitudinal case + whole-book publication integration


## Chapter-case path test ranges

| IDs | Slice | Oracle focus |
| --- | --- | --- |
| TDD2-TEST-010..015 | 察物 chapters 2–5 | residual-vs-cause, stateful reference, downstream lineage, independent evidence, stable book identity |
| TDD2-TEST-016..020 | 制物 chapters 6–8 | function-vs-implementation, coupling-edge necessity, interface burden, generic-player decoupling |
| TDD2-TEST-021..025 | 制物 chapters 9–12 | DOF/overconstraint, tolerance propagation, reversal identifiability, reproducible specification |
| TDD2-TEST-026..030 | 运行 / 守败 chapters 13–16 | state precedence vs resource conflict, moving bottleneck, structural mistake-proofing, failure-state sequencing, all-16 publication identity |

TDD2-TEST-030 is the first whole-book chapter-case contract: all sixteen curriculum entries must be published, have matching case/chapter identity, and retain a no-web exercise in the book fragment.


## Mixed retrieval / transfer tests

| IDs | Contract | Oracle |
| --- | --- | --- |
| TDD2-TEST-031 | mixed practice registry covers Appendix F1–F4 | four unique published practices; no `target_methods` answer list |
| TDD2-TEST-032 | method labels stay hidden before debrief | no `《method》` label in mixed story source before `=== debrief ===`; debrief maps actions back to relevant methods |
| TDD2-TEST-033 | F1 clinical/patient-safety transfer | boundary split → calibration lineage → structural medication controls → adverse-event control |
| TDD2-TEST-034 | F2 biological-reproduction transfer | boundary → confounding redesign → independent relation → reproducibility record |
| TDD2-TEST-035 | F3 agriculture/open-system transfer | moving boundary → field comparison → timing/capacity distinction → spread control |
| TDD2-TEST-036 | F4 payment-operations transfer | reconciliation → lineage/coupling → operation controls → exposure containment |
| TDD2-TEST-037 | build publishes chapter + mixed sets without answer leakage | 20 routes = 16 chapter + 4 mixed; mixed registry entries have no `method` field |
| TDD2-TEST-038 | mixed book identity and no-web contract | manifest identity, stable route, no-web exercise and source boundary are present |

Mixed practices must preserve the professional stop-boundaries stated in Appendix F. Passing these tests validates the exercise mechanics and source discipline, not professional-domain correctness beyond what the textbook source claims.


## Longitudinal / publication integration tests

| IDs | Contract | Oracle |
| --- | --- | --- |
| TDD2-TEST-039 | Appendix G longitudinal identity | practice registry contains one `kind: longitudinal` entry bound to Appendix G |
| TDD2-TEST-040 | longitudinal method labels stay hidden | no `《method》` label before final debrief |
| TDD2-TEST-041 | one project traverses the source-grounded decision chain | tested correction path covers boundary, functions, coupling, evidence, specification, tolerance, flow, prevention and recovery |
| TDD2-TEST-042 | static build publishes three practice groups | 21 routes = 16 chapter + 4 mixed + 1 longitudinal |
| TDD2-TEST-043 | publication map covers all published interactive objects | 21 unique entries exactly match curriculum + practice registries |
| TDD2-TEST-044 | publication entries preserve route/no-web identity | each mapped case has the same stable URL and a no-web book fragment |
| TDD2-TEST-045 | publication anchors are unique | 21 unique heading anchors; Appendix G uses its own longitudinal identity |

Publication tests validate identity and source/integration contracts. Binary Word/EPUB rendering/package QA is recorded separately in `docs/PUBLICATION_QA_TASK012.md`.
