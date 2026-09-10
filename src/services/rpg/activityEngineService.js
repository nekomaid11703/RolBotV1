// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { invalidateUserCache } = require("../../utils/safeQuery");
const { EXPEDITION_ZONES } = require("../../config/expeditionConfig");
const { JOBS, trainingPointsForJob } = require("../../config/jobConfig");
const { JOB_TRAINING } = require("../../config/progressionBalance");
const {
  MATERIAL_ROLLS_BY_DURATION,
  rarityBandProbabilities,
  DROP_QTY_BY_RARITY,
} = require("../../config/rarityDropConfig");
const { getCharacterTools } = require("./toolService");
const { resolveZoneAxisContext, chooseAxis, sampleBand, materialForBandAxis } = require("./rarityDropService");
const { computeJobTraining } = require("./jobTrainingService");
const { jobXpForLevel, expeditionXpForLevel } = require("./xpRewardService");
const inventoryService = require("./inventoryService");
const economyService = require("../economyService");
const characterService = require("../characterService");

const MAX_DAILY_ENERGY = 100;

/**
 * Entero aleatorio uniforme entre min y max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  const lo = Number(min) || 1;
  const hi = Math.max(lo, Number(max) || lo);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/**
 * Devuelve la clave de la semana ISO (YYYY-Www) de una fecha.
 * @param {Date} date
 * @returns {string}
 */
