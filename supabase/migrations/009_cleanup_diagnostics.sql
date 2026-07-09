-- Root cause found: anon insert into `reservations` only fails RLS when the
-- request also asks for the row back (Prefer: return=representation /
-- supabase-js `.select()`), because RETURNING requires a SELECT policy and
-- `reservations` intentionally has none for anon/authenticated. Plain
-- inserts (return=minimal, i.e. supabase-js `.insert()` without `.select()`)
-- succeed. No RLS/grant change needed — just drop the diagnostic scaffolding
-- from migrations 004-008.

drop function if exists public.debug_reservations_policies();
drop function if exists public.debug_whoami();
drop table if exists rls_diag_test;
