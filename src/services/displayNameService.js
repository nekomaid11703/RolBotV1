// @ts-nocheck
const { getGroupMetadata } = require("../utils/groupUtils");
const { getUserProfile } = require("./userService");

/**
 * Clean and trim a text value.
 * @param {string} value - Value to clean
 * @param {string} fallback - Fallback value
 * @returns {string} - Result value
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
 * @param {string} value - Value to evaluate
 * @returns {boolean} - True if condition is met
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
 * Find a participant display name from metadata.
 * @param {unknown} participant - Participant object
 * @returns {string} - Result value
 */
function findParticipantDisplayName(participant) {
  if (!participant || typeof participant !== "object") {
    return "";
  }

  /**
   * @constant candidates
   * @type {Array}
   */
  const candidates = [
    participant.notify,
    participant.name,
    participant.pushName,
    participant.displayName,
    participant.subject,
  ];

  for (const candidate of candidates) {
    /**
     * @constant clean
     */
    const clean = String(candidate || "").trim();

    if (isMeaningfulDisplayName(clean)) {
      return clean;
    }
  }

  return "";
}

/**
 * Extract a mention label from command context.
 * @param {object} ctx - Command context
 * @returns {string} - Result value
 */
function extractMentionLabelFromContext(ctx) {
  /**
   * @constant tokens
   */
  const tokens = Array.isArray(ctx?.args)
    ? ctx.args
    : String(ctx?.text || "")
        .trim()
        .split(/\s+/);

  for (const token of tokens) {
    /**
     * @constant clean
     */
    const clean = String(token || "").trim();

    if (!clean.startsWith("@")) {
      continue;
    }

    let label = clean.replace(/^@+/, "");
    while (label.length > 0 && ".,;:!?".includes(label[label.length - 1])) {
      label = label.slice(0, -1);
    }
    label = label.trim();

    if (isMeaningfulDisplayName(label)) {
      return label;
    }
  }

  return "";
}

/**
 * Resolve the display name for a target user.
 * @param {object} ctx - Command context
 * @param {string} targetId - Target user ID
 * @param {string} fallback - Fallback display name
 * @returns {Promise<string>} - Promise resolving to a string
 */
async function resolveTargetDisplayName(ctx, targetId, fallback = "usuario") {
  /**
   * @constant cleanFallback
   */
  const cleanFallback = cleanText(fallback, "usuario");

  if (!targetId) {
    return cleanFallback;
  }

  try {
    /**
     * @constant data
     */
    const data = await getUserProfile({ creatorId: targetId });

    /**
     * @constant storedCandidates
     * @type {Array}
     */
    const storedCandidates = [
      data?.profile?.metadata?.displayName,
      data?.profile?.metadata?.pushName,
      data?.profile?.registration?.displayName,
      data?.profile?.creatorName,
    ];

    for (const candidate of storedCandidates) {
      if (isMeaningfulDisplayName(candidate)) {
        return String(candidate).trim();
      }
    }
  } catch {
    /* fallback */
  }

  try {
    if (ctx?.sock && ctx?.from && String(ctx.from).endsWith("@g.us")) {
      /**
       * @constant metadata
       */
      const metadata = await getGroupMetadata(ctx.sock, ctx.from);

      /**
       * @constant participant
       */
      const participant = Array.isArray(metadata?.participants)
        ? metadata.participants.find((entry) => {
            /**
             * @constant ids
             * @type {Array}
             */
            const ids = [entry?.id, entry?.jid, entry?.userId];

            return ids.some((candidate) => {
              return String(candidate || "").trim() === String(targetId || "").trim();
            });
          })
        : null;

      /**
       * @constant participantName
       */
      const participantName = findParticipantDisplayName(participant);

      if (participantName) {
        return participantName;
      }
    }
  } catch {
    /* fallback */
  }

  /**
   * @constant mentionLabel
   */
  const mentionLabel = extractMentionLabelFromContext(ctx);

  if (isMeaningfulDisplayName(mentionLabel)) {
    return mentionLabel;
  }

  return cleanFallback;
}

module.exports = { resolveTargetDisplayName };
