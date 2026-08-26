# HTML Vanilla Application Development

## Purpose

This document defines development standards for single page applications built with plain HTML, CSS, and JavaScript.

It applies to applications that run in the browser with no framework, no bundler, and no build step.

The standard covers three application types and three source layouts, and stays general so it can be applied to unrelated projects.

For CSS architecture, layout systems, and design tokens, maintain a separate CSS development standard and add only the rules specific to a frameworkless application here.

## Scope

A vanilla application is a browser application that satisfies all of the following conditions.

- The browser loads hand-written HTML, CSS, and JavaScript directly.
- No framework such as React, Vue, Angular, or Svelte is used.
- No bundler, transpiler, or preprocessor sits between the source files and the browser.
- Runtime dependencies are zero, or limited to a small number of libraries loaded on demand.
- The whole application is served from a static file server or opened directly from the file system.

This standard does not apply to compiled single page applications.

For those, use a framework-specific development standard.

## Documentation

- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [Can I Use](https://caniuse.com/)

## Core Technologies

- **HTML5**: One entry document that hosts all screens.
- **Native CSS**: Custom properties on `:root`, no preprocessor.
- **ECMAScript 2020 or later**: Written directly, never transpiled.
- **Node.js 18 or later**: Runs the static development server only, never in the browser path.

Add a third-party library only when the alternative is significantly more code.

When a library is added, load it lazily and provide a fallback for the case where the load fails.

## Application Types

A vanilla application falls into one of three types, and the type shapes the rest of the choices.

| Type         | Primary Content                      | Render Surface        | Typical Interaction            |
|--------------|--------------------------------------|-----------------------|--------------------------------|
| Application  | Records, forms, dashboards, editors  | DOM                   | Clicks, typing, drag and drop  |
| Game         | A continuous or stepped visual scene | Canvas, sometimes DOM | Pointer, keyboard, real-time   |
| Presentation | A sequence of discrete visual frames | SVG, sometimes DOM    | Step navigation, auto-playback |

The type determines the render surface, the loop model, and the accessibility strategy.

A single application may combine surfaces, for example a canvas game with a DOM control bar.

Keep the dominant surface as the primary one and treat the other as a companion.

## Source Layouts

Choose one of three layouts before writing any code.

| Layout  | Use Case                                          | Structure                                        |
|---------|---------------------------------------------------|--------------------------------------------------|
| Modular | Application with several distinct subsystems      | `index.html`, split `css/`, split `js/`          |
| Minimal | Small application with one group of screens       | `index.html`, one stylesheet, one script         |
| Inline  | Prototype, design demo, or a required single file | one `.html` with inline `<style>` and `<script>` |

Pick the smallest layout that fits the application.

A small application must not be forced into the modular layout.

Splitting a two hundred line script across six files adds ceremony and removes nothing.

Grow the layout only when a real boundary appears, such as a second subsystem or a second developer.

### Modular Layout

Use this layout when the application has several distinct subsystems.

```plaintext
project-root/
  package.json            -- npm scripts and metadata, no runtime dependencies
  README.md               -- overview, quick start, feature list
  .gitignore
  runtime/
    server.js             -- static development server
  src/
    index.html            -- single entry document
    css/
      variables.css       -- design tokens on :root
      layout.css          -- structure, grid, regions
      components.css      -- reusable components
      interactive.css     -- states, drag, modal, tooltip
    js/
      model.js            -- domain types, no DOM access
      data.js             -- initial or generated data
      i18n.js             -- translation dictionary and locale
      renderer.js         -- DOM generation
      persistence.js      -- localStorage and import/export
      app.js              -- bootstrap and wiring, loaded last
  docs/
    GUIDELINES.md         -- project rules
    ARCHITECTURE.md       -- module boundaries and data flow
    TESTING.md            -- manual verification checklist
```

### Minimal Layout

Use this layout when the application is small enough that one script stays readable.

The `src/` directory collapses into the project root, all styles live in one stylesheet, and all logic lives in one script.

```plaintext
project-root/
  index.html              -- single entry document
  package.json            -- npm scripts and metadata
  README.md               -- overview, quick start, feature list
  server.mjs              -- static development server
  css/
    style.css             -- all styles, tokens first
  js/
    app.js                -- all application logic and state
    catalog-data.js       -- generated data, optional
  docs/
```

Name the single script `app.js` or `main.js` and keep that choice consistent across the project.

Name the single stylesheet `style.css`.

Keep the token block at the top of `style.css` and the `@media` rules at the bottom.

A generated data file stays separate even in this layout, because it is not hand-edited.

### Inline Layout

Use this layout only when the project specification requires a single distributable file.

A file that must be mailed, embedded, or opened from a memory stick with no other asset is a valid reason.

Convenience is not a valid reason.

```plaintext
project-root/
  app-name.html           -- markup, inline <style>, inline <script>
  README.md               -- overview and purpose
  docs/
```

The same section order applies inside the file as across the split layouts.

Place the token block first in `<style>`, then layout, then components, then state rules.

Place the `<script>` block at the end of `<body>` and keep the same internal order the split files would have used.

Mark each region with a banner comment so the file stays navigable.

### Scaling Between Layouts

Move to the next layout up when any of the following becomes true.

- A single script passes roughly one thousand lines.
- A single stylesheet passes roughly one thousand lines.
- An inline document passes roughly fifteen hundred lines.
- Two subsystems start editing the same file for unrelated reasons.

Splitting later is cheap because there is no build step to reconfigure.

### Shared Rules

The bootstrap script is always loaded last and is always the only entry point.

Never place application source inside `docs/`.

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
| Stylesheet       | `kebab-case.css`     | `css/variables.css`        |
| Module script    | `kebab-case.js`      | `js/item-list-renderer.js` |
| Generated data   | `kebab-case-data.js` | `js/catalog-data.js`       |
| Static server    | `server.js`          | `runtime/server.js`        |

A file name describes the single responsibility of the file.

## HTML Conventions

### Entry Document

The entry document declares the doctype, the language, the character set, and the viewport.

It links stylesheets in cascade order and loads scripts in dependency order at the end of `<body>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
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

Set `lang` to the actual content language of the application.

Never place a script in `<head>` without `defer`.

### Semantic Markup

Use `<header>`, `<nav>`, `<main>`, `<aside>`, and `<section>` for page regions.

Use `<button>` for anything clickable that is not a link.

Use `<div>` only when no semantic element carries the correct meaning.

Every heading level must follow the previous one without skipping.

### Screen Markup

Represent every screen as a `<section>` with the `screen` class and a stable `id` ending in `-screen`.

```html
<main>
  <section id="home-screen" class="screen active"></section>
  <section id="test-screen" class="screen"></section>
  <section id="results-screen" class="screen"></section>
</main>
```

The stylesheet controls visibility so that JavaScript only toggles a class.

```css
.screen { display: none; }
.screen.active { display: block; }
.hidden { display: none !important; }
```

### Static and Generated Markup

Markup that never changes belongs in the entry document.

Markup that depends on state is generated by a render function.

Do not mix both inside the same container element.

## CSS Conventions

The full CSS architecture should be defined in a separate CSS development standard.

This section states only the rules that a vanilla application must additionally follow.

### Stylesheet Order

In the modular layout, stylesheets load in a documented order and that order defines cascade priority.

The order is tokens, then layout, then components, then interactive states.

`variables.css` must load first so that every later file can reference its custom properties.

`interactive.css` must load last so that state styles win over base styles.

In the minimal layout, keep the same order inside the single stylesheet.

### Design Tokens

Every colour, radius, shadow, spacing value, and fixed dimension is a custom property on `:root`.

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

A project may use shorter unprefixed names such as `--primary` or `--success` when the application is small enough that the category is obvious.

### Reset

Start every stylesheet with the same minimal reset.

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

### Layout

Use Flexbox for one-dimensional arrangements such as toolbars, rows, and stacks.

Use CSS Grid for two-dimensional arrangements such as card grids, tables, and timelines.

Use `position: absolute` only inside an element that establishes a containing block.

Every z-index value comes from a `--z-` token.

### Responsive Design

Every application defines at least one breakpoint.

Place all `@media` rules at the end of the file they belong to.

The breakpoints below are common reference points, not a mandatory set.

| Breakpoint | Target      | Typical Change                                    |
|------------|-------------|---------------------------------------------------|
| `1024px`   | Tablet      | Sidebar becomes an off-canvas drawer              |
| `768px`    | Large phone | Multi-column grids collapse to one or two columns |
| `640px`    | Phone       | Toolbars stack, tables become card lists          |
| `420px`    | Small phone | Labels shorten, secondary actions hide            |

Use only the breakpoints the layout actually needs.

A component must not shrink below its widest mobile size when the viewport grows past the breakpoint.

This preserves the largest comfortable mobile size on desktop and prevents a visible jump at the breakpoint.

Below the breakpoint the component fills the viewport.

Above the breakpoint the component is capped and floored, and the desktop `min-width` equals the maximum mobile width measured at the breakpoint.

### Motion

Keep transitions between `0.1s` and `0.3s`.

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

## JavaScript Conventions

### Module System

Two module systems are valid, and a project picks one and does not mix them.

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

Permitted only when the application is always served over HTTP and never opened from the file system, because `file://` blocks module loading with CORS.

State that choice in the project specification.

Begin every classic script file with `'use strict';` unless it is an ES module.

### Organization

Two organization patterns are valid, and the choice follows the size of the application.

**Namespace object**: an application with a small number of screens uses one global namespace object.

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

**Class per file**: an application with distinct subsystems uses one class per file.

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

### State Management

Keep all application state in one place.

Use `App.state` for the namespace pattern and a single model object for the class pattern.

Never store application state in DOM attributes or in class names.

The DOM is a projection of state, never the source of truth.

Mutate state through named methods, then call the render function.

There is no reactivity and no virtual DOM.

### Rendering

Two rendering techniques are allowed.

- `document.createElement` with `appendChild` for structural and interactive content.
- A template literal assigned to `innerHTML` for a self-contained block that is replaced as a whole.

Be consistent within a single render function and do not mix the two techniques inside that function.

Clear a container with `container.innerHTML = ''` before a full re-render.

Cache a DOM query when the same element is read more than once.

### Escaping

Every value that reaches `innerHTML` must be escaped.

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

### Events

Attach listeners with `addEventListener`.

Use event delegation on a stable parent for lists and grids that re-render.

```javascript
list.addEventListener('click', event => {
  const row = event.target.closest('[data-id]');
  if (!row) return;
  App.selectItem(row.dataset.id);
});
```

Inline `onclick` attributes are permitted only in static markup and only when the application uses the global namespace pattern.

In that case the handler contains a single call to a namespace method and no logic.

```html
<button class="btn btn--primary" onclick="App.startTest()">Start</button>
```

Never write an inline handler into generated markup.

Remove listeners when the element they belong to is destroyed.

Use `PointerEvent` for combined mouse and touch input.

Fall back to `mousedown`, `mousemove`, and `mouseup` only when the application must run over `file://`, and document the deviation in the affected file.

### Persistence

Persist state to `localStorage` whenever the user may resume later.

Use one key per concern, and prefer a versioned key so the schema can evolve.

| Purpose           | Key Pattern        | Example                     |
|-------------------|--------------------|-----------------------------|
| Application state | `<app>-state-v<n>` | `catalog-state-v1`          |
| Locale            | `<app>-locale`     | `catalog-locale`            |
| Feature flag      | `<app>-<feature>`  | `catalog-sidebar-collapsed` |

Write and read inside `try` and `catch` because storage can be full or blocked.

When a `version` field is stored, reject a payload whose version does not match.

Convert a `Set` or a `Map` to an array before serializing.

```javascript
const STORAGE_KEY = 'catalog-state-v1';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      screen: App.state.screen,
      items: App.state.items,
      selection: [...App.state.selection],
      savedAt: Date.now(),
    }));
  } catch (e) {
    console.warn('saveState failed', e);
  }
}
```

Restore state before the first render, not after it.

Save on every state change and on `beforeunload`.

Offer JSON export and import when the user may want to share or back up the data.

### Data Loading

Ship static data as a JavaScript file that declares constants and loads before `app.js`.

This avoids a `fetch` round trip and keeps the application working over `file://`.

```html
<script src="js/catalog-data.js"></script>
<script src="js/app.js"></script>
```

Generate that file from a source document kept under `docs/reference/`.

Never hand-edit generated data.

Use `fetch` only for data that genuinely changes at runtime.

### Third-Party Libraries

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

Vendor the file into the repository when the application must work offline.

### Error Handling

Validate input at the boundary of every public method.

Log an unexpected state to the console and never swallow an error silently.

Wrap only the operations that can genuinely fail, such as storage access, JSON parsing, and file reading.

Show the user a message for any failure that changes what they can do.

### User Feedback

Application messages are custom components.

Never call `window.alert`, `window.confirm`, or `window.prompt`.

These block the main thread, cannot be styled, and break the visual identity of the application.

Use a modal overlay with a centered dialog for a blocking question.

Use a transient toast for a non-blocking confirmation.

A prototype or a quick internal tool may relax this rule, but a production application must not.

## Application Shell

The shell is the frame that stays on screen while the content region changes.

Two shells cover almost every application of this kind.

### Centered Shell

Use a centered shell when the application is a sequence of screens with no persistent navigation.

A sticky header carries the identity and the global actions, and a centered column carries the content.

```css
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: var(--bg-card);
  border-bottom: 1px solid var(--color-border);
}

.app-main {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-lg) var(--space-md);
}
```

The centered column keeps line length readable on a wide monitor without a media query.

### Sidebar Shell

Use a sidebar shell when the application has persistent navigation between many views.

```css
.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  overflow-y: auto;
}

.app-body {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  min-width: 0;
  padding: var(--space-lg) var(--space-lg) 60px;
}
```

The `min-width: 0` declaration is mandatory on every flex child that holds text or a table.

A flex item defaults to `min-width: auto`, which refuses to shrink below its content and pushes the layout wider than the viewport.

### Collapsing the Sidebar

Below the tablet breakpoint the sidebar leaves the flow and becomes an off-canvas panel.

Animate it with `transform` rather than `left`, because `transform` does not trigger layout.

```css
@media (max-width: 1024px) {
  .app { display: block; }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: var(--z-drawer);
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar.open { transform: translateX(0); }

  .hamburger { display: inline-block; }
}
```

The toggle sets the state on both the panel and its backdrop in one function.

Close the sidebar after a navigation click when the viewport is narrow.

### Wide Content

A table does not reflow into a narrow viewport.

Wrap it in a scroll container and give the table a minimum width, so the page never scrolls sideways as a whole.

```css
.table-wrap {
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.table-wrap table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
}
```

Rebuilding a table as a card list on mobile is acceptable when the row has few columns.

Horizontal scroll inside a bounded container is the simpler default and keeps one render function.

## Overlays

An overlay is any element that floats above the content region.

| Overlay  | Purpose                                  | Dismissed By                   |
|----------|------------------------------------------|--------------------------------|
| Modal    | A decision that must block the workflow  | Action button, Escape          |
| Drawer   | Editing a record beside its list context | Close button, backdrop, Escape |
| Dropdown | A short contextual list of choices       | Outside click, Escape          |
| Toast    | A confirmation that must not block       | Timeout                        |

### Layer Order

Every overlay takes its `z-index` from a token, and the tokens form one documented scale.

The scale below is a reference, not a fixed contract.

| Layer           | Token          | Value |
|-----------------|----------------|-------|
| Sticky header   | `--z-header`   | `100` |
| Dropdown        | `--z-dropdown` | `200` |
| Backdrop        | `--z-backdrop` | `300` |
| Drawer, sidebar | `--z-drawer`   | `400` |
| Modal           | `--z-modal`    | `500` |
| Toast           | `--z-toast`    | `600` |

Leave gaps in the scale so a new layer can be inserted without renumbering.

Never write a literal `z-index` value in a rule.

### Reusable Modal

Declare the modal once in the entry document and reuse it for every confirmation.

Do not create a second modal for a second message.

Center the dialog with flexbox on the overlay rather than with offsets and transforms.

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 50%;
  max-height: 90vh;
  padding: var(--space-lg);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.modal-body { overflow-y: auto; }
```

The `max-height` and the scrolling body are mandatory.

Without them a long message grows the dialog past the viewport and the action buttons become unreachable.

### Modal Behavior

One open function owns the whole lifecycle and returns the page to its previous state on close.

Assign the message with `textContent`, because a modal usually reports a value the user just typed.

Lock the page behind the overlay so a scroll gesture does not move the content underneath.

```css
body.scroll-locked { overflow: hidden; }
```

Detach every listener in `close`, otherwise each open call leaves another Escape handler on the document.

Compare `e.target` to the overlay itself, otherwise a click inside the dialog closes it.

Trap focus inside an open modal and restore focus to the trigger on close.

### Drawer

A drawer edits one record while its list stays visible behind.

Build it as a head, a body, and a foot, and let only the body scroll.

The fixed head and foot keep the title and the save action visible however long the record is.

### Toast

A toast reports a completed action and never asks a question.

Clear the previous timer, otherwise a second toast is hidden early by the first timeout.

Keep `pointer-events: none` so the hidden toast never intercepts a click.

### Dropdown

Close a dropdown from a listener on the document and stop the propagation of clicks inside the panel.

Register the document listener on the next tick, otherwise the click that opened the panel closes it immediately.

## Forms

### Field Structure

One field is a label and its control in a column, and fields sit in a grid that collapses to one column.

```html
<div class="field-grid">
  <div class="field">
    <label for="f-name">Name</label>
    <input id="f-name" type="text" data-key="name" />
    <span class="field-error"></span>
  </div>
  <div class="field field--full">
    <label for="f-notes">Notes</label>
    <textarea id="f-notes" rows="3" data-key="notes"></textarea>
    <span class="field-error"></span>
  </div>
</div>
```

Every label carries a `for` attribute that matches the `id` of its control.

This is what makes the label clickable and what lets a screen reader announce the field.

A grid section heading spans the full row with `grid-column: 1 / -1` and groups related fields without nesting another container.

### Describing Fields

Describe the form as an array and render from that array when the form is non-trivial.

A descriptor keeps the markup, the validation, and the reset logic reading from one definition.

```javascript
const FIELDS = [
  { key: 'name',  label: 'Name',  type: 'text',     required: true },
  { key: 'email', label: 'Email', type: 'email',    required: true },
  { key: 'size',  label: 'Size',  type: 'select',   options: SIZES },
  { key: 'notes', label: 'Notes', type: 'textarea', full: true },
];
```

### Binding Values

Mark every control with `data-key` and bind the whole form with one loop.

A `<select>` reports `change` and a text control reports `input`, so the event name is derived from the element.

Normalize an empty string to `null` at the boundary, so the rest of the application tests one absent value.

### Editing a Copy

Edit a copy of the record and commit it only when the user saves.

Binding directly to the stored record makes cancel impossible, because every keystroke has already been applied.

### Dependent Fields

When one control determines the options of another, clear the dependent value and re-render that part of the form.

Leaving a stale value behind is the most common defect in a form of this kind.

### Validation

Validate on save, not on every keystroke.

Report every error at once rather than stopping at the first.

```javascript
function validate(record) {
  const errors = {};
  FIELDS.filter(f => f.required).forEach(f => {
    if (!record[f.key]) errors[f.key] = 'This field is required.';
  });
  return errors;
}
```

Reserve the height of the error line so the layout does not jump when a message appears.

Move focus to the first invalid control, because the error may be scrolled out of view.

Never report a validation error with `window.alert`.

### Touch Targets

A control that is comfortable with a mouse is often too small for a thumb.

Raise the minimum height on a coarse pointer rather than at a width breakpoint, because the pointer type is the real condition.

```css
@media (pointer: coarse) {
  .btn,
  .field input,
  .field select {
    min-height: 44px;
  }
}
```

### Custom Choice Controls

A clickable `<div>` that behaves like a radio button must declare that role and accept the keyboard.

```html
<div class="options-list" role="radiogroup" aria-labelledby="question-text">
  <div class="option-item" role="radio" aria-checked="false" tabindex="0"></div>
</div>
```

Update `aria-checked` whenever the selected class changes, because the class alone tells assistive technology nothing.

Prefer a real `<input type="radio">` with a styled `<label>` when the control does not need custom layout.

## Internationalization

Add internationalization when the application has more than one audience language.

### Translation Module

Keep one dictionary object keyed by locale and one lookup function in a dedicated `i18n.js` file.

```javascript
'use strict';

window.I18n = {
  locale: localStorage.getItem('app-locale') || 'en',

  T: {
    en: { app_title: 'My App', nav_back: 'Back' },
    de: { app_title: 'Meine App', nav_back: 'Zurück' },
  },

  t(key) {
    const dict = this.T[this.locale] || this.T.en;
    return dict[key] || this.T.en[key] || key;
  },

  setLocale(locale) {
    this.locale = locale;
    try { localStorage.setItem('app-locale', locale); } catch (e) { /* ignore */ }
    window.dispatchEvent(new CustomEvent('localechange'));
  },
};
```

The lookup function follows a three-step fallback chain.

It tries the current locale first, then the default locale, then returns the key itself.

Returning the key instead of throwing an error lets the application render with missing translations during development.

### Key Naming Convention

Use `snake_case` for all translation keys.

Prefix every key with the category it belongs to.

| Key Pattern                  | Purpose                            |
|------------------------------|------------------------------------|
| `app_title`                  | Global application text            |
| `nav_back`, `nav_play`       | Navigation and control labels      |
| `tab_process`, `tab_effects` | Tab labels                         |
| `<id>_name`                  | Item name for a data-driven entry  |
| `<id>_description`           | Item description                   |
| `<id>_frame_<N>_title`       | Frame title for step N             |
| `<id>_frame_<N>_desc`        | Frame description for step N       |
| `<id>_effect_<N>`            | Effect list item N                 |
| `<id>_<label_key>`           | In-scene label inside an SVG frame |

The `<id>` placeholder is the unique identifier of a data entry, not a human-readable name.

This convention lets the application construct keys dynamically from data.

Store only structural data such as IDs, frame counts, and colors in `data.js`.

Store all human-readable text in `i18n.js`.

Never store a translated string inside `data.js` or inside an animation function.

### Placeholders

Never concatenate translated fragments.

Use a placeholder inside the translation string instead.

A project may use positional placeholders such as `{0}` or named placeholders such as `{name}`, and must apply one style consistently.

### Default Locale

Choose one locale as the default and place it first in the dictionary.

The default locale serves as the fallback when a key is missing from the active locale.

Every key that exists in any locale must exist in the default locale.

### Locale Persistence and Re-Rendering

Persist the active locale in `localStorage` under the `<app>-locale` key.

Read the saved locale on module initialization so the user's choice survives a page reload.

Wrap both the read and the write in a `try`/`catch` block because `localStorage` may be unavailable in private browsing mode.

Call `setLocale()` when the user selects a language.

`setLocale()` stores the new locale and dispatches a `localechange` CustomEvent on `window`.

The application listens for this event and re-renders all visible content.

Set `document.documentElement.lang` to the current locale code on every locale change.

This keeps the page accessible to screen readers and search engines in the correct language.

### Language Bar

Render one button per locale in a navigation element.

Each button carries a `data-lang` attribute with the locale code.

Bind a single click listener on the container and read `dataset.lang` from the clicked button.

Toggle an `active` class on the buttons to indicate the current locale.

### Script Load Order

Load `i18n.js` before any module that calls `I18n.t()`.

The typical order is `i18n.js` first, then `data.js`, then view or animation modules, then `app.js` last.

## Accessibility

Accessibility is part of the definition of done, not a later pass.

- Give every icon-only control an `aria-label`.
- Mark a decorative SVG with `aria-hidden="true"`.
- Associate every dynamically created `<input>` with a `<label>` through `for` and `id`.
- Make every interactive element reachable by `Tab` and activatable by `Enter` and `Space`.
- Trap focus inside an open modal and restore focus to the trigger on close.
- Close a modal and a dropdown with `Escape`.
- Keep a visible focus outline, never set `outline: none` without a replacement.
- Announce the current screen by moving focus to its heading after a screen switch.
- Verify text contrast against the background for every token pair.

Do not hide the system cursor unless the application is a full-screen visual experience.

## Canvas Applications

Use a canvas when the view is a continuous visual scene rather than a document.

Keep the canvas as the render surface and the DOM as the control surface.

Drive the scene with a single `requestAnimationFrame` loop and never with `setInterval`.

```javascript
function frame(ts) {
  const dt = lastTs ? Math.min(ts - lastTs, 80) : 16.7;
  lastTs = ts;
  if (!S.paused) advance(dt);
  drawBackground();
  drawScene();
  updateHud();
  requestAnimationFrame(frame);
}
```

Clamp the delta so a background tab does not produce one enormous step.

Read the device pixel ratio and resize the backing store on `resize`.

Keep pure math helpers such as `lerp`, `clamp`, and `ease` in one place.

Mirror every canvas interaction with a keyboard equivalent, because a canvas is invisible to assistive technology.

## Interactive Presentations with SVG

An interactive presentation is a vanilla application that displays a sequence of visual frames to explain a process, navigated by the user or played automatically.

It differs from a data-driven dashboard or a form editor because the primary content is a set of generated images, not a list of records or a form.

### When to Use This Pattern

Apply this pattern when the application meets all of the following conditions.

- The content is a set of discrete steps that must be shown one at a time.
- Each step is a visual scene built from shapes, text, and indicators rather than a photograph or a static illustration.
- The user navigates between steps manually or plays them in sequence.
- The same scene must render at different viewport sizes without redrawing every pixel.

A photo gallery, a slide deck of images, and a video player are not this pattern.

### Architecture

An interactive presentation adds one module beyond the standard set: an animation renderer.

| Module          | Responsibility                                               |
|-----------------|--------------------------------------------------------------|
| `data.js`       | Declares each animation class, its frame count, and metadata |
| `i18n.js`       | Holds frame titles, descriptions, and in-scene label keys    |
| `animations.js` | Generates an SVG string for a given class and frame number   |
| `app.js`        | Owns playback state, navigation, and the frame counter       |

The animation renderer is a pure function: it takes a frame index and returns an SVG string.

The application calls the function and injects the result into a container.

No animation markup is hardcoded in the HTML.

### SVG as the Render Surface

Use an SVG with a `viewBox` rather than a canvas when each frame is a composition of named shapes, text labels, and indicators.

The `viewBox` lets the scene scale to any container size without recalculating coordinates.

```css
.animation-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 0;
}

