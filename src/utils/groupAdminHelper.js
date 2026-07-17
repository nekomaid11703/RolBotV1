const { getFirstMentionedJid } = require("./commandParseUtils");
const { formatDisplayMention, withMentions } = require("./userMentionUtils");
const { resolveTargetDisplayName } = require("../services/displayNameService");
const { formatError, box } = require("./messageFormatUtils");

/**
 * @param {{ sock: any, from: string, reply: Function }} ctx
 * @param {{ serviceFn: (sock: any, jid: string, participantJid: string) => any, usageMessage: string, boxTitle: string, boxMessage?: string }} opts
 */
async function executeGroupAction(ctx, { serviceFn, usageMessage, boxTitle, boxMessage = "" }) {
  const targetId = getFirstMentionedJid(ctx);

  if (!targetId) {
    return ctx.reply(usageMessage);
  }

  try {
    const targetName = await resolveTargetDisplayName(ctx, targetId);
    const result = await serviceFn(ctx.sock, ctx.from, targetId);

    const lines = ["", `👤  ${formatDisplayMention(targetId, targetName)}`];
    if (boxMessage) lines.push("", boxMessage);
    if (typeof result === "string") lines.push("", result);

    await ctx.reply(withMentions(box(boxTitle, lines), [targetId]));
  } catch (error) {
    await ctx.reply(formatError(/** @type {Error} */ (error).message));
  }
}

module.exports = { executeGroupAction };
