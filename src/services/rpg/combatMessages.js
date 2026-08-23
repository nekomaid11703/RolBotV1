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
 * @param {object} [ctx] - Contexto situacional {distance, enemyHp, enemyMaxHp, availableFulgor, maxFulgor}
 * @returns {string} Menú de acciones formateado
 */
function formatActionMenu(characterName, session, ctx) {
  return actionMenuLines(characterName, session, ctx).join("\n");
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
function formatReactionPrompt(attackerName, defenderName, baseDamage, canDodgeSuccessfully = false, dodgeChancePct) {
  return reactionPromptLines(attackerName, defenderName, baseDamage, canDodgeSuccessfully, dodgeChancePct).join("\n");
}

/**
 * Calcula el contexto situacional del slot en turno frente a su oponente.
 * @param {object} mySlot - Slot del jugador en turno
 * @param {object} oppSlot - Slot del oponente
 * @param {number} distance - Distancia actual en metros
 * @returns {{distance: number, enemyHp: number, enemyMaxHp: number, availableFulgor: number, maxFulgor: number}}
 */
function buildSituationalCtx(mySlot, oppSlot, distance) {
  const maxFulgor = Math.min(100, Math.max(10, (mySlot.character.stats?.fulgor || 1) * 2));
  const spentFulgor = mySlot.spentFulgor || 0;
  const availableFulgor = Math.max(0, maxFulgor - spentFulgor);
  const enemyMaxHp = Math.max(1, (oppSlot.character.stats?.hp || 1) * 2);
  return { distance: distance ?? 5, enemyHp: oppSlot.hp, enemyMaxHp, availableFulgor, maxFulgor };
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

  const isCurrent = String(session.currentTurnCharId) === String(c.characterId);
  const currentSlot = isCurrent ? c : d;
  const oppSlot = isCurrent ? d : c;
  const currentName = currentSlot.character.name;

  const cEq = equipmentSectionLines(equipmentMap?.challenger);
  const dEq = equipmentSectionLines(equipmentMap?.defender);

  const situationalCtx = buildSituationalCtx(currentSlot, oppSlot, session.distance);

  // Fulgor de cada slot para mostrarlo
  const cMaxFulgor = Math.min(100, Math.max(10, (c.character.stats?.fulgor || 1) * 2));
  const dMaxFulgor = Math.min(100, Math.max(10, (d.character.stats?.fulgor || 1) * 2));
  const cFulgor = Math.max(0, cMaxFulgor - (c.spentFulgor || 0));
  const dFulgor = Math.max(0, dMaxFulgor - (d.spentFulgor || 0));

  const sections = [];
  sections.push([`R${session.rounds + 1}  ⚔️ Turno de *${currentName}*  📍 ${session.distance ?? 5}m`]);
  sections.push([`── ${c.character.name} ──`, ...combatantLines(c), ...activeEffectLines(c), `✨ Fulgor: ${cFulgor}/${cMaxFulgor}`]);
  if (cEq.length > 0) sections.push(cEq);
  sections.push([`── ${d.character.name} ──`, ...combatantLines(d), ...activeEffectLines(d), `✨ Fulgor: ${dFulgor}/${dMaxFulgor}`]);
  if (dEq.length > 0) sections.push(dEq);

  sections.push(["\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726"]);
  if (session.status === "waiting_reaction" && session.pendingAttack) {
    const p = session.pendingAttack;
    sections.push(reactionPromptLines(p.attackerName, p.defenderName, p.baseDamage, p.canDodgeSuccessfully ?? false, p.dodgeChancePct));
  } else {
    sections.push(actionMenuLines(currentName, session, situationalCtx));
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

/**
 * Línea de evento de REACCIÓN ELEMENTAL (Fase 4) para los mensajes de ataque.
 * Solo muestra línea si la reacción disparó (evento instantáneo); los casos de
 * imbuición/refresco persisten el aura sin spam en el chat.
 * @param {object|null} decision - Decisión de `applyElementalHit` (o null)
 * @returns {string|null} Línea formateada o null si no hay evento que mostrar
 */
function formatElementReactionLine(decision) {
  if (!decision || !decision.reacciono || !decision.reaction) return null;
  const mult = Number(decision.multiplicador) || 1;
  const efectos = Array.isArray(decision.efectos) && decision.efectos.length ? ` [${decision.efectos.join(", ")}]` : "";
  return `\u26A1 Reacci\u00F3n *${decision.reaction.label}* \u00D7${mult}${efectos}`;
}

function formatEffectEventLines(events) {
  if (!Array.isArray(events)) return [];
  return events
    .map((event) => {
      if (event.type === "apply") return `Estado aplicado: *${event.effect}* (${event.turnos} turnos)`;
      if (event.type === "tick") return `${event.effect}: -${event.dano} HP`;
      if (event.type === "expire") return `${event.effect} se disipó`;
      if (event.type === "purify")
        return event.removed.length ? `Purificado: ${event.removed.join(", ")}` : "Purificado: sin estados negativos";
      if (event.type === "damage") return `${event.effect}: -${event.dano} HP`;
      return null;
    })
    .filter(Boolean);
}

function activeEffectLines(slot) {
  const effects = Array.isArray(slot?.activeEffects) ? slot.activeEffects : [];
  if (!effects.length) return [];
  return [`Estados: ${effects.map((effect) => `${effect.tipo} (${effect.turnos}t)`).join(", ")}`];
}

module.exports = {
  buildFatigueBar,
  buildStatSummary,
  buildSituationalCtx,
  formatActionMenu,
  formatReactionPrompt,
  formatCombatOpen,
  formatCombatStatus,
  formatFlee,
  formatCombatDisolved,
  formatMovement,
  formatOutOfRange,
  formatElementReactionLine,
  formatEffectEventLines,
  activeEffectLines,
};
