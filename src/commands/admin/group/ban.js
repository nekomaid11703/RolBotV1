const { removeParticipant } = require("../../../utils/groupUtils");
const { executeGroupAction } = require("./_groupAdminHelper");

module.exports = {
  name: "ban",
  aliases: ["expulsar", "kick"],
  description: "Expulsa a un usuario del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    await executeGroupAction(ctx, {
      serviceFn: removeParticipant,
      usageMessage: "❌ Debes mencionar al usuario que deseas expulsar.\n\nUso: /ban @usuario",
      boxTitle: "🚫 Usuario expulsado",
    });
  },
};
