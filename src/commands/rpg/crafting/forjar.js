// @ts-nocheck
const characterService = require("../../../services/characterService");
const craftingService = require("../../../services/rpg/craftingService");
const { getItem } = require("../../../data/items");
const { MATERIALS } = require("../../../data/materialData");
const { normalizeTier } = require("../../../config/tierConfig");
const {
  getWeaponStats,
  getProjectileStats,
  getArmorStats,
  getArtifactStats,
  getSpellStats,
} = require("../../../services/rpg/itemStatService");
const { COVERAGE_RULES } = require("../../../services/rpg/armorSetService");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

/**
 * Ventana de confirmación para forjar (QoL: ver stats reales antes de fabricar).
 * @constant CONFIRM_TIMEOUT_MS
 */
const CONFIRM_TIMEOUT_MS = 30 * 1000;

/**
 * Palabras de confirmación de forja pendiente.
 * @constant CONFIRM_WORDS
 * @type {Set<string>}
 */
const CONFIRM_WORDS = new Set([
  "si",
  "sí",
  "y",
  "ok",
  "confirmar",
  "aceptar",
  "confirm",
  "yes",
  "forjar_si",
  "forjar_confirmar",
]);

/**
 * Palabras de cancelación de forja pendiente.
 * @constant CANCEL_WORDS
 * @type {Set<string>}
 */
const CANCEL_WORDS = new Set(["no", "cancelar", "cancel", "nope", "c", "forjar_no"]);

/**
 * Memoria de forjas pendientes de confirmar por usuario.
 * @constant pendingForges
 * @type {Map<string, {recipeKey: string, matKey: string, tier: string, characterId: *|string, creatorId: string, timestamp: number}>}
 */
const pendingForges = new Map();

/**
 * Clave por usuario de la forja pendiente.
 * @param {object} ctx
 * @returns {string}
 */
function pendingKey(ctx) {
  return `${ctx.from}:${ctx.senderJid || ctx.sender}`;
}

/**
 * @constant COVERAGE_NAME
 * @type {Record<string, string>}
 */
const COVERAGE_NAME = { total: "Total", alta: "Alta", media: "Media", ligera: "Ligera" };

/**
 * Secciones de forja. Estructura procedural: añadir una sección nueva (p. ej.
 * "herramientas") solo requiere un nuevo objeto en SECTIONS.
 * @constant SECTIONS
 * @type {Array<{id: string, emoji: string, label: string, aliases: string[], subcats: Array<{emoji: string, label: string, recipes: string[]}>, upcoming?: boolean}>}
 */
const SECTIONS = [
  {
    id: "armas",
    emoji: "⚔️",
    label: "ARMAS",
    aliases: ["arma", "armas", "armamento", "weapon", "weapons", "combat"],
    subcats: [
      { emoji: "🗡️", label: "Cuerpo a Cuerpo", recipes: ["daga", "espada", "espada_larga", "lanza", "maza"] },
      { emoji: "🥷", label: "Arrojadizas", recipes: ["kunai"] },
      { emoji: "🏹", label: "A Distancia", recipes: ["arco", "ballesta", "resortera", "cerbatana"] },
      { emoji: "💥", label: "Munición (1 → 16x)", recipes: ["flechas", "virotes", "balines", "dardos"] },
      { emoji: "🔮", label: "Mágicas", recipes: ["varita", "baculo"] },
    ],
  },
  {
    id: "armaduras",
    emoji: "🛡️",
    label: "ARMADURAS Y EQUIPO",
    aliases: ["armadura", "armaduras", "armor", "equipo", "defensa", "defensive"],
    subcats: [
      { emoji: "🪖", label: "Cascos (cobertura)", recipes: ["casco", "casco_ligera", "casco_alta", "casco_total"] },
      {
        emoji: "👕",
        label: "Pecheras (cobertura)",
        recipes: ["pechera", "pechera_ligera", "pechera_media", "pechera_total"],
      },
      { emoji: "🦵", label: "Grebas (cobertura)", recipes: ["grebas", "grebas_ligera", "grebas_alta", "grebas_total"] },
      { emoji: "🥾", label: "Botas (cobertura)", recipes: ["botas", "botas_media", "botas_alta", "botas_total"] },
      {
        emoji: "🛡️",
        label: "Escudos (cobertura)",
        recipes: ["escudo", "escudo_ligera", "escudo_alta", "escudo_total"],
      },
      { emoji: "🧥", label: "Equipo de Mago", recipes: ["tunica"] },
      { emoji: "📿", label: "Accesorios", recipes: ["amuleto"] },
    ],
  },
  {
    id: "herramientas",
    emoji: "🔨",
    label: "HERRAMIENTAS",
    aliases: ["herramienta", "herramientas", "tools", "tool", "utilidades"],
    subcats: [],
    upcoming: true, // sección de ejemplo — aún no implementada
  },
];

