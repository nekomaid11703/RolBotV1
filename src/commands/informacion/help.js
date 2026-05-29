const { commands } = require("../../core/commandHandler");

module.exports = {
  name: "help",

  aliases: ["menu", "comandos"],

  description: "Muestra la lista de comandos",

  category: "informacion",



  async execute(ctx) {
    const uniqueCommands = new Map();

    for (const command of commands.values()) {
      uniqueCommands.set(command.name, command);
    }

    let text = "📚 *LISTA DE COMANDOS*\n\n";

    for (const command of uniqueCommands.values()) {
      text += `/${command.name} → ${command.description}\n`;
    }

    await ctx.reply(text);
  },
};
