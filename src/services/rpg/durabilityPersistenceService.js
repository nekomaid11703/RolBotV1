// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { invalidateUserCache } = require("../../utils/safeQuery");

/**
 * Persistencia de durabilidad de equipamiento en `inventory.metadata`.
 *
 * Tras un Hit, el combate reduce `currentResist` en memoria. Este servicio
 * sincroniza esos cambios a la columna `metadata` de la tabla `inventory`:
 * decrementa resistencia, marca `broken` y, si es No reparable y llega a 0,
 * elimina la fila (destroyed).
 */

/**
 * Columna `metadata` de la tabla inventory (esta versión la declara siempre).
 * @constant METADATA_COLUMN
 * @type {string}
 */
const METADATA_COLUMN = "metadata";

/**
 * Persiste el estado de durabilidad de una pieza de armadura en `inventory.metadata`.
 * @param {object} options
 * @param {string} options.characterId - Personaje propietario
 * @param {string} options.creatorId - Jugador (para invalidar caché)
 * @param {string} options.itemId - Ítem perjudicado
 * @param {object} options.durability - { maxResist, currentResist, isRepairable, isBroken }
 * @returns {Promise<'updated'|'destroyed'|'unchanged'>} Resultado de la operación
 */
async function persistDurability({ characterId, creatorId, itemId, durability }) {
  const maxResist = Math.max(1, Number(durability.maxResist) || 1);
  const parsedCurrent = Number(durability.currentResist);
  const currentResist = Math.max(0, Number.isFinite(parsedCurrent) ? parsedCurrent : maxResist);
  const isRepairable = durability.isRepairable !== false;

  // Construye metadata manteniendo cualquier dato previo que no sea durabilidad.
  const existing = await readMetadata(characterId, itemId);
  const metadata = {
    ...existing,
    durability: {
      maxResist,
      currentResist,
      isRepairable,
      broken: currentResist <= 0 && isRepairable,
    },
  };

  invalidateUserCache(creatorId);

  // Ítem no reparable agotado: se destruye y se retira del inventario.
  if (currentResist <= 0 && !isRepairable) {
    const { error } = await supabase.from("inventory").delete().eq("character_id", characterId).eq("item_id", itemId);
    if (error) throw new Error(`Error destruyendo ítem: ${error.message}`);
    return "destroyed";
  }

  const payload = filterExisting("inventory", {
    [METADATA_COLUMN]: metadata,
    updated_at: new Date().toISOString(),
  });
  const { error } = await supabase
    .from("inventory")
    .update(payload)
    .eq("character_id", characterId)
    .eq("item_id", itemId);

  if (error) {
    if (/does not exist|could not find|PGRST204/.test(String(error.message || ""))) {
      return "unchanged";
    }
    throw new Error(`Error actualizando durabilidad: ${error.message}`);
  }
  return "updated";
}

async function persistArmorDurability(character, creatorId, armor) {
  const pieces = Array.isArray(armor?.list) ? armor.list : [];
  await Promise.all(
    pieces.map(async (piece) => {
      const durability = piece.instance;
      if (!durability) return;
      if (character?.dummyEquipment) {
        const row = (character.dummyEquipment.inventory || []).find((item) => item.item_id === piece.itemId);
        if (row) {
          row.metadata = {
            ...(row.metadata || {}),
            durability: {
              maxResist: durability.maxResist,
              currentResist: durability.currentResist,
              isRepairable: durability.isRepairable,
              broken: durability.isBroken,
            },
          };
        }
        return;
      }
      await persistDurability({
        characterId: character.id,
        creatorId: creatorId || "system",
        itemId: piece.itemId,
        durability,
      });
    }),
  );
}

/**
 * Lee la metadata actual de un ítem del inventario (para preservar campos ajenos).
 * @param {string|number} characterId
 * @param {string} itemId
 * @returns {Promise<object>} metadata previa ({} si no existe)
 */
async function readMetadata(characterId, itemId) {
  const { data, error } = await supabase
    .from("inventory")
    .select("metadata")
    .eq("character_id", characterId)
    .eq("item_id", itemId)
    .maybeSingle();

  if (error || !data) return {};
  return data.metadata || {};
}

module.exports = {
  persistDurability,
  persistArmorDurability,
  readMetadata,
};
