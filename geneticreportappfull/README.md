# Genetic Report — PWA

A mobile-first progressive web app for viewing a genetic test report: health risks, medications (pharmacogenomics), lifestyle traits, and an action plan. Implemented from the `Genetic Report App.dc.html` design (see `../chats/chat1.md` and `../README.md` for design intent).

Built with React + TypeScript + Vite, installable as a PWA (`vite-plugin-pwa`). Report data defaults to hardcoded sample data (`src/data/reportData.ts`) but can be replaced by uploading a real PDF report in-app — see "PDF upload" below.

## Develop

```bash
npm install
npm run dev
```

`/api/parse-report` (the PDF-upload endpoint) only runs under `vercel dev` or on a real Vercel deployment — plain `vite dev` serves the frontend only, so the Upload flow will fail locally unless you also have `ANTHROPIC_API_KEY` set and run via `vercel dev`.

## Build

```bash
npm run build
npm run preview
```

## PDF upload

The Home screen's "Upload New Report" button POSTs a base64-encoded PDF to `/api/parse-report`, a Vercel serverless function that calls the Anthropic API (`claude-opus-4-8`) with the PDF as a native document input and a schema-constrained structured-output request, returning JSON validated against `src/data/reportSchema.ts`. The result replaces the active report data (persisted to `localStorage`) — no backend database.

**Requires `ANTHROPIC_API_KEY` to be set as an Environment Variable in the Vercel project settings** (Project → Settings → Environment Variables). Without it, `/api/parse-report` returns a 500.

## Structure

- `src/data/reportSchema.ts` — Zod schema for the report data shape (single source of truth; also the JSON schema constraint used by the parse API)
- `src/data/reportData.ts` — the default/sample report data, matching the schema
- `api/parse-report.ts` — Vercel serverless function: PDF → Claude → validated JSON
- `src/state/ReportDataContext.tsx` — active report data (localStorage-backed), consumed by all screens
- `src/state/useUploadReport.ts` — upload flow (encode → POST → validate → store)
- `src/theme/tokens.ts` — colors, tone system, accent
- `src/state/useReportState.ts` — UI interaction state (tab, expanded cards, checklist, reminders, search/filters, share sheet)
- `src/screens/*` — the 5 tabs (Home, Risks, Meds, Lifestyle, Plan)
- `src/components/*` — shared UI pieces (Card, Badge, Chip, TabBar, ShareSheet, UploadSheet, etc.)
