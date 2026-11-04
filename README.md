# Clean Architecture & DDD Learning Lab

A game-like web app for learning **Clean Architecture** (blue) and **Domain-Driven Design** (purple).
The app itself is built following Clean Architecture and DDD.

## Features

- **Menu** to pick a learning mode or a mixed combination:
  - Flashcards (flip + self-grade)
  - Multiple choice with instant feedback and explanations
  - Drag & drop matching (drag or click)
  - Mixed mode (random combination of all three)
- **Searchable reference page** with a table of contents, per-section hyperlinks and tags
- **Project structure visuals**: Clean Architecture only, DDD only, and both combined
- Color coding throughout: blue = Clean Architecture, purple = DDD, teal = both

## Architecture

The codebase follows Clean Architecture with DDD bounded contexts. Dependencies point inward only.

```
src/
  core/                 shared kernel: Result, failures, branded ids, DI container
  domain/               pure domain logic, zero dependencies on outer layers
    knowledge/          bounded context: concepts / reference content
    learning/           bounded context: sessions, cards, questions, drag-drop, progress
  application/          use cases + DTOs per bounded context
  infrastructure/       adapters: seed data, in-memory & localStorage repositories, DI wiring
  presentation/         React UI: router, pages, components, theme
```

- Domain defines repository **ports**; infrastructure provides the **adapters**.
- `LearningSession` is an aggregate root guarding its own invariants (no double answers,
  completion only when finished).
- Use cases are the only entry points for the UI; the UI never touches repositories directly.

## Run locally

```bash
npm install
npm run dev
```

## Test / build

```bash
npm run test
npm run build
```

## Deployment

The app is deployed to **GitHub Pages** by the
[pages workflow](.github/workflows/pages.yml), which assembles one site with two entry points:

- **Public app** (built from `main`, served at the site root):
  `https://hedstrommen.github.io/clean-architecture-and-DDD-flashcards/`
- **Draft preview** (built from the active `vibe/*` branch, served at an unlisted path):
  `https://hedstrommen.github.io/clean-architecture-and-DDD-flashcards/draft/`

The draft URL is never linked from the public app and shows a "draft preview" banner, so only
people who know the URL can find it. Note that the repository is public, so GitHub Pages cannot
enforce a login — the draft is unlisted, not access-controlled.

The build base path is set via the `PAGES_BASE` environment variable; the draft build also sets
`VITE_DEPLOY_TARGET=draft` to enable the banner.

The architecture (framework-agnostic domain core, ports & adapters) is kept free of web-specific
APIs so the same core can later be shipped to the **Play Store** by wrapping the web build with
Capacitor or by porting the presentation layer to Flutter while reusing the domain and
application layers.
