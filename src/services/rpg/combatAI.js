// @ts-nocheck
const { checkAttackRange } = require("./combatEngine");
const { getMovementRange } = require("./fatigueEngine");

/**
 * Sistema de IA de combate extensible para PvE.
 */
class CombatAI {
  /**
   * Decide la acción de la IA basada en la distancia al oponente.
   * @param {object} session
   * @param {object} aiSlot
   * @param {object} playerSlot
   * @returns {{ movement: object|null, action: string }}
   */
  static makeDecision(session, aiSlot, _playerSlot) {
    const { canAttack } = checkAttackRange(session.distance, aiSlot.character.stats);
    if (canAttack) {
      return { movement: null, action: "attack" };
    }
    const maxMove = getMovementRange(aiSlot.character.stats.mspd || 0);
    const newDistance = Math.max(0, session.distance - maxMove);
    return { movement: { direction: "advanced", meters: maxMove, newDistance }, action: "advance" };
  }
}

module.exports = CombatAI;
