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
const { loadPracticeRegistry } = require("../scripts/practice-registry.cjs");
const { buildSite } = require("../scripts/build.cjs");

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
  assert.equal(story.currentChoices.length, 1);
  story.variablesState[variable] = value;
  story.ChooseChoiceIndex(0);
  return advance(story);
}

test("TDD2-TEST-031: mixed practice registry covers Appendix F1–F4 without predeclared method answers", () => {
  const registry = loadPracticeRegistry();

  assert.equal(registry.practices.length, 4);
  assert.deepEqual(
    registry.practices.map((practice) => practice.source_section),
    ["F1", "F2", "F3", "F4"]
  );
  assert.equal(
    JSON.stringify(registry).includes("target_methods"),
    false
  );

  const ids = registry.practices.map((practice) => practice.case_id);
  assert.equal(new Set(ids).size, ids.length);
});

test("TDD2-TEST-032: mixed stories hide all sixteen method labels until debrief", () => {
  const methods = loadCurriculum().chapters.map((chapter) => chapter.method);
  const registry = loadPracticeRegistry();

  const expectedDebriefMethods = {
    "mixed-clinical-safety-001": ["界体", "定准", "传准", "防误", "限败"],
    "mixed-bio-repro-001": ["界体", "参验", "相衡", "示制"],
    "mixed-agri-transfer-001": ["界体", "参验", "序作", "通滞", "限败"],
    "mixed-payment-ops-001": ["衡算", "定准", "传准", "制耦", "防误", "限败"]
  };

  for (const practice of registry.practices) {
    const source = fs.readFileSync(
      path.resolve("content/cases", practice.case_id, "story.ink"),
      "utf8"
    );
    const marker = "=== debrief ===";
    const markerIndex = source.indexOf(marker);
    assert.ok(markerIndex > 0, `debrief missing: ${practice.case_id}`);

    const beforeDebrief = source.slice(0, markerIndex);
    const afterDebrief = source.slice(markerIndex);

    for (const method of methods) {
      assert.equal(
        beforeDebrief.includes(`《${method}》`),
        false,
        `method leaked before debrief: ${practice.case_id} / ${method}`
      );
    }

    for (const method of expectedDebriefMethods[practice.case_id]) {
      assert.match(afterDebrief, new RegExp(`《${method}》`));
    }
  }
});

test("TDD2-TEST-033: clinical mixed case retrieves boundary lineage prevention and failure control", () => {
  const story = newStory("mixed-clinical-safety-001");
  let out = advance(story);

  assert.doesNotMatch(out.text, /《界体》|《定准》|《传准》|《防误》|《限败》/);

  out = choose(story, /合并成一个“医疗质量问题”/);
  assert.match(out.text, /对象、证据和动作不同/);

  out = choose(story, /三个问题边界分开/);
  assert.match(out.text, /异常校准批次/);

  out = choose(story, /只把当前仪器重新调好/);
  assert.match(out.text, /过去的影响范围/);

  out = choose(story, /补做来源和时间范围追查/);
  let config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");
  assert.equal(config.bind, "safety_controls");

  out = submit(
    story,
    "safety_controls",
    "patient_id,keying,permission,trace_lab"
  );
  assert.match(out.text, /扫描核对/);

  config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(
    story,
    "safety_controls",
    "patient_id,keying,permission,scan"
  );
  assert.match(out.text, /不良事件已经发生/);

  out = choose(story, /等待最终诊断/);
  assert.match(out.text, /停止增害/);

  out = choose(story, /先控制继续增害和传播/);
  assert.match(out.text, /《界体》/);
  assert.match(out.text, /不能替代临床指南/);
  assert.equal(story.variablesState["case_complete"], true);
});

test("TDD2-TEST-034: bio mixed case distinguishes confounding independent relations and reproducibility", () => {
  const story = newStory("mixed-bio-repro-001");
  let out = advance(story);

  out = choose(story, /所有变化都叫作“实验误差”/);
  assert.match(out.text, /生物差异并不都属于误差/);

  out = choose(story, /明确研究对象和边界/);
  let config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");

  out = submit(
    story,
    "redesign_actions",
    "repeats,endpoint,unconfound,same_repeat"
  );
  assert.match(out.text, /独立来源复验/);

  out = submit(
    story,
    "redesign_actions",
    "repeats,endpoint,unconfound,independent"
  );
  assert.match(out.text, /同一仪器或测量模型偏差/);

  out = choose(story, /同一设备、同一测量原理/);
  assert.match(out.text, /共同偏差/);

  out = choose(story, /不共享原偏差来源/);
  config = parseUiTags(out.tags);
  assert.equal(config.bind, "reproduction_records");

  out = submit(
    story,
    "reproduction_records",
    "cell_line,passage,reagent,culture,software,final_claim"
  );
  assert.match(out.text, /分析脚本/);

  out = submit(
    story,
    "reproduction_records",
    "cell_line,passage,reagent,culture,software,script"
  );
  assert.match(out.text, /《参验》/);
  assert.match(out.text, /不替代生物统计/);
  assert.equal(story.variablesState["case_complete"], true);
});

