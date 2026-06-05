const { getGroupMetadata } = require("./groupUtils");
const { getUserProfile } = require("../services/userService");

function cleanText(value, fallback = "usuario") {
  const text = String(value || "").trim();
  return text || fallback;
}

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

function findParticipantDisplayName(participant) {
  if (!participant || typeof participant !== "object") {
    return "";
  }

  const candidates = [
    participant.notify,
    participant.name,
    participant.pushName,
    participant.displayName,
    participant.subject,
  ];

  for (const candidate of candidates) {
    const clean = String(candidate || "").trim();

    if (isMeaningfulDisplayName(clean)) {
      return clean;
    }
  }

  return "";
}

function extractMentionLabelFromContext(ctx) {
  const tokens = Array.isArray(ctx?.args)
    ? ctx.args
    : String(ctx?.text || "").trim().split(/\s+/);

  for (const token of tokens) {
    const clean = String(token || "").trim();

    if (!clean.startsWith("@")) {
      continue;
    }

    const label = clean
      .replace(/^@+/, "")
      .replace(/[.,;:!?]+$/g, "")
      .trim();

    if (isMeaningfulDisplayName(label)) {
      return label;
    }
  }

  return "";
}

async function resolveTargetDisplayName(ctx, targetId, fallback = "usuario") {
  const cleanFallback = cleanText(fallback, "usuario");

  if (!targetId) {
    return cleanFallback;
  }

  try {
    const data = await getUserProfile({ creatorId: targetId });

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
    // Ignore profile lookup errors and continue with other sources.
  }

  try {
    if (ctx?.sock && ctx?.from && String(ctx.from).endsWith("@g.us")) {
      const metadata = await getGroupMetadata(ctx.sock, ctx.from);

      const participant = Array.isArray(metadata?.participants)
        ? metadata.participants.find((entry) => {
            const ids = [
              entry?.id,
              entry?.jid,
              entry?.userId,
            ];

            return ids.some((candidate) => {
              return String(candidate || "").trim() === String(targetId || "").trim();
            });
          })
        : null;

      const participantName = findParticipantDisplayName(participant);

      if (participantName) {
        return participantName;
      }
    }
  } catch {
    // Ignore group metadata errors too.
  }

  const mentionLabel = extractMentionLabelFromContext(ctx);

  if (isMeaningfulDisplayName(mentionLabel)) {
    return mentionLabel;
  }

  return cleanFallback;
}

function withMentions(text, mentions = []) {
  return {
    text,
    mentions: [...new Set((Array.isArray(mentions) ? mentions : []).filter(Boolean))],
  };
}

module.exports = {
  resolveTargetDisplayName,
  withMentions,
  isMeaningfulDisplayName,
  extractMentionLabelFromContext,
};
