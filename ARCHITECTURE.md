# Architecture

Technical reference for how Infinite Panama Coffee's Infinite Coffee Passport™ / My Infinite Cellar™ experience actually works. This is the single source of truth for these mechanisms — other docs (`README.md`, `PROJECT_STATE.md`, `NEXT_ACTIONS.md`, `CHANGELOG.md`) link here rather than re-explaining them.

Stack: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Supabase (analytics only — see below), Vitest + React Testing Library.

## Route map

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, "Find Your Coffee Passport™" lookup, brand sections |
| `/passport` | Standalone Passport lookup page (same form as the homepage) |
| `/passport/[passportNumber]` | The Infinite Coffee Passport™ page for one coffee |
| `/cellar` | My Infinite Cellar™ — the visitor's saved coffees |
| `/coffee/[slug]` | **Legacy compatibility redirect** — permanently redirects to `/passport/[passportNumber]?source=legacy_redirect`. Preserved for old links/QR codes printed before the Passport system existed. Do not remove. |
| `/founders-letter`, `/privacy`, `/terms` | Static content pages |
| `/labels/*`, `/qr-test` | **Internal only** — label-proofing and QR-generation tooling for print production, not part of the customer site |

## Passport lookup flow

Canonical data source: `data/coffees.ts`. There is exactly one coffee catalog — do not create a second one. All lookups go through `getCoffeeByPassportNumber(passportNumber)`:

```ts
export function getCoffeeByPassportNumber(passportNumber: string): Coffee | undefined {
  if (!passportNumber) return undefined;
  const normalized = passportNumber.trim().toUpperCase();
  if (!normalized) return undefined;
  return coffees.find((c) => c.passportNumber === normalized);
}
```

It trims and uppercases, so lowercase input and stray whitespace both resolve correctly. It matches only on the permanent public `passportNumber` string (e.g. `"IPC-000001"`) — never on `coffee.id`, which is an internal uuid that is never shown publicly, never put in a URL, and cannot be used to look anything up.

Two entry points call it:

- **`components/PassportLookupForm.tsx`** (used on `/` and `/passport`) — the manual-entry UI. On submit: normalizes input, calls `getCoffeeByPassportNumber`, and either `router.push`es to `/passport/[passportNumber]` or shows an inline, screen-reader-announced error (`role="alert"`, `aria-invalid`, `aria-describedby`). Fires `passport_lookup_started` / `_success` / `_not_found` analytics events (see below).
- **`app/passport/[passportNumber]/page.tsx`** — the actual Passport page. Calls the same function directly from the URL segment; a miss calls `notFound()`, which renders `app/passport/[passportNumber]/not-found.tsx` (branded, never a raw 404 or blank page). `generateMetadata` also sets the not-found page's title/robots directly, because a `not-found.tsx` segment's own metadata export isn't reliably applied when reached via a programmatic `notFound()` call from an already-matched dynamic route.

### Legacy Passport handling

`Coffee.legacyPassport?: boolean` marks passports assigned before the sequential `IPC-000001`-style numbering scheme existed — today just Altura's `IPC-ALT-001`. Legacy passport numbers are permanently grandfathered: never rewritten, never redirected, never used as a model for new numbers (`getNextPassportNumber()` ignores them). They resolve through the exact same `getCoffeeByPassportNumber` path as any other passport — no special-cased lookup logic.

## My Infinite Cellar™ — localStorage behavior

v1 storage is the visitor's own browser: no accounts, no backend. Behind a repository abstraction so this can change later without touching UI code:

- **`lib/cellar/types.ts`** — `CellarRepository` interface (`list`, `add`, `remove`, `subscribe`, `getServerSnapshot`), kept synchronous to match React's `useSyncExternalStore`.
- **`lib/cellar/localCellarRepository.ts`** — the live implementation. Persists to `localStorage` key `infinite-cellar:v1` as a minimal array: `{ passportNumber: string; addedAt: string }[]`. Keyed and deduplicated strictly by `passportNumber` — adding the same passport twice is a no-op, never a second entry. All raw `localStorage` calls are wrapped in `try/catch`: if storage is unavailable (disabled by browser policy, quota exceeded), reads degrade to an empty Cellar and writes log-and-no-op, rather than crashing.
- **`lib/cellar/index.ts`** — exports `cellarRepository`, currently bound to `localCellarRepository`. Swapping storage backends later is changing this one line.
- **`components/CellarProvider.tsx`** — the only thing that reads/writes through `cellarRepository`. Rehydrates the minimal persisted shape into a full `SavedCoffee` view (name, collection, process, harvest, status, size options, etc.) by looking each `passportNumber` up in the canonical `data/coffees.ts` at render time — the Cellar never stores a stale copy of data that can change.
- **`components/CellarView.tsx`** — the `/cellar` UI. Renders a private-collection-style card per saved coffee (never a generic ecommerce grid), or a branded empty state with two non-homepage CTAs ("Find a Coffee Passport", "Explore Current Collection"). Includes a plain-text, non-interactive account-sync teaser (see Current limitations) — no signup flow.

### Future Supabase migration path

