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
  const maxHp = Math.max(1, (combatant.character.stats?.hp ?? 1) * 2);
  return [
    `*${combatant.character.name}* Nv.${combatant.character.nivel || 20}`,
    `HP ${buildHpBar(combatant.hp, maxHp)}`,
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
/**
 * Líneas del menú de acciones del turno, generadas desde COMBAT_ACTIONS.
 * @param {string} characterName - Nombre del personaje en turno
 * @param {object} [session] - Sesión de combate (para filtros `when`)
 * @param {object} [ctx] - Contexto situacional opcional {distance, enemyHp, enemyMaxHp, availableFulgor, maxFulgor}
 * @returns {string[]}
 */
function actionMenuLines(characterName, session = {}, ctx = {}) {
  const lines = [`\u2694\uFE0F Turno de *${characterName}*`];

  // Línea de contexto situacional si se provee
  const parts = [];
  if (ctx.distance !== undefined) parts.push(`\uD83D\uDCCD ${ctx.distance}m`);
  if (ctx.enemyHp !== undefined && ctx.enemyMaxHp !== undefined) {
    const pct = Math.round((ctx.enemyHp / ctx.enemyMaxHp) * 100);
    const icon = pct > 60 ? "\uD83D\uDFE2" : pct > 30 ? "\uD83D\uDFE1" : "\uD83D\uDD34";
    parts.push(`${icon} Enemigo: ${ctx.enemyHp}/${ctx.enemyMaxHp} HP`);
  }
  if (ctx.availableFulgor !== undefined && ctx.maxFulgor !== undefined) {
    parts.push(`\u2728 Fulgor: ${ctx.availableFulgor}/${ctx.maxFulgor}`);
  }
  if (parts.length > 0) lines.push(`  ${parts.join("  |  ")}`);

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
/**
 * Líneas del prompt de reacción del defensor, generadas desde REACTION_ACTIONS.
 * Muestra la probabilidad de éxito de esquiva y el daño estimado de cada opción.
 * @param {string} attackerName - Nombre del atacante
 * @param {string} defenderName - Nombre del defensor
 * @param {number} baseDamage - Daño base del ataque
 * @param {boolean} [canDodgeSuccessfully] - Si puede esquivar exitosamente
 * @param {number} [dodgeChancePct] - Probabilidad de esquiva estimada en %
 * @returns {string[]}
 */
function reactionPromptLines(attackerName, defenderName, baseDamage, canDodgeSuccessfully = false, dodgeChancePct) {
  return [
    `\u26A1 *${attackerName}* ataca (${baseDamage} daño)`,
    `\uD83D\uDCA1 *${defenderName}* debe reaccionar:`,
    ...REACTION_ACTIONS.map((a) => {
      const detail = a.render({ baseDamage, canDodge: canDodgeSuccessfully, dodgeChancePct });
      return `  \u2022 \`/${a.command}\` \u2192 ${detail}`;
    }),
  ];
}

/**
 * Líneas de estados activos y barreras defensivas de un combatiente.
 * @param {object} combatant - Slot del combatiente
 * @returns {string[]}
 */
function activeEffectLines(combatant) {
  const lines = [];
  const icons = {
    quemadura: "🔥",
    veneno: "🤢",
    congelado: "🧊",
    enredado: "🌿",
    cegadura: "👁️",
    maldito: "💀",
    rompe_armaduras: "🛡️",
    decadencia: "🥀",
  };

  const statusItems = [];
  if (combatant.barrierHp && combatant.barrierHp > 0) {
    statusItems.push(`🛡️ Barrera (${combatant.barrierHp} HP)`);
  }

  if (Array.isArray(combatant.activeEffects)) {
    for (const ef of combatant.activeEffects) {
      const icon = icons[ef.tipo] || "✨";
      const dur = ef.turnos ? ` (${ef.turnos}t)` : "";
      statusItems.push(`${icon} ${ef.tipo}${dur}`);
    }
  }

  if (statusItems.length > 0) {
    lines.push(`  └─ ${statusItems.join(" | ")}`);
  }
  return lines;
}

module.exports = { combatantLines, equipmentSectionLines, actionMenuLines, reactionPromptLines, activeEffectLines };
