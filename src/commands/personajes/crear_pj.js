const { createCharacter } = require("../../services/characterService");

const { isAdmin } = require("../../utils/groupUtils");

const {
  DEFAULT_CHARACTER_STATS,

  CHARACTER_CATEGORIES,
} = require("../../config/characterConfig");

// =========================
// PARSER
// =========================

function parseCharacter(lines) {
  // =========================
  // NAME
  // =========================

  const name = lines[1]?.trim();

  if (!name) {
    throw new Error("Debes escribir un nombre.");
  }

  if (name.length < 2) {
    throw new Error("Nombre demasiado corto.");
  }

  if (name.length > 40) {
    throw new Error("Nombre demasiado largo.");
  }

  // =========================
  // DATA
  // =========================

  let category = "F";

  const stats = {};

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
    // INVALID
    // =========================

    if (!line.includes(":")) {
      throw new Error(`Línea inválida:\n${line}`);
    }

    const index = line.indexOf(":");

    const key = line.slice(0, index).trim().toLowerCase();

    let value = line.slice(index + 1).trim();

    // =========================
    // EMPTY KEY
    // =========================

    if (!key) {
      throw new Error("Key inválida.");
    }

    // =========================
    // RANGO
    // =========================

    if (key === "rango") {
      category = value.toUpperCase();

      i++;
      continue;
    }

    // =========================
    // MULTILINE SLOT
    // =========================

    if (value === "") {
      i++;

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
        throw new Error(`${key} es demasiado largo.`);
      }

      slots[key] = finalContent;

      i++;

      continue;
    }

    // =========================
    // NUMBER
    // =========================

    if (/^-?\d+$/.test(value)) {
      value = Number(value);
    }

    stats[key] = value;

    i++;
  }

  return {
    name,

    category,

    stats,

    slots,
  };
}

module.exports = {
  name: "crear_pj",

  aliases: ["cpj"],

  description: "Crea un personaje",

  category: "personajes",

  async execute(ctx) {
    const lines = ctx.text.split("\n");

    // =========================
    // HELP
    // =========================

    if (lines.length < 2) {
      let help =
        "📘 *CREAR PERSONAJE*\n\n" +
        "/crear_pj\n" +
        "Kevin\n\n" +
        "rango: F\n\n";

      for (const [key, value] of Object.entries(DEFAULT_CHARACTER_STATS)) {
        help += `${key}: ${value}\n`;
      }

      help +=
        "\n" + "descripcion:\n" + '"\n' + "Un guerrero legendario.\n" + '"\n';

      return ctx.reply(help);
    }

    try {
      // =========================
      // ADMIN
      // =========================

      let admin = false;

      if (ctx.isGroup) {
        admin = await isAdmin(
          ctx.sock,

          ctx.from,

          ctx.sender,
        );
      }

      // =========================
      // PARSE
      // =========================

      const parsed = parseCharacter(lines);

      // =========================
      // CATEGORY
      // =========================

      let category = parsed.category;

      if (!CHARACTER_CATEGORIES.includes(category)) {
        category = "F";
      }

      if (!admin && category !== "F") {
        category = "F";
      }

      // =========================
      // STATS
      // =========================

      const stats = {
        ...DEFAULT_CHARACTER_STATS,

        ...parsed.stats,
      };

      // =========================
      // CREATE
      // =========================

      const character = await createCharacter({
        creatorId: ctx.sender,

        creatorName: ctx.userName,

        characterName: parsed.name,

        category,

        stats,

        slots: parsed.slots,

        isAdmin: admin,
      });

      // =========================
      // RESPONSE
      // =========================

      await ctx.react("🎉");

      let response =
        "🎉 *PERSONAJE CREADO*\n\n" +
        `👤 ${character.name}\n` +
        `🏷️ Rango: ${character.category}\n\n` +
        "📊 *Stats*\n";

      for (const [key, value] of Object.entries(character.stats)) {
        response += `• ${key}: ${value}\n`;
      }

      if (character.slots && Object.keys(character.slots).length) {
        response += "\n🧩 *Slots*\n";

        for (const key of Object.keys(character.slots)) {
          response += `• ${key}\n`;
        }
      }

      response += "\n✅ Guardado correctamente.";

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
