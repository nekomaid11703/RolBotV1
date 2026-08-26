// @ts-nocheck
const { commands } = require("../../core/commandRegistry");

/**
 * @constant SECTIONS
 * @type {*[]}
 */
const SECTIONS = [
  {
    key: "admin",
    emoji: "\uD83D\uDD11",
    label: "ADMINISTRADOR",
    /**
     * Filters the .
     * @param {*} cmd - cmd.
     * @returns {any}
     */
    filter: (cmd) => cmd.adminPerm || cmd.economyAdminOnly || cmd.adminOnly,
  },
  {
    key: "creator",
    emoji: "\uD83D\uDC51",
    label: "CREADOR",
    /**
     * Filters the .
     * @param {*} cmd - cmd.
     * @returns {any}
     */
    filter: (cmd) => cmd.creatorOnly && !cmd.adminPerm && !cmd.economyAdminOnly && !cmd.adminOnly,
  },
  {
    key: "common",
    emoji: "\uD83D\uDCDC",
    label: "COMUNES",
    /**
     * Filters the .
     * @param {*} cmd - cmd.
     * @returns {any}
     */
    filter: (cmd) => !cmd.adminPerm && !cmd.economyAdminOnly && !cmd.adminOnly && !cmd.creatorOnly,
  },
];

/**
 * @constant SUBCAT_ORDER
 * @type {*[]}
 */
const SUBCAT_ORDER = ["rpg", "economia", "grupo", "permisos", "info"];

/**
 * @constant SUBCAT_META
 * @type {object}
 */
const SUBCAT_META = {
  rpg: { emoji: "\u2694\uFE0F", label: "RPG" },
  economia: { emoji: "\uD83D\uDCB0", label: "ECONOM\u00cdA" },
  grupo: { emoji: "\uD83C\uDFF0", label: "GRUPO" },
  permisos: { emoji: "\uD83D\uDEE1\uFE0F", label: "PERMISOS" },
  info: { emoji: "\u2139\uFE0F", label: "INFORMACI\u00d3N" },
};

/**
 * @param {*} c
 * @returns
 */
function normCat(c) {
  return String(c || "otros")
    .trim()
    .toLowerCase();
}

/**
 * @param {*} cmd
 * @returns
 */
function getSubcat(cmd) {
  /**
   * @constant cat
   */
  const cat = normCat(cmd.category);
  if (cat === "admin") {
    if (cmd.adminOnly || cmd.groupOnly) return "grupo";
    return "permisos";
  }
  return cat;
}

/**
 * @param {*} aliases
 * @returns
 */
function buildAliasStr(aliases) {
  if (!aliases || aliases.length === 0) return "";
  /**
   * @constant show
   */
  const show = aliases.slice(0, 3);
  /**
   * @constant more
   */
  const more = aliases.length > 3 ? ` +${aliases.length - 3}` : "";
  return show.map((a) => `/${a}`).join(", ") + more;
}

/**
 * @param {*} name
 * @param {*} desc
 * @param {*} aliases
 * @returns
 */
function renderCmd(name, desc, aliases) {
  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = [];
  /**
   * @constant alias
   */
  const alias = aliases && aliases.length > 0 ? ` \u2022 ${buildAliasStr(aliases)}` : "";
  lines.push(`\u2502 \u27E1 */${name}* - _${desc}_${alias}`);
  return lines;
}

/**
 * @param {*} subcatKey
 * @param {*} cmds
 * @returns
 */
function buildSubcatBlock(subcatKey, cmds) {
  /**
   * @constant meta
   */
  const meta = SUBCAT_META[subcatKey] || { emoji: "\uD83D\uDCC2", label: subcatKey.toUpperCase() };
  /**
   * @constant lines
   * @type {*[]}
   */
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

/**
 * Collects the unique commands.
 * @returns
 */
function collectUniqueCommands() {
  /**
   * @constant unique
   * @type {Map<*, *>}
   */
  const unique = new Map();
  for (const cmd of commands.values()) {
    if (!cmd?.name) continue;
    unique.set(cmd.name.toLowerCase(), cmd);
  }
  return unique;
}

/**
 * Builds a output header.
 * @returns
 */
function buildOutputHeader() {
  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = [];
  lines.push(
    `\uD83C\uDF1F \u2550\u2550\u2550\u2500\u300E \u25C8 *RolBot V1* \u25C8 \u3001\u2550\u2550\u2550\u2500 \uD83C\uDF1F`,
  );
  lines.push(`\u2502 \uD83E\uDD16 *Centro de Comandos*`);
  lines.push(`\u2502 \uD83D\uDCA1 _Usa /comando para ejecutar_`);
  lines.push(
    `\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\n`,
  );
  return lines;
}

/**
 * Returns the filtered section cmds.
 * @param {*} unique - - unique.
 * @param {*} sectionFilter - - section filter.
 * @returns
 */
function getFilteredSectionCmds(unique, sectionFilter) {
  /**
   * @constant cmds
   * @type {*[]}
   */
  const cmds = [];
  for (const cmd of unique.values()) {
    if (sectionFilter(cmd)) cmds.push(cmd);
  }
  return cmds;
}

/**
 * Group section by subcat.
 * @param {*} cmds - - cmds.
 * @returns
 */
function groupSectionBySubcat(cmds) {
  /**
   * @constant bySubcat
   * @type {Map<*, *>}
   */
  const bySubcat = new Map();
  for (const cmd of cmds) {
    /**
     * @constant sub
     */
    const sub = getSubcat(cmd);
    if (!bySubcat.has(sub)) bySubcat.set(sub, []);
    bySubcat.get(sub).push(cmd);
  }
  return bySubcat;
}

/**
 * Returns the ordered subcat list.
 * @param {*} bySubcat - - by subcat.
 * @returns
 */
function getOrderedSubcatList(bySubcat) {
  /**
   * @constant order
   */
  const order = SUBCAT_ORDER.filter((s) => bySubcat.has(s));
  for (const s of bySubcat.keys()) {
    if (!order.includes(s)) order.push(s);
  }
  return order;
}

/**
 * Builds a section content.
 * @param {*} section - - section.
 * @param {*} unique - - unique.
 * @returns
 */
function buildSectionContent(section, unique) {
  /**
   * @constant sectionCmds
   */
  const sectionCmds = getFilteredSectionCmds(unique, section.filter);
  if (sectionCmds.length === 0) return null;

  sectionCmds.sort((a, b) => a.name.localeCompare(b.name, "es"));

  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = [];
  lines.push(`\u256D\u2500\u300C ${section.emoji} *${section.label}* \u300D`);
  lines.push(`\u2502`);

  /**
   * @constant bySubcat
   */
  const bySubcat = groupSectionBySubcat(sectionCmds);
  /**
   * @constant subcatOrder
   */
  const subcatOrder = getOrderedSubcatList(bySubcat);

  for (const sub of subcatOrder) {
    /**
     * @constant cmds
     */
    const cmds = bySubcat.get(sub);
    if (!cmds || cmds.length === 0) continue;
    lines.push(buildSubcatBlock(sub, cmds));
  }
  return lines;
}

module.exports = {
  name: "help",
  aliases: ["menu", "comandos"],
  description: "Muestra la lista de todos los comandos",
  category: "info",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   */
  async execute(ctx) {
    /**
     * @constant unique
     */
    const unique = collectUniqueCommands();
    /**
     * @constant output
     */
    const output = buildOutputHeader();

    for (const section of SECTIONS) {
      /**
       * @constant sectionLines
       */
      const sectionLines = buildSectionContent(section, unique);
      if (sectionLines) output.push(...sectionLines);
    }

    output.push(`\uD83E\uDD16 *RolBotV1*  \u00B7  ${unique.size} comandos  \u00B7  \uD83D\uDC51 *Nekomaid*`);
    await ctx.reply(output.join("\n"));
  },
};
