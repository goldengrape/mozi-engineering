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
