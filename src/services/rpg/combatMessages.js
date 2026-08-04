// @ts-nocheck
const { box } = require("../../utils/boxUtils");
const { composeMessage } = require("../../ui/sectionBuilder");
const { buildFatigueBar, buildStatSummary } = require("../../ui/sections/combatStats");
const {
  combatantLines,
  equipmentSectionLines,
  actionMenuLines,
  reactionPromptLines,
} = require("../../ui/sections/combatSections");

/**
 * Genera el menú de acciones disponibles para el turno actual.
 * Delegado a combatSections (data-driven desde COMBAT_ACTIONS).
 * @param {string} characterName - Nombre del personaje en turno
 * @param {object} [session] - Sesión de combate
 * @returns {string} Menú de acciones formateado
 */
function formatActionMenu(characterName, session) {
  return actionMenuLines(characterName, session).join("\n");
}

/**
 * Genera el prompt de reacción para el defensor ante un ataque entrante.
 * Delegado a combatSections (data-driven desde REACTION_ACTIONS).
 * @param {string} attackerName - Nombre del atacante
 * @param {string} defenderName - Nombre del defensor
 * @param {number} baseDamage - Daño base del ataque
 * @param {boolean} [canDodgeSuccessfully] - Si puede esquivar exitosamente
 * @returns {string} Prompt de reacción formateado
 */
function formatReactionPrompt(attackerName, defenderName, baseDamage, canDodgeSuccessfully = false) {
  return reactionPromptLines(attackerName, defenderName, baseDamage, canDodgeSuccessfully).join("\n");
}

/**
 * Genera las líneas de equipo de un combatiente para la UI de combate.
 * Muestra arma, piezas de armadura con durabilidad, artefactos y bonos de set.
 * Delegado a equipmentSections (sin emojis de ítem).
 * @param {object} eq - Resumen de equipo (resolveCharacterEquipment)
 * @returns {string[]} Líneas de equipo formateadas (vacío si no hay equipo)
 */
function formatEquipmentSummary(eq) {
  return equipmentSectionLines(eq);
}

/**
 * Formatea el mensaje de apertura de combate con estadísticas de ambos participantes.
 * @param {*} session - Sesión de combate
 * @param {boolean} [hasTestKit] - Si el personaje tiene kit de prueba
 * @param {{challenger: object, defender: object}} [equipmentMap] - Resumen de equipo por bando
 * @returns {string} Mensaje de apertura formateado
 */
function formatCombatOpen(session, hasTestKit = false, equipmentMap = {}) {
  const c = session.challenger;
  const d = session.defender;

  const cEq = equipmentSectionLines(equipmentMap?.challenger);
  const dEq = equipmentSectionLines(equipmentMap?.defender);

  const sections = [combatantLines(c)];
  if (cEq.length > 0) sections.push(cEq);
  sections.push(["      \u2694\uFE0F VS \u2694\uFE0F"]);
  sections.push(combatantLines(d));
  if (dEq.length > 0) sections.push(dEq);
  if (hasTestKit) {
    sections.push(["\uD83C\uDF92 Consumibles de prueba"]);
  }
  sections.push([
    "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
    ...actionMenuLines(c.character.name),
  ]);

  return composeMessage({ title: "\u2694\uFE0F COMBATE INICIADO", sections });
}

/**
 * Formatea el estado completo del combate con HP, fatiga y acciones disponibles.
 * @param {*} session - Sesión de combate
 * @param {{challenger: object, defender: object}} [equipmentMap] - Resumen de equipo por bando
 * @returns {string} Estado del combate formateado
 */
function formatCombatStatus(session, equipmentMap = {}) {
  const c = session.challenger;
  const d = session.defender;

  const currentName = String(session.currentTurnCharId) === String(c.characterId) ? c.character.name : d.character.name;

  const cEq = equipmentSectionLines(equipmentMap?.challenger);
  const dEq = equipmentSectionLines(equipmentMap?.defender);

  const sections = [];
  sections.push([`R${session.rounds + 1} Turno *${currentName}*`]);
  sections.push(["\u2500\u2500 RETADOR \u2500\u2500", ...combatantLines(c)]);
  if (cEq.length > 0) sections.push(cEq);
  sections.push(["\u2500\u2500 DEFENSOR \u2500\u2500", ...combatantLines(d)]);
  if (dEq.length > 0) sections.push(dEq);

  sections.push(["\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726"]);
  if (session.status === "waiting_reaction" && session.pendingAttack) {
    const p = session.pendingAttack;
    sections.push(reactionPromptLines(p.attackerName, p.defenderName, p.baseDamage, p.canDodgeSuccessfully ?? false));
  } else {
    sections.push(actionMenuLines(currentName));
  }

  return composeMessage({ title: "\uD83D\uDCCA ESTADO", sections });
}

/**
 * Formatea el resultado de un intento de huida.
 * @param {string} fleerName - Nombre del personaje que huye
 * @param {boolean} success - Si la huida fue exitosa
 * @param {number} chance - Probabilidad de éxito (0-1)
 * @param {number} [fatigue] - Nivel de fatiga actual
 * @param {number} [resistance] - Resistencia máxima
 * @returns {string} Mensaje de huida formateado
 */
function formatFlee(fleerName, success, chance, fatigue = 0, resistance = 50) {
  /**
   * @constant pct
   */
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
 * Formatea el mensaje de combate disuelto por un administrador.
 * @param {string} adminName - Nombre del administrador que disolvió el combate
 * @returns {string} Mensaje de disolución formateado
 */
function formatCombatDisolved(adminName) {
  return box("\uD83D\uDD13 DISUELTO", ["", `${adminName} disolvi\u00F3 el combate`, "Personajes desbloqueados"]);
}

/**
 * Format a movement action message.
 * @param {string} name
 * @param {string} action
 * @param {number} meters
 * @param {number} newDistance
 * @param {number} fatigueCost
 * @returns {string}
 */
function formatMovement(name, action, meters, newDistance, fatigueCost) {
  const actionText = action === "advanced" ? "avanz\u00F3" : "retrocedi\u00F3";
  return `\uD83D\uDEB6 *${name}* ${actionText} ${meters}m  |  Distancia: ${newDistance}m  |  Fatiga: +${fatigueCost}`;
}

/**
 * Format an out-of-range warning message.
 * @param {string} name
 * @param {number} meters
 * @param {number} newDistance
 * @param {number} effectiveRange
 * @returns {string}
 */
function formatOutOfRange(name, meters, newDistance, effectiveRange) {
  return `\u26A0\uFE0F *${name}* a ${newDistance}m (alcance: ${effectiveRange}m) — demasiado lejos para atacar`;
}

module.exports = {
  buildFatigueBar,
  buildStatSummary,
  formatActionMenu,
  formatReactionPrompt,
  formatEquipmentSummary,
  formatCombatOpen,
  formatCombatStatus,
  formatFlee,
  formatCombatDisolved,
  formatMovement,
  formatOutOfRange,
};
