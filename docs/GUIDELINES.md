# Development Guidelines

## Purpose

This document defines the rules for developing and maintaining the ECS HSE Test project.

It has a particular focus on AI assisted development.

It complements [`README.md`](../README.md), which provides the project overview.

## Sources of Truth

The following files contain rules and guidelines for working in this repository:

- **[`README.md`](../README.md)**: Project overview and quick start.
- **[`docs/GUIDELINES.md`](GUIDELINES.md)**: This document.
- **[`docs/STYLE.md`](STYLE.md)**: Markdown text style conventions.
- **[`docs/TABLE.md`](TABLE.md)**: Markdown table formatting rules.

Files in `docs/reference/` are source material, not rules.

## AI Assisted Development

### Read Before Acting

Before making any changes, read `README.md` and this document.

Verify that you are working with the current versions.

Project-specific rules override general best practices.

### Verify Before Claiming

Do not guess the state of the codebase.

Use available tools to read files, search, and run commands before answering questions or making changes.

If something is uncertain, investigate first.

### Scope of Changes

Make the smallest change that solves the problem.

Do not refactor unrelated code in the same change.

Do not reformat code that you did not intend to change.

If a change requires touching multiple files, explain why.

### No Automatic Commits

Do not commit changes automatically.

The user will commit manually when ready.

Do not push to any remote unless explicitly asked.

### Destructive Operations

Never perform irreversible operations without explicit confirmation.

This includes deleting files, dropping data, or overwriting work.

If a destructive step is required, stop and describe what will happen.

### Error Handling

When a command or build fails, investigate the root cause.

Do not retry blindly with the same approach.

Search the codebase and documentation for similar issues.

Ask for help only after exhausting reasonable options.

### Security

Never introduce code that exposes or logs secrets.

Never commit secrets to the repository.

Assume the code is for a real production task unless stated otherwise.

## Code Conventions

### JavaScript

- Use vanilla JavaScript (no frameworks, no transpilation).
- Follow the existing `App` object pattern in `js/app.js`.
- Use `const` by default; use `let` only when reassignment is needed.
- Use double quotes for string literals to match the existing code.
- Use two-space indentation.
- Keep functions short and focused.
- Do not add comments unless they explain non-obvious logic.

### HTML

- Keep all screens in `index.html` as sections of a single page.
- Use inline `onclick` handlers that call `App` methods, matching the existing pattern.
- Do not introduce templating engines or frameworks.

### CSS

- Use CSS variables defined in `:root` for colors and shared values.
- Follow the existing naming conventions (BEM-like, kebab-case).
- Keep responsive rules in the `@media` block at the end of `style.css`.
- Do not use CSS preprocessors.

### Data Files

- `js/questions-data.js` is generated from `docs/reference/questions.json`.
- When fixing question data, update `questions.json` first.
- Regenerate `questions-data.js` from the updated JSON.
- Never edit question data directly in `questions-data.js` alone.

## Verification

Before considering a task complete, verify the work.

- Run `node --check js/app.js` to verify JavaScript syntax.
- Run `node --check server.mjs` to verify the server syntax.
- Start the server with `npm start` and test in a browser.
- For data changes, run a validation script to check for duplicate options and invalid answers.

## Documentation Style

When writing or updating documentation, follow [`STYLE.md`](STYLE.md).

When creating or editing Markdown tables, follow [`TABLE.md`](TABLE.md).

Key principles:

- Write short sentences.
- Separate sentences with an empty line.
- Use Title Case for English section names.
- Prefer ASCII characters.
- Do not use emojis unless explicitly requested.

## File Maintenance

### Editing Existing Files

- Maintain the existing style and naming conventions.
- Do not change line break characters (CRLF vs LF) or encoding.

### Creating New Files

- Use UTF-8 encoding.
- Place documentation in `docs/`.
- Place runtime code in `js/` or the project root.

## Version Control

### Commit Messages

Omit conventional-commit prefixes (no `feat:`, `fix:`, `docs:`, etc.).

Write a concise message focused on the reason for the change.

### Branches

Do not create branches unless asked.

Do not force-push or rewrite history.
