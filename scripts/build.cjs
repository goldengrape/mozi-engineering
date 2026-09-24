const fs = require("node:fs");
const path = require("node:path");

const {
  loadCasePackage,
  compileStory
} = require("./case-package.cjs");
const { loadCurriculum } = require("./curriculum.cjs");
const { loadPracticeRegistry } = require("./practice-registry.cjs");

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function discoverCaseDirs(sourceRoot) {
  return fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => path.join(sourceRoot, entry.name))
    .sort();
}

function prepareCases(caseDirs) {
  const seen = new Set();
  const prepared = [];

  for (const caseDir of caseDirs) {
    const pkg = loadCasePackage(caseDir);
    const caseId = pkg.manifest.case_id;

    if (seen.has(caseId)) {
      throw new Error(`duplicate case_id: ${caseId}`);
    }
    seen.add(caseId);

    const compiled = compileStory(pkg.storySource);
    prepared.push({
      pkg,
      caseId,
      storyJson: compiled.json
    });
  }

  return prepared;
}

function buildSite(
  sourceRoot = path.resolve("content/cases"),
  outDir = path.resolve("dist"),
  options = {}
) {
  const srcDir = options.srcDir || path.resolve("src");
  const caseDirs = options.caseDirs || discoverCaseDirs(sourceRoot);
  const prepared = prepareCases(caseDirs);
  const curriculumPath =
    options.curriculumPath || path.resolve("content/curriculum.json");
  const practiceRegistryPath =
    options.practiceRegistryPath || path.resolve("content/practice_registry.json");
  const curriculum = loadCurriculum(curriculumPath);
  const practiceRegistry = loadPracticeRegistry(practiceRegistryPath);

  if (prepared.length === 0) {
    throw new Error(`no cases found in ${sourceRoot}`);
  }

  const curriculumByCase = new Map(
    curriculum.chapters.map((chapter) => [
      chapter.case_id,
      {
        kind: "chapter",
        manifestChapterId: chapter.chapter_id,
        chapter_id: chapter.chapter_id,
        method: chapter.method,
        part: chapter.part,
        status: chapter.status
      }
    ])
  );

  const practiceByCase = new Map(
    practiceRegistry.practices.map((practice) => [
      practice.case_id,
      {
        kind: "mixed",
        manifestChapterId: practice.manifest_chapter_id,
        practice_id: practice.practice_id,
        source_section: practice.source_section,
        status: practice.status
      }
    ])
  );

  for (const caseId of practiceByCase.keys()) {
    if (curriculumByCase.has(caseId)) {
      throw new Error(`case_id appears in both curriculum and practice registry: ${caseId}`);
    }
  }

  const catalogByCase = new Map([...curriculumByCase, ...practiceByCase]);

  for (const item of prepared) {
    if (!catalogByCase.has(item.caseId)) {
      throw new Error(
        `case_id missing from curriculum/practice registry: ${item.caseId}`
      );
    }

    const catalogEntry = catalogByCase.get(item.caseId);
    if (
      item.pkg.manifest.textbook.chapter_id !== catalogEntry.manifestChapterId
    ) {
      throw new Error(
        `case identity mismatch for ${item.caseId}: manifest=${item.pkg.manifest.textbook.chapter_id}, registry=${catalogEntry.manifestChapterId}`
      );
    }
  }

  for (const chapter of curriculum.chapters) {
    if (
      chapter.status === "published" &&
      !prepared.some((item) => item.caseId === chapter.case_id)
    ) {
      throw new Error(
        `published curriculum case missing package: ${chapter.case_id}`
      );
    }
  }

  for (const practice of practiceRegistry.practices) {
    if (
      practice.status === "published" &&
      !prepared.some((item) => item.caseId === practice.case_id)
    ) {
      throw new Error(
        `published mixed practice missing package: ${practice.case_id}`
      );
    }
  }

  const runtimePath = require.resolve("inkjs");
  const caseTemplate = fs.readFileSync(path.join(srcDir, "case.html"), "utf8");
  const indexTemplate = fs.readFileSync(path.join(srcDir, "index.html"), "utf8");

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "assets"), { recursive: true });
  fs.mkdirSync(path.join(outDir, "cases"), { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "curriculum.json"),
    JSON.stringify(curriculum, null, 2) + "\n"
  );
  fs.writeFileSync(
    path.join(outDir, "practice_registry.json"),
    JSON.stringify(practiceRegistry, null, 2) + "\n"
  );

  fs.copyFileSync(runtimePath, path.join(outDir, "assets", "ink.js"));
  fs.copyFileSync(
    path.join(srcDir, "player.js"),
    path.join(outDir, "assets", "player.js")
  );
  fs.copyFileSync(
    path.join(srcDir, "style.css"),
    path.join(outDir, "assets", "style.css")
  );

  const registry = [];

  for (const item of prepared) {
    const caseOut = path.join(outDir, "cases", item.caseId);
    fs.mkdirSync(caseOut, { recursive: true });

    fs.writeFileSync(
      path.join(caseOut, "manifest.json"),
      JSON.stringify(item.pkg.manifest, null, 2) + "\n"
    );
    fs.writeFileSync(path.join(caseOut, "story.json"), item.storyJson);

    const page = caseTemplate.replaceAll(
      "{{TITLE}}",
      htmlEscape(item.pkg.manifest.title || item.caseId)
    );
    fs.writeFileSync(path.join(caseOut, "index.html"), page);

    const catalogEntry = catalogByCase.get(item.caseId);

    const registryEntry = {
      case_id: item.caseId,
      kind: catalogEntry.kind,
      title: item.pkg.manifest.title,
      route: `cases/${item.caseId}/`
    };

    if (catalogEntry.kind === "chapter") {
      registryEntry.chapter_id = catalogEntry.chapter_id;
      registryEntry.method = catalogEntry.method;
      registryEntry.part = catalogEntry.part;
    } else {
      registryEntry.practice_id = catalogEntry.practice_id;
      registryEntry.source_section = catalogEntry.source_section;
    }

    registry.push(registryEntry);
  }

  fs.writeFileSync(
    path.join(outDir, "cases", "index.json"),
    JSON.stringify(registry, null, 2) + "\n"
  );

  const chapterCaseList = registry
    .filter((entry) => entry.kind === "chapter")
    .map(
      (entry) =>
        `<li><a class="case-link" href="./${htmlEscape(entry.route)}">${htmlEscape(
          entry.title
        )}</a></li>`
    )
    .join("\n      ");

  const mixedCaseList = registry
    .filter((entry) => entry.kind === "mixed")
    .map(
      (entry) =>
        `<li><a class="case-link" href="./${htmlEscape(entry.route)}">${htmlEscape(
          entry.title
        )}</a></li>`
    )
    .join("\n      ");

  fs.writeFileSync(
    path.join(outDir, "index.html"),
    indexTemplate
      .replace("{{CHAPTER_CASE_LIST}}", chapterCaseList)
      .replace("{{MIXED_CASE_LIST}}", mixedCaseList)
  );

  return registry;
}

if (require.main === module) {
  try {
    const registry = buildSite();
    console.log(
      `Built ${registry.length} case(s): ${registry
        .map((entry) => entry.case_id)
        .join(", ")}`
    );
  } catch (error) {
    console.error(error.stack || String(error));
    process.exit(1);
  }
}

module.exports = {
  buildSite,
  discoverCaseDirs,
  prepareCases,
  htmlEscape
};
