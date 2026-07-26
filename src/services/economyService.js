// @ts-nocheck
const { getUserProfile, getOrCreateProfile, saveUserProfile } = require("./userService");
const {
  topBalancesCacheKey,
  invalidateTopBalancesCache,
  invalidateUserCache,
  safeSelect,
  TTLS,
  cache,
} = require("../utils/safeQuery");
const { logError } = require("./loggerService");
const { supabase } = require("../database/supabase");
const { filterExisting } = require("../database/columnRegistry");

/**
 * @constant userLocks
 * @type {Map}
 */
const userLocks = new Map();

/**
 * @param userId
 * @param fn
 * @returns
 */
async function withUserLock(userId, fn) {
  while (userLocks.get(userId)) {
    await new Promise((r) => {
      setTimeout(r, 10);
    });
  }
  userLocks.set(userId, true);
  try {
    return await fn();
  } finally {
    userLocks.delete(userId);
  }
}

const {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
} = require("../config/economyConfig");

/**
 * @param {object} options
 * @returns
 */
function resolveEconomyProfile({ userId, userName = "usuario", createIfMissing = false, registration = {} }) {
  if (createIfMissing) {
    return getOrCreateProfile({
      creatorId: userId,
      creatorName: userName,
      registration,
    });
  }

  return getUserProfile({
    creatorId: userId,
  });
}

/**
 * @param profile
 * @returns
 */
function getMoneyValue(profile) {
  return Number(profile?.economy?.money || 0);
}

/**
 * @param userId
 * @returns
 */
async function getBalance(userId) {
  /**
   * @constant data
   */
  const data = await getUserProfile({
    creatorId: userId,
  });

  if (!data) {
    return 0;
  }

  return getMoneyValue(data.profile);
}

/**
 * @param userId
 * @param amount
 * @param [options]
 * @returns
 */
async function addMoney(userId, amount, options = {}) {
  /**
   * @constant safeAmount
   */
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Cantidad inválida.");
  }

  return withUserLock(userId, async () => {
    /**
     * @constant data
     */
    const data = await resolveEconomyProfile({
      userId,
      userName: options.userName || "usuario",
      createIfMissing: options.createIfMissing !== false,
      registration: options.registration || {},
    });

    if (!data) {
      throw new Error("El usuario no tiene perfil.");
    }

    data.profile.economy.money = getMoneyValue(data.profile) + safeAmount;
    data.profile.updatedAt = new Date().toISOString();

    await saveUserProfile({
      folder: data.folder,
      profile: data.profile,
    });

    return data.profile.economy.money;
  });
}

/**
 * @param userId
 * @param amount
 * @param [options]
 * @returns
 */
async function removeMoney(userId, amount, options = {}) {
  /**
   * @constant safeAmount
   */
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Cantidad inválida.");
  }

  return withUserLock(userId, async () => {
    /**
     * @constant data
     */
    const data = await resolveEconomyProfile({
      userId,
      userName: options.userName || "usuario",
      createIfMissing: options.createIfMissing === true,
      registration: options.registration || {},
    });

    if (!data) {
      throw new Error("El usuario no tiene perfil.");
    }

    /**
     * @constant current
     */
    const current = getMoneyValue(data.profile);

    if (current < safeAmount) {
      throw new Error("Dinero insuficiente.");
    }

    data.profile.economy.money = current - safeAmount;
    data.profile.updatedAt = new Date().toISOString();

    await saveUserProfile({
      folder: data.folder,
      profile: data.profile,
    });

    return data.profile.economy.money;
  });
}

/**
 * @param userId
 * @param amount
 * @param [options]
 * @returns
 */
async function setMoney(userId, amount, options = {}) {
  /**
   * @constant safeAmount
   */
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount < 0) {
    throw new Error("Cantidad inválida.");
  }

  return withUserLock(userId, async () => {
    /**
     * @constant data
     */
    const data = await resolveEconomyProfile({
      userId,
      userName: options.userName || "usuario",
      createIfMissing: options.createIfMissing !== false,
      registration: options.registration || {},
    });

    if (!data) {
      throw new Error("El usuario no tiene perfil.");
    }

    data.profile.economy.money = safeAmount;
    data.profile.updatedAt = new Date().toISOString();

    await saveUserProfile({
      folder: data.folder,
      profile: data.profile,
    });

    return data.profile.economy.money;
  });
}