test("TDD2-TEST-035: agriculture mixed case separates open boundary trial design timing capacity and containment", () => {
  const story = newStory("mixed-agri-transfer-001");
  let out = advance(story);

  out = choose(story, /永远固定在单个小区/);
  assert.match(out.text, /跨界作用会随时间和环境变化/);

  out = choose(story, /允许边界随当前问题/);
  assert.match(out.text, /高肥力地块/);

  out = choose(story, /保持原分组/);
  assert.match(out.text, /不会把两个来源分开/);

  out = choose(story, /解除地块条件与处理的混杂/);
  let config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");
  assert.equal(config.bind, "harvest_analysis");

  out = submit(story, "harvest_analysis", "state_window,all_schedule");
  assert.match(out.text, /容量限制/);

  out = submit(story, "harvest_analysis", "state_window,capacity");
  assert.match(out.text, /灌溉故障、污染或病害/);

  out = choose(story, /等完整原因确认/);
  assert.match(out.text, /分区处置/);

  out = choose(story, /限制继续传播/);
  assert.match(out.text, /《通滞》/);
  assert.match(out.text, /天气不是机械公差/);
  assert.equal(story.variablesState["case_complete"], true);
});

test("TDD2-TEST-036: payment mixed case separates reconciliation lineage coupling prevention and incident control", () => {
  const story = newStory("mixed-payment-ops-001");
  let out = advance(story);

  out = choose(story, /估值模型一定错了/);
  assert.match(out.text, /账面闭合.*不表示估值模型必然正确/);

  out = choose(story, /对账不一致当作线索/);
  let config = parseUiTags(out.tags);
  assert.equal(config.type, "multi");
  assert.equal(config.bind, "lineage_and_propagation");

  out = submit(story, "lineage_and_propagation", "lineage,closed_report");
  assert.match(out.text, /改变传播/);

  out = submit(story, "lineage_and_propagation", "lineage,edges");
  config = parseUiTags(out.tags);
  assert.equal(config.bind, "operation_controls");

  out = submit(
    story,
    "operation_controls",
    "limit,least_privilege,dual_review,reconcile_again"
  );
  assert.match(out.text, /不可越权状态/);

  out = submit(
    story,
    "operation_controls",
    "limit,least_privilege,dual_review,unreachable"
  );
  assert.match(out.text, /运营事故已经发生/);

  out = choose(story, /完整因果链全部查清/);
  assert.match(out.text, /等待完整因果确认/);

  out = choose(story, /控制新增暴露和传播/);
  assert.match(out.text, /《衡算》/);
  assert.match(out.text, /不能.*作投资判断/);
  assert.equal(story.variablesState["case_complete"], true);
});

test("TDD2-TEST-037: build publishes 16 chapter cases plus 4 unlabeled mixed practices", () => {
  const os = require("node:os");
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "mozi-mixed-build-"));
  const registry = buildSite(path.resolve("content/cases"), outDir, {
    srcDir: path.resolve("src")
  });

  assert.equal(registry.length, 20);
  assert.equal(
    registry.filter((entry) => entry.kind === "chapter").length,
    16
  );
  const mixed = registry.filter((entry) => entry.kind === "mixed");
  assert.equal(mixed.length, 4);

  for (const entry of mixed) {
    assert.equal(Object.hasOwn(entry, "method"), false);
    assert.ok(entry.practice_id);
    assert.ok(entry.source_section);
    assert.equal(
      fs.existsSync(path.join(outDir, entry.route, "index.html")),
      true
    );
  }

  const home = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
  assert.match(home, /逐章练习/);
  assert.match(home, /混合迁移练习/);
  assert.doesNotMatch(home, /mixed-clinical-safety-001[^\n]*界体/);
});

test("TDD2-TEST-038: mixed book fragments keep stable identity no-web tasks and source boundary", () => {
  const registry = loadPracticeRegistry();

  for (const practice of registry.practices) {
    const pkg = loadCasePackage(
      path.resolve("content/cases", practice.case_id)
    );

    assert.equal(pkg.manifest.case_id, practice.case_id);
    assert.equal(
      pkg.manifest.textbook.chapter_id,
      practice.manifest_chapter_id
    );
    assert.match(pkg.book.body, /如果现在不能打开网页/);
    assert.match(pkg.book.body, /来源约束/);
    assert.match(
      pkg.book.body,
      new RegExp(
        `https://goldengrape\\.github\\.io/mozi-engineering/cases/${practice.case_id}/`
      )
    );
  }
});
