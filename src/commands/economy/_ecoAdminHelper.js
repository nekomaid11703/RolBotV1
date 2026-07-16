const { getFirstMentionedJid, extractAmountFromArgs } = require("../../utils/commandParseUtils");
const { formatDisplayMention } = require("../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../services/displayNameService");
const { formatCommandUsage, formatError, box } = require("../../utils/messageFormatUtils");
const { formatStelas } = require("../../utils/economyUtils");

const usageCache = new Map();

/** @param {{ title: string }} opts */
function getUsage(opts) {
  const key = opts.title;
  if (!usageCache.has(key)) {
    usageCache.set(key, formatCommandUsage(opts));
  }
  return usageCache.get(key);
}

/**
 * @param {{ sock: any, sender: string, userName: string, reply: Function, args: string[], command?: string }} ctx
 * @param {{ serviceFn: (targetId: string, amount: number, opts: any) => Promise<number>, createIfMissing?: boolean, usage: { icon?: string, title: string, description?: string, usage?: string, example?: string, notes?: string[] }, boxTitle: string, amountLabel: string, showAmount?: boolean, minAmount?: number }} opts
 */
async function executeEconomyAction(
  ctx,
  { serviceFn, createIfMissing = true, usage, boxTitle, amountLabel, showAmount = true, minAmount },
) {
  const targetId = getFirstMentionedJid(ctx);
  if (!targetId) {
    return ctx.reply(getUsage(usage));
  }

  const parseOpts = {};
  if (minAmount !== undefined) parseOpts.min = minAmount;
  const amount = minAmount !== undefined ? extractAmountFromArgs(ctx.args, parseOpts) : extractAmountFromArgs(ctx.args);

  if (amount === null || amount === undefined) {
    return ctx.reply(getUsage(usage));
  }

  try {
    const targetName = await resolveTargetDisplayName(ctx, targetId);
    const balance = await serviceFn(targetId, amount, {
      createIfMissing,
      userName: targetName,
      registration: {
        source: ctx.command || "economy_admin",
        scope: "target",
        createdBy: ctx.sender,
        displayName: targetName,
      },
    });

    const lines = ["", `👤  ${formatDisplayMention(targetId, targetName)}`];
    if (showAmount) lines.push("", `💵  ${amountLabel}: ${formatStelas(amount)}`);
    lines.push(`💰  Balance: ${formatStelas(balance)}`);

    await ctx.reply(box(boxTitle, lines), { mentions: [targetId] });
  } catch (error) {
    await ctx.reply(formatError(/** @type {Error} */ (error).message));
  }
}

module.exports = { executeEconomyAction };
