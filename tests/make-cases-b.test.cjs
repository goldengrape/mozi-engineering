const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const {
  loadCasePackage,
  compileStory
} = require("../scripts/case-package.cjs");
const { continueStory, parseUiTags } = require("../src/player.js");

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

test("TDD2-TEST-021: Chapter 9 keeps Tx and removes duplicate/conflicting constraint logic", () => {
  const story = newStory("dingdong-guide-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《定动》/);
  assert.match(out.text, /Tx、Ty、Tz、Rx、Ry、Rz/);
  assert.equal(config.type, "multi");
  assert.equal(config.min, 5);
  assert.equal(config.max, 5);

  out = submit(story, "constrained_dofs", "Tx,Ty,Tz,Rx,Ry");
  assert.match(out.text, /Tx 必须保留/);
  assert.equal(value(story, "revised_dofs"), true);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(story, "constrained_dofs", "Ty,Tz,Rx,Ry,Rz");
  assert.match(out.text, /保留了 Tx/);

  out = choose(story, /两个完整基准.*增加稳定性/);
  assert.match(out.text, /不平行、热伸长或安装误差/);

  out = choose(story, /一侧主定位/);
  assert.match(out.text, /静止装配/);

  out = choose(story, /能装上并推得动一次/);
  assert.match(out.text, /全行程、常载荷和温升/);

  out = choose(story, /补做全行程/);
  assert.match(out.text, /《定动》/);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-022: Chapter 10 propagates local tolerances to the functional window", () => {
  const story = newStory("rongdu-stack-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《容度》/);
  assert.match(out.text, /20±0.1 mm/);
  assert.match(out.text, /30±0.2 mm/);
  assert.match(out.text, /50±0.1 mm/);
  assert.equal(config.type, "number");

  out = submit(story, "worst_deviation", 0.25);
  assert.match(out.text, /0.1\+0.2\+0.1=0.4 mm/);
  assert.match(out.text, /99.6—100.4 mm/);
  assert.match(out.text, /99.7—100.3 mm/);

  out = choose(story, /单件都合格，总成自然合格/);
  assert.match(out.text, /单件合规不能替代偏差传播分析/);
  assert.equal(value(story, "trusted_piecewise_pass"), true);

  out = choose(story, /公差越紧越好/);
  assert.match(out.text, /制造能力、成本和失效后果/);

  out = choose(story, /功能窗口放在前面/);
  assert.match(out.text, /《容度》/);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-023: Chapter 11 changes the comparison relation and separates s from b", () => {
  const story = newStory("xiangheng-reversal-001");
  let out = advance(story);

  assert.doesNotMatch(out.text, /《相衡》/);
  assert.match(out.text, /r₁ = 18 μm/);

  out = choose(story, /保持同一布置再测一次/);
  assert.match(out.text, /同一比较关系/);
  assert.equal(value(story, "repeated_same_relation"), true);

  out = choose(story, /把仪器反转/);
  assert.match(out.text, /r₂ = 6 μm/);
  let config = parseUiTags(out.tags);
  assert.equal(config.type, "number");
  assert.equal(config.bind, "surface_component");

  out = submit(story, "surface_component", 4);
  assert.match(out.text, /s=\(18−6\)\/2=6 μm/);

  config = parseUiTags(out.tags);
  assert.equal(config.bind, "instrument_bias");

  out = submit(story, "instrument_bias", 10);
  assert.match(out.text, /b=\(18\+6\)\/2=12 μm/);

  out = choose(story, /所有系统偏差都会被消掉/);
  assert.match(out.text, /共同温度模型偏差/);

  out = choose(story, /反转也有边界/);
  assert.match(out.text, /《相衡》/);
  assert.match(out.text, /s=6 μm，b=12 μm/);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-024: Chapter 12 identifies missing relations and tests independent reproduction", () => {
  const story = newStory("shizhi-bracket-001");
  let out = advance(story);
  let config = parseUiTags(out.tags);

  assert.doesNotMatch(out.text, /《示制》/);
  assert.match(out.text, /孔径、外形尺寸和板厚/);
  assert.match(out.text, /0.6 mm/);
  assert.equal(config.type, "multi");
  assert.equal(config.min, 3);
  assert.equal(config.max, 3);

  out = submit(
    story,
    "missing_relations",
    "datum,hole_diameter,orientation"
  );
  assert.match(out.text, /孔径、外形尺寸和板厚已经在原图上/);
  assert.match(out.text, /孔位置基准、接触面平面度和装配方向/);
  assert.equal(value(story, "revised_spec"), true);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(
    story,
    "missing_relations",
    "datum,flatness,orientation"
  );
  assert.match(out.text, /A 面负责安装贴合/);
  assert.match(out.text, /B 边确定横向位置/);
  assert.match(out.text, /C 孔轴线与配对件同轴/);

  out = choose(story, /原设计团队再读一遍/);
  assert.match(out.text, /共享大量默会信息/);

  out = choose(story, /未参与原设计的人独立复作/);
  assert.match(out.text, /《示制》/);
  assert.equal(value(story, "case_complete"), true);
});

test("TDD2-TEST-025: Chapters 9–12 manifests and book fragments keep stable identity and no-web tasks", () => {
  const cases = [
    ["dingdong-guide-001", "09-dingdong"],
    ["rongdu-stack-001", "10-rongdu"],
    ["xiangheng-reversal-001", "11-xiangheng"],
    ["shizhi-bracket-001", "12-shizhi"]
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
