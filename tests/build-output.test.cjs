const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { buildSite } = require("../scripts/build.cjs");
const { loadCurriculum } = require("../scripts/curriculum.cjs");

function publishedCaseIds() {
  return loadCurriculum()
    .chapters
    .filter((chapter) => chapter.status === "published")
    .map((chapter) => chapter.case_id);
}

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFixtureCase(parent, caseId, chapterId = "fixture") {
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
          chapter_id: chapterId,
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
    `---\ncase_id: ${caseId}\nchapter_id: ${chapterId}\nplacement: opening-practice\n---\n\nfixture\n`
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

  const expectedPublished = publishedCaseIds();
  assert.equal(registry.length, expectedPublished.length);
  assert.deepEqual(
    new Set(registry.map((entry) => entry.case_id)),
    new Set(expectedPublished)
  );

  for (const relative of [
    "index.html",
    "curriculum.json",
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


test("TDD-TEST-009: multiple authored cases register without changing the player", () => {
  const outDir = tempDir("mozi-multi-build-");
  const playerBefore = fs.readFileSync(path.resolve("src/player.js"), "utf8");

  const registry = buildSite(path.resolve("content/cases"), outDir, {
    srcDir: path.resolve("src")
  });

  const expectedPublished = publishedCaseIds();
  assert.equal(registry.length, expectedPublished.length);
  assert.deepEqual(
    new Set(registry.map((entry) => entry.case_id)),
    new Set(expectedPublished)
  );

  for (const entry of registry) {
    assert.equal(
      fs.existsSync(path.join(outDir, entry.route, "index.html")),
      true,
      `missing generated route for ${entry.case_id}`
    );
  }

  const playerAfter = fs.readFileSync(path.resolve("src/player.js"), "utf8");
  assert.equal(playerAfter, playerBefore);
});

test("Pages output uses repository-relative links rather than root-absolute paths", () => {
  const outDir = tempDir("mozi-pages-paths-");
  buildSite(path.resolve("content/cases"), outDir, {
    srcDir: path.resolve("src")
  });

  const home = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
  const caseHtml = fs.readFileSync(
    path.join(outDir, "cases/jieti-water-001/index.html"),
    "utf8"
  );

  assert.match(home, /href="\.\/assets\/style\.css"/);
  assert.match(home, /href="\.\/cases\/jieti-water-001\//);
  assert.match(caseHtml, /href="\.\.\/\.\.\/assets\/style\.css"/);
  assert.doesNotMatch(home + caseHtml, /(?:href|src)="\/assets\//);
});
