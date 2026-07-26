// @ts-nocheck

/**
 * Clean and trim a text value.
 * @param {string} value - Value to clean
 * @param {string} fallback - Fallback value
 * @returns {string} Cleaned text
 */
function cleanText(value, fallback = "usuario") {
  /**
   * @constant text
   */
  const text = String(value || "").trim();
  return text || fallback;
}

/**
 * Check if a display name is meaningful.
 * @param {string} value - Value to check
 * @returns {boolean} True if meaningful
 */
function isMeaningfulDisplayName(value) {
  /**
   * @constant text
   */
  const text = String(value || "").trim();

  if (!text) {
    return false;
  }

  /**
   * @constant normalized
   */
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

/**
 * Formats the real mention tag.
 * @param jid - - jid.
 * @param {string} [fallback] - - fallback.
 * @returns
 */
function formatRealMentionTag(jid, fallback = "usuario") {
  /**
   * @constant local
   */
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

/**
 * Formats the display mention.
 * @param jid - - jid.
 * @param {string} [displayName] - - display display name.
 * @returns
 */
function formatDisplayMention(jid, displayName = "usuario") {
  /**
   * @constant cleanName
   */
  const cleanName = cleanText(displayName, "usuario");
  /**
   * @constant mention
   */
  const mention = formatRealMentionTag(jid, cleanName);

  if (isMeaningfulDisplayName(cleanName)) {
    return `${cleanName} (${mention})`;
  }

  return mention;
}

/**
 * Returns the profile display name.
 * @param profile - - profile.
 * @param {string} [fallback] - - fallback.
 * @returns
 */
function getProfileDisplayName(profile, fallback = "usuario") {
  /**
   * @constant candidates
   * @type {Array}
   */
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

/**
 * With mentions.
 * @param text - - text content.
 * @param {Array} [mentions] - - mentions.
 * @returns
 */
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
  getProfileDisplayName,
};
