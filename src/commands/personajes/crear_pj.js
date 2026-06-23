const { createCharacter } = require("../../services/characterService");
const { isAdmin } = require("../../utils/groupUtils");
const { CHARACTER_CATEGORIES, MAX_CHARACTER_NAME_LENGTH } = require("../../config/characterConfig");

module.exports = {
  name: "crear_pj",
  aliases: ["cpj"],
  description: "Crea un personaje mediante un formulario simple.",
  category: "personajes",

  async execute(ctx) {
    const rawText = ctx.text.trim();

    const template = 
      "✦ ━━━━━━━━━━━━━━ ✦\n" +
      "    🎭 *CREAR PERSONAJE*\n" +
      "✦ ━━━━━━━━━━━━━━ ✦\n\n" +
      "Copia este mensaje, llena tus datos y envíalo de vuelta:\n\n" +
      "/crear_pj\n" +
      "Nombre: \n" +
      "Clase: \n" +
      "Historia: \n";

    // =========================
    // PLANTILLA / FORMULARIO
    // =========================
    if (!rawText) {
      return ctx.reply(template);
    }

    try {
      // =========================
      // EXTRACCIÓN CON REGEX
      // =========================
      const nameMatch = rawText.match(/Nombre:\s*(.+)/i);
      const classMatch = rawText.match(/Clase:\s*(.+)/i);
      
      // La historia puede ser multilinea, extraemos todo lo que hay después de "Historia:"
      const historyMatch = rawText.match(/Historia:\s*([\s\S]+)/i);

      if (!nameMatch) {
        return ctx.reply("❌ Formato incorrecto. Por favor, usa la plantilla:\n\n" + template);
      }

      const name = nameMatch[1].trim();
      const clase = classMatch ? classMatch[1].trim() : "";
      const historia = historyMatch ? historyMatch[1].trim() : "";

      if (name.length < 2 || name.length > MAX_CHARACTER_NAME_LENGTH) {
        throw new Error(`El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`);
      }

      // =========================
      // ADMIN Y RANGOS (Por defecto F)
      // =========================
      let admin = false;
      if (ctx.isGroup) {
        admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
      }

      // =========================
      // DELEGAR A LA BD
      // =========================
      // Enviamos solo los slots que el usuario rellenó. 
      // Supabase inyectará por defecto 'vida:100', 'dinero:0', etc.
      
      const slots = {};
      if (historia) slots.historia = historia;
      if (clase) slots.descripcion = `Clase: ${clase}`;

      const character = await createCharacter({
        creatorId: ctx.sender,
        creatorName: ctx.userName,
        characterName: name,
        category: "F", // Rango inicial por defecto
        stats: null,   // NULL para que la BD aplique sus defaults
        slots: Object.keys(slots).length > 0 ? slots : null,
        isAdmin: admin,
      });

      // =========================
      // RESPUESTA
      // =========================
      await ctx.react("🎉");

      const response = 
        "🎉 *PERSONAJE CREADO CON ÉXITO*\n\n" +
        `👤 *${character.name.toUpperCase()}*\n` +
        `🎖️ Rango: ${character.category}\n\n` +
        "_Tus estadísticas base (Vida, Fuerza, etc) han sido asignadas por la base de datos. Usa_ `/ver_pj` _para ver tu perfil completo._";

      await ctx.reply(response);
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
