// @ts-nocheck
const { commands } = require("../../core/commandRegistry");

const SECTIONS = [
  {
    key: "admin",
    emoji: "\uD83D\uDD11",
    label: "ADMINISTRADOR",
    filter: (cmd) => cmd.adminPerm || cmd.economyAdminOnly || cmd.adminOnly,
  },
  {
    key: "creator",
    emoji: "\uD83D\uDC51",
    label: "CREADOR",
    filter: (cmd) => cmd.creatorOnly && !cmd.adminPerm && !cmd.economyAdminOnly && !cmd.adminOnly,
  },
  {
    key: "common",
    emoji: "\uD83D\uDCDC",
    label: "COMUNES",
    filter: (cmd) => !cmd.adminPerm && !cmd.economyAdminOnly && !cmd.adminOnly && !cmd.creatorOnly,
  },
];

const SUBCAT_ORDER = ["rpg", "economia", "grupo", "permisos", "info"];

const SUBCAT_META = {
  rpg: { emoji: "\u2694\uFE0F", label: "RPG" },
  economia: { emoji: "\uD83D\uDCB0", label: "ECONOM\u00cdA" },
  grupo: { emoji: "\uD83C\uDFF0", label: "GRUPO" },
  permisos: { emoji: "\uD83D\uDEE1\uFE0F", label: "PERMISOS" },
  info: { emoji: "\u2139\uFE0F", label: "INFORMACI\u00d3N" },
};

/**
 *
 * @param c
 */
function normCat(c) {
  return String(c || "otros")
    .trim()
    .toLowerCase();
}

/**
 *
 * @param cmd
 */
function getSubcat(cmd) {
  const cat = normCat(cmd.category);
  if (cat === "admin") {
    if (cmd.adminOnly || cmd.groupOnly) return "grupo";
    return "permisos";
  }
  return cat;
}

/**
 *
 * @param aliases
 */
function buildAliasStr(aliases) {
  if (!aliases || aliases.length === 0) return "";
  const show = aliases.slice(0, 3);
  const more = aliases.length > 3 ? ` +${aliases.length - 3}` : "";
  return show.map((a) => `/${a}`).join(", ") + more;
}

/**
 *
 * @param name
 * @param desc
 * @param aliases
 */
function renderCmd(name, desc, aliases) {
  const lines = [];
  const alias = aliases && aliases.length > 0 ? ` \u2022 ${buildAliasStr(aliases)}` : "";
  lines.push(`\u2502 \u27E1 */${name}* - _${desc}_${alias}`);
  return lines;
}

/**
 *
 * @param subcatKey
 * @param cmds
 */
function buildSubcatBlock(subcatKey, cmds) {
  const meta = SUBCAT_META[subcatKey] || { emoji: "\uD83D\uDCC2", label: subcatKey.toUpperCase() };
  const lines = [];
  lines.push(`\u256D\u2500\u2500 ${meta.emoji} ${meta.label} \u2500\u2500\u256E`);

  for (const cmd of cmds) {
    lines.push(...renderCmd(cmd.name, cmd.description || "Sin descripci\u00f3n", cmd.aliases));
  }

  lines.push(
    `\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\n`,
  );
  return lines.join("\n");
}

module.exports = {
  name: "help",
  aliases: ["menu", "comandos"],
  description: "Muestra la lista de todos los comandos",
  category: "info",

  async execute(ctx) {
    const unique = new Map();
    for (const cmd of commands.values()) {
      if (!cmd?.name) continue;
      unique.set(cmd.name.toLowerCase(), cmd);
    }

    const output = [];

    output.push(
      `\uD83C\uDF1F \u2550\u2550\u2550\u2500\u300E \u25C8 *RolBot V1* \u25C8 \u3001\u2550\u2550\u2550\u2500 \uD83C\uDF1F`,
    );
    output.push(`\u2502 \uD83E\uDD16 *Centro de Comandos*`);
    output.push(`\u2502 \uD83D\uDCA1 _Usa /comando para ejecutar_`);
    output.push(
      `\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\n`,
    );

    for (const section of SECTIONS) {
      const sectionCmds = [];

      for (const cmd of unique.values()) {
        if (section.filter(cmd)) {
          sectionCmds.push(cmd);
        }
      }

      if (sectionCmds.length === 0) continue;

      sectionCmds.sort((a, b) => a.name.localeCompare(b.name, "es"));

      output.push(`\u256D\u2500\u300C ${section.emoji} *${section.label}* \u300D`);
      output.push(`\u2502`);

      const bySubcat = new Map();
      for (const cmd of sectionCmds) {
        const sub = getSubcat(cmd);
        if (!bySubcat.has(sub)) bySubcat.set(sub, []);
        bySubcat.get(sub).push(cmd);
      }

      const subcatOrder = SUBCAT_ORDER.filter((s) => bySubcat.has(s));
      for (const s of bySubcat.keys()) {
        if (!subcatOrder.includes(s)) subcatOrder.push(s);
      }

      for (const sub of subcatOrder) {
        const cmds = bySubcat.get(sub);
        if (!cmds || cmds.length === 0) continue;
        output.push(buildSubcatBlock(sub, cmds));
      }
    }

    output.push(`\uD83E\uDD16 *RolBotV1*  \u00B7  ${unique.size} comandos  \u00B7  \uD83D\uDC51 *Nekomaid*`);

    await ctx.reply(output.join("\n"));
  },
};
