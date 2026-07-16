const { demoteFromAdmin } = require("../../../utils/groupUtils");
const { executeGroupAction } = require("./_groupAdminHelper");

module.exports = {
  name: "demote",
  aliases: ["desadmin", "quitar_admin"],
  description: "Degrada a un administrador del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  /** @param {{ sock: any, from: string, reply: Function, sender: string, userName: string }} ctx */
  async execute(ctx) {
    await executeGroupAction(ctx, {
      serviceFn: demoteFromAdmin,
      usageMessage: "❌ Debes mencionar al administrador que deseas degradar.\n\nUso: /demote @usuario",
      boxTitle: "⬇️ Admin degradado",
      boxMessage: "Ya no es administrador del grupo.",
    });
  },
};
