// @ts-nocheck
const { box } = require("../utils/boxUtils");

/**
 * Normaliza una sección a un array de líneas.
 * @param {Array<string>|string|null|undefined} section
 * @returns {string[]}
 */
function toLines(section) {
  if (Array.isArray(section)) return section;
  if (section == null) return [];
  return String(section).split("\n");
}

/**
 * Compone un mensaje de UI a partir de secciones reutilizables.
 *
 * Cada sección es un array de líneas (string[]) o un string multi-línea. Las
 * secciones vacías/null se ignoran; entre secciones se inserta una línea en
 * blanco. Alimenta un `box` (o el wrapper que reciba).
 * @param {{title: string, sections?: Array<Array<string>|string|null|undefined>, boxFn?: Function}} opts
 * @returns {string}
 */
function composeMessage(opts) {
  const { title, sections = [], boxFn = box } = opts || {};
  const lines = [];
  for (const section of sections) {
    const s = toLines(section);
    if (s.length === 0) continue;
    if (lines.length > 0) lines.push("");
    lines.push(...s);
  }
  return boxFn(title, lines);
}

module.exports = { composeMessage };
