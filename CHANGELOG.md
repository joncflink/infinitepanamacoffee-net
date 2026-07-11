# Changelog

Newest first. Entries are terse — mechanisms are documented once in [ARCHITECTURE.md](./ARCHITECTURE.md), not repeated here.

## Phase 21 — Documentation

Added `README.md` (replacing the unedited `create-next-app` default), `ARCHITECTURE.md`, `PROJECT_STATE.md`, `NEXT_ACTIONS.md`, this changelog.

## Phase 19–20 — Tests and manual verification

Added Vitest + React Testing Library (`npm test`) covering Passport lookup, Cellar storage, navigation, and analytics fire-and-forget safety. Fixed two gaps found while writing tests and running a manual browser pass:
- `getCoffeeByPassportNumber` uppercased but never trimmed input — only worked because the one caller trimmed first. Now trims internally.
- The Passport not-found page's own title/robots metadata wasn't reliably applied when reached via a programmatic `notFound()` call; `generateMetadata` now sets it directly.

## `aa08dd7` — Accessibility

Visible focus ring on the Passport lookup input, a WCAG-AA-safe gold token for the few places gold is real text/button-label color (not just a decorative border), and a site-wide `prefers-reduced-motion` rule.

## `d83a80c` — Required error states

`localStorage` failures (disabled storage, quota exceeded) now degrade gracefully instead of crashing the Cellar. Archived coffees no longer show a live purchase CTA. Added root and Cellar-specific error boundaries — the Cellar one deliberately never links to the homepage.

## `63a24be` — Amazon label compliance default

`AMAZON_LABEL_ID_MODE` now defaults to `"lot"` (conservative) instead of `"passport"` — nothing that could reach print shows the Passport Number unless explicitly opted in, since Case 21076327341 is still open.

## `ef9e548` — Analytics

Added `product_events` tracking (8 events across the Passport-discovery / Cellar journey) via `logProductEvent`. Proposed migration `012_product_events.sql`, not applied.

## `3ea7683` — Account-sync teaser

Non-blocking, plain-text "account sync is coming soon" note on `/cellar` — no signup flow, no auth exists yet.

## `f6aae58` — CellarRepository abstraction

Split `lib/cellar.ts` into `lib/cellar/` behind a `CellarRepository` interface, so the Cellar can move off localStorage later without touching UI code. Added `SupabaseCellarRepository` as a documented, not-wired scaffold, and proposed migration `011_cellar_items_passport_number.sql`.

## `3d95d3b` — Passport lookup + Cellar rebuild

Added the "Find Your Coffee Passport™" homepage section and standalone `/passport` lookup page. Rebuilt `/cellar` with a real empty state and private-collection-style cards, fixing the underlying issue where the Cellar's only entry point silently led back to the homepage.

## Earlier

- `qr_scan_events` / `reorder_events` analytics, Supabase backend wiring.
- Infinite Coffee Passport™ page build-out: structured data, journey timeline, Founder's Notes, printable Certificate of Provenance.
- Physical label system (`components/labels/`, `/labels/*`) — front/back label components, print-accurate PDF generation, Amazon/FDA compliance checklist.
- Product data model migration from hardcoded coffee names to `data/coffees.ts` as the single canonical catalog.
- Brand identity: the infinity-mark logo, luxury visual pass, Cinzel/Montserrat typography.
