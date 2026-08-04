-- Migration 001: Create inventory table
-- Relacionada a characters.id con FK y ON DELETE CASCADE
-- RLS habilitado sin políticas: solo service_role (backend) tiene acceso

CREATE TABLE IF NOT EXISTS inventory (
  id BIGSERIAL PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (character_id, item_id)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory FORCE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_inventory_character_id ON inventory(character_id);

-- The bot uses service_role; client-facing roles must not reach inventory directly.
REVOKE ALL PRIVILEGES ON TABLE inventory FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON SEQUENCE inventory_id_seq FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE inventory TO service_role;
GRANT ALL PRIVILEGES ON SEQUENCE inventory_id_seq TO service_role;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inventory_updated_at ON inventory;
CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_updated_at();

NOTIFY pgrst, 'reload schema';
