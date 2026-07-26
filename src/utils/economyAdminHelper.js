const { getFirstMentionedJid, extractAmountFromArgs } = require("./commandParseUtils");
const { formatDisplayMention } = require("./userMentionUtils");
const { resolveTargetDisplayName } = require("../services/displayNameService");
const { box } = require("./boxUtils");
const { formatError } = require("./formatErrorUtils");
const { formatCommandUsage } = require("./formatCommandUtils");
const { formatStelas } = require("./economyUtils");

/**
 * @constant usageCache
 * @type {Map}
 */
const usageCache = new Map();

/**
 * @param {{ title: string }} opts.
 * @param opts
 * @returns
 */
function getUsage(opts) {
  /**
   * @constant key
   */
  const key = opts.title;
  if (!usageCache.has(key)) {
    usageCache.set(key, formatCommandUsage(opts));
  }
  return usageCache.get(key);
}

/**
 * @param {{ sock: any, sender: string, userName: string, reply: Function, args: string[], command?: string }} ctx
 * @param root0
 * @param {{ serviceFn: (targetId: string, amount: number, opts: any) => Promise<number>, createIfMissing?: boolean, usage: { icon?: string, title: string, description?: string, usage?: string, example?: string, notes?: string[] }, boxTitle: string, amountLabel: string, showAmount?: boolean, minAmount?: number }} opts
 * @returns
 */
async function executeEconomyAction(
  ctx,
  { serviceFn, createIfMissing = true, usage, boxTitle, amountLabel, showAmount = true, minAmount },
) {
  /**
   * @constant targetId
   */
  const targetId = getFirstMentionedJid(ctx);
  if (!targetId) {
    return ctx.reply(getUsage(usage));
  }

  /**
   * @constant parseOpts
   * @type {object}
   */
  const parseOpts = {};
  if (minAmount !== undefined) parseOpts.min = minAmount;
  /**
   * @constant amount
   */
  const amount = minAmount !== undefined ? extractAmountFromArgs(ctx.args, parseOpts) : extractAmountFromArgs(ctx.args);

  if (amount === null || amount === undefined) {
    return ctx.reply(getUsage(usage));
  }

  try {
    /**
     * @constant targetName
     */
    const targetName = await resolveTargetDisplayName(ctx, targetId);
    /**
     * @constant balance
     */
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

    /**
     * @constant lines
     * @type {Array}
     */
    const lines = ["", `👤  ${formatDisplayMention(targetId, targetName)}`];
    if (showAmount) lines.push("", `💵  ${amountLabel}: ${formatStelas(amount)}`);
    lines.push(`💰  Balance: ${formatStelas(balance)}`);

    await ctx.reply(box(boxTitle, lines), { mentions: [targetId] });
  } catch (error) {
    await ctx.reply(formatError(/** @type {Error} */ (error).message));
  }
}

module.exports = { executeEconomyAction };