function getWeekKey(date) {
  const target = new Date(date);
  const day = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - day + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDay = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDay + 3);
  const week = 1 + Math.round((target - firstThursday) / (7 * 24 * 60 * 60 * 1000));
  return `${target.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * Obtiene la fecha actual en formato ISO YYYY-MM-DD.
 * @returns {string}
 */
function getTodayIsoString() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Normaliza y devuelve la energía disponible de un personaje para hoy.
 * Si es un día nuevo, se reinicia a MAX_DAILY_ENERGY (100).
 * @param {object} characterSlots
 * @returns {{current: number, max: number, date: string}}
 */
function normalizeCharacterEnergy(characterSlots = {}) {
  const today = getTodayIsoString();
  const energyData = (characterSlots && typeof characterSlots === "object" && characterSlots.energy) || {};

  if (energyData.date !== today) {
    return { current: MAX_DAILY_ENERGY, max: MAX_DAILY_ENERGY, date: today };
  }

  const current = typeof energyData.current === "number" ? Math.max(0, energyData.current) : MAX_DAILY_ENERGY;
  return { current, max: MAX_DAILY_ENERGY, date: today };
}

/**
 * Obtiene la energía restante de un personaje.
 * @param {string|number} characterId
 * @returns {Promise<{current: number, max: number, date: string}>}
 */
async function getDailyEnergy(characterId) {
  const { data, error } = await supabase.from("characters").select("slots").eq("id", characterId).maybeSingle();

  if (error || !data) return { current: MAX_DAILY_ENERGY, max: MAX_DAILY_ENERGY, date: getTodayIsoString() };
  return normalizeCharacterEnergy(data.slots);
}

/**
 * Verifica si el personaje está actualmente ocupado en una expedición o trabajo.
 * @param {string|number} characterId
 * @returns {Promise<{busy: boolean, activity: object|null}>}
 */
async function isCharacterBusy(characterId) {
  const { data } = await supabase.from("characters").select("slots").eq("id", characterId).maybeSingle();
  const activity = data?.slots?.activity || null;
  if (!activity) return { busy: false, activity: null };
  return { busy: true, activity };
}

/**
 * Inicia una expedición para el personaje activo.
 * @param {object} params
 * @param {string} params.userId
 * @param {string|number} params.characterId
 * @param {string} params.zoneId
 * @param {'corta'|'media'|'larga'} [params.durationType='corta']
 * @returns {Promise<{success: boolean, activity?: object, error?: string}>}
 */
async function startExpedition({ userId, characterId, zoneId, durationType = "corta" }) {
  const cleanZoneId = String(zoneId || "")
    .toLowerCase()
    .trim();
  const zone = EXPEDITION_ZONES[cleanZoneId];

  if (!zone) {
    const valid = Object.keys(EXPEDITION_ZONES).join(", ");
    return { success: false, error: `Zona no encontrada. Zonas válidas: ${valid}.` };
  }

  const cleanDuration = ["corta", "media", "larga"].includes(durationType) ? durationType : "corta";
  const energyCost = zone.energyCosts[cleanDuration] || 15;
  const durationMin = zone.durationsMinutes[cleanDuration] || 10;

  // 1. Obtener personaje
  const { data: character, error } = await supabase
    .from("characters")
    .select("id, player_phone, nivel, slots")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !character) {
    return { success: false, error: "Personaje no encontrado." };
  }

  // 2. Verificar nivel mínimo
  if ((character.nivel || 1) < zone.minLevel) {
    return {
      success: false,
      error: `Requieres nivel ${zone.minLevel} para explorar ${zone.name} (nivel actual: ${character.nivel || 1}).`,
    };
  }

  // 3. Verificar si está ocupado
  if (character.slots?.activity) {
    const act = character.slots.activity;
    return {
      success: false,
      error: `Tu personaje ya está ocupado en: ${act.name || act.type}. Usa /expedicion estado o /trabajar estado.`,
    };
  }

  // 4. Verificar energía diaria
  const energy = normalizeCharacterEnergy(character.slots);
  if (energy.current < energyCost) {
    return {
      success: false,
      error: `Energía insuficiente (${energy.current}/${MAX_DAILY_ENERGY}). Esta expedición cuesta ${energyCost} de energía. Descansa hasta mañana o consume un pescado fresco.`,
    };
  }

  // 5. Establecer tiempo de inicio y fin
  const now = Date.now();
  const finishesAt = now + durationMin * 60 * 1000;

  const activityPayload = {
    type: "expedition",
    zoneId: cleanZoneId,
    zoneName: zone.name,
    name: `Expedición en ${zone.name}`,
    durationType: cleanDuration,
    startedAt: now,
    finishesAt,
    durationMinutes: durationMin,
  };

  const updatedEnergy = {
    current: energy.current - energyCost,
    max: MAX_DAILY_ENERGY,
    date: energy.date,
  };

  const updatedSlots = {
    ...(character.slots || {}),
    activity: activityPayload,
    energy: updatedEnergy,
  };

  const updatePayload = filterExisting("characters", {
    slots: updatedSlots,
    updated_at: new Date().toISOString(),
  });

  const { error: updErr } = await supabase.from("characters").update(updatePayload).eq("id", characterId);
  if (updErr) throw new Error(`Error al iniciar expedición: ${updErr.message}`);

  invalidateUserCache(userId);

  return {
    success: true,
    activity: activityPayload,
    remainingEnergy: updatedEnergy.current,
  };
}

/**
 * Inicia una jornada de trabajo para el personaje activo.
 * @param {object} params
 * @param {string} params.userId
 * @param {string|number} params.characterId
 * @param {string} params.jobId
 * @returns {Promise<{success: boolean, activity?: object, error?: string}>}
 */
async function startJob({ userId, characterId, jobId }) {
  const cleanJobId = String(jobId || "")
    .toLowerCase()
    .trim();
  const job = JOBS[cleanJobId];

  if (!job) {
    return { success: false, error: `El trabajo "${cleanJobId}" no existe. Consulta la lista con /trabajos.` };
  }

  // 1. Obtener personaje
  const { data: character, error } = await supabase
    .from("characters")
    .select("id, player_phone, stats, slots")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !character) {
    return { success: false, error: "Personaje no encontrado." };
  }

  // 2. Verificar requisitos de stats
  const stats = character.stats || {};
  for (const [statKey, minVal] of Object.entries(job.requirements || {})) {
    const currentVal = stats[statKey] || 0;
    if (currentVal < minVal) {
      return {
        success: false,
        error: `No cumples los requisitos: requieres ${statKey.toUpperCase()} >= ${minVal} (tienes ${currentVal}).`,
      };
    }
  }

  // 3. Verificar si está ocupado
  if (character.slots?.activity) {
    const act = character.slots.activity;
    return { success: false, error: `Tu personaje ya está ocupado en: ${act.name || act.type}.` };
  }

  // 4. Verificar energía diaria
  const energy = normalizeCharacterEnergy(character.slots);
  if (energy.current < job.energyCost) {
    return {
      success: false,
      error: `Energía insuficiente (${energy.current}/${MAX_DAILY_ENERGY}). Trabajar de ${job.name} cuesta ${job.energyCost} de energía.`,
    };
  }

  // 5. Iniciar actividad
  const now = Date.now();
  const finishesAt = now + job.durationMinutes * 60 * 1000;

  const activityPayload = {
    type: "job",
    jobId: cleanJobId,
    jobName: job.name,
    name: `Trabajo: ${job.name}`,
    startedAt: now,
    finishesAt,
    durationMinutes: job.durationMinutes,
  };

  const updatedEnergy = {
    current: energy.current - job.energyCost,
    max: MAX_DAILY_ENERGY,
    date: energy.date,
  };

  const updatedSlots = {
    ...(character.slots || {}),
    activity: activityPayload,
    energy: updatedEnergy,
  };

  const updatePayload = filterExisting("characters", {
    slots: updatedSlots,
    updated_at: new Date().toISOString(),
  });

  const { error: updErr } = await supabase.from("characters").update(updatePayload).eq("id", characterId);
  if (updErr) throw new Error(`Error al iniciar trabajo: ${updErr.message}`);

  invalidateUserCache(userId);

  return {
    success: true,
    activity: activityPayload,
    remainingEnergy: updatedEnergy.current,
  };
}

/**
 * Reclama las recompensas de la actividad completada (expedición o trabajo).
 * @param {object} params
 * @param {string} params.userId
 * @param {string|number} params.characterId
 * @returns {Promise<{success: boolean, type: string, rewards?: object, error?: string}>}
 */
async function claimActivity({ userId, characterId }) {
  const { data: character, error } = await supabase
    .from("characters")
    .select("id, name, player_phone, stats, slots, nivel")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !character) {
    return { success: false, error: "Personaje no encontrado." };
  }

  const activity = character.slots?.activity;
  if (!activity) {
    return { success: false, error: "No tienes ninguna expedición o trabajo activo para reclamar." };
  }

  const now = Date.now();
  if (now < activity.finishesAt) {
    const remainingMs = activity.finishesAt - now;
    const remainingMin = Math.ceil(remainingMs / 60000);
    return {
      success: false,
      error: `La actividad aún no ha finalizado. Faltan aproximadamente ${remainingMin} minuto(s).`,
    };
  }

  // RESOLVER RECOMPENSAS
  if (activity.type === "expedition") {
    const zone = EXPEDITION_ZONES[activity.zoneId];
    const tools = await getCharacterTools(characterId);

    // Multiplicador por duración (stelas, XP y drops planos no-material)
    const durMult = activity.durationType === "larga" ? 2.5 : activity.durationType === "media" ? 1.6 : 1.0;

    // ── Botín de materiales: eje por zona + rareza por R(L) (B8.2b/P2) ──
    // La zona sesga la especialización (axisWeights) y la herramienta de ese eje
    // gobierna la curva; sin piso: cualquier rareza es posible pero escasa.
    const lootObtained = [];
    const axisContext = resolveZoneAxisContext(zone, tools);
    if (axisContext.axes.length > 0) {
      const rolls = MATERIAL_ROLLS_BY_DURATION[activity.durationType] || 2;
      for (let i = 0; i < rolls; i += 1) {
        const axisEntry = chooseAxis(axisContext);
        if (!axisEntry) continue;
        const probabilities = rarityBandProbabilities({ toolLevel: axisEntry.toolLevel });
        const band = sampleBand(probabilities);
        if (!band) continue;
        const materialId = materialForBandAxis(band, axisEntry.axis);
        if (!materialId) continue;
        const [minQty, maxQty] = DROP_QTY_BY_RARITY[band] || [1, 1];
        lootObtained.push({ itemId: `trozo_de_${materialId}`, quantity: randomInt(minQty, maxQty) });
      }
    }

    // ── Drops planos no-material (pescado, hierbas): chance = weight/100, sin bonus ──
    for (const lootEntry of zone?.lootTable || []) {
      const tool = tools[lootEntry.toolReq];
      const toolLvl = tool?.level || 1;
      if (toolLvl < (lootEntry.minToolLevel || 1)) continue;
      if (Math.random() * 100 < lootEntry.weight) {
        const baseQty = randomInt(lootEntry.minQty, lootEntry.maxQty);
        lootObtained.push({ itemId: lootEntry.itemId, quantity: Math.max(1, Math.round(baseQty * durMult)) });
      }
    }

    // Stelas halladas
    const minStelas = Math.round((zone?.stelasRange?.min || 20) * durMult);
    const maxStelas = Math.round((zone?.stelasRange?.max || 80) * durMult);
    const stelasGained = Math.floor(Math.random() * (maxStelas - minStelas + 1)) + minStelas;

    // XP obtenida (política B1: fracción del requisito del nivel actual)
    const xpGained = expeditionXpForLevel(character.nivel || 1, (zone?.baseXp || 40) * durMult);

    // Validate all rewards before changing money, XP, or activity state.
    const delivery = await inventoryService.validateInventoryAdditions(characterId, lootObtained);
    if (!delivery.ok) {
      return {
        success: false,
        error: `${delivery.error} Libera espacio y vuelve a usar /expedicion reclamar.`,
      };
    }

    // 1. Guardar materiales en inventario
    for (const item of lootObtained) {
      await inventoryService.addItem(characterId, userId, item.itemId, item.quantity);
    }

    // 2. Dar stelas
    await economyService.addMoney(userId, stelasGained);

    // 3. Dar XP
    await characterService.addXp({ creatorId: userId, characterName: character.name, cantidad: xpGained });

    // 4. Limpiar actividad
    const updatedSlots = { ...(character.slots || {}) };
    delete updatedSlots.activity;

    const payload = filterExisting("characters", {
      slots: updatedSlots,
      updated_at: new Date().toISOString(),
    });
    await supabase.from("characters").update(payload).eq("id", characterId);
    invalidateUserCache(userId);

    return {
      success: true,
      type: "expedition",
      zoneName: zone?.name || activity.zoneName,
      loot: lootObtained,
      stelas: stelasGained,
      xp: xpGained,
    };
  }

  if (activity.type === "job") {
    const job = JOBS[activity.jobId];
    const stelasGained = job?.stelasReward || 100;
    const xpGained = jobXpForLevel(character.nivel || 1, job?.xpReward || 35);
    const statTrained = job?.statTrained;

    // 1. Pagar salario
    await economyService.addMoney(userId, stelasGained);

    // 2. Otorgar XP
    await characterService.addXp({ creatorId: userId, characterName: character.name, cantidad: xpGained });

    // 3. Entrenamiento acumulado: cada jornada aporta puntos hacia el atributo.
    //    La conversión a +1 respeta un tope semanal por atributo (JOB_TRAINING).
    const updatedStats = { ...(character.stats || {}) };
    const updatedSlots = { ...(character.slots || {}) };
    delete updatedSlots.activity;

    const statAtCap = (updatedStats[statTrained] || 0) >= 100;
    const trainingPoints = statTrained && !statAtCap ? trainingPointsForJob(job) : 0;
    let statIncreased = false;
    let weekGains = 0;
    let trainingPointsRemaining = 0;

    if (trainingPoints > 0) {
      const weekKey = getWeekKey(new Date());
      updatedSlots.training = { ...(updatedSlots.training || {}) };
      const current = updatedSlots.training[statTrained] || {};
      const result = computeJobTraining({
        points: trainingPoints,
        currentPoints: current.points,
        weekGains: current.weekGains,
        trainingWeek: current.week,
        weekKey,
        statValue: updatedStats[statTrained] || 0,
      });
      statIncreased = result.statIncreased;
      weekGains = result.weekGains;
      trainingPointsRemaining = result.pointsRemaining;
      updatedStats[statTrained] = result.statValue;
      updatedSlots.training[statTrained] = {
        points: result.pointsRemaining,
        week: weekKey,
        weekGains: result.weekGains,
      };
    }

    // 4. Limpiar actividad
    const payload = filterExisting("characters", {
      slots: updatedSlots,
      stats: updatedStats,
      updated_at: new Date().toISOString(),
    });
    await supabase.from("characters").update(payload).eq("id", characterId);
    invalidateUserCache(userId);

    return {
      success: true,
      type: "job",
      jobName: job?.name || activity.jobName,
      stelas: stelasGained,
      xp: xpGained,
      statTrained,
      statIncreased,
      training: {
        stat: statTrained,
        pointsGained: trainingPoints,
        pointsRemaining: trainingPointsRemaining,
        threshold: JOB_TRAINING.pointsPerStatPoint,
        weekGains,
        weeklyCap: JOB_TRAINING.weeklyCapPerStat,
        atCap: statAtCap,
      },
    };
  }

  return { success: false, error: "Tipo de actividad desconocido." };
}

/**
 * Cancela la actividad activa y libera al personaje de inmediato.
 * @param {object} params
 * @param {string} params.userId
 * @param {string|number} params.characterId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function cancelActivity({ userId, characterId }) {
  const { data: character } = await supabase.from("characters").select("slots").eq("id", characterId).maybeSingle();
  if (!character?.slots?.activity) {
    return { success: false, error: "Tu personaje no tiene ninguna actividad en curso para cancelar." };
  }

  const updatedSlots = { ...(character.slots || {}) };
  delete updatedSlots.activity;

  const payload = filterExisting("characters", {
    slots: updatedSlots,
    updated_at: new Date().toISOString(),
  });
  await supabase.from("characters").update(payload).eq("id", characterId);
  invalidateUserCache(userId);

  return { success: true };
}

module.exports = {
  getDailyEnergy,
  isCharacterBusy,
  startExpedition,
  startJob,
  claimActivity,
  cancelActivity,
  MAX_DAILY_ENERGY,
};
