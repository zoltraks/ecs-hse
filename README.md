# ECS HSE Test

Practice application for the ECS Health, Safety and Environmental Awareness Assessment.

The assessment is administered by the Electrotechnical Certification Scheme (ECS) for anyone obtaining or renewing an ECS Card.

This app lets you practice with the official question bank and simulates the real test conditions.

## Project Guidelines

Before making any changes, read [`docs/GUIDELINES.md`](docs/GUIDELINES.md).

It contains development rules with a focus on AI assisted development.

It references two style documents:

- [`docs/STYLE.md`](docs/STYLE.md) -- Markdown text style conventions.
- [`docs/TABLE.md`](docs/TABLE.md) -- Markdown table formatting rules.

## Quick Start

Requires Node.js 18 or later.

```bash
npm start
```

Open `http://localhost:8080` in a browser.

## Features

- **Full Test**: 50 questions drawn proportionally from 11 topics, 30-minute timer, 86% pass mark.
- **Quick Quiz**: 20 random questions, no timer.
- **All Questions**: All 327 questions in topic order, no timer, with answer shuffling.
- **Practice Topics**: Browse questions by topic with answers and explanations.
- **State Persistence**: Test progress is saved to localStorage and restored on reload.
- **Cheater Mode**: Optional mode to reveal answers and pause the timer during practice.

## Project Structure

```text
ecs-test/
  index.html              -- Single-page app entry point
  server.mjs              -- Node.js static file server
  package.json            -- npm scripts and metadata
  css/
    style.css             -- All styling
  js/
    app.js                -- Application logic (App object)
    questions-data.js     -- Question bank, sections, and assessment config
  docs/
    GUIDELINES.md         -- Development guidelines
    STYLE.md              -- Markdown text style conventions
    TABLE.md              -- Markdown table formatting rules
    reference/            -- Source PDF and extracted data
```

## Tech Stack

- Plain HTML, CSS, and vanilla JavaScript.
- No build step and no frontend dependencies.
- Node.js static file server (`server.mjs`).

## Data Source

The question bank was extracted from `docs/reference/ECS-HSE-Revision-Guide-24-pdf.pdf`.

The extracted text is in `docs/reference/extracted-rows.txt` and `docs/reference/extracted.txt`.

The structured data is in `docs/reference/questions.json`.

The runtime data file `js/questions-data.js` is generated from that JSON.
