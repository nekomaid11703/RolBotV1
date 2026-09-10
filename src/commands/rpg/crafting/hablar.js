// @ts-nocheck
const { box } = require("../../../utils/boxUtils");
const { getNpcDialogue, getShopDefinition } = require("../../../services/rpg/shopEngineService");

module.exports = {
  name: "hablar",
  aliases: ["talk", "charlar", "dialogar"],
  description: "Entabla una conversación con el NPC comerciante de la zona.",
  category: "rpg",

  /**
   * Ejecuta el comando de diálogo con el NPC.
   * Sintaxis:
   *  - `/hablar [tema]` (por defecto con Nixia)
   *  - `/hablar <tienda/npc> [tema]` (ej: `/hablar herreria lore` o `/hablar magia`)
   * @param {*} ctx
   */
  async execute(ctx) {
    let shopId = "bazar_nixia";
    let topicArg = "";

    if (ctx.args && ctx.args.length > 0) {
      const firstArg = ctx.args[0].toLowerCase();
      const possibleShop = getShopDefinition(firstArg);
      if (possibleShop) {
        shopId = possibleShop.id;
        topicArg = (ctx.args[1] || "").toLowerCase();
      } else {
        topicArg = firstArg;
      }
    }

    let category;
    if (topicArg === "lore" || topicArg === "historia" || topicArg === "mundo") {
      category = "lore";
    } else if (topicArg === "consejo" || topicArg === "tips" || topicArg === "ayuda") {
      category = "consejos";
    } else {
      const categories = ["saludos", "lore", "consejos"];
      category = categories[Math.floor(Math.random() * categories.length)];
    }

    const shop = getShopDefinition(shopId);
    if (!shop) {
      return ctx.reply("❌ NPC o comercio no encontrado.");
    }

    const dialogue = getNpcDialogue(shop.id, category);
    const shopSlug = shop.id.replace("bazar_", "").replace("tienda_", "");

    const lines = [];
    lines.push(`👤 **${shop.npcName}**`);
    lines.push(`*${shop.npcTitle}*`);
    lines.push("");
    lines.push(`"${dialogue}"`);
    lines.push("");
    lines.push(`💡 *Temas:* \`/hablar ${shopSlug} lore\`, \`/hablar ${shopSlug} consejo\``);

    return ctx.reply(box("🗣️ DIÁLOGO", lines));
  },
};
