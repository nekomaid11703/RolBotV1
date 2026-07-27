// @ts-nocheck
const { isOwner } = require("../utils/permissionUtils");
const { getProfileDisplayName } = require("../utils/userMentionUtils");
const { getUserProfile, getOrCreateProfile, listUserProfiles } = require("./userService");
const { supabase } = require("../database/supabase");

/**
 * @constant PERMISSIONS_SESSION
 * @type {string}
 */
const PERMISSIONS_SESSION = "permissions";

/**
 * @param {*} candidate
 * @returns
 */
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

/**
 * @param {*} profile
 * @param [fallback]
 * @returns
 */
function pickDisplayName(profile, fallback = "usuario") {
  return getProfileDisplayName(profile, fallback);
}

/**
 * @param {*} userId
 * @returns
 */
async function readPermissions(userId) {
  const { data } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", PERMISSIONS_SESSION)
    .eq("id", userId)
    .maybeSingle();
  return data?.data || {};
}

/**
 * @param {*} userId
 * @param {*} permissions
 */
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

/**
 * @param {*} candidate
 * @returns
 */
async function isEconomyAdmin(candidate) {
  if (isOwner(candidate)) {
    return true;
  }

  /**
   * @constant creatorId
   */
  const creatorId = resolveCandidateId(candidate);
  if (!creatorId) {
    return false;
  }

  /**
   * @constant perms
   */
  const perms = await readPermissions(creatorId);
  return Boolean(perms.economyAdmin);
}

/**
 * @param {*} candidate
 * @returns
 */
async function hasEconomyPermission(candidate) {
  return await isEconomyAdmin(candidate);
}

/**
 * Set or unset a user as economy admin.
 * @param {object} options
 * @param {string} options.userId
 * @param {string} [options.userName="usuario"]
 * @param {boolean} [options.enabled=true]
 * @param {boolean} [options.createIfMissing=true]
 * @param {object} [options.registration={}]
 * @returns {Promise<object|null>}
 */
async function setEconomyAdmin({
  userId,
  userName = "usuario",
  enabled = true,
  createIfMissing = true,
  registration = {},
}) {
  /**
   * @constant data
   */
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

  /**
   * @constant perms
   */
  const perms = await readPermissions(userId);
  perms.economyAdmin = Boolean(enabled);
  perms.grantedAt = perms.grantedAt || (enabled ? new Date().toISOString() : undefined);
  if (!enabled) delete perms.grantedAt;
  await writePermissions(userId, perms);

  return data.profile;
}

/**
 * @returns
 */
async function listEconomyAdmins() {
  return listAdminsForCategory("economy");
}

/**
 * @constant CATEGORY_LABELS
 * @type {object}
 */
const CATEGORY_LABELS = {
  economy: "economía",
  items: "ítems",
};

/**
 * @param {*} category
 * @returns
 */
function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

/**
 * @param {*} candidate
 * @param {*} category
 * @returns
 */
async function isAdminForCategory(candidate, category) {
  if (isOwner(candidate)) {
    return true;
  }

  /**
   * @constant userId
   */
  const userId = resolveCandidateId(candidate);
  if (!userId) {
    return false;
  }

  /**
   * @constant perms
   */
  const perms = await readPermissions(userId);

  if (perms.categories && typeof perms.categories[category] === "string") {
    return true;
  }

  if (category === "economy" && perms.economyAdmin) {
    return true;
  }

  return false;
}

/**
 * @param {*} candidate
 * @param {*} category
 * @returns
 */
async function hasPermissionForCategory(candidate, category) {
  return await isAdminForCategory(candidate, category);
}

/**
 * Set or unset a user as admin for a specific category.
 * @param {object} options
 * @param {string} options.userId
 * @param {string} [options.userName="usuario"]
 * @param {string} options.category
 * @param {boolean} [options.enabled=true]
 * @param {boolean} [options.createIfMissing=true]
 * @param {object} [options.registration={}]
 * @returns {Promise<object|null>}
 */
async function setAdminForCategory({
  userId,
  userName = "usuario",
  category,
  enabled = true,
  createIfMissing = true,
  registration = {},
}) {
  if (!category || typeof category !== "string") {
    throw new Error("Se requiere una categoría válida.");
  }

  /**
   * @constant data
   */
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

  /**
   * @constant perms
   */
  const perms = await readPermissions(userId);

  if (!perms.categories) {
    perms.categories = {};
  }

  if (enabled) {
    perms.categories[category] = new Date().toISOString();
  } else {
    delete perms.categories[category];
  }

  if (category === "economy") {
    perms.economyAdmin = Boolean(enabled);
    if (enabled) {
      perms.grantedAt = perms.grantedAt || new Date().toISOString();
    } else {
      delete perms.grantedAt;
    }
  }

  await writePermissions(userId, perms);

  return data.profile;
}

/**
 * @param {*} category
 * @returns
 */
async function listAdminsForCategory(category) {
  const { data: rows } = await supabase.from("bot_auth_state").select("id, data").eq("session_id", PERMISSIONS_SESSION);

  if (!rows || rows.length === 0) return [];

  /**
   * @constant adminIds
   */
  const adminIds = rows
    .filter((row) => {
      if (!row.data) return false;
      if (row.data.categories && typeof row.data.categories[category] === "string") return true;
      if (category === "economy" && row.data.economyAdmin === true) return true;
      return false;
    })
    .map((row) => row.id);

  if (adminIds.length === 0) return [];

  /**
   * @constant users
   */
  const users = await listUserProfiles();
  /**
   * @constant userMap
   * @type {object}
   */
  const userMap = {};
  for (const u of users) {
    userMap[u.profile.creatorId] = u.profile;
  }

  /**
   * @constant permData
   * @type {object}
   */
  const permData = {};
  for (const row of rows) {
    if (!row.data) continue;
    if (row.data.categories && typeof row.data.categories[category] === "string") {
      permData[row.id] = row.data.categories[category];
    } else if (category === "economy" && row.data.economyAdmin === true) {
      permData[row.id] = row.data.grantedAt || null;
    }
  }

  return adminIds
    .map((id) => {
      /**
       * @constant profile
       */
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

/**
 * @returns
 */
async function listAllCategories() {
  const { data: rows } = await supabase.from("bot_auth_state").select("id, data").eq("session_id", PERMISSIONS_SESSION);

  if (!rows || rows.length === 0) return [];

  /**
   * @constant categories
   * @type {Set}
   */
  const categories = new Set();

  for (const row of rows) {
    if (!row.data) continue;
    if (row.data.categories) {
      for (const cat of Object.keys(row.data.categories)) {
        categories.add(cat);
      }
    }
  }

  return [...categories].sort();
}

module.exports = {
  isEconomyAdmin,
  hasEconomyPermission,
  setEconomyAdmin,
  listEconomyAdmins,
  isAdminForCategory,
  hasPermissionForCategory,
  setAdminForCategory,
  listAdminsForCategory,
  listAllCategories,
  getCategoryLabel,
};
