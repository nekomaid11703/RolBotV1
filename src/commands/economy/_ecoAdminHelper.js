const { getFirstMentionedJid, extractAmountFromArgs } = require("../../utils/commandParseUtils");
const { formatDisplayMention } = require("../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../services/displayNameService");
const { formatCommandUsage, formatError, box } = require("../../utils/messageFormatUtils");
const { formatStelas } = require("../../utils/economyUtils");

const usageCache = new Map();

/** @param {any} opts */
function getUsage(opts) {
  const key = opts.title;
  if (!usageCache.has(key)) {
    usageCache.set(key, formatCommandUsage(opts));
  }
  return usageCache.get(key);
}

/**
 * @param {any} ctx
 * @param {{ serviceFn: Function, createIfMissing?: boolean, usage: any, boxTitle: string, amountLabel: string, showAmount?: boolean, minAmount?: number }} opts
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
    await ctx.reply(formatError(error instanceof Error ? error.message : String(error)));
  }
}

module.exports = { executeEconomyAction };
