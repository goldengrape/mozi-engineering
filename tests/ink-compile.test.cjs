const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { loadCasePackage, compileStory } = require("../scripts/case-package.cjs");

const CASE_DIR = path.resolve("content/cases/jieti-water-001");

test("TDD-TEST-013: story.ink compiles and starts in inkjs", () => {
  const pkg = loadCasePackage(CASE_DIR);
  const { json, runtime } = compileStory(pkg.storySource);

  assert.ok(json.length > 0);
  assert.equal(runtime.canContinue, true);
  const firstText = runtime.ContinueMaximally();
  assert.match(firstText, /1000 m³/);
  assert.match(firstText, /1180 m³/);
  assert.ok(runtime.currentChoices.length >= 2);
});
