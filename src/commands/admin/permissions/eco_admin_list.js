// @ts-nocheck
const { listEconomyAdmins } = require("../../../services/permissionService");
const { getOwnerRecords } = require("../../../utils/permissionUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "eco_admin_list",
  aliases: ["eal", "econ_admin_list"],
  description: "Lista los administradores de economía.(Solo para el creador del bot)",
  category: "admin",
  creatorOnly: true,

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   */
  async execute(ctx) {
    /**
     * @constant admins
     */
    const admins = await listEconomyAdmins();
    /**
     * @constant owners
     */
    const owners = getOwnerRecords();

    /**
     * @constant ownerNames
     */
    const ownerNames = owners.map((owner) => ({
      name: owner.displayName || "Creador",
      phone: owner.phone,
    }));

    /**
     * @constant lines
     * @type {*[]}
     */
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
        /**
         * @constant date
         */
        const date = admin.grantedAt
          ? new Date(admin.grantedAt).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })
          : "fecha desconocida";
        lines.push(`  ${index + 1}. ${admin.displayName} (${date})`);
      });
    }

    await ctx.reply(box("🛡️ Admins de economía", lines));
  },
};
