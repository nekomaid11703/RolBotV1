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
 * @param title
 * @param bodyLines
 * @returns
 */
function box(title, bodyLines) {
  /**
   * @constant parts
   * @type {Array}
   */
  const parts = [BOX_TOP, `${BAR}${title}`];
  for (const line of bodyLines) {
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

module.exports = { box };
