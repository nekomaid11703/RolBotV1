const { commands } = require("../../core/commandHandler");

const COMBAT_CMDS = new Set([
  "combate", "atacar", "rendirse", "aceptar", "rechazar", "duel",
]);

const CAT_ORDER = [
  "informacion", "economia", "personajes", "grupo", "permisos", "utilidades", "rpg",
];

const CAT_META = {
  informacion: { emoji: "ℹ️",  label: "INFORMACIÓN" },
  economia:    { emoji: "💰",  label: "ECONOMÍA" },
  personajes:  { emoji: "🎭",  label: "PERSONAJES" },
  grupo:       { emoji: "🏰",  label: "GRUPO" },
  permisos:    { emoji: "🛡️", label: "PERMISOS" },
  utilidades:  { emoji: "🛠️", label: "UTILIDADES" },
  rpg:         { emoji: "⚔️", label: "ROL" },
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
  return show.map(a => `/${a}`).join(", ") + more;
}

function renderCmd(name, desc, aliases, style) {
  const lines = [];
  
  if (style === "multi") {
    // Diseño para comandos normales: Nombre destacado, descripción en cursiva abajo
    lines.push(`│ ⟡ */${name}*`);
    if (desc) lines.push(`│ ╰ 💬 _${desc}_`);
    if (aliases && aliases.length > 0) {
      lines.push(`│ ↳ 📎 Alias: ${buildAliasStr(aliases)}`);
    }
  } else {
    // Diseño compacto para comandos de administrador
    const alias = aliases && aliases.length > 0 ? ` (${buildAliasStr(aliases)})` : "";
    lines.push(`│ ⚡ */${name}* - _${desc}_${alias}`);
  }
  
  return lines;
}

function buildSection(title, normal, admin) {
  const lines = [];
  lines.push(`╭─「 ${title} 」`);

  for (const cmd of normal) {
    lines.push(...renderCmd(cmd.name, cmd.description || "Sin descripción", cmd.aliases, "multi"));
  }

  if (admin.length > 0) {
    lines.push(`│`);
    lines.push(`│ 🛡️ *Administración:*`);
    for (const cmd of admin) {
      lines.push(...renderCmd(cmd.name, cmd.description || "Sin descripción", cmd.aliases, "inline"));
    }
  }

  lines.push(`╰───────────────⟡\n`);
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

    // Encabezado principal modernizado
    output.push(`🌟 ═══『 ◈ *RolBot V1* ◈ 』═══ 🌟`);
    output.push(`│ 🤖 *Centro de Comandos*`);
    output.push(`│ 💡 _Usa /comando para ejecutar_`);
    output.push(`╰────────────────⟡\n`);

    // Iteración de categorías
    for (const c of all) {
      const meta = CAT_META[c] || { emoji: "📂", label: c.toUpperCase() };
      const title = `${meta.emoji} ${meta.label}`;
      
      const cmds = cats.get(c).sort((a, b) =>
        a.name.localeCompare(b.name, "es")
      );
      
      const normal = cmds.filter(cmd => getGroup(cmd) !== "admin");
      const admin = cmds.filter(cmd => getGroup(cmd) === "admin");
      
      output.push(buildSection(title, normal, admin));
    }

    // Pie de página
    output.push(`🤖 *RolBotV1*  ·  ${unique.size} comandos  ·  👑 *Nekomaid*`);

    await ctx.reply(output.join("\n"));
  },
};