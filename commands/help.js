const fs = require("fs");
const path = require("path");

module.exports = {
    name: "help",
    description: "Muestra la lista de comandos",
    category: "informacion",

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const commandsPath = path.join(__dirname);
        const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

        const sections = {
            administracion: {
                title: "🗂️ *Administración de fichas e inventario*",
                cmds: []
            },
            utilidades: {
                title: "🛠️ *Utilidades*",
                cmds: []
            },
            informacion: {
                title: "ℹ️ *Comandos de información*",
                cmds: []
            }
        };

        for (const file of files) {
            const cmd = require(`./${file}`);
            const category = cmd.category || "utilidades";

            if (!sections[category]) continue;

            sections[category].cmds.push(
                `• /${cmd.name} — ${cmd.description}`
            );
        }

        let text =
            "📜 *Lista de comandos*\n" +
            "────────────────────\n\n";

        for (const key of Object.keys(sections)) {
            if (sections[key].cmds.length === 0) continue;

            text +=
                `${sections[key].title}\n\n` +
                sections[key].cmds.join("\n") +
                "\n\n";
        }

        await sock.sendMessage(from, { text });
    }
};

