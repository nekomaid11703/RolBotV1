// @ts-nocheck
function getFirstMentionedJid(ctx) {
  if (!ctx || !Array.isArray(ctx.mentionedJid)) {
    return null;
  }

  return ctx.mentionedJid.find(Boolean) || null;
}

function parsePositiveInteger(value) {
  const text = String(value ?? "").trim();

  if (!/^\d+$/.test(text)) {
    return null;
  }

  const number = Number(text);

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return Math.floor(number);
}

function extractAmountFromArgs(args, { min = 1 } = {}) {
  if (!Array.isArray(args)) {
    return null;
  }

  for (const token of args) {
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
