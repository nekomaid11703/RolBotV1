const { getActiveCharacter } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  updateDistance,
  advanceTurn,
  isActionBlocked,
} = require("../../../services/rpg/combatState");
const { calculateMovementFatigue, capFatigue, getMovementRange } = require("../../../services/rpg/fatigueEngine");
const { checkAttackRange } = require("../../../services/rpg/combatEngine");
const { runDummyTurn } = require("../../../services/rpg/dummyTurnService");
const { formatMovement, formatOutOfRange, formatActionMenu } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");
const { MAX_DISTANCE } = require("../../../config/combatConfig");

/**
 * @constant usageMessage
 */
const _usageMessage = formatCommandUsage({
  icon: "\u21A9\uFE0F",
  title: "Retroceder",
  description: "Retrocedes de tu enemigo. Si después de moverte lo alcanzas, podrás atacar.",
  usage: "/retroceder <metros>",
  example: "/retroceder 5",
  notes: ["El rango de movimiento depende de tu MSPD.", "Coste de fatiga: más metros = más coste."],
});

module.exports = {
  name: "retroceder",
  aliases: ["retreat", "retroceso", "back"],
  description: "Retrocede de tu enemigo en el combate activo.",
  category: "rpg",

  /**
   * @param {*} ctx
   * @returns {Promise<void>}
   */
  async execute(ctx) {
    /**
     * @constant activeChar
     */
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("\u274C No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    /**
     * @constant session
     */
    const session = findSessionByCharacter(activeChar.id);
    if (!session) {
      return ctx.reply("\u274C No est\u00E1s en combate. Usa `/retar @usuario` o `/retar dummy`.");
    }

    if (session.status === "waiting_reaction") {
      return ctx.reply("\u274C Hay ataque pendiente. Usa `/esquivar` o `/bloquear`.");
    }

    if (String(session.currentTurnCharId) !== String(activeChar.id)) {
      return ctx.reply("\u274C No es tu turno. Espera.");
    }

    /**
     * @constant meters
     */
    const meters = parseInt(ctx.args[0], 10);
    if (!meters || meters <= 0) {
      return ctx.reply(formatError("Debes especificar cuántos metros retroceder.", "Uso: /retroceder <metros>"));
    }

    /**
     * @constant isChallenger
     */
    const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
    /**
     * @constant playerSlot
     */
    const playerSlot = isChallenger ? session.challenger : session.defender;
    if (isActionBlocked(playerSlot, "move")) {
      return ctx.reply("\u274C Estás inmovilizado y no puedes retroceder.");
    }

    /**
     * @constant maxMove
     */
    const maxMove = getMovementRange(activeChar.stats.mspd || 0);
    if (meters > maxMove) {
      return ctx.reply(
        formatError(
          `Solo puedes moverte ${maxMove}m como máximo.`,
          `Tu MSPD: ${activeChar.stats.mspd || 0} (${maxMove}m de alcance)`,
        ),
      );
    }

    /**
     * @constant newDistance
     */
    const newDistance = Math.min(MAX_DISTANCE, session.distance + meters);
    /**
     * @constant fatigueCost
     */
    const fatigueCost = calculateMovementFatigue(meters);
    playerSlot.fatigue = capFatigue(playerSlot.fatigue + fatigueCost);

    await updateDistance(session.id, newDistance);

    /**
     * @constant attackerStats
     */
    const attackerStats = activeChar.stats;
    const { canAttack, effectiveRange } = checkAttackRange(newDistance, attackerStats);

    // Opción 1: moverse consume el turno. Fuera de rango → solo mover (sin atacar).
    const movementLine = formatMovement(activeChar.name, "retreated", meters, newDistance, fatigueCost);

    if (session.isPvE) {
      // Turno del jugador gastado: pasa el turno al dummy y lo resuelve (ataca o avanza).
      await advanceTurn(session.id, session.challenger.hp, session.defender.hp, true);
      return runDummyTurn(ctx, session, isChallenger, [movementLine]);
    }

    await advanceTurn(session.id, session.challenger.hp, session.defender.hp);

    const lines = [
      movementLine,
      "",
      canAttack
        ? `\u2705 *${activeChar.name}* qued\u00F3 en rango (${newDistance}m \u2264 ${effectiveRange}m)`
        : formatOutOfRange(activeChar.name, meters, newDistance, effectiveRange),
      "",
      "\u23E9 Turno gastado en el movimiento.",
      "",
      "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
      formatActionMenu(
        session.currentTurnCharId === session.challenger.characterId
          ? session.challenger.character.name
          : session.defender.character.name,
      ),
    ];

    return ctx.reply(box("\u21A9\uFE0F RETROCESO", lines));
  },
};
