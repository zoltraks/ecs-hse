# Deviation Remediation Proposal

## Purpose

This document proposes refactoring steps to bring the ECS HSE Test application into compliance with the development standard defined in [`docs/standard/html-vanilla-app-development.md`](../standard/html-vanilla-app-development.md).

Each deviation is categorized by priority and scoped so it can be addressed as an independent change.

## Current State

The application is a minimal-layout vanilla JavaScript single page application.

It uses the namespace object pattern, classic scripts, a centered shell, and a single stylesheet.

The overall architecture is sound and matches the standard's minimal layout closely.

The deviations listed below are specific gaps between the current implementation and the standard.

## Priority Levels

- **High**: Correctness, security, or data integrity risk.
- **Medium**: Accessibility, robustness, or maintainability gap.
- **Low**: Style or convention polish with no functional impact.

## Deviations

### 1. Missing `use strict` Directive

**Priority**: Medium

**Standard reference**: Module System, line 427

The standard requires every classic script file to begin with `'use strict';` unless it is an ES module.

The file `js/app.js` does not include the directive.

**Remediation**: Add `'use strict';` as the first line of `js/app.js`.

### 2. Literal `z-index` Values

**Priority**: Low

**Standard reference**: Layer Order, line 797-812

The standard requires every `z-index` value to come from a `--z-` token.

The stylesheet uses literal values in two places:

| Location              | Current Value | Token to Use  |
|-----------------------|---------------|---------------|
| `.app-header`         | `100`         | `--z-header`  |
| `.modal-overlay`      | `1000`        | `--z-modal`   |

**Remediation**: Add `--z-header: 100;` and `--z-modal: 500;` to the `:root` token block, then replace the literal values with `var(--z-header)` and `var(--z-modal)`.

### 3. `transition: all` on Buttons

**Priority**: Low

**Standard reference**: Motion, line 385-388

The standard says to transition named properties, never `all`.

The `.btn` rule uses `transition: all 0.15s;`.

**Remediation**: Replace with `transition: background 0.15s, color 0.15s, opacity 0.15s;` to cover the properties that actually change on hover and disabled states.

### 4. Missing `prefers-reduced-motion` Media Query

**Priority**: Medium

**Standard reference**: Motion, line 389-398

The standard requires respecting the reduced motion preference.

The stylesheet has animations on `.timer-display.danger` and transitions on several components, but no `prefers-reduced-motion` block.

**Remediation**: Add the following block at the end of `css/style.css`, before the existing `@media (max-width: 768px)` rule:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Incomplete CSS Reset

**Priority**: Medium

**Standard reference**: Reset, line 324-346

The standard requires a minimal reset that includes `font: inherit` for form controls and `max-width`/`height` for images and SVGs.

The current reset covers `box-sizing`, `margin`, and `padding` but omits the form control and image rules.

**Remediation**: Add the following rules after the existing reset block:

```css
button, input, select, textarea {
  font: inherit;
}

img, svg {
  max-width: 100%;
  height: auto;
}
```

### 6. Modal Missing `max-height` and Scrolling Body

**Priority**: High

**Standard reference**: Reusable Modal, line 833-850

The standard mandates `max-height: 90vh` on the modal and an `overflow-y: auto` scrolling body.

Without them, a long message grows the dialog past the viewport and the action buttons become unreachable.

The current `.modal` rule has no `max-height`, and the modal body does not scroll.

**Remediation**: Add `max-height: 90vh;` to the `.modal` rule. Add `overflow-y: auto;` to `#modal-body` or a `.modal-body` class on the body element.

### 7. Modal Missing Escape Key, Scroll Lock, and Focus Trap

**Priority**: High

**Standard reference**: Modal Behavior, line 852-868

The standard requires three behaviors the current modal does not implement:

- **Escape key dismissal**: The modal should close when `Escape` is pressed.
- **Scroll locking**: The page behind the overlay should not scroll while the modal is open.
- **Focus trapping**: Keyboard focus should stay inside the modal while it is open and return to the trigger on close.

The current `showModal` function in `js/app.js` attaches `onclick` handlers to the confirm, cancel, and extra buttons but does not register an Escape listener, does not lock body scroll, and does not trap focus.

**Remediation**: Extend `showModal` to:

1. Add `document.addEventListener('keydown', onEscape)` where `onEscape` checks for `Escape` and calls `close`.
2. Add `body.scroll-locked` class to `document.body` on open and remove it on close.
3. Query focusable elements inside the modal and trap `Tab` focus within them.
4. Store `document.activeElement` on open and restore focus to it on close.
5. Detach the Escape listener in `close`.

### 8. Modal Backdrop Click Does Not Close

**Priority**: Medium

**Standard reference**: Modal Behavior, line 866

The standard says to compare `e.target` to the overlay itself so a click inside the dialog does not close it, but a click on the backdrop does.

The current modal does not handle backdrop clicks at all.

**Remediation**: Add an `onclick` handler on the overlay element that checks `e.target === overlay` and calls `close`.

### 9. Unescaped Values in `innerHTML` Templates

**Priority**: High

**Standard reference**: Escaping, line 510-512

The standard requires every value that reaches `innerHTML` to be escaped without exception.

The `escapeHtml` helper exists and is used for question text, option text, and explanations.

However, section names from `SECTIONS` data are interpolated directly into `innerHTML` without escaping in three places:

