const fs = require("node:fs");
const path = require("node:path");

const {
  loadCasePackage,
  compileStory
} = require("./case-package.cjs");

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

  if (prepared.length === 0) {
    throw new Error(`no cases found in ${sourceRoot}`);
  }

  const runtimePath = require.resolve("inkjs");
  const caseTemplate = fs.readFileSync(path.join(srcDir, "case.html"), "utf8");
  const indexTemplate = fs.readFileSync(path.join(srcDir, "index.html"), "utf8");

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "assets"), { recursive: true });
  fs.mkdirSync(path.join(outDir, "cases"), { recursive: true });

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

    registry.push({
      case_id: item.caseId,
      title: item.pkg.manifest.title,
      route: `cases/${item.caseId}/`
    });
  }

  fs.writeFileSync(
    path.join(outDir, "cases", "index.json"),
    JSON.stringify(registry, null, 2) + "\n"
  );

  const caseList = registry
    .map(
      (entry) =>
        `<li><a class="case-link" href="./${htmlEscape(entry.route)}">${htmlEscape(
          entry.title
        )}</a></li>`
    )
    .join("\n      ");

  fs.writeFileSync(
    path.join(outDir, "index.html"),
    indexTemplate.replace("{{CASE_LIST}}", caseList)
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
