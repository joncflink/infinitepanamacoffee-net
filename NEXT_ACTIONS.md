# Next Actions

Concrete pending items. Background/rationale for each lives in [ARCHITECTURE.md](./ARCHITECTURE.md) and [PROJECT_STATE.md](./PROJECT_STATE.md) — this is just the list.

## Waiting on external input

- [ ] Get Amazon's written confirmation under Case 21076327341 (Passport Number on the bag, and the QR insert). Nothing should be built or printed as "approved" before this arrives.

## Ready to do, needs a deliberate go-ahead

- [ ] Apply `supabase/migrations/012_product_events.sql` to the production Supabase project to activate `product_events` analytics (currently firing but failing silently).
- [ ] Apply `supabase/migrations/011_cellar_items_passport_number.sql` if/when work on the Supabase-backed Cellar begins.

## Requires real design/build work first

- [ ] Build real authentication before `lib/cellar/supabaseCellarRepository.ts` can be switched on — see ARCHITECTURE.md's Supabase migration path for the full sequence (auth → migration 011 → RLS review → flip `lib/cellar/index.ts`).
- [ ] Add `app/sitemap.ts` (and optionally `app/robots.ts`) so individual Passport pages have a real discovery path for search engines, not just crawl-from-links. Flagged during the Phase 15 SEO pass, not yet built.

## Housekeeping

- [ ] Re-run the mobile-viewport manual check with a working screenshot tool once available, to get a visual (not just layout-metrics) confirmation — the underlying check (no horizontal overflow at 375px) already passed.