/**
 * Total de recetas reales (no upcoming) de una sección.
 * @param {object} section
 * @returns {number}
 */
function countRecipes(section) {
  if (section.upcoming) return 0;
  return section.subcats.reduce((sum, sc) => sum + sc.recipes.length, 0);
}

/**
 * Busca una sección por alias o por índice 1-based.
 * @param {string} input
 * @returns {object|null}
 */
function resolveSection(input) {
  const v = String(input || "").trim();
  if (/^\d+$/.test(v)) {
    const idx = Number(v) - 1;
    return SECTIONS[idx] || null;
  }
  const q = v.toLowerCase();
  return SECTIONS.find((s) => s.aliases.some((a) => a === q)) || null;
}

/**
 * Resuelve las estadísticas reales (material + tier) de un ítem y las devuelve
 * como bloque de líneas legible. El catálogo guarda todos los ítems en Tier E,
 * por lo que se sobreescribe el tier pedido antes de resolver.
 * @param {object} itemDef
 * @param {string} tier
 * @returns {string[]}
 */
function renderStatsBlock(itemDef, tier) {
  const def = { ...itemDef, tier: normalizeTier(tier) };
  const cats = def.categories || [];
  const lines = [];

  if (cats.includes("weapon")) {
    const w = getWeaponStats(def);
    lines.push("\u2694\uFE0F *ARMA (stats reales)*");
    lines.push(`  \u2022 Naturaleza: *${w.ranged ? "proyectil" : w.damageNature}*`);
    lines.push(`  \u2022 Daño (Tier ${def.tier}): ${w.baseDamage}`);
    lines.push(`  \u2022 Manos: ${w.hands === 2 ? "2 (sin escudo)" : "1 (mano libre)"}`);
    lines.push(`  \u2022 Alcance: ${w.weaponRange}`);
    if (w.magicConduction > 0) lines.push(`  \u2022 Conducción mágica: +${w.magicConduction}`);
    return lines;
  }

  if (cats.includes("throwable")) {
    const t = def.modules?.throwable || {};
    lines.push("\uD83E\uDD77 *ARROJADIZA (stats reales)*");
    lines.push(`  \u2022 Daño (Tier ${def.tier}): ${t.baseDamage}`);
    lines.push(`  \u2022 Alcance: ${t.range}`);
    return lines;
  }

  if (cats.includes("armor")) {
    const a = getArmorStats(def);
    const rule = COVERAGE_RULES[a.coverage] || { mspdPenalty: 0, fatigueMult: 1 };
    lines.push("\uD83D\uDEE1\uFE0F *ARMADURA (stats reales)*");
    lines.push(`  \u2022 Defensa: +${a.bonusDef} | Dureza: ${a.maxResist}`);
    lines.push(`  \u2022 Slot: [${a.slot}] | Cobertura: *${COVERAGE_NAME[a.coverage] || a.coverage}*`);
    lines.push(`  \u2022 Movilidad: -${Math.round(rule.mspdPenalty * 100)}% vel | Fatiga \u00d7${rule.fatigueMult}`);
    return lines;
  }

  if (cats.includes("projectile") || cats.includes("ammo")) {
    const p = getProjectileStats(def);
    lines.push("\uD83D\uDCA5 *MUNICI\u00d3N (stats reales)*");
    lines.push(`  \u2022 Daño (Tier ${def.tier}): ${p.baseDamage} (${p.damageNature})`);
    return lines;
  }

  if (cats.includes("artifact")) {
    const art = getArtifactStats(def);
    const formatted =
      Object.entries(art.buffs || {})
        .map(([s, v]) => `+${v} ${s.toUpperCase()}`)
        .join(", ") || "Místico (canaliza Fulgor)";
    lines.push("\uD83D\uDD2E *ARTEFACTO*");
    lines.push(`  \u2022 Bonus pasivo: ${formatted}`);
    return lines;
  }

  if (cats.includes("focus")) {
    const f = getSpellStats(def);
    lines.push("\uD83D\uDD2E *FOCO M\u00c1GICO*");
    lines.push(`  \u2022 Canalización: +${f.canalizeBase} | Conducción: +${f.magicConduction}`);
    return lines;
  }

  if (cats.includes("spell_container")) {
    lines.push("\uD83D\uDCD6 *CONTENEDOR DE HECHIZOS*");
  }

  return lines;
}

