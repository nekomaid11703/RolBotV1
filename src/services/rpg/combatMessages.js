// @ts-nocheck
const { box } = require("../../utils/boxUtils");
const { getFatigueLevel } = require("./fatigueEngine");
const { HP_MAX } = require("../../config/characterConfig");

/**
 *
 * @param current
 * @param max
 */
function buildHpBar(current, max = HP_MAX) {
  const pct = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(pct * 10);
  const empty = 10 - filled;
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(empty);

  let icon;
  if (pct > 0.6) icon = "\uD83D\uDFE2";
  else if (pct > 0.3) icon = "\uD83D\uDFE1";
  else if (pct > 0) icon = "\uD83D\uDD34";
  else icon = "\uD83D\uDC80";

  return `${icon} [${bar}] ${current}/${max}`;
}

/**
 *
 * @param stats
 */
function buildStatSummary(stats = {}) {
  return [
    `HP${stats.hp ?? 0} ATK${stats.atk ?? 0} DEF${stats.def ?? 0} ASPD${stats.aspd ?? 0}`,
    `REF${stats.ref ?? 0} MSP${stats.mspd ?? 0} FUL${stats.fulgor ?? 0}`,
    `DF${stats.d_fulgor ?? 0} RF${stats.r_fulgor ?? 0}`,
  ];
}

/**
 *
 * @param fatigue
 * @param resistance
 */
function buildFatigueBar(fatigue, resistance) {
  const { name: levelName, ratio } = getFatigueLevel(fatigue, resistance);
  const icons = { pleno: "\uD83D\uDFE2", agitado: "\uD83D\uDFE1", cansado: "\uD83D\uDD34", fatigado: "\uD83D\uDD34" };
  const icon = icons[levelName] || "\u26A0\uFE0F";
  const filled = Math.round(ratio * 10);
  const empty = 10 - filled;
  const bar = "\u2588".repeat(Math.min(10, Math.max(0, filled))) + "\u2591".repeat(Math.max(0, empty));
  return `${icon} ${bar} ${fatigue}/${resistance}`;
}

/**
 *
 * @param characterName
 */
function formatActionMenu(characterName) {
  return [
    `\u2694\uFE0F Turno de *${characterName}*`,
    "  \u2022 `/atacar` \u2014 Ataque",
    "  \u2022 `/usar <item>` \u2014 Consumible",
    "  \u2022 `/descansar` \u2014 Fatiga -5",
    "  \u2022 `/huir` \u2014 Escapar",
  ].join("\n");
}

/**
 *
 * @param attackerName
 * @param defenderName
 * @param baseDamage
 * @param canDodgeSuccessfully
 */
function formatReactionPrompt(attackerName, defenderName, baseDamage, canDodgeSuccessfully = false) {
  const dodgeLine = canDodgeSuccessfully
    ? "  \u2022 `/esquivar` \u2192 \u2705 Da\u00F1o: 0"
    : "  \u2022 `/esquivar` \u2192 \u274C Da\u00F1o: " + baseDamage;

  return [
    `\u26A1 *${attackerName}* ataca (${baseDamage})`,
    `\uD83D\uDCA1 *${defenderName}* reacciona:`,
    dodgeLine,
    "  \u2022 `/bloquear` \u2192 \uD83D\uDEE1\uFE0F Da\u00F1o: " + Math.max(1, Math.round(baseDamage * 0.75)),
  ].join("\n");
}

/**
 *
 * @param session
 * @param hasTestKit
 */
function formatCombatOpen(session, hasTestKit = false) {
  const c = session.challenger;
  const d = session.defender;

  const cStats = buildStatSummary(c.character.stats);
  const dStats = buildStatSummary(d.character.stats);

  const lines = [
    "",
    `*${c.character.name}* Nv.${c.character.nivel || 20}`,
    `HP ${buildHpBar(c.hp, c.character.stats?.hp ?? HP_MAX)}`,
    `Fat ${buildFatigueBar(c.fatigue || 0, c.character.stats.def || 1)}`,
    cStats[0],
    cStats[1],
    "",
    "      \u2694\uFE0F VS \u2694\uFE0F",
    "",
    `*${d.character.name}* Nv.${d.character.nivel || 20}`,
    `HP ${buildHpBar(d.hp, d.character.stats?.hp ?? HP_MAX)}`,
    `Fat ${buildFatigueBar(d.fatigue || 0, d.character.stats.def || 1)}`,
    dStats[0],
    dStats[1],
    "",
  ];

  if (hasTestKit) {
    lines.push("\uD83C\uDF92 Consumibles de prueba");
    lines.push("");
  }

  lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
  lines.push(formatActionMenu(c.character.name));

  return box("\u2694\uFE0F COMBATE INICIADO", lines);
}

/**
 *
 * @param result
 */