/**
 * @param fromUserId
 * @param toUserId
 * @param amount
 * @param [options]
 * @returns
 */
async function transferMoney(fromUserId, toUserId, amount, options = {}) {
  /**
   * @constant safeAmount
   */
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Cantidad inválida.");
  }

  if (fromUserId === toUserId) {
    throw new Error("No puedes transferirte a ti mismo.");
  }

  /**
   * @constant fromName
   */
  const fromName = options.fromUserName || "usuario";
  /**
   * @constant toName
   */
  const toName = options.toUserName || "usuario";

  const [lockA, lockB] = [fromUserId, toUserId].sort();
  return withUserLock(lockA, async () =>
    withUserLock(lockB, async () => {
      /**
       * @constant fromData
       */
      const fromData = await resolveEconomyProfile({
        userId: fromUserId,
        userName: fromName,
        createIfMissing: true,
      });

      if (!fromData) {
        throw new Error("El usuario origen no tiene perfil.");
      }

      /**
       * @constant current
       */
      const current = getMoneyValue(fromData.profile);

      if (current < safeAmount) {
        throw new Error("Dinero insuficiente.");
      }

      /**
       * @constant toData
       */
      const toData = await resolveEconomyProfile({
        userId: toUserId,
        userName: toName,
        createIfMissing: true,
        registration: options.toRegistration || {
          source: "transfer_money",
          scope: "target",
          createdBy: fromUserId,
        },
      });

      if (!toData) {
        throw new Error("El usuario destino no tiene perfil.");
      }

      /**
       * @constant now
       */
      const now = new Date().toISOString();
      const { data: rpcResult, error: rpcError } = await supabase.rpc("transfer_money", {
        from_phone: fromUserId,
        to_phone: toUserId,
        amount: safeAmount,
      });

      if (!rpcError && rpcResult?.success) {
        invalidateUserCache(fromUserId);
        invalidateUserCache(toUserId);
        invalidateTopBalancesCache();
        return true;
      }

      /**
       * @constant fromNewMoney
       */
      const fromNewMoney = current - safeAmount;
      /**
       * @constant toNewMoney
       */
      const toNewMoney = getMoneyValue(toData.profile) + safeAmount;

      /**
       * @constant fromPayload
       */
      const fromPayload = filterExisting("players", { money: fromNewMoney, last_active_at: now });
      const { error: fromError } = await supabase.from("players").update(fromPayload).eq("phone", fromUserId);

      if (fromError) {
        throw new Error(`Error actualizando remitente: ${fromError.message}`);
      }

      /**
       * @constant toPayload
       */
      const toPayload = filterExisting("players", { money: toNewMoney, last_active_at: now });
      const { error: toError } = await supabase.from("players").update(toPayload).eq("phone", toUserId);

      if (toError) {
        /**
         * @constant rollbackPayload
         */
        const rollbackPayload = filterExisting("players", { money: current, last_active_at: now });
        const { error: rollbackError } = await supabase.from("players").update(rollbackPayload).eq("phone", fromUserId);
        if (rollbackError) {
          logError({ source: "economyService.transferMoney.rollback", error: new Error(rollbackError.message) });
          throw new Error(`Rollback falló: ${rollbackError.message}`);
        }
        throw new Error(`Error actualizando destinatario: ${toError.message}`);
      }

      invalidateUserCache(fromUserId);
      invalidateUserCache(toUserId);
      invalidateTopBalancesCache();

      return true;
    }),
  );
}

/**
 * @param {object} options
 * @returns
 */
