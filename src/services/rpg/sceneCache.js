const { worldLore } = require('./worldLore');

const sceneCache = new Map();
const DEFAULT_TTL = 1800000;

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
}

module.exports = {
  getScene,
  setScene,
  getSceneKey,
  getSceneForNarrative,
  buildSceneDescription,
  incrementSceneVersion,
  getSceneVersion,
  invalidateScene,
  invalidateAll,
};
