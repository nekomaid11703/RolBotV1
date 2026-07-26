const { getFirstMentionedJid } = require("./commandParseUtils");
const { formatDisplayMention, withMentions } = require("./userMentionUtils");
const { resolveTargetDisplayName } = require("../services/displayNameService");
const { box } = require("./boxUtils");
const { formatError } = require("./formatErrorUtils");

/**
 * @param {{ sock: any, from: string, reply: Function }} ctx
 * @param { serviceFn, usageMessage, boxTitle, boxMessage = "" } - TODO: describe parameter "{ serviceFn, usageMessage, boxTitle, boxMessage = "" }".
 * @param {{ serviceFn: (sock: any, jid: string, participantJid: string) => any, usageMessage: string, boxTitle: string, boxMessage?: string }} opts
 * @returns
 */
async function executeGroupAction(ctx, { serviceFn, usageMessage, boxTitle, boxMessage = "" }) {
  /**
   * @constant targetId
   */
  const targetId = getFirstMentionedJid(ctx);

  if (!targetId) {
    return ctx.reply(usageMessage);
  }

  try {
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
     * @type {Array}
     */
    const lines = ["", `👤  ${formatDisplayMention(targetId, targetName)}`];
    if (boxMessage) lines.push("", boxMessage);
    if (typeof result === "string") lines.push("", result);

    await ctx.reply(withMentions(box(boxTitle, lines), [targetId]));
  } catch (error) {
    await ctx.reply(formatError(/** @type {Error} */ (error).message));
  }
}

module.exports = { executeGroupAction };
