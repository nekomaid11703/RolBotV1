// @ts-nocheck
const { useItem } = require("../../../services/rpg/inventoryService");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "usar",
  aliases: ["use", "consumir"],
  description: "Usa un ítem consumible de tu inventario activo.",
  category: "rpg",

  async execute(ctx) {
    if (ctx.args.length === 0) {
      return ctx.reply("❌ Debes especificar el nombre del ítem.\n\nUso: /usar <item>");
    }

    const itemName = ctx.args[0].toLowerCase();

    const result = await useItem(ctx.sender, itemName);

    const lines = [];
    lines.push("");
    lines.push(`📦  ${result.icon} ${result.itemName} usado`);
    lines.push(`❤️  HP: ${result.hpBefore} → ${result.hpAfter}`);

    return ctx.reply(box("✅ ITEM USADO", lines));
  },
};
