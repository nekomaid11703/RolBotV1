const worldLore = require('./worldLore');

const sceneCache = new Map();
const DEFAULT_TTL = 1800000;

const effectBurnCounters = new Map();

function getSceneKey(locationId, context = '') {
  return `${locationId}:${String(context).trim().toLowerCase()}`;
}

function getScene(locationId, context = '') {
  const key = getSceneKey(locationId, context);
  const cached = sceneCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > (cached.ttl || DEFAULT_TTL)) {
    sceneCache.delete(key);
    return null;
  }
  return cached.data;
}

function setScene(locationId, data, { ttl = DEFAULT_TTL, context = '' } = {}) {
  const key = getSceneKey(locationId, context);
  sceneCache.set(key, { data, timestamp: Date.now(), ttl });
}

function buildSceneDescription(locationId, zoneName, loreContext) {
  const base = {
    locationId,
    zoneName: zoneName || 'un lugar desconocido',
    description: 'El escenario se extiende ante ti.',
    atmosphere: 'neutral',
    pointsOfInterest: [],
    hazards: [],
    loot: [],
  };

  if (loreContext) {
    base.description = loreContext;
  }

  return base;
}

const sceneVersions = new Map();

function getSceneForNarrative(locationId, zoneName, loreContext, sceneVersion) {
  const cacheKey = sceneVersion ? `${locationId}:v${sceneVersion}` : locationId;
  const cached = getScene(cacheKey);
  if (cached) return cached;

  const scene = buildSceneDescription(locationId, zoneName, loreContext);

  if (sceneVersion && sceneVersion > 1) {
    const prevScenes = sceneVersions.get(locationId) || 0;
    scene.description += `\n\n_El lugar muestra las marcas de batallas pasadas (versión ${sceneVersion})._`;
    if (prevScenes > 0 && sceneVersion > prevScenes) {
      scene.description += ` Algo ha cambiado desde la última vez que estuviste aquí.`;
    }
  }

  setScene(cacheKey, scene);
  return scene;
}

function getSceneWithEffects(locationId, zoneName, loreContext, sceneVersion, activeEffects) {
  const scene = getSceneForNarrative(locationId, zoneName, loreContext, sceneVersion);

  if (activeEffects && activeEffects.length > 0) {
    const { getSceneEffectDescriptions } = require('./environmentalEffects');
    const effectDesc = getSceneEffectDescriptions(activeEffects);
    if (effectDesc) {
      const burnKey = getBurnKey(locationId, activeEffects);
      const burnCount = effectBurnCounters.get(burnKey) || 1;
      const intensity = burnCount > 3 ? ' intensamente' : burnCount > 1 ? ' visiblemente' : '';
      const extendedScene = `\n\n_Los efectos ambientales${intensity} se manifiestan:_ ${effectDesc}`;
      return {
        ...scene,
        description: scene.description + extendedScene,
      };
    }
  }

  return scene;
}

function getBurnKey(locationId, activeEffects) {
  return `${locationId}:${(activeEffects || []).sort().join('+')}`;
}

function incrementEffectBurn(locationId, activeEffects) {
  const key = getBurnKey(locationId, activeEffects);
  const current = effectBurnCounters.get(key) || 1;
  effectBurnCounters.set(key, current + 1);
  return current + 1;
}

function getEffectBurnCount(locationId, activeEffects) {
  const key = getBurnKey(locationId, activeEffects);
  return effectBurnCounters.get(key) || 1;
}

function resetEffectBurn(locationId) {
  for (const key of effectBurnCounters.keys()) {
    if (key.startsWith(locationId + ':')) effectBurnCounters.delete(key);
  }
}

function incrementSceneVersion(locationId) {
  const current = sceneVersions.get(locationId) || 1;
  sceneVersions.set(locationId, current + 1);
  return current + 1;
}

function getSceneVersion(locationId) {
  return sceneVersions.get(locationId) || 1;
}

function invalidateScene(locationId) {
  for (const key of sceneCache.keys()) {
    if (key.startsWith(locationId + ':')) sceneCache.delete(key);
  }
}

function invalidateAll() {
  sceneCache.clear();
  sceneVersions.clear();
  effectBurnCounters.clear();
}

module.exports = {
  getScene,
  setScene,
  getSceneKey,
  getSceneForNarrative,
  getSceneWithEffects,
  buildSceneDescription,
  incrementSceneVersion,
  getSceneVersion,
  invalidateScene,
  invalidateAll,
  incrementEffectBurn,
  getEffectBurnCount,
  resetEffectBurn,
};
