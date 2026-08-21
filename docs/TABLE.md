# Markdown Table Formatting Guide

## Document Information

**Version**: 1.2

**Date**: 2026-06-26

**Author**: Filip Golewski

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

Include all Markdown formatting characters, backticks, asterisks, spaces, and punctuation in the width measurement.

The following formatting elements commonly appear in cells and are included in the width.

- Double backticks around hexadecimal and byte values (e.g., `` `00` ``).

- Single backticks around other code values (e.g., `some.value`).

- Bold markers around emphasized text (e.g., `**bold text**`).

- Single quotes around ASCII character literals (e.g., `'TEXT ').

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

- Measure the width of each cell in characters, including formatting markers and backticks.

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

