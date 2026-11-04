# Mindscape Atlas

**Mindscape Atlas** (Russian: "Атлас психологии человека") is an interactive, self-hosted encyclopedia of human psychology - relationships, thinking, emotions, and life. It is a personal knowledge base where curated sources are distilled into ideas, ideas are linked to topics, and topics grow into deeply structured articles, myth debunkings, and an interactive concept map.

> The product UI and content are in Russian; this repository documentation is in English. Russian documentation: [README.ru.md](README.ru.md).

## Why it exists

The goal is not to publish many articles but to collect genuinely valuable knowledge: mechanisms instead of generic advice, explicit evidence levels instead of false certainty, and connections between phenomena instead of isolated topics. The system stores, structures, links, and surfaces knowledge; a human editor decides what deserves to be in it.

## Knowledge model

| Entity | Purpose |
| --- | --- |
| **Topics** | A tree of unlimited depth. Top level = sections (Love & relationships, People & communication, Thinking & illusions, Emotions & happiness, Growth & progress, Money & success), nested = concepts. |
| **Articles** | Flexible block structure: main question, short summary, deep dive, misconceptions, real-life examples, practical takeaways. Empty blocks are hidden. Each article carries an evidence level: research-backed, hypothesis, author's interpretation, personal observation, mixed, disputed. |
| **Myths** | Structured debunking: why people believe it, what the evidence says, what remains unknown, a more precise formulation. Verdicts: debunked, misleading, partly true, unproven, disputed. |
| **Sources** | Videos, books, lectures, research papers - the raw material of the base. |
| **Ideas** | Atomic thoughts extracted from sources (with quotes and timecodes) or personal observations. Ideas link to topics and to each other: develops / complements / challenges. |
| **States** | Entry points by lived experience ("I'm afraid to approach someone", "I got rejected") that gather relevant articles, topics, and myths. |
| **Topic links** | Typed connections between concepts (related / similar / opposes / influences). They build the interactive concept map automatically. |
| **Search** | SQLite FTS5 full-text search across titles, body text, tags, and tag synonyms, with prefix matching and highlight snippets. |

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript + React 19
- SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) + [Drizzle ORM](https://orm.drizzle.team), FTS5 full-text search
- [Tailwind CSS 4](https://tailwindcss.com), Literata + IBM Plex Mono (Cyrillic)
- [d3-force](https://github.com/d3/d3-force) concept map, [lucide-react](https://lucide.dev) icons

## Getting started

Prerequisites: Node.js 20+.

```bash
npm install

# Create .env.local (or copy from .env.example) and set your credentials:
#   ADMIN_PASSWORD   - password for the /admin editor panel
#   SESSION_SECRET   - long random string used to sign the admin session
npm run dev
```

Open http://localhost:3000. On first run the SQLite database is created at `data/atlas.db`, migrations are applied, and demo content (marked with a "Demo" badge) is seeded so every feature is visible out of the box. Demo content can be edited or deleted in the admin panel.

Admin panel: http://localhost:3000/admin/login (password from `ADMIN_PASSWORD`). The default fallback password is `atlas-admin` - **change it before any real use**.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build and serve |
| `npm run db:generate` | Regenerate SQL migrations after schema changes |
| `npm run db:seed` | Create the database manually and seed demo content |

## Content workflow

1. Add a source (video URL, book, research paper) in **Sources**.
2. Extract atomic ideas from it and link each idea to topics.
3. Write an article in the editor, attaching sources and ideas to its blocks.
4. Debunk popular claims in **Myths** - disputed claims get verdicts, not labels.
5. Connect topics in **Topic links** - the concept map updates itself.
6. Create **States** and gather materials around a specific experience.

## Data and backups

The whole database is a single file, `data/atlas.db` (WAL mode). Copying that file is a complete backup. The `data/` directory is intentionally **not** committed: it holds personal content. If you use GitHub only as a code backup, keep database backups separately (encrypted cloud storage, an external drive, or a second private repo for snapshots).

## Publishing this repository

The repo is prepared for GitHub as a private backup:

```bash
# Create an empty private repo on GitHub, then:
git remote add origin git@github.com:<you>/mindscape-atlas.git
git push -u origin main
```

`.env.local`, `data/`, and build output are gitignored and will not be pushed.

## Deployment path

The schema is SQLite-first via Drizzle. To move to a hosted environment later, swap the driver: [Turso](https://turso.tech) (libSQL is SQLite-compatible) or Postgres via the matching Drizzle driver. Application code is database-agnostic through the query layer in `src/lib/queries.ts`.

## Project structure

```
src/
  app/               Site and admin pages (App Router)
    admin/actions/   Server actions for the editor panel
  components/        UI components, concept map, route rail
  db/                Drizzle schema, migrations are applied on boot,
                     FTS5 setup, demo content
  lib/               Data access, search, auth, labels, design tokens
docs/
  design/            Design brief ("psyche as terrain, reading as a route")
drizzle/             SQL migrations
data/                Database file (not committed)
```

## Security notes

- The admin panel is a single-password gate intended for a local, single-editor setup. Set `ADMIN_PASSWORD` and `SESSION_SECRET` in `.env.local`; if `ADMIN_PASSWORD` is missing, a built-in default is used and a warning is logged.
- The site is an educational resource. It does not diagnose and does not replace professional psychological or medical help.

## License

All rights reserved. This repository is a private backup; no license is granted for reuse, distribution, or modification.