/**
 * Tarjeta de confirmación con las estadísticas reales y la ventana de 15s.
 * @param {object} opts
 * @param {object} opts.itemDef
 * @param {string} opts.recipeKey
 * @param {string} opts.matKey
 * @param {string} opts.tier
 * @param {number} opts.cost
 * @returns {string}
 */
function renderConfirmation({ itemDef, recipeKey, matKey, tier, cost }) {
  const matName = MATERIALS[matKey]?.name || matKey;
  const prod = craftingService.CRAFTING_RECIPES[recipeKey]?.producedQuantity;
  const lines = [
    `\uD83D\uDCE6 *${itemDef.name}* (\`${recipeKey}\`)`,
    `\uD83D\uDC77 *Material:* ${matName} · Tier ${normalizeTier(tier)}`,
    `\uD83E\uDDF1 *Coste:* ${cost} de material${prod && prod > 1 ? `  \u2192 produce \u00d7${prod}` : ""}`,
    "",
    ...renderStatsBlock(itemDef, tier),
    "",
    "⚠️ *¿Confirmas la forja?*",
    `  \u2022 Escribe \`/forjar si\` para confirmar`,
    `  \u2022 \`/forjar no\` para cancelar`,
    `  \u2022 ⏱️ Se cancela sola en *30 segundos*`,
  ];
  return box("🔨 CONFIRMA FORJA", lines);
}

/**
 * Renderiza la línea de una receta dentro de una subcategoría.
 * @param {string} key
 * @returns {string}
 */
function recipeLine(key) {
  const r = craftingService.CRAFTING_RECIPES[key];
  if (!r) return "";
  const prod = r.producedQuantity && r.producedQuantity > 1 ? ` → x${r.producedQuantity}` : "";
  const cost = `${r.materialCost} ${r.materialCost === 1 ? "unidad" : "unidades"}`;
  return `    \u2022 \`${key}\` — ${r.name}${prod} *(${cost})*`;
}

/**
 * Menú principal: lista compacta de secciones expandibles.
 * @returns {string}
 */
function renderMenu() {
  const lines = ["🔨 *FORJA* — elige una sección", ""];
  SECTIONS.forEach((s, i) => {
    if (s.upcoming) {
      lines.push(`  \u2022 ${i + 1} \u2192 ${s.emoji} ${s.label} *(\uD83D\uDEA7 pr\u00f3ximo)*`);
    } else {
      lines.push(`  \u2022 ${i + 1} \u2192 ${s.emoji} ${s.label} *(${countRecipes(s)} recetas)*`);
    }
  });
  lines.push("");
  lines.push("💡 *Uso:* `/forjar <secci\u00f3n|\u00ba>` para abrirla");
  lines.push("  \u2022 `/forjar <receta> <material> [tier]` para forjar");
  lines.push("  \u2022 Ej: `/forjar 1` | `/forjar armas` | `/forjar flechas acero E`");
  return box("🔨 HERRERÍA & FORJA", lines);
}

