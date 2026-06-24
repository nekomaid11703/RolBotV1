const { getActiveCharacter, editCharacter } = require("../../services/characterService");
const { MAX_SLOT_SIZE } = require("../../config/characterConfig");
const {
  formatCommandForm,
  formatError,
} = require("../../utils/messageFormatUtils");

module.exports = {
  name: "editar_pj_descripcion",
  aliases: ["edit_pj_desc", "epjd"],
  description: "Edita información o descripciones (slots) de tu personaje activo.",
  category: "personajes",

  async execute(ctx) {
    const rawText = ctx.text.trim();

    const template = formatCommandForm({
      icon: "📝",
      title: "Editar descripcion",
      description: "Actualiza un campo narrativo del personaje activo.",
      command: "/edit_pj_desc",
      fields: ["Campo", "Descripción"],
      example: [
        "/edit_pj_desc",
        "Campo: Historia",
        "Descripción: Sobrevivio a una guerra antigua y ahora protege ruinas olvidadas.",
      ],
      notes: ["Campos recomendados: Historia, Arma, Habilidad, Apariencia."],
    });

    // =========================
    // PLANTILLA / FORMULARIO
    // =========================
    if (!rawText) {
      return ctx.reply(template);
    }

    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      
      if (!activeChar) {
        return ctx.social(formatError(
          "No tienes un personaje activo para editar.",
          "Usa `/switch_pj` o `/crear_pj` primero.",
        ));
      }

      // =========================
      // EXTRACCIÓN CON REGEX
      // =========================
      const fieldMatch = rawText.match(/Campo:\s*(.+)/i);
      const descMatch = rawText.match(/Descripción:\s*([\s\S]+)/i);

      if (!fieldMatch || !descMatch) {
        return ctx.social(formatError("Formato incorrecto. Usa la plantilla completa.", template));
      }

      const key = fieldMatch[1].trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
      const value = descMatch[1].trim();

      if (key.length < 1 || key.length > 30) {
        throw new Error("El nombre del campo debe ser corto (ej: Historia, Arma, Habilidad).");
      }

      if (value.length > MAX_SLOT_SIZE) {
        throw new Error(`La descripción es demasiado larga (Máximo ${MAX_SLOT_SIZE} caracteres).`);
      }

      const slots = {};
      slots[key] = value;

      const character = await editCharacter({
        creatorId: ctx.sender,
        characterName: activeChar.name,
        patch: {
          slots,
        },
      });

      await ctx.react("📝");

      await ctx.reply(
        "📝 *INFORMACIÓN ACTUALIZADA*\n\n" + 
        `👤 *${character.name}*\n` +
        `✅ El campo _${key}_ ha sido modificado con éxito.`
      );
    } catch (error) {
      await ctx.social(formatError(error.message));
    }
  },
};
