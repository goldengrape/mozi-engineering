const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { loadCasePackage, compileStory } = require("../scripts/case-package.cjs");
const { bootPlayer } = require("../src/player.js");

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

test("TDD-TEST-015: bootPlayer renders story choices and can restart", async () => {
  const pkg = loadCasePackage(path.resolve("content/cases/jieti-water-001"));
  const compiled = compileStory(pkg.storySource);
  const doc = new FakeDocument();
  const root = new FakeElement("main", doc);

  const fetchImpl = async (url) => {
    if (url.endsWith("manifest.json")) {
      return response({ json: pkg.manifest });
    }
    return response({ text: compiled.json });
  };

  const result = await bootPlayer({
    root,
    manifestUrl: "./manifest.json",
    storyUrl: "./story.json",
    fetchImpl,
    InkStory: require("inkjs").Story,
    documentRef: doc
  });

  assert.equal(result.manifest.case_id, "jieti-water-001");
  assert.match(allText(root), /1000 m³/);

  let buttons = findAll(root, "button");
  assert.equal(buttons.length, 2);
  buttons[0].click();

  assert.match(allText(root), /屋顶冷却补水/);
  buttons = findAll(root, "button");
  assert.ok(buttons.length >= 2);

  result.restart();
  assert.match(allText(root), /1000 m³/);
  assert.equal(findAll(root, "button").length, 2);
});

test("TDD-TEST-015: load failure produces readable retry UI", async () => {
  const doc = new FakeDocument();
  const root = new FakeElement("main", doc);

  const result = await bootPlayer({
    root,
    manifestUrl: "./manifest.json",
    storyUrl: "./story.json",
    fetchImpl: async () => response({ ok: false, status: 503 }),
    InkStory: require("inkjs").Story,
    documentRef: doc
  });

  assert.ok(result.error);
  assert.match(allText(root), /案例暂时无法载入/);
  assert.match(allText(root), /503/);
  assert.equal(findAll(root, "button").length, 1);
});
