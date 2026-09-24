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

function clickChoice(root, pattern) {
  const button = findAll(root, "button").find((candidate) =>
    pattern.test(candidate.textContent)
  );

  assert.ok(
    button,
    `choice not found: ${pattern}; buttons: ${findAll(root, "button")
      .map((candidate) => candidate.textContent)
      .join(" | ")}`
  );

  button.click();
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


test("generic player can carry the real case through a complete path", async () => {
  const pkg = loadCasePackage(path.resolve("content/cases/jieti-water-001"));
  const compiled = compileStory(pkg.storySource);
  const doc = new FakeDocument();
  const root = new FakeElement("main", doc);

  await bootPlayer({
    root,
    manifestUrl: "./manifest.json",
    storyUrl: "./story.json",
    fetchImpl: async (url) => {
      if (url.endsWith("manifest.json")) {
        return response({ json: pkg.manifest });
      }
      return response({ text: compiled.json });
    },
    InkStory: require("inkjs").Story,
    documentRef: doc
  });

  clickChoice(root, /先查主表究竟把哪些用水算在一起/);
  clickChoice(root, /把这些跨界用水单独列出来/);
  clickChoice(root, /60 m³ 还不能直接命名成原因/);
  clickChoice(root, /改界改变了原因判断/);
  clickChoice(root, /把冷却系统作为已经明确的对象/);

  const text = allText(root);
  assert.match(text, /从《界体》转向《衡算》/);
  assert.match(text, /本次互动已结束/);

  const restart = findAll(root, "button").find(
    (button) => button.textContent === "重新开始"
  );
  assert.ok(restart);
});
