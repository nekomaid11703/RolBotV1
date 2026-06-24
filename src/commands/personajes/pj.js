const { getActiveCharacter } = require("../../services/characterService");

function formatCharacter(character) {
  let text = "✦ ━━━━━━━━━━━━━━ ✦\n";
  text += `      👤 *${String(character.name).toUpperCase()}*\n`;
  text += "✦ ━━━━━━━━━━━━━━ ✦\n\n";
  
  text += `🎖️ *Rango:* ${character.category}\n`;

  if (character.stats && Object.keys(character.stats).length) {
    text += "\n📊 *ATRIBUTOS*\n";
    text += "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n";

    for (const [key, value] of Object.entries(character.stats)) {
      text += ` 🔸 *${String(key).toUpperCase()}*: ${value}\n`;
    }
  }

  if (character.slots && Object.keys(character.slots).length) {
    text += "\n🎒 *INVENTARIO E INFO*\n";
    text += "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n";

    for (const [key, value] of Object.entries(character.slots)) {
      if (!value) continue;
      text += ` ▫️ *${key}*\n   _${value}_\n\n`;
    }
  }

  return text.trim();
}

module.exports = {
  name: "pj",
  aliases: ["perfil"],
  description: "Muestra tu personaje activo actual.",
  category: "personajes",

  async execute(ctx) {
    const character = await getActiveCharacter({
      creatorId: ctx.sender,
    });

    if (!character) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    await ctx.reply(formatCharacter(character));
  },
};
