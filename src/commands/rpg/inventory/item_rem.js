// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { removeItem } = require("../../../services/rpg/inventoryService");
const { getItem, ITEMS } = require("../../../data/items");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");
const { parseQuantity } = require("../../../utils/quantityUtils");

module.exports = {
  name: "item_rem",
  aliases: ["quitar_item", "removeitem", "remove_item"],
  description: "Quita un \u00edtem del inventario de tu personaje.",
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
       * @constant availableItems
       */
      const availableItems = Object.values(ITEMS)
        .map((item) => `\u2022 \`${item.id}\` \u2014 ${item.name}`)
        .join("\n");

      return ctx.reply(
        box("\uD83D\uDCE6 Quitar \u00edtem", [
          "",
          "Uso: `/item_rem <id_item> [cantidad]`",
          "",
          "\uD83D\uDCCB \u00cdtems disponibles por ID:",
          availableItems,
          "",
          "Ejemplo: `/item_rem pocion 2`",
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

    try {
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
        const validIds = Object.keys(ITEMS)
          .map((id) => `\`${id}\``)
          .join(", ");
        return ctx.reply(
          `\u274C No existe ning\u00fan \u00edtem con ID \`${itemIdInput}\`.\n\nIDs v\u00e1lidos: ${validIds}`,
        );
      }

      /**
       * @constant result
       */
      const result = await removeItem(activeChar.id, activeChar.creator_id, item.id, quantity);

      /**
       * @constant lines
       * @type {*[]}
       */
      const lines = [
        "",
        `\uD83D\uDC64  Personaje: *${activeChar.name}*`,
        `\uD83D\uDCE6  \u00cdtem quitado: *${item.name}* (\`${item.id}\`)`,
        `\uD83D\uDD22  Cantidad quitada: -${quantity}`,
        `\uD83D\uDCCA  Restante en inventario: ${result.remaining}`,
      ];

      return ctx.reply(box("\u2705 \u00cdtem quitado", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
