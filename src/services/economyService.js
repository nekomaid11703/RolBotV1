const {
  getUserProfile,
  getOrCreateProfile,
  saveUserProfile,
  listUserProfiles,
} = require("./userService");

const {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
} = require("../config/economyConfig");

function resolveEconomyProfile({
  userId,
  userName = "usuario",
  createIfMissing = false,
  registration = {},
}) {
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

function getMoneyValue(profile) {
  return Number(profile?.economy?.money || 0);
}

async function getBalance(userId) {
  const data = await getUserProfile({
    creatorId: userId,
  });

  if (!data) {
    return 0;
  }

  return getMoneyValue(data.profile);
}

async function addMoney(
  userId,
  amount,
  options = {},
) {
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Cantidad inválida.");
  }

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
}

async function removeMoney(
  userId,
  amount,
  options = {},
) {
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Cantidad inválida.");
  }

  const data = await resolveEconomyProfile({
    userId,
    userName: options.userName || "usuario",
    createIfMissing: options.createIfMissing === true,
    registration: options.registration || {},
  });

  if (!data) {
    throw new Error("El usuario no tiene perfil.");
  }

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
}

async function setMoney(
  userId,
  amount,
  options = {},
) {
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount < 0) {
    throw new Error("Cantidad inválida.");
  }

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
}

async function transferMoney(
  fromUserId,
  toUserId,
  amount,
  options = {},
) {
  const safeAmount = Math.floor(Number(amount));

  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Cantidad inválida.");
  }

  const fromName = options.fromUserName || "usuario";
  const toName = options.toUserName || "usuario";

  const fromData = await resolveEconomyProfile({
    userId: fromUserId,
    userName: fromName,
    createIfMissing: true,
  });

  if (!fromData) {
    throw new Error("El usuario origen no tiene perfil.");
  }

  const current = getMoneyValue(fromData.profile);

  if (current < safeAmount) {
    throw new Error("Dinero insuficiente.");
  }

  fromData.profile.economy.money = current - safeAmount;
  fromData.profile.updatedAt = new Date().toISOString();

  await saveUserProfile({
    folder: fromData.folder,
    profile: fromData.profile,
  });

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

  toData.profile.economy.money = getMoneyValue(toData.profile) + safeAmount;
  toData.profile.updatedAt = new Date().toISOString();

  await saveUserProfile({
    folder: toData.folder,
    profile: toData.profile,
  });

  return true;
}

async function claimDaily({
  userId,
  userName = "usuario",
  registration = {},
}) {
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

  const profile = data.profile;
  const now = Date.now();
  const cooldownMs = DAILY_COOLDOWN_HOURS * 60 * 60 * 1000;
  const resetMs = DAILY_STREAK_RESET_HOURS * 60 * 60 * 1000;

  const daily = {
    streak: 0,
    lastClaim: null,
    totalClaims: 0,
    ...(profile.daily || {}),
  };

  const lastClaimMs = daily.lastClaim
    ? Date.parse(daily.lastClaim)
    : NaN;

  if (Number.isFinite(lastClaimMs)) {
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

  const nextStreak = Number(daily.streak || 0) + 1;
  const bonus = Math.min(
    Math.max(0, nextStreak - 1) * DAILY_STREAK_BONUS_PER_DAY,
    DAILY_STREAK_BONUS_CAP,
  );

  const reward = DAILY_BASE_REWARD + bonus;

  profile.economy.money = getMoneyValue(profile) + reward;
  profile.daily = {
    ...daily,
    streak: nextStreak,
    lastClaim: new Date(now).toISOString(),
    totalClaims: Number(daily.totalClaims || 0) + 1,
  };
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
}

async function getTopBalances(limit = 10) {
  const safeLimit = Math.max(1, Math.floor(Number(limit) || 10));
  const users = await listUserProfiles();

  return users
    .map(({ profile }) => ({
      userId: profile.creatorId,
      displayName:
        profile.metadata?.displayName ||
        profile.creatorName ||
        "usuario",
      money: getMoneyValue(profile),
      profile,
    }))
    .sort((a, b) => {
      if (b.money !== a.money) {
        return b.money - a.money;
      }

      return String(a.displayName).localeCompare(
        String(b.displayName),
        "es",
      );
    })
    .slice(0, safeLimit);
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
