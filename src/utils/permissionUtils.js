const { OWNERS } = require("../config/permissionsConfig");
const { getUserProfile } = require("../services/userService");
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
      (Array.isArray(owner.aliases) ? owner.aliases : [])
        .map(normalizeJid)
        .filter(Boolean),
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
        (Array.isArray(record.aliases) &&
          record.aliases.some((alias) => isSameIdentity(alias, entry))),
    );
  });
}

function isOwner(candidate) {
  return getOwnerRecords().some((owner) =>
    ownerRecordMatches(owner, candidate),
  );
}

async function getOwnerDisplayName(candidate) {
  const owner = getOwnerRecords().find((entry) =>
    ownerRecordMatches(entry, candidate),
  );

  if (!owner) {
    return "Creador";
  }

  try {
    const lookupId = owner.jid || owner.phone;
    const data = await getUserProfile({
      creatorId: lookupId,
    });

    const profileName =
      data?.profile?.metadata?.displayName ||
      data?.profile?.creatorName;

    if (profileName) {
      const cleanProfileName = String(profileName).trim();

      if (
        cleanProfileName &&
        !/^\d+$/.test(cleanProfileName) &&
        !cleanProfileName.includes("@")
      ) {
        return cleanProfileName;
      }
    }
  } catch {
    // Fallback below
  }

  return owner.displayName || "Creador";
}

function getOwnerJids() {
  return getOwnerRecords()
    .flatMap((owner) => [owner.jid, ...(owner.aliases || [])])
    .filter(Boolean);
}

module.exports = {
  normalizeJid,
  extractPhoneNumber,
  isSameIdentity,
  isOwner,
  getOwnerRecords,
  getOwnerDisplayName,
  getOwnerJids,
};
