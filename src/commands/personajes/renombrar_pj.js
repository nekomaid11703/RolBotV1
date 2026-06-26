const { renameCharacter } = require("../../services/characterService");
const { getCharacterNames } = require("../../services/characterService");
const { isAdmin } = require("../../utils/groupUtils");
const { MAX_CHARACTER_NAME_LENGTH } = require("../../config/characterConfig");
const {
  formatCommandUsage,
  formatError,
  box,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "✏️",
  title: "Renombrar personaje",
  description: "Cambia el nombre de uno de tus personajes.",
  usage: "/renombrar_pj nombre_actual nuevo_nombre",
  example: "/renombrar_pj Kael Valerion",
  notes: [`El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`],
});

module.exports = {
  name: "renombrar_pj",
  aliases: ["rn", "rename"],
  description: "Renombra uno de tus personajes.",
  category: "personajes",

  async execute(ctx) {
    const args = ctx.args;

    if (args.length < 2) {
      return ctx.reply(usageMessage);
    }

    const currentName = args[0];
    const newName = args.slice(1).join(' ');

    if (newName.length < 2 || newName.length > MAX_CHARACTER_NAME_LENGTH) {
      return ctx.reply(formatError(
        `El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`
      ));
    }

    const names = await getCharacterNames({ creatorId: ctx.sender });

    if (!names.has(currentName)) {
      return ctx.reply(formatError(
        `No tienes un personaje llamado "${currentName}".`,
        `Usa /mis_pj para ver tu lista.`
      ));
    }

    if (names.has(newName)) {
      return ctx.reply(formatError(
        `Ya tienes un personaje llamado "${newName}".`,
        `Elige otro nombre.`
      ));
    }

    let admin = false;
    if (ctx.isGroup) {
      admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
    }

    await renameCharacter({
      characterName: currentName,
      newName: newName,
      creatorId: ctx.sender,
      requesterId: ctx.sender,
      requesterIsAdmin: admin,
    });

    await ctx.react("✏️");

    await ctx.reply(box("✏️ Personaje renombrado", [
      "",
      `⬆️  ${currentName.toUpperCase()}`,
      `⬇️  ${newName.toUpperCase()}`,
    ]));
  },
};