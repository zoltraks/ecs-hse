# HTML Engineering Standards

<!-- Version: 0.1.0 | Date: 2026-10-15 | Runtime: N/A -->

## Purpose

This document defines development standards for HTML, CSS,
and JavaScript written for the browser without a compile step.

It is the general layer for the `html-*` engineering standards.

A category standard assumes this document is applied first and adds only its category-specific
rules.

It is written to be executed directly by an AI coding agent such as Devin, Antigravity,
or Claude Code, and to be read without effort by a human reviewer.

## Scope

A project is in scope when all of the following conditions hold.

- The browser loads hand-written HTML, CSS, and JavaScript.
- No bundler, transpiler, or preprocessor sits between the source files and the browser.
- Runtime dependencies are zero, or limited to a small number of libraries loaded on demand.
- The result is served from a static file server or opened directly from the file system.

The rules apply to websites, browser applications, prototypes, and embedded documents alike.

A project that compiles a framework such as React, Vue, Angular,
or Svelte is out of scope - use the matching framework standard instead.

A backend service is out of scope - use the standard for the language it is written in.

## How To Use This Standard

This section is the entry point for an agent.

Read it before reading anything else in this document.

### Order Of Operations

Follow these steps in order at the start of every task that touches HTML, CSS, or JavaScript source.

1. Read the project rules file, such as `AGENTS.md`, `README.md`, or `docs/GUIDELINES.md`,
   because a project rule overrides this standard.
2. Determine the project conventions using the Agent Intake Protocol below.
3. Confirm the conclusion with the user when the repository is ambiguous or empty.
4. Apply the sections of this standard, then the matching category standard.
5. Run every applicable row of the Verification section.
6. Check the result against the Definition of Done before reporting the task complete.

### Precedence

When two rules conflict, apply the first matching source in this list.

| Rank | Source                                    | Example                                        |
|------|-------------------------------------------|------------------------------------------------|
| 1    | An explicit instruction from the user     | "Keep everything in one file"                  |
| 2    | The project rules file                    | `AGENTS.md`, `docs/GUIDELINES.md`              |
| 3    | The existing convention in the repository | Double quotes in JavaScript across every file  |
| 4    | This standard                             | Single quotes in JavaScript                    |
| 5    | General web development best practice     | Anything not covered by the four sources above |

Never silently reformat existing code to match this standard.

Bring a deviation to the user as a proposal, not an unrequested edit.

### Non-Negotiable Rules

These rules hold in every project in scope, including a throwaway prototype.

- **Escape everything.** No value reaches `innerHTML` without passing through the escape helper.
- **Readable source.** The code is formatted, indented, and logically divided, whatever the layout.
- **Prefer the platform.** Reach for a browser feature before writing the code it would replace.
- **Responsive.** The page adapts to viewport width, viewport height, and orientation,
  with no horizontal page scroll at any supported size.
- **Keyboard and screen reader parity.** Every action reachable with a pointer is reachable with a
  keyboard.
- **Lowest workable complexity.** Choose the smallest structure that solves the problem,
  and grow only when a real boundary appears.

A violation of any of these rules is a defect, not a style preference.

## Agent Intake Protocol

The agent must know the project's conventions before it writes a single line.

There is no profile file to maintain.

The repository itself is the record of the decision,
so the agent derives the answers from the files that exist and asks only when the files cannot
answer.

### Detection First

Inspect the repository before asking anything.

Apply the detection table below and form a conclusion.

| Signal Found In The Repository                        | Inferred Convention         |
|-------------------------------------------------------|-----------------------------|
| `<script type="module">` in the entry document        | ES modules                  |
| Ordered classic `<script>` tags                       | Classic scripts             |
| A single namespace object                             | Namespace organization      |
| One class per file wired by a bootstrap               | Class-per-file organization |
| Dominant double quotes in JavaScript                  | Double-quote style          |
| Dominant two-space indent                             | Two-space indentation       |
| An `i18n` module or a translations directory          | Locale support present      |
| A `localStorage` key constant                         | Persistence present         |
| `server.js`, `server.mjs`, or a `start` script        | Development server present  |

