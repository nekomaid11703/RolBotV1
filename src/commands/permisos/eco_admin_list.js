const { listEconomyAdmins } = require("../../services/permissionService");
const { getOwnerRecords } = require("../../utils/permissionUtils");

module.exports = {
  name: "eco_admin_list",
  aliases: ["eal", "econ_admin_list"],
  description: "Lista los administradores de economía.",
  category: "permisos",
  creatorOnly: true,

  async execute(ctx) {
    const admins = await listEconomyAdmins();
    const owners = getOwnerRecords();

    const ownerNames = owners.map((owner) => ({
      name: owner.displayName || "Creador",
      phone: owner.phone,
    }));

    const lines = [
      "━━━━━━━━━━━━━━",
      "🛡️ Administradores de economía",
      "",
      "👑 Creador:",
    ];

    if (!ownerNames.length) {
      lines.push("• Creador");
    } else {
      ownerNames.forEach((owner) => {
        lines.push(`• ${owner.name}`);
      });
    }

    lines.push("", "💼 Permisos activos:");

    if (!admins.length) {
      lines.push("• Ninguno");
    } else {
      admins.forEach((admin, index) => {
        lines.push(`${index + 1}. ${admin.displayName}`);
      });
    }

    lines.push("━━━━━━━━━━━━━━");

    await ctx.reply(lines.join("\n"));
  },
};
