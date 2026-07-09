create table if not exists rls_diag_test (
  id uuid primary key default gen_random_uuid(),
  note text
);
alter table rls_diag_test enable row level security;
grant insert on rls_diag_test to anon, authenticated;
create policy "anyone can insert diag" on rls_diag_test for insert with check (true);
