const fs = require("fs");
const path = require("path");

const commands = new Map();

// Cargar comandos automáticamente
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

async function handleCommand(sock, msg, text) {
    if (!text.startsWith("/")) return;

    const args = text.slice(1).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (!command) return;

    await command.execute(sock, msg, args);
}

module.exports = { handleCommand };
