// @ts-nocheck
/**
 * Returns the first mentioned jid.
 * @param ctx - - execution context.
 * @returns
 */
function getFirstMentionedJid(ctx) {
  if (!ctx || !Array.isArray(ctx.mentionedJid)) {
    return null;
  }

  return ctx.mentionedJid.find(Boolean) || null;
}

/**
 * Parses the positive integer.
 * @param value - - value to process.
 * @returns
 */
function parsePositiveInteger(value) {
  /**
   * @constant text
   */
  const text = String(value ?? "").trim();

  if (!/^\d+$/.test(text)) {
    return null;
  }

  /**
   * @constant number
   */
  const number = Number(text);

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return Math.floor(number);
}

/**
 * Extracts the amount from args.
 * @param args - - arguments.
 * @param {Object} [{ min = 1 }]
 * @returns
 */
function extractAmountFromArgs(args, { min = 1 } = {}) {
  if (!Array.isArray(args)) {
    return null;
  }

  for (const token of args) {
    /**
     * @constant amount
     */
    const amount = parsePositiveInteger(token);

    if (amount === null) {
      continue;
    }

    if (amount < min) {
      return null;
    }

    return amount;
  }

  return null;
}

module.exports = {
  getFirstMentionedJid,
  extractAmountFromArgs,
};
