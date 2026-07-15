// @ts-nocheck
const { OWNERS } = require("../config/permissionsConfig");
const {
  normalizeJid,
  extractPhoneNumber,
  isSameIdentity,
  toIdentityCandidates,
  uniqueStrings,
} = require("./identityUtils");

function normalizeOwnerRecord(owner) {
  if (!owner) {
    return null;
  }

  if (typeof owner === "string") {
    const jid = normalizeJid(owner);
    const phone = extractPhoneNumber(owner);

    return {
      phone: phone || null,
      jid: jid || null,
      displayName: null,
      aliases: [],
    };
  }

  if (typeof owner === "object") {
    const jid = normalizeJid(owner.jid || owner.userId || owner.id || owner.value);
    const phone = extractPhoneNumber(
      owner.phone || owner.number || owner.msisdn || owner.jid || owner.userId || owner.id || owner.value,
    );
    const displayName = String(owner.displayName || owner.name || owner.label || "").trim();
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

function getOwnerRecords() {
  return OWNERS.map(normalizeOwnerRecord).filter(Boolean);
}

function ownerRecordMatches(record, candidate) {
  if (!record) {
    return false;
  }

  const candidates = toIdentityCandidates(candidate);

  return candidates.some((entry) => {
    return Boolean(
      (record.jid && isSameIdentity(record.jid, entry)) ||
      (record.phone && isSameIdentity(record.phone, entry)) ||
      (Array.isArray(record.aliases) && record.aliases.some((alias) => isSameIdentity(alias, entry))),
    );
  });
}

function isOwner(candidate) {
  return getOwnerRecords().some((owner) => ownerRecordMatches(owner, candidate));
}

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
