-- PROPOSED — not applied to any Supabase project yet. Same convention as
-- migrations 011/012/013: written to document what the app now assumes,
-- reviewed and applied deliberately rather than silently.
--
-- Adds "amazon_launch_list_clicked" to reorder_events.action — the action
-- TrackedAmazonLink (components/TrackedAmazonLink.tsx, via
-- data/coffees.ts's getAmazonCta) fires when a coffee is Amazon-approval-
-- gated (amazonApprovalRequired true, amazonApprovalStatus not "approved")
-- and the CTA links to a WhatsApp launch-list signup instead of any Amazon
-- URL. Existing values are kept, same non-destructive approach as
-- migrations 010/013.

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
    'amazon_storefront_fallback',
    'amazon_launch_list_clicked'
  ));
