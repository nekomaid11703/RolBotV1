const { listCharacters } = require("../../services/characterService");
const { box } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "mis_pj",
  aliases: ["pjs", "listar_pj"],
  description: "Lista tus personajes creados.",
  category: "personajes",

  async execute(ctx) {
    const characters = await listCharacters({
      creatorId: ctx.sender,
    });

    if (!characters.length) {
      return ctx.reply("❌ No tienes personajes todavía. Usa `/crear_pj` para empezar.");
    }

    const lines = [];
    for (const character of characters) {
      if (character.active) {
        lines.push(`⭐  ${character.name.toUpperCase()}  ·  Activo`);
      } else {
        lines.push(`▫️  ${character.name}  ·  Rango ${character.category}`);
      }
    }

    await ctx.reply(box("📂 Mis personajes", [
      "",
      ...lines,
      "",
      `💡 Usa /switch_pj <nombre> para cambiar`,
    ]));
  },
};