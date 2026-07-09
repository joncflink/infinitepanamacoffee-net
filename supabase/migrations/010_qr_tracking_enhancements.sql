-- Adds passport_number (denormalized text, mirrors passports.passport_number)
-- to both event tables so events are queryable without a join, and extends
-- reorder_events.action to allow whatsapp_clicked (generic WhatsApp contact
-- CTAs, distinct from the more specific reserve/reorder/join actions which
-- also happen to link to wa.me).

alter table qr_scan_events add column if not exists passport_number text;
alter table reorder_events add column if not exists passport_number text;

-- Drop whatever the existing action check constraint is actually named
-- (default Postgres naming for an inline `column check(...)` is
-- `<table>_<column>_check`, but don't rely on that guess — find it by
-- introspecting pg_constraint instead) and recreate it with the new value.
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
    'whatsapp_clicked'
  ));
