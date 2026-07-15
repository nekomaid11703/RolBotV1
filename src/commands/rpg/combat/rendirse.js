// @ts-nocheck
/**
 * rendirse.js — Comando de rendición en combate
 *
 * Aliases: /rendir, /rindo, /abandonar, /ff
 * Funciona en cualquier tipo de combate (PvE o PvP).
 */

const stateManager = require("../../../services/rpg/combatStateManager");
const turnManager = require("../../../services/rpg/combatTurnManager");
const { formatError } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");

module.exports = {
  name: "rendirse",
  aliases: ["rendir", "rindo", "abandonar", "ff"],
  description: "Rendirse en un combate. Usa: /rendirse",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = stateManager.getRoomByGroup(ctx.from);
      if (!room || room.status !== "active") {
        return ctx.reply(formatError("No hay combate activo aquí."));
      }

      const participant = turnManager.getParticipantByJid(room, ctx.sender);
      if (!participant) {
        return ctx.reply("❌ No formas parte de este combate.");
      }

      if (participant.ko) {
        return ctx.reply("💀 Ya estás K.O.");
      }

      // Marcar como KO
      participant.ko = true;
      participant.hp = 0;

      const playerName = participant.name;

      // Verificar victoria
      const victory = turnManager.checkVictoryConditions(room);
      if (victory.finished) {
        room.status = "finished";
        await stateManager.updateRoom(room.id, {});
        return ctx.reply(`🏳️ *${playerName}* se rinde.\n\n${victory.message}`);
      }

      // Si el combate continúa (multijugador)
      await stateManager.updateRoom(room.id, {});
      const status = turnManager.formatStatus(room);
      return ctx.reply(`🏳️ *${playerName}* se rinde del combate.\n\n${status}`);
    } catch (error) {
      logError({ source: "rendirse", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
