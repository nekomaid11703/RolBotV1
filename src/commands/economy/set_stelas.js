const { setMoney } = require("../../services/economyService");
const { executeEconomyAction } = require("../../services/economyAdminHelper");

module.exports = {
  name: "set_stelas",
  aliases: ["set_money", "fijar_stelas"],
  description: "Establece el balance de un usuario.(Solo para administradores de economía)",
  category: "economia",
  economyAdminOnly: true,

  /** @param {{ sock: any, sender: string, userName: string, args: string[], reply: Function }} ctx */
  async execute(ctx) {
    await executeEconomyAction(ctx, {
      serviceFn: setMoney,
      usage: {
        icon: "⚙️",
        title: "Fijar stelas",
        description: "Establece el balance exacto de un usuario. Solo administradores de economia.",
        usage: "/set_stelas @usuario cantidad",
        example: "/set_stelas @Nekomaid 1000",
        notes: ["La cantidad puede ser 0 o mayor."],
      },
      boxTitle: "⚙️ Balance actualizado",
      amountLabel: "Nuevo balance",
      showAmount: false,
      minAmount: 0,
    });
  },
};
