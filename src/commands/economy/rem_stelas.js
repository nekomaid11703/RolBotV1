const { removeMoney } = require("../../services/economyService");
const { executeEconomyAction } = require("../../utils/economyAdminHelper");

module.exports = {
  name: "rem_stelas",
  aliases: ["rem_money", "quitar_stelas"],
  description: "Retira stelas de un usuario.(Solo para administradores de economía)",
  category: "economia",
  economyAdminOnly: true,

  /** @param {{ sock: any, sender: string, userName: string, args: string[], reply: Function }} ctx */
  async execute(ctx) {
    await executeEconomyAction(ctx, {
      serviceFn: removeMoney,
      createIfMissing: false,
      usage: {
        icon: "➖",
        title: "Retirar stelas",
        description: "Resta stelas del balance de un usuario. Solo administradores de economia.",
        usage: "/rem_stelas @usuario cantidad",
        example: "/rem_stelas @Nekomaid 100",
        notes: ["Menciona al usuario y escribe una cantidad positiva."],
      },
      boxTitle: "➖ Stelas retiradas",
      amountLabel: "Retiradas",
    });
  },
};
