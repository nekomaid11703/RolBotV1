const fs = require('fs');
const path = require('path');
const orchestrator = require('../ai/aiOrchestrator');
const { getSceneForNarrative, invalidateScene, incrementSceneVersion, getSceneVersion } = require('./sceneCache');
const { getContextualLore, getLoreByKeyword } = require('./worldLore');
const { render } = require('./narrativePrompts/combat.templates');

const SYSTEM_PROMPT_PATH = path.join(__dirname, 'narrativePrompts', 'combat.system.md');
const NARRATION_CACHE_TTL = 300000;

let systemPromptCache = null;

function loadSystemPrompt() {
  if (systemPromptCache) return systemPromptCache;
  try {
    systemPromptCache = fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf8');
    return systemPromptCache;
  } catch {
    systemPromptCache = 'Eres el narrador de combate. Describe el resultado en 1-3 oraciones.';
    return systemPromptCache;
  }
}

function reloadSystemPrompt() {
  systemPromptCache = null;
  return loadSystemPrompt();
}

function buildNarrativePrompt(actionResult) {
  const { action, result, context } = actionResult;

  const location = context.location || {};
  const sceneVersion = location.sceneVersion || getSceneVersion(location.locationId) || 1;

  const scene = getSceneForNarrative(
    location.locationId || 'default',
    location.zone || 'desconocido',
    location.region || 'desconocido',
    sceneVersion
  );

  const lore = getContextualLore(
    location.region,
    location.zone,
    location.locationId,
    600
  );

  const sceneDesc = typeof scene === 'string' ? scene : (scene.description || 'El escenario se extiende ante ti.');
  const loreBlock = lore || 'No hay contexto de mundo disponible.';

  const aliveCount = context.participants || 2;

  const prompt = `Genera una narración de combate basada en este resultado:

ENTORNO: ${sceneDesc}

LORE DEL MUNDO:
${loreBlock}

COMBATE: Ronda ${context.round || 1}, Turno #${context.turnCount || 1}
PARTICIPANTES VIVOS: ${aliveCount}

ACCIÓN:
- Actor: ${action.actor} (${context.attacker.name})
- Tipo: ${action.type}
- Intención: ${action.intent}
- Zona objetivo: ${result.bodyPart || action.targetZone}
- Tipo de daño: ${result.damageType || 'físico'}
- Movimiento #${result.moveNumber || 1}

RESULTADO:
- Acierto: ${result.hit ? 'Sí' : 'No'}
- Daño: ${result.damage || 0} (${result.crit ? 'CRÍTICO' : 'normal'})
- Bloqueado: ${result.blocked ? 'Sí' : 'No'}
- Interceptado: ${result.intercepted ? 'Sí' : 'No'}
- KO: ${result.ko ? 'Sí' : 'No'}
${result.bodyPartStatus ? `- Estado de zona: ${result.bodyPartStatus}` : ''}
- Fatiga atacante: ${context.attacker.fatigue || 0}/10
- Fatiga defensor: ${context.defender ? (context.defender.fatigue || 0) + '/10' : 'N/A'}

Narra el resultado en 1-2 oraciones. Sé descriptivo pero preciso.`;

  return prompt;
}

function determineTone(actionResult) {
  const { result, context } = actionResult;

  if (result.ko) return 'epic';
  if (result.crit) return 'epic';
  if (result.bodyPartStatus === 'amputated') return 'graphic';
  if (result.bodyPartStatus === 'useless') return 'graphic';
  if ((context.attacker.fatigue || 0) >= 3 || (context.defender && context.defender.fatigue >= 3)) return 'dramatic';
  if ((result.moveNumber || 1) > 5) return 'dynamic';
  if (context.isBoss) return 'epic';

  const location = context.location || {};
  const nsfwZones = ['burdel', 'carcel', 'prision', 'mazmorra', 'fosa', 'gueto', 'templo oscuro'];
  if (location.zone && nsfwZones.some(z => location.zone.toLowerCase().includes(z))) return 'grim';
  if (location.locationId && nsfwZones.some(z => location.locationId.toLowerCase().includes(z))) return 'grim';

  return 'agile';
}

async function narrate(actionResult) {
  const systemInstruction = loadSystemPrompt();
  const prompt = buildNarrativePrompt(actionResult);
  const tone = determineTone(actionResult);

  const location = actionResult.context.location || {};
  if (location.locationId) {
    incrementSceneVersion(location.locationId);
  }

  const temperature = tone === 'epic' ? 0.8 : tone === 'graphic' ? 0.75 : tone === 'dramatic' ? 0.7 : tone === 'grim' ? 0.75 : 0.6;

  const providerPreference = 'deepseek';
  const cacheKey = `narration:${JSON.stringify({
    hit: actionResult.result.hit,
    damage: actionResult.result.damage,
    bodyPart: actionResult.result.bodyPart,
    crit: actionResult.result.crit,
    blocked: actionResult.result.blocked,
    ko: actionResult.result.ko,
  })}`;

  try {
    const narrative = await orchestrator.generateText({
      prompt,
      systemInstruction,
      temperature,
      providerPreference,
      bypassCache: true,
    });

    return {
      narrative: narrative.trim(),
      narrationType: 'ai',
      tone,
      warning: null,
      infractions: [],
    };
  } catch (err) {
    const templateNarrative = generateTemplateNarrative(actionResult);
    return {
      narrative: templateNarrative,
      narrationType: 'template',
      tone: 'template',
      warning: `Narrador IA no disponible: ${err.message}`,
      infractions: [],
    };
  }
}

function generateTemplateNarrative(actionResult) {
  const { action, result, context } = actionResult;
  const isPlayerAttacker = action.actor === 'player' || action.actor === context.attacker.name || true;
  const attacker = context.attacker ? context.attacker.name : 'Alguien';
  const defender = context.defender ? context.defender.name : 'nadie';

  if (action.type === 'attack' && result.hit && result.ko) {
    return render('ko_critical', defender, result.bodyPart);
  }
  if (action.type === 'attack' && result.hit && result.crit) {
    return render('attack_crit', attacker, defender, result.bodyPart);
  }
  if (action.type === 'attack' && result.hit) {
    return render('attack_hit', attacker, defender, result.bodyPart);
  }
  if (action.type === 'attack' && !result.hit) {
    return result.intercepted ? render('intercepted', attacker, defender) : render('attack_miss', attacker, defender);
  }
  if (action.type === 'defend') {
    return render('defend', attacker);
  }
  if (action.type === 'flee') {
    return result.hit ? render('flee_success', attacker) : render('flee_fail', attacker);
  }

  return `${attacker} realiza una acción.`;
}

function invalidateSceneNarrative(locationId) {
  invalidateScene(locationId);
}

module.exports = {
  narrate,
  buildNarrativePrompt,
  determineTone,
  generateTemplateNarrative,
  loadSystemPrompt,
  reloadSystemPrompt,
  invalidateSceneNarrative,
};
