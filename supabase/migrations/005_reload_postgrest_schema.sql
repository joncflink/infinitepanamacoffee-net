-- PostgREST caches the schema/role/policy graph and doesn't always pick up
-- DDL applied outside the dashboard without an explicit nudge.
notify pgrst, 'reload schema';
