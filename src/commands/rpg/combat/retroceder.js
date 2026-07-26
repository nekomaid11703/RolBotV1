const { getActiveCharacter } = require("../../../services/characterService");
const { findSessionByCharacter, updateDistance } = require("../../../services/rpg/combatState");
const { calculateMovementFatigue, capFatigue, getMovementRange } = require("../../../services/rpg/fatigueEngine");
const { checkAttackRange } = require("../../../services/rpg/combatEngine");
const {
  formatMovement,
  formatOutOfRange,
  formatActionMenu,
  buildFatigueBar,
} = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");
const { MAX_DISTANCE } = require("../../../config/combatConfig");

const usageMessage = formatCommandUsage({
  icon: "\u21A9\uFE0F",
  title: "Retroceder",
  description: "Retrocedes de tu enemigo. Si despuÃ©s de moverte lo alcanzas, podrÃ¡s atacar.",
  usage: "/retroceder <metros>",
  example: "/retroceder 5",
  notes: ["El rango de movimiento depende de tu MSPD.", "Coste de fatiga: mÃ¡s metros = mÃ¡s coste."],
});

module.exports = {
  name: "retroceder",
  aliases: ["retreat", "retroceso", "back"],
  description: "Retrocede de tu enemigo en el combate activo.",
  category: "rpg",

  /**
   * @param {{ reply: (msg: string) => any, sender: string, userName: string, args: string[] }} ctx - Contexto del comando
   * @returns {Promise<void>}
   */
  async execute(ctx) {
    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("\u274C No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
      }

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

      const meters = parseInt(ctx.args[0], 10);
      if (!meters || meters <= 0) {
        return ctx.reply(formatError("Debes especificar cuÃ¡ntos metros retroceder.", "Uso: /retroceder <metros>"));
      }

      const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
      const playerSlot = isChallenger ? session.challenger : session.defender;

      const maxMove = getMovementRange(activeChar.stats.mspd || 0);
      if (meters > maxMove) {
        return ctx.reply(
          formatError(
            `Solo puedes moverte ${maxMove}m como mÃ¡ximo.`,
            `Tu MSPD: ${activeChar.stats.mspd || 0} (${maxMove}m de alcance)`,
          ),
        );
      }

      const newDistance = Math.min(MAX_DISTANCE, session.distance + meters);
      const fatigueCost = calculateMovementFatigue(meters);
      playerSlot.fatigue = capFatigue(playerSlot.fatigue + fatigueCost);

      await updateDistance(session.id, newDistance);

      const attackerStats = activeChar.stats;
      const { canAttack, effectiveRange } = checkAttackRange(newDistance, attackerStats);

      if (canAttack) {
        const lines = [
          formatMovement(activeChar.name, "retreated", meters, newDistance, fatigueCost),
          "",
          `\u2705 *${activeChar.name}* puede atacar (${newDistance}m \u2264 ${effectiveRange}m)`,
          "",
          "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
          formatActionMenu(activeChar.name),
        ].join("\n");

        return ctx.reply(box("\u21A9\uFE0F RETROCESO", lines));
      }

      const lines = [
        formatMovement(activeChar.name, "retreated", meters, newDistance, fatigueCost),
        "",
        formatOutOfRange(activeChar.name, meters, newDistance, effectiveRange),
        "",
        "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
        formatActionMenu(activeChar.name),
      ].join("\n");

      return ctx.reply(box("\u21A9\uFE0F RETROCESO", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
