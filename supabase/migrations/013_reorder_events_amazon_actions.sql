-- PROPOSED — not applied to any Supabase project yet. Same convention as
-- migrations 011/012: written to document what the app now assumes,
-- reviewed and applied deliberately rather than silently.
--
-- Adds "amazon_product" and "amazon_storefront_fallback" to
-- reorder_events.action — the two actions TrackedAmazonLink
-- (components/TrackedAmazonLink.tsx, via data/coffees.ts's getAmazonCta)
-- fires depending on whether a coffee/size has a real Amazon listing or
-- falls back to AMAZON_STOREFRONT_URL. Existing values are kept, including
-- "amazon_clicked" (no longer fired by anything, kept so historical rows
-- already using it stay valid) — same non-destructive approach migration
-- 010 used when it added "whatsapp_clicked".

do $$
declare
  con record;
begin
  for con in
    select conname
    from pg_constraint
    where conrelid = 'reorder_events'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%action%'
  loop
    execute format('alter table reorder_events drop constraint %I', con.conname);
  end loop;
end $$;

alter table reorder_events add constraint reorder_events_action_check
  check (action in (
    'reserve_clicked',
    'reorder_clicked',
    'join_next_harvest_clicked',
    'amazon_clicked',
    'whatsapp_clicked',
    'amazon_product',
    'amazon_storefront_fallback'
  ));
