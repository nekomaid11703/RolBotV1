// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { invalidateUserCache } = require("../../utils/safeQuery");
const { TOOLS, TOOL_UPGRADE_COSTS } = require("../../config/toolsConfig");
const inventoryService = require("./inventoryService");
const economyService = require("../economyService");

/**
 * Normaliza y devuelve las 5 herramientas de un personaje.
 * Si no existen en `slots.tools`, las inicializa en nivel 1.
 * @param {object} characterSlots
 * @returns {Record<string, {id: string, name: string, level: number, icon: string}>}
 */
function normalizeCharacterTools(characterSlots = {}) {
  const currentTools = (characterSlots && typeof characterSlots === "object" && characterSlots.tools) || {};
  const normalized = {};

  for (const [toolId, toolDef] of Object.entries(TOOLS)) {
    const existing = currentTools[toolId];
    const level = Math.max(1, Math.min(10, Number(existing?.level) || 1));
    normalized[toolId] = {
      id: toolId,
      name: toolDef.name,
      level,
      icon: toolDef.icon,
      type: toolDef.type,
    };
  }

  return normalized;
}

/**
 * Obtiene las herramientas del personaje activo.
 * @param {string|number} characterId
 * @returns {Promise<Record<string, {id: string, name: string, level: number, icon: string}>>}
 */
async function getCharacterTools(characterId) {
  const { data, error } = await supabase.from("characters").select("id, slots").eq("id", characterId).maybeSingle();

  if (error || !data) {
    throw new Error("No se encontró el personaje para consultar herramientas.");
  }

  return normalizeCharacterTools(data.slots);
}

/**
 * Mejora una herramienta al siguiente nivel (1 -> 10).
 * Valida stelas, materiales en inventario y sube el nivel atómicamente.
 * @param {object} params
 * @param {string} params.userId
 * @param {string|number} params.characterId
 * @param {string} params.toolId
 * @returns {Promise<{success: boolean, toolId: string, oldLevel: number, newLevel: number, toolName: string, error?: string}>}
 */
async function upgradeTool({ userId, characterId, toolId }) {
  const cleanToolId = String(toolId || "")
    .toLowerCase()
    .trim();
  const toolDef = TOOLS[cleanToolId];

  if (!toolDef) {
    return {
      success: false,
      error: `La herramienta "${cleanToolId}" no existe. Herramientas válidas: pico, hacha, bolsa, mochila.`,
    };
  }

  // 1. Obtener personaje y slots actuales
  const { data: character, error: charErr } = await supabase
    .from("characters")
    .select("id, player_phone, slots")
    .eq("id", characterId)
    .maybeSingle();

  if (charErr || !character) {
    return { success: false, error: "Personaje no encontrado." };
  }

  const tools = normalizeCharacterTools(character.slots);
  const currentTool = tools[cleanToolId];
  const currentLevel = currentTool.level;

  if (currentLevel >= 10) {
    return { success: false, error: `¡Tu ${toolDef.name} ya alcanzó el nivel máximo (Nivel 10)!` };
  }

  const nextLevel = currentLevel + 1;
  const cost = TOOL_UPGRADE_COSTS[nextLevel];

  if (!cost) {
    return { success: false, error: "No se encontraron los requisitos de mejora para ese nivel." };
  }

  // 2. Verificar stelas del usuario
  const balance = await economyService.getBalance(userId);
  if (balance < cost.stelas) {
    return {
      success: false,
      error: `Stelas insuficientes. Requieres ✧ ${cost.stelas.toLocaleString()} y tienes ✧ ${balance.toLocaleString()}.`,
    };
  }

  // 3. Verificar materiales requeridos en inventario
  const inv = await inventoryService.getInventory(characterId);
  for (const mat of cost.materials) {
    const invRow = inv.find((r) => r.item_id === mat.itemId);
    const available = invRow?.quantity || 0;
    if (available < mat.quantity) {
      const { getItem } = require("../../data/items");
      const matName = getItem(mat.itemId)?.name || mat.itemId;
      return {
        success: false,
        error: `Materiales insuficientes: necesitas ${mat.quantity}x ${matName} (tienes ${available}).`,
      };
    }
  }

  // 4. Deducir stelas
  await economyService.removeMoney(userId, cost.stelas);

  // 5. Deducir materiales del inventario
  for (const mat of cost.materials) {
    await inventoryService.removeItem(characterId, userId, mat.itemId, mat.quantity);
  }

  // 6. Actualizar nivel de herramienta en character.slots.tools
  tools[cleanToolId].level = nextLevel;
  const updatedSlots = {
    ...(character.slots || {}),
    tools,
  };

  const payload = filterExisting("characters", {
    slots: updatedSlots,
    updated_at: new Date().toISOString(),
  });

  const { error: updateErr } = await supabase.from("characters").update(payload).eq("id", characterId);

  if (updateErr) {
    throw new Error(`Error al actualizar la herramienta: ${updateErr.message}`);
  }

  invalidateUserCache(userId);

  return {
    success: true,
    toolId: cleanToolId,
    toolName: toolDef.name,
    oldLevel: currentLevel,
    newLevel: nextLevel,
    costPaid: cost,
  };
}

module.exports = {
  normalizeCharacterTools,
  getCharacterTools,
  upgradeTool,
};
