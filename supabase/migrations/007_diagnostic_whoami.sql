create or replace function public.debug_whoami()
returns table (current_role_name text, session_user_name text, jwt_role text)
language sql
security invoker
as $$
  select current_user::text, session_user::text, auth.jwt() ->> 'role';
$$;

grant execute on function public.debug_whoami() to anon, authenticated;
