const { getFirstMentionedJid } = require("../utils/commandParseUtils");
const { formatDisplayMention, withMentions } = require("../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("./displayNameService");
const { box } = require("../utils/boxUtils");

/**
 * @param {*} ctx
 * @param {object} options
 * @param {Function} options.serviceFn
 * @param {string} options.usageMessage
 * @param {string} options.boxTitle
 * @param {string} [options.boxMessage=""]
 * @returns {Promise<*>}
 */
async function executeGroupAction(ctx, { serviceFn, usageMessage, boxTitle, boxMessage = "" }) {
  /**
   * @constant targetId
   */
  const targetId = getFirstMentionedJid(ctx);

  if (!targetId) {
    return ctx.reply(usageMessage);
  }

  /**
   * @constant targetName
   */
  const targetName = await resolveTargetDisplayName(ctx, targetId);
  /**
   * @constant result
   */
  const result = await serviceFn(ctx.sock, ctx.from, targetId);

  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = ["", `👤  ${formatDisplayMention(targetId, targetName)}`];
  if (boxMessage) lines.push("", boxMessage);
  if (typeof result === "string") lines.push("", result);

  await ctx.reply(withMentions(box(boxTitle, lines), [targetId]));
}

module.exports = { executeGroupAction };
