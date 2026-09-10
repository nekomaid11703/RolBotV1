// @ts-nocheck
const { buildHpBar, buildEnergyBar } = require("./combatStats");
const { equipmentSummaryLines } = require("./equipmentSections");
const { COMBAT_ACTIONS, REACTION_ACTIONS } = require("../../data/combatActions");

/**
 * Líneas de stats del combatiente, condensadas 2 por línea (ancho amigable de WhatsApp).
 * @param {object} stats - Stats del personaje
 * @returns {string[]}
 */
function statLines(stats = {}) {
  return [
    `\u2694\uFE0F ATK ${stats.atk ?? 0}  \uD83D\uDEE1\uFE0F DEF ${stats.def ?? 0}`,
    `\u26A1 ASPD ${stats.aspd ?? 0}  \uD83C\uDFC3 MSP ${stats.mspd ?? 0}`,
    `\uD83D\uDC41\uFE0F REF ${stats.ref ?? 0}  \u2728 FULG ${stats.fulgor ?? 0}`,
    `\u2728 DOMF ${stats.d_fulgor ?? 0}  \u2728 RESF ${stats.r_fulgor ?? 0}`,
  ];
}

/**
 * Líneas de un combatiente en combate: nombre/Nv, HP, energía y stats.
 * @param {object} combatant - Slot del combatiente (challenger/defender)
 * @returns {string[]}
 */
function combatantLines(combatant) {
  const maxHp = Math.max(1, (combatant.character.stats?.hp ?? 1) * 2);
  const lines = [
    `*${combatant.character.name}*  Nv.${combatant.character.nivel || 20}`,
    `HP ${buildHpBar(combatant.hp, maxHp)}`,
  ];
  if (combatant.barrierHp && combatant.barrierHp > 0) {
    lines.push(`🛡️ Barrera: ${combatant.barrierHp} HP`);
  }
  if (combatant.prison && combatant.prison.hp > 0) {
    lines.push(
      `🧱 Prisión: ${combatant.prison.hp}/${combatant.prison.maxHp} HP [${combatant.prison.element || "arcano"}]`,
    );
  }
  lines.push(buildEnergyBar(combatant.fatigue || 0, combatant.character.stats.def || 1));
  lines.push(...statLines(combatant.character.stats));
  return lines;
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
 * @param {object} [ctx] - Contexto situacional opcional {distance, enemyHp, enemyMaxHp, availableFulgor, maxFulgor}
 * @returns {string[]}
 */
function actionMenuLines(characterName, session = {}, ctx = {}) {
  const lines = [`\u2694\uFE0F *Turno de ${characterName}*`];

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
    lines.push(`  \u2022 \`/${action.command}\`${hint} — ${action.label}`);
  }
  return lines;
}

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
      return `  \u2022 \`/${a.command}\` → ${detail}`;
    }),
  ];
}

/**
 * Líneas de estados activos y barreras defensivas de un combatiente.
 * Se muestran debajo del combatiente con su duración (cronómetro).
 * @param {object} combatant - Slot del combatiente
 * @returns {string[]}
 */
function activeEffectLines(combatant) {
  const lines = [];
  const icons = {
    quemadura: "\uD83D\uDD25",
    envenenamiento: "\uD83E\uDD7A",
    veneno: "\uD83E\uDD7A",
    congelado: "\uD83E\uDD76",
    enredado: "\uD83C\uDF3F",
    cegadura: "\uD83D\uDC41\uFE0F",
    maldito: "\uD83D\uDC80",
    rompe_armaduras: "\uD83D\uDEE1\uFE0F",
    decadencia: "\uD83E\uDD77",
  };

  const statusItems = [];
  if (combatant.barrierHp && combatant.barrierHp > 0) {
    statusItems.push(`\uD83D\uDEE1\uFE0F Barrera (${combatant.barrierHp} HP)`);
  }

  if (Array.isArray(combatant.activeEffects)) {
    for (const ef of combatant.activeEffects) {
      const icon = icons[ef.tipo] || "\u2728";
      const dur = ef.turnos ? ` (${ef.turnos}t)` : "";
      statusItems.push(`${icon} ${ef.tipo}${dur}`);
    }
  }

  if (statusItems.length > 0) {
    lines.push(`  ${statusItems.join("  ·  ")}`);
  }
  return lines;
}

module.exports = {
  combatantLines,
  statLines,
  equipmentSectionLines,
  actionMenuLines,
  reactionPromptLines,
  activeEffectLines,
};
