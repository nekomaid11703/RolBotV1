const { commands } = require("../../core/commandHandler");

function normalizeCategory(category) {
  return String(category || "otros")
    .trim()
    .toLowerCase();
}

function formatCategory(category) {
  return String(category)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = {
  name: "help",
  aliases: ["menu", "comandos"],
  description: "Muestra la lista de todos los comandos",
  category: "informacion",

  async execute(ctx) {
    const uniqueCommands = new Map();

    for (const command of commands.values()) {
      if (!command?.name) continue;

      uniqueCommands.set(
        command.name.toLowerCase(),
        command,
      );
    }

    const categories = new Map();

    for (const command of uniqueCommands.values()) {
      const category = normalizeCategory(
        command.category,
      );

      if (!categories.has(category)) {
        categories.set(category, []);
      }

      categories.get(category).push(command);
    }

    const order = [
      "informacion",
      "economia",
      "personajes",
      "grupo",
      "permisos",
      "utilidades",
      "otros",
    ];

    const sortedCategories = [
      ...order.filter((c) => categories.has(c)),
      ...[...categories.keys()].filter(
        (c) => !order.includes(c),
      ),
    ];

    let text = "";

    text += "╔════════════════╗\n";
    text += "  📚 ROLBOT V1    \n";
    text += "╚════════════════╝\n\n";

    text +=
      "Usa los comandos con el prefijo /\n\n";

    for (const category of sortedCategories) {
      const commandsInCategory =
        categories.get(category);

      commandsInCategory.sort((a, b) =>
        a.name.localeCompare(b.name, "es"),
      );

      text +=
        "━━━━━━━━━━━━━━━━━━━━\n";

      text += `📂 ${formatCategory(
        category,
      )}\n`;

      text +=
        "━━━━━━━━━━━━━━━━━━━━\n";

      for (const command of commandsInCategory) {
        text += `➤ /${command.name}\n`;

        if (command.description) {
          text += `   ${command.description}\n`;
        }

        if (
          Array.isArray(command.aliases) &&
          command.aliases.length > 0
        ) {
          text += `   Alias: ${command.aliases
            .map((a) => `/${a}`)
            .join(", ")}\n`;
        }

        text += "\n";
      }
    }

    text +=
      "━━━━━━━━━━━━━━━━━━━━\n";
    text += "🤖 RolBotV1\n";
    text += "👑 Creador: Nekomaid\n";

    await ctx.reply(text);
  },
};
