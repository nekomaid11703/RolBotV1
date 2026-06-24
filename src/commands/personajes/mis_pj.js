const { listCharacters } = require("../../services/characterService");

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
      return ctx.social("❌ No tienes personajes todavía. Usa `/crear_pj` para empezar.");
    }

    let text = "✦ ━━━━━━━━━━━━━━ ✦\n";
    text += "     📂 *TUS PERSONAJES*\n";
    text += "✦ ━━━━━━━━━━━━━━ ✦\n\n";

    for (const character of characters) {
      if (character.active) {
        text += `⭐ *${character.name.toUpperCase()}* _(Activo)_\n`;
      } else {
        text += ` ▫️ *${character.name}*\n`;
      }
      text += `   ↳ Rango: ${character.category}\n\n`;
    }

    text += "💡 _Usa_ `/switch_pj Nombre` _para cambiar tu personaje activo._";

    await ctx.reply(text.trim());
  },
};
