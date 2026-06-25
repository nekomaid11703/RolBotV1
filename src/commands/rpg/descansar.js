const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const combatEngine = require("../../services/rpg/combatEngine");
const combatNarrator = require("../../services/rpg/combatNarrator");
const combatValidator = require("../../services/rpg/combatValidator");
const combatLogger = require("../../services/rpg/combatLogger");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "descansar",
  aliases: ["rest", "descanso", "recuperarse", "respirar"],
  description: "Descansas un momento para reducir la fatiga en combate.",
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

      const vResult = combatValidator.validate('descansar', { parsed: { type: 'transicion', intent: 'auxiliar' }, room, participant });
      if (vResult.sanction) {
        participant.fatigue = Math.min(10, (participant.fatigue || 0) + 5);
        turnManager.advanceTurn(room);
        await stateManager.updateRoom(room.id, {});
        await ctx.reply(vResult.messages.join('\n'));
        return;
      }

      if (!vResult.valid) return;

      const antes = participant.fatigue;
      const reduccion = Math.max(1, Math.min(3, Math.ceil((participant.resistencia_fisica || 5) / 3)));
      participant.fatigue = Math.max(0, antes - reduccion);
      participant.turnsActive = Math.max(0, (participant.turnsActive || 0) - 2);

      const actionResult = {
        action: { actor: ctx.sender, type: 'defend', intent: 'descanso', targetZone: 'general', damageType: 'none', moveNumber: 1 },
        result: { hit: false, damage: 0, bodyPart: 'general', crit: false, blocked: false, ko: false, intercepted: false, moveNumber: 1 },
        context: {
          attacker: { name: participant.name, fatigue: participant.fatigue, fulgor: participant.fulgor },
          defender: null,
          location: room.location,
          participants: turnManager.getAliveParticipants(room).length,
          round: room.round,
          turnCount: room.turnCount,
        },
      };

      const narrative = await combatNarrator.narrate(actionResult);
      await combatLogger.logAction(room, {
        turnCount: room.turnCount, round: room.round, timestamp: Date.now(),
        actor: ctx.sender, actorName: participant.name, actionType: 'rest',
        target: null, targetName: null, zone: null, damage: 0,
        crit: false, ko: false, intercepted: false, blocked: false,
        narrative: narrative.narrative,
      });

      const alive = turnManager.advanceTurn(room);
      if (!alive) {
        room.status = 'finished';
        await stateManager.updateRoom(room.id, {});
        await ctx.reply(`${narrative.narrative}\n😮‍💨 Fatiga: ${antes} → ${participant.fatigue}\n\n🏁 Combate terminado.`);
        return;
      }

      while (turnManager.getCurrentParticipant(room) && turnManager.getCurrentParticipant(room).team === 'enemies') {
        const enemyAction = await combatEngine.autoResolveEnemyTurn(room);
        if (!enemyAction) break;

        const enemyNarrative = await combatNarrator.narrate(enemyAction);
        const enemyMsg = combatEngine.formatActionResult(enemyAction);
        await combatLogger.logAction(room, combatLogger.mapActionResultToLogEntry(room, enemyAction, enemyNarrative.narrative));
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
          const victoria = turnManager.checkVictoryConditions(room);
          await ctx.reply(victoria.message);
          return;
        }
      }

      await stateManager.updateRoom(room.id, {});
      const nextTag = turnManager.formatTurnTag(room);
      const reductionText = antes > 0 ? `Fatiga: ${antes} → ${participant.fatigue}` : 'Fatiga: sin cambios (ya estabas descansado)';
      await ctx.reply(`${narrative.narrative}\n😮‍💨 ${reductionText}\n\n► @${nextTag} — Es tu turno!`);

    } catch (error) {
      console.error('descansar error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
