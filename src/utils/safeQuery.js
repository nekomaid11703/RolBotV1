const { cache, memoryCacheKey, TTLS, generateCacheKey } = require("../services/ai/promptCacheService");

async function safeSingle(query) {
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

async function safeSingleOrNull(query) {
  const { data, error } = await query.single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

async function safeMaybeSingle(query) {
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

function userCacheKey(creatorId) {
  return `user:${creatorId}`;
}

function topBalancesCacheKey(limit) {
  return `topBalances:${limit}`;
}

function groupCacheKey(groupId) {
  return `group:${groupId}`;
}

function charactersCacheKey(creatorId) {
  return `characters:${creatorId}`;
}

function topGroupMembersCacheKey(groupId, limit) {
  return `topGroupMembers:${groupId}:${limit}`;
}

function topActiveUsersCacheKey(limit) {
  return `topActiveUsers:${limit}`;
}

function invalidateUserCache(creatorId) {
  const key = userCacheKey(creatorId);
  cache.invalidate(k => k === key || k.startsWith(`user:${creatorId}`) || k.startsWith(`characters:${creatorId}`));
}

function invalidateGroupCache(groupId) {
  const key = groupCacheKey(groupId);
  cache.invalidate(k => k === key || k.startsWith(`group:${groupId}`) || k.startsWith(`topGroupMembers:${groupId}`));
}

function invalidateTopBalancesCache() {
  cache.invalidate(k => k.startsWith('topBalances:'));
}

function invalidateTopActiveUsersCache() {
  cache.invalidate(k => k.startsWith('topActiveUsers:'));
}

module.exports = {
  safeSingle,
  safeSingleOrNull,
  safeMaybeSingle,
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
  TTLS,
};
