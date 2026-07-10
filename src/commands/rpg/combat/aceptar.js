const duelService = require('../../../services/rpg/duelService');
const { getActiveCharacter } = require('../../../services/characterService');
const { formatError } = require('../../../utils/messageFormatUtils');

module.exports = {
  name: 'aceptar',
  aliases: ['acept', 'si', 'ok'],
  description: 'Aceptar un duelo pendiente. Usa: /aceptar @jugador',
  category: 'rpg',

  async execute(ctx) {
    const groupId = ctx.from;
    const mentions = ctx.mentionedJidList || [];

    if (mentions.length === 0) {
      return ctx.reply(formatError('Menciona a quien retó.', 'Ej: /aceptar @jugador'));
    }

    const character = await getActiveCharacter({ creatorId: ctx.sender });
    if (!character) {
      return ctx.reply(formatError('No tienes un personaje activo.', 'Crea uno con /crear_pj'));
    }

    const result = await duelService.acceptChallenge(ctx.sender, groupId);
    if (result.error) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(result.message);
  },
};
