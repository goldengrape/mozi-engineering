const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  loadCasePackage,
  compileStory
} = require("../scripts/case-package.cjs");
const { continueStory, parseUiTags } = require("../src/player.js");
const { loadCurriculum } = require("../scripts/curriculum.cjs");

function newStory(caseId) {
  const pkg = loadCasePackage(path.resolve("content/cases", caseId));
  return compileStory(pkg.storySource).runtime;
}

function advance(story) {
  return continueStory(story);
}

function choose(story, pattern) {
  const index = story.currentChoices.findIndex((choice) =>
    pattern.test(choice.text)
  );

  assert.notEqual(
    index,
    -1,
    `choice not found: ${pattern}; available: ${story.currentChoices
      .map((choice) => choice.text)
      .join(" | ")}`
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

test("TDD2-TEST-016: Chapter 6 separates functions from implementations and allows revision", () => {
  const story = newStory("fenren-door-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《分任》/);
  assert.match(out.text, /人员接近时自动开门/);
  assert.equal(config.type, "multi");
  assert.equal(config.bind, "selected_functions");
  assert.equal(config.options.length, 10);
  assert.equal(config.min, 6);
  assert.equal(config.max, 6);

  out = submit(
    story,
    "selected_functions",
    "sense,permit,actuate,hold,pinch,motor"
  );
  assert.match(out.text, /实现手段/);
  assert.equal(value(story, "revised_function_list"), true);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(
    story,
    "selected_functions",
    "sense,permit,actuate,hold,pinch,release"
  );
  assert.match(out.text, /六个作用/);
  assert.match(out.text, /红外、毫米波或压力垫/);

  out = choose(story, /“感知通行请求”这个功能仍然存在/);
  assert.match(out.text, /《分任》/);
  assert.equal(
    value(story, "recognized_function_implementation_split"),
    true
  );
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-017: Chapter 7 removes only unsupported change-propagation edges", () => {
  const story = newStory("zhiou-robot-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《制耦》/);
  assert.match(out.text, /L→N、L→O、L→T、L→P/);
  assert.equal(config.type, "multi");

  out = submit(story, "removable_edges", "LN,LT");
  assert.match(out.text, /N、O 确实需要定位时序/);
  assert.match(out.text, /L→T 与 L→P/);
  assert.equal(value(story, "revised_edges"), true);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(story, "removable_edges", "LT,LP");
  assert.match(out.text, /位置\+时间戳/);
  assert.match(out.text, /功率请求/);

  out = choose(story, /只要传播可以排序/);
  assert.match(out.text, /不回答每一条边为什么必须存在/);

  out = choose(story, /能否排序.*牵连是否必要/);
  assert.match(out.text, /《制耦》/);
  assert.equal(value(story, "recognized_order_not_reason"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-018: Chapter 8 balances localization benefits against interface duties", () => {
  const story = newStory("fengou-service-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《分构》/);
  assert.match(out.text, /下单、库存、计费/);
  assert.equal(config.type, "multi");
  assert.equal(config.options.length, 9);
  assert.equal(config.min, 7);
  assert.equal(config.max, 7);

  out = submit(
    story,
    "interface_duties",
    "format,version,timeout,idempotency,auth,retry,local_deploy"
  );
  assert.match(out.text, /局部部署和责任清晰是拆分可能带来的收益/);
  assert.equal(value(story, "revised_interfaces"), true);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(
    story,
    "interface_duties",
    "format,version,timeout,idempotency,auth,retry,consistency"
  );
  assert.match(out.text, /方案 A/);
  assert.match(out.text, /方案 B/);

  out = choose(story, /方案 A/);
  assert.match(out.text, /3 组双向协作关系/);

  out = choose(story, /选择方案 B/);
  assert.match(out.text, /同一事务/);
  assert.match(out.text, /高速内存状态/);

  out = choose(story, /模块越多越现代/);
  assert.match(out.text, /脆弱的远程接口/);

  out = choose(story, /局部化收益和新增接口负担一起比较/);
  assert.match(out.text, /《分构》/);
  assert.equal(value(story, "recognized_forced_split_cost"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-019: Chapters 6–8 manifests and book fragments keep stable identity and no-web tasks", () => {
  const cases = [
    ["fenren-door-001", "06-fenren"],
    ["zhiou-robot-001", "07-zhiou"],
    ["fengou-service-001", "08-fengou"]
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

test("TDD2-TEST-020: generic player contains no method or case-specific pedagogy for the full curriculum", () => {
  const player = fs.readFileSync(path.resolve("src/player.js"), "utf8");
  const curriculum = loadCurriculum();

  for (const chapter of curriculum.chapters) {
    assert.equal(
      player.includes(chapter.case_id),
      false,
      `player contains case-specific ID: ${chapter.case_id}`
    );
    assert.equal(
      player.includes(chapter.method),
      false,
      `player contains method-specific term: ${chapter.method}`
    );
  }
});
