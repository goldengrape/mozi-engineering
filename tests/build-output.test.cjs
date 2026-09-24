const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { buildSite } = require("../scripts/build.cjs");

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFixtureCase(parent, caseId) {
  const caseDir = path.join(parent, caseId);
  fs.mkdirSync(caseDir, { recursive: true });

  fs.writeFileSync(
    path.join(caseDir, "manifest.json"),
    JSON.stringify(
      {
        schema_version: 1,
        case_id: caseId,
        title: "fixture",
        language: "zh-CN",
        textbook: {
          chapter_id: "fixture",
          placement: "opening-practice"
        },
        story_source: "story.ink",
        book_fragment: "book.md"
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(caseDir, "book.md"),
    `---\ncase_id: ${caseId}\nchapter_id: fixture\nplacement: opening-practice\n---\n\nfixture\n`
  );
  fs.writeFileSync(path.join(caseDir, "story.ink"), "hello\n-> END\n");
  return caseDir;
}

test("TDD-TEST-014: buildSite creates the static output contract", () => {
  const outDir = tempDir("mozi-build-");
  const registry = buildSite(
    path.resolve("content/cases"),
    outDir,
    { srcDir: path.resolve("src") }
  );

  assert.equal(registry.length, 1);
  assert.equal(registry[0].case_id, "jieti-water-001");

  for (const relative of [
    "index.html",
    "assets/ink.js",
    "assets/player.js",
    "assets/style.css",
    "cases/index.json",
    "cases/jieti-water-001/index.html",
    "cases/jieti-water-001/manifest.json",
    "cases/jieti-water-001/story.json"
  ]) {
    assert.equal(
      fs.existsSync(path.join(outDir, relative)),
      true,
      `missing build output: ${relative}`
    );
  }

  const builtStory = fs.readFileSync(
    path.join(outDir, "cases/jieti-water-001/story.json"),
    "utf8"
  );
  assert.doesNotThrow(() => new (require("inkjs").Story)(builtStory));
});

test("TDD-TEST-014: duplicate case IDs abort before rewriting output", () => {
  const a = tempDir("mozi-a-");
  const b = tempDir("mozi-b-");
  const caseA = writeFixtureCase(a, "duplicate-case");
  const caseB = writeFixtureCase(b, "duplicate-case");
  const outDir = tempDir("mozi-existing-");
  const marker = path.join(outDir, "keep.txt");
  fs.writeFileSync(marker, "unchanged");

  assert.throws(
    () =>
      buildSite(path.resolve("content/cases"), outDir, {
        srcDir: path.resolve("src"),
        caseDirs: [caseA, caseB]
      }),
    /duplicate case_id: duplicate-case/
  );

  assert.equal(fs.readFileSync(marker, "utf8"), "unchanged");
});

test("TDD-TEST-020: generic player contains no case-specific pedagogy", () => {
  const player = fs.readFileSync(path.resolve("src/player.js"), "utf8");

  assert.doesNotMatch(player, /jieti-water-001/);
  assert.doesNotMatch(player, /界体/);
  assert.doesNotMatch(player, /漏水/);
  assert.doesNotMatch(player, /checked_boundary/);
});

test("TDD-TEST-021: generated case page uses local runtime assets only", () => {
  const outDir = tempDir("mozi-offline-");
  buildSite(path.resolve("content/cases"), outDir, {
    srcDir: path.resolve("src")
  });

  const html = fs.readFileSync(
    path.join(outDir, "cases/jieti-water-001/index.html"),
    "utf8"
  );

  assert.match(html, /src="\.\.\/\.\.\/assets\/ink\.js"/);
  assert.match(html, /src="\.\.\/\.\.\/assets\/player\.js"/);
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:\/\//i);
});
