-- Migration 002: Añadir metadata de ítem e equipped_slots de personaje
-- Idempotente: utiliza IF NOT EXISTS para columnas

-- 1. Añadir columna metadata a inventory (para durabilidad, tier, material, broken)
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}' NOT NULL;

-- 2. Añadir columna equipped_slots a characters (slots de equipamiento activo)
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
  ADD COLUMN IF NOT EXISTS equipped_slots JSONB DEFAULT '{}' NOT NULL;

-- 3. Índice para búsquedas por equipped_slots (opcional, para futuras queries)
CREATE INDEX IF NOT EXISTS idx_characters_equipped_slots ON characters USING GIN (equipped_slots);