.animation-stage svg {
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  height: auto;
}
```

The `min-height: 0` declaration on the flex parent is mandatory.

Without it the SVG refuses to shrink below its intrinsic size and overflows the container.

Do not set a fixed `width` or `height` on the SVG element.

The `viewBox` attribute handles scaling.

### Coordinate System

Every animation function declares its own coordinate constants at the top.

```javascript
const VW = 700, VH = 420;
const CX = 70, CY = 80, CW = 500, CH = 220;
const RY = CY + CH * 0.55;
const RX1 = CX + 45, RX2 = CX + CW - 45;
```

| Constant     | Meaning                                           |
|--------------|---------------------------------------------------|
| `VW`, `VH`   | SVG viewport width and height                     |
| `CX`, `CY`   | Top-left corner of the main content block         |
| `CW`, `CH`   | Width and height of the main content block        |
| `RY`         | Y coordinate of a reference line inside the block |
| `RX1`, `RX2` | Left and right edges of the reference line        |

All element positions are derived from these constants, never hardcoded as independent pixel values.

This lets a single constant change shift every dependent element at once.

### Frame Generation

Each frame is produced by computing a set of intermediate values and then composing the SVG from them.

Store the per-frame progression as an array indexed by the frame number.

Derive every visual property, such as position, opacity, color, and label text, from that single value.

Never branch on the frame number to set a pixel coordinate.

Always set `text-anchor` on SVG text, never rely on the default `start` alignment.

When a label describes a specific element, derive its position from that element's coordinates, not from the viewport origin.

This keeps the label attached to the element if the element's position changes.

### Defs and Gradient IDs

Each animation function defines its own `<defs>` block with gradient and pattern IDs.

Prefix every ID with the animation class code to prevent collisions when the SVG is injected into the same document.

When two SVGs with the same gradient ID exist in the document at the same time, the second one silently references the first definition.

### Random Elements

Some frames use `Math.random()` to generate random paths, scattered positions, or particle effects.

This means the same frame may look different each time it is rendered.

This is acceptable for decorative elements but not for elements that convey information.

If a random element must be stable across re-renders, seed it with the frame number.

### Navigation and Playback

The application owns a frame counter and three navigation actions: previous, next, and reset.

Wrap the frame counter with modulo so it loops in both directions.

Automatic playback uses `setTimeout`, not `setInterval`, so the delay can vary per frame.

A longer delay after the last frame lets the viewer absorb the final state before the loop restarts.

Bind arrow keys to frame navigation and stop playback on any keypress.

Stopping playback on any keypress prevents a running timer from advancing the frame while the user is manually navigating.

### Internationalization of In-Scene Text

Every text element inside the SVG must use a translation key, including proper names, status labels, and measurement units.

A hardcoded string inside an animation function is invisible to the locale switch.

When the locale changes, re-render the current frame so all in-scene text updates.

Mathematical expressions and scientific formulas are language-neutral, but proper names, status words, and unit labels are not.

### State Persistence

Persist the current class, frame, and tab so the user can resume after a reload.

Do not persist the `playing` state.

A user who reloads during auto-play expects to see the paused frame, not a suddenly running animation.

### Tabs

A presentation often shows two views of the same content: the animated process and a static list of effects.

Use a tab bar with two panels rather than two separate screens.

The tab state is part of the application state and is persisted.

Switching tabs does not stop playback, only navigating away from the detail screen does.

## Development Server

Every project in the modular or minimal layout ships a static server with zero npm dependencies.

The inline layout may omit the server because the file opens directly from the file system.

The server serves the source directory, maps MIME types, rejects directory traversal, and disables caching.

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const root = path.join(__dirname, '..', 'src');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.normalize(path.join(root, urlPath === '/' ? 'index.html' : urlPath));
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    res.end(data);
  });
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
```

