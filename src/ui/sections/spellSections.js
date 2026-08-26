const { getSpellDetails, getSpellSlotCost } = require("../../services/rpg/spellContainerService");

/**
 * Formatea la barra o resumen de Fulgor del personaje.
 * @param {number} fulgorStat - Stat de Fulgor actual
 * @param {number} [spentFulgor=0] - Fulgor gastado en la sesión
 * @returns {string}
 */
function buildFulgorSummary(fulgorStat = 1, spentFulgor = 0) {
  const maxPool = Math.min(100, Math.max(10, fulgorStat * 2));
  const current = Math.max(0, maxPool - spentFulgor);
  return `✨ Fulgor: ${current}/${maxPool}`;
}

/**
 * Construye la barra visual de slots ocupados de un contenedor de memoria arcana.
 * @param {number} used - Ranuras usadas
 * @param {number} capacity - Capacidad total
 * @returns {string} Ej: [████░░░░] 4/8 slots
 */
function buildContainerBar(used = 0, capacity = 1) {
  const totalBlocks = 8;
  const ratio = Math.min(1, Math.max(0, used / Math.max(1, capacity)));
  const filled = Math.round(ratio * totalBlocks);
  const empty = totalBlocks - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `[${bar}] ${used}/${capacity} slots`;
}

/**
 * Genera las líneas del sub-menú de hechizos equipados para la UI.
 * @param {object} options
 * @param {object} options.character - Datos del personaje
 * @param {Array<{slot: string, spellId: string, itemDef: object}>} options.activeSpells - Ranuras activas
 * @param {Record<string, number>} [options.cooldowns={}] - Cooldowns en combate por spellId
 * @param {Record<string, boolean>} [options.activePassives={}] - Toggles de pasivas por spellId
 * @param {number} [options.spentFulgor=0] - Fulgor gastado en combate
 * @returns {string[]} Líneas formateadas
 */
/**
 * Genera las líneas del sub-menú de hechizos equipados para la UI.
 * @param {object} options
 * @param {object} options.character - Datos del personaje
 * @param {Array<{slot: string, spellId: string, itemDef: object}>} options.activeSpells - Ranuras activas
 * @param {Record<string, number>} [options.cooldowns={}] - Cooldowns en combate por spellId
 * @param {Record<string, boolean>} [options.activePassives={}] - Toggles de pasivas por spellId
 * @param {number} [options.spentFulgor=0] - Fulgor gastado en combate
 * @param {number} [options.distance] - Distancia actual de combate (para indicador de rango)
 * @returns {string[]} Líneas formateadas
 */
function spellSubmenuLines({ character, activeSpells = [], cooldowns = {}, activePassives = {}, spentFulgor = 0, distance, containerInfo }) {
  const lines = [];
  const fulgorLine = buildFulgorSummary(character.stats?.fulgor || 1, spentFulgor);
  const distLine = distance !== undefined ? `  \uD83D\uDCCD Distancia actual: ${distance}m` : "";
  lines.push(`\uD83D\uDC64 *${character.name}* | ${fulgorLine}${distLine ? `  |${distLine}` : ""}`);

  if (containerInfo) {
    const bar = buildContainerBar(containerInfo.usedSlots, containerInfo.capacity);
    lines.push(`📘 *Tomo:* ${containerInfo.name} ${bar}`);
  }

  lines.push("\uD83D\uDCDC *HECHIZOS EQUIPADOS (M\u00E1x 4)*");


  const slotMap = {};
  for (const item of activeSpells) {
    slotMap[item.slot] = item;
  }

  const slotOrder = ["spell_1", "spell_2", "spell_3", "spell_4"];
  for (let i = 0; i < slotOrder.length; i++) {
    const slotKey = slotOrder[i];
    const num = i + 1;
    const item = slotMap[slotKey];

    if (!item) {
      lines.push(`  \`[${num}]\` *(Vac\u00EDo)* \u2014 \`/spell equipar <hechizo>\``);
      continue;
    }

    const details = getSpellDetails(item.spellId);
    const cd = cooldowns[item.spellId] || 0;
    const cdStatus = cd > 0 ? `\u23F3 CD: ${cd}t` : "\u2705 Listo";
    const fulgorCost = details?.fulgorCost ? `\u2728 ${details.fulgorCost}` : "\u2728 0";

    // Indicador de rango
    let rangeIndicator = "";
    if (distance !== undefined && details?.range !== undefined) {
      rangeIndicator = distance <= details.range ? " \uD83D\uDFE2" : " \uD83D\uDD34";
    }

    let toggleText = "";
    if (details?.isPassive) {
      const isOn = Boolean(activePassives[item.spellId]);
      toggleText = isOn ? " | \uD83D\uDFE2 [ON]" : " | \uD83D\uDD34 [OFF]";
    }

    const slotCost = getSpellSlotCost(details?.tier);
    lines.push(`  \`[${num}]\`${rangeIndicator} *${details?.name || item.spellId}* (${details?.kind || "hechizo"})`);
    lines.push(`      ${fulgorCost} | ${cdStatus}${toggleText} | ID: \`${item.spellId}\` | 🏷️ Tier ${details?.tier || "E"} (${slotCost} ${slotCost === 1 ? "slot" : "slots"})`);
  }

  return lines;
}

