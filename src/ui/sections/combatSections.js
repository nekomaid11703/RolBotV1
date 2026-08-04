// @ts-nocheck
const { buildHpBar, buildFatigueBar, buildStatSummary } = require("./combatStats");
const { equipmentSummaryLines } = require("./equipmentSections");
const { COMBAT_ACTIONS, REACTION_ACTIONS } = require("../../data/combatActions");

/**
 * Líneas de un combatiente en combate: nombre/Nv, HP, fatiga y stats.
 * @param {object} combatant - Slot del combatiente (challenger/defender)
 * @returns {string[]}
 */
function combatantLines(combatant) {
  const stats = buildStatSummary(combatant.character.stats);
  return [
    `*${combatant.character.name}* Nv.${combatant.character.nivel || 20}`,
    `HP ${buildHpBar(combatant.hp, (combatant.character.stats?.hp ?? 1) * 2)}`,
    `Fat ${buildFatigueBar(combatant.fatigue || 0, combatant.character.stats.def || 1)}`,
    stats[0],
    stats[1],
  ];
}

/**
 * Líneas de equipo de un combatiente (arma/armadura/artefactos/set).
 * @param {object|null} eq - Resumen de equipo (resolveCharacterEquipment)
 * @returns {string[]}
 */
function equipmentSectionLines(eq) {
  return equipmentSummaryLines(eq);
}

/**
 * Líneas del menú de acciones del turno, generadas desde COMBAT_ACTIONS.
 * @param {string} characterName - Nombre del personaje en turno
 * @param {object} [session] - Sesión de combate (para filtros `when`)
 * @returns {string[]}
 */
function actionMenuLines(characterName, session = {}) {
  const lines = [`\u2694\uFE0F Turno de *${characterName}*`];
  for (const action of COMBAT_ACTIONS) {
    if (typeof action.when === "function" && !action.when(session)) continue;
    const hint = action.hint ? ` <${action.hint}>` : "";
    lines.push(`  \u2022 \`/${action.command}\`${hint} \u2014 ${action.label}`);
  }
  return lines;
}

/**
 * Líneas del prompt de reacción del defensor, generadas desde REACTION_ACTIONS.
 * @param {string} attackerName - Nombre del atacante
 * @param {string} defenderName - Nombre del defensor
 * @param {number} baseDamage - Daño base del ataque
 * @param {boolean} [canDodgeSuccessfully] - Si puede esquivar exitosamente
 * @returns {string[]}
 */
function reactionPromptLines(attackerName, defenderName, baseDamage, canDodgeSuccessfully = false) {
  return [
    `\u26A1 *${attackerName}* ataca (${baseDamage})`,
    `\uD83D\uDCA1 *${defenderName}* reacciona:`,
    ...REACTION_ACTIONS.map(
      (a) => `  \u2022 \`/${a.command}\` \u2192 ${a.render({ baseDamage, canDodge: canDodgeSuccessfully })}`,
    ),
  ];
}

module.exports = { combatantLines, equipmentSectionLines, actionMenuLines, reactionPromptLines };