async function claimDaily({ userId, userName = "usuario", registration = {} }) {
  return withUserLock(userId, async () => {
    /**
     * @constant data
     */
    const data = await resolveEconomyProfile({
      userId,
      userName,
      createIfMissing: true,
      registration: {
        ...registration,
        source: registration.source || "daily",
        scope: registration.scope || "self",
        createdBy: registration.createdBy || userId,
      },
    });

    if (!data) {
      throw new Error("No se pudo crear el perfil económico.");
    }

    /**
     * @constant profile
     */
    const profile = data.profile;
    /**
     * @constant now
     */
    const now = Date.now();
    /**
     * @constant cooldownMs
     */
    const cooldownMs = DAILY_COOLDOWN_HOURS * 60 * 60 * 1000;
    /**
     * @constant resetMs
     */
    const resetMs = DAILY_STREAK_RESET_HOURS * 60 * 60 * 1000;
    const { data: dailyRow, error: readError } = await supabase
      .from("bot_auth_state")
      .select("data")
      .eq("session_id", "daily")
      .eq("id", userId)
      .maybeSingle();

    if (readError) {
      throw new Error("Error leyendo racha diaria: " + readError.message);
    }

    /**
     * @constant daily
     * @type {object}
     */
    const daily = {
      streak: 0,
      lastClaim: null,
      totalClaims: 0,
      ...(dailyRow?.data || {}),
    };

    /**
     * @constant lastClaimMs
     */
    const lastClaimMs = daily.lastClaim ? Date.parse(daily.lastClaim) : NaN;

    if (Number.isFinite(lastClaimMs)) {
      /**
       * @constant elapsed
       */
      const elapsed = now - lastClaimMs;

      if (elapsed < cooldownMs) {
        return {
          claimed: false,
          available: false,
          remainingMs: cooldownMs - elapsed,
          streak: Number(daily.streak || 0),
          balance: getMoneyValue(profile),
        };
      }

      if (elapsed > resetMs) {
        daily.streak = 0;
      }
    }

    /**
     * @constant nextStreak
     */
    const nextStreak = Number(daily.streak || 0) + 1;
    /**
     * @constant bonus
     */
    const bonus = Math.min(Math.max(0, nextStreak - 1) * DAILY_STREAK_BONUS_PER_DAY, DAILY_STREAK_BONUS_CAP);

    /**
     * @constant reward
     */
    const reward = DAILY_BASE_REWARD + bonus;

    /**
     * @constant nextDaily
     * @type {object}
     */
    const nextDaily = {
      streak: nextStreak,
      lastClaim: new Date(now).toISOString(),
      totalClaims: Number(daily.totalClaims || 0) + 1,
    };
    const { error: upsertError } = await supabase.from("bot_auth_state").upsert(
      {
        session_id: "daily",
        id: userId,
        data: nextDaily,
      },
      { onConflict: "session_id,id" },
    );

    if (upsertError) {
      throw new Error("Error guardando racha diaria: " + upsertError.message);
    }

    profile.economy.money = getMoneyValue(profile) + reward;
    profile.updatedAt = new Date(now).toISOString();

    await saveUserProfile({
      folder: data.folder,
      profile,
    });

    return {
      claimed: true,
      available: true,
      reward,
      bonus,
      streak: nextStreak,
      balance: getMoneyValue(profile),
      nextClaimAt: new Date(now + cooldownMs).toISOString(),
    };
  });
}

/**
 * @param [limit]
 * @param [bypassCache]
 * @returns
 */
async function getTopBalances(limit = 10, bypassCache = false) {
  /**
   * @constant cacheKey
   */
  const cacheKey = topBalancesCacheKey(limit);
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  /**
   * @constant safeLimit
   */
  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || 10)));
  const { data, error } = await supabase
    .from("players")
    .select(safeSelect("players", "phone, username, money, last_active_at"))
    .order("money", { ascending: false })
    .range(0, safeLimit - 1);

  if (error || !data) return [];

  /**
   * @constant result
   */
  const result = data.map((row) => ({
    userId: row.phone,
    displayName: row.username || "usuario",
    money: Number(row.money || 0),
    profile: {
      creatorId: row.phone,
      creatorName: row.username,
      metadata: { displayName: row.username, lastSeenAt: row.last_active_at },
      economy: { money: Number(row.money || 0) },
    },
  }));

  cache.set(cacheKey, result, TTLS.memoryContext);
  return result;
}

module.exports = {
  getBalance,
  addMoney,
  removeMoney,
  setMoney,
  transferMoney,
  claimDaily,
  getTopBalances,
};