/**
 * Genera el bloque de instrucciones rápidas del menú /spell.
 * @returns {string[]}
 */
function spellActionMenuLines() {
  return [
    "📌 *Comandos de Hechizos:*",
    "  • `/spell <1-4|id>` — Lanzar en combate o conmutar pasiva",
    "  • `/spell info <1-4|id>` — Ver ficha técnica detallada",
    "  • `/spell toggle <1-4|id>` — Activar/desactivar pasiva",
    "  • `/spell equipar <id> [slot]` — Equipar desde contenedor",
    "  • `/spell desequipar <slot|id>` — Desequipar hechizo activo",
    "  • `/spell contenedores` — Ver tomos y pergaminos",
  ];
}

/**
 * Formatea la ficha técnica detallada de un hechizo.
 * @param {object} details - Resultado de getSpellDetails
 * @returns {string[]}
 */
function spellDetailLines(details) {
  if (!details) return ["❌ Hechizo no encontrado."];

  const lines = [
    `✨ *${details.name}* (Tier ${details.tier})`,
    `📝 _${details.description}_`,
    "───────────────",
    `• *Tipo:* ${details.kind} (${details.application})`,
    `• *Naturaleza:* ${details.nature} | *Daño:* ${details.baseDamage} (${details.damageNature})`,
    `• *Costo de Fulgor:* ${details.fulgorCost} | *Alcance:* ${details.range}m`,
    `• *Ranuras en Tomo:* ${getSpellSlotCost(details.tier)} ${getSpellSlotCost(details.tier) === 1 ? "slot" : "slots"} (Tier ${details.tier})`,
    `• *Tiempo Casteo:* ${details.castTime}t | *Cooldown:* ${details.cooldown}t`,
  ];

  if (details.effects && details.effects.length > 0) {
    lines.push("• *Efectos:*");
    for (const ef of details.effects) {
      lines.push(`  - ${ef.tipo || "efecto"} (Mag: ${ef.magnitude || 1}, Dur: ${ef.duration || 1}t)`);
    }
  }

  return lines;
}

/**
 * Formatea los contenedores de hechizos disponibles en inventario.
 * @param {Array<object>} containers - Resultado de getSpellContainersInInventory
 * @returns {string[]}
 */
function spellContainerSectionLines(containers = []) {
  if (containers.length === 0) {
    return ["🎒 *CONTENEDORES DE HECHIZOS*", "No tienes tomos ni pergaminos en tu inventario."];
  }

  const lines = ["🎒 *CONTENEDORES EN INVENTARIO*"];
  for (const c of containers) {
    lines.push(`  • *${c.name}* (x${c.quantity}) — Capacidad: ${c.capacity} hechizos`);
  }
  return lines;
}

module.exports = {
  buildFulgorSummary,
  spellSubmenuLines,
  spellActionMenuLines,
  spellDetailLines,
  spellContainerSectionLines,
};