function formatTurnSummary(result) {
  const lines = [];

  lines.push("");
  lines.push(`\u2694\uFE0F *${result.attackerName}* \u2192 *${result.defenderName}*`);

  if (result.reaction === "dodge") {
    lines.push(`\uD83D\uDCA8 *${result.defenderName}* esquiv\u00F3 (0)`);
  } else if (result.reaction === "dodge_failed") {
    lines.push(`\u274C *${result.defenderName}* fall\u00F3 esquiva`);
    lines.push(`\uD83D\uDCA5 Da\u00F1o: ${result.finalDamage}`);
  } else if (result.reaction === "block") {
    lines.push(`\uD83D\uDEE1\uFE0F *${result.defenderName}* bloque\u00F3`);
    lines.push(`\uD83D\uDCA5 ${result.baseDamage} \u2192 ${result.finalDamage}`);
  } else {
    lines.push(`\uD83D\uDCA5 Da\u00F1o: ${result.finalDamage}`);
  }

  lines.push(`\u2764\uFE0F *${result.defenderName}*: ${result.defenderHpBefore} \u2192 ${result.defenderHpAfter}`);

  if (result.ko) {
    lines.push("");
    lines.push(`\uD83D\uDC80 *${result.defenderName}* ha ca\u00EDdo`);
  }

  return box("\u2694\uFE0F TURNO", lines);
}

/**
 *
 * @param session
 */
function formatCombatStatus(session) {
  const lines = [];
  const c = session.challenger;
  const d = session.defender;

  const currentName = String(session.currentTurnCharId) === String(c.characterId) ? c.character.name : d.character.name;

  const cStats = buildStatSummary(c.character.stats);
  const dStats = buildStatSummary(d.character.stats);

  lines.push("");
  lines.push(`R${session.rounds + 1} Turno *${currentName}*`);
  lines.push("");
  lines.push("\u2500\u2500 RETADOR \u2500\u2500");
  lines.push(`*${c.character.name}* Nv.${c.character.nivel || 20}`);
  lines.push(`HP ${buildHpBar(c.hp, c.character.stats?.hp ?? HP_MAX)}`);
  lines.push(`Fat ${buildFatigueBar(c.fatigue || 0, c.character.stats.def || 1)}`);
  lines.push(cStats[0]);
  lines.push(cStats[1]);
  lines.push("");
  lines.push("\u2500\u2500 DEFENSOR \u2500\u2500");
  lines.push(`*${d.character.name}* Nv.${d.character.nivel || 20}`);
  lines.push(`HP ${buildHpBar(d.hp, d.character.stats?.hp ?? HP_MAX)}`);
  lines.push(`Fat ${buildFatigueBar(d.fatigue || 0, d.character.stats.def || 1)}`);
  lines.push(dStats[0]);
  lines.push(dStats[1]);
  lines.push("");

  lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
  if (session.status === "waiting_reaction" && session.pendingAttack) {
    const p = session.pendingAttack;
    lines.push(formatReactionPrompt(p.attackerName, p.defenderName, p.baseDamage, p.canDodgeSuccessfully ?? false));
  } else {
    lines.push(formatActionMenu(currentName));
  }

  return box("\uD83D\uDCCA ESTADO", lines);
}

/**
 *
 * @param winnerName
 * @param xpGained
 */
function formatVictory(winnerName, xpGained) {
  return box("\uD83C\uDF89 VICTORIA", ["", `\uD83C\uDFC6 *${winnerName}* gan\u00F3`, `\u2728 +${xpGained} XP`]);
}

/**
 *
 * @param fleerName
 * @param success
 * @param chance
 * @param fatigue
 * @param resistance
 */
function formatFlee(fleerName, success, chance, fatigue = 0, resistance = 50) {
  const pct = Math.round(chance * 100);
  if (success) {
    return box(
      "\uD83C\uDFC3 HUIDA",
      [
        "",
        `\u2705 *${fleerName}* escap\u00F3`,
        `Prob: ${pct}%`,
        fatigue > 0 ? `Fat ${buildFatigueBar(fatigue, resistance)}` : "",
      ].filter(Boolean),
    );
  }
  return box("\uD83C\uDFC3 HUIDA", [
    "",
    `\u274C *${fleerName}* interceptado`,
    `Prob: ${pct}%`,
    "\u2694\uFE0F Contraataque",
  ]);
}

/**
 *
 * @param adminName
 */
function formatCombatDisolved(adminName) {
  return box("\uD83D\uDD13 DISUELTO", ["", `${adminName} disolvi\u00F3 el combate`, "Personajes desbloqueados"]);
}

module.exports = {
  buildHpBar,
  buildFatigueBar,
  buildStatSummary,
  formatActionMenu,
  formatReactionPrompt,
  formatCombatOpen,
  formatTurnSummary,
  formatCombatStatus,
  formatVictory,
  formatFlee,
  formatCombatDisolved,
};
