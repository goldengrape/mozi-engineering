const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  loadCurriculum,
  SUPPORTED_PRIMITIVES
} = require("../scripts/curriculum.cjs");
const { buildSite } = require("../scripts/build.cjs");

const EXPECTED_METHODS = [
  "界体",
  "衡算",
  "定准",
  "传准",
  "参验",
  "分任",
  "制耦",
  "分构",
  "定动",
  "容度",
  "相衡",
  "示制",
  "序作",
  "通滞",
  "防误",
  "限败"
];

test("Phase 2 curriculum registry covers the sixteen textbook chapters in order", () => {
  const curriculum = loadCurriculum();

  assert.equal(curriculum.chapters.length, 16);
  assert.deepEqual(
    curriculum.chapters.map((chapter) => chapter.method),
    EXPECTED_METHODS
  );

  assert.deepEqual(
    curriculum.chapters.map((chapter) => chapter.part),
    [
      "察物", "察物", "察物", "察物", "察物",
      "制物", "制物", "制物", "制物", "制物", "制物", "制物",
      "运行", "运行",
      "守败", "守败"
    ]
  );
});

test("curriculum keeps source structure separate from interactive design", () => {
  const curriculum = loadCurriculum();

  for (const chapter of curriculum.chapters) {
    assert.ok(chapter.chapter_title);
    assert.ok(chapter.worked_example_title);
    assert.ok(Number.isInteger(chapter.source_page));
    assert.ok(Number.isInteger(chapter.source_line));
    assert.ok(chapter.design.mechanism);
    assert.ok(chapter.design.primary_primitives.length > 0);

    for (const primitive of chapter.design.primary_primitives) {
      assert.equal(SUPPORTED_PRIMITIVES.has(primitive), true);
    }
  }
});

test("published case identity is tied to the curriculum chapter identity", () => {
  const curriculum = loadCurriculum();
  const published = curriculum.chapters.filter(
    (chapter) => chapter.status === "published"
  );

  assert.deepEqual(
    published.map((chapter) => chapter.case_id),
    ["jieti-water-001"]
  );

  const manifest = JSON.parse(
    fs.readFileSync(
      path.resolve("content/cases/jieti-water-001/manifest.json"),
      "utf8"
    )
  );

  assert.equal(manifest.case_id, published[0].case_id);
  assert.equal(manifest.textbook.chapter_id, published[0].chapter_id);
});

test("static build publishes the curriculum registry", () => {
  const outDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "mozi-curriculum-build-")
  );

  buildSite(path.resolve("content/cases"), outDir, {
    srcDir: path.resolve("src")
  });

  const built = JSON.parse(
    fs.readFileSync(path.join(outDir, "curriculum.json"), "utf8")
  );

  assert.equal(built.chapters.length, 16);
  assert.equal(built.chapters[0].case_id, "jieti-water-001");
  assert.equal(built.chapters[15].case_id, "xianbai-battery-001");
});
