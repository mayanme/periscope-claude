# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Next.js dev server (http://localhost:3000)
npm run build        # production build
npm run lint         # ESLint via next lint

npm run db:migrate   # run Prisma migrations (also creates tsvector trigger + GIN index)
npm run db:seed      # seed FirmSettings row (id=1); must run after first migration
npm run db:push      # push schema changes without a migration file (dev only)
npm run db:studio    # open Prisma Studio

npm run generate-fixtures  # generate fixtures/dummy-pitch-deck.pdf + dummy-firm-context.txt
```

**Two `.env` files are required:**
- `.env.local` — read by Next.js at runtime (all variables)
- `.env` — read by Prisma CLI only (`DATABASE_URL` + `DIRECT_URL`)

**Queue modes** (set via `QUEUE_MODE` in `.env.local`):
- `local` (default) — fire-and-forget within the Node process. No extra terminal needed.
- `inngest` — sends events to Inngest for background execution. Requires `npx inngest-cli@latest dev` running in a second terminal. Required for Vercel deployment.

## Architecture

### Pipeline (the core of the app)

When a deal is submitted, `triggerPipeline(dealId)` in `src/lib/pipeline/index.ts` runs four steps sequentially:

1. **Extract** (`extract.ts`) — scrapes the company URL via `exa.getContents()` or parses a PDF via `pdf-parse`, then uses a Claude micro-prompt to extract `{ companyName, companyUrl, hq, foundingYear, description }`.

2. **Research** (`research.ts`) — fires 10 Exa queries in parallel via `Promise.allSettled`. After they settle, checks 5 key buckets (`founders`, `funding`, `competitors`, `marketSize`, `tractionSignals`) and fires fallback queries for any that returned 0 results. Fallbacks for `competitors` and `marketSize` search the product description/space rather than the company name.

3. **Synthesize** (`synthesize.ts`) — fires 5 parallel Claude calls (`claude-sonnet-4-6`), one per brief section. Each call returns typed JSON. The system prompt instructs Claude to treat the pitch deck as the authoritative source and discard web results that appear to be about a different company sharing the same name.

4. **Save** — upserts a `Brief` record; sets deal status to `COMPLETE` (or `FAILED`).

### RAG

Internal documents uploaded via Settings are chunked (`src/lib/utils/chunker.ts`, 512-char target with 64-char overlap) and stored as `DocChunk` rows. A PostgreSQL trigger (created in the migration SQL) auto-populates the `tsv` tsvector column. Retrieval uses `plainto_tsquery` + `ts_rank` via `prisma.$queryRaw` — never `$queryRawUnsafe`. The retrieved chunks are passed only to the `fundFit` synthesis call.

### Data flow

```
POST /api/deals
  → save Deal (PENDING)
  → triggerPipeline(dealId)
      → runPipeline() [async, not awaited in local mode]
          → RESEARCHING → SYNTHESIZING → COMPLETE/FAILED
GET /api/deals (polled every 3s by dashboard)
GET /api/briefs/[dealId]
```

### JSON handling

All 5 Brief sections are stored as `Json` columns in Postgres. When reading them back in server components, cast with `as unknown as BriefType`. When writing Prisma `InputJsonValue`, use the `toJson()` helper in `pipeline/index.ts` (`JSON.parse(JSON.stringify(data))`).

`extractJson()` in `src/lib/claude.ts` handles Claude responses that are: plain JSON, fenced in ` ```json `, fenced without a closing fence (truncated), or a bare `{...}` block.

### Key gotchas

- **pdf-parse import**: must use `import pdfParse from "pdf-parse/lib/pdf-parse.js"` — the default import triggers a test-file loader bug in Next.js.
- **tsvector**: the `tsv` column is `Unsupported("tsvector")` in the Prisma schema and must never be written from application code — the DB trigger handles it.
- **FirmSettings**: always a single row with `id = 1`. Seed must run once after migration.
- **Supabase connection**: use the Session pooler URL (port 5432) for both `DATABASE_URL` and `DIRECT_URL`. The direct host (port 5432 on `db.*.supabase.co`) is blocked externally. For Vercel, use the Transaction pooler URL (port 6543) for `DATABASE_URL`.
- **Prisma + tsvector FTS**: all full-text search queries must use `prisma.$queryRaw` tagged template literals.
