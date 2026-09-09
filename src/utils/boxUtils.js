// @ts-nocheck
/**
 * @constant BOX_W
 * @type {number}
 */
const BOX_W = 20;

/**
 * @constant BOX_TOP
 */
const BOX_TOP = `╭${"─".repeat(BOX_W)}`;
/**
 * @constant BOX_BTM
 */
const BOX_BTM = `╰${"─".repeat(BOX_W)}`;
/**
 * @constant BAR
 * @type {string}
 */
const BAR = "│ ";

/**
 * @param {*} title
 * @param {*} bodyLines
 * @returns
 */
function box(title, bodyLines) {
  /**
   * @constant parts
   * @type {*[]}
   */
  const parts = [BOX_TOP, `${BAR}${title}`];
  const lines = Array.isArray(bodyLines) ? bodyLines : [String(bodyLines)];
  for (const line of lines) {
    if (line === null || line === undefined) continue;
    if (line === "") {
      parts.push(BAR);
    } else {
      parts.push(`${BAR}${String(line)}`);
    }
  }
  parts.push(BOX_BTM);
  return parts.join("\n");
}

/**
 * Separador horizontal con floritura, apto para WhatsApp (sin bordes que se
 * descuadren). Usa "─" que se renderiza monospace en dispositivos modernos.
 * @param {number} [width] - Ancho deseado
 * @returns {string}
 */
function divider(width = 13) {
  return `✦ ${"─".repeat(Math.max(5, width))} ✦`;
}

module.exports = { box, divider };