The server may be a CommonJS file (`server.js`) or an ES module (`server.mjs`).

Live reload is optional and is implemented with `fs.watch` and a server-sent events endpoint.

The server injects the reload client into the HTML response so the source stays clean.

The port is fixed per project and overridable through the `PORT` environment variable.

Document the chosen port in `README.md`.

## Package Manifest

The manifest declares metadata and scripts only.

```json
{
  "name": "catalog",
  "version": "0.0.1",
  "description": "Single page item catalog with local persistence",
  "private": true,
  "scripts": {
    "start": "node runtime/server.js",
    "check": "node --check src/js/app.js"
  },
  "engines": {
    "node": ">=18"
  }
}
```

Set `private` to `true`.

Keep `dependencies` empty.

A `devDependencies` entry is acceptable only for a linter or a formatter.

## Build and Serve

There is no build step.

Start the server with `npm start` and open the printed URL.

An IDE browser preview is a proxy to that server and stops working when the server stops.

Deployment is a copy of the source directory to any static host.

## Verification

Verify every change before considering it complete.

| Check             | Command                           | Applies To           |
|-------------------|-----------------------------------|----------------------|
| JavaScript syntax | `node --check src/js/app.js`      | Every changed script |
| Server start      | `npm start`                       | Every change         |
| Console clean     | Browser developer tools           | Every change         |
| Manual checklist  | Project checklist                 | Every change         |
| Responsive layout | Device toolbar at each breakpoint | Every layout change  |
| Keyboard path     | `Tab`, `Enter`, `Escape`          | Every new control    |

