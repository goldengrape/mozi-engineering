const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const {
  loadCasePackage,
  compileStory
} = require("../scripts/case-package.cjs");
const { continueStory, parseUiTags } = require("../src/player.js");

function newStory(caseId) {
  const pkg = loadCasePackage(
    path.resolve("content/cases", caseId)
  );
  return compileStory(pkg.storySource).runtime;
}

function advance(story) {
  return continueStory(story);
}

function choiceTexts(story) {
  return story.currentChoices.map((choice) => choice.text);
}

function choose(story, pattern) {
  const index = story.currentChoices.findIndex((choice) =>
    pattern.test(choice.text)
  );

  assert.notEqual(
    index,
    -1,
    `choice not found: ${pattern}; available: ${choiceTexts(story).join(" | ")}`
  );

  story.ChooseChoiceIndex(index);
  return advance(story);
}

function submit(story, variable, value) {
  assert.equal(
    story.currentChoices.length,
    1,
    `structured step must expose one commit choice; got ${story.currentChoices.length}`
  );
  story.variablesState[variable] = value;
  story.ChooseChoiceIndex(0);
  return advance(story);
}

function value(story, name) {
  return story.variablesState[name];
}

test("TDD2-TEST-010: Chapter 2 keeps residual separate from cause and reaches debrief", () => {
  const story = newStory("hengsuan-balance-001");
  const opening = advance(story);
  const numberConfig = parseUiTags(opening.tags);

  assert.doesNotMatch(opening.text, /《衡算》/);
  assert.match(opening.text, /100 kg/);
  assert.match(opening.text, /72 kg/);
  assert.match(opening.text, /8 kg/);
  assert.match(opening.text, /15 kg/);
  assert.equal(numberConfig.type, "number");
  assert.equal(numberConfig.bind, "residual_guess");

  let out = submit(story, "residual_guess", 5);
  assert.match(out.text, /5 kg\/h/);

  out = choose(story, /只把它记作残差/);
  const multiConfig = parseUiTags(out.tags);
  assert.equal(multiConfig.type, "multi");
  assert.equal(multiConfig.bind, "investigation_paths");

  out = submit(
    story,
    "investigation_paths",
    "exchange,internal,measurement"
  );
  assert.match(out.text, /三类来源/);

  out = choose(story, /不能。还要检查这些量是否共享同一偏差来源/);
  assert.match(out.text, /《衡算》/);
  assert.equal(value(story, "recognized_false_closure"), true);
  assert.equal(value(story, "debrief_reached"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-011: Chapter 2 wrong naming and incomplete investigation remain recoverable", () => {
  const story = newStory("hengsuan-balance-001");
  advance(story);
  submit(story, "residual_guess", 7);

  let out = choose(story, /先把它叫作“损耗”/);
  assert.match(out.text, /原因判断/);

  out = submit(story, "investigation_paths", "exchange");
  assert.match(out.text, /还不足以覆盖/);
  assert.equal(value(story, "revised_investigation"), true);

  out = choose(story, /补齐三类调查/);
  assert.match(out.text, /2%/);
  choose(story, /不能。还要检查这些量是否共享同一偏差来源/);

  assert.equal(value(story, "guessed_loss"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-012: Chapter 3 treats the reference as stateful and traces from last trusted time", () => {
  const story = newStory("dingzhun-torque-001");
  const opening = advance(story);

  assert.doesNotMatch(opening.text, /《定准》/);
  assert.match(opening.text, /6 月 1 日/);
  assert.match(opening.text, /8 月 20 日/);
  assert.match(opening.text, /9 月 1 日/);
  assert.match(opening.text, /52 N·m/);

  let out = choose(story, /把扳手调回 50 N·m/);
  assert.match(out.text, /当前值/);
  out = choose(story, /先停用/);
  assert.match(out.text, /最近一次可信状态/);

  out = choose(story, /只查 9 月 1 日当天/);
  assert.match(out.text, /发现偏差的时点不等于偏差开始的时点/);
  out = choose(story, /改为从 6 月 1 日以后追查/);
  assert.match(out.text, /重新校准以后/);

  out = choose(story, /已经调回 50 N·m/);
  assert.match(out.text, /调整不是恢复可信状态/);
  out = choose(story, /重新验证/);

  assert.match(out.text, /《定准》/);
  assert.equal(value(story, "traced_from"), "jun1");
  assert.equal(value(story, "verified_before_return"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-013: Chapter 4 computes and revises the minimum downstream impact set", () => {
  const story = newStory("chuanzhun-benchmark-001");
  let out = advance(story);
  const config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《传准》/);
  assert.match(out.text, /A 校到 B/);
  assert.match(out.text, /\+3 mm/);
  assert.equal(config.type, "multi");

  out = submit(story, "affected_nodes", "A,C");
  assert.match(out.text, /还不是最小影响集/);
  assert.equal(value(story, "revised_impact"), true);

  const retryConfig = parseUiTags(out.tags);
  assert.equal(retryConfig.type, "multi");

  out = submit(story, "affected_nodes", "C,D,E");
  assert.match(out.text, /C、D、E/);

  out = choose(story, /无法精确沿支链追查/);
  assert.match(out.text, /《传准》/);
  assert.match(out.text, /\{C,D,E\}/);
  assert.equal(value(story, "recognized_records_value"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-014: Chapter 5 replaces shared bias with independent evidence", () => {
  const story = newStory("canyan-model-001");
  let out = advance(story);

  assert.doesNotMatch(out.text, /《参验》/);
  assert.match(out.text, /88%/);
  assert.match(out.text, /93%/);

  out = choose(story, /93% 明显高于 88%/);
  assert.match(out.text, /同一个偏差/);
  assert.match(out.text, /数据泄漏/);

  let config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");
  assert.equal(config.options.length, 4);

  out = submit(story, "redesign_items", "user_group");
  assert.match(out.text, /还包括/);
  assert.equal(value(story, "revised_design"), true);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(
    story,
    "redesign_items",
    "user_group,independent_test,separate_eval,external_data"
  );
  assert.match(out.text, /87.5%/);
  assert.match(out.text, /88.1%/);

  out = choose(story, /换掉共同偏差来源/);
  assert.match(out.text, /《参验》/);
  assert.equal(value(story, "recognized_independence"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-015: Chapters 2–5 manifests and book fragments keep stable identity and no-web tasks", () => {
  const cases = [
    ["hengsuan-balance-001", "02-hengsuan"],
    ["dingzhun-torque-001", "03-dingzhun"],
    ["chuanzhun-benchmark-001", "04-chuanzhun"],
    ["canyan-model-001", "05-canyan"]
  ];

  for (const [caseId, chapterId] of cases) {
    const pkg = loadCasePackage(path.resolve("content/cases", caseId));

    assert.equal(pkg.manifest.case_id, caseId);
    assert.equal(pkg.manifest.textbook.chapter_id, chapterId);
    assert.match(pkg.book.body, /如果现在不能打开网页/);
    assert.match(
      pkg.book.body,
      new RegExp(
        `https://goldengrape\\.github\\.io/mozi-engineering/cases/${caseId}/`
      )
    );
  }
});
