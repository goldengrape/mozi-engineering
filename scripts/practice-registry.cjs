const fs = require("node:fs");
const path = require("node:path");

function loadPracticeRegistry(
  filePath = path.resolve("content/practice_registry.json")
) {
  const raw = fs.readFileSync(filePath, "utf8");
  const registry = JSON.parse(raw);

  if (registry.schema_version !== 1) {
    throw new Error("practice registry schema_version must be 1");
  }

  if (!Array.isArray(registry.practices)) {
    throw new Error("practice registry must contain practices");
  }

  const practiceIds = new Set();
  const caseIds = new Set();

  for (const practice of registry.practices) {
    for (const field of [
      "practice_id",
      "case_id",
      "manifest_chapter_id",
      "title",
      "kind",
      "status",
      "source_section",
      "source_title",
      "source_context"
    ]) {
      if (!practice[field]) {
        throw new Error(`practice missing ${field}: ${practice.case_id || "unknown"}`);
      }
    }

    if (!["mixed", "longitudinal"].includes(practice.kind)) {
      throw new Error(`unsupported practice kind: ${practice.kind}`);
    }

    if (practiceIds.has(practice.practice_id)) {
      throw new Error(`duplicate practice_id: ${practice.practice_id}`);
    }
    practiceIds.add(practice.practice_id);

    if (caseIds.has(practice.case_id)) {
      throw new Error(`duplicate practice case_id: ${practice.case_id}`);
    }
    caseIds.add(practice.case_id);
  }

  return registry;
}

module.exports = {
  loadPracticeRegistry
};
