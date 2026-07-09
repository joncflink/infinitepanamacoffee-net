-- Explicit table privileges for anon/authenticated roles. RLS policies
-- constrain *which* rows are visible/writable, but the role still needs
-- the underlying GRANT to attempt the operation at all.

grant select on coffees, passports to anon, authenticated;
grant insert on reservations to anon, authenticated;
grant insert on qr_scan_events, reorder_events to anon, authenticated;
grant select, insert, update, delete on cellar_items to authenticated;
grant select, update on profiles to authenticated;
grant insert on profiles to authenticated, service_role;

alter table reservations add column if not exists quantity integer default 1;
