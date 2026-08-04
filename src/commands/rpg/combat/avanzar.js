const { getActiveCharacter } = require("../../../services/characterService");
const { findSessionByCharacter, updateDistance } = require("../../../services/rpg/combatState");
const { calculateMovementFatigue, capFatigue, getMovementRange } = require("../../../services/rpg/fatigueEngine");
const { checkAttackRange } = require("../../../services/rpg/combatEngine");
const { formatMovement, formatOutOfRange, formatActionMenu } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");

/**
 * @constant usageMessage
 */
const _usageMessage = formatCommandUsage({
  icon: "\uD83D\uDEB6",
  title: "Avanzar",
  description: "Avanzas hacia tu enemigo. Si después de moverte lo alcanzas, podrás atacar.",
  usage: "/avanzar <metros>",
  example: "/avanzar 5",
  notes: ["El rango de movimiento depende de tu MSPD.", "Coste de fatiga: más metros = más coste."],
});

module.exports = {
  name: "avanzar",
  aliases: ["advance", "acercar", "forward"],
  description: "Avanza hacia tu enemigo en el combate activo.",
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
      return ctx.reply(formatError("Debes especificar cuántos metros avanzar.", "Uso: /avanzar <metros>"));
    }

    /**
     * @constant isChallenger
     */
    const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
    /**
     * @constant playerSlot
     */
    const playerSlot = isChallenger ? session.challenger : session.defender;

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
    const newDistance = Math.max(0, session.distance - meters);
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

    if (canAttack) {
      const lines = [
        formatMovement(activeChar.name, "advanced", meters, newDistance, fatigueCost),
        "",
        `\u2705 *${activeChar.name}* puede atacar (${newDistance}m \u2264 ${effectiveRange}m)`,
        "",
        "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
        formatActionMenu(activeChar.name),
      ];

      return ctx.reply(box("\uD83D\uDEB6 AVANCE", lines));
    }

    const lines = [
      formatMovement(activeChar.name, "advanced", meters, newDistance, fatigueCost),
      "",
      formatOutOfRange(activeChar.name, meters, newDistance, effectiveRange),
      "",
      "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
      formatActionMenu(activeChar.name),
    ];

    return ctx.reply(box("\uD83D\uDEB6 AVANCE", lines));
  },
};
