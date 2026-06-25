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

function getSceneForNarrative(locationId, zoneName, loreContext) {
  const cached = getScene(locationId);
  if (cached) return cached;

  const scene = buildSceneDescription(locationId, zoneName, loreContext);
  setScene(locationId, scene);
  return scene;
}

function invalidateScene(locationId) {
  for (const key of sceneCache.keys()) {
    if (key.startsWith(locationId + ':')) sceneCache.delete(key);
  }
}

function invalidateAll() {
  sceneCache.clear();
}

module.exports = {
  getScene,
  setScene,
  getSceneKey,
  getSceneForNarrative,
  buildSceneDescription,
  invalidateScene,
  invalidateAll,
};
