// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { getEquippedSlots } = require("./equipmentService");
const { getCategory } = require("../../data/itemCategories");
const { getItem } = require("../../data/items");
const { getWeaponStats, getArmorStats, getArtifactStats } = require("./itemStatService");
const { resolveSetBonuses, getCoverage } = require("./armorSetService");
const { ARMOR_SETS } = require("../../data/armorSets");

/**
 * Servicio de resolución de equipamiento → payload de combate.
 *
 * Cruza `characters.equipped_slots` con `inventory.metadata` para producir los
 * insumos que espera `combatEngine` (weaponInfo / armorDurability) y los bonos
 * pasivos de artefactos. Backward-compat: sin arma ⇒ `weaponInfo = null`.
 */

/**
 * Obtiene el inventario incluyendo la columna metadata (necesaria para
 * durabilidad). Puede devolver [] si el esquema no la expone.
 * @param {string|number} characterId
 * @returns {Promise<Array<object>>} Filas: [{ item_id, quantity, metadata }]
 */
async function getInventoryWithMetadata(characterId) {
  const { data, error } = await supabase
    .from("inventory")
    .select("item_id, quantity, metadata")
    .eq("character_id", characterId)
    .order("item_id", { ascending: true });

  if (error) return [];
  return data || [];
}

/**
 * Convierte el equipo en memoria de un dummy (`dummyEquipment`) a las mismas
 * entradas que `getEquippedItems` produce para la DB.
 * @param {{slots: object, inventory: Array<object>}} dummy - dummyEquipment
 * @returns {Array<{slot: string, itemId: string, def: object|null, row: object|null}>}
 */
function buildEntriesFromDummy(dummy) {
  const entries = [];
  for (const [slot, itemId] of Object.entries(dummy?.slots || {})) {
    if (!itemId) continue;
    if (String(itemId).startsWith("__2h:")) continue;
    const def = getItem(itemId);
    const row = (dummy?.inventory || []).find((r) => r.item_id === itemId) || null;
    entries.push({ slot, itemId, def, row });
  }
  return entries;
}

/**
 * Une el mapa de slots con las filas del inventario que los ocupan.
 * Acepta un character (objeto) o un characterId. Si el personaje expone
 * `dummyEquipment` (bot PvE), resuelve 100% en memoria sin consultar la DB.
 * @param {object|string|number} characterOrId - Personaje o ID
 * @returns {Promise<Array<{slot: string, itemId: string, def: object|null, row: object|null}>>}
 */
async function getEquippedItems(characterOrId) {
  if (characterOrId && typeof characterOrId === "object" && characterOrId.dummyEquipment) {
    return buildEntriesFromDummy(characterOrId.dummyEquipment);
  }

  const characterId = characterOrId && typeof characterOrId === "object" ? characterOrId.id : characterOrId;
  const slots = await getEquippedSlots(characterId);
  const inventory = await getInventoryWithMetadata(characterId);

  const entries = [];
  for (const [slot, itemId] of Object.entries(slots || {})) {
    if (!itemId) continue;
    // Marcador interno de arma a 2 manos: no expone ítem duplicado.
    if (String(itemId).startsWith("__2h:")) continue;

    const def = getItem(itemId);
    const row = inventory.find((r) => r.item_id === itemId) || null;
    entries.push({ slot, itemId, def, row });
  }
  return entries;
}

/**
 * Resuelve el arma equipada del atacante a insumos de combate.
 * @param {object} character - Personaje atacante
 * @param {Array<object>} [equipped] - Salida de getEquippedItems (opcional, evita doble query)
 * @returns {Promise<object|null>} { damageNature, tier, baseDamage, hands, weaponRange } | null
 */
async function resolveAttackerWeapon(character, equipped = null) {
  const items = equipped || (await getEquippedItems(character));

  // Usar el slot de mano derecha; si contiene un arma a 2 manos, devuelve la def.
  // Preferir la def con módulo weapon
  const weaponEntry = items.find((e) => {
    if (e.slot !== "mano_der" || !e.def) return false;
    return Boolean((e.def.modules || {}).weapon);
  });

  if (!weaponEntry) return null;

  const def = weaponEntry.def;
  const stats = getWeaponStats(def);
  return {
    damageNature: stats.damageNature,
    tier: stats.tier,
    baseDamage: stats.baseDamage,
    hands: stats.hands,
    weaponRange: stats.weaponRange,
  };
}

/**
 * Resuelve la armadura ligada a la durabilidad del defensor como una lista
 * de instancias DurabilityModule (una por pieza) y totales.
 * Acepta character (objeto) o characterId.
 * @param {object|string|number} characterOrId - Personaje o ID del defensor
 * @param {Array<object>} [equipped] - Salida de getEquippedItems (opcional)
 * @returns {Promise<{list: Array<object>, totalMaxResist: number, totalCurrentResist: number}>}
 */
async function resolveDefenderArmor(characterOrId, equipped = null) {
  const items = equipped || (await getEquippedItems(characterOrId));
  const DurabilityClass = getCategory("durability");

  const list = [];
  let totalMaxResist = 0;
  let totalCurrentResist = 0;

  for (const entry of items) {
    const armorDef = (entry.def?.modules || {}).armor;
    if (!armorDef) continue; // solo piezas de armadura afectan resistencia material
    if (!DurabilityClass) continue;

    const metadata = (entry.row && entry.row.metadata) || {};
    const dur = metadata.durability || {};
    const maxResist = Math.max(1, Number(dur.maxResist) || getArmorStats(entry.def).maxResist);
    const currentResist = Number.isFinite(Number(dur.currentResist)) ? Number(dur.currentResist) : maxResist;

    const instance = new DurabilityClass({
      maxResist,
      currentResist,
      isRepairable: dur.isRepairable !== false,
      isBroken: Boolean(dur.isBroken || dur.broken) || currentResist <= 0,
      slot: armorDef.slot,
    });

    list.push({ slot: entry.slot, itemId: entry.itemId, instance });
    totalMaxResist += maxResist;
    totalCurrentResist += currentResist;
  }

  return { list, totalMaxResist, totalCurrentResist };
}

/**
 * Resuelve los buffs pasivos de artefactos equipados.
 * @param {string|character} character - Personaje
 * @returns {Promise<Array<object>>} Lista de efectos de artefactos
 */
async function resolveArtifacts(character) {
  const items = await getEquippedItems(character);
  const artifacts = items.filter((e) => {
    const categories = e.def?.categories || [];
    return categories.includes("artifact");
  });

  return artifacts.map((e) => ({
    itemId: e.itemId,
    slot: e.slot,
    ...getArtifactStats(e.def),
  }));
}

/**
 * Resuelve el resumen completo de equipo de un personaje para la UI de combate
 * (apertura/estado): arma, piezas de armadura con durabilidad, artefactos,
 * bonos de set y cobertura. Funciona para jugadores (DB) y dummies (memoria).
 * @param {object} character - Personaje
 * @returns {Promise<{weapon: object|null, armor: Array<object>, totalMaxResist: number, totalCurrentResist: number, artifacts: Array<object>, setBonuses: Array<object>, coverage: object}>}
 */
async function resolveCharacterEquipment(character) {
  const items = await getEquippedItems(character);

  const weaponEntry = items.find((e) => e.def && e.def.modules && e.def.modules.weapon && e.slot === "mano_der");
  const weapon = weaponEntry
    ? { itemId: weaponEntry.itemId, name: weaponEntry.def.name, ...getWeaponStats(weaponEntry.def) }
    : null;

  const armor = [];
  let totalMaxResist = 0;
  let totalCurrentResist = 0;
  for (const entry of items) {
    const armorDef = entry.def?.modules?.armor;
    if (!armorDef) continue;
    const stats = getArmorStats(entry.def);
    const dur = (entry.row && entry.row.metadata && entry.row.metadata.durability) || {};
    const maxResist = Math.max(1, Number(dur.maxResist) || stats.maxResist);
    const currentResist = Number.isFinite(Number(dur.currentResist)) ? Number(dur.currentResist) : maxResist;
    totalMaxResist += maxResist;
    totalCurrentResist += currentResist;
    armor.push({
      slot: entry.slot,
      itemId: entry.itemId,
      name: entry.def.name,
      coverage: stats.coverage,
      setId: stats.setId,
      maxResist,
      currentResist,
      broken: currentResist <= 0,
    });
  }

  const artifacts = items
    .filter((e) => (e.def?.categories || []).includes("artifact"))
    .map((e) => ({
      itemId: e.itemId,
      slot: e.slot,
      name: e.def.name,
      ...getArtifactStats(e.def),
    }));

  const setBonuses = resolveSetBonuses(armor, ARMOR_SETS);
  const coverage = getCoverage(armor);

  return { weapon, armor, totalMaxResist, totalCurrentResist, artifacts, setBonuses, coverage };
}

module.exports = {
  getInventoryWithMetadata,
  getEquippedItems,
  resolveAttackerWeapon,
  resolveDefenderArmor,
  resolveArtifacts,
  resolveCharacterEquipment,
};
