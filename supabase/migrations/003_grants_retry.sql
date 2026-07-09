-- Retry: the 002 grants may have been rolled back when a colliding
-- migration filename caused the whole db push batch to fail atomically.
-- Re-apply as its own clean migration to confirm.

grant usage on schema public to anon, authenticated;
grant select on coffees, passports to anon, authenticated;
grant insert on reservations to anon, authenticated;
grant insert on qr_scan_events, reorder_events to anon, authenticated;
grant select, insert, update, delete on cellar_items to authenticated;
grant select, update on profiles to authenticated;
grant insert on profiles to authenticated, service_role;
