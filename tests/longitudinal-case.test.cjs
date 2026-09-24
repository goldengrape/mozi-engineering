const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  loadCasePackage,
  compileStory
} = require("../scripts/case-package.cjs");
const { continueStory, parseUiTags } = require("../src/player.js");
const { loadCurriculum } = require("../scripts/curriculum.cjs");
const { loadPracticeRegistry } = require("../scripts/practice-registry.cjs");
const { buildSite } = require("../scripts/build.cjs");

const CASE_ID = "longitudinal-ai-timeline-001";

function newStory() {
  const pkg = loadCasePackage(path.resolve("content/cases", CASE_ID));
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
  assert.equal(story.currentChoices.length, 1);
  story.variablesState[variable] = value;
  story.ChooseChoiceIndex(0);
  return advance(story);
}

test("TDD2-TEST-039: Appendix G longitudinal case has stable registry identity", () => {
  const registry = loadPracticeRegistry();
  const item = registry.practices.find(
    (practice) => practice.case_id === CASE_ID
  );

  assert.ok(item);
  assert.equal(item.kind, "longitudinal");
  assert.equal(item.manifest_chapter_id, "appendix-g");
  assert.equal(item.source_section, "G1–G10");

  const pkg = loadCasePackage(path.resolve("content/cases", CASE_ID));
  assert.equal(pkg.manifest.case_id, CASE_ID);
  assert.equal(pkg.manifest.textbook.chapter_id, "appendix-g");
  assert.match(pkg.book.body, /如果现在不能打开网页/);
  assert.match(pkg.book.body, /二维码/);
  assert.match(
    pkg.book.body,
    /https:\/\/goldengrape\.github\.io\/mozi-engineering\/cases\/longitudinal-ai-timeline-001\//
  );
});

test("TDD2-TEST-040: longitudinal story withholds method labels until final debrief", () => {
  const source = fs.readFileSync(
    path.resolve("content/cases", CASE_ID, "story.ink"),
    "utf8"
  );
  const marker = "=== debrief ===";
  const index = source.indexOf(marker);
  assert.ok(index > 0);

  const before = source.slice(0, index);
  const methods = loadCurriculum().chapters.map((chapter) => chapter.method);

  for (const method of methods) {
    assert.equal(
      before.includes(`《${method}》`),
      false,
      `method leaked before debrief: ${method}`
    );
  }
});

test("TDD2-TEST-041: longitudinal path moves one project through nine source-grounded decisions", () => {
  const story = newStory();
  let out = advance(story);

  assert.match(out.text, /历史灾异时间线/);
  assert.match(out.text, /一条年份错了/);

  out = choose(story, /换一个模型/);
  assert.match(out.text, /哪些记录算同一事件/);

  out = choose(story, /什么算进来、怎样计/);
  let config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");
  assert.equal(config.bind, "functions");

  out = submit(
    story,
    "functions",
    "store,event_record,filter,source_view,uncertain,react"
  );
  assert.match(out.text, /技术栈/);

  out = submit(
    story,
    "functions",
    "store,event_record,filter,source_view,uncertain,offline"
  );
  assert.match(out.text, /event_type/);

  out = choose(story, /四处引用全部一起改掉/);
  assert.match(out.text, /直接传播/);

  out = choose(story, /稳定接口/);
  config = parseUiTags(out.tags);
  assert.equal(config.bind, "provenance_checks");

  out = submit(
    story,
    "provenance_checks",
    "original,student,other_path,same_ai"
  );
  assert.match(out.text, /正式展示的证据门槛/);

  out = submit(
    story,
    "provenance_checks",
    "original,student,other_path,gate"
  );
  assert.match(out.text, /未参与原设计/);

  out = choose(story, /审美描述/);
  assert.match(out.text, /关键关系重新猜一遍/);

  out = choose(story, /默会意图改成可检查/);
  assert.match(out.text, /差不多/);

  out = choose(story, /整体好看/);
  assert.match(out.text, /数据失败/);

  out = choose(story, /表现容度与事实容度/);
  config = parseUiTags(out.tags);
  assert.equal(config.bind, "flow_corrections");

  out = submit(story, "flow_corrections", "raw_first,defer_geo,serial_truth");
  assert.match(out.text, /资源冲突/);

  out = submit(story, "flow_corrections", "raw_first,defer_geo,resource");
  config = parseUiTags(out.tags);
  assert.equal(config.bind, "prevention_controls");

  out = submit(
    story,
    "prevention_controls",
    "no_verify_empty,confirmed_only,separate_ai,history,remind"
  );
  assert.match(out.text, /差异报告/);

  out = submit(
    story,
    "prevention_controls",
    "no_verify_empty,confirmed_only,separate_ai,history,diff"
  );
  config = parseUiTags(out.tags);
  assert.equal(config.type, "rank");
  assert.equal(config.bind, "recovery_order");

  out = submit(story, "recovery_order", "isolate,test,local,normal");
  assert.match(out.text, /本地静态数据降级模式/);

  out = submit(story, "recovery_order", "isolate,local,test,normal");
  assert.match(out.text, /《界体》/);
  assert.match(out.text, /没有为了凑齐十六篇/);
  assert.equal(story.variablesState["case_complete"], true);
});

test("TDD2-TEST-042: build publishes 16 chapter + 4 mixed + 1 longitudinal routes", () => {
  const outDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "mozi-longitudinal-build-")
  );
  const registry = buildSite(path.resolve("content/cases"), outDir, {
    srcDir: path.resolve("src")
  });

  assert.equal(registry.length, 21);
  assert.equal(
    registry.filter((entry) => entry.kind === "chapter").length,
    16
  );
  assert.equal(
    registry.filter((entry) => entry.kind === "mixed").length,
    4
  );
  const longitudinal = registry.filter(
    (entry) => entry.kind === "longitudinal"
  );
  assert.equal(longitudinal.length, 1);
  assert.equal(longitudinal[0].case_id, CASE_ID);
  assert.equal(Object.hasOwn(longitudinal[0], "method"), false);

  const home = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
  assert.match(home, /逐章练习/);
  assert.match(home, /混合迁移练习/);
  assert.match(home, /贯穿案例/);
  assert.match(home, /longitudinal-ai-timeline-001/);
});
