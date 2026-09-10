-- Migration 006: Allow independent stacks of the same item.
--
-- `metadata` contains state that changes an item's gameplay identity (tier,
-- durability, material). A unique (character_id, item_id) constraint merges
-- those identities and corrupts partial refinements and equipment state.

BEGIN;

ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS variant_key TEXT;

-- Preserve every existing row under a deterministic variant. New writes use a
-- tier or instance key, while old rows remain addressable as legacy variants.
UPDATE inventory
SET variant_key = COALESCE(
  NULLIF(metadata ->> 'variantKey', ''),
  CASE
    WHEN NULLIF(metadata ->> 'tier', '') IS NOT NULL THEN 'tier:' || (metadata ->> 'tier')
    ELSE 'legacy'
  END
)
WHERE variant_key IS NULL OR variant_key = '';

ALTER TABLE inventory
  ALTER COLUMN variant_key SET NOT NULL,
  ALTER COLUMN variant_key SET DEFAULT 'legacy';

ALTER TABLE inventory
  DROP CONSTRAINT IF EXISTS inventory_character_id_item_id_key;

ALTER TABLE inventory
  ADD CONSTRAINT inventory_character_id_item_id_variant_key_key
  UNIQUE (character_id, item_id, variant_key);

CREATE INDEX IF NOT EXISTS idx_inventory_character_item_variant
  ON inventory (character_id, item_id, variant_key);

NOTIFY pgrst, 'reload schema';

COMMIT;
