// @ts-nocheck
const { getHabilidad, habilidadesPorClase } = require("../data/habilidades");

function habilidadesDisponibles(clase) {
  return habilidadesPorClase(clase);
}

function sanitizarHabilidadesArray(habilidades, clase) {
  if (!Array.isArray(habilidades)) return [];

  const disponibles = habilidadesDisponibles(clase);
  const disponiblesIds = new Set(disponibles.map((h) => h.id));

  return habilidades.filter((h) => typeof h === "string" && disponiblesIds.has(h) && getHabilidad(h));
}

module.exports = { sanitizarHabilidadesArray, habilidadesDisponibles };
