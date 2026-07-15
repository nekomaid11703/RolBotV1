// @ts-nocheck
function normalizeJid(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function extractPhoneNumber(value) {
  return String(value || "")
    .split("@")[0]
    .split(":")[0]
    .replace(/\D/g, "");
}

function uniqueStrings(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function isSameIdentity(left, right) {
  const a = normalizeJid(left);
  const b = normalizeJid(right);

  if (!a || !b) {
    return false;
  }

  if (a === b) {
    return true;
  }

  const aNumber = extractPhoneNumber(a);
  const bNumber = extractPhoneNumber(b);

  return Boolean(aNumber && bNumber && aNumber === bNumber);
}

function toIdentityCandidates(value) {
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

  const raw = String(value || "").trim();
  if (!raw) {
    return candidates;
  }

  candidates.push(normalizeJid(raw));

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