Maintain the verification checklist as a numbered list of manual steps that exercise the main flows.

Automated tests are optional.

When they are added, extract the pure logic into a file with no DOM access and test that file with the Node test runner.

## Formatting

Use two-space indentation in HTML, CSS, and JavaScript.

Use single quotes in JavaScript and double quotes in HTML attributes.

A project may pick one quoting style and apply it everywhere, and that choice overrides the default.

Terminate every JavaScript statement with a semicolon.

Use `const` by default and `let` only when the binding is reassigned.

Never use `var`.

Keep a function short enough to read without scrolling.

## Comments

Naming carries the meaning, comments carry the reason.

A comment is appropriate in three cases.

- A short block at the top of a file stating its single responsibility.
- A note explaining a non-obvious decision, such as a browser quirk or a compensation formula.
- A reference to an external specification the behavior is derived from.

Do not describe what the code does.

Do not leave commented-out code in the repository.

## Project Documentation

Every project carries the following content.

- An overview with the quick start, the feature list, and the structure diagram.
- The project rules and the sources of truth.
- The project specification with the module boundaries, the load order, and the data flow.
- The manual verification checklist.

The project specification is the document that describes how the application is built.

It may be a single file or a set of files, and the file names are chosen per project.

Record the script load order in the project specification because that order is a real dependency contract.

## General Principles

**Single Responsibility.** One file does one thing and its name says which thing.

**One Source of Truth.** State lives in JavaScript objects, the DOM only displays it.

**Explicit Order.** Stylesheet order and script order are dependencies and are documented as such.

**Zero Dependencies by Default.** Add a library only when it removes significantly more code than it adds.

**Escape Everything.** No value reaches `innerHTML` without passing through the escape helper.

**No Native Dialogs.** Every message is a component the project owns and styles.

**Progressive Enhancement.** The application degrades to a usable state when a lazy library or a storage API is unavailable.

**Design With Intent.** Commit to one aesthetic direction and express it through tokens, typography, and motion rather than through scattered one-off values.
