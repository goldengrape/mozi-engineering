# Interaction Primitive Protocol v0.1

> Phase 2 contract for extending the Ink layer across all sixteen chapters.

## Boundary

Ink remains the owner of:

- case-specific evidence order;
- learning-state variables;
- branch consequences;
- feedback and debrief;
- method-switch conditions.

The browser player remains generic. It may render a small set of interaction primitives, but it must not contain chapter names, method-specific scoring rules, or case-specific answer keys.

## Primitive set

### choice

Existing Ink choices. No protocol tags are required.

### multi

Use when the learner must select one or more items before Ink continues.

Required tags:

```ink
# ui:type=multi
# ui:bind=selected_items
# ui:option=a::第一项
# ui:option=b::第二项
```

Optional tags:

```ink
# ui:min=1
# ui:max=2
# ui:submit=提交选择
```

The bound Ink variable must be a string. The player writes selected option IDs in source order, joined with commas, then chooses the single Ink commit choice.

### number

Use when prediction/calculation itself is part of the learning action.

```ink
# ui:type=number
# ui:bind=predicted_value
# ui:min=0
# ui:max=100
# ui:step=1
# ui:unit=kg/h
# ui:submit=提交数值
```

The bound Ink variable must be numeric.

### rank

Use when the learner must place a fixed set of actions/items in order.

```ink
# ui:type=rank
# ui:bind=ordered_steps
# ui:option=a::步骤 A
# ui:option=b::步骤 B
# ui:option=c::步骤 C
# ui:submit=提交顺序
```

The bound Ink variable is a comma-separated string of option IDs.

## Ink commit rule

A structured primitive is an Ink pause point.

At that point:

1. the story emits one `ui:type` tag, one `ui:bind` tag, and any option/config tags;
2. exactly **one** Ink choice is exposed as the commit continuation;
3. the browser collects the learner action;
4. the browser writes only the declared bound variable;
5. the browser selects the one commit choice;
6. Ink resumes and decides what the answer means.

This keeps evaluation and pedagogy inside Ink rather than JavaScript.

## Tag grammar

Recognized tags:

```text
ui:type=<multi|number|rank>
ui:bind=<ink variable>
ui:option=<stable-id>::<visible label>
ui:min=<number>
ui:max=<number>
ui:step=<number>
ui:unit=<text>
ui:submit=<button label>
```

Unknown `ui:` keys are ignored for forward compatibility. Malformed required configuration produces a readable player error rather than guessing.

## Accessibility

Structured primitives must:

- use native checkbox, number-input and select controls;
- keep visible labels;
- work without drag-and-drop;
- work with keyboard only;
- expose validation errors using `role=alert`;
- preserve the existing reduced-motion and mobile-width behavior.

## Full-book mapping

The source-derived chapter/worked-example map and the design-derived primitive allocation live in:

`content/curriculum.json`

The registry is planning/authoring metadata. A chapter may combine primitives, but adding a chapter must not require chapter-specific code in `src/player.js`.
