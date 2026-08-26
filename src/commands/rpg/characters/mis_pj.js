// @ts-nocheck
const { listCharacters } = require("../../../services/characterService");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "mis_pj",
  aliases: ["pjs", "listar_pj"],
  description: "Lista tus personajes creados.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant characters
     */
    const characters = await listCharacters({
      creatorId: ctx.sender,
    });

    if (!characters.length) {
      return ctx.reply("❌ No tienes personajes todavía. Usa `/crear_pj` para empezar.");
    }

    /**
     * @constant lines
     * @type {*[]}
     */
    const lines = [];
    for (const character of characters) {
      if (character.active) {
        lines.push(`⭐  ${character.name.toUpperCase()}  ·  ${character.clase}  ·  Nv.${character.nivel}  ·  Activo`);
      } else {
        lines.push(`▫️  ${character.name}  ·  ${character.clase}  ·  Nv.${character.nivel}`);
      }
    }

    await ctx.reply(box("📂 Mis personajes", ["", ...lines, "", `💡 Usa /switch_pj <nombre> para cambiar`]));
  },
};
