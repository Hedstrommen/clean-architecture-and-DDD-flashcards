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

During development the app is deployed to **GitHub Pages** via the
[deploy workflow](.github/workflows/deploy-pages.yml) on every push to `main`
(`npm run build` with `GITHUB_PAGES=true` sets the correct base path).

The architecture (framework-agnostic domain core, ports & adapters) is kept free of web-specific
APIs so the same core can later be shipped to the **Play Store** by wrapping the web build with
Capacitor or by porting the presentation layer to Flutter while reusing the domain and
application layers.
