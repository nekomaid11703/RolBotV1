// @ts-nocheck
// Catálogo de clases — v1.0 Combat Update
// Las stats base por clase son referencia para futuras actualizaciones.

const CLASES = {
  civil: {
    id: "civil",
    name: "Civil",
    description: "Gente comun con habilidades basicas.",
    baseStats: { atk: 6, def: 6, aspd: 6, ref: 6, mspd: 6, fulgor: 6, d_fulgor: 7, r_fulgor: 7 },
  },
  aventurero: {
    id: "aventurero",
    name: "Aventurero",
    description: "Explorador y combatiente. Velocidad y fuerza.",
    baseStats: { atk: 10, def: 4, aspd: 8, ref: 5, mspd: 5, fulgor: 5, d_fulgor: 6, r_fulgor: 7 },
  },
  ladron: {
    id: "ladron",
    name: "Ladron",
    description: "Especialista en velocidad y sigilo.",
    baseStats: { atk: 4, def: 4, aspd: 7, ref: 10, mspd: 7, fulgor: 5, d_fulgor: 6, r_fulgor: 7 },
  },
  comerciante: {
    id: "comerciante",
    name: "Comerciante",
    description: "Velocidad y astucia.",
    baseStats: { atk: 4, def: 5, aspd: 8, ref: 7, mspd: 7, fulgor: 5, d_fulgor: 7, r_fulgor: 7 },
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
