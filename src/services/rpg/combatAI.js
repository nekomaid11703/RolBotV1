// @ts-nocheck
const { executeTurn } = require("./combatEngine");
const { advanceTurn, endSession, isSessionActive } = require("./combatState");
const { setHp } = require("../characterService");

/**
 * Sistema de IA de combate extensible para PvE.
 * En la v1.0 implementa la estrategia de Dummy de entrenamiento.
 */
class CombatAI {
  /**
   * Ejecuta el turno de la IA en una sesión PvE activa.
   * @param {object} session Sesión de combate activa
   * @returns {object} Resultado del turno ejecutado por la IA
   */
  static async executeAiTurn(session) {
    if (!session || !isSessionActive(session) || !session.isPvE) {
      return null;
    }

    const isChallengerAi = session.challenger.isBot;
    const aiSlot = isChallengerAi ? session.challenger : session.defender;
    const playerSlot = isChallengerAi ? session.defender : session.challenger;

    const turnResult = executeTurn(aiSlot.character, playerSlot.character, playerSlot.hp);

    const newChallengerHp = isChallengerAi ? session.challenger.hp : turnResult.defenderHpAfter;
    const newDefenderHp = isChallengerAi ? turnResult.defenderHpAfter : session.defender.hp;

    await advanceTurn(session.id, newChallengerHp, newDefenderHp);

    if (turnResult.ko) {
      const winnerChar = aiSlot.character;
      const loserChar = playerSlot.character;

      await endSession(session.id, winnerChar.id);
      await setHp({
        creatorId: playerSlot.userId,
        characterName: loserChar.name,
        hp: 0,
      });
    }

    return turnResult;
  }
}

module.exports = CombatAI;
