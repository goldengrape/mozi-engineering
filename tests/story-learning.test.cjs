const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const {
  loadCasePackage,
  compileStory
} = require("../scripts/case-package.cjs");

const CASE_DIR = path.resolve("content/cases/jieti-water-001");

function newStory() {
  const pkg = loadCasePackage(CASE_DIR);
  return compileStory(pkg.storySource).runtime;
}

function readUntilChoice(story) {
  return story.ContinueMaximally();
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
  return story.ContinueMaximally();
}

function variable(story, name) {
  return story.variablesState[name];
}

function walkPathA() {
  const story = newStory();
  const outputs = [];

  outputs.push(readUntilChoice(story));
  outputs.push(choose(story, /先查主表究竟把哪些用水算在一起/));
  outputs.push(choose(story, /把这些跨界用水单独列出来/));
  outputs.push(choose(story, /60 m³ 还不能直接命名成原因/));
  outputs.push(choose(story, /改界改变了原因判断/));
  outputs.push(choose(story, /把冷却系统作为已经明确的对象/));

  return { story, outputs };
}

function walkPathB() {
  const story = newStory();
  const outputs = [];

  outputs.push(readUntilChoice(story));
  outputs.push(choose(story, /先按“楼内漏水 180 m³”处理/));
  outputs.push(choose(story, /把这些跨界用水单独列出来/));
  outputs.push(choose(story, /已经改过一次边界/));
  outputs.push(choose(story, /继续看分表/));
  outputs.push(choose(story, /改界改变了原因判断/));
  outputs.push(choose(story, /把冷却系统作为已经明确的对象/));

  return { story, outputs };
}

test("TDD-TEST-002/017: first decision does not leak the method label", () => {
  const story = newStory();
  const opening = readUntilChoice(story);
  const firstDecision = [opening, ...choiceTexts(story)].join("\n");

  assert.doesNotMatch(firstDecision, /《界体》|《衡算》|本题.*界体/);
  assert.match(firstDecision, /1000 m³/);
  assert.match(firstDecision, /1180 m³/);
  assert.equal(story.currentChoices.length, 2);
});

test("TDD-TEST-003/018: the first two decisions create real divergence", () => {
  const a = newStory();
  readUntilChoice(a);
  const aText = choose(a, /先查主表/);

  const b = newStory();
  readUntilChoice(b);
  const bText = choose(b, /先按“楼内漏水 180 m³”处理/);

  assert.notEqual(aText, bText);
  assert.equal(variable(a, "checked_boundary"), true);
  assert.equal(variable(a, "premature_leak_claim"), false);
  assert.equal(variable(b, "premature_leak_claim"), true);
  assert.match(aText, /屋顶冷却补水/);
  assert.match(bText, /屋顶冷却补水/);
});

test("TDD-TEST-004: premature leak attribution remains recoverable", () => {
  const story = newStory();
  readUntilChoice(story);

  const consequence = choose(story, /先按“楼内漏水 180 m³”处理/);
  assert.match(consequence, /主表.*不只是楼内日常使用/s);
  assert.doesNotMatch(consequence, /答错|错误答案/);

  const revised = choose(story, /把这些跨界用水单独列出来/);
  assert.match(revised, /绿化：70 m³/);
  assert.match(revised, /施工用水：50 m³/);
  assert.match(revised, /60 m³/);

  assert.equal(variable(story, "premature_leak_claim"), true);
  assert.equal(variable(story, "revised_after_evidence"), true);
  assert.equal(variable(story, "checked_boundary"), true);
});

test("TDD-TEST-005: debrief changes with the learner's earlier path", () => {
  const a = walkPathA();
  const b = walkPathB();

  const aDebrief = a.outputs[4];
  const bDebrief = b.outputs[5];

  assert.notEqual(aDebrief, bDebrief);
  assert.match(aDebrief, /没有先给 180 m³ 命名成原因/);
  assert.match(bDebrief, /一开始把“增加 180 m³”直接当成了“楼内漏水 180 m³”/);
  assert.match(bDebrief, /中途曾想把剩余 60 m³ 直接命名成原因/);
});

test("TDD-TEST-006: method names appear in debrief and switch explanation", () => {
  const { story, outputs } = walkPathA();
  const debrief = outputs[4];
  const finish = outputs[5];

  assert.match(debrief, /《界体》/);
  assert.match(finish, /从《界体》转向《衡算》/);
  assert.equal(variable(story, "recognized_switch_to_balance"), true);
});

test("TDD-TEST-019: both fixed paths reach debrief and completion", () => {
  for (const result of [walkPathA(), walkPathB()]) {
    assert.equal(variable(result.story, "debrief_reached"), true);
    assert.equal(variable(result.story, "case_complete"), true);
    assert.equal(result.story.currentChoices.length, 0);
  }
});

test("boundary-too-wide path explains why expansion is not the goal", () => {
  const story = newStory();
  readUntilChoice(story);
  choose(story, /先查主表/);

  const feedback = choose(story, /把边界扩大到整个校园/);
  assert.match(feedback, /并不自动增加解释力/);
  assert.match(feedback, /更多无关对象/);
  assert.equal(variable(story, "overexpanded_boundary"), true);

  const resumed = choose(story, /回到主表/);
  assert.match(resumed, /绿化：70 m³/);
  assert.equal(variable(story, "checked_boundary"), true);
});
