const { isOwner } = require("../utils/permissionUtils");
const {
  isMeaningfulDisplayName,
} = require("../utils/userMentionUtils");
const {
  getUserProfile,
  getOrCreateProfile,
  listUserProfiles,
  saveUserProfile,
} = require("./userService");

function resolveCandidateId(candidate) {
  if (candidate && typeof candidate === "object") {
    return (
      candidate.jid ||
      candidate.userId ||
      candidate.id ||
      candidate.phone ||
      candidate.number ||
      candidate.msisdn ||
      candidate.senderJid ||
      candidate.sender ||
      null
    );
  }

  return candidate || null;
}

function pickDisplayName(profile, fallback = "usuario") {
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

async function isEconomyAdmin(candidate) {
  if (isOwner(candidate)) {
    return true;
  }

  const creatorId = resolveCandidateId(candidate);
  if (!creatorId) {
    return false;
  }

  const data = await getUserProfile({ creatorId });

  return Boolean(data?.profile?.permissions?.economyAdmin);
}

async function hasEconomyPermission(candidate) {
  return await isEconomyAdmin(candidate);
}

async function setEconomyAdmin({
  userId,
  userName = "usuario",
  enabled = true,
  createIfMissing = true,
  registration = {},
}) {
  const data = createIfMissing
    ? await getOrCreateProfile({
        creatorId: userId,
        creatorName: userName,
        registration: {
          ...registration,
          displayName: registration.displayName || userName,
          source: registration.source || "permission_service",
          scope: registration.scope || "target",
          createdBy: registration.createdBy || userId,
        },
      })
    : await getUserProfile({ creatorId: userId });

  if (!data) {
    throw new Error("El usuario no tiene perfil.");
  }

  data.profile.permissions = {
    ...(data.profile.permissions || {}),
    economyAdmin: Boolean(enabled),
  };

  data.profile.updatedAt = new Date().toISOString();

  await saveUserProfile({
    folder: data.folder,
    profile: data.profile,
  });

  return data.profile;
}

async function listEconomyAdmins() {
  const users = await listUserProfiles();

  return users
    .filter(({ profile }) => Boolean(profile?.permissions?.economyAdmin))
    .map(({ profile }) => ({
      userId: profile.creatorId,
      displayName: pickDisplayName(profile, "usuario"),
      profile,
    }))
    .sort((a, b) =>
      String(a.displayName).localeCompare(String(b.displayName), "es"),
    );
}

module.exports = {
  isEconomyAdmin,
  hasEconomyPermission,
  setEconomyAdmin,
  listEconomyAdmins,
  pickDisplayName,
};
