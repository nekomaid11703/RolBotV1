// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { addItem } = require("../../../services/rpg/inventoryService");
const { getItem, ITEMS } = require("../../../data/items");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");
const { parseQuantity } = require("../../../utils/quantityUtils");

module.exports = {
  name: "item_add",
  aliases: ["dar_item", "giveitem", "give_item", "additem"],
  description: "Agrega un \u00edtem al inventario de tu personaje.",
  category: "rpg",
  adminPerm: "items",

  async execute(ctx) {
    if (ctx.args.length === 0) {
      const availableItems = Object.values(ITEMS)
        .map((item) => `\u2022 \`${item.id}\` \u2014 ${item.icon} ${item.name} (+${item.modules?.heal?.amount || 0} HP)`)
        .join("\n");

      return ctx.reply(
        box("\uD83D\uDCE6 Agregar \u00edtem", [
          "",
          "Uso: `/item_add <id_item> [cantidad]`",
          "",
          "\uD83D\uDCCB \u00cdtems disponibles por ID:",
          availableItems,
          "",
          "Ejemplo: `/item_add pocion 5`",
        ]),
      );
    }

    const itemIdInput = ctx.args[0].toLowerCase();
    const quantity = parseQuantity(ctx.args[1]);

    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("\u274C No tienes un personaje activo. Usa `/crear_pj`.");
      }

      const item = getItem(itemIdInput);
      if (!item) {
        const validIds = Object.keys(ITEMS)
          .map((id) => `\`${id}\``)
          .join(", ");
        return ctx.reply(
          `\u274C No existe ning\u00fan \u00edtem con ID \`${itemIdInput}\`.\n\nIDs v\u00e1lidos: ${validIds}`,
        );
      }

      const result = await addItem(activeChar.id, activeChar.creator_id, item.id, quantity);

      const lines = [
        "",
        `\uD83D\uDC64  Personaje: *${activeChar.name}*`,
        `\uD83D\uDCE6  \u00cdtem a\u00f1adido: ${item.icon} *${item.name}* (\`${item.id}\`)`,
        `\uD83D\uDD22  Cantidad a\u00f1adida: +${quantity}`,
        `\uD83D\uDCCA  Total en inventario: ${result.total}`,
      ];

      return ctx.reply(box("\u2705 \u00cdtem agregado", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