**Not wired in.** `lib/cellar/supabaseCellarRepository.ts` is a documented scaffold implementing the same `CellarRepository` interface, backed by an in-memory cache hydrated asynchronously from Supabase (to satisfy the interface's synchronous contract) with optimistic add/remove and fire-and-forget writes. To actually switch to it:

1. Build real authentication (sign-in/sign-up, session persistence, sign-out). Phase 8/9 of this build explicitly required the Cellar to work fully without forcing account creation — that constraint stays true until this step happens.
2. Apply `supabase/migrations/011_cellar_items_passport_number.sql` (proposed, not run against any database) — adds a denormalized `passport_number text` column to `cellar_items`, because the table's existing `coffee_id`/`passport_id` uuid foreign keys point at `coffees`/`passports` tables this app never populates (it uses `data/coffees.ts` instead).
3. Review the `cellar_items` RLS policies (migration 001) against the real auth flow — not just read them.
4. Change `lib/cellar/index.ts`'s `cellarRepository` export from `localCellarRepository` to `supabaseCellarRepository`.

Until all four happen, static data (`data/coffees.ts`) and `localStorage` remain the rendering/storage source of truth — this is a deliberate, current decision, not an oversight.

## Analytics events

Three separate Supabase tables, three separate concerns, all fire-and-forget (`lib/supabase/track.ts` and `components/QrScanLogger.tsx`). Every insert is wrapped in `try/catch`, and the async result is checked via `.then(({ error }) => ...)` — a tracking failure is logged to the console, never thrown, and never blocks the customer action it's attached to (verified live: adding to Cellar, viewing the Cellar, and navigating all work correctly even when the insert 404s).

| Table | What it's for | Status |
|---|---|---|
| `qr_scan_events` | QR-code passport-page views (device type, source, referrer) | Live |
| `reorder_events` | CTA link clicks — `reserve_clicked`, `reorder_clicked`, `join_next_harvest_clicked`, `amazon_clicked`, `whatsapp_clicked` | Live |
| `product_events` | Passport-discovery / Cellar journey: `passport_lookup_started`, `passport_lookup_success`, `passport_lookup_not_found`, `cellar_item_added`, `cellar_item_removed`, `cellar_viewed`, `passport_reorder_clicked`, `find_another_passport_clicked` | **Proposed** — `supabase/migrations/012_product_events.sql` is written but not applied to any database. Every call fails silently until it is. |

No personal data in any of the three: event/action name, the Passport Number involved (when relevant), a short `source` string, and device type (mobile/tablet/desktop, from a UA-sniff helper in `lib/supabase/track.ts`).

## Amazon compliance boundaries

Governed by `components/labels/constants.ts`, distinct from the website's own design tokens. Two things are locked, one is pending:

- **Locked, not open for interpretation:** the Amazon-bound physical label (`components/labels/FrontLabel.tsx`, `BackLabel.tsx`) never has a QR code, a QR placeholder, an external Passport URL, or scan language. Confirmed by reading the actual render code, not just comments.
- **Pending Amazon's written response, Case 21076327341:** whether the static Passport Number itself may appear on the bag. `AMAZON_LABEL_ID_MODE` (env var `AMAZON_LABEL_ID_MODE`) controls this — it defaults to `"lot"` (bare Lot Number only, the conservative fallback) unless explicitly set to `"passport"`. The default is deliberately safe: nothing that could reach print shows the Passport Number unless someone opts in on purpose.
- **Also pending the same case:** a physical QR insert (a card/slip inside the bag, separate from the label itself) has been discussed but has no component or asset in this codebase. Do not build or print it as approved until written confirmation arrives.

The website itself is unrestricted by these Amazon-specific rules — Passport lookup via normal navigation, the printable Certificate of Provenance's QR code (on `/passport/[passportNumber]`, print-only), etc. are all fine; only the physical Amazon package is constrained.

## Testing

`npm test` runs the Vitest suite (`npm run test:watch` for watch mode). Config: `vitest.config.ts` (jsdom environment, `@/*` path alias matching `tsconfig.json`), `vitest.setup.ts` (jest-dom matchers).

- `data/coffees.test.ts` — Passport lookup: valid current/legacy passport, case-insensitivity, whitespace normalization, malformed/unknown input, uuid-is-never-a-valid-key.
- `lib/cellar/localCellarRepository.test.ts` — empty Cellar, add, duplicate prevention, remove, no-op remove, persistence (raw localStorage read, not just the in-memory cache), malformed-entry resilience.
- `lib/supabase/track.test.ts` — analytics never throw even when Supabase is unavailable; failures are logged; device-type detection.
- `components/CellarView.test.tsx` — empty state, saved-item rendering with a correct `/passport/[passportNumber]` link, remove wiring, no homepage links anywhere in the empty state.
- `components/home/SiteFooter.test.tsx` — Cellar nav → `/cellar`, Passport nav → `/passport`, neither → `/`.

## Current limitations

See `PROJECT_STATE.md` for the up-to-date status of each of these; this list is just what exists structurally today:

- No authentication — the Cellar is per-browser only, not synced across devices (the account-sync teaser in `CellarView.tsx` is UI copy only, nothing behind it).
- `product_events` (analytics) and the `cellar_items.passport_number` column (future Supabase Cellar migration) are both proposed-but-unapplied migrations.
- No `sitemap.xml` or `robots.txt` — page-level `robots` metadata (e.g. `/cellar`'s `noindex, nofollow`) is correct, but search engines have no sitemap to discover individual Passport pages faster than by crawling.
- Sample coffee records (`sampleCoffees` in `data/coffees.ts`, `SAMPLE-00x` passport numbers) exist only for label-system development and are deliberately unreachable from any public route.
