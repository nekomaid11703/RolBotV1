// @ts-nocheck
const { getFatigueLevel } = require("../../services/rpg/fatigueEngine");
const { HP_MAX } = require("../../config/characterConfig");

/**
 * Construye una barra de HP visual con icono de estado.
 * @param {number} current - HP actual
 * @param {number} [max] - HP máximo
 * @returns {string} Barra de HP formateada
 */
function buildHpBar(current, max = HP_MAX) {
  const pct = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(pct * 10);
  const empty = 10 - filled;
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(empty);

  let icon;
  if (pct > 0.6) icon = "\uD83D\uDFE2";
  else if (pct > 0.3) icon = "\uD83D\uDFE1";
  else if (pct > 0) icon = "\uD83D\uDD34";
  else icon = "\uD83D\uDC80";

  return `${icon} [${bar}] ${current}/${max}`;
}

/**
 * Construye una barra de ENERGÍA invertida (más = mejor).
 * La fatiga se presenta como energía disponible: max - fatigue actual,
 * por lo que una barra llena significa un combatiente sin agotamiento.
 * @param {number} fatigue - Fatiga actual
 * @param {number} resistance - Resistencia máxima contra fatiga
 * @returns {string} Barra de energía formateada
 */
function buildEnergyBar(fatigue, resistance) {
  const max = Math.max(1, Number(resistance) || 1);
  const current = Math.max(0, max - (Number(fatigue) || 0));
  const pct = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(pct * 10);
  const empty = 10 - filled;
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(empty);
  const { name: levelName } = getFatigueLevel(fatigue, max);
  return `\u26A1 [${bar}] ${current}/${max} ${levelName}`;
}

/**
 * Genera un resumen de estadísticas formateado en líneas.
 * Las siglas se eligen legibles para el jugador: ATAQUE, DEFENSA, VELOC.ATAQUE,
 * MOVILIDAD, REFLEJOS, FULGOR, DOMINIO.MAG, RESIST.MAG.
 * @param {*} stats - Estadísticas del personaje
 * @returns {string[]} Líneas de resumen de estadísticas
 */
function buildStatSummary(stats = {}) {
  return [
    `\u2694\uFE0F ATK ${stats.atk ?? 0}  \uD83D\uDEE1\uFE0F DEF ${stats.def ?? 0}  \u26A1 ASPD ${stats.aspd ?? 0}  \uD83C\uDFC3 MSP ${stats.mspd ?? 0}`,
    `\uD83D\uDC41\uFE0F REF ${stats.ref ?? 0}  \u2728 FULG ${stats.fulgor ?? 0}  \u2728 DOMF ${stats.d_fulgor ?? 0}  \u2728 RESF ${stats.r_fulgor ?? 0}`,
  ];
}

/**
 * Construye una barra de fatiga visual (legacy: usada en resultados de huida
 * y turnos autónomos). Muestra fatiga directa con icono por nivel.
 * @param {number} fatigue - Nivel de fatiga actual
 * @param {number} resistance - Resistencia máxima contra fatiga
 * @returns {string} Barra de fatiga formateada
 */
function buildFatigueBar(fatigue, resistance) {
  const { name: levelName, ratio } = getFatigueLevel(fatigue, resistance);
  const icons = { pleno: "\uD83D\uDFE2", agitado: "\uD83D\uDFE1", cansado: "\uD83D\uDD34", fatigado: "\uD83D\uDD34" };
  const icon = icons[levelName] || "\u26A0\uFE0F";
  const filled = Math.round(ratio * 10);
  const empty = 10 - filled;
  const bar = "\u2588".repeat(Math.min(10, Math.max(0, filled))) + "\u2591".repeat(Math.max(0, empty));
  return `${icon} ${bar} ${fatigue}/${resistance}`;
}

module.exports = { buildHpBar, buildEnergyBar, buildFatigueBar, buildStatSummary };
