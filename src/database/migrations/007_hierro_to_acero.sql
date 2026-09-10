-- Migration 007: Remapear la familia legacy de hierro al canon (acero).
--
-- El canon B8 eliminó el material `hierro`; su familia (espada/casco/pechera/
-- grebas/botas/amuleto/kunai) se sustituye por las familias canónicas de acero
-- (`*_de_acero`). Los ítems ya entregados se renombran en `inventory` y en el
-- JSONB `equipped_slots` de `characters` para no dejar ids huérfanos.

BEGIN;

-- ── inventory ────────────────────────────────────────────────────────────────
UPDATE inventory SET item_id = 'espada_de_acero'  WHERE item_id = 'espada_de_hierro';
UPDATE inventory SET item_id = 'casco_de_acero'   WHERE item_id = 'casco_de_hierro';
UPDATE inventory SET item_id = 'pechera_de_acero' WHERE item_id = 'pechera_de_hierro';
UPDATE inventory SET item_id = 'grebas_de_acero'  WHERE item_id = 'grebas_de_hierro';
UPDATE inventory SET item_id = 'botas_de_acero'   WHERE item_id = 'botas_de_hierro';
UPDATE inventory SET item_id = 'amuleto_de_acero' WHERE item_id = 'amuleto_de_hierro';
UPDATE inventory SET item_id = 'kunai_de_acero'   WHERE item_id = 'kunai_de_hierro';

-- Limpia la referencia residual al material en metadata (si existe) para que
-- la ficha del ítem no muestre un material fuera de canon.
UPDATE inventory
SET metadata = jsonb_set(COALESCE(metadata, '{}'), '{material}', '"acero"')
WHERE item_id IN (
  'espada_de_acero', 'casco_de_acero', 'pechera_de_acero',
  'grebas_de_acero', 'botas_de_acero', 'amuleto_de_acero', 'kunai_de_acero'
)
AND COALESCE(metadata ->> 'material', '') = 'hierro';

-- ── equipped_slots (characters.equipped_slots JSONB) ─────────────────────────
-- Renombra el valor de cualquier slot que apunte a un id legacy de hierro.
UPDATE characters
SET equipped_slots = (
  SELECT COALESCE(
    jsonb_object_agg(e.slot, to_jsonb(
      CASE
        WHEN e.item_id = 'espada_de_hierro'  THEN 'espada_de_acero'
        WHEN e.item_id = 'casco_de_hierro'   THEN 'casco_de_acero'
        WHEN e.item_id = 'pechera_de_hierro' THEN 'pechera_de_acero'
        WHEN e.item_id = 'grebas_de_hierro'  THEN 'grebas_de_acero'
        WHEN e.item_id = 'botas_de_hierro'   THEN 'botas_de_acero'
        WHEN e.item_id = 'amuleto_de_hierro' THEN 'amuleto_de_acero'
        WHEN e.item_id = 'kunai_de_hierro'   THEN 'kunai_de_acero'
        ELSE e.item_id
      END
    )),
    '{}'::jsonb
  )
  FROM jsonb_each_text(characters.equipped_slots) AS e(slot, item_id)
)
WHERE equipped_slots ?| ARRAY[
  'espada_de_hierro', 'casco_de_hierro', 'pechera_de_hierro',
  'grebas_de_hierro', 'botas_de_hierro', 'amuleto_de_hierro', 'kunai_de_hierro'
];

NOTIFY pgrst, 'reload schema';

COMMIT;