/**
 * Vista expandida de una sección: agrupa sus recetas por subcategoría.
 * @param {object} section
 * @returns {string}
 */
function renderSection(section) {
  const lines = [`${section.emoji} *${section.label}*`, ""];
  for (const sc of section.subcats) {
    lines.push(`\u2500\u2500 ${sc.emoji} ${sc.label}`);
    for (const key of sc.recipes) {
      const line = recipeLine(key);
      if (line) lines.push(line);
    }
    lines.push("");
  }
  lines.push("💡 *Para forjar:* `/forjar <receta> <material> [tier]`");
  lines.push("  \u2022 Ej: `/forjar ballesta mitril A` | `/forjar flechas acero E`");
  lines.push(`  \u2022 \u21A9 Usa \`/forjar\` para volver al men\u00fa`);
  return box(`🔨 ${section.emoji} ${section.label}`, lines);
}

/**
 * Notifica la expiración de la forja pendiente (auto-cancelación 15s).
 * @param {object} ctx
 * @param {string} key
 */
function scheduleAutoCancel(ctx, key) {
  setTimeout(() => {
    const curr = pendingForges.get(key);
    if (curr && Date.now() - curr.timestamp >= CONFIRM_TIMEOUT_MS) {
      pendingForges.delete(key);
      try {
        ctx.reply("⌛ Tiempo de confirmación agotado. Forja cancelada.");
      } catch {
        // socket cerrado — ignorar
      }
    }
  }, CONFIRM_TIMEOUT_MS);
}

/**
 * Inicia una forja: valida receta/material y muestra confirmación con stats reales.
 * @param {object} ctx
 * @param {string} key
 * @param {string} recipeArg
 * @param {string} materialArg
 * @param {string} tierArg
 */
async function startForge(ctx, key, recipeArg, materialArg, tierArg) {
  const tier = tierArg ? String(tierArg).toUpperCase() : "E";

  try {
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const recipeKey = craftingService.normalizeRecipeKey(recipeArg);
    if (!recipeKey) {
      return ctx.reply(formatError(`Tipo de forja no válido: "${recipeArg}".`, "Usa `/forjar` para ver las recetas."));
    }
    const matKey = craftingService.normalizeMaterialId(materialArg);
    if (!matKey) {
      return ctx.reply(
        formatError(`El material "${materialArg}" no existe.`, "Usa `/forjar` para ver los materiales."),
      );
    }

    const recipe = craftingService.CRAFTING_RECIPES[recipeKey];
    const itemDef = getItem(`${recipe.baseType}_de_${matKey}`);
    if (!itemDef) {
      return ctx.reply(formatError(`No existe el producto forjado "${recipe.baseType}_de_${matKey}".`));
    }

    pendingForges.set(key, {
      recipeKey,
      matKey,
      tier,
      characterId: activeChar.id,
      creatorId: ctx.sender,
      characterName: activeChar.name,
      timestamp: Date.now(),
    });

    scheduleAutoCancel(ctx, key);

    const cost = `${recipe.materialCost} ${recipe.materialCost === 1 ? "unidad" : "unidades"}`;
    return ctx.reply(renderConfirmation({ itemDef, recipeKey, matKey, tier, cost }));
  } catch (err) {
    return ctx.reply(formatError(err));
  }
}

/**
 * Confirma una forja pendiente y ejecuta el crafteo.
 * @param {object} ctx
 * @param {string} key
 */
function handleConfirm(ctx, key) {
  const pending = pendingForges.get(key);
  if (!pending) {
    return ctx.reply("📭 No hay ninguna forja pendiente. Usa `/forjar <receta> <material> [tier]`.");
  }
  if (Date.now() - pending.timestamp > CONFIRM_TIMEOUT_MS) {
    pendingForges.delete(key);
    return ctx.reply("⌛ Tiempo de confirmación agotado. Forja cancelada.");
  }
  pendingForges.delete(key);
  return runForging(ctx, pending);
}

