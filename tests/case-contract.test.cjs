const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { loadCasePackage } = require("../scripts/case-package.cjs");

const CASE_DIR = path.resolve("content/cases/jieti-water-001");

test("TDD-TEST-001/011: case identity and textbook metadata agree", () => {
  const pkg = loadCasePackage(CASE_DIR);

  assert.equal(pkg.manifest.case_id, "jieti-water-001");
  assert.equal(pkg.book.meta.case_id, pkg.manifest.case_id);
  assert.equal(pkg.book.meta.chapter_id, "01-jieti");
  assert.equal(pkg.book.meta.placement, "opening-practice");
  assert.match(pkg.book.body, /interactive-entry: jieti-water-001/);
  assert.match(pkg.book.body, /你第一步会查什么/);
  assert.match(pkg.book.body, /如果现在不能打开网页/);
});

test("TDD-TEST-012: missing story source fails loudly", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mozi-case-"));
  const tempCase = path.join(tempRoot, "fixture-case");
  fs.mkdirSync(tempCase);

  fs.writeFileSync(
    path.join(tempCase, "manifest.json"),
    JSON.stringify(
      {
        schema_version: 1,
        case_id: "fixture-case",
        language: "zh-CN",
        textbook: { chapter_id: "fixture", placement: "opening-practice" },
        story_source: "story.ink",
        book_fragment: "book.md"
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(tempCase, "book.md"),
    "---\ncase_id: fixture-case\nchapter_id: fixture\nplacement: opening-practice\n---\n\nfixture\n"
  );

  assert.throws(
    () => loadCasePackage(tempCase),
    /missing story source: story\.ink/
  );
});
