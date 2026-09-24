const fs = require("node:fs");
const path = require("node:path");

const SUPPORTED_PRIMITIVES = new Set(["choice", "multi", "number", "rank"]);

function loadCurriculum(
  filePath = path.resolve("content/curriculum.json")
) {
  const raw = fs.readFileSync(filePath, "utf8");
  const curriculum = JSON.parse(raw);

  if (curriculum.schema_version !== 1) {
    throw new Error("curriculum schema_version must be 1");
  }

  if (!Array.isArray(curriculum.chapters) || curriculum.chapters.length !== 16) {
    throw new Error("curriculum must contain exactly 16 chapters");
  }

  const chapterIds = new Set();
  const caseIds = new Set();

  curriculum.chapters.forEach((chapter, index) => {
    const expectedNumber = index + 1;

    if (chapter.chapter_number !== expectedNumber) {
      throw new Error(
        `curriculum chapter order mismatch at index ${index}: expected ${expectedNumber}`
      );
    }

    for (const field of [
      "chapter_id",
      "method",
      "part",
      "chapter_title",
      "worked_example_title",
      "case_id",
      "status"
    ]) {
      if (!chapter[field]) {
        throw new Error(
          `curriculum chapter ${chapter.chapter_number} missing ${field}`
        );
      }
    }

    if (chapterIds.has(chapter.chapter_id)) {
      throw new Error(`duplicate chapter_id: ${chapter.chapter_id}`);
    }
    chapterIds.add(chapter.chapter_id);

    if (caseIds.has(chapter.case_id)) {
      throw new Error(`duplicate curriculum case_id: ${chapter.case_id}`);
    }
    caseIds.add(chapter.case_id);

    const primitives =
      chapter.design && Array.isArray(chapter.design.primary_primitives)
        ? chapter.design.primary_primitives
        : [];

    if (primitives.length === 0) {
      throw new Error(
        `curriculum chapter ${chapter.chapter_number} has no primary primitives`
      );
    }

    for (const primitive of primitives) {
      if (!SUPPORTED_PRIMITIVES.has(primitive)) {
        throw new Error(
          `unsupported primitive "${primitive}" in chapter ${chapter.chapter_number}`
        );
      }
    }
  });

  return curriculum;
}

module.exports = {
  loadCurriculum,
  SUPPORTED_PRIMITIVES
};
