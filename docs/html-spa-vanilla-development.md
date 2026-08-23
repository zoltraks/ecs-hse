# HTML Single Page Application Development

## Scope

This document defines development standards for single page applications built with plain HTML, CSS, and JavaScript.

It applies when the application is served as a single `index.html` file with no build step.

## Documentation

- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## Core Technologies

- **HTML5**: One `index.html` file contains all screens as separate sections.
- **CSS**: Plain CSS with custom properties defined on `:root`.
- **JavaScript**: Vanilla JavaScript with a single global application object.
- **Node.js**: A static file server serves the single HTML file and its assets.

## Project Structure

```plaintext
ecs-hse/
  index.html              -- Single page with all screens
  server.mjs              -- Static file server
  package.json            -- npm scripts and metadata
  css/
    style.css             -- All styles
  js/
    app.js                -- Application logic and state
    questions-data.js     -- Runtime data
```

## Naming Conventions

- **CSS classes**: Use `kebab-case` with BEM-like modifiers.
- **JavaScript object**: Use `App` in `js/app.js` for the global application object.
- **Data files**: Use `kebab-case.js` for generated runtime data.
- **HTML ids**: Use `kebab-case` or `camelCase`, but keep them stable and unique.

## Code Conventions

### HTML

Keep all screens in `index.html` as sections of a single page.

Use inline `onclick` handlers that call `App` methods.

Do not use templating engines or frontend frameworks.

### CSS

Use CSS variables in `:root` for colors, spacing, and shared values.

Use BEM-like naming for components, elements, and modifiers.

Keep responsive rules in the `@media` block at the end of the stylesheet.

### JavaScript

Use the `App` object pattern from `js/app.js`.

Attach all public methods to the `App` object.

Use `const` by default.

Use `let` only when reassignment is needed.

Use double quotes for string literals to match the existing codebase.

Use two-space indentation.

Keep functions short and focused.

## State Management

Use the `App` object to hold runtime state.

Persist state to `localStorage` when the user may resume later.

Restore state on load before rendering the initial screen.

## Responsive Sizing

Components must not shrink below their mobile maximum width when the viewport grows.

This preserves the largest comfortable mobile size past the breakpoint.

### Modal Example

The modal uses a `768px` breakpoint.

On narrow screens, the modal takes most of the viewport.

```css
@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-width: none;
    min-width: 0;
  }
}
```

On wide screens, the modal is capped at `50%` of the viewport.

```css
.modal {
  width: 90%;
  max-width: 50%;
  min-width: 730px;
}
```

The `730px` desktop `min-width` equals the maximum mobile width at the breakpoint.

The modal therefore never becomes narrower than its widest mobile size.

## Build and Serve

There is no build step.

Start the development server with `npm start`.

Then open `http://localhost:8080` in a browser or an IDE browser preview.

The browser preview is a proxy to the running server.

It stops working when the server stops.
