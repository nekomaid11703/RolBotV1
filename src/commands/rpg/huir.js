const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const combatEngine = require("../../services/rpg/combatEngine");
const combatNarrator = require("../../services/rpg/combatNarrator");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "huir",
  aliases: ["flee", "escape", "escapar"],
  description: "Intentas huir del combate actual.",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = stateManager.getRoomByGroup(ctx.from);
      if (!room) {
        return ctx.reply(formatError("No hay combate activo aquí.", "Usa /atacar <enemigo> para iniciar uno."));
      }

      const participant = turnManager.getParticipantByJid(room, ctx.sender);
      if (!participant) {
        return ctx.reply("No formas parte de este combate.");
      }

      const validation = turnManager.validateTurn(room, ctx.sender);
      if (!validation.valid) {
        if (validation.reason === 'wrong_turn') {
          const next = turnManager.getNextActiveParticipant(room);
          return ctx.reply(`⛔ No es tu turno. El turno es de @${next ? next.name : '...'}`);
        }
        return ctx.reply(validation.message);
      }

      const actionResult = await combatEngine.processFlee(room, ctx.sender);
      if (actionResult.error) return ctx.reply(actionResult.error);

      const narrative = await combatNarrator.narrate(actionResult);
      const fled = actionResult.result.hit;

      if (fled) {
        await stateManager.removeParticipant(room.id, ctx.sender);
        await ctx.reply(`${narrative.narrative}\n\n🏃 Has huido del combate.`);

        const survivors = turnManager.getAliveParticipants(room, 'players').length;
        if (survivors === 0) {
          room.status = 'finished';
          await stateManager.updateRoom(room.id, {});
          await ctx.reply('💀 Todos los jugadores huyeron o cayeron. Combate terminado.');
        }
        return;
      }

      const alive = turnManager.advanceTurn(room);
      if (!alive) {
        room.status = 'finished';
        await stateManager.updateRoom(room.id, {});
        await ctx.reply(`${narrative.narrative}\n\n🏁 Combate terminado.`);
        return;
      }

      while (turnManager.getCurrentParticipant(room) && turnManager.getCurrentParticipant(room).team === 'enemies') {
        const enemyAction = await combatEngine.autoResolveEnemyTurn(room);
        if (!enemyAction) break;
        const enemyNarrative = await combatNarrator.narrate(enemyAction);
        const enemyMsg = combatEngine.formatActionResult(enemyAction);
        await ctx.reply(`${enemyMsg}\n\n${enemyNarrative.narrative}`);

        if (enemyAction.result.ko) {
          const next = turnManager.getNextActiveParticipant(room);
          await stateManager.updateRoom(room.id, {});
          await ctx.reply(next ? `► @${next.name} — Es tu turno!` : '🏁 Combate terminado.');
          return;
        }

        const stillAlive = turnManager.advanceTurn(room);
        if (!stillAlive) {
          room.status = 'finished';
          await stateManager.updateRoom(room.id, {});
          await ctx.reply('🏁 Combate terminado.');
          return;
        }
      }

      await stateManager.updateRoom(room.id, {});
      const nextTag = turnManager.formatTurnTag(room);
      await ctx.reply(`${narrative.narrative}\n\n► @${nextTag} — Es tu turno!`);

    } catch (error) {
      console.error('huir error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