Also detect the application model and the source layout when the category standard defines them.

### Existing Project

When detection reaches a confident conclusion, state it and ask for a single confirmation.

Do not run the full questionnaire against a repository that already answers it.

```
Detected: classic scripts, namespace object, double quotes, two-space indent,
i18n present, localStorage present.
Continuing on that basis unless you say otherwise.
```

Ask a targeted question only for a decision that detection could not resolve and that the task
actually depends on.

Never ask about a decision that has no bearing on the requested change.

### New Project

When the repository is empty, or the task is to start a new project,
ask the intake questions before writing code.

Ask them as one grouped set, not one at a time.

| Question            | Options                                               | Default If Declined |
|---------------------|-------------------------------------------------------|---------------------|
| Distribution        | Static host, Opened from the file system, Both        | Static host         |
| Module system       | ES modules, Classic scripts                           | Classic scripts     |
| Persistence         | None, `localStorage`, `localStorage` plus JSON export | `localStorage`      |
| Languages           | One, Several                                          | One                 |
| Offline requirement | Not required, Must work with no network               | Not required        |

The answers cascade into the remaining decisions without further questions.

| Answer                                | Consequence                                                              |
|---------------------------------------|--------------------------------------------------------------------------|
| Distribution includes the file system | Classic scripts, no ES modules, no `fetch` of local data                 |
| Distribution is a static host only    | ES modules are permitted, and the project states that choice in the docs |
| Offline requirement is set            | Every third-party library is vendored, no CDN reference survives         |
| Languages is Several                  | An i18n module is created before the first user-facing string is written |

### Asking Well

Present the questions as a compact numbered list with the default marked.

State that the user may answer with a single line,
such as `static host, ES modules, localStorage, one language, no offline need`.

Do not block on an answer that the task does not need.

Do not re-ask a question that a previous answer in the same session already resolved.

### Recording The Decision

Do not create a profile file, a decision log, or a settings file to store the answers.

Create the file structure that the answers imply, and let that structure be the record.

State the resulting structure in `README.md` so a human reader sees the same conclusion the agent
will detect later.

## Documentation

Consult these sources rather than guessing at browser behavior.

- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Web Vitals](https://web.dev/articles/vitals)
- [Baseline Web Platform Status](https://webstatus.dev/)
- [Can I Use](https://caniuse.com/)

## Core Technologies

- **HTML5**: One entry document per page or application.
- **Native CSS**: Custom properties on `:root`, no preprocessor.
- **ECMAScript 2020 or later**: Written directly, never transpiled.
- **Node.js 18 or later**: Tooling only, never in the browser path.

Add a third-party library only when the alternative is significantly more code.

When a library is added, load it lazily and provide a fallback for the case where the load fails.

## Platform Baseline

A frameworkless project is viable today because the platform absorbed most of what a framework used
to provide.

Prefer a platform feature over hand-written code whenever the platform feature exists.

The table below lists the features this standard assumes, grouped by how safe they are to depend on.

**Widely available**, meaning safe to use with no fallback.

| Feature                            | Replaces                                     |
|------------------------------------|----------------------------------------------|
| `<dialog>` and `showModal()`       | A hand-written modal with a focus trap       |
| CSS custom properties              | A preprocessor variable                      |
| CSS Grid and Flexbox               | A layout framework                           |
| Container queries and `@container` | A width-observing script                     |
| `:has()`                           | A parent-marking class toggled by JavaScript |
| Cascade layers and `@layer`        | Specificity arithmetic                       |
| CSS nesting                        | A preprocessor                               |
| `clamp()`, `min()`, `max()`        | A resize handler that computes a font size   |
| `color-mix()`                      | A hand-maintained tint and shade palette     |
| ES modules and dynamic `import()`  | A bundler                                    |
| Import maps                        | A module resolver                            |
| Custom elements and `<template>`   | A component abstraction                      |
| `AbortController`                  | Manual listener bookkeeping                  |
| `ResizeObserver`                   | A polled `resize` handler                    |
| `IntersectionObserver`             | A polled `scroll` handler                    |
| `matchMedia`                       | A width comparison in JavaScript             |
| `structuredClone()`                | `JSON.parse(JSON.stringify(value))`          |
| `requestAnimationFrame`            | `setInterval` for animation                  |

**Newly available**, meaning usable with a documented fallback.

| Feature                   | Fallback                                            |
|---------------------------|-----------------------------------------------------|
| Popover API               | A positioned element with an outside-click listener |
| View Transitions API      | An immediate swap with no transition                |
| Navigation API            | The History API                                     |
| CSS anchor positioning    | A computed position from `getBoundingClientRect`    |
| Declarative shadow DOM    | An imperative `attachShadow` call                   |
| `scheduler.yield()`       | `await new Promise(r => setTimeout(r, 0))`          |
| `requestIdleCallback()`   | `setTimeout` with a short delay                     |
| `<dialog closedby="any">` | A click listener that compares the event target     |

Guard a newly available feature at the point of use, never through user agent sniffing.

```javascript
function withViewTransition(update) {
  if (!document.startViewTransition) return update();
  return document.startViewTransition(update);
}
```

Verify the current status of any feature before depending on it,
and record the decision in the project documentation when the choice is not obvious.

Web components are worth their cost when the project needs style encapsulation or a component that
must outlive the current file layout.

They are not worth their cost in a single-file tool with a handful of screens.

## Project Structure

The category standard fixes the concrete source layout.

The baseline expectation that holds in every project:

```plaintext
project-root/
  index.html              -- entry document
  css/                    -- stylesheets
  js/                     -- scripts
  docs/                   -- project documentation
```

Never place application source inside `docs/`.

Keep generated data in its own file so the hand-edited sources stay reviewable.

State the chosen structure in `README.md` so a future session re-derives it from the repository.

## Naming Conventions

### Code Conventions

| Kind             | Style                  | Example              |
|------------------|------------------------|----------------------|
| Namespace object | `PascalCase`           | `App`, `I18n`        |
| Class            | `PascalCase`           | `ItemListRenderer`   |
| Function, method | `camelCase`            | `showScreen()`       |
| Variable         | `camelCase`            | `currentIndex`       |
| Module constant  | `SCREAMING_SNAKE_CASE` | `STORAGE_KEY`        |
| CSS class        | `kebab-case`           | `.question-card`     |
| CSS modifier     | `kebab-case--modifier` | `.btn--danger`       |
| CSS state class  | `kebab-case`           | `.active`, `.hidden` |
| HTML id          | `kebab-case`           | `home-screen`        |
| Custom property  | `--kebab-case`         | `--color-bg`         |

Do not use a leading underscore to mark a method as private.

### File Naming Conventions

| Artifact         | Convention           | Example                    |
|------------------|----------------------|----------------------------|
| HTML entry point | `index.html`         | `src/index.html`           |
| Stylesheet       | `kebab-case.css`     | `css/style.css`            |
| Module script    | `kebab-case.js`      | `js/item-list-renderer.js` |
| Generated data   | `kebab-case-data.js` | `js/catalog-data.js`       |
| Static server    | `server.js`          | `runtime/server.js`        |

A file name describes the single responsibility of the file.

## Code Conventions

### HTML

The entry document declares the doctype, the language, the character set, and the viewport.

It links stylesheets in cascade order and loads scripts in dependency order at the end of `<body>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Item Catalog</title>
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/layout.css" />
  <link rel="stylesheet" href="css/interactive.css" />
</head>
<body>
  <div id="app"></div>
  <script src="js/model.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

Set `lang` to the actual content language of the page.

Never place a script in `<head>` without `defer`.

Use `<header>`, `<nav>`, `<main>`, `<aside>`, and `<section>` for page regions.

Use `<button>` for anything clickable that is not a link.

Use `<div>` only when no semantic element carries the correct meaning.

Every heading level must follow the previous one without skipping.

### CSS

**Stylesheet order.** When several stylesheets load, document the order,
because that order defines cascade priority.

The order is tokens, then layout, then components, then interactive states.

A variables file must load first so that every later file can reference its custom properties.

A states file must load last so that state styles win over base styles.

In a single stylesheet, keep the same order inside the file.

**Design tokens.** Every colour, radius, shadow, spacing value,
and fixed dimension is a custom property on `:root`.

A literal value may appear in a rule only if it is used exactly once in the whole stylesheet.

The prefix categories below are a guide, not a rigid contract.

| Category  | Prefix      | Example                           |
|-----------|-------------|-----------------------------------|
| Color     | `--color-`  | `--color-danger`                  |
| Surface   | `--bg-`     | `--bg-card`                       |
| Text      | `--text-`   | `--text-muted`                    |
| Spacing   | `--space-`  | `--space-md`                      |
| Radius    | `--radius-` | `--radius-sm`                     |
| Shadow    | `--shadow-` | `--shadow-lg`                     |
| Dimension | none        | `--sidebar-width`, `--row-height` |
| Z-index   | `--z-`      | `--z-modal`                       |
| Font      | `--font-`   | `--font-family`                   |

Token names describe role, not appearance.

Use `--color-danger`, not `--color-red`.

A project may use shorter unprefixed names such as `--primary` or `--success` when the application
is small enough that the category is obvious.

**Reset.** Start every stylesheet with the same minimal reset.

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

button, input, select, textarea {
  font: inherit;
}

img, svg {
  max-width: 100%;
  height: auto;
}
```

Do not import `normalize.css` or a comparable third-party reset.

Form controls do not inherit the page font by default, so the `font: inherit` rule is mandatory.

**Layout.** Use Flexbox for one-dimensional arrangements such as toolbars, rows, and stacks.

Use CSS Grid for two-dimensional arrangements such as card grids, tables, and timelines.

Use `position: absolute` only inside an element that establishes a containing block.

Every z-index value comes from a `--z-` token.

**Responsive design.** Responsive is a requirement, not a feature.

The page adapts to viewport width, viewport height, and orientation,
and produces no horizontal page scroll at any supported size.

Every project defines at least one breakpoint.

Place all `@media` rules at the end of the file they belong to.

The breakpoints below are common reference points, not a mandatory set.

| Breakpoint | Target      | Typical Change                                    |
|------------|-------------|---------------------------------------------------|
| `1024px`   | Tablet      | Sidebar becomes an off-canvas drawer              |
| `768px`    | Large phone | Multi-column grids collapse to one or two columns |
| `640px`    | Phone       | Toolbars stack, tables become card lists          |
| `420px`    | Small phone | Labels shorten, secondary actions hide            |

Use only the breakpoints the layout actually needs.

A component must not shrink below its widest mobile size when the viewport grows past the
breakpoint.

This preserves the largest comfortable mobile size on desktop and prevents a visible jump at the
breakpoint.

Below the breakpoint the component fills the viewport.

Above the breakpoint the component is capped and floored,
and the desktop `min-width` equals the maximum mobile width measured at the breakpoint.

**Fluid before breakpoints.** Reach for a fluid value before reaching for a breakpoint.

A breakpoint is a step change, and a step change is only correct when the layout genuinely
rearranges.

| Need                             | Fluid Technique                        |
|----------------------------------|----------------------------------------|
| Type that scales with the screen | `clamp()` on `font-size`               |
| A column count that adapts       | `repeat(auto-fit, minmax(16rem, 1fr))` |
| A width that never overflows     | `min(100%, 60rem)`                     |
| Spacing that grows with the page | `clamp()` on `padding`                 |

```css
.card-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

h1 {
  font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem);
}
```

A component that must respond to its container rather than to the viewport uses a container query.

This is the correct tool for a card that appears both in a wide main region and in a narrow sidebar.

```css
.card { container-type: inline-size; }

@container (min-width: 24rem) {
  .card-inner { grid-template-columns: auto 1fr; }
}
```

**Orientation and viewport height.** A width breakpoint alone does not describe a phone held
sideways.

A landscape phone is wide and short, so a layout tuned only for width will push its actions off the
bottom of the screen.

```css
@media (orientation: landscape) and (max-height: 480px) {
  .app-header { position: static; }
  .hero { display: none; }
}
```

Use `dvh` rather than `vh` for a full-height region,
because mobile browser toolbars change the visible height while the user scrolls.

```css
.app { min-height: 100dvh; }
```

Never set a fixed pixel height on a region that contains text.

**Input modality.** Adapt to the pointer, not only to the width,
because a large touch screen and a small laptop are different problems.

```css
@media (pointer: coarse) {
  .btn { min-height: 44px; }
}

@media (hover: none) {
  .tooltip-on-hover { display: none; }
}
```

Every interactive target is at least 24 by 24 CSS pixels,
and 44 by 44 where a coarse pointer is expected.

A hover-only affordance must have a tap-reachable or keyboard-reachable equivalent.

**Preventing overflow.** Horizontal page scroll is a defect.

The recurring causes are few, and each has a standard fix.

| Cause                                   | Fix                                                 |
|-----------------------------------------|-----------------------------------------------------|
| A flex or grid child refusing to shrink | `min-width: 0` on the child                         |
| A long unbroken string                  | `overflow-wrap: anywhere` on the text container     |
| A wide table                            | A scroll container with `overflow: auto` around it  |
| A fixed pixel width                     | `max-width: 100%` or a `min()` expression           |
| An oversized image                      | `max-width: 100%` and `height: auto` from the reset |

Test at the narrowest supported width before considering a layout change complete.

**Motion.** Keep transitions between `0.1s` and `0.3s`.

Transition named properties, never `all`.

Respect the reduced motion preference.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### JavaScript

**Module system.** Two module systems are valid, and a project picks one and does not mix them.

**Classic scripts**: ordered `<script>` tags with an explicit global namespace.

This is the default because it works over `http://` and over `file://` without change.

Each file attaches exactly one symbol to `window`.

```javascript
window.ItemListRenderer = class ItemListRenderer {
  constructor(container, catalog) {
    this.container = container;
    this.catalog = catalog;
  }
};
```

**ES modules**: `<script type="module">` with `import` and `export`.

Permitted only when the page is always served over HTTP and never opened from the file system,
because `file://` blocks module loading with CORS.

State that choice in the project specification.

Begin every classic script file with `'use strict';` unless it is an ES module.

**Organization.** Two organization patterns are valid,
and the choice follows the size of the project.

**Namespace object**: a project with a small number of views uses one global namespace object.

The object owns all state and all public methods.

```javascript
const App = {
  state: {
    screen: 'home',
    items: [],
    selection: new Set(),
    currentIndex: 0,
  },

  init() {
    this.loadState();
    this.showScreen(this.state.screen);
  },
};
```

**Class per file**: a project with distinct subsystems uses one class per file.

Each class receives its collaborators through the constructor.

The bootstrap file constructs them and wires them together.

```javascript
function init() {
  const container = document.getElementById('app');
  if (!container) {
    console.error('Missing #app container');
    return;
  }
  const renderer = new ItemListRenderer(container, catalog);
  const history = new HistoryManager(() => Persistence.save(catalog));
  new DragController(renderer, catalog, history);
  renderer.render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

Never leave a loose function or variable in the global scope outside these two patterns.

**Escaping.** Every value that reaches `innerHTML` must be escaped.

Provide one escape helper and use it without exception.

```javascript
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}
```

Prefer `textContent` when the value is plain text and no markup is needed.

Never interpolate a value into an event handler attribute inside a template literal.

**Events.** Attach listeners with `addEventListener`.

Use event delegation on a stable parent for lists and grids that re-render.

```javascript
list.addEventListener('click', event => {
  const row = event.target.closest('[data-id]');
  if (!row) return;
  App.selectItem(row.dataset.id);
});
```

Inline `onclick` attributes are permitted only in static markup and only when the project uses the
global namespace pattern.

In that case the handler contains a single call to a namespace method and no logic.

```html
<button class="btn btn--primary" onclick="App.startTest()">Start</button>
```

Never write an inline handler into generated markup.

Remove listeners when the element they belong to is destroyed.

Use `PointerEvent` for combined mouse and touch input.

Fall back to `mousedown`, `mousemove`, and `mouseup` only when the page must run over `file://`,
and document the deviation in the affected file.

**Error handling.** Validate input at the boundary of every public method.

Log an unexpected state to the console and never swallow an error silently.

Wrap only the operations that can genuinely fail, such as storage access, JSON parsing,
and file reading.

Show the user a message for any failure that changes what they can do.

## Formatting and Linting

Use two-space indentation in HTML, CSS, and JavaScript.

Use single quotes in JavaScript and double quotes in HTML attributes.

A project may pick one quoting style and apply it everywhere, and that choice overrides the default.

Terminate every JavaScript statement with a semicolon.

Use `const` by default and `let` only when the binding is reassigned.

Never use `var`.

Keep a line under roughly 120 characters.

Break a long chain or a long argument list across lines rather than letting the line wrap in the
editor.

Use a trailing comma in a multi-line literal, so adding an entry touches one line.

Use one declaration per line in CSS, and keep the properties of a rule in a stable order.

Never ship minified, generated, or machine-formatted source as hand-maintained code.

No linter or formatter is mandated.

The field is split between several tools,
and a no-build project should not acquire a toolchain to satisfy a preference,
so this standard specifies the formatting outcome and leaves the tool to the project.

## Testing

Automated tests are optional.

When they are added, extract the pure logic into a file with no DOM access and test that file with
the Node test runner.

```bash
node --test test/
```

A page is verified by serving it and exercising the main flows in a browser.

Maintain the verification checklist as a numbered list of manual steps that exercise the main flows.

## Build

There is no build step.

The source files load in the browser exactly as written.

A static file server is enough for local development and for hosting.

Deployment is a copy of the source directory to any static host.

## Dependencies

Runtime dependencies are zero by default.

Add a library only when it removes significantly more code than it adds.

Load a library on demand at the moment it is first needed.

Resolve to a boolean and degrade gracefully when the load fails.

```javascript
function ensureXlsx() {
  if (typeof XLSX !== 'undefined') return Promise.resolve(true);
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}
```

Pin an exact version in the URL.

Provide a fallback path, such as CSV export when the spreadsheet library is unavailable.

Vendor the file into the repository when the page must work offline.

Prefer a newly published version that has been available for at least a week,
because a compromised package is often withdrawn within days.

## Security

A frameworkless page has a small attack surface,
and that is exactly why the few remaining risks must be handled explicitly.

### Injection

The only injection vector in a typical frameworkless page is an untrusted value reaching
`innerHTML`.

Untrusted means anything the project did not author, which includes user input, imported JSON,
URL parameters, and stored state from a previous session.

Escape every such value, and prefer `textContent` whenever markup is not required.

Never build an event handler attribute from a value.

Never pass a value to `eval`, to `new Function`, or to `setTimeout` as a string.

Validate an imported file before applying it,
and reject a payload whose shape or version does not match.

### Content Security Policy

A Content Security Policy is the second line of defence,
and its cost depends entirely on how much of the page is inline.

A page with no inline script and no inline style can adopt a strict policy at no cost, so it should.

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'none'; object-src 'none'
```

A single-file page cannot use `'self'` for its own script and style,
and it cannot use a nonce either, because a static file cannot produce a fresh nonce per response.

The correct mechanism is a source hash, one per inline block,
computed over the exact bytes between the tags.

```http
Content-Security-Policy: default-src 'self'; script-src 'sha256-BASE64HASH'; style-src 'sha256-BASE64HASH'; img-src 'self' data:; base-uri 'none'; object-src 'none'
```

A hash changes whenever the block changes, including a whitespace change,
so the policy is regenerated whenever the file is published.

Never add `'unsafe-inline'` to escape this problem,
because it disables the protection the policy exists to provide.

Never allow the `data:` scheme in `script-src` or `style-src`,
and allow it in `img-src` only because an inline page needs it for embedded images.

A file opened over `file://` receives no policy at all,
which is a reason to keep an offline single-file tool free of any untrusted input rather than a
reason to ignore the topic.

### Third-Party Code

Every third-party script is code the project did not review and cannot patch.

Pin an exact version, never a range and never a `latest` tag.

Add a Subresource Integrity hash to every remote script and stylesheet.

```html
<script src="https://cdn.example.com/lib@1.2.3/lib.min.js"
        integrity="sha384-BASE64HASH"
        crossorigin="anonymous"></script>
```

Vendor the file into the repository when the page must work offline,
and record the origin and version beside it.

### Data Handling

Never store a secret, a token, or a password in `localStorage`,
because any script on the page can read it.

Treat `localStorage` as public, unsynchronized, and erasable at any moment.

Never log a user-entered value, and never send one anywhere the user did not ask for.

Add `rel="noopener noreferrer"` to every link that opens in a new tab.

Set `referrerpolicy="no-referrer"` on an outbound request that does not need the referrer.

## Readability

The source is read far more often than it is written,
and an agent rewrites it far more often than a human does.

Both facts point the same way: the code must be immediately legible, consistently formatted,
and divided along lines a reader can predict.

### Structural Simplicity

Choose the least complex structure that solves the problem.

Complexity is a cost paid on every future read, so it must be earned by a real requirement.

| Prefer                    | Over                                    |
|---------------------------|-----------------------------------------|
| A plain object            | A class with one instance               |
| A function                | A class with one method                 |
| An array of descriptors   | A chain of `if` branches                |
| A `switch` on a known set | A lookup object built at runtime        |
| Direct DOM calls          | A general-purpose rendering abstraction |
| One clear duplication     | An abstraction with three parameters    |
| A named local variable    | A long inline expression                |

Do not build an abstraction for a second case, build it for a third.

Do not add a layer whose only purpose is to make a future change easier,
because the future change is usually a different one.

Do not add a configuration option that no caller passes.

### Function Size and Shape

A function fits on one screen, which is roughly forty lines.

A function does one thing, and its name says which thing without an "and" in it.

Return early to keep the main path at the lowest indentation level.

```javascript
function selectAnswer(questionId, optionIndex) {
  if (this.state.submitted) return;
  const question = this.findQuestion(questionId);
  if (!question) return;
  this.state.answers[questionId] = optionIndex;
  this.saveState();
  this.renderQuestion();
}
```

Keep nesting at three levels or fewer inside a function.

Extract a named helper when a block needs a comment to explain what it is doing,
because the helper name is that comment.

Keep the parameter count at four or fewer, and pass an options object beyond that.

### Consistent Division

Divide every file in the same order.

A reader who has read one file then knows the shape of every other file.

| Position | Content                                     |
|----------|---------------------------------------------|
| 1.       | The `'use strict'` directive or the imports |
| 2.       | Module constants                            |
| 3.       | State                                       |
| 4.       | Pure helpers with no DOM access             |
| 5.       | Persistence                                 |
| 6.       | Rendering                                   |
| 7.       | Event handlers                              |
| 8.       | Bootstrap                                   |

Group related functions together and separate groups with one blank line and a section banner.

Keep a function and the function it calls near each other,
so following a call does not require a search.

### Vertical Rhythm

Use one blank line between functions and between logical groups inside a function.

Do not stack blank lines.

Do not separate a declaration from its first use with unrelated code.

Declare a variable at the point where it is first needed, not at the top of the function.

### Naming

A name describes the role, not the type and not the implementation.

| Kind                | Pattern                        | Example                       |
|---------------------|--------------------------------|-------------------------------|
| A boolean           | A predicate reading as a claim | `isVisible`, `hasAnswer`      |
| A function          | A verb phrase                  | `renderQuestion`, `loadState` |
| A collection        | A plural noun                  | `questions`, `flagged`        |
| An event handler    | `on` plus the event            | `onLocaleChange`, `onSubmit`  |
| A boolean parameter | Avoid it, take an enum instead | `mode: 'replace'`             |

Do not abbreviate a name to save characters.

Do not encode the type in the name, such as `strTitle` or `arrItems`.

Do not reuse one name for two meanings in one file.

### What Not To Leave Behind

- Commented-out code.
- A `console.log` added for debugging.
- An unused variable, parameter, function, or CSS rule.
- A `TODO` with no owner and no issue reference.
- A duplicated block that was copied instead of extracted.
- A magic number that is used more than once.

An agent removes its own scaffolding before reporting a task complete.

An agent does not remove someone else's scaffolding as an unrequested side effect.

### Comments

Naming carries the meaning, comments carry the reason.

A comment is appropriate in three cases.

- A short block at the top of a file stating its single responsibility.
- A note explaining a non-obvious decision, such as a browser quirk or a compensation formula.
- A reference to an external specification the behavior is derived from.

Do not describe what the code does.

Do not leave commented-out code in the repository.

## Verification

Verify every change before considering it complete.

| Check             | Command Or Method                    | Applies To          |
|-------------------|--------------------------------------|---------------------|
| JavaScript syntax | `node --check <file>`                | Every changed script |
| Page loads        | Serve the directory and open the URL | Every change        |
| Console clean     | Browser developer tools              | Every change        |
| Responsive layout | Device toolbar at each breakpoint    | Every layout change |
| Narrow width      | The narrowest supported width        | Every layout change |
| Landscape         | A short landscape viewport           | Every layout change |
| Keyboard path     | `Tab`, `Enter`, `Space`, `Escape`    | Every new control   |
| Focus visibility  | Tab through the changed region       | Every new control   |
| Reduced motion    | `prefers-reduced-motion` emulation   | Every motion change |

The category standard adds the checks specific to its kind of project.

## Definition of Done

A task is complete when every applicable row passes.

An agent runs this list before reporting, and states which rows were checked and which do not apply.

### Correctness

- Every changed script passes a syntax check.
- The browser console is clean, with no error and no warning the change introduced.
- The main flows still work, verified against the project checklist.

### Structure

- The change respects the project's source layout and did not migrate it.
- The change respects the project's module system, organization pattern, and quote style.
- No new global symbol was introduced outside the established pattern.
- No file exceeds the scaling threshold for its layout without a stated reason.

### Quality

- Comments explain reasons, not actions.
- No debugging output, commented-out code, or unused declaration remains.
- Every value reaching `innerHTML` is escaped.
- Formatting follows the conventions in this document or the project's own declared conventions.

### Hygiene

- No secret, token, or credential is committed.
- Third-party code is pinned and carries an integrity hash or is vendored.
- Documentation was updated when the change altered structure, load order, or a project rule.

## General Principles

**Single Responsibility.** One file does one thing and its name says which thing.

**Explicit Order.** Stylesheet order and script order are dependencies and are documented as such.

**Zero Dependencies by Default.** Add a library only when it removes significantly more code than it
adds.

**Escape Everything.** No value reaches `innerHTML` without passing through the escape helper.

**Prefer The Platform.** Reach for a browser feature before writing the code it would replace.

**Simplest Structure That Works.** Complexity must be earned by a requirement,
not anticipated for one.

**Readable In Any Layout.** A file is divided as rigorously as a directory tree,
because the reader has nothing else to navigate by.

**Detect Before Asking.** The repository records the decisions,
so read it first and ask only what it cannot answer.

**Change What Was Asked.** A layout, a convention, or a pattern is a contract,
and changing one is a proposal, not a side effect.

## Sources

The following authoritative references support the rules in this document.

- [WHATWG HTML Standard](https://html.spec.whatwg.org/) - the living standard for document
  structure, elements, and script behavior.
- [WHATWG DOM Standard](https://dom.spec.whatwg.org/) - the document object model and event model.
- [WHATWG Fetch Standard](https://fetch.spec.whatwg.org/) - the `fetch` contract.
- [ECMA-262 ECMAScript Language Specification](https://tc39.es/ecma262/) - the JavaScript language
  specification.
- [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML),
  [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS),
  [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), and
  [MDN Web API](https://developer.mozilla.org/en-US/docs/Web/API) - the practical references for
  elements, properties, syntax, and platform APIs.
- [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) - accessible names, roles,
  states, and keyboard interaction patterns.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - the conformance criteria for accessibility
  requirements.
- [web.dev Web Vitals](https://web.dev/articles/vitals) - the performance metrics and their
  thresholds.
- [webstatus.dev](https://webstatus.dev/) and [Can I Use](https://caniuse.com/)
  - feature-support lookups for the baseline gate.
