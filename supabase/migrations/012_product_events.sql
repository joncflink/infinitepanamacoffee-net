-- PROPOSED — not applied to any Supabase project yet. Written to document
-- what lib/supabase/track.ts's logProductEvent() assumes exists. Until this
-- runs against the project, every logProductEvent() call fails silently
-- (caught, logged, never thrown) — see that file's fire-and-forget contract.
--
-- Separate from qr_scan_events (QR-scan page views) and reorder_events
-- (CTA link clicks): this table covers the passport-discovery / Cellar
-- journey — passport lookups, Cellar adds/removes/views, and the two
-- Cellar-adjacent link clicks. No personal data: just the event, the
-- Passport Number involved (when there is one), where in the app it
-- happened, and device type — same minimal shape as the two tables above.

create table product_events (
  id uuid primary key default gen_random_uuid(),
  event text not null
    check (event in (
      'passport_lookup_started',
      'passport_lookup_success',
      'passport_lookup_not_found',
      'cellar_item_added',
      'cellar_item_removed',
      'cellar_viewed',
      'passport_reorder_clicked',
      'find_another_passport_clicked'
    )),
  passport_number text,
  source text,
  device_type text,
  created_at timestamptz default now()
);

alter table product_events enable row level security;

-- public insert allowed, public read denied — matches qr_scan_events and
-- reorder_events (migration 001).
create policy "anyone can log a product event"
  on product_events for insert
  with check (true);
