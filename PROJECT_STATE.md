# Project State

Snapshot of what's actually live vs. pending, as of 2026-07-11. Mechanisms are documented once in [ARCHITECTURE.md](./ARCHITECTURE.md) — this file only tracks status.

## Live in production (infinitepanamacoffee.com)

- Homepage, Passport lookup (`/passport`), individual Passport pages (`/passport/[passportNumber]`), My Infinite Cellar™ (`/cellar`).
- Legacy `/coffee/[slug]` redirect and legacy Passport `IPC-ALT-001` (Altura) both preserved and working.
- Cellar: add / view / remove, localStorage-backed, duplicate-safe, degrades gracefully if storage is unavailable.
- `qr_scan_events` and `reorder_events` analytics — live, recording real data.
- Amazon label compliance defaults: `AMAZON_LABEL_ID_MODE` defaults to `"lot"` (Passport Number never shown on the physical bag unless explicitly opted in).
- SEO metadata: `/passport` and individual Passport pages are indexable with the required title formats; `/cellar` is `noindex, nofollow`; not-found Passport pages are `noindex, follow` with a correct title.
- Accessibility: visible keyboard focus states, WCAG-AA-safe color contrast on all real text/button-label uses of the gold accent, `prefers-reduced-motion` respected site-wide, no color-only status indicators.
- Root and Cellar-specific error boundaries (`app/error.tsx`, `app/cellar/error.tsx`) — no blank pages or raw stack traces on an unexpected render error; the Cellar boundary never offers a homepage link.
- Automated test suite (`npm test`) covering Passport lookup, Cellar storage, navigation, and analytics fire-and-forget safety.

## Built but not wired to production

- **`product_events` analytics** (`lib/supabase/track.ts`'s `logProductEvent`, called from 8 places across the Passport/Cellar journey) — the code is live and firing, but `supabase/migrations/012_product_events.sql` (the table it writes to) has not been applied to any Supabase project. Every call currently fails silently and is logged, by design — this is safe, not broken.
- **`SupabaseCellarRepository`** (`lib/cellar/supabaseCellarRepository.ts`) — a complete scaffold for an account-backed Cellar, not imported or used anywhere. Requires real auth + an RLS review + `supabase/migrations/011_cellar_items_passport_number.sql` before it could be switched on. See ARCHITECTURE.md's migration path.
- **Amazon Passport Number on the bag, and the QR insert** — both pending Amazon's written response under Case 21076327341. Nothing here is a code gap; it's a business/legal blocker, not a technical one.

## Known limitations

- No authentication anywhere in the app — the Cellar cannot sync across a customer's devices. The account-sync teaser shown in `/cellar` is copy only.
- No `sitemap.xml` or `robots.txt`. Individual Passport pages have no discovery path for search engines beyond crawling from the few pages that link to them.
- The label-preview dev server used throughout development occasionally accumulated stale Turbopack state after many structural file changes in one long-running session — resolved by restarting it. Not a production concern (Vercel always builds fresh).
- Browser screenshot capture was intermittently unavailable during the most recent verification pass; that pass relied on the accessibility-tree snapshot and computed-style inspection instead, which covered the same ground but without a visual screenshot artifact.

## Case tracking

- **Amazon Case 21076327341** — open, no written confirmation yet. Governs both the Passport-Number-on-bag question and the QR insert. See ARCHITECTURE.md → Amazon compliance boundaries.
