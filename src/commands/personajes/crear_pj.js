const { createCharacter } = require("../../services/characterService");

const { isAdmin } = require("../../utils/groupUtils");

const {
  DEFAULT_CHARACTER_STATS,

  VALID_CHARACTER_FIELDS,

  CHARACTER_CATEGORIES,
} = require("../../config/characterConfig");

// =========================
// PARSER
// =========================

function parseCharacterMessage(text) {
  const lines = text

    .split("\n")

    .map((line) => line.trim())

    .filter(Boolean);

  // =========================
  // VALIDAR MINIMO
  // =========================

  if (lines.length < 2) {
    throw new Error("Formato inválido.\n\n" + "Debes usar saltos de línea.");
  }

  // =========================
  // COMANDO
  // =========================

  if (lines[0].toLowerCase() !== "/crear_pj") {
    throw new Error("Comando inválido.");
  }

  // =========================
  // NOMBRE
  // =========================

  const name = lines[1];

  if (!name) {
    throw new Error("Debes escribir un nombre.");
  }

  // =========================
  // DATA
  // =========================

  const data = {};

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];

    if (!line.includes(":")) {
      throw new Error(`Línea inválida:\n${line}`);
    }

    const splitIndex = line.indexOf(":");

    const key = line.slice(0, splitIndex).trim().toLowerCase();

    let value = line.slice(splitIndex + 1).trim();

    // =========================
    // KEY INVALIDA
    // =========================

    if (!VALID_CHARACTER_FIELDS.includes(key)) {
      throw new Error(`Característica inválida:\n${key}`);
    }

    // =========================
    // NUMEROS
    // =========================

    if (/^-?\d+$/.test(value)) {
      value = Number(value);
    }

    data[key] = value;
  }

  return {
    name,
    data,
  };
}

module.exports = {
  name: "crear_pj",

  aliases: ["cpj"],

  description: "Crea un personaje",

  category: "personajes",

  async execute(ctx) {
    // =========================
    // HELP
    // =========================

    if (ctx.text.trim().toLowerCase() === "/crear_pj") {
      let help =
        "📘 *CREAR PERSONAJE*\n\n" +
        "Usa EXACTAMENTE este formato:\n\n" +
        "/crear_pj\n" +
        "Kevin\n\n" +
        "Las estadisticas validas son:\n\n";

      for (const key of VALID_CHARACTER_FIELDS) {
        if (key === "rango") {
          help += "rango: F\n";

          continue;
        }

        help += `${key}: ${DEFAULT_CHARACTER_STATS[key]}\n`;
      }

      help += "\n⚠️ Las líneas son obligatorias.";

      return ctx.reply(help);
    }

    try {
      // =========================
      // PARSE
      // =========================

      const parsed = parseCharacterMessage(ctx.text);

      const name = parsed.name;

      const data = parsed.data;

      // =========================
      // ADMIN
      // =========================

      let admin = false;

      if (ctx.isGroup) {
        admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
      }

      // =========================
      // RANGO
      // =========================

      let rango = String(data.rango || "F").toUpperCase();

      if (!CHARACTER_CATEGORIES.includes(rango)) {
        rango = "F";
      }

      // =========================
      // NO ADMIN
      // =========================

      if (!admin && rango !== "F") {
        rango = "F";
      }

      // =========================
      // STATS
      // =========================

      const stats = {
        ...DEFAULT_CHARACTER_STATS,
      };

      for (const key of Object.keys(data)) {
        if (key === "rango") {
          continue;
        }

        stats[key] = data[key];
      }

      // =========================
      // CREATE
      // =========================

      const character = await createCharacter({
        creatorId: ctx.sender,

        creatorName: ctx.userName,

        characterName: name,

        category: rango,

        stats,

        isAdmin: admin,
      });

      // =========================
      // SUCCESS
      // =========================

      await ctx.react("🎉");

      let response =
        "🎉 *PERSONAJE CREADO EXITOSAMENTE*\n\n" +
        `👤 *Nombre:* ${character.name}\n` +
        `🏷️ *Rango:* ${character.category}\n` +
        `⭐ *Estado:* Activo\n\n` +
        "📊 *Estadísticas*\n\n";

      for (const [key, value] of Object.entries(character.stats)) {
        response += `• ${key}: ${value}\n`;
      }

      response += "\n✅ El personaje fue guardado correctamente.";

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
