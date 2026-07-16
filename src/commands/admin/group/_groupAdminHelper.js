const { getFirstMentionedJid } = require("../../../utils/commandParseUtils");
const { formatDisplayMention, withMentions } = require("../../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../../services/displayNameService");
const { formatError, box } = require("../../../utils/messageFormatUtils");

/**
 * @param {any} ctx
 * @param {{ serviceFn: Function, usageMessage: string, boxTitle: string, boxMessage?: string|null }} opts
 */
async function executeGroupAction(ctx, { serviceFn, usageMessage, boxTitle, boxMessage = null }) {
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
    await ctx.reply(formatError(error instanceof Error ? error.message : String(error)));
  }
}

module.exports = { executeGroupAction };
