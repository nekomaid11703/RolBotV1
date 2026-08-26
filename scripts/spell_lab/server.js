// @ts-nocheck
"use strict";

/**
 * Spell Lab — servidor HTTP (Node nativo, sin dependencias).
 *
 * Expone una interfaz web conectada al generador real de hechizos
 * (`skillForgeService.buildSpellDefinition`). Cada hechizo construido se persiste
 * en `src/data/user_spells.json` y queda registrado en `itemCatalog`, de modo que
 * `getItem(id)` lo resuelve en el motor principal (el loader `userSpells.js` lo
 * re-monta en el arranque).
 *
 * Endpoints:
 *   GET  /                 → interfaz HTML
 *   GET  /api/cost         → cálculo de costo fino (preview en vivo)
 *   POST /api/spells       → construir + validar + persistir (JSON { recipe })
 *   GET  /api/spells       → listar persistidos (con costo fino calculado)
 *   DELETE /api/spells/:id → eliminar persistido
 *
 * Uso:
 *   node scripts/spell_lab/server.js [--port 3000]
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  validateSpellRecipe,
  buildSpellDefinition,
  refineSpell,
  computeSpellCost,
  getSpellCategory,
  ELEMENTS,
} = require("../../src/services/rpg/skillForgeService");
const {
  loadUserSpells,
  readUserSpellRecipes,
  registerSpellRecipe,
  saveUserSpellRecipe,
  deleteUserSpellRecipe,
} = require("../../src/data/userSpells");
const { MATERIALS } = require("../../src/data/materialData");
const {
  FULGOR_COST_BASE,
  FULGOR_DILUTED_MIN,
  SPELL_TIER_BRACKETS,
  SPELL_DOMINIO_REQ,
  RESULT_TYPE_WEIGHTS,
  SPELL_NATURES,
  SPELL_ROLES,
  EFFECT_TYPES,
  EFFECT_TARGETS,
  ACTIVATIONS,
  MOMENTS,
  TARGETS,
  EFFECT_WEIGHTS,
  TARGET_WEIGHTS,
  CHANNEL_BY_NATURE,
} = require("../../src/config/combatBalance");
const {
  SPELL_KINDS,
  SPELL_APPLICATIONS,
  SPELL_NATURES: SIMPLIFIED_NATURES,
  FULGOR_NATURES,
  SPELL_RESOLUTION_RULES,
  RESOLUTION_DEFAULT_TARGET_MODE,
  EFFECT_DEFS,
  EFFECT_DEF_SCHEMA,
  ELEMENT_REACTIONS,
  ELEMENT_PERSISTENCE,
} = require("../../src/config/spellTree");
const { FULGOR_POOL_MAX, SPELL_TIER_RULES } = require("../../src/config/combatBalance");

const PORT = (() => {
  const i = process.argv.indexOf("--port");
  const v = i >= 0 ? Number(process.argv[i + 1]) : 0;
  return Number.isFinite(v) && v > 0 ? v : 3000;
})();

const HTML_FILE = path.join(__dirname, "index.html");

// Carga los hechizos persistidos en el catálogo al arrancar el servidor.
loadUserSpells();

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

function sendHtml(res, status, html) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error("Cuerpo demasiado grande"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

/**
 * Construye la respuesta de "preview": definición real + costo fino calculado.
 * @param {object} recipe - Receta normalizada
 * @param {string[]} errors - Errores de validación (pre-populados)
 * @returns {object} { ok, errors, def?, cost?, costRaw? }
 */
function buildResponse(recipe, errors) {
  const out = { ok: errors.length === 0, errors };
  if (out.ok) {
    try {
      const def = buildSpellDefinition(recipe);
      const cost = computeSpellCost(def);
      const categoryInfo = getSpellCategory(def);
      out.def = def;
      out.cost = { ...cost, ...categoryInfo };
      out.costRaw = {
        potencia: cost.potencia,
        fineza: cost.fineza,
        elementosDuplicados: (def.modules.spell.elements || []).length,
        hits: (def.modules.spell.hits || []).map((h) => ({ element: h.element, magnitude: h.magnitude })),
        effects: (def.modules.spell.effects || []).map((e) => ({
          tipo: e.tipo,
          target: e.target,
          element: e.element,
          magnitude: e.magnitude,
        })),
      };
    } catch (err) {
      out.ok = false;
      out.errors = [err.message];
    }
  }
  return out;
}

/**
 * Normaliza un body de receta (valores numéricos/claves).
 * Soporta el modo árbol (Fase D: naturaleza/rol/activación/momento/efectos) y la
 * retrocompat del modo hits (Fase B). material/rarity/tier siguen siendo derivados.
 * @param {object} body
 * @returns {object} Receta normalizada
 */
function normalizeRecipe(body) {
  const recipe = { ...body };
  const hasEffects = Array.isArray(body.effects);
  const hasSimplified = Boolean(body.kind);

  if (hasEffects) {
    recipe.effects = body.effects.map((e) => ({
      ...e,
      tipo: e.tipo,
      target: e.target,
      element: e.element || null,
      magnitude: Math.max(0, Number(e.magnitude) || 0),
      duration: Math.max(0, Number(e.duration) || 0),
    }));
  }

  if (hasEffects && !hasSimplified) {
    // Modo árbol (Fase D): los hits se derivan de los efectos "dano"; las
    // recetas con `kind` (Sistema Simplificado) conservan hits explícitos para
    // que el contrato §11 los evalúe (p.ej. DIRECT_DAMAGE_FORBIDDEN).
    recipe.naturaleza = body.naturaleza || null;
    recipe.subtype = body.subtype || null;
    recipe.role = body.role || null;
    recipe.activation = body.activation || null;
    recipe.moment = body.moment || null;
    recipe.cost = body.cost && typeof body.cost === "object" ? { ...body.cost } : null;
    delete recipe.hits;
    delete recipe.elements;
  } else {
    recipe.hits = Array.isArray(body.hits) ? body.hits : [];
    recipe.elements = Array.isArray(body.elements) ? body.elements : [];
    recipe.spellNature = body.spellNature === "objeto" ? "objeto" : "mágico";
  }

  recipe.name = String(body.name || "").trim() || body.id;
  recipe.description = String(body.description || "").trim();
  recipe.basePrice = Number(body.basePrice) || 0;
  recipe.maxStack = body.maxStack ?? 1;
  recipe.baseDamage = Number(body.baseDamage) || 0;
  recipe.range = Math.max(0, Number(body.range) || 0);
  recipe.cooldown = Math.max(0, Number(body.cooldown) || 0);
  recipe.castTime = Math.max(1, Number(body.castTime) || 1);
  // Payload de resolución (Contrato §11): se normaliza numéricamente y se
  // conserva junto al resto de la receta para que el constructor lo persista.
  if (body.kind) {
    const res = body.resolution && typeof body.resolution === "object" ? body.resolution : {};
    recipe.resolution = {
      targetMode: res.targetMode ?? null,
      radius: Math.max(0, Number(res.radius) || 0),
      barrierHp: Math.max(0, Number(res.barrierHp) || 0),
      imbuement: res.imbuement ?? null,
      duration: Math.max(0, Number(res.duration) || 0),
      statMods: Array.isArray(res.statMods)
        ? res.statMods.map((m) => ({ stat: m?.stat, delta: Number(m?.delta) || 0 }))
        : [],
    };
  }
  // material / rarity / tier NO se toman del cliente: el motor los deriva
  // (tier y rarity del costo fino; material conceptual "etereo").
  delete recipe.material;
  delete recipe.rarity;
  delete recipe.tier;
  return recipe;
}

/**
 * Preview en vivo del costo fino SIN persistir (GET /api/cost?json=...).
 */
