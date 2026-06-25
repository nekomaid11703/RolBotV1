const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const combatEngine = require("../../services/rpg/combatEngine");
const combatNarrator = require("../../services/rpg/combatNarrator");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "defender",
  aliases: ["defensa", "block", "protegerse", "def"],
  description: "Te pones en guardia para reducir el daño del próximo ataque enemigo.",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = stateManager.getRoomByGroup(ctx.from);
      if (!room) {
        return ctx.reply(formatError("No hay combate activo aquí.", "Usa /atacar <enemigo> para iniciar uno."));
      }

      const validation = turnManager.validateTurn(room, ctx.sender);
      if (!validation.valid) {
        if (validation.reason === 'wrong_turn') {
          const next = turnManager.getNextActiveParticipant(room);
          return ctx.reply(`⛔ No es tu turno. El turno es de @${next ? next.name : '...'}`);
        }
        return ctx.reply(validation.message);
      }

      const actionResult = await combatEngine.processDefend(room, ctx.sender);
      if (actionResult.error) return ctx.reply(actionResult.error);

      const narrative = await combatNarrator.narrate(actionResult);
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
          const victorias = turnManager.checkVictoryConditions(room);
          await ctx.reply(victorias.message);
          return;
        }
      }

      await stateManager.updateRoom(room.id, {});
      const nextTag = turnManager.formatTurnTag(room);
      await ctx.reply(`${narrative.narrative}\n\n🛡️ Te has puesto en guardia.\n\n► @${nextTag} — Es tu turno!`);

    } catch (error) {
      console.error('defender error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
