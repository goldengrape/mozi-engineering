const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const { loadCurriculum } = require("../scripts/curriculum.cjs");
const { loadPracticeRegistry } = require("../scripts/practice-registry.cjs");
const { loadCasePackage } = require("../scripts/case-package.cjs");

const MAP_PATH = path.resolve("content/publication_map.json");

function loadMap() {
  return JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
}

test("TDD2-TEST-043: publication map covers every published chapter/practice exactly once", () => {
  const map = loadMap();
  const curriculum = loadCurriculum();
  const practices = loadPracticeRegistry();

  const expected = [
    ...curriculum.chapters
      .filter((chapter) => chapter.status === "published")
      .map((chapter) => chapter.case_id),
    ...practices.practices
      .filter((practice) => practice.status === "published")
      .map((practice) => practice.case_id)
  ];

  assert.equal(map.schema_version, 1);
  assert.equal(map.entries.length, 21);
  assert.equal(new Set(map.entries.map((entry) => entry.case_id)).size, 21);
  assert.deepEqual(
    new Set(map.entries.map((entry) => entry.case_id)),
    new Set(expected)
  );

  for (const entry of map.entries) {
    assert.ok(entry.anchor);
    assert.ok(Number.isInteger(entry.after_nonempty));
    assert.ok(entry.after_nonempty >= 0);
    assert.match(entry.epub_file, /^EPUB\/text\/ch\d{3}\.xhtml$/);
    assert.equal(
      entry.route,
      `https://goldengrape.github.io/mozi-engineering/cases/${entry.case_id}/`
    );
  }
});

test("TDD2-TEST-044: every publication entry has a no-web book fragment and the same stable route", () => {
  const map = loadMap();

  for (const entry of map.entries) {
    const pkg = loadCasePackage(
      path.resolve("content/cases", entry.case_id)
    );

    assert.match(pkg.book.body, /如果现在不能打开网页/);
    assert.equal(pkg.book.body.includes(entry.route), true);
    assert.match(pkg.book.body, /来源约束/);
  }
});

test("TDD2-TEST-045: publication anchors are unique and Appendix G uses its own longitudinal identity", () => {
  const map = loadMap();
  assert.equal(new Set(map.entries.map((entry) => entry.anchor)).size, 21);

  const longitudinal = map.entries.find(
    (entry) => entry.case_id === "longitudinal-ai-timeline-001"
  );

  assert.ok(longitudinal);
  assert.equal(
    longitudinal.anchor,
    "附录 G：人与 AI 协作造物——一个 vibe coding 贯穿案例"
  );
  assert.equal(longitudinal.after_nonempty, 2);
  assert.equal(longitudinal.epub_file, "EPUB/text/ch013.xhtml");
});
