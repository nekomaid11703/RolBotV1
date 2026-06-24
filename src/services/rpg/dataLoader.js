const races = require('../../data/races');
const classes = require('../../data/classes');
const { logError } = require('../loggerService');

let loaded = false;
let raceIndex = {};
let classIndex = {};

function buildIndex() {
  raceIndex = {};
  classIndex = {};

  for (const race of races) {
    raceIndex[race.id] = race;
    raceIndex[race.name.toLowerCase()] = race;
  }

  for (const cls of classes) {
    classIndex[cls.id] = cls;
    classIndex[cls.name.toLowerCase()] = cls;
  }

  loaded = true;
}

function getAllRaces() {
  if (!loaded) buildIndex();
  return races;
}

function getRace(key) {
  if (!loaded) buildIndex();
  return raceIndex[key ? key.toLowerCase() : ''] || null;
}

function getAllClasses() {
  if (!loaded) buildIndex();
  return classes;
}

function getClass(key) {
  if (!loaded) buildIndex();
  return classIndex[key ? key.toLowerCase() : ''] || null;
}

function validateRaceClassCompatibility(raceId, classId) {
  const race = getRace(raceId);
  const cls = getClass(classId);
  if (!race || !cls) return { valid: false, reason: 'Raza o clase no encontrada' };

  if (cls.restrictions && cls.restrictions.length > 0) {
    for (const restriction of cls.restrictions) {
      if (restriction.type === 'race' && restriction.value === raceId) {
        return { valid: false, reason: restriction.reason || `${race.name} no puede ser ${cls.name}` };
      }
      if (restriction.type === 'alignment') {
        const requiredAligns = Array.isArray(restriction.value) ? restriction.value : [restriction.value];
        const hasAlign = race.alignment && race.alignment.some(a => requiredAligns.includes(a));
        if (!hasAlign) {
          return { valid: false, reason: restriction.reason || `${cls.name} requiere alineación ${requiredAligns.join('/')}` };
        }
      }
    }
  }

  return { valid: true };
}

function reload() {
  delete require.cache[require.resolve('../../data/races')];
  delete require.cache[require.resolve('../../data/classes')];
  loaded = false;
  buildIndex();
}

buildIndex();

module.exports = {
  getAllRaces,
  getRace,
  getAllClasses,
  getClass,
  validateRaceClassCompatibility,
  reload,
};