function previewCost(query) {
  const out = { ok: false, errors: [] };
  const payload = (query.get("json") || "").replace(/^=+/, "");
  let body;
  try {
    body = JSON.parse(decodeURIComponent(payload));
  } catch {
    out.errors = ["json inválido"];
    return out;
  }
  const recipe = normalizeRecipe(body);
  const errors = validateSpellRecipe(recipe);
  return buildResponse(recipe, errors);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  try {
    // ── API ──
    if (pathname === "/api/taxonomy" && req.method === "GET") {
      return sendJson(res, 200, {
        // Sistema Simplificado (fuente: spellTree.js) — usado por el lab.
        SPELL_KINDS,
        SPELL_APPLICATIONS,
        SPELL_NATURES: SIMPLIFIED_NATURES,
        FULGOR_NATURES,
        SPELL_RESOLUTION_RULES,
        RESOLUTION_DEFAULT_TARGET_MODE,
        EFFECT_DEFS,
        EFFECT_DEF_SCHEMA,
        ELEMENT_REACTIONS,
        ELEMENT_PERSISTENCE,
        // Balanceo de costes/tier (Fase Balanceo 2026-08-18)
        FULGOR_POOL_MAX,
        SPELL_TIER_RULES,
        // Retrocompat con la web antigua (Fase D) — se mantiene para migración.
        LEGACY: {
          SPELL_NATURES,
          SPELL_ROLES,
          EFFECT_TYPES,
          EFFECT_TARGETS,
          ACTIVATIONS,
          MOMENTS,
          TARGETS,
          EFFECT_WEIGHTS,
          TARGET_WEIGHTS,
          CHANNEL_BY_NATURE,
        },
      });
    }

    if (pathname === "/api/cost" && req.method === "GET") {
      return sendJson(res, 200, previewCost(url.searchParams));
    }

    if (pathname === "/api/spells" && req.method === "GET") {
      const items = readUserSpellRecipes().map((recipe) => {
        const def = registerSpellRecipe(recipe);
        return { recipe, cost: def ? computeSpellCost(def) : null };
      });
      return sendJson(res, 200, { items });
    }

    if (pathname === "/api/spells" && req.method === "POST") {
      const raw = await readBody(req);
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        return sendJson(res, 400, { ok: false, errors: ["JSON inválido"] });
      }
      const recipe = normalizeRecipe(body);
      const errors = validateSpellRecipe(recipe);
      const preview = buildResponse(recipe, errors);
      if (!preview.ok) {
        return sendJson(res, 400, preview);
      }
      saveUserSpellRecipe(recipe);
      registerSpellRecipe(recipe);
      return sendJson(res, 201, { ok: true, def: preview.def, cost: preview.cost, recipe });
    }

    if (pathname.startsWith("/api/spells/") && req.method === "DELETE") {
      const id = decodeURIComponent(pathname.slice("/api/spells/".length));
      const removed = deleteUserSpellRecipe(id);
      if (!removed) return sendJson(res, 404, { ok: false, errors: [`No existe "${id}"`] });
      return sendJson(res, 200, { ok: true });
    }

    // ── Interfaz ──
    if (pathname === "/" || pathname === "/index.html") {
      if (!fs.existsSync(HTML_FILE)) {
        return sendHtml(res, 404, "<h1>index.html no encontrado</h1>");
      }
      return sendHtml(res, 200, fs.readFileSync(HTML_FILE, "utf8"));
    }

    return sendJson(res, 404, { ok: false, errors: ["Ruta no encontrada"] });
  } catch (err) {
    return sendJson(res, 500, { ok: false, errors: [String((err && err.message) || err)] });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Spell Lab en http://localhost:${PORT}`);
    console.log(
      `Elementos: ${ELEMENTS.join(", ")} | FULGOR_COST_BASE: ${FULGOR_COST_BASE} | tier: ${SPELL_TIER_BRACKETS.map((b) => b.tier).join(", ")}`,
    );
  });
}

module.exports = { server, previewCost, normalizeRecipe };
