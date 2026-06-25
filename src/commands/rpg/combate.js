const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "combate",
  aliases: ["combat", "status", "pelea", "batalla"],
  description: "Muestra el estado del combate activo en este grupo.",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = stateManager.getRoomByGroup(ctx.from);
      if (!room) {
        return ctx.reply(formatError("No hay combate activo aquí.", "Usa /atacar <enemigo> para iniciar uno."));
      }

      if (room.status !== 'active') {
        return ctx.reply("Este combate ya terminó. Usa /atacar para iniciar uno nuevo.");
      }

      const timedOut = turnManager.checkTimeout(room);
      if (timedOut) {
        const skipResult = await turnManager.applySkip(room, 'timeout');
        if (skipResult) {
          await stateManager.updateRoom(room.id, {});
          const status = turnManager.formatStatus(room);
          return ctx.reply(`${skipResult.message}\n\n${status}`);
        }
      }

      const status = turnManager.formatStatus(room);
      return ctx.reply(status);

    } catch (error) {
      console.error('combate error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
