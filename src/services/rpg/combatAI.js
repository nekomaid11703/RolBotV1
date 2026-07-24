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

    const isChallengerAi = session.challenger.isBot;
    const aiSlot = isChallengerAi ? session.challenger : session.defender;
    const playerSlot = isChallengerAi ? session.defender : session.challenger;

    const turnResult = executeTurn(
      aiSlot.character,
      playerSlot.character,
      playerSlot.hp,
      aiSlot.hp,
      null,
      aiSlot.fatigue,
      playerSlot.fatigue,
    );

    const newAttackerHp = isChallengerAi ? turnResult.defenderHpAfter : session.challenger.hp;
    const newDefenderHp = isChallengerAi ? session.defender.hp : turnResult.defenderHpAfter;

    advanceTurn(session.id, newAttackerHp, newDefenderHp);

    if (turnResult.ko) {
      const winnerChar = aiSlot.character;
      const loserChar = playerSlot.character;
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
      } catch (_err) {}
    }

    return turnResult;
  }
}

module.exports = CombatAI;
