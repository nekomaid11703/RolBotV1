const { createCharacter, setActiveCharacter } = require("../../services/characterService");
const { isAdmin } = require("../../utils/groupUtils");
const { MAX_CHARACTER_NAME_LENGTH } = require("../../config/characterConfig");
const {
  formatCommandForm,
  formatError,
  box,
} = require("../../utils/messageFormatUtils");

module.exports = {
  name: "crear_pj",
  aliases: ["cpj"],
  description: "Crea un personaje mediante un formulario simple.",
  category: "personajes",

  async execute(ctx) {
    const rawText = ctx.text.trim();

    const template = formatCommandForm({
      icon: "🎭",
      title: "Crear personaje",
      description: "Copia la plantilla, completa tus datos y enviala de vuelta.",
      command: "/crear_pj",
      fields: ["Nombre", "Clase", "Historia"],
      example: [
        "/crear_pj",
        "Nombre: Kael",
        "Clase: Explorador",
        "Historia: Un viajero que busca reliquias antiguas.",
      ],
      notes: ["El nombre debe tener entre 2 y 40 caracteres."],
    });

    if (!rawText) {
      return ctx.reply(template);
    }

    try {
      const lines = rawText.split('\n');
      let name = '';
      let clase = '';
      let historia = '';

      for (const line of lines) {
        const trimmed = line.trim();
        const nameCandidate = trimmed.match(/^Nombre:\s*(.+)/i);
        const classCandidate = trimmed.match(/^Clase:\s*(.+)/i);
        const historyCandidate = trimmed.match(/^Historia:\s*(.+)/i);

        if (nameCandidate && !name) name = nameCandidate[1].trim();
        if (classCandidate && !clase) clase = classCandidate[1].trim();
        if (historyCandidate) {
          historia = trimmed.replace(/^Historia:\s*/i, '').trim();
        }
      }

      if (!name) {
        return ctx.reply(formatError("Formato incorrecto. Usa la plantilla completa.", template));
      }

      if (name.length < 2 || name.length > MAX_CHARACTER_NAME_LENGTH) {
        throw new Error(`El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`);
      }

      let admin = false;
      if (ctx.isGroup) {
        admin = await isAdmin(ctx.sock, ctx.from, ctx.sender);
      }

      const slots = {};
      if (historia) slots.historia = historia;
      if (clase) slots.clase = clase;

      const character = await createCharacter({
        creatorId: ctx.sender,
        creatorName: ctx.userName,
        characterName: name,
        category: "F",
        stats: null,
        slots: Object.keys(slots).length > 0 ? slots : null,
        isAdmin: admin,
      });

      await setActiveCharacter({
        targetCreatorId: ctx.sender,
        targetCreatorName: ctx.userName,
        characterName: name,
        requesterId: ctx.sender,
        requesterIsAdmin: admin,
      });

      await ctx.react("🎉");

      await ctx.reply(box("🎉 Personaje creado", [
        "",
        `👤  ${character.name.toUpperCase()}`,
        `🎖️  Rango: ${character.category}`,
        "",
        `💡 Usa /ver_pj para ver tu perfil completo`,
      ]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};