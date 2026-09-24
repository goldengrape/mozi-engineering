const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const { compileStory } = require("../scripts/case-package.cjs");
const {
  bootPlayer,
  continueStory,
  parseUiTags
} = require("../src/player.js");

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.className = "";
    this.textContent = "";
    this.dataset = {};
    this.value = "";
    this.checked = false;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = [...children];
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  addEventListener(name, listener) {
    this.listeners[name] = listener;
  }

  click() {
    if (this.listeners.click) this.listeners.click();
  }
}

class FakeDocument {
  createElement(tagName) {
    return new FakeElement(tagName, this);
  }
}

function findAll(root, tagName) {
  const result = [];
  const expected = tagName.toUpperCase();

  function visit(node) {
    if (node.tagName === expected) result.push(node);
    for (const child of node.children || []) visit(child);
  }

  visit(root);
  return result;
}

function allText(root) {
  let text = root.textContent || "";
  for (const child of root.children || []) text += "\n" + allText(child);
  return text;
}

function findButton(root, text) {
  const button = findAll(root, "button").find(
    (candidate) => candidate.textContent === text
  );
  assert.ok(button, `button not found: ${text}`);
  return button;
}

function response({ ok = true, status = 200, json, text }) {
  return {
    ok,
    status,
    async json() {
      return json;
    },
    async text() {
      return text;
    }
  };
}

test("interaction tag parser recognizes generic primitive configuration", () => {
  const config = parseUiTags([
    "ui:type=multi",
    "ui:bind=selected",
    "ui:option=a|甲",
    "ui:option=b|乙",
    "ui:min=1",
    "ui:max=2",
    "ui:submit=提交选择",
    "ui:future-key=ignored"
  ]);

  assert.equal(config.type, "multi");
  assert.equal(config.bind, "selected");
  assert.deepEqual(config.options, [
    { id: "a", label: "甲" },
    { id: "b", label: "乙" }
  ]);
  assert.equal(config.min, 1);
  assert.equal(config.max, 2);
  assert.equal(config.submit, "提交选择");
});

test("malformed structured interaction fails instead of guessing", () => {
  assert.throws(
    () => parseUiTags(["ui:type=multi", "ui:option=a|甲"]),
    /requires ui:bind/
  );

  assert.throws(
    () =>
      parseUiTags([
        "ui:type=rank",
        "ui:bind=order",
        "ui:option=broken"
      ]),
    /invalid ui:option/
  );
});

test("inkjs line tags survive continuation and expose the first primitive", () => {
  const source = fs.readFileSync(
    path.resolve("tests/fixtures/interaction-primitives.ink"),
    "utf8"
  );
  const story = compileStory(source).runtime;
  const output = continueStory(story);
  const config = parseUiTags(output.tags);

  assert.match(output.text, /请选择需要保留的项目/);
  assert.equal(config.type, "multi");
  assert.equal(config.bind, "multi_answer");
  assert.equal(story.currentChoices.length, 1);
});

test("generic player executes multi, number and rank without case-specific code", async () => {
  const source = fs.readFileSync(
    path.resolve("tests/fixtures/interaction-primitives.ink"),
    "utf8"
  );
  const compiled = compileStory(source);
  const doc = new FakeDocument();
  const root = new FakeElement("main", doc);

  const result = await bootPlayer({
    root,
    manifestUrl: "./manifest.json",
    storyUrl: "./story.json",
    fetchImpl: async (url) => {
      if (url.endsWith("manifest.json")) {
        return response({
          json: {
            case_id: "primitive-fixture",
            title: "primitive fixture"
          }
        });
      }
      return response({ text: compiled.json });
    },
    InkStory: require("inkjs").Story,
    documentRef: doc
  });

  let checkboxes = findAll(root, "input").filter(
    (input) => input.attributes.type === "checkbox"
  );
  assert.equal(checkboxes.length, 3);
  checkboxes[0].checked = true;
  checkboxes[1].checked = true;
  findButton(root, "提交多选").click();

  assert.equal(result.story.variablesState["multi_answer"], "a,b");
  assert.match(allText(root), /已记录多选：a,b/);

  const numberInput = findAll(root, "input").find(
    (input) => input.attributes.type === "number"
  );
  assert.ok(numberInput);
  numberInput.value = "5";
  findButton(root, "提交数值").click();

  assert.equal(result.story.variablesState["number_answer"], 5);
  assert.match(allText(root), /已记录数值：5/);

  const selects = findAll(root, "select");
  assert.equal(selects.length, 3);
  selects[0].value = "b";
  selects[1].value = "a";
  selects[2].value = "c";
  findButton(root, "提交顺序").click();

  assert.equal(result.story.variablesState["rank_answer"], "b,a,c");
  assert.match(allText(root), /已记录顺序：b,a,c/);
  assert.match(allText(root), /本次互动已结束/);
});

test("structured controls validate before committing to Ink", async () => {
  const source = fs.readFileSync(
    path.resolve("tests/fixtures/interaction-primitives.ink"),
    "utf8"
  );
  const compiled = compileStory(source);
  const doc = new FakeDocument();
  const root = new FakeElement("main", doc);

  const result = await bootPlayer({
    root,
    manifestUrl: "./manifest.json",
    storyUrl: "./story.json",
    fetchImpl: async (url) =>
      url.endsWith("manifest.json")
        ? response({ json: { title: "fixture" } })
        : response({ text: compiled.json }),
    InkStory: require("inkjs").Story,
    documentRef: doc
  });

  findButton(root, "提交多选").click();

  assert.equal(result.story.variablesState["multi_answer"], "");
  assert.match(allText(root), /请选择 1–2 项/);
});
