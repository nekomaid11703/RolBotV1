// @ts-nocheck
const { renameCharacter } = require("../../../services/characterService");
const { getCharacterNames } = require("../../../services/characterService");
const { isAdmin } = require("../../../utils/groupUtils");
const { MAX_CHARACTER_NAME_LENGTH } = require("../../../config/characterConfig");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

/**
 * @constant usageMessage
 */
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
  aliases: ["rn", "rename", "edit_pj_name", "rename_pj"],
  description: "Renombra uno de tus personajes.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant args
     */
    const args = ctx.args;

    if (args.length < 2) {
      return ctx.reply(usageMessage);
    }

    /**
     * @constant currentName
     */
    const currentName = args[0];
    /**
     * @constant newName
     */
    const newName = args.slice(1).join(" ");

    if (newName.length < 2 || newName.length > MAX_CHARACTER_NAME_LENGTH) {
      return ctx.reply(formatError(`El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`));
    }

    /**
     * @constant names
     */
    const names = await getCharacterNames({ creatorId: ctx.sender });

    if (!names.has(currentName)) {
      return ctx.reply(
        formatError(`No tienes un personaje llamado "${currentName}".`, `Usa /mis_pj para ver tu lista.`),
      );
    }

    if (names.has(newName)) {
      return ctx.reply(formatError(`Ya tienes un personaje llamado "${newName}".`, `Elige otro nombre.`));
    }

    /**
     * @variable admin
     * @type {boolean}
     */
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

    await ctx.reply(
      box("✏️ Personaje renombrado", ["", `⬆️  ${currentName.toUpperCase()}`, `⬇️  ${newName.toUpperCase()}`]),
    );
  },
};
