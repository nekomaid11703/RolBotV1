// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { logError } = require("../loggerService");
const { getItem } = require("../../data/items");
const { invalidateUserCache } = require("../../utils/safeQuery");

/**
 * Slots válidos de equipamiento y sus categorías aceptadas.
 * Regla de 2 manos: mano_der + mano_izq se bloquean mutuamente si el arma es de 2 manos.
 */
const EQUIPMENT_SLOTS = {
  cabeza: { accepts: ["armor", "helmet"] },
  pecho: { accepts: ["armor"] },
  pantalones: { accepts: ["armor"] },
  botas: { accepts: ["armor"] },
  mano_der: { accepts: ["weapon", "shield"] },
  mano_izq: { accepts: ["weapon", "shield"] },
  artefacto_1: { accepts: ["artifact"] },
  artefacto_2: { accepts: ["artifact"] },
  artefacto_3: { accepts: ["artifact"] },
  artefacto_4: { accepts: ["artifact"] },
};

/**
 * Alias coloquiales de slots para que el jugador no tenga que recordar los ids
 * técnicos (casco -> cabeza, grebas/pantalones -> pantalones, etc.).
 * @constant SLOT_ALIASES
 * @type {Record<string, string>}
 */
const SLOT_ALIASES = {
  casco: "cabeza",
  yelmo: "cabeza",
  head: "cabeza",
  pechera: "pecho",
  coraza: "pecho",
  chest: "pecho",
  grebas: "pantalones",
  perneras: "pantalones",
  piernas: "pantalones",
  legs: "pantalones",
  botas: "botas",
  boots: "botas",
  mano: "mano_der",
  mano_derecha: "mano_der",
  mano_izquierda: "mano_izq",
  artefacto: "artefacto_1",
};

/**
 * Normaliza un slot/alias dado por el jugador a una clave real de EQUIPMENT_SLOTS.
 * @param {string} slot - Slot solicitado (posiblemente alias)
 * @returns {string} Key real del slot o el input tal cual si no es alias
 */
function normalizeSlot(slot) {
  const s = String(slot || "").toLowerCase();
  return SLOT_ALIASES[s] || s;
}

/**
 * Determina el slot de armadura a partir del módulo o del id/nombre del ítem.
 * @param {object} itemDef - ItemDefinition del catálogo
 * @returns {string} Key de slot de armadura
 */
function resolveArmorSlot(itemDef) {
  const explicit = itemDef.modules?.armor?.slot;
  const armorSlots = ["cabeza", "pecho", "pantalones", "botas"];
  if (explicit && armorSlots.includes(explicit)) return explicit;
  const text = `${itemDef.id} ${itemDef.name}`.toLowerCase();
  if (/casco|head|cabeza/.test(text)) return "cabeza";
  if (/bota|boot/.test(text)) return "botas";
  if (/greba|pantal|perner|pierna|leg/.test(text)) return "pantalones";
  return "pecho";
}

/**
 * Determina el slot por defecto de un ítem según su categoría:
 * weapon -> mano_der; shield -> mano_izq; armor -> slot del módulo (o inferido);
 * artifact -> primer hueco libre.
 * @param {object} itemDef - ItemDefinition del catálogo
 * @param {object} [currentSlots] - Mapa de slots ya ocupados para artefacto libre
 * @returns {string|null} Key de slot o null si no es equipable
 */
function resolveDefaultSlot(itemDef, currentSlots = {}) {
  const cats = itemDef.categories || [];

  if (cats.includes("weapon")) return "mano_der";
  if (cats.includes("shield")) return "mano_izq";
  if (cats.includes("armor")) return resolveArmorSlot(itemDef);
  if (cats.includes("artifact")) {
    const order = ["artefacto_1", "artefacto_2", "artefacto_3", "artefacto_4"];
    return order.find((s) => !currentSlots[s]) || "artefacto_1";
  }
  return null;
}

/**
 * Determina si un error de Supabase corresponde a una columna o relación inexistente en la base.
 * @param {*} error - Objeto error de Supabase/PostgREST
 * @returns {boolean} True si el error indica una deficiencia de esquema
 */
function isSchemaMissingError(error) {
  const code = error?.code;
  return code === "PGRST204" || /does not exist|could not find/.test(String(error?.message || error?.details || ""));
}

/**
 * @constant MIGRATION_HINT
 * @type {string}
 */
const MIGRATION_HINT =
  "equipped_slots no disponible en la DB. Ejecuta la migración 003 (src/database/migrations/003_remediation_item_equipment.sql).";

/**
 * Obtiene los slots de equipamiento actuales de un personaje.
 * @param {string|number} characterId
 * @returns {Promise<object>} Mapa de slots => item_id | null
 */
async function getEquippedSlots(characterId) {
  const { data, error } = await supabase.from("characters").select("equipped_slots").eq("id", characterId).single();

  if (error) {
    if (isSchemaMissingError(error)) throw new Error(MIGRATION_HINT);
    logError({ source: "equipmentService.getEquippedSlots", error });
    return {};
  }

  return data?.equipped_slots || {};
}

/**
 * Persiste el mapa de slots equipados a la base de datos.
 * @param {string|number} characterId
 * @param {string} creatorId
 * @param {object} slots
 */
async function saveEquippedSlots(characterId, creatorId, slots) {
  const payload = filterExisting("characters", {
    equipped_slots: slots,
    updated_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("characters").update(payload).eq("id", characterId);

  if (error) {
    if (isSchemaMissingError(error)) throw new Error(MIGRATION_HINT);
    throw new Error(`Error actualizando slots: ${error.message}`);
  }
  invalidateUserCache(creatorId);
}

/**
 * Determina qué slots liberar cuando se equipa un arma a 2 manos.
 * Regla: auto-desequipa ambas manos antes de equipar.
 * @param {string} slot - "mano_der" | "mano_izq"
 * @param {boolean} isTwoHanded
 * @returns {string[]} Lista de slots a limpiar
 */
function getSlotsToFree(slot, isTwoHanded) {
  if (isTwoHanded) {
    return ["mano_der", "mano_izq"];
  }
  return [slot];
}

/**
 * Equipa un ítem en el personaje activo.
 * - Si el ítem es de 2 manos, desequipa automáticamente mano_der y mano_izq.
 * - Si el slot ya está ocupado, desequipa el ítem actual silenciosamente.
 * @param {object} options
 * @param {string|number} options.characterId - ID del personaje
 * @param {string} options.creatorId - Phone/ID del jugador
 * @param {string} options.itemId - ID del ítem a equipar
 * @param {string} options.slot - Slot de destino
 * @returns {Promise<{equipped: string, slot: string, autoUnequipped: string[]}>}
 */
async function equipItem({ characterId, creatorId, itemId, slot }) {
  const validSlotKeys = Object.keys(EQUIPMENT_SLOTS);
  if (!validSlotKeys.includes(slot)) {
    throw new Error(`Slot inválido: "${slot}". Slots válidos: ${validSlotKeys.join(", ")}`);
  }

  const itemDef = getItem(itemId);
  if (!itemDef) throw new Error(`El ítem "${itemId}" no existe en el catálogo.`);

  // Determinar si el arma requiere 2 manos leyendo su módulo weapon
  const weaponModule = (itemDef.modules || {}).weapon;
  const isTwoHanded = weaponModule?.hands === 2;

  // Verificar que el slot acepta este tipo de ítem
  const slotConfig = EQUIPMENT_SLOTS[slot];
  const itemCategories = itemDef.categories || [];
  const slotAcceptsItem = itemCategories.some((cat) => slotConfig.accepts.includes(cat));
  if (!slotAcceptsItem) {
    throw new Error(`Este ítem no puede equiparse en "${slot}". Categorías del ítem: [${itemCategories.join(", ")}].`);
  }

  // Armas de 2 manos solo pueden ir en mano_der
  if (isTwoHanded && slot !== "mano_der") {
    throw new Error(`Las armas de 2 manos deben equiparse en "mano_der" (ocupan ambas manos automáticamente).`);
  }

  const currentSlots = await getEquippedSlots(characterId);
  const slotsToFree = getSlotsToFree(slot, isTwoHanded);

  // Registrar qué ítems fueron auto-desequipados
  const autoUnequipped = slotsToFree
    .filter((s) => currentSlots[s] && currentSlots[s] !== null)
    .map((s) => currentSlots[s]);

  // Limpiar los slots afectados y equipar
  const updatedSlots = { ...currentSlots };
  for (const s of slotsToFree) {
    updatedSlots[s] = null;
  }

  // Si es 2 manos, marcar también mano_izq como ocupado por el arma principal
  updatedSlots[slot] = itemId;
  if (isTwoHanded) {
    updatedSlots.mano_izq = `__2h:${itemId}`; // marcador especial para 2 manos
  }

  await saveEquippedSlots(characterId, creatorId, updatedSlots);

  return { equipped: itemId, slot, autoUnequipped };
}

/**
 * Desequipa un ítem de un slot.
 * - Si el slot tiene un arma de 2 manos, también limpia el marcador de mano_izq.
 * @param {object} options
 * @param {string|number} options.characterId
 * @param {string} options.creatorId
 * @param {string} options.slot
 * @returns {Promise<{unequipped: string|null, slot: string}>}
 */
async function unequipItem({ characterId, creatorId, slot }) {
  const validSlotKeys = Object.keys(EQUIPMENT_SLOTS);
  if (!validSlotKeys.includes(slot)) {
    throw new Error(`Slot inválido: "${slot}".`);
  }

  const currentSlots = await getEquippedSlots(characterId);
  const currentItem = currentSlots[slot] || null;

  if (!currentItem) {
    throw new Error(`El slot "${slot}" ya está vacío.`);
  }

  const updatedSlots = { ...currentSlots };
  updatedSlots[slot] = null;

  // Si era un arma de 2 manos, también limpiar el marcador de mano_izq
  if (slot === "mano_der" && String(updatedSlots.mano_izq || "").startsWith("__2h:")) {
    updatedSlots.mano_izq = null;
  }

  await saveEquippedSlots(characterId, creatorId, updatedSlots);

  return { unequipped: currentItem, slot };
}

module.exports = {
  EQUIPMENT_SLOTS,
  SLOT_ALIASES,
  normalizeSlot,
  resolveDefaultSlot,
  getEquippedSlots,
  equipItem,
  unequipItem,
};
