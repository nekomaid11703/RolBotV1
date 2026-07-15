// @ts-nocheck
/**
 * combate.js — Muestra el estado del combate activo
 *
 * Aliases: /combat, /status, /pelea, /batalla
 * Muestra barras HP, turno actual, y shortcuts disponibles.
 */

const stateManager = require("../../../services/rpg/combatStateManager");
const turnManager = require("../../../services/rpg/combatTurnManager");
const { formatError } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");

module.exports = {
  name: "combate",
  aliases: ["combat", "status", "pelea", "batalla"],
  description: "Muestra el estado del combate activo.",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = stateManager.getRoomByGroup(ctx.from);
      if (!room) {
        return ctx.reply(formatError("No hay combate activo aquí.", "Usa /atacar <enemigo> para iniciar uno."));
      }

      if (room.status !== "active") {
        return ctx.reply("🏁 Este combate ya terminó. Usa /atacar para iniciar uno nuevo.");
      }

      // Verificar timeout
      const timedOut = turnManager.checkTimeout(room);
      if (timedOut) {
        const skipResult = await turnManager.applySkip(room, "timeout");
        if (skipResult) {
          await stateManager.updateRoom(room.id, {});
          const status = turnManager.formatStatus(room);
          return ctx.reply(`${skipResult.message}\n\n${status}`);
        }
      }

      const status = turnManager.formatStatus(room);
      const current = turnManager.getCurrentParticipant(room);

      let hint = "";
      if (current && current.id === ctx.sender) {
        hint = "\n\n👉 *Es tu turno.* Usa `.a` `.e` `.b` `.u` o `.h`";
      } else if (current) {
        hint = `\n\n⏳ Turno de *${current.name}*.`;
      }

      return ctx.reply(status + hint);
    } catch (error) {
      logError({ source: "combate", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
