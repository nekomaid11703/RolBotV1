// @ts-nocheck

/**
 * Clean and trim a text value.
 * @param {string} value - Value to clean
 * @param {string} fallback - Fallback value
 * @returns {string} Cleaned text
 */
function cleanText(value, fallback = "usuario") {
  const text = String(value || "").trim();
  return text || fallback;
}

/**
 * Check if a display name is meaningful.
 * @param {string} value - Value to check
 * @returns {boolean} True if meaningful
 */
function isMeaningfulDisplayName(value) {
  const text = String(value || "").trim();

  if (!text) {
    return false;
  }

  const normalized = text.toLowerCase();

  if (normalized === "usuario" || normalized === "creador") {
    return false;
  }

  if (/^\d+$/.test(text)) {
    return false;
  }

  if (text.includes("@")) {
    return false;
  }

  return true;
}

function formatRealMentionTag(jid, fallback = "usuario") {
  const local = String(jid || "")
    .split("@")[0]
    .replace(/\D/g, "")
    .trim();

  return `@${
    local ||
    String(fallback || "usuario")
      .replace(/^@+/, "")
      .trim() ||
    "usuario"
  }`;
}

function formatDisplayMention(jid, displayName = "usuario") {
  const cleanName = cleanText(displayName, "usuario");
  const mention = formatRealMentionTag(jid, cleanName);

  if (isMeaningfulDisplayName(cleanName)) {
    return `${cleanName} (${mention})`;
  }

  return mention;
}

function getProfileDisplayName(profile, fallback = "usuario") {
  const candidates = [
    profile?.metadata?.displayName,
    profile?.metadata?.pushName,
    profile?.registration?.displayName,
    profile?.creatorName,
  ];
  for (const candidate of candidates) {
    if (isMeaningfulDisplayName(candidate)) {
      return String(candidate).trim();
    }
  }
  return fallback;
}

function withMentions(text, mentions = []) {
  return {
    text,
    mentions: [...new Set((Array.isArray(mentions) ? mentions : []).filter(Boolean))],
  };
}

module.exports = {
  withMentions,
  formatDisplayMention,
  formatRealMentionTag,
  isMeaningfulDisplayName,
  getProfileDisplayName,
};
