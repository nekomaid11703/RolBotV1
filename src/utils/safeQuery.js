// @ts-nocheck
const { cache, TTLS } = require("./cacheService");
const { logSystem } = require("../services/loggerService");
const { hasColumn } = require("../database/columnRegistry");

/**
 * @param query
 * @returns
 */
async function safeSingle(query) {
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

/**
 * @param query
 * @returns
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
 * @param query
 * @returns
 */
async function safeMaybeSingle(query) {
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * @param {object} options
 * @returns
 */
async function cachedRead({ key, fetch, ttl, bypassCache = false }) {
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(key);
    if (cached) return cached;
  }
  /**
   * @constant data
   */
  const data = await fetch();
  cache.set(key, data, ttl);
  return data;
}

/**
 * @param creatorId
 * @returns
 */
function userCacheKey(creatorId) {
  return `user:${creatorId}`;
}

/**
 * @param limit
 * @returns
 */
function topBalancesCacheKey(limit) {
  return `topBalances:${limit}`;
}

/**
 * @param groupId
 * @returns
 */
function groupCacheKey(groupId) {
  return `group:${groupId}`;
}

/**
 * @param creatorId
 * @returns
 */
function charactersCacheKey(creatorId) {
  return `characters:${creatorId}`;
}

/**
 * @param groupId
 * @param limit
 * @returns
 */
function topGroupMembersCacheKey(groupId, limit) {
  return `topGroupMembers:${groupId}:${limit}`;
}

/**
 * @param limit
 * @returns
 */
function topActiveUsersCacheKey(limit) {
  return `topActiveUsers:${limit}`;
}

/**
 * @param creatorId
 */
function invalidateUserCache(creatorId) {
  /**
   * @constant key
   */
  const key = userCacheKey(creatorId);
  cache.invalidate((k) => k === key || k.startsWith(`user:${creatorId}`) || k.startsWith(`characters:${creatorId}`));
}

/**
 * @param groupId
 */
function invalidateGroupCache(groupId) {
  /**
   * @constant key
   */
  const key = groupCacheKey(groupId);
  cache.invalidate((k) => k === key || k.startsWith(`group:${groupId}`) || k.startsWith(`topGroupMembers:${groupId}`));
}

/**
 * TODO: describe what this does.
 */
function invalidateTopBalancesCache() {
  cache.invalidate((k) => k.startsWith("topBalances:"));
}

/**
 * TODO: describe what this does.
 */
function invalidateTopActiveUsersCache() {
  cache.invalidate((k) => k.startsWith("topActiveUsers:"));
}

/**
 * TODO: describe what this does.
 */
function invalidateAllCache() {
  cache.clear();
}

/**
 * @param table
 * @param {...any} columnGroups
 * @returns
 */
function safeSelect(table, ...columnGroups) {
  /**
   * @constant allCols
   */
  const allCols = columnGroups
    .flat()
    .flatMap((c) => (typeof c === "string" ? c.split(",").map((s) => s.trim()) : []))
    .filter(Boolean);

  /**
   * @constant existing
   */
  const existing = allCols.filter((col) => {
    /**
     * @constant exists
     */
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
  invalidateGroupCache,
  invalidateTopBalancesCache,
  invalidateTopActiveUsersCache,
  invalidateAllCache,
  cache,
  TTLS,
};
