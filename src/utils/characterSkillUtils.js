// @ts-nocheck
const { getHabilidad, habilidadesPorClase } = require("../data/habilidades");
const { getClase } = require("../data/clases");
const { maxSkillSlots } = require("../config/characterConfig");

function habilidadesDisponibles(clase, nivel, habilidadesConocidas = []) {
  const claseConfig = getClase(clase);
  const pool = habilidadesPorClase(clase);

  return pool.filter((h) => {
    if (habilidadesConocidas.includes(h.id)) return true;
    if (h.clase === "Universal") return true;
    if (claseConfig && claseConfig.skillsByLevel) {
      const unlockLevel = Object.entries(claseConfig.skillsByLevel).find(([, skillId]) => skillId === h.id);
      if (unlockLevel && nivel >= parseInt(unlockLevel[0], 10)) return true;
    }
    return false;
  });
}

function sanitizarHabilidadesArray(habilidades, clase, nivel) {
  if (!Array.isArray(habilidades)) return [];

  const disponibles = habilidadesDisponibles(clase, nivel);
  const disponiblesIds = new Set(disponibles.map((h) => h.id));

  const validas = habilidades.filter((h) => typeof h === "string" && disponiblesIds.has(h) && getHabilidad(h));
  const maxSlots = maxSkillSlots(nivel);

  return validas.slice(0, maxSlots);
}

module.exports = { sanitizarHabilidadesArray, habilidadesDisponibles };
