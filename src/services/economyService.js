const {
  getUserProfile,
  saveUserProfile,
} = require("./userService");

async function getBalance(userId) {
  const data = await getUserProfile({
    creatorId: userId,
  });

  if (!data) {
    return 0;
  }

  return Number(
    data.profile?.economy?.money || 0,
  );
}

async function addMoney(userId, amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Cantidad inválida.");
  }

  const data = await getUserProfile({
    creatorId: userId,
  });

  if (!data) {
    throw new Error(
      "El usuario no tiene perfil.",
    );
  }

  data.profile.economy.money += Math.floor(
    amount,
  );

  data.profile.updatedAt =
    new Date().toISOString();

  await saveUserProfile({
    folder: data.folder,
    profile: data.profile,
  });

  return data.profile.economy.money;
}

async function removeMoney(userId, amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Cantidad inválida.");
  }

  const data = await getUserProfile({
    creatorId: userId,
  });

  if (!data) {
    throw new Error(
      "El usuario no tiene perfil.",
    );
  }

  const current =
    data.profile.economy.money || 0;

  if (current < amount) {
    throw new Error(
      "Dinero insuficiente.",
    );
  }

  data.profile.economy.money -= Math.floor(
    amount,
  );

  data.profile.updatedAt =
    new Date().toISOString();

  await saveUserProfile({
    folder: data.folder,
    profile: data.profile,
  });

  return data.profile.economy.money;
}

async function setMoney(userId, amount) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Cantidad inválida.");
  }

  const data = await getUserProfile({
    creatorId: userId,
  });

  if (!data) {
    throw new Error(
      "El usuario no tiene perfil.",
    );
  }

  data.profile.economy.money =
    Math.floor(amount);

  data.profile.updatedAt =
    new Date().toISOString();

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
) {
  await removeMoney(fromUserId, amount);
  await addMoney(toUserId, amount);

  return true;
}

module.exports = {
  getBalance,
  addMoney,
  removeMoney,
  setMoney,
  transferMoney,
};