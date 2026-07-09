-- Temporary diagnostic RPC to inspect actual policy state via PostgREST
-- (pg_catalog isn't exposed to the REST API directly). Drop this once the
-- RLS issue is resolved.
create or replace function public.debug_reservations_policies()
returns table (
  policyname text,
  permissive text,
  roles text,
  cmd text,
  qual text,
  with_check text
)
language sql
security definer
set search_path = public
as $$
  select policyname, permissive, roles::text, cmd, qual, with_check
  from pg_policies
  where tablename = 'reservations';
$$;

grant execute on function public.debug_reservations_policies() to anon, authenticated;
