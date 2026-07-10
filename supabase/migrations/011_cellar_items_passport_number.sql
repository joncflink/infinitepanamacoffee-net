-- PROPOSED — not applied to any Supabase project yet. Written to document
-- what SupabaseCellarRepository (lib/cellar/supabaseCellarRepository.ts,
-- not wired into the app) assumes exists. Do not run this against
-- production without re-reviewing RLS and auth alongside it (Phase 8).
--
-- cellar_items (migration 001) keys a row to a coffee via coffee_id /
-- passport_id, uuid foreign keys into the `coffees` / `passports` tables.
-- Those tables are unused — this app's canonical coffee record lives in
-- data/coffees.ts, addressed by the permanent public passportNumber string
-- (e.g. "IPC-000001"), not a Supabase-side uuid. qr_scan_events and
-- reorder_events hit this same mismatch and were fixed the same way, by
-- migration 010: add a denormalized passport_number text column instead of
-- resolving through the unpopulated FK tables. This does the same for
-- cellar_items.

alter table cellar_items add column if not exists passport_number text;
