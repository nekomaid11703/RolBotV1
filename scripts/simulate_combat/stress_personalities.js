// @ts-nocheck
"use strict";

/**
 * Catálogo de builds de ESTRÉS matemático (Fase A).
 *
 * Son perfiles extremos tipo "jugador troll": concentran todo el presupuesto
 * en un solo eje para exprimir las fórmulas (clamps, soft caps, esquiva,
 * mitigación, falloff). NO son personalidades jugables del pool real.
 *
 * Cada build define:
 *   weights:  distribución determinista del presupuesto (nivel) entre stats
 *   label:    nombre descriptivo
 *   reason:   qué invariante intenta romper
 *
 * El runner (run_stress.js) las convierte en fighters con stats exactas a un
 * nivel fijo (sin jitter, sin magia aleatoria) y les aplica equipo según la
 * sub-fase (ninguno / solo arma / arma+armadura).
 */

const STRESS_BUILDS = {
  el_muro: {
    label: "El Muro",
    reason: "minmax de vida efectiva: eHP = HP × 100/(100+def). Intenta aguantar todo sin importar el daño propio.",
    weights: { atk: 1, def: 50, aspd: 1, ref: 1, mspd: 1, hp: 20 },
  },
  el_misil: {
    label: "El Misil",
    reason: "daño puro con minmax en todo lo demás: exprime ATK hasta el clamp.",
    weights: { atk: 55, aspd: 15, hp: 1, def: 1, ref: 1, mspd: 1 },
  },
  el_intocable: {
    label: "El Intocable",
    reason: "MSPD+REF puros: intenta esquivar por distancia (mspd > aspd) o alejarse. Prueba combates infinitos.",
    weights: { mspd: 45, ref: 20, aspd: 5, atk: 1, def: 1, hp: 1 },
  },
  la_tormenta: {
    label: "La Tormenta",
    reason: "ASPD máximo: mil golpes débiles. Prueba el techo de ataques por round y el costo de fatiga por ataque.",
    weights: { aspd: 55, atk: 10, hp: 1, def: 1, ref: 1, mspd: 1 },
  },
  el_vidrio: {
    label: "El Vidrio",
    reason: "bruiser con REF: ATK+ASPD+REF. Prueba sinergias mixtas y la ventaja de reflejos por distancia.",
    weights: { atk: 30, aspd: 20, ref: 15, hp: 5, def: 1, mspd: 1 },
  },
  el_goliat: {
    label: "El Goliat",
    reason: "HP puro sin DEF: eHP alto pero sin mitigación. Prueba la relación HP-vs-DEF en vida efectiva.",
    weights: { hp: 55, atk: 1, def: 1, aspd: 1, ref: 1, mspd: 1 },
  },
};

/**
 * Convierte una build de estrés en un fighter con stats EXACTAS a un nivel fijo.
 * Distribución determinista por pesos (sin jitter): asigna el presupuesto
 * (nivel) proporcionalmente a los pesos, con piso 1 y techo STAT_CLAMP.max.
 * @param {string} buildKey - Clave de STRESS_BUILDS
 * @param {number} nivel - Nivel objetivo (presupuesto total de stats)
 * @param {object} [opts] - { hpMult, clampMax }
 * @returns {object} Fighter con equipment vacío (weapon/armorList null)
 */
function buildStressFighter(buildKey, nivel, opts = {}) {
  const build = STRESS_BUILDS[buildKey];
  if (!build) throw new Error(`Build de estrés desconocida: ${buildKey}`);

  const clampMax = opts.clampMax ?? 100;
  const hpMult = opts.hpMult ?? 3;
  const PHYSICAL = ["atk", "def", "aspd", "ref", "mspd"];

  const weights = build.weights;
  const weightTotal = Object.values(weights).reduce((a, b) => a + b, 0);

  const stats = { atk: 1, def: 1, aspd: 1, ref: 1, mspd: 1, hp: 1 };
  let budget = Math.max(nivel, PHYSICAL.length + 1);
  // Piso 1 en cada stat física + hp
  for (const k of [...PHYSICAL, "hp"]) {
    budget -= 1;
    if (budget < 0) budget = 0;
  }

  // Reparto proporcional determinista del presupuesto restante
  const keys = [...PHYSICAL, "hp"];
  let remaining = budget;
  let guard = 0;
  while (remaining > 0 && guard++ < 1_000_000) {
    const totalEff = keys.reduce((acc, k) => {
      const cur = stats[k];
      if (cur >= clampMax) return acc;
      return acc + (weights[k] || 0);
    }, 0);
    if (totalEff <= 0) break;
    let roll = Math.random() * totalEff;
    let chosen = null;
    for (const k of keys) {
      if (stats[k] >= clampMax || !weights[k]) continue;
      roll -= weights[k];
      if (roll <= 0) {
        chosen = k;
        break;
      }
    }
    if (!chosen) {
      const open = keys.filter((k) => stats[k] < clampMax && weights[k]);
      if (!open.length) break;
      chosen = open[open.length - 1];
    }
    stats[chosen] += 1;
    remaining--;
  }

  const hpStat = stats.hp;
  return {
    name: build.label,
    stats: {
      ...stats,
      fulgor: 1,
      d_fulgor: 1,
      r_fulgor: 1,
    },
    nivel: Math.max(nivel, Object.values(stats).reduce((a, b) => a + b, 0)),
    race: "estres",
    personality: buildKey,
    hp: hpStat * hpMult,
    equipment: { tierKey: "E", weapon: null, armorList: [], armor: null, shield: null, amulet: null },
    loadout: [],
  };
}

module.exports = { STRESS_BUILDS, buildStressFighter };
