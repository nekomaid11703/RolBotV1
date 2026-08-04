// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { addItem } = require("../../../services/rpg/inventoryService");
const { getItem, ITEMS } = require("../../../data/items");
const { IRON_ITEMS } = require("../../../data/ironFamily");
const { box } = require("../../../utils/boxUtils");
const { parseQuantity } = require("../../../utils/quantityUtils");

module.exports = {
  name: "item_add",
  aliases: ["dar_item", "giveitem", "give_item", "additem"],
  description: "Agrega un \u00edtem al inventario de tu personaje.",
  category: "rpg",
  adminPerm: "items",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    if (ctx.args.length === 0) {
      /**
       * @constant baseItems
       */
      const baseItems = Object.values(ITEMS).map(
        (item) => `\u2022 \`${item.id}\` \u2014 ${item.name} (+${item.modules?.heal?.amount || 0} HP)`,
      );
      /**
       * @constant ironItems
       */
      const ironItems = Object.values(IRON_ITEMS).map(
        (item) => `\u2022 \`${item.id}\` \u2014 ${item.name} (${item.type})`,
      );
      /**
       * @constant availableItems
       */
      const availableItems = [...baseItems, "", "\uD83D\uDD28 Familia del Hierro:", ...ironItems].join("\n");

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

    /**
     * @constant itemIdInput
     */
    const itemIdInput = ctx.args[0].toLowerCase();
    /**
     * @constant quantity
     */
    const quantity = parseQuantity(ctx.args[1]);

    /**
     * @constant activeChar
     */
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("\u274C No tienes un personaje activo. Usa `/crear_pj`.");
    }

    /**
     * @constant item
     */
    const item = getItem(itemIdInput);
    if (!item) {
      /**
       * @constant validIds
       */
      const validIds = [...Object.keys(ITEMS), ...Object.keys(IRON_ITEMS)].map((id) => `\`${id}\``).join(", ");
      return ctx.reply(
        `\u274C No existe ning\u00fan \u00edtem con ID \`${itemIdInput}\`.\n\nIDs v\u00e1lidos: ${validIds}`,
      );
    }

    /**
     * @constant result
     */
    const result = await addItem(activeChar.id, activeChar.creator_id, item.id, quantity);

    /**
     * @constant lines
     * @type {*[]}
     */
    const lines = [
      "",
      `\uD83D\uDC64  Personaje: *${activeChar.name}*`,
      `\uD83D\uDCE6  \u00cdtem a\u00f1adido: *${item.name}* (\`${item.id}\`)`,
      `\uD83D\uDD22  Cantidad a\u00f1adida: +${quantity}`,
      `\uD83D\uDCCA  Total en inventario: ${result.total}`,
    ];

    return ctx.reply(box("\u2705 \u00cdtem agregado", lines));
  },
};
