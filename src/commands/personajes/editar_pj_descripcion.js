const { updateCharacterSlots } = require("../../services/characterService");
const { getActiveCharacter } = require("../../services/characterService");
const { isAdmin } = require("../../utils/groupUtils");
const {
  formatCommandUsage,
  formatError,
  box,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "📝",
  title: "Editar descripción del personaje",
  description: "Actualiza la historia o descripción de tu personaje activo.",
  usage: "/editar_pj_descripcion <nueva_descripcion>",
  example: "/editar_pj_descripcion Un mago errante que busca conocimiento.",
  notes: ["Edita la descripción del personaje activo actual."],
});

module.exports = {
  name: "editar_pj_descripcion",
  aliases: ["edit_desc"],
  description: "Edita la descripción de tu personaje activo.",
  category: "personajes",

  async execute(ctx) {
    const text = ctx.args.join(' ').trim();

    if (!text) {
      return ctx.reply(usageMessage);
    }

    const character = await getActiveCharacter({
      creatorId: ctx.sender,
    });

    if (!character) {
      return ctx.reply(formatError(
        "No tienes un personaje activo.",
        "Usa /switch_pj para activar uno."
      ));
    }

    let admin = false;
    if (ctx.isGroup) {
      admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
    }

    await updateCharacterSlots({
      characterName: character.name,
      creatorId: ctx.sender,
      slots: { historia: text },
      requesterId: ctx.sender,
      requesterIsAdmin: admin,
    });

    await ctx.react("📝");

    await ctx.reply(box("📝 Descripción actualizada", [
      "",
      `👤  ${character.name.toUpperCase()}`,
      "",
      text,
    ]));
  },
};