const { editCharacter } = require("../../services/characterService");

// =========================
// PARSER
// =========================

function parseSlots(lines) {
  const slots = {};

  let i = 2;

  while (i < lines.length) {
    const raw = lines[i];

    const line = raw.trim();

    if (!line) {
      i++;
      continue;
    }

    // =========================
    // KEY:
    // =========================

    if (!line.endsWith(":")) {
      throw new Error(`Formato inválido:\n${line}`);
    }

    const key = line.slice(0, -1).trim().toLowerCase();

    // =========================
    // SECURITY
    // =========================

    if (key.length < 1) {
      throw new Error("Slot inválido.");
    }

    if (key.length > 50) {
      throw new Error(`Slot demasiado largo:\n${key}`);
    }

    i++;

    // =========================
    // "
    // =========================

    if (i >= lines.length || lines[i].trim() !== '"') {
      throw new Error(`${key} debe comenzar con "`);
    }

    i++;

    const content = [];

    while (i < lines.length && lines[i].trim() !== '"') {
      content.push(lines[i]);

      i++;
    }

    if (i >= lines.length) {
      throw new Error(`${key} no fue cerrado con "`);
    }

    const finalContent = content.join("\n").trim();

    if (finalContent.length > 5000) {
      throw new Error(`Contenido demasiado largo:\n${key}`);
    }

    slots[key] = finalContent;

    i++;
  }

  return slots;
}

module.exports = {
  name: "editar_pj_descripcion",

  aliases: ["edit_pj_desc", "epjd"],

  description: "Edita descripciones y lore",

  category: "personajes",

  async execute(ctx) {
    const lines = ctx.text.split("\n");

    // =========================
    // HELP
    // =========================

    if (lines.length < 4) {
      return ctx.reply(
        "📘 *EDITAR DESCRIPCIONES*\n\n" +
          "/editar_pj_descripcion\n" +
          "Kevin\n\n" +
          "descripcion:\n" +
          '"\n' +
          "Un guerrero legendario.\n" +
          '"\n\n' +
          "habilidad_1:\n" +
          '"\n' +
          "Lanza fuego.\n" +
          '"',
      );
    }

    const characterName = lines[1].trim();

    if (!characterName) {
      return ctx.reply("❌ Debes escribir el personaje.");
    }

    try {
      const slots = parseSlots(lines);

      if (Object.keys(slots).length < 1) {
        return ctx.reply("❌ No hay slots para editar.");
      }

      const character = await editCharacter({
        creatorId: ctx.sender,

        characterName,

        patch: {
          slots,
        },
      });

      await ctx.react("📝");

      let response =
        "📝 *DESCRIPCIONES ACTUALIZADAS*\n\n" + `👤 ${character.name}\n\n`;

      for (const key of Object.keys(slots)) {
        response += `✅ ${key}\n`;
      }

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
