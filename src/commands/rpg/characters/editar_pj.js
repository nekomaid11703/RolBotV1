// @ts-nocheck
const { renameCharacter, updateCharacterSlots, getActiveCharacter } = require("../../../services/characterService");
const { isAdmin } = require("../../../utils/groupUtils");
const { MAX_CHARACTER_NAME_LENGTH } = require("../../../config/characterConfig");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

/**
 * @constant usageMessage
 */
const usageMessage = formatCommandUsage({
  icon: "📝",
  title: "Editar personaje",
  description: "Edita el nombre o la historia de tu personaje activo.",
  usage: "/editar_pj Nombre: <nuevo_nombre>   o   /editar_pj Historia: <texto>",
  example: ["/editar_pj Nombre: Valerion", "/editar_pj Historia: Un mago errante que busca conocimiento."],
  notes: [
    "Usa 'Nombre:' para renombrar, 'Historia:' para cambiar la historia.",
    "Si no especificas prefijo, se toma como historia.",
  ],
});

module.exports = {
  name: "editar_pj",
  aliases: ["edit_pj", "editar_desc"],
  description: "Edita el nombre o historia de tu personaje activo.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   * @throws {Error}
   */
  async execute(ctx) {
    /**
     * @constant rawText
     */
    const rawText = ctx.args.join(" ").trim();

    if (!rawText) {
      return ctx.reply(usageMessage);
    }

    /**
     * @constant character
     */
    const character = await getActiveCharacter({ creatorId: ctx.sender });

    if (!character) {
      return ctx.reply(formatError("No tienes un personaje activo.", "Usa /switch_pj para activar uno."));
    }

    let admin = false;
    if (ctx.isGroup) {
      admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
    }

    /**
     * @constant nameMatch
     */
    const nameMatch = rawText.match(/^Nombre:\s*(.+)/i);
    if (nameMatch) {
      /**
       * @constant newName
       */
      const newName = nameMatch[1].trim();
      if (newName.length < 2 || newName.length > MAX_CHARACTER_NAME_LENGTH) {
        throw new Error(`El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`);
      }
      /**
       * @constant updated
       */
      const updated = await renameCharacter({
        characterName: character.name,
        newName,
        creatorId: ctx.sender,
        requesterId: ctx.sender,
        requesterIsAdmin: admin,
      });
      await ctx.react("✏️");
      return ctx.reply(
        box("✏️ Nombre actualizado", ["", `👤  ${character.name.toUpperCase()}  →  ${updated.name.toUpperCase()}`]),
      );
    }

    /**
     * @constant historyMatch
     */
    const historyMatch = rawText.match(/^Historia:\s*(.+)/i);
    /**
     * @constant historia
     */
    const historia = historyMatch ? historyMatch[1].trim() : rawText;

    await updateCharacterSlots({
      characterName: character.name,
      creatorId: ctx.sender,
      slots: { historia },
      requesterId: ctx.sender,
      requesterIsAdmin: admin,
    });

    await ctx.react("📝");

    await ctx.reply(box("📝 Historia actualizada", ["", `👤  ${character.name.toUpperCase()}`, "", historia]));
  },
};
