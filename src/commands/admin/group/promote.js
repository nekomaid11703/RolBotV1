const { promoteToAdmin } = require("../../../utils/groupUtils");
const { executeGroupAction } = require("./_groupAdminHelper");

module.exports = {
  name: "promote",
  aliases: ["admin", "dar_admin"],
  description: "Promueve a un usuario a administrador del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  /** @param {any} ctx */
  async execute(ctx) {
    await executeGroupAction(ctx, {
      serviceFn: promoteToAdmin,
      usageMessage: "❌ Debes mencionar al usuario que deseas promover.\n\nUso: /promote @usuario",
      boxTitle: "⭐ Admin promovido",
      boxMessage: "Ahora es administrador del grupo.",
    });
  },
};
