// @ts-nocheck
// Catálogo de clases — v1.0 Combat Update
// Cada clase define las habilidades que desbloquea por nivel.
// Las stats base por clase son referencia para futuras actualizaciones.

const CLASES = {
  civil: {
    id: "civil",
    name: "Civil",
    description: "Gente común con habilidades básicas.",
    baseStats: { str: 2, def: 2, spd_atk: 2, ref: 2, spd_mov: 2 },
    skillsByLevel: { 20: "vendas", 44: "golpe_firme" },
  },
  aventurero: {
    id: "aventurero",
    name: "Aventurero",
    description: "Explorador y combatiente. Velocidad y fuerza.",
    baseStats: { str: 4, def: 1, spd_atk: 3, ref: 1, spd_mov: 1 },
    skillsByLevel: { 20: "ataque_veloz", 44: "doble_golpe" },
  },
  ladron: {
    id: "ladron",
    name: "Ladrón",
    description: "Especialista en velocidad y sigilo.",
    baseStats: { str: 1, def: 1, spd_atk: 2, ref: 4, spd_mov: 2 },
    skillsByLevel: { 20: "golpe_sombra", 44: "evasion" },
  },
  comerciante: {
    id: "comerciante",
    name: "Comerciante",
    description: "Velocidad y astucia.",
    baseStats: { str: 1, def: 2, spd_atk: 3, ref: 2, spd_mov: 2 },
    skillsByLevel: { 20: "venda_rapida", 44: "golpe_astuto" },
  },
};

/**
 *
 * @param id
 */
function getClase(id) {
  return CLASES[id] || null;
}

/**
 *
 */
function listarClases() {
  return Object.values(CLASES).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }));
}

/**
 *
 * @param id
 */
function validarClase(id) {
  return !!CLASES[id];
}

module.exports = {
  CLASES,
  getClase,
  listarClases,
  validarClase,
};
