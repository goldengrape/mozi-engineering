(function (global, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (global) {
    global.MoziPlayer = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STRUCTURED_TYPES = new Set(["multi", "number", "rank"]);

  function splitOutput(text) {
    return String(text || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function createElement(doc, tagName, options = {}) {
    const element = doc.createElement(tagName);

    if (options.className) element.className = options.className;
    if (options.text !== undefined) element.textContent = options.text;

    for (const [name, value] of Object.entries(options.attributes || {})) {
      element.setAttribute(name, value);
    }

    return element;
  }

  function renderText(doc, transcript, text) {
    for (const line of splitOutput(text)) {
      transcript.appendChild(
        createElement(doc, "p", {
          className: "story-line",
          text: line
        })
      );
    }
  }

  function replaceChildren(element, ...children) {
    if (typeof element.replaceChildren === "function") {
      element.replaceChildren(...children);
      return;
    }

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    for (const child of children) element.appendChild(child);
  }

  function continueStory(story) {
    const chunks = [];
    const tags = [];

    while (story.canContinue) {
      chunks.push(story.Continue());

      for (const tag of story.currentTags || []) {
        tags.push(tag);
      }
    }

    return {
      text: chunks.join(""),
      tags
    };
  }

  function parseNumber(value, key) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error(`invalid ui:${key} value: ${value}`);
    }
    return parsed;
  }

  function parseUiTags(tags) {
    const config = {
      type: null,
      bind: null,
      options: [],
      min: null,
      max: null,
      step: null,
      unit: "",
      submit: ""
    };

    let sawUiTag = false;

    for (const rawTag of tags || []) {
      const tag = String(rawTag).trim();
      if (!tag.startsWith("ui:")) continue;

      sawUiTag = true;
      const body = tag.slice(3);
      const equals = body.indexOf("=");
      if (equals === -1) continue;

      const key = body.slice(0, equals).trim();
      const value = body.slice(equals + 1).trim();

      if (key === "type") config.type = value;
      else if (key === "bind") config.bind = value;
      else if (key === "option") {
        const separator = value.indexOf("|");
        if (separator <= 0 || separator === value.length - 1) {
          throw new Error(`invalid ui:option value: ${value}`);
        }

        config.options.push({
          id: value.slice(0, separator).trim(),
          label: value.slice(separator + 1).trim()
        });
      } else if (key === "min") config.min = parseNumber(value, key);
      else if (key === "max") config.max = parseNumber(value, key);
      else if (key === "step") config.step = parseNumber(value, key);
      else if (key === "unit") config.unit = value;
      else if (key === "submit") config.submit = value;
    }

    if (!sawUiTag || !config.type) return null;

    if (!STRUCTURED_TYPES.has(config.type)) {
      throw new Error(`unsupported ui:type: ${config.type}`);
    }

    if (!config.bind) {
      throw new Error(`ui:${config.type} requires ui:bind`);
    }

    if ((config.type === "multi" || config.type === "rank") && config.options.length === 0) {
      throw new Error(`ui:${config.type} requires at least one ui:option`);
    }

    if (config.type === "multi") {
      if (config.min === null) config.min = 1;
      if (config.max === null) config.max = config.options.length;

      if (
        config.min < 0 ||
        config.max < config.min ||
        config.max > config.options.length
      ) {
        throw new Error("invalid ui:multi min/max");
      }
    }

    if (config.type === "number" && config.step !== null && config.step <= 0) {
      throw new Error("ui:number step must be greater than zero");
    }

    if (!config.submit) config.submit = "提交";

    return config;
  }

  function renderLoadError({ root, doc, message, retry }) {
    const panel = createElement(doc, "section", {
      className: "load-error",
      attributes: { role: "alert" }
    });

    panel.appendChild(
      createElement(doc, "p", {
        text: "案例暂时无法载入。"
      })
    );

    panel.appendChild(
      createElement(doc, "p", {
        className: "error-detail",
        text: message
      })
    );

    const button = createElement(doc, "button", {
      className: "secondary-action",
      text: "重试",
      attributes: { type: "button" }
    });

    button.addEventListener("click", retry);
    panel.appendChild(button);
    replaceChildren(root, panel);
  }

  function renderRuntimeError({ choices, doc, message }) {
    replaceChildren(choices);
    const panel = createElement(doc, "div", {
      className: "interaction-error",
      attributes: { role: "alert" }
    });
    panel.appendChild(
      createElement(doc, "p", {
        text: "这个互动步骤的配置无法显示。"
      })
    );
    panel.appendChild(
      createElement(doc, "p", {
        className: "error-detail",
        text: message
      })
    );
    choices.appendChild(panel);
  }

  function setStoryVariable(story, name, value) {
    story.variablesState[name] = value;
  }

  function renderStructuredInteraction({
    doc,
    choices,
    story,
    config,
    advance
  }) {
    if (story.currentChoices.length !== 1) {
      throw new Error(
        `ui:${config.type} requires exactly one Ink commit choice; found ${story.currentChoices.length}`
      );
    }

    replaceChildren(choices);

    const panel = createElement(doc, "section", {
      className: `interaction-panel interaction-${config.type}`
    });
    const error = createElement(doc, "p", {
      className: "interaction-validation",
      attributes: {
        role: "alert",
        "aria-live": "polite"
      }
    });

    function fail(message) {
      error.textContent = message;
    }

    function commit(value) {
      fail("");
      setStoryVariable(story, config.bind, value);
      story.ChooseChoiceIndex(0);
      advance();
    }

    if (config.type === "multi") {
      const fieldset = createElement(doc, "fieldset", {
        className: "interaction-fieldset"
      });
      fieldset.appendChild(
        createElement(doc, "legend", {
          text: "请选择"
        })
      );

      const inputs = config.options.map((option) => {
        const label = createElement(doc, "label", {
          className: "interaction-option"
        });
        const input = createElement(doc, "input", {
          attributes: {
            type: "checkbox",
            value: option.id
          }
        });
        input.value = option.id;
        input.checked = false;

        label.appendChild(input);
        label.appendChild(
          createElement(doc, "span", {
            text: option.label
          })
        );
        fieldset.appendChild(label);
        return input;
      });

      panel.appendChild(fieldset);
      panel.appendChild(error);

      const submit = createElement(doc, "button", {
        className: "choice-button interaction-submit",
        text: config.submit,
        attributes: { type: "button" }
      });

      submit.addEventListener("click", () => {
        const selected = inputs
          .filter((input) => input.checked)
          .map((input) => input.value);

        if (selected.length < config.min || selected.length > config.max) {
          const range =
            config.min === config.max
              ? `请选择 ${config.min} 项。`
              : `请选择 ${config.min}–${config.max} 项。`;
          fail(range);
          return;
        }

        commit(selected.join(","));
      });

      panel.appendChild(submit);
    }

    if (config.type === "number") {
      const label = createElement(doc, "label", {
        className: "interaction-number-label"
      });
      label.appendChild(
        createElement(doc, "span", {
          text: config.unit ? `输入数值（${config.unit}）` : "输入数值"
        })
      );

      const attributes = {
        type: "number",
        inputmode: "decimal"
      };
      if (config.min !== null) attributes.min = String(config.min);
      if (config.max !== null) attributes.max = String(config.max);
      if (config.step !== null) attributes.step = String(config.step);

      const input = createElement(doc, "input", {
        className: "interaction-number-input",
        attributes
      });
      input.value = "";
      label.appendChild(input);
      panel.appendChild(label);
      panel.appendChild(error);

      const submit = createElement(doc, "button", {
        className: "choice-button interaction-submit",
        text: config.submit,
        attributes: { type: "button" }
      });

      submit.addEventListener("click", () => {
        const value = Number(input.value);

        if (input.value === "" || !Number.isFinite(value)) {
          fail("请输入一个数值。");
          return;
        }
        if (config.min !== null && value < config.min) {
          fail(`数值不能小于 ${config.min}。`);
          return;
        }
        if (config.max !== null && value > config.max) {
          fail(`数值不能大于 ${config.max}。`);
          return;
        }

        commit(value);
      });

      panel.appendChild(submit);
    }

    if (config.type === "rank") {
      const fieldset = createElement(doc, "fieldset", {
        className: "interaction-fieldset"
      });
      fieldset.appendChild(
        createElement(doc, "legend", {
          text: "安排顺序"
        })
      );

      const selects = config.options.map((_, position) => {
        const row = createElement(doc, "label", {
          className: "rank-row"
        });
        row.appendChild(
          createElement(doc, "span", {
            text: `第 ${position + 1} 位`
          })
        );

        const select = createElement(doc, "select", {
          className: "rank-select",
          attributes: {
            "aria-label": `第 ${position + 1} 位`
          }
        });
        select.value = "";

        const placeholder = createElement(doc, "option", {
          text: "请选择",
          attributes: { value: "" }
        });
        select.appendChild(placeholder);

        for (const option of config.options) {
          select.appendChild(
            createElement(doc, "option", {
              text: option.label,
              attributes: { value: option.id }
            })
          );
        }

        row.appendChild(select);
        fieldset.appendChild(row);
        return select;
      });

      panel.appendChild(fieldset);
      panel.appendChild(error);

      const submit = createElement(doc, "button", {
        className: "choice-button interaction-submit",
        text: config.submit,
        attributes: { type: "button" }
      });

      submit.addEventListener("click", () => {
        const values = selects.map((select) => select.value);

        if (values.some((value) => !value)) {
          fail("请为每个位置选择一项。");
          return;
        }

        if (new Set(values).size !== values.length) {
          fail("同一项不能重复出现在多个位置。");
          return;
        }

        commit(values.join(","));
      });

      panel.appendChild(submit);
    }

    choices.appendChild(panel);
  }

  async function bootPlayer({
    root,
    manifestUrl,
    storyUrl,
    fetchImpl,
    InkStory,
    documentRef
  }) {
    if (!root) throw new Error("bootPlayer requires a root element");

    const doc =
      documentRef ||
      root.ownerDocument ||
      (typeof document !== "undefined" ? document : null);
    const fetchFn =
      fetchImpl ||
      (typeof fetch !== "undefined" ? fetch.bind(globalThis) : null);
    const StoryClass =
      InkStory ||
      (typeof globalThis !== "undefined" &&
      globalThis.inkjs &&
      globalThis.inkjs.Story
        ? globalThis.inkjs.Story
        : null);

    if (!doc) throw new Error("bootPlayer requires a document");
    if (!fetchFn) throw new Error("bootPlayer requires fetch");
    if (!StoryClass) throw new Error("inkjs.Story is not available");

    let manifest;
    let storyJson;

    async function load() {
      const [manifestResponse, storyResponse] = await Promise.all([
        fetchFn(manifestUrl),
        fetchFn(storyUrl)
      ]);

      if (!manifestResponse.ok) {
        throw new Error(
          `manifest request failed: ${manifestResponse.status || "unknown"}`
        );
      }

      if (!storyResponse.ok) {
        throw new Error(
          `story request failed: ${storyResponse.status || "unknown"}`
        );
      }

      manifest = await manifestResponse.json();
      storyJson = await storyResponse.text();
    }

    function startStory() {
      const story = new StoryClass(storyJson);

      const shell = createElement(doc, "article", {
        className: "case-shell"
      });

      const heading = createElement(doc, "header", {
        className: "case-heading"
      });
      heading.appendChild(
        createElement(doc, "p", {
          className: "case-kicker",
          text: "互动练习"
        })
      );
      heading.appendChild(
        createElement(doc, "h1", {
          text: manifest.title || "互动案例"
        })
      );

      const transcript = createElement(doc, "div", {
        className: "story-transcript",
        attributes: {
          "aria-live": "polite",
          "aria-atomic": "false"
        }
      });

      const choices = createElement(doc, "div", {
        className: "story-choices",
        attributes: { "aria-label": "可选行动" }
      });

      const controls = createElement(doc, "div", {
        className: "story-controls"
      });

      shell.appendChild(heading);
      shell.appendChild(transcript);
      shell.appendChild(choices);
      shell.appendChild(controls);
      replaceChildren(root, shell);

      function advance() {
        try {
          const output = continueStory(story);
          renderText(doc, transcript, output.text);
          replaceChildren(choices);

          if (story.currentChoices.length > 0) {
            const uiConfig = parseUiTags(output.tags);

            if (uiConfig) {
              renderStructuredInteraction({
                doc,
                choices,
                story,
                config: uiConfig,
                advance
              });
              return;
            }

            story.currentChoices.forEach((choice, index) => {
              const button = createElement(doc, "button", {
                className: "choice-button",
                text: choice.text,
                attributes: { type: "button" }
              });

              button.addEventListener("click", () => {
                story.ChooseChoiceIndex(index);
                advance();
              });

              choices.appendChild(button);
            });
            return;
          }

          replaceChildren(controls);
          controls.appendChild(
            createElement(doc, "p", {
              className: "completion-note",
              text: "本次互动已结束。你可以重新开始，尝试另一条判断路径。"
            })
          );

          const restart = createElement(doc, "button", {
            className: "secondary-action",
            text: "重新开始",
            attributes: { type: "button" }
          });
          restart.addEventListener("click", startStory);
          controls.appendChild(restart);
        } catch (error) {
          renderRuntimeError({
            choices,
            doc,
            message: error.message
          });
        }
      }

      advance();
      return story;
    }

    async function retry() {
      try {
        await load();
        startStory();
      } catch (error) {
        renderLoadError({
          root,
          doc,
          message: error.message,
          retry
        });
      }
    }

    try {
      await load();
      const story = startStory();
      return { manifest, story, restart: startStory };
    } catch (error) {
      renderLoadError({
        root,
        doc,
        message: error.message,
        retry
      });
      return { error };
    }
  }

  function autoBoot(doc) {
    const documentToUse =
      doc || (typeof document !== "undefined" ? document : null);
    if (!documentToUse) return null;

    const root = documentToUse.querySelector("[data-mozi-player]");
    if (!root) return null;

    return bootPlayer({
      root,
      manifestUrl: root.dataset.manifestUrl,
      storyUrl: root.dataset.storyUrl
    });
  }

  return {
    bootPlayer,
    autoBoot,
    splitOutput,
    continueStory,
    parseUiTags
  };
});

if (typeof window !== "undefined" && window.document) {
  window.document.addEventListener("DOMContentLoaded", function () {
    if (window.MoziPlayer) {
      window.MoziPlayer.autoBoot(window.document);
    }
  });
}
