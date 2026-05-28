const fs = require("fs");
const path = require("path");

// sesiones de edición activas (por USUARIO)
const editSessions = new Map();

module.exports = {
  name: "editar_ficha",
  description: "Edita una parte específica de una ficha",
  category: "administracion",
  editSessions,

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const userId = msg.key.participant || msg.key.remoteJid;

    if (args.length < 2) {
      await sock.sendMessage(from, {
        text:
          "❌ Uso: /editar_ficha <nombre> <campo>\n\n" +
          "Campos editables:\n" +
          "• personality\n" +
          "• history\n" +
          "• race\n" +
          "• skill1 / skill2 / skill3\n" +
          "• name(solo cambia el nombre que aparece en ficha, no el nombre de archivo)\n" +
          "• stats"
      });
      return;
    }

    const name = args[0].toLowerCase().slice(0, 10);
    const field = args[1].toLowerCase();
    const filepath = path.join(__dirname, "..", "data", "characters", name + ".json");

    if (!fs.existsSync(filepath)) {
      await sock.sendMessage(from, { text: "❌ Ficha no encontrada." });
      return;
    }

    const camposValidos = [
      "name",      
      "personality",
      "history",
      "race",
      "skill1",
      "skill2",
      "skill3",
      "stats"
    ];

    if (!camposValidos.includes(field)) {
      await sock.sendMessage(from, { text: "❌ Campo no editable." });
      return;
    }

    // sesión especial para stats
    editSessions.set(userId, {
      filepath,
      field,
      mode: field === "stats" ? "stats" : "text"
    });

    if (field === "stats") {
      const ficha = JSON.parse(fs.readFileSync(filepath, "utf8"));
      const statsText = Object.entries(ficha.stats)
        .map(([k, v]) => `• ${k}: ${v}`)
        .join("\n");

      await sock.sendMessage(from, {
        text:
          "✏️ *Editando estadísticas*\n\n" +
          "Stats actuales:\n" +
          statsText +
          "\n\nFormatos válidos:\n" +
          "• fuerza = 60\n" +
          "• fulgor +200\n" +
          "• resistencia -5\n\n" +
          "Puedes editar varias líneas a la vez.\n" +
          "Escribe *cancel* para cancelar."
      });
      return;
    }
    else {
      await sock.sendMessage(from, {
        text:
          `✏️ Editando *${field}*\n\n` +
          "Envía el nuevo valor ahora.\n" +
          "• Escribe *cancel* para cancelar."
      });
    }
  }
};

