const fs = require("node:fs");
const path = require("node:path");

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    throw new Error("book.md must start with YAML-style frontmatter");
  }
  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error("book.md frontmatter is not closed");
  }

  const header = markdown.slice(4, end);
  const meta = {};
  for (const rawLine of header.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) {
      throw new Error(`unsupported frontmatter line: ${rawLine}`);
    }
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    meta[key] = value;
  }

  return {
    meta,
    body: markdown.slice(end + 5)
  };
}

function loadCasePackage(caseDir) {
  const manifestPath = path.join(caseDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`missing manifest.json: ${caseDir}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const folderId = path.basename(path.resolve(caseDir));

  if (!manifest.case_id) throw new Error("manifest.case_id is required");
  if (manifest.case_id !== folderId) {
    throw new Error(
      `case identity mismatch: folder=${folderId}, manifest=${manifest.case_id}`
    );
  }
  if (manifest.schema_version !== 1) {
    throw new Error(`unsupported schema_version: ${manifest.schema_version}`);
  }

  const bookName = manifest.book_fragment;
  const storyName = manifest.story_source;
  if (!bookName) throw new Error("manifest.book_fragment is required");
  if (!storyName) throw new Error("manifest.story_source is required");

  const bookPath = path.join(caseDir, bookName);
  const storyPath = path.join(caseDir, storyName);
  if (!fs.existsSync(bookPath)) throw new Error(`missing book fragment: ${bookName}`);
  if (!fs.existsSync(storyPath)) throw new Error(`missing story source: ${storyName}`);

  const bookText = fs.readFileSync(bookPath, "utf8");
  const book = parseFrontmatter(bookText);
  if (book.meta.case_id !== manifest.case_id) {
    throw new Error(
      `case identity mismatch: book=${book.meta.case_id}, manifest=${manifest.case_id}`
    );
  }
  if (book.meta.chapter_id !== manifest.textbook?.chapter_id) {
    throw new Error("chapter_id mismatch between book.md and manifest.json");
  }
  if (book.meta.placement !== manifest.textbook?.placement) {
    throw new Error("placement mismatch between book.md and manifest.json");
  }

  const storySource = fs.readFileSync(storyPath, "utf8");
  if (!storySource.trim()) throw new Error("story.ink must not be empty");

  return {
    caseDir,
    manifest,
    book,
    storySource
  };
}

function compileStory(inkSource) {
  let inkjs;
  try {
    inkjs = require("inkjs/full");
  } catch (error) {
    const wrapped = new Error(
      "inkjs is not installed. Run npm install before compile tests."
    );
    wrapped.cause = error;
    throw wrapped;
  }

  const compiledStory = new inkjs.Compiler(inkSource).Compile();
  const json = compiledStory.ToJson();

  // Verify the compiler output can be consumed by the runtime.
  const runtime = new inkjs.Story(json);
  return { json, runtime };
}

module.exports = {
  parseFrontmatter,
  loadCasePackage,
  compileStory
};
