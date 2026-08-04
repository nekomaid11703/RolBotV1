// @ts-nocheck
const { listAdminsForCategory, listAllCategories, getCategoryLabel } = require("../../../services/permissionService");
const { getOwnerRecords } = require("../../../utils/permissionUtils");
const { box } = require("../../../utils/boxUtils");

const CATEGORY_DISPLAY = { economy: "econom\u00eda", items: "\u00edtems" };

module.exports = {
  name: "admin_perm_list",
  aliases: ["apl", "perm_list"],
  description: "Lista los administradores de una categor\u00eda. (Solo para el creador del bot)",
  category: "admin",
  creatorOnly: true,

  async execute(ctx) {
    const category = (ctx.args[0] || "").toLowerCase();
    const owners = getOwnerRecords();

    const ownerNames = owners.map((owner) => ({
      name: owner.displayName || "Creador",
      phone: owner.phone,
    }));

    if (category) {
      const admins = await listAdminsForCategory(category);
      const catLabel = CATEGORY_DISPLAY[category] || getCategoryLabel(category);

      const lines = [];
      lines.push("");
      lines.push("\uD83D\uDC51 Creador:");

      if (!ownerNames.length) {
        lines.push("  \u2022 Creador");
      } else {
        ownerNames.forEach((owner) => {
          lines.push(`  \u2022 ${owner.name}`);
        });
      }

      lines.push("");
      lines.push(`\uD83D\uDCBC Administradores de ${catLabel}:`);

      if (!admins.length) {
        lines.push("  \u2022 Ninguno");
      } else {
        admins.forEach((admin, index) => {
          const date = admin.grantedAt
            ? new Date(admin.grantedAt).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })
            : "fecha desconocida";
          lines.push(`  ${index + 1}. ${admin.displayName} (${date})`);
        });
      }

      return ctx.reply(box(`\uD83D\uDEE1\uFE0F Admins de ${catLabel}`, lines));
    }

    const categories = await listAllCategories();
    const allCats = categories.length > 0 ? categories : ["economy", "items"];

    const lines = [];
    lines.push("");
    lines.push("\uD83D\uDC51 Creador:");

    if (!ownerNames.length) {
      lines.push("  \u2022 Creador");
    } else {
      ownerNames.forEach((owner) => {
        lines.push(`  \u2022 ${owner.name}`);
      });
    }

    for (const cat of allCats) {
      const admins = await listAdminsForCategory(cat);
      const catLabel = CATEGORY_DISPLAY[cat] || getCategoryLabel(cat);

      lines.push("");
      lines.push(`\uD83D\uDCC1 ${catLabel}:`);

      if (!admins.length) {
        lines.push("  \u2022 Ninguno");
      } else {
        admins.forEach((admin, index) => {
          const date = admin.grantedAt
            ? new Date(admin.grantedAt).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })
            : "fecha desconocida";
          lines.push(`  ${index + 1}. ${admin.displayName} (${date})`);
        });
      }
    }

    await ctx.reply(box("\uD83D\uDEE1\uFE0F Admins por categor\u00eda", lines));
  },
};
