const assert = require("node:assert/strict");
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

test("TDD2-TEST-026: Chapter 13 separates state precedence from resource conflict", () => {
  const story = newStory("xuzuo-bridge-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《序作》/);
  assert.match(out.text, /A 支模/);
  assert.match(out.text, /B 与 C 若互不遮挡，可以并行/);
  assert.equal(config.type, "rank");
  assert.equal(config.options.length, 6);

  out = submit(story, "ordered_stages", "A,D,BC,E,F,G");
  assert.match(out.text, /A → B\/C → D → E → F → G/);
  assert.equal(value(story, "revised_order"), true);

  out = choose(story, /按 A → B\/C → D → E → F → G 重排/);
  assert.match(out.text, /一台吊机/);

  out = choose(story, /现场做不到并行/);
  assert.match(out.text, /限制的是资源/);

  out = choose(story, /从逻辑依赖中移出/);
  assert.match(out.text, /E 浇筑混凝土一旦执行/);

  out = choose(story, /D 可以放到 E 以后/);
  assert.match(out.text, /失去原来的可见状态/);

  out = choose(story, /D 放在 E 前/);
  assert.match(out.text, /《序作》/);
  assert.equal(value(story, "separated_resource_conflict"), true);
  assert.equal(value(story, "recognized_release_point"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-027: Chapter 14 measures whole-flow throughput and re-identifies the moved bottleneck", () => {
  const story = newStory("tongzhi-packaging-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《通滞》/);
  assert.match(out.text, /12、15、8、20/);
  assert.equal(config.type, "number");

  out = submit(story, "first_throughput", 12);
  assert.match(out.text, /第三段 8 件\/小时/);

  out = choose(story, /包装能力翻了一倍/);
  assert.match(out.text, /整体仍先受第三段 8 件\/小时限制/);
  assert.equal(value(story, "expected_packaging_gain"), true);

  out = choose(story, /成品同步增加到 15/);
  assert.match(out.text, /等待和在制品/);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "number");
  assert.equal(config.bind, "second_throughput");

  out = submit(story, "second_throughput", 14);
  assert.match(out.text, /第一段 12 件\/小时/);

  out = choose(story, /曾经是瓶颈/);
  assert.match(out.text, /限制已经移动/);

  out = choose(story, /重新识别限制段/);
  assert.match(out.text, /《通滞》/);
  assert.equal(value(story, "recognized_moving_bottleneck"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-028: Chapter 15 replaces label dependence with structure and attacks the wrong paths", () => {
  const story = newStory("fangwu-gas-001");
  let out = advance(story);

  assert.doesNotMatch(out.text, /《防误》/);
  assert.match(out.text, /氮气与可燃气体/);
  assert.match(out.text, /颜色标签/);

  out = choose(story, /更认真看颜色标签/);
  assert.match(out.text, /危险动作仍然完全可达/);
  assert.equal(value(story, "relied_on_label"), true);

  let config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");
  assert.equal(config.bind, "structural_measures");

  out = submit(story, "structural_measures", "key,size,color");
  assert.match(out.text, /颜色标签仍然依赖持续注意力/);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(story, "structural_measures", "key,size,interlock");
  assert.match(out.text, /几何与联锁约束/);

  config = parseUiTags(out.tags);
  assert.equal(config.bind, "attack_paths");

  out = submit(story, "attack_paths", "reverse,partial");
  assert.match(out.text, /反插、半插、跨接、绕过联锁/);
  assert.equal(value(story, "revised_attack"), true);

  out = submit(story, "attack_paths", "reverse,partial,cross,bypass");
  assert.match(out.text, /《防误》/);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-029: Chapter 16 keeps stop isolate contain repair verify and restore distinct", () => {
  const story = newStory("xianbai-battery-001");
  let out = advance(story);

  assert.doesNotMatch(out.text, /《限败》/);
  assert.match(out.text, /温度快速升到报警阈值以上/);

  out = choose(story, /先重启一次/);
  assert.match(out.text, /重新加能/);
  assert.equal(value(story, "tried_restart"), true);

  let config = parseUiTags(out.tags);
  assert.equal(config.type, "rank");
  assert.equal(config.options.length, 6);

  out = submit(
    story,
    "control_order",
    "stop,repair,isolate,degrade,verify,normal"
  );
  assert.match(out.text, /先停止该模块继续充放电/);

  out = choose(story, /按止 → 隔 → 限害\/降用 → 修复 → 复验 → 恢复重排/);
  assert.match(out.text, /模块已经更换/);

  out = choose(story, /坏部件已经换掉/);
  assert.match(out.text, /绝缘、温升、通信和功能测试/);

  out = choose(story, /补做绝缘、温升、通信和功能测试/);
  assert.match(out.text, /《限败》/);
  assert.match(out.text, /Normal → Detected → Isolated → Degraded\/Safe → Repaired → Verified → Normal/);
  assert.equal(value(story, "verified_before_normal"), true);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-030: all sixteen chapters are published with stable case identity and no-web tasks", () => {
  const curriculum = loadCurriculum();
  const published = curriculum.chapters.filter(
    (chapter) => chapter.status === "published"
  );

  assert.equal(published.length, 16);

  for (const chapter of published) {
    const pkg = loadCasePackage(
      path.resolve("content/cases", chapter.case_id)
    );

    assert.equal(pkg.manifest.case_id, chapter.case_id);
    assert.equal(pkg.manifest.textbook.chapter_id, chapter.chapter_id);
    assert.match(pkg.book.body, /如果现在不能打开网页/);
    assert.match(
      pkg.book.body,
      new RegExp(
        `https://goldengrape\\.github\\.io/mozi-engineering/cases/${chapter.case_id}/`
      )
    );
  }
});
