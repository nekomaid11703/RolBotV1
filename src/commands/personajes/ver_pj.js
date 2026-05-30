const {
  listCharacters,

  getCharacter,

  getActiveCharacter,
} = require("../../services/characterService");

// =========================
// FORMAT
// =========================

function formatCharacter(character) {
  let text =
    "👤 *PERSONAJE*\n\n" +
    `📛 Nombre: ${character.name}\n` +
    `🏷️ Rango: ${character.category}\n`;

  // =========================
  // STATS
  // =========================

  if (character.stats && Object.keys(character.stats).length) {
    text += "\n📊 *Stats*\n\n";

    for (const [key, value] of Object.entries(character.stats)) {
      text += `• ${key}: ${value}\n`;
    }
  }

  // =========================
  // SLOTS
  // =========================

  if (character.slots && Object.keys(character.slots).length) {
    text += "\n🧩 *Información*\n";

    for (const [key, value] of Object.entries(character.slots)) {
      if (!value) {
        continue;
      }

      text += `\n🔹 *${key}*\n` + `${value}\n`;
    }
  }

  return text.trim();
}

module.exports = {
  name: "ver_pj",

  aliases: ["verpersonaje"],

  description: "Muestra personajes",

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
          return ctx.reply("❌ No tienes personajes.");
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
          return ctx.reply("❌ No tienes personaje activo.");
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
          return ctx.reply("❌ No existe ese personaje.");
        }
      }

      // =========================
      // RESPONSE
      // =========================

      await ctx.react("📖");

      await ctx.reply(formatCharacter(character));
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
