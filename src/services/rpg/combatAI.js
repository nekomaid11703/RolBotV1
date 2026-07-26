// @ts-nocheck
const { executeTurn, calculateXpReward } = require("./combatEngine");
const { advanceTurn, endSession, isSessionActive } = require("./combatState");
const { addXp, setHp } = require("../characterService");

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
  static executeAiTurn(session) {
    if (!session || !isSessionActive(session) || !session.isPvE) {
      return null;
    }

    /**
     * @constant isChallengerAi
     */
    const isChallengerAi = session.challenger.isBot;
    /**
     * @constant aiSlot
     */
    const aiSlot = isChallengerAi ? session.challenger : session.defender;
    /**
     * @constant playerSlot
     */
    const playerSlot = isChallengerAi ? session.defender : session.challenger;

    /**
     * @constant turnResult
     */
    const turnResult = executeTurn(
      aiSlot.character,
      playerSlot.character,
      playerSlot.hp,
      aiSlot.hp,
      null,
      aiSlot.fatigue,
      playerSlot.fatigue,
    );

    /**
     * @constant newAttackerHp
     */
    const newAttackerHp = isChallengerAi ? turnResult.defenderHpAfter : session.challenger.hp;
    /**
     * @constant newDefenderHp
     */
    const newDefenderHp = isChallengerAi ? session.defender.hp : turnResult.defenderHpAfter;

    advanceTurn(session.id, newAttackerHp, newDefenderHp);

    if (turnResult.ko) {
      /**
       * @constant winnerChar
       */
      const winnerChar = aiSlot.character;
      /**
       * @constant loserChar
       */
      const loserChar = playerSlot.character;
      /**
       * @constant xpReward
       */
      const xpReward = calculateXpReward(winnerChar.nivel || 1, false);

      endSession(session.id, winnerChar.id);

      try {
        addXp({
          creatorId: playerSlot.userId,
          characterName: loserChar.name,
          cantidad: xpReward,
        }).catch(() => {});

        setHp({
          creatorId: playerSlot.userId,
          characterName: loserChar.name,
          hp: 0,
        }).catch(() => {});
      } catch {
        /* non-critical on KO */
      }
    }

    return turnResult;
  }
}

module.exports = CombatAI;
