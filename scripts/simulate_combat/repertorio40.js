// @ts-nocheck
"use strict";

/**
 * Catálogo masivo de 40 Habilidades Experimentales — Magia Simplificada
 *
 * Cubre las 9 naturalezas de Fulgor (fuego, agua, tierra, aire, hielo, electro,
 * luz, oscuridad, caos), los 5 tipos de resolución (proyectil, explosion, barrera,
 * buffo, aura), las 2 aplicaciones (externa, propia) y efectos de estado.
 */

const {
  validateSpellRecipe,
  buildSpellDefinition,
  getSpellCategory,
} = require("../../src/services/rpg/skillForgeService");

function spellBase(id, name, kind, application, nature, opts = {}) {
  return {
    id,
    name,
    kind,
    application,
    nature,
    effects: opts.effects || [],
    resolution: opts.resolution || null,
    castTime: opts.castTime || 1,
    cooldown: opts.cooldown || 0,
    range: opts.range || 5,
    basePrice: opts.basePrice || 100,
  };
}

const RAW_RECIPES = [
  // ── 1-10: PROYECTILES DIRECTOS (externa) ──
  spellBase("sp_p01", "Chispa Solar", "proyectil", "externa", "fuego", { range: 6, basePrice: 50 }),
  spellBase("sp_p02", "Dardo Helado", "proyectil", "externa", "hielo", { range: 6, basePrice: 90, effects: [{ tipo: "congelado", magnitude: 1, duration: 2 }] }),
  spellBase("sp_p03", "Rayo de Plasma", "proyectil", "externa", "electro", { range: 7, basePrice: 150, effects: [{ tipo: "rompe_armaduras", magnitude: 2, duration: 2 }] }),
  spellBase("sp_p04", "Saeta Luminosa", "proyectil", "externa", "luz", { range: 6, basePrice: 180, effects: [{ tipo: "cegadura", magnitude: 2, duration: 2 }] }),
  spellBase("sp_p05", "Orbe Umbrío", "proyectil", "externa", "oscuridad", { range: 5, basePrice: 220, effects: [{ tipo: "maldito", magnitude: 5, duration: 3 }] }),
  spellBase("sp_p06", "Proyectil Caótico", "proyectil", "externa", "caos", { range: 6, basePrice: 260, effects: [{ tipo: "veneno", magnitude: 4, duration: 3 }] }),
  spellBase("sp_p07", "Peñasco Flotante", "proyectil", "externa", "tierra", { range: 4, basePrice: 110, effects: [{ tipo: "rompe_armaduras", magnitude: 3, duration: 2 }] }),
  spellBase("sp_p08", "Torrente Aquático", "proyectil", "externa", "agua", { range: 5, basePrice: 100, effects: [{ tipo: "enredado", magnitude: 1, duration: 2 }] }),
  spellBase("sp_p09", "Cuchilla de Viento", "proyectil", "externa", "aire", { range: 6, basePrice: 120 }),
  spellBase("sp_p10", "Lanza de Magma", "proyectil", "externa", "fuego", { range: 5, basePrice: 320, effects: [{ tipo: "quemadura", magnitude: 8, duration: 3 }] }),

  // ── 11-20: EXPLOSIONES Y ÁREA (externa) ──
  spellBase("sp_e11", "Estallido Infernal", "explosion", "externa", "fuego", { resolution: { targetMode: "area", radius: 4 }, range: 5, basePrice: 180, effects: [{ tipo: "quemadura", magnitude: 6, duration: 3 }] }),
  spellBase("sp_e12", "Onda Sísmica", "explosion", "externa", "tierra", { resolution: { targetMode: "area", radius: 3 }, range: 4, basePrice: 210, effects: [{ tipo: "rompe_armaduras", magnitude: 4, duration: 2 }] }),
  spellBase("sp_e13", "Detonación de Voltios", "explosion", "externa", "electro", { resolution: { targetMode: "area", radius: 4 }, range: 5, basePrice: 240, effects: [{ tipo: "maldito", magnitude: 4, duration: 2 }] }),
  spellBase("sp_e14", "Ventisca Helada", "explosion", "externa", "hielo", { resolution: { targetMode: "area", radius: 5 }, range: 6, basePrice: 260, effects: [{ tipo: "congelado", magnitude: 2, duration: 2 }] }),
  spellBase("sp_e15", "Ráfaga Voraz", "explosion", "externa", "aire", { resolution: { targetMode: "area", radius: 4 }, range: 5, basePrice: 150, effects: [{ tipo: "enredado", magnitude: 1, duration: 2 }] }),
  spellBase("sp_e16", "Nova Estelar", "explosion", "externa", "luz", { resolution: { targetMode: "area", radius: 5 }, range: 6, basePrice: 350, effects: [{ tipo: "cegadura", magnitude: 3, duration: 2 }] }),
  spellBase("sp_e17", "Cataclismo de Caos", "explosion", "externa", "caos", { resolution: { targetMode: "area", radius: 5 }, range: 6, basePrice: 400, effects: [{ tipo: "veneno", magnitude: 7, duration: 3 }] }),
  spellBase("sp_e18", "Maelstrom Marino", "explosion", "externa", "agua", { resolution: { targetMode: "area", radius: 4 }, range: 5, basePrice: 280, effects: [{ tipo: "enredado", magnitude: 2, duration: 2 }] }),
  spellBase("sp_e19", "Implosión Umbría", "explosion", "externa", "oscuridad", { resolution: { targetMode: "area", radius: 4 }, range: 5, basePrice: 380, effects: [{ tipo: "maldito", magnitude: 8, duration: 3 }] }),
  spellBase("sp_e20", "Choque Térmico", "explosion", "externa", "fuego", { resolution: { targetMode: "area", radius: 4 }, range: 5, basePrice: 420, effects: [{ tipo: "choque_termico", magnitude: 10, duration: 2 }] }),

  // ── 21-26: BARRERAS Y ESCUDOS (propia) ──
  spellBase("sp_b21", "Baluarte Cincelado", "barrera", "propia", "tierra", { resolution: { barrierHp: 30, duration: 3 }, range: 0, basePrice: 140 }),
  spellBase("sp_b22", "Velo de Refracción", "barrera", "propia", "luz", { resolution: { barrierHp: 40, duration: 3 }, range: 0, basePrice: 200 }),
  spellBase("sp_b23", "Esfera de Fluidez", "barrera", "propia", "agua", { resolution: { barrierHp: 25, duration: 3 }, range: 0, basePrice: 170 }),
  spellBase("sp_b24", "Escudo Distorsionante", "barrera", "propia", "caos", { resolution: { barrierHp: 55, duration: 4 }, range: 0, basePrice: 310 }),
  spellBase("sp_b25", "Muralla Glacial", "barrera", "propia", "hielo", { resolution: { barrierHp: 45, duration: 3 }, range: 0, basePrice: 270 }),
  spellBase("sp_b26", "Protección Arcana", "barrera", "propia", "luz", { resolution: { barrierHp: 70, duration: 4 }, range: 0, basePrice: 450 }),

  // ── 27-33: BUFFOS Y ESTADÍSTICAS (propia) ──
  spellBase("sp_u27", "Frenesí de Rayo", "buffo", "propia", "electro", { resolution: { duration: 3, statMods: [{ stat: "aspd", delta: 10 }] }, range: 0, basePrice: 150 }),
  spellBase("sp_u28", "Gracia del Viento", "buffo", "propia", "aire", { resolution: { duration: 3, statMods: [{ stat: "ref", delta: 12 }] }, range: 0, basePrice: 130 }),
  spellBase("sp_u29", "Enfoque Divino", "buffo", "propia", "luz", { resolution: { duration: 4, statMods: [{ stat: "d_fulgor", delta: 15 }] }, range: 0, basePrice: 220 }),
  spellBase("sp_u30", "Marea Regenerativa", "buffo", "propia", "agua", { resolution: { duration: 4, statMods: [{ stat: "r_fulgor", delta: 10 }] }, range: 0, basePrice: 260 }),
  spellBase("sp_u31", "Furia del Abismo", "buffo", "propia", "oscuridad", { resolution: { duration: 3, statMods: [{ stat: "atk", delta: 15 }] }, range: 0, basePrice: 340 }),
  spellBase("sp_u32", "Fortaleza Ígnea", "buffo", "propia", "fuego", { resolution: { duration: 4, statMods: [{ stat: "def", delta: 10 }] }, range: 0, basePrice: 180 }),
  spellBase("sp_u33", "Ascensión Caótica", "buffo", "propia", "caos", { resolution: { duration: 4, statMods: [{ stat: "d_fulgor", delta: 25 }] }, range: 0, basePrice: 480 }),

  // ── 34-40: AURAS Y EFECTOS CONTINUOS ──
  spellBase("sp_a34", "Aura Flamígera", "aura", "externa", "fuego", { resolution: { duration: 4 }, range: 0, basePrice: 200, effects: [{ tipo: "quemadura", magnitude: 5, duration: 4 }] }),
  spellBase("sp_a35", "Prensa Helada", "aura", "externa", "hielo", { resolution: { duration: 3 }, range: 0, basePrice: 230, effects: [{ tipo: "congelado", magnitude: 1, duration: 3 }] }),
  spellBase("sp_a36", "Campo de Chispa", "aura", "externa", "electro", { resolution: { duration: 3 }, range: 0, basePrice: 250, effects: [{ tipo: "veneno", magnitude: 4, duration: 3 }] }),
  spellBase("sp_a37", "Resplandor Cegador", "aura", "externa", "luz", { resolution: { duration: 3 }, range: 0, basePrice: 290, effects: [{ tipo: "cegadura", magnitude: 2, duration: 3 }] }),
  spellBase("sp_a38", "Miasma Oscuro", "aura", "externa", "oscuridad", { resolution: { duration: 4 }, range: 0, basePrice: 330, effects: [{ tipo: "maldito", magnitude: 6, duration: 4 }] }),
  spellBase("sp_a39", "Turbulencia Caótica", "aura", "externa", "caos", { resolution: { duration: 4 }, range: 0, basePrice: 420, effects: [{ tipo: "veneno", magnitude: 8, duration: 4 }] }),
  spellBase("sp_a40", "Manto Terrenal", "aura", "propia", "tierra", { resolution: { duration: 4 }, range: 0, basePrice: 310, effects: [{ tipo: "purificado", magnitude: 1 }] }),
];

/**
 * Genera y clasifica deterministamente las 40 habilidades experimentales.
 * @returns {Array<object>}
 */
function buildRepertorio40() {
  const list = [];
  for (const raw of RAW_RECIPES) {
    const val = validateSpellRecipe(raw);
    if (val.length > 0) {
      throw new Error(`Receta fallida ${raw.id}: ${JSON.stringify(val)}`);
    }
    const def = buildSpellDefinition(raw);
    const category = getSpellCategory(def);
    list.push({
      id: raw.id,
      name: raw.name,
      def,
      category,
      nature: raw.nature,
      kind: raw.kind,
      tier: category.tier,
      fulgorCost: def.modules.spell.fulgorCost || def.modules.spell.resourceCost || 10,
    });
  }
  return list;
}

module.exports = { buildRepertorio40, RAW_RECIPES };
