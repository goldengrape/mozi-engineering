const path = require("node:path");
const { loadCasePackage, compileStory } = require("./case-package.cjs");

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/check-case.cjs <case-directory>");
  process.exit(2);
}

try {
  const pkg = loadCasePackage(path.resolve(target));
  const compiled = compileStory(pkg.storySource);
  console.log(
    JSON.stringify(
      {
        case_id: pkg.manifest.case_id,
        chapter_id: pkg.manifest.textbook.chapter_id,
        story_json_bytes: Buffer.byteLength(compiled.json, "utf8")
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(error.stack || String(error));
  process.exit(1);
}
