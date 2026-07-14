# Genetic Report — PWA

A mobile-first progressive web app for viewing a genetic test report: health risks, medications (pharmacogenomics), lifestyle traits, and an action plan. Implemented from the `Genetic Report App.dc.html` design (see `../chats/chat1.md` and `../README.md` for design intent).

Built with React + TypeScript + Vite, installable as a PWA (`vite-plugin-pwa`). Report data is stored in Postgres (JSONB), keyed by an access code — see "Access-code + database setup" below. Users enter a code on open; a fresh code is generated whenever someone uploads a report with no code yet.

## Develop

```bash
npm install
npm run dev
```

`/api/*` (the PDF-upload and report-lookup endpoints) only run under `vercel dev` or on a real Vercel deployment — plain `vite dev` serves the frontend only, so every flow that hits an API route will fail locally unless you run via `vercel dev` with `ANTHROPIC_API_KEY` and the Postgres env vars set.

## Build

```bash
npm run build
npm run preview
```

## Access-code + database setup

**One-time setup, in order:**

1. **Create the database.** In the Vercel dashboard: your project → **Storage** tab → **Create Database** → **Postgres**. Connect it to this project — Vercel auto-injects the `POSTGRES_*` env vars, no manual connection string needed.
2. **Create the table.** Open that database's **Query** tab in the Vercel dashboard and run:
   ```sql
   CREATE TABLE IF NOT EXISTS reports (
     uid TEXT PRIMARY KEY,
     data JSONB NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ```
3. **Set `ANTHROPIC_API_KEY`** (Project → Settings → Environment Variables) if you haven't already — required by `/api/parse-report`.
4. **Redeploy** so the new env vars and endpoints take effect.
5. **Seed the sample report** — once, after deploying: `curl -X POST https://<your-app>.vercel.app/api/seed`. This inserts the original sample data under a fixed access code (`CQ7D4DM3` — also shown on the app's "View the sample report" link, so you don't need to remember it). Safe to call more than once; it won't overwrite.

**How it works after that:** the app always opens to a code-entry screen (`src/screens/UidGateScreen.tsx`). Entering a code fetches that report from Postgres (`GET /api/report/:uid`). Uploading a PDF while no code is active creates a brand-new row and a fresh code, shown once so you can save it; uploading while a code is already active overwrites that same row (`POST /api/parse-report`, upserts via `src/api/_lib/db.ts`). The browser only remembers the *code* (`localStorage`), never the report data itself — the database is the single source of truth.

## PDF upload

The Home screen's "Upload New Report" button (and the gate screen's "Upload a New Report") POSTs a base64-encoded PDF to `/api/parse-report`, a Vercel serverless function that calls the Anthropic API (`claude-opus-4-8`) with the PDF as a native document input and a schema-constrained structured-output request, returning JSON validated against `src/data/reportSchema.ts`, then stores it in Postgres under an access code (new or existing — see above).

## Structure

- `src/data/reportSchema.ts` — Zod schema for the report data shape (single source of truth; also the JSON schema constraint used by the parse API)
- `src/data/reportData.ts` — the default/sample report data, matching the schema (seeded into the DB via `/api/seed`)
- `src/data/constants.ts` — the sample report's fixed access code, shared by client and server
- `api/_lib/db.ts` — Postgres access: get/insert/upsert a report by UID, secure random UID generation
- `api/report.ts` / `api/report/[uid].ts` — create-or-update and fetch-by-code endpoints
- `api/parse-report.ts` — PDF → Claude → validated JSON → stored under a UID
- `api/seed.ts` — one-time endpoint to seed the sample report
- `src/state/ReportDataContext.tsx` — active report (code + data), fetched from the DB, code remembered in `localStorage`
- `src/state/useUploadReport.ts` — upload flow (encode → POST → validate → store)
- `src/screens/UidGateScreen.tsx` — the code-entry screen shown until a report is loaded
- `src/theme/tokens.ts` — colors, tone system, accent
- `src/state/useReportState.ts` — UI interaction state (tab, expanded cards, checklist, reminders, search/filters, share sheet)
- `src/screens/*` — the 5 tabs (Home, Risks, Meds, Lifestyle, Plan)
- `src/components/*` — shared UI pieces (Card, Badge, Chip, TabBar, ShareSheet, UploadSheet, etc.)
