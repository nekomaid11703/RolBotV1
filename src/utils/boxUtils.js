// @ts-nocheck
const BOX_W = 20;

const LINE = "✦ ━━━━━━━━━━━━━━ ✦";
const BOX_TOP = `╭${"─".repeat(BOX_W)}`;
const BOX_BTM = `╰${"─".repeat(BOX_W)}`;
const BAR = "│ ";

/**
 *
 * @param title
 * @param bodyLines
 */
function box(title, bodyLines) {
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
