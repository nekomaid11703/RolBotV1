// @ts-nocheck
const { box } = require("../../utils/boxUtils");

/**
 * Genera una barra visual de vida.
 * Ej: [████████░░] 80/100 HP
 * @param current
 * @param max
 */
function buildHpBar(current, max = 100) {
  const pct = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(pct * 10);
  const empty = 10 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  let icon;
  if (pct > 0.6) icon = "🟢";
  else if (pct > 0.3) icon = "🟡";
  else if (pct > 0) icon = "🔴";
  else icon = "💀";

  return `${icon} [${bar}] ${current}/${max} HP`;
}

/**
 *
 * @param stats
 */
function buildStatSummary(stats = {}) {
  const keys = ["atk", "def", "aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor"];
  return keys.map((k) => `${k.toUpperCase()}:${stats[k] ?? 0}`).join("  ");
}

/**
 *
 * @param characterName
 */
function formatActionMenu(characterName) {
  return [
    `⚔️ Turno de *${characterName}* — elige tu acción:`,
    "  • `/atacar` — Realizar un ataque cuerpo a cuerpo",
    "  • `/inventario` / `/usar <item>` — Usar consumible",
    "  • `/huir` — Intentar escapar del combate",
  ].join("\n");
}

/**
 * Genera el submenú de reacción con indicador claro de si el dodge tendrá éxito.
 * @param {string} attackerName
 * @param {string} defenderName
 * @param {number} baseDamage
 * @param {boolean} canDodgeSuccessfully - pre-calculado por el motor
 */
function formatReactionPrompt(attackerName, defenderName, baseDamage, canDodgeSuccessfully = false) {
  const dodgeLine = canDodgeSuccessfully
    ? "  • `/esquivar` — ✅ ¡Puedes esquivar! Evitarás todo el daño."
    : "  • `/esquivar` — ❌ No puedes esquivar actualmente (tu MSPD < ASPD oponente). Sufrirás el daño completo.";

  return [
    `⚡ *${attackerName}* te ha atacado (Daño base: *${baseDamage}*)`,
    `💡 *${defenderName}*, ¿cómo reaccionas?`,
    dodgeLine,
    "  • `/bloquear` — 🛡️ Reduce el daño un 25% de forma segura.",
  ].join("\n");
}

/**
 *
 * @param session
 * @param hasTestKit
 */
function formatCombatOpen(session, hasTestKit = false) {
  const challenger = session.challenger;
  const defender = session.defender;

  const lines = [
    "",
    `👤 *${challenger.character.name}* (Nivel ${challenger.character.nivel || 20})`,
    `   ${buildHpBar(challenger.hp)}`,
    `   ${buildStatSummary(challenger.character.stats)}`,
    "",
    `🤖 *${defender.character.name}* (Nivel ${defender.character.nivel || 20})`,
    `   ${buildHpBar(defender.hp)}`,
    `   ${buildStatSummary(defender.character.stats)}`,
    "",
  ];

  if (hasTestKit) {
    lines.push("🎒 *Consumibles de prueba añadidos: venda, poción, tónico, antídoto.*");
    lines.push("");
  }

  lines.push("✦ ━━━━━━━━━━━━━━ ✦");
  lines.push(formatActionMenu(challenger.character.name));

  return box("⚔️ COMBATE INICIADO", lines);
}

/**
 *
 * @param result
 */
function formatTurnSummary(result) {
  const lines = [];

  lines.push("");
  lines.push(`⚔️  *${result.attackerName}* ataca a *${result.defenderName}*`);

  if (result.reaction === "dodge") {
    lines.push(`💨  ¡*${result.defenderName}* esquivó el ataque! Daño: 0`);
  } else if (result.reaction === "dodge_failed") {
    lines.push(`❌  *${result.defenderName}* intentó esquivar pero falló.`);
    lines.push(`💥  Daño: ${result.finalDamage}`);
  } else if (result.reaction === "block") {
    lines.push(`🛡️  *${result.defenderName}* bloqueó el ataque.`);
    lines.push(`💥  Daño: ${result.baseDamage} → ${result.finalDamage} (−25%)`);
  } else {
    lines.push(`💥  Daño: ${result.finalDamage}`);
  }

  lines.push(`❤️  *${result.defenderName}*: ${result.defenderHpBefore} → ${result.defenderHpAfter} HP`);

  if (result.ko) {
    lines.push("");
    lines.push(`💀  ¡*${result.defenderName}* ha caído!`);
  }

  return box("⚔️ RESUMEN DE ATAQUE", lines);
}

/**
 *
 * @param session
 */
function formatCombatStatus(session) {
  const lines = [];
  const challenger = session.challenger;
  const defender = session.defender;

  const currentTurnCharName =
    String(session.currentTurnCharId) === String(challenger.characterId)
      ? challenger.character.name
      : defender.character.name;

  lines.push("");
  lines.push(`📅  Ronda: ${session.rounds + 1}  |  🔄 Turno de: *${currentTurnCharName}*`);
  lines.push("");
  lines.push("── RETADOR ──");
  lines.push(`👤  *${challenger.character.name}*`);
  lines.push(`    ${buildHpBar(challenger.hp)}`);
  lines.push(`    ${buildStatSummary(challenger.character.stats)}`);
  lines.push("");
  lines.push("── DEFENSOR ──");
  lines.push(`👤  *${defender.character.name}*`);
  lines.push(`    ${buildHpBar(defender.hp)}`);
  lines.push(`    ${buildStatSummary(defender.character.stats)}`);
  lines.push("");

  lines.push("✦ ━━━━━━━━━━━━━━ ✦");
  if (session.status === "waiting_reaction" && session.pendingAttack) {
    const p = session.pendingAttack;
    lines.push(formatReactionPrompt(p.attackerName, p.defenderName, p.baseDamage, p.canDodgeSuccessfully ?? false));
  } else {
    lines.push(formatActionMenu(currentTurnCharName));
  }

  return box("📊 ESTADO DEL COMBATE", lines);
}

/**
 *
 * @param winnerName
 * @param xpGained
 */
function formatVictory(winnerName, xpGained) {
  return box("🎉 VICTORIA", ["", `🏆  ¡*${winnerName}* ha ganado el combate!`, `✨  XP ganada: +${xpGained}`]);
}

/**
 *
 * @param fleerName
 * @param success
 * @param chance
 */
function formatFlee(fleerName, success, chance) {
  const pct = Math.round(chance * 100);
  if (success) {
    return box("🏃 HUIDA EXITOSA", [
      "",
      `✅  *${fleerName}* escapó del combate.`,
      `📊  Probabilidad de éxito era: ${pct}%`,
    ]);
  }
  return box("🏃 HUIDA FALLIDA", [
    "",
    `❌  *${fleerName}* intentó huir pero fue interceptado.`,
    `📊  Probabilidad de éxito era: ${pct}% — ¡Mala suerte!`,
    `⚔️  El oponente aprovecha y realiza un contraataque.`,
  ]);
}

/**
 *
 * @param adminName
 */
function formatCombatDisolved(adminName) {
  return box("🔓 COMBATE DISUELTO", [
    "",
    `El administrador ${adminName} ha disuelto el combate.`,
    "Los personajes involucrados han sido desbloqueados.",
  ]);
}

module.exports = {
  buildHpBar,
  formatActionMenu,
  formatReactionPrompt,
  formatCombatOpen,
  formatTurnSummary,
  formatCombatStatus,
  formatVictory,
  formatFlee,
  formatCombatDisolved,
};