| Function                  | File Location | Unescaped Value |
|---------------------------|---------------|-----------------|
| `renderTopicsList`        | `js/app.js`   | `info.name`     |
| `renderTopicBreakdown`    | `js/app.js`   | `stat.name`     |
| `renderPracticeTopics`    | `js/app.js`   | `info.name`     |
| `showPracticeSection`     | `js/app.js`   | `info.name`     |

While the section names come from generated data and are currently safe, the standard makes no exception for trusted data.

**Remediation**: Wrap every `info.name` and `stat.name` interpolation with `this.escapeHtml(...)` in the four functions listed above.

### 10. Storage Key Lacks Version

**Priority**: Medium

**Standard reference**: Persistence, line 561-571

The standard prefers a versioned key so the schema can evolve, and recommends rejecting a payload whose `version` field does not match.

The current key is `ecs-hse-test-state` with no version suffix and no `version` field in the stored payload.

**Remediation**:

1. Change `STORAGE_KEY` to `'ecs-hse-test-state-v1'`.
2. Add a `version: 1` field to the saved payload in `saveState`.
3. In `loadState`, reject the payload if `data.version !== 1`.
4. Add a migration path: if the old key exists, attempt to load and migrate it, then remove the old key.

### 11. Server Missing `Cache-Control` Header

**Priority**: Medium

**Standard reference**: Development Server, line 1337-1338

The standard requires the server to disable caching.

The current `server.mjs` does not set a `Cache-Control` header on responses.

**Remediation**: Add `'Cache-Control': 'no-cache, no-store, must-revalidate'` to the response headers in the `res.writeHead` call.

### 12. Missing `check` Script in `package.json`

**Priority**: Low

**Standard reference**: Package Manifest, line 1401-1403

The standard suggests a `check` script for syntax verification.

The current `package.json` has only the `start` script.

**Remediation**: Add `"check": "node --check js/app.js && node --check server.mjs"` to the `scripts` object.

### 13. Accessibility Gaps

**Priority**: High

**Standard reference**: Accessibility, line 1122-1136 and Custom Choice Controls, line 992-1004

The standard requires several accessibility behaviors the application does not currently implement:

- **Icon-only controls** lack `aria-label` attributes, such as the logo, timer display, and flag indicator.
- **Option items** in the test screen are clickable `<div>` elements that behave like radio buttons but lack `role="radio"`, `aria-checked`, and `tabindex="0"`.
- **Keyboard activation** is missing for option items, which are not reachable by `Tab` or activatable by `Enter`.
- **Screen announcement** is missing, the screen heading does not receive focus after a screen switch.
- **Focus outline** is not explicitly preserved, the stylesheet does not set `outline: none` but also does not guarantee a visible focus ring on custom controls.

**Remediation**: This is the largest single change and should be broken into sub-tasks:

1. Add `aria-label` to icon-only controls in `index.html`.
2. Add `role="radiogroup"` to `.options-list` and `role="radio"`, `aria-checked`, `tabindex="0"` to each `.option-item` in `renderQuestion`.
3. Add `keydown` listener on option items for `Enter` and `Space` to trigger `selectAnswer`.
4. Move focus to the screen heading after `showScreen` switches screens.
5. Add a visible `:focus-visible` outline style for `.option-item` and `.qnav-item`.

### 14. Comments Describe What Instead of Why

**Priority**: Low

**Standard reference**: Comments, line 1464-1474

The standard says comments should carry the reason, not describe what the code does.

Several comments in `js/app.js` describe the action the code performs rather than the decision behind it.

Examples include `// Render options`, `// Update nav buttons (top and bottom)`, and `// Update progress`.

**Remediation**: Remove comments that restate the code. Keep comments that explain non-obvious decisions, such as the shuffle options comment that explains the ambiguity problem.

## Proposed Execution Order

The changes are independent and can be applied in any order.

The order below groups them by risk and dependency to minimize regression surface.

1. **Item 1** -- Add `'use strict';` (one line, no behavioral change)
2. **Item 5** -- Complete the CSS reset (additive, no conflict)
3. **Item 4** -- Add `prefers-reduced-motion` (additive, no conflict)
4. **Item 3** -- Fix `transition: all` (single property change)
5. **Item 2** -- Replace literal `z-index` values with tokens (additive tokens, then swap values)
6. **Item 12** -- Add `check` script to `package.json` (additive)
7. **Item 11** -- Add `Cache-Control` header to server (single header addition)
8. **Item 9** -- Escape section names in `innerHTML` (wrap four interpolations)
9. **Item 10** -- Version the storage key (requires migration logic)
10. **Item 6** -- Add modal `max-height` and scrolling body (CSS only)
11. **Item 8** -- Add backdrop click to close (small JS addition)
12. **Item 7** -- Add Escape, scroll lock, and focus trap to modal (larger JS change)
13. **Item 13** -- Accessibility remediation (largest change, multiple files)
14. **Item 14** -- Clean up comments (cosmetic, do last to avoid merge conflicts)

## Verification

After each change, verify according to the project's verification rules in [`docs/GUIDELINES.md`](../GUIDELINES.md):

- Run `node --check js/app.js` after JavaScript changes.
- Run `node --check server.mjs` after server changes.
- Start the server with `npm start` and test in a browser.
- Test keyboard navigation with `Tab`, `Enter`, and `Escape` after modal and accessibility changes.
- Test responsive layout at the `768px` breakpoint after CSS changes.
- Verify the browser console is clean after every change.
