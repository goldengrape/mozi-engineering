const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const BOOK = path.resolve("content/cases/jieti-water-001/book.md");
const PUBLIC_URL =
  "https://goldengrape.github.io/mozi-engineering/cases/jieti-water-001/";

test("RMD-TASK-005 book block contains a stable public entry and no-web task", () => {
  const text = fs.readFileSync(BOOK, "utf8");

  assert.equal(text.includes("case_id: jieti-water-001"), true);
  assert.equal(text.includes(PUBLIC_URL), true);
  assert.equal(text.includes("你第一步会查什么？为什么？"), true);
  assert.equal(text.includes("如果现在不能打开网页"), true);
  assert.equal(text.includes("哪些用水算在这个问题里面"), true);
  assert.equal(text.includes("不要先把 180 m³ 命名成某个原因"), true);
});

test("RMD-TASK-005 method label is not used to answer the first question", () => {
  const text = fs.readFileSync(BOOK, "utf8");
  const firstQuestionIndex = text.indexOf("你第一步会查什么？为什么？");

  assert.ok(firstQuestionIndex > 0);
  const beforeFirstQuestion = text.slice(0, firstQuestionIndex);

  assert.equal(beforeFirstQuestion.includes("请使用《界体》"), false);
  assert.equal(beforeFirstQuestion.includes("方法是《界体》"), false);
});
