// @ts-nocheck
const { OWNERS } = require("../config/permissionsConfig");
const {
  normalizeJid,
  extractPhoneNumber,
  isSameIdentity,
  toIdentityCandidates,
  uniqueStrings,
} = require("./identityUtils");

/**
 * Normalises the owner record.
 * @param {*} owner - - owner.
 * @returns
 */
function normalizeOwnerRecord(owner) {
  if (!owner) {
    return null;
  }

  if (typeof owner === "string") {
    /**
     * @constant jid
     */
    const jid = normalizeJid(owner);
    /**
     * @constant phone
     */
    const phone = extractPhoneNumber(owner);

    return {
      phone: phone || null,
      jid: jid || null,
      displayName: null,
      aliases: [],
    };
  }

  if (typeof owner === "object") {
    /**
     * @constant jid
     */
    const jid = normalizeJid(owner.jid || owner.userId || owner.id || owner.value);
    /**
     * @constant phone
     */
    const phone = extractPhoneNumber(
      owner.phone || owner.number || owner.msisdn || owner.jid || owner.userId || owner.id || owner.value,
    );
    /**
     * @constant displayName
     */
    const displayName = String(owner.displayName || owner.name || owner.label || "").trim();
    /**
     * @constant aliases
     */
    const aliases = uniqueStrings(
      (Array.isArray(owner.aliases) ? owner.aliases : []).map(normalizeJid).filter(Boolean),
    );

    return {
      phone: phone || null,
      jid: jid || null,
      displayName: displayName || null,
      aliases,
    };
  }

  return null;
}

/**
 * Returns the owner records.
 * @returns
 */
function getOwnerRecords() {
  return OWNERS.map(normalizeOwnerRecord).filter(Boolean);
}

/**
 * Owner record matches.
 * @param {*} record - - record.
 * @param {*} candidate - - candidate.
 * @returns
 */
function ownerRecordMatches(record, candidate) {
  if (!record) {
    return false;
  }

  /**
   * @constant candidates
   */
  const candidates = toIdentityCandidates(candidate);

  return candidates.some((entry) => {
    return Boolean(
      (record.jid && isSameIdentity(record.jid, entry)) ||
      (record.phone && isSameIdentity(record.phone, entry)) ||
      (Array.isArray(record.aliases) && record.aliases.some((alias) => isSameIdentity(alias, entry))),
    );
  });
}

/**
 * Returns whether it is owner.
 * @param {*} candidate - - candidate.
 * @returns
 */
function isOwner(candidate) {
  return getOwnerRecords().some((owner) => ownerRecordMatches(owner, candidate));
}

/**
 * Returns the owner jids.
 * @returns
 */
function getOwnerJids() {
  return getOwnerRecords()
    .flatMap((owner) => [owner.jid, ...(owner.aliases || [])])
    .filter(Boolean);
}

module.exports = {
  isOwner,
  getOwnerRecords,
  getOwnerJids,
};
