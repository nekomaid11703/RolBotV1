const stateManager = require('../../services/rpg/combatStateManager');
const duelService = require('../../services/rpg/duelService');
const { getActiveCharacter } = require('../../services/characterService');
const { getBalance } = require('../../services/economyService');
const { formatError } = require('../../utils/messageFormatUtils');

module.exports = {
  name: 'duel',
  aliases: ['retar', 'desafiar'],
  description: 'Retar a otro jugador a un duelo. Usa: /duel @usuario [apuesta]',
  category: 'rpg',

  async execute(ctx) {
    const groupId = ctx.from;
    const args = ctx.args || [];
    const mentions = ctx.mentionedJidList || [];

    if (mentions.length === 0) {
      return ctx.reply(formatError('Menciona a un jugador.', 'Ej: /duel @jugador'));
    }

    const targetId = mentions[0];
    if (targetId === ctx.sender) {
      return ctx.reply('No puedes desafiarte a ti mismo.');
    }

    let targetName = 'Jugador';
    if (ctx.mentionedJidList && ctx.mentionedJidList.length > 0) {
      targetName = ctx.mentionedJidList[0].split('@')[0] || 'Jugador';
    }

    const existingRoom = stateManager.getRoomByGroup(groupId);
    if (existingRoom && existingRoom.status === 'active') {
      return ctx.reply(formatError('Ya hay un combate activo aquí.', 'Termínalo antes de retar a alguien.'));
    }

    const character = await getActiveCharacter({ creatorId: ctx.sender });
    if (!character) {
      return ctx.reply(formatError('No tienes un personaje activo.', 'Crea uno con /crear_pj'));
    }

    let betAmount = 0;
    const numericArg = args.find(a => /^\d+$/.test(a));
    if (numericArg) {
      betAmount = parseInt(numericArg, 10);
      if (betAmount < 1) return ctx.reply('La apuesta debe ser al menos 1 estela.');
      try {
        const balance = await getBalance(ctx.sender);
        if (balance < betAmount) {
          return ctx.reply(formatError(`No tienes suficientes estelas. Tienes ${balance}, necesitas ${betAmount}.`));
        }
      } catch {
        return ctx.reply('Error al verificar tu saldo.');
      }
    }

    const challengerName = character.name || ctx.sender.split('@')[0];

    const result = duelService.createChallenge(
      ctx.sender, challengerName,
      targetId, targetName,
      groupId, betAmount
    );

    if (result.error) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(result.message);
  },
};
