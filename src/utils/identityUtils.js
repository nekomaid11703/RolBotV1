// @ts-nocheck
/**
 * Normalises the jid.
 * @param {*} value - - value to process.
 * @returns
 */
function normalizeJid(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/**
 * Extracts the phone number.
 * @param {*} value - - value to process.
 * @returns
 */
function extractPhoneNumber(value) {
  return String(value || "")
    .split("@")[0]
    .split(":")[0]
    .replace(/\D/g, "");
}

/**
 * Unique strings.
 * @param {Array} [values] - - array of values.
 * @returns
 */
function uniqueStrings(values = []) {
  return [...new Set(values.filter(Boolean))];
}

/**
 * Returns whether the same is identity.
 * @param {*} left - - left.
 * @param {*} right - - right.
 * @returns
 */
function isSameIdentity(left, right) {
  /**
   * @constant a
   */
  const a = normalizeJid(left);
  /**
   * @constant b
   */
  const b = normalizeJid(right);

  if (!a || !b) {
    return false;
  }

  if (a === b) {
    return true;
  }

  /**
   * @constant aNumber
   */
  const aNumber = extractPhoneNumber(a);
  /**
   * @constant bNumber
   */
  const bNumber = extractPhoneNumber(b);

  return Boolean(aNumber && bNumber && aNumber === bNumber);
}

/**
 * To identity candidates.
 * @param {*} value - - value to process.
 * @returns
 */
function toIdentityCandidates(value) {
  /**
   * @constant candidates
   * @type {*[]}
   */
  const candidates = [];

  if (value === null || value === undefined) {
    return candidates;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      candidates.push(...toIdentityCandidates(entry));
    }

    return uniqueStrings(candidates.map(normalizeJid));
  }

  if (typeof value === "object") {
    /**
     * @constant keys
     * @type {*[]}
     */
    const keys = [
      "jid",
      "userId",
      "id",
      "value",
      "phone",
      "number",
      "msisdn",
      "sender",
      "senderJid",
      "senderNumber",
      "participant",
      "participantJid",
      "participantId",
    ];

    for (const key of keys) {
      if (value[key]) {
        candidates.push(value[key]);
      }
    }

    if (Array.isArray(value.aliases)) {
      candidates.push(...value.aliases);
    }

    return uniqueStrings(candidates.flatMap((entry) => toIdentityCandidates(entry)));
  }

  /**
   * @constant raw
   */
  const raw = String(value || "").trim();
  if (!raw) {
    return candidates;
  }

  candidates.push(normalizeJid(raw));

  /**
   * @constant phone
   */
  const phone = extractPhoneNumber(raw);
  if (phone) {
    candidates.push(phone);
  }

  return uniqueStrings(candidates.map(normalizeJid));
}

module.exports = {
  normalizeJid,
  extractPhoneNumber,
  uniqueStrings,
  isSameIdentity,
  toIdentityCandidates,
};
