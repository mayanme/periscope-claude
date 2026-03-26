# Periscope

AI-powered intelligence briefs for venture capital teams.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection pooling → Session mode |
| `DIRECT_URL` | Supabase → Settings → Database → Connection string → Direct |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `EXA_API_KEY` | exa.ai dashboard |

Also update `.env` (used by Prisma CLI) with the same `DATABASE_URL` and `DIRECT_URL`.

> **Supabase connection string**: Use the **Session pooler** URL for DATABASE_URL (port 5432) and the direct URL for DIRECT_URL. Both are in Supabase → Settings → Database.

### 3. Set up the database

```bash
npx prisma migrate deploy   # applies the migration + tsvector trigger
npm run db:seed             # creates the FirmSettings row
```

### 4. Generate test fixtures (optional)

```bash
npm run generate-fixtures
```

This creates:
- `fixtures/dummy-firm-context.txt` — upload to Settings → Internal Documents
- `fixtures/dummy-pitch-deck.pdf` — submit as a test deal

### 5. Run the app

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2 (Inngest background job runner):**
```bash
npx inngest-cli@latest dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Settings** (`/settings`) — Set your fund name, investment thesis, stage/sector focus, and upload internal documents (memos, thesis docs)
2. **Add Deal** (`/deals/new`) — Paste a company URL or upload a pitch deck PDF
3. **Dashboard** (`/`) — Watch the status update as Periscope researches and synthesizes the brief (30–60 seconds)
4. **Brief** — View the full intelligence brief, then click **Print / Save PDF** to export

## Deploying to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set all environment variables in Vercel dashboard
4. Create an [Inngest](https://inngest.com) account and connect your Vercel deployment
5. Use the **Transaction pooler** URL for `DATABASE_URL` on Vercel (port 6543)
