-- Migration 003: Harden inventory access on existing installations.
-- Idempotent: PostgreSQL accepts repeated RLS, REVOKE and GRANT statements.

ALTER TABLE IF EXISTS inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory FORCE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE inventory FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON SEQUENCE inventory_id_seq FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE inventory TO service_role;
GRANT ALL PRIVILEGES ON SEQUENCE inventory_id_seq TO service_role;

NOTIFY pgrst, 'reload schema';
