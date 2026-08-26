const { removeParticipant } = require("../../../utils/groupUtils");
const { executeGroupAction } = require("../../../services/groupAdminHelper");

module.exports = {
  name: "ban",
  aliases: ["expulsar", "kick"],
  description: "Expulsa a un usuario del grupo.",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  /** @param {{ sock: any, from: string, reply: Function, sender: string, userName: string }} ctx */
  async execute(ctx) {
    await executeGroupAction(ctx, {
      serviceFn: removeParticipant,
      usageMessage: "❌ Debes mencionar al usuario que deseas expulsar.\n\nUso: /ban @usuario",
      boxTitle: "🚫 Usuario expulsado",
    });
  },
};
