const {
  listCharacters,

  getCharacter,

  getActiveCharacter,
} = require("../../services/characterService");

// =========================
// FORMAT
// =========================

function formatCharacter(character) {
  let text = "✦ ━━━━━━━━━━━━━━ ✦\n";
  text += `      👤 *${String(character.name).toUpperCase()}*\n`;
  text += "✦ ━━━━━━━━━━━━━━ ✦\n\n";
  
  text += `🎖️ *Rango:* ${character.category}\n`;

  // =========================
  // STATS
  // =========================

  if (character.stats && Object.keys(character.stats).length) {
    text += "\n📊 *ATRIBUTOS*\n";
    text += "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n";

    for (const [key, value] of Object.entries(character.stats)) {
      text += ` 🔸 *${String(key).toUpperCase()}*: ${value}\n`;
    }
  }

  // =========================
  // SLOTS
  // =========================

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
  name: "ver_pj",

  aliases: ["verpersonaje"],

  description: "Muestra personajes específicos por su nombre o el nombre del personaje activo con 'main'. Si solo escribes el comando, te mostrará la lista de tus personajes.",

  category: "personajes",

  async execute(ctx) {
    const lines = ctx.text
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    try {
      // =========================
      // LISTAR TODOS
      // =========================

      if (lines.length === 1) {
        const characters = await listCharacters({
          creatorId: ctx.sender,
        });

        if (!characters.length) {
          return ctx.social("❌ No tienes personajes.");
        }

        let response = "📂 *TUS PERSONAJES*\n";

        for (const character of characters) {
          response +=
            "\n" +
            `${character.active ? "⭐" : "•"} ` +
            `${character.name} ` +
            `[${character.category}]`;
        }

        return ctx.reply(response);
      }

      // =========================
      // TARGET
      // =========================

      const target = lines[1];

      let character = null;

      // =========================
      // MAIN
      // =========================

      if (target.toLowerCase() === "main") {
        character = await getActiveCharacter({
          creatorId: ctx.sender,
        });

        if (!character) {
          return ctx.social("❌ No tienes personaje activo.");
        }
      }

      // =========================
      // NAME
      // =========================
      else {
        character = await getCharacter({
          creatorId: ctx.sender,

          characterName: target,
        });

        if (!character) {
          return ctx.social("❌ No existe ese personaje.");
        }
      }

      // =========================
      // RESPONSE
      // =========================

      await ctx.react("📖");

      await ctx.reply(formatCharacter(character));
    } catch (error) {
      await ctx.social(`❌ ${error.message}`);
    }
  },
};
