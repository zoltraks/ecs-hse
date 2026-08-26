# Markdown Table Formatting Guide

## Purpose

This guide describes the formatting conventions for Markdown tables.

It focuses on plain-text readability.

Column alignment and consistent padding are the primary goals.

The guide covers delimiter placement, header separators, cell padding, column width calculation, compacting, and automatic formatting rules.

## Table Formatting Style

### Delimiters

Use pipe characters (`|`) to delimit columns.

Place one space after the leading pipe and one space before the trailing pipe.

Do not add extra spaces around the pipes beyond the single required space.

### Header Separator

Place a separator line immediately after the header row.

The separator line contains only hyphens and pipe characters.

The hyphens in the separator row are contiguous with the pipe characters.

Do not add spaces between the pipes and the hyphens in the separator row.

The separator width for each column must match the header and content cell width between the pipes.

This means the separator contains the calculated column width plus two hyphens.

The extra hyphens account for the single space before and after each cell value.

The minimum width of any column is three characters.

### Cell Padding

Pad every cell with trailing spaces so it matches the column width.

Empty cells must also be padded to the column width.

Do not pad beyond the column width.

Never truncate cell contents.

Use left alignment for all cells.

### Column Widths

Calculate the column width as the maximum character width of all cells in that column, including the header cell.

Measure the width as the length of the cell string between the cell delimiters.

The width is the **source text** character count, not the rendered character count.

This is the most important rule in this guide.

Count every character that appears in the plain-text Markdown source, including all formatting markers.

Do not strip, interpret, or collapse any characters before measuring.

Do not measure the width of what the cell would look like after a Markdown renderer processes it.

A Markdown renderer hides backticks, asterisks, and other formatting markers from the reader, but those markers are still present in the source text and must be counted.

The table is formatted for plain-text readability first, and a Markdown renderer second.

In plain-text view, every character is visible, so every character must be counted.

**Characters That Must Be Counted**

The following characters are part of the cell content and must be included in the width measurement.

- Backticks around inline code (e.g., the cell `` `some.value` `` has 13 characters, not 11).

- Double backticks around code containing backticks (e.g., the cell `` `` `00` `` `` has 8 characters, not 4).

- Asterisks for emphasis (e.g., the cell `*italic*` has 9 characters, not 7).

- Double asterisks for bold (e.g., the cell `**bold**` has 10 characters, not 4).

- Underscores for emphasis (e.g., the cell `_under_` has 8 characters, not 5).

- Triple backticks, pipe characters inside code spans, and any other literal characters.

- Spaces, punctuation, and all other visible characters.

**Common Mistake**

The most common formatting mistake is measuring the **rendered** width instead of the **source** width.

For example, the cell `` `config.settings.json` `` contains 22 characters in the source text, including the two backticks.

A Markdown renderer displays only `config.settings.json`, which is 20 characters.

If the formatter uses 20 instead of 22, the column will be too narrow and the pipes will not align in plain text.

Always count the source text, never the rendered text.

**Formatting Elements Commonly Found in Cells**

The following formatting elements commonly appear in cells and are included in the width.

- Double backticks around hexadecimal and byte values (e.g., `` `00` ``).

- Single backticks around other code values (e.g., `some.value`).

- Bold markers around emphasized text (e.g., `**bold text**`).

- Single quotes around ASCII character literals (e.g., `'TEXT ').

**Worked Example**

Consider a cell containing `` `getValue` ``.

The source text between the delimiters is the string `` `getValue` `` including both backtick characters.

The character count is 10: one backtick, 8 letters, and one backtick.

The rendered text is `getValue` which is 8 characters.

The correct column width contribution is 10, not 8.

### Compacting

Compact the table after calculating column widths.

Remove any padding that exceeds the widest cell in each column.

Recalculate the separator line and all cell padding after compacting.

A compacted table has the minimum column widths needed to display all cells correctly.

The compacted version is the correct version.

### Multi-Line Cells

Avoid multi-line cells.

If a cell must wrap, apply the same formatting rules to every row in the table.

## Detailed Instructions for AI Agents and Models

When asked to create or fix a Markdown table, follow this checklist.

- Identify all cells in the table, including the header row.

- Measure the width of each cell in source-text characters, including all formatting markers such as backticks, asterisks, and underscores.

- Do not use the rendered width; always use the source-text width.

- Determine the maximum width for each column from all cells in that column.

- Compact the table by removing any column width that exceeds the widest cell in that column.

- Pad every cell with trailing spaces to match the compacted column width.

- Rebuild the header separator with the compacted column width plus two hyphens.

- Verify that all vertical separators align when viewed as plain text.

Keep sentences short.

Use empty lines between paragraphs.

Use bullet points for non-sequential instructions.

## Rules for Automatic Table Formatting

The following rules can be implemented as a script.

### Input

The script accepts a Markdown table as a single string.

The table contains a header row, a separator row, and any number of content rows.

### Parsing

Split the input into rows by newline characters.

Trim the outer whitespace from each row.

For each row, split the row by pipe characters.

Remove empty strings that result from the leading and trailing pipes.

Trim the leading and trailing space from each cell value.

Identify the separator row as the row whose cells contain only hyphens.

### Width Calculation

For each column, calculate the maximum width of all cells.

Measure the width as the length of the cell string in characters.

The length must be the **source text** length, not the rendered length.

Use the string length function directly on the raw cell content after trimming leading and trailing spaces.

Do not strip backticks, asterisks, underscores, or any other formatting markers before measuring.

Do not parse or interpret Markdown formatting before measuring.

Do not use the visible text length that a Markdown renderer would produce.

For example, in Python use `len(cell)`, in JavaScript use `cell.length`, and in C# use `cell.Length`.

These functions return the source character count, which is the correct measurement.

Include the header cell width in the maximum calculation.

Use a minimum column width of three characters.

After calculating the maximum width, compact the table by removing any extra padding.

The final column width is the minimum width that fits the widest cell.

### Output Generation

Rebuild each row with the following format.

```
| PADDED_CELL_1 | PADDED_CELL_2 | ... |
```

Pad each cell with spaces on the right.

Rebuild the header separator row with the following format.

```
|-------|-------|-----|
```

Replace each cell value with hyphens matching the column width plus two hyphens.

Do not add spaces between the pipes and the hyphens.

### Edge Cases

Preserve empty cells.

Preserve inline code spans, emphasis, links, and other Markdown formatting.

Do not merge cells.

Do not split cells.

Do not add or remove rows.

Do not remove leading or trailing spaces from inside code spans.

## Examples

The tables below follow the formatting rules.

### Simple Example

| Code   | Label | Status    |
|--------|-------|-----------|
| ``A1`` | Alpha | Active    |
| ``B2`` | Beta  | Pending   |
| ``C3`` | Gamma | Suspended |
| ``D4`` | Delta | Closed    |

### Complex Example

| Category          | Module                  | Details                                                              |
|-------------------|-------------------------|----------------------------------------------------------------------|
| Data conversion   | `Lib.Alpha`             | Convert values between different representations with safe fallbacks |
| Text processing   | `Lib.Beta`              | Trim, pad, split, and case-convert text strings across platforms     |
| Naming styles     | `Lib.Gamma`             | Transform identifiers between several supported naming conventions   |
| Hex utilities     | `Lib.Delta`             | Encode and decode hexadecimal values with optional pretty printing   |
| Hashing           | `Lib.Epsilon`           | Compute digests for common one-way hash algorithms                   |
| Compression       | `Lib.Zeta`              | Wrap sliding-window and dictionary-based compression algorithms      |
| Color handling    | `Lib.Eta`               | Store and convert color values between multiple color models         |
| Binary helpers    | `Lib.Theta`, `Lib.Iota` | Read and write bits, bytes, and nibbles in various arrangements      |
| Collections       | `Lib.Kappa`             | Helpers for lists, dictionaries, and array comparison operations     |
| Date and time     | `Lib.Lambda`            | Perform date arithmetic and format values for different cultures     |
| File utilities    | `Lib.Mu`                | Read and write text and binary files across different platforms      |
| Networking        | `Lib.Nu`                | Parse and resolve network addresses and host information             |
| Web requests      | `Lib.Xi`                | Send and receive requests using common web request methods           |
| Configuration     | `Lib.Omicron`           | Parse and write configuration files in common formats                |
| Data formats      | `Lib.Pi`                | Tokenize and extract values from structured text formats             |
| Logging           | `Lib.Rho`               | Write structured log entries to console, file, or custom handlers    |
| Console markup    | `Lib.Sigma`             | Apply inline markup to console output for colored text               |
| Application host  | `Lib.Tau`               | Host an application with configuration and lifecycle management      |
| Background worker | `Lib.Upsilon`           | Manage background worker threads with start and stop primitives      |
| Random values     | `Lib.Phi`               | Generate random bytes, integers, and strings for testing             |
| Benchmarking      | `Lib.Chi`               | Measure elapsed time for performance profiling and comparison        |
| Money values      | `Lib.Psi`               | Represent monetary values with arithmetic and equality operations    |
| Coordinates       | `Lib.Omega`             | Store latitude and longitude coordinate values                       |
| Pattern matching  | `Lib.Aleph`             | Match patterns using wildcards and glob expressions                  |
| Encryption        | `Lib.Beth`              | Apply symmetric cipher helpers and manage keys safely                |

The simple example uses column widths of 6, 5, and 9 characters.

The complex example uses column widths of 17, 23, and 68 characters.

In both examples, the header separator line uses the column width plus two hyphens.

### Compacting Example

The following table is not compacted.

The Code column is wider than necessary.

```markdown
| Index  | Code      | Description         |
|--------|-----------|---------------------|
| ``A1`` | Apple     | First example item  |
| ``A2`` | Berry     | Second example item |
| ``A3`` | Cherry    | Third example item  |
| ``A4`` | Date      | Fourth example item |
| ``A5`` | Elder     | Fifth example item  |
```

The compacted version removes the extra padding in the Code column.

The Code column width is reduced from 9 to 6 characters.

```markdown
| Index  | Code   | Description         |
|--------|--------|---------------------|
| ``A1`` | Apple  | First example item  |
| ``A2`` | Berry  | Second example item |
| ``A3`` | Cherry | Third example item  |
| ``A4`` | Date   | Fourth example item |
| ``A5`` | Elder  | Fifth example item  |
```

Note that the Description column remains unchanged because its widest cell already fits the compacted column width.

Note that cells containing multiple inline code spans are not padded inside the code spans.

Only the overall cell width is padded to match the column.

### Source Width Example

The following example demonstrates the difference between source-text width and rendered width.

The table contains backtick-wrapped code spans in the Endpoint column.

The cell `` `api/configuration` `` has 19 source characters but only 17 rendered characters.

The correct table uses the source-text width of 19 for the Endpoint column.

```markdown
| Method | Endpoint              |
|--------|-----------------------|
| POST   | `api/login`           |
| GET    | `api/status`          |
| POST   | `api/configuration`   |
```

The incorrect table below uses the rendered width of 17.

The last row overflows the column because the cell content is wider than the calculated width.

The trailing pipe on the last row does not align with the pipes above it.

```markdown
| Method | Endpoint            |
|--------|---------------------|
| POST   | `api/login`         |
| GET    | `api/status`        |
| POST   | `api/configuration` |
```

Always use the source-text character count to prevent this misalignment.

