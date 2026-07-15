// @ts-nocheck
function getFirstMentionedJid(ctx) {
  if (!ctx || !Array.isArray(ctx.mentionedJid)) {
    return null;
  }

  return ctx.mentionedJid.find(Boolean) || null;
}

function cleanMentionLabel(value, fallback = "usuario") {
  const text = String(value || "").trim();

  if (!text) {
    return fallback;
  }

  const label = text.replace(/^@+/, "").trim();

  return label || fallback;
}

function formatMentionTag(value, fallback = "usuario") {
  return `@${cleanMentionLabel(value, fallback)}`;
}

function formatJidTag(jid, displayName = null) {
  if (displayName) {
    return formatMentionTag(displayName);
  }

  const value = String(jid || "").trim();

  if (!value) {
    return "@usuario";
  }

  const local = value.split("@")[0] || "usuario";
  return formatMentionTag(local);
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

function resolveTargetUserId(ctx, { allowSelf = true } = {}) {
  const mentioned = getFirstMentionedJid(ctx);

  if (mentioned) {
    return mentioned;
  }

  return allowSelf ? ctx.sender : null;
}

function extractPhoneFromArgs(args) {
  if (!Array.isArray(args)) return null;
  for (const arg of args) {
    const cleaned = arg.replace(/[^0-9]/g, "");
    if (cleaned.length >= 7 && cleaned.length <= 15) {
      return cleaned + "@s.whatsapp.net";
    }
  }
  return null;
}

module.exports = {
  getFirstMentionedJid,
  formatJidTag,
  formatMentionTag,
  parsePositiveInteger,
  extractAmountFromArgs,
  resolveTargetUserId,
  extractPhoneFromArgs,
};
