// @ts-nocheck
const { cache, TTLS } = require("./cacheService");
const { logSystem } = require("../services/loggerService");
const { hasColumn } = require("../database/columnRegistry");

/**
 *
 * @param query
 */
async function safeSingle(query) {
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

/**
 *
 * @param query
 */
async function safeSingleOrNull(query) {
  const { data, error } = await query.single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

/**
 *
 * @param query
 */
async function safeMaybeSingle(query) {
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

/**
 *
 * @param root0
 */
async function cachedRead({ key, fetch, ttl, bypassCache = false }) {
  if (!bypassCache) {
    const cached = cache.get(key);
    if (cached) return cached;
  }
  const data = await fetch();
  cache.set(key, data, ttl);
  return data;
}

/**
 *
 * @param creatorId
 */
function userCacheKey(creatorId) {
  return `user:${creatorId}`;
}

/**
 *
 * @param limit
 */
function topBalancesCacheKey(limit) {
  return `topBalances:${limit}`;
}

/**
 *
 * @param groupId
 */
function groupCacheKey(groupId) {
  return `group:${groupId}`;
}

/**
 *
 * @param creatorId
 */
function charactersCacheKey(creatorId) {
  return `characters:${creatorId}`;
}

/**
 *
 * @param groupId
 * @param limit
 */
function topGroupMembersCacheKey(groupId, limit) {
  return `topGroupMembers:${groupId}:${limit}`;
}

/**
 *
 * @param limit
 */
function topActiveUsersCacheKey(limit) {
  return `topActiveUsers:${limit}`;
}

/**
 *
 * @param creatorId
 */
function invalidateUserCache(creatorId) {
  invalidateUserProfileCache(creatorId);
  cache.invalidate((k) => k.startsWith(`characters:${creatorId}`) || k === `activeCharacter:${creatorId}`);
}

/**
 *
 * @param creatorId
 */
function invalidateUserProfileCache(creatorId) {
  const key = userCacheKey(creatorId);
  cache.invalidate((k) => k === key || k.startsWith(`user:${creatorId}`));
}

/**
 *
 * @param groupId
 */
function invalidateGroupCache(groupId) {
  const key = groupCacheKey(groupId);
  cache.invalidate((k) => k === key || k.startsWith(`group:${groupId}`) || k.startsWith(`topGroupMembers:${groupId}`));
}

/**
 *
 */
function invalidateTopBalancesCache() {
  cache.invalidate((k) => k.startsWith("topBalances:"));
}

/**
 *
 */
function invalidateTopActiveUsersCache() {
  cache.invalidate((k) => k.startsWith("topActiveUsers:"));
}

/**
 *
 */
function invalidateAllCache() {
  cache.clear();
}

/**
 *
 * @param table
 * @param {...any} columnGroups
 */
function safeSelect(table, ...columnGroups) {
  const allCols = columnGroups
    .flat()
    .flatMap((c) => (typeof c === "string" ? c.split(",").map((s) => s.trim()) : []))
    .filter(Boolean);

  const existing = allCols.filter((col) => {
    const exists = hasColumn(table, col);
    if (!exists) {
      logSystem(`safeSelect: columna "${col}" omitida en "${table}" (no existe en DB)`);
    }
    return exists;
  });

  return existing.length > 0 ? existing.join(", ") : "*";
}

module.exports = {
  safeSingle,
  safeSingleOrNull,
  safeMaybeSingle,
  cachedRead,
  safeSelect,
  userCacheKey,
  groupCacheKey,
  charactersCacheKey,
  topBalancesCacheKey,
  topGroupMembersCacheKey,
  topActiveUsersCacheKey,
  invalidateUserCache,
  invalidateUserProfileCache,
  invalidateGroupCache,
  invalidateTopBalancesCache,
  invalidateTopActiveUsersCache,
  invalidateAllCache,
  cache,
  TTLS,
};
