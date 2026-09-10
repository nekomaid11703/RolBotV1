-- Migration 004: Harden all backend-only tables on existing installations.
-- Requires the base schema plus migrations 001 and 003. Safe to run repeatedly.

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory FORCE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE inventory FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON SEQUENCE inventory_id_seq FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE inventory TO service_role;
GRANT ALL PRIVILEGES ON SEQUENCE inventory_id_seq TO service_role;

ALTER TABLE combat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_sessions FORCE ROW LEVEL SECURITY;

ALTER TABLE combat_sessions
  ADD COLUMN IF NOT EXISTS distance INTEGER NOT NULL DEFAULT 5 CHECK (distance >= 0);

REVOKE ALL PRIVILEGES ON TABLE combat_sessions FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE combat_sessions TO service_role;

-- The bot is the only intended client for these tables. In particular,
-- bot_auth_state contains WhatsApp signal keys, permissions and operational data.
ALTER TABLE bot_auth_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_auth_state FORCE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE players FORCE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups FORCE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members FORCE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters FORCE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE bot_auth_state, players, groups, group_members, characters
  FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE bot_auth_state, players, groups, group_members, characters
  TO service_role;

NOTIFY pgrst, 'reload schema';
