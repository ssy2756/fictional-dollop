# Genetic Report — PWA

A mobile-first progressive web app for viewing a genetic test report: health risks, medications (pharmacogenomics), lifestyle traits, and an action plan. Implemented from the `Genetic Report App.dc.html` design (see `../chats/chat1.md` and `../README.md` for design intent).

Built with React + TypeScript + Vite, installable as a PWA (`vite-plugin-pwa`). Report data in `src/data/reportData.ts` is hardcoded sample data — no real PDF parsing yet.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/data/reportData.ts` — mock report data (monogenic/polygenic/carrier/secondary findings, pharmacogenomics, lifestyle traits, screening plan)
- `src/theme/tokens.ts` — colors, tone system, accent
- `src/state/useReportState.ts` — all interactive state (tab, expanded cards, checklist, reminders, search/filters, share sheet)
- `src/screens/*` — the 5 tabs (Home, Risks, Meds, Lifestyle, Plan)
- `src/components/*` — shared UI pieces (Card, Badge, Chip, TabBar, ShareSheet, etc.)
