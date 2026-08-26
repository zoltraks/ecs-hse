# Markdown Text Style

## Purpose

This document defines the text formatting and prose style for Markdown documents in this project.

It applies to all documentation, including guidelines, standards, templates, and reference material.

For table formatting rules, see `TABLE.md`.

## Document Structure

Use a consistent top-to-bottom layout for every document.

1. **H1 title** -- plain, descriptive title.
2. **Purpose** -- one paragraph stating what the document covers.
3. **Main sections** -- H2 (`##`) for major topics, H3 (`###`) for subtopics.

**Document Information** and **Version History** sections are optional.

Do not add these sections to a document unless asked.

If a document already contains them, update them on every change.

Do not use H4 or deeper headings.

## Paragraph and Sentence Structure

Write short sentences.

Use one sentence per paragraph for technical descriptions.

This keeps the text readable in plain text editors, terminal viewers, and diff output.

Separate every sentence with an empty line.

A sentence may contain multiple related clauses if they express a single thought.

Do not pack unrelated ideas into one long paragraph.

## Word Wrap and Line Breaks

Do not hard-wrap text at a fixed column width.

Let each sentence occupy one logical line.

A sentence may be long when the thought is long, the editor or renderer will soft-wrap the display.

Hard-wrap only when the source itself needs a forced line break, such as inside a code block or a diagram.

## Headings

Use Title Case for all English section and chapter names.

Use H2 (`##`) for top-level sections.

Use H3 (`###`) for subsections.

Keep section names short.

Do not put qualifiers in section names using parentheses.

Put qualifiers like "mandatory" or "do not repeat" in the section body instead.

Avoid headings with trailing punctuation.

## Lists

Use dashes (`-`) for bullet points.

Use numbered lists only for sequential steps.

Put one empty line before and after every list.

Do not put blank lines between short list items.

Use blank lines between list items when the items are long or contain multiple sentences.

Put one blank line between a parent list item and its nested sublist.

For nested lists, indent the sublist to the parent item.

## Empty Lines and Spacing

Use one blank line between paragraphs.

Put one blank line before and after a list.

Put one blank line before and after a code block.

Do not stack multiple blank lines.

Do not use trailing spaces at the end of lines.

## Code Blocks

Use a language tag on every fenced code block.

Do not leave a blank line as the first or last line inside the block.

Keep code blocks compact and relevant.

Use backticks for inline code, file names, commands, and values.

## Inline Formatting

Prefer standard ASCII characters for normal text.

Use standard ASCII double quotes (`"`) instead of typographic quotes.

Use standard ASCII apostrophes (`'`) instead of typographic apostrophes.

Use bold text for key term definitions: **Term**: definition.

Use italics sparingly.

Do not overuse emphasis.

## Semicolons

Do not use the semicolon character in prose.

Join two closely related clauses with a comma instead.

Split the clauses into separate sentences when they express separate thoughts.

This rule does not apply to code blocks, inline code, or file paths.

### Correct

```markdown
State lives in JavaScript objects, the DOM only displays it.

Naming carries the meaning, comments carry the reason.

Begin every script file with `'use strict';` unless it is an ES module.
```

### Incorrect

```markdown
State lives in JavaScript objects; the DOM only displays it.

Naming carries the meaning; comments carry the reason.
```

## Tables

For table formatting, alignment, and padding rules, see `TABLE.md`.

Tables in prose should remain readable as plain text.

## Special Characters

Box-drawing characters are allowed inside code blocks for diagrams.

Do not replace box-drawing characters with `+`, `-`, or other ASCII approximations.

Do not use emojis unless explicitly requested.

## Language

Write documentation in the language used by the project.

For English, use Title Case in section names.

For Polish, use sentence case in section names.

For Polish content examples, use "Przykład zawartości" instead of "Content Example".

## Example

### Correct

```markdown
# Example Document

## Document Information

**Version**: 1.0

**Date**: 2026-08-21

## Purpose

This document shows the preferred Markdown style.

It uses short sentences.

It separates every sentence with an empty line.

## Writing Rules

- Write short sentences.
- Use one sentence per paragraph.
- Keep section names short.
```

### Incorrect

```markdown
# Example Document

## Document Information

**Version**: 1.0
**Date**: 2026-08-21

## Purpose

This document shows the preferred Markdown style. It uses short sentences. It separates every sentence with an empty line.

## Writing Rules
- Write short sentences.
- Use one sentence per paragraph.
- Keep section names short.
```

## File Maintenance

Maintain the existing line break style and encoding of any document you edit.

Create new files in UTF-8 by default.
