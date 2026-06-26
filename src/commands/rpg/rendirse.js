const stateManager = require('../../services/rpg/combatStateManager');
const turnManager = require('../../services/rpg/combatTurnManager');
const duelService = require('../../services/rpg/duelService');
const combatLogger = require('../../services/rpg/combatLogger');
const { formatError } = require('../../utils/messageFormatUtils');

module.exports = {
  name: 'rendirse',
  aliases: ['rendir', 'rindo', 'abandonar', 'ff'],
  description: 'Rendirse en un combate PvP. Usa: /rendirse',
  category: 'rpg',

  async execute(ctx) {
    const groupId = ctx.from;

    const room = stateManager.getRoomByGroup(groupId);
    if (!room) {
      return ctx.reply(formatError('No hay combate activo aquí.'));
    }

    if (room.startedVia !== 'pvp') {
      return ctx.reply('No puedes rendirte en combate contra enemigos. Solo en duelos PvP.');
    }

    const participant = turnManager.getParticipantByJid(room, ctx.sender);
    if (!participant) {
      return ctx.reply('No formas parte de este combate.');
    }

    if (participant.ko) {
      return ctx.reply('Ya estás K.O.');
    }

    participant.ko = true;
    participant.hp = 0;

    const winner = room.participants.find(p => p.team === 'players' && p.id !== ctx.sender && !p.ko);
    const winnerName = winner ? winner.name : 'el oponente';
    const loserName = participant.name;

    let rewardMsg = '';
    if (winner) {
      rewardMsg = await duelService.handlePvPVictory(room, winner.id, ctx.sender);
    }

    room.status = 'finished';
    await stateManager.updateRoom(room.id, {});
    await combatLogger.logCombatEnd(room.id, {
      winner: winner ? winner.id : 'unknown',
      rounds: room.round,
      totalTurns: room.turnCount,
      participants: room.participants.map(p => p.name),
      duration: Date.now() - room.createdAt,
      surrender: true,
    });

    return ctx.reply(`🏳️ ${loserName} se rinde!\n\n🥇 ${winnerName} gana el duelo!${rewardMsg}`);
  },
};
