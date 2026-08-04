-- Migration 003: Remediación sistema de ítems y equipamiento
-- 1. Añade columna metadata a inventory (durabilidad, tier, material, broken)
-- 2. Añade columna equipped_slots a characters (slots de equipamiento activo)
-- 3. Crea tabla combat_sessions (persistencia de sesiones de combate)
-- Idempotente: utiliza IF NOT EXISTS en columnas y tabla.

-- 1. Metadata de ítem en inventory (durabilidad, tier, material, broken)
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}';

-- 2. Slots de equipamiento activo en characters
-- Estructura JSONB:
-- {
--   "cabeza": null | "item_id",
--   "pecho": null | "item_id",
--   "pantalones": null | "item_id",
--   "botas": null | "item_id",
--   "mano_der": null | "item_id",
--   "mano_izq": null | "item_id",
--   "artefacto_1": null | "item_id",
--   "artefacto_2": null | "item_id",
--   "artefacto_3": null | "item_id",
--   "artefacto_4": null | "item_id"
-- }
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS equipped_slots JSONB NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_characters_equipped_slots
  ON characters USING GIN (equipped_slots);

-- 3. Tabla combat_sessions (misma DDL que schemaMigration.TABLE_CREATE_SQL)
CREATE TABLE IF NOT EXISTS combat_sessions (
  "id" TEXT PRIMARY KEY,
  "is_pve" BOOLEAN DEFAULT false,
  "challenger" JSONB NOT NULL,
  "defender" JSONB NOT NULL,
  "current_turn_char_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'waiting_action',
  "pending_attack" JSONB,
  "created_at" BIGINT NOT NULL,
  "last_turn_at" BIGINT NOT NULL,
  "winner_id" TEXT,
  "rounds" INTEGER DEFAULT 0
);

GRANT ALL ON TABLE combat_sessions TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
