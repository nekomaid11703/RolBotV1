const { addMoney } = require("../../services/economyService");
const { executeEconomyAction } = require("./_ecoAdminHelper");

module.exports = {
  name: "add_stelas",
  aliases: ["add_money", "sumar_stelas"],
  description: "Añade stelas a un usuario.(Solo para administradores de economía)",
  category: "economia",
  economyAdminOnly: true,

  /** @param {any} ctx */
  async execute(ctx) {
    await executeEconomyAction(ctx, {
      serviceFn: addMoney,
      usage: {
        icon: "➕",
        title: "Añadir stelas",
        description: "Suma stelas al balance de un usuario. Solo administradores de economia.",
        usage: "/add_stelas @usuario cantidad",
        example: "/add_stelas @Nekomaid 100",
        notes: ["Menciona al usuario y escribe una cantidad positiva."],
      },
      boxTitle: "➕ Stelas añadidas",
      amountLabel: "Añadidas",
    });
  },
};
