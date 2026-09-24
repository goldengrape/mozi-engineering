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
        if (story.canContinue) {
          renderText(doc, transcript, story.ContinueMaximally());
        }

        replaceChildren(choices);

        if (story.currentChoices.length > 0) {
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
    splitOutput
  };
});

if (typeof window !== "undefined" && window.document) {
  window.document.addEventListener("DOMContentLoaded", function () {
    if (window.MoziPlayer) {
      window.MoziPlayer.autoBoot(window.document);
    }
  });
}