/**
 * Cancela una forja pendiente.
 * @param {object} ctx
 * @param {string} key
 */
function handleCancel(ctx, key) {
  if (!pendingForges.has(key)) {
    return ctx.reply("📭 No hay ninguna forja pendiente de cancelar.");
  }
  pendingForges.delete(key);
  return ctx.reply("✖️ Forja cancelada. No se consumió material.");
}

/**
 * Ejecuta el crafteo de una forja confirmada.
 * @param {object} ctx
 * @param {object} pending
 */
async function runForging(ctx, pending) {
  try {
    const res = await craftingService.craftEquipment({
      characterId: pending.characterId,
      creatorId: pending.creatorId,
      recipeType: pending.recipeKey,
      materialId: pending.matKey,
      tier: pending.tier,
    });

    const tierLabels = {
      E: "Escaso",
      D: "Distinguido",
      C: "Notable",
      B: "Bueno",
      A: "Alto",
      S: "Supremo",
      N: "Nirvana",
    };
    const tierLabel = tierLabels[res.tier] || res.tier;
    const isAmmo = res.producedQuantity > 1;

    const lines = [
      `✅ *¡${pending.characterName} forjó: ${res.craftedItem.name}!*`,
      `🏷️ Calidad: Tier ${res.tier} (${tierLabel})`,
      `🪨 Material: ${res.materialName} (Tier ${res.tier})`,
      `📦 Consumido: ${res.materialCost}× ${res.materialName}`,
      isAmmo ? `🎥 Producido: *${res.producedQuantity} unidades* de ${res.craftedItem.name}` : "",
      "",
      `💡 Usa \`/inventario\` para verlo o \`/equipar\` para usarlo.`,
    ].filter((l) => l !== null && l !== undefined);

    return ctx.reply(box("🔨 FORJA EXITOSA", lines));
  } catch (err) {
    return ctx.reply(formatError(err));
  }
}

module.exports = {
  name: "forjar",
  aliases: ["craftear", "crear_item", "forja", "craft"],
  description:
    "Forja armas, armaduras y accesorios consumiendo unidades de un material del Tier indicado. Muestra estadísticas reales y pide confirmación.",
  pendingForges,

  async execute(ctx) {
    const [recipeArg, materialArg, tierArg] = ctx.args;
    const first = String(recipeArg || "").toLowerCase();
    const key = pendingKey(ctx);

    // ── Confirmar / cancelar forja pendiente ──────────────────────────────────
    if (CONFIRM_WORDS.has(first)) return handleConfirm(ctx, key);
    if (CANCEL_WORDS.has(first)) return handleCancel(ctx, key);

    // ── Sin argumentos → menú de secciones ────────────────────────────────────
    if (ctx.args.length === 0) {
      return ctx.reply(renderMenu());
    }

    // ── Primer argumento es una sección/referencia → expandir ─────────────────
    const section = resolveSection(recipeArg);
    if (section) {
      if (section.upcoming) {
        return ctx.reply(
          box(`🚧 ${section.emoji} ${section.label}`, [
            "",
            "Esta sección se encuentra *en desarrollo*.\u2003🏗️",
            "",
            "🔨 *Próximamente:* herramientas, utilidades y mejoras forjables.",
          ]),
        );
      }
      return ctx.reply(renderSection(section));
    }

    // ── Receta sin material → guiar a añadir material para confirmar ──────────
    if (recipeArg && !materialArg) {
      return ctx.reply(
        box("🔨 FORJA", [
          "",
          `📖 Receta: \`${recipeArg}\``,
          "",
          "📊 Para ver las estadísticas reales y confirmar, indica el material:",
          "💡 `/forjar <receta> <material> [tier]`",
          "  \u2022 Ej: `/forjar espada mitril B`",
          `  \u2022 \u21A9 Usa \`/forjar\` para el men\u00fa`,
        ]),
      );
    }

    // ── Forja: mostrar estadísticas reales del material + confirmación ─────────
    return startForge(ctx, key, recipeArg, materialArg, tierArg);
  },
};
