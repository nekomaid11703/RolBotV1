// @ts-nocheck
const { setActiveCharacter } = require("../../../services/characterService");
const { isAdmin } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

/**
 * @constant usageMessage
 */
const usageMessage = formatCommandUsage({
  icon: "🔄",
  title: "Cambiar personaje activo",
  description: "Cambia tu personaje activo por otro de tu lista.",
  usage: "/switch_pj NombreDelPersonaje",
  example: "/switch_pj Kael",
  notes: ["El nombre no distingue mayúsculas, acentos ni espacios."],
});

module.exports = {
  name: "switch_pj",
  aliases: ["activar_pj", "cambiar_pj"],
  description: "Cambia tu personaje activo.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant targetName
     */
    const targetName = ctx.args.join(" ");

    if (!targetName || targetName.trim() === "") {
      return ctx.reply(usageMessage);
    }

    /**
     * @constant name
     */
    const name = targetName.trim();

    let admin = false;
    if (ctx.isGroup) {
      admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
    }

    try {
      await setActiveCharacter({
        targetCreatorId: ctx.sender,
        targetCreatorName: ctx.userName,
        characterName: name,
        requesterId: ctx.sender,
        requesterIsAdmin: admin,
      });
    } catch (error) {
      return ctx.reply(formatError(error, "Usa /mis_pj para ver tu lista."));
    }

    await ctx.react("🔄");

    await ctx.reply(
      box("🔄 Personaje activo", ["", `👤  ${name.toUpperCase()}`, "", `💡 Usa /ver_pj para ver su perfil`]),
    );
  },
};
