// @ts-nocheck
const { isOwner } = require("../utils/permissionUtils");
const { getProfileDisplayName } = require("../utils/userMentionUtils");
const { getUserProfile, getOrCreateProfile, listUserProfiles } = require("./userService");
const { supabase } = require("../database/supabase");

const PERMISSIONS_SESSION = "permissions";

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
  return getProfileDisplayName(profile, fallback);
}

async function readPermissions(userId) {
  const { data } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", PERMISSIONS_SESSION)
    .eq("id", userId)
    .maybeSingle();
  return data?.data || {};
}

async function writePermissions(userId, permissions) {
  await supabase.from("bot_auth_state").upsert(
    {
      session_id: PERMISSIONS_SESSION,
      id: userId,
      data: permissions,
    },
    { onConflict: "session_id,id" },
  );
}

async function isEconomyAdmin(candidate) {
  if (isOwner(candidate)) {
    return true;
  }

  const creatorId = resolveCandidateId(candidate);
  if (!creatorId) {
    return false;
  }

  const perms = await readPermissions(creatorId);
  return Boolean(perms.economyAdmin);
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

  const perms = await readPermissions(userId);
  perms.economyAdmin = Boolean(enabled);
  perms.grantedAt = perms.grantedAt || (enabled ? new Date().toISOString() : undefined);
  if (!enabled) delete perms.grantedAt;
  await writePermissions(userId, perms);

  return data.profile;
}

async function listEconomyAdmins() {
  const { data: rows } = await supabase.from("bot_auth_state").select("id, data").eq("session_id", PERMISSIONS_SESSION);

  if (!rows || rows.length === 0) return [];

  const adminIds = rows.filter((row) => row.data && row.data.economyAdmin === true).map((row) => row.id);

  if (adminIds.length === 0) return [];

  const users = await listUserProfiles();
  const userMap = {};
  for (const u of users) {
    userMap[u.profile.creatorId] = u.profile;
  }

  const permData = {};
  for (const row of rows) {
    if (row.data && row.data.economyAdmin === true) {
      permData[row.id] = row.data.grantedAt || null;
    }
  }

  return adminIds
    .map((id) => {
      const profile = userMap[id];
      return {
        userId: id,
        displayName: profile ? pickDisplayName(profile, "usuario") : id,
        profile: profile || null,
        grantedAt: permData[id] || null,
      };
    })
    .filter((a) => a.userId)
    .sort((a, b) => String(a.displayName).localeCompare(String(b.displayName), "es"));
}

module.exports = {
  isEconomyAdmin,
  hasEconomyPermission,
  setEconomyAdmin,
  listEconomyAdmins,
};
