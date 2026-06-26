const { listEconomyAdmins } = require("../../services/permissionService");
const { getOwnerRecords } = require("../../utils/permissionUtils");
const { box } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "eco_admin_list",
  aliases: ["eal", "econ_admin_list"],
  description: "Lista los administradores de economía.(Solo para el creador del bot)",
  category: "permisos",
  creatorOnly: true,

  async execute(ctx) {
    const admins = await listEconomyAdmins();
    const owners = getOwnerRecords();

    const ownerNames = owners.map((owner) => ({
      name: owner.displayName || "Creador",
      phone: owner.phone,
    }));

    const lines = [];

    lines.push("");
    lines.push("👑 Creador:");

    if (!ownerNames.length) {
      lines.push("  • Creador");
    } else {
      ownerNames.forEach((owner) => {
        lines.push(`  • ${owner.name}`);
      });
    }

    lines.push("");
    lines.push("💼 Permisos activos:");

    if (!admins.length) {
      lines.push("  • Ninguno");
    } else {
      admins.forEach((admin, index) => {
        const date = admin.grantedAt
          ? new Date(admin.grantedAt).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })
          : "fecha desconocida";
        lines.push(`  ${index + 1}. ${admin.displayName} (${date})`);
      });
    }

    await ctx.reply(box("🛡️ Admins de economía", lines));
  },
};