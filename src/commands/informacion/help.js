const { commands } = require("../../core/commandHandler");

const BOX_W = 34;
const CMD_PAD = 22;

const TOP = `╭${"─".repeat(BOX_W)}`;
const BTM = `╰${"─".repeat(BOX_W)}`;
const BAR = "│ ";

const COMBAT_CMDS = new Set([
  "combate", "atacar", "rendirse", "aceptar", "rechazar", "duel",
]);

const CAT_ORDER = [
  "informacion", "economia", "personajes", "grupo", "permisos", "utilidades", "rpg",
];

const CAT_META = {
  informacion: { emoji: "ℹ️",  label: "INFORMACIÓN" },
  economia:     { emoji: "💰",  label: "ECONOMÍA" },
  personajes:   { emoji: "🎭",  label: "PERSONAJES" },
  grupo:        { emoji: "🏰",  label: "GRUPO" },
  permisos:     { emoji: "🛡️", label: "PERMISOS" },
  utilidades:   { emoji: "🛠️", label: "UTILIDADES" },
  rpg:          { emoji: "⚔️", label: "ROL" },
};

function normCat(c) {
  return String(c || "otros").trim().toLowerCase();
}

function getGroup(cmd) {
  if (cmd.adminOnly || cmd.economyAdminOnly) return "admin";
  return "normal";
}

function buildAliasStr(aliases) {
  if (!aliases || aliases.length === 0) return "";
  const show = aliases.slice(0, 4);
  const more = aliases.length > 4 ? ` +${aliases.length - 4}` : "";
  return show.map(a => `/${a}`).join("  ") + more;
}

function renderCmd(name, desc, aliases, style) {
  const cmdTag = `/${name}`;
  const padding = cmdTag.length < CMD_PAD ? " ".repeat(CMD_PAD - cmdTag.length) : "  ";
  const line = `${BAR}${cmdTag}${padding}${desc}`;
  if (!aliases || aliases.length === 0) return [line];
  if (style === "inline") {
    const alias = buildAliasStr(aliases);
    return [`${line}  · ${alias}`];
  }
  const alias = buildAliasStr(aliases);
  return [line, `${BAR}${" ".repeat(CMD_PAD)}↳ ${alias}`];
}

function buildSection(title, normal, admin) {
  const lines = [TOP, `${BAR}${title}`];

  for (const cmd of normal) {
    lines.push(...renderCmd(cmd.name, cmd.description || "", cmd.aliases, "multi"));
  }

  if (admin.length > 0) {
    lines.push(BAR);
    lines.push(`${BAR}⚡ Admin:`);
    for (const cmd of admin) {
      lines.push(...renderCmd(cmd.name, cmd.description || "", cmd.aliases, "inline"));
    }
  }

  lines.push(BTM);
  return lines.join("\n");
}

module.exports = {
  name: "help",
  aliases: ["menu", "comandos"],
  description: "Muestra la lista de todos los comandos",
  category: "informacion",

  async execute(ctx) {
    const unique = new Map();
    for (const cmd of commands.values()) {
      if (!cmd?.name) continue;
      if (COMBAT_CMDS.has(cmd.name.toLowerCase())) continue;
      unique.set(cmd.name.toLowerCase(), cmd);
    }

    const cats = new Map();
    for (const cmd of unique.values()) {
      const c = normCat(cmd.category);
      if (!cats.has(c)) cats.set(c, []);
      cats.get(c).push(cmd);
    }

    const all = [];
    const seen = new Set();
    for (const c of CAT_ORDER) {
      if (cats.has(c) && !seen.has(c)) { seen.add(c); all.push(c); }
    }
    for (const c of cats.keys()) {
      if (!seen.has(c)) { seen.add(c); all.push(c); }
    }

    const output = [];

    output.push(TOP);
    output.push(`${BAR}          ◈ RolBot V1 ◈`);
    output.push(`${BAR}      Centro de Comandos`);
    output.push(BAR);
    output.push(`${BAR}  Usa /comando para ejecutar`);
    output.push(BTM);

    for (const c of all) {
      const meta = CAT_META[c] || { emoji: "📂", label: c.toUpperCase() };
      const title = `${meta.emoji} ${meta.label}`;
      const cmds = cats.get(c).sort((a, b) =>
        a.name.localeCompare(b.name, "es"),
      );
      const normal = cmds.filter(cmd => getGroup(cmd) !== "admin");
      const admin = cmds.filter(cmd => getGroup(cmd) === "admin");
      output.push(buildSection(title, normal, admin));
    }

    output.push(TOP);
    output.push(`${BAR}🤖 RolBotV1  ·  ${unique.size} comandos  ·  👑 Nekomaid`);
    output.push(BTM);

    await ctx.reply(output.join("\n"));
  },
};