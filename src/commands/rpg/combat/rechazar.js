const duelService = require('../../../services/rpg/duelService');
const { formatError } = require('../../../utils/messageFormatUtils');

module.exports = {
  name: 'rechazar',
  aliases: ['rech', 'no', 'declinar'],
  description: 'Rechazar un duelo pendiente. Usa: /rechazar @jugador',
  category: 'rpg',

  async execute(ctx) {
    const groupId = ctx.from;

    const result = duelService.rejectChallenge(ctx.sender, groupId);
    if (result.error) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(result.message);
  },
};
