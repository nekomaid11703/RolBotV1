const fs = require('fs');
const path = require('path');
const orchestrator = require('../ai/aiOrchestrator');
const { getSceneWithEffects, getSceneVersion, incrementEffectBurn } = require('./sceneCache');
const { getContextualLore, getLoreByKeyword } = require('./worldLore');
const { render, renderAbility } = require('./narrativePrompts/combat.templates');
const envEffects = require('./environmentalEffects');

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

function getNarrativeContext(actionResult) {
  const { action, result, context } = actionResult;
  const location = context.location || {};
  const sceneVersion = location.sceneVersion || getSceneVersion(location.locationId) || 1;

  const scene = getSceneWithEffects(
    location.locationId || 'default',
    location.zone || 'desconocido',
    location.region || 'desconocido',
    sceneVersion,
    location.activeEffects || []
  );

  const lore = getContextualLore(
    location.region,
    location.zone,
    location.locationId,
    500
  );

  const sceneDesc = typeof scene === 'string' ? scene : (scene.description || 'El escenario se extiende ante ti. El combate es inminente.');
  const loreBlock = lore || 'No hay contexto de mundo disponible.';

  return { sceneDesc, loreBlock, location };
}

function buildNarrativePrompt(actionResult) {
  const { sceneDesc, loreBlock, location } = getNarrativeContext(actionResult);
  const { action, result, context } = actionResult;
  const aliveCount = context.participants || 2;

  const prompt = 'Genera una narracion de combate basada en este resultado:\n\n'
    + 'ENTORNO: ' + sceneDesc + '\n\n'
    + 'LORE DEL MUNDO:\n' + loreBlock + '\n\n'
    + 'COMBATE: Ronda ' + (context.round || 1) + ', Turno #' + (context.turnCount || 1) + '\n'
    + 'PARTICIPANTES VIVOS: ' + aliveCount + '\n\n'
    + 'ACCION:\n'
    + '- Actor: ' + action.actor + ' (' + (context.attacker ? context.attacker.name : action.actor) + ')\n'
    + '- Tipo: ' + action.type + '\n'
    + '- Intencion: ' + action.intent + '\n'
    + '- Zona objetivo: ' + (result.bodyPart || action.targetZone) + '\n'
    + '- Tipo de dano: ' + (result.damageType || 'fisico') + '\n'
    + '- Movimiento #' + (result.moveNumber || 1) + '\n\n'
    + 'RESULTADO:\n'
    + '- Acierto: ' + (result.hit ? 'Si' : 'No') + '\n'
    + '- Dano: ' + (result.damage || 0) + (result.crit ? ' (CRITICO)' : '') + '\n'
    + '- Bloqueado: ' + (result.blocked ? 'Si' : 'No') + '\n'
    + '- Interceptado: ' + (result.intercepted ? 'Si' : 'No') + '\n'
    + '- KO: ' + (result.ko ? 'Si' : 'No') + '\n'
    + (result.bodyPartStatus ? '- Estado de zona: ' + result.bodyPartStatus + '\n' : '')
    + '- Fatiga atacante: ' + (context.attacker ? context.attacker.fatigue || 0 : 0) + '/10\n'
    + (context.defender ? '- Fatiga defensor: ' + (context.defender.fatigue || 0) + '/10\n' : '');

  return prompt;
}

function determineTone(actionResult, extra = {}) {
  const { result, context } = actionResult;
  const { abilityId, shieldAbsorbed, activeEffects } = extra;

  if (result.ko) return 'epic';
  if (result.crit) return 'epic';
  if (result.bodyPartStatus === 'amputated') return 'graphic';
  if (result.bodyPartStatus === 'useless') return 'graphic';
  if (abilityId === 'golpe_de_gracia') return 'epic';
  if (abilityId === 'racha_de_golpes') return 'dynamic';
  if (abilityId === 'defensa_total') return 'dramatic';
  if ((context.attacker && context.attacker.fatigue >= 3) || (context.defender && context.defender.fatigue >= 3)) return 'dramatic';
  if ((result.moveNumber || 1) > 5) return 'dynamic';
  if (context.isBoss) return 'epic';

  if (activeEffects && activeEffects.length > 0) {
    const hazardEffects = activeEffects.filter(e => envEffects.getDamagePerTurn(e) > 0);
    if (hazardEffects.length > 0) return 'grim';
  }

  const location = context.location || {};
  const nsfwZones = ['burdel', 'carcel', 'prision', 'mazmorra', 'fosa', 'gueto', 'templo oscuro'];
  if (location.zone && nsfwZones.some(z => location.zone.toLowerCase().includes(z))) return 'grim';
  if (location.locationId && nsfwZones.some(z => location.locationId.toLowerCase().includes(z))) return 'grim';

  return 'agile';
}

function generateTemplateNarrative(actionResult, extra = {}) {
  const { action, result, context } = actionResult;
  const { abilityId } = extra;
  const location = context.location || {};
  const zoneName = location.zone || '';
  const attacker = context.attacker ? context.attacker.name : 'Alguien';
  const defender = context.defender ? context.defender.name : 'nadie';

  if (abilityId) {
    const targets = defender !== 'nadie' ? defender : 'los enemigos';
    const zone = result.bodyPart || action.targetZone || 'el cuerpo';
    return renderAbility(abilityId, attacker, targets, zone);
  }

  if (result.shieldAbsorbed) {
    return render('shield_absorb', defender, result.shieldAbsorbed);
  }

  if (action.type === 'attack' && result.hit && result.ko) {
    return render('ko_critical', defender, result.bodyPart);
  }
  if (action.type === 'attack' && result.hit && result.crit) {
    return render('attack_crit', attacker, defender, result.bodyPart, zoneName);
  }
  if (action.type === 'attack' && result.hit) {
    return render('attack_hit', attacker, defender, result.bodyPart, zoneName);
  }
  if (action.type === 'attack' && !result.hit) {
    return result.intercepted ? render('intercepted', attacker, defender) : render('attack_miss', attacker, defender, zoneName);
  }
  if (action.type === 'defend') {
    return render('defend', attacker, zoneName);
  }
  if (action.type === 'flee') {
    return result.hit ? render('flee_success', attacker, zoneName) : render('flee_fail', attacker, zoneName);
  }

  return attacker + ' realiza una accion.';
}

async function narrate(actionResult, extra = {}) {
  const systemInstruction = loadSystemPrompt();
  let prompt = buildNarrativePrompt(actionResult);
  const tone = determineTone(actionResult, extra);

  const location = actionResult.context.location || {};
  if (location.locationId) {
    const sceneVersion = getSceneVersion(location.locationId);
    try {
      const scene = getSceneWithEffects(
        location.locationId || 'default',
        location.zone || 'desconocido',
        location.region || 'desconocido',
        sceneVersion || 1,
        location.activeEffects || []
      );
      if (scene && scene.description) {
        prompt = prompt.replace('ENTORNO: ', scene.description);
      }
    } catch {}
  }

  const temperature = tone === 'epic' ? 0.8 : tone === 'graphic' ? 0.75 : tone === 'dramatic' ? 0.7 : tone === 'grim' ? 0.75 : 0.6;

  const providerPreference = 'deepseek';
  const cacheKey = 'narration:' + JSON.stringify({
    hit: actionResult.result.hit,
    damage: actionResult.result.damage,
    bodyPart: actionResult.result.bodyPart,
    crit: actionResult.result.crit,
    blocked: actionResult.result.blocked,
    ko: actionResult.result.ko,
    abilityId: extra.abilityId || null,
  });

  try {
    const narrative = await orchestrator.generateText({
      prompt,
      systemInstruction,
      temperature,
      providerPreference,
      bypassCache: true,
    });

    return {
      narrative: (narrative || '').trim(),
      narrationType: 'ai',
      tone,
      warning: null,
      infractions: [],
    };
  } catch (err) {
    const templateNarrative = generateTemplateNarrative(actionResult, extra);
    return {
      narrative: templateNarrative,
      narrationType: 'template',
      tone: 'template',
      warning: 'Narrador IA no disponible: ' + err.message,
      infractions: [],
    };
  }
}

function invalidateSceneNarrative(locationId) {
  const { invalidateScene } = require('./sceneCache');
  invalidateScene(locationId);
}

function getToneLabel(tone) {
  const labels = {
    epic: 'Epico',
    graphic: 'Grafico',
    dramatic: 'Dramatico',
    dynamic: 'Dinamico',
    grim: 'Sombrrio',
    agile: 'Agil',
    template: 'Plantilla',
  };
  return labels[tone] || 'Neutral';
}

module.exports = {
  narrate,
  buildNarrativePrompt,
  determineTone,
  generateTemplateNarrative,
  loadSystemPrompt,
  reloadSystemPrompt,
  invalidateSceneNarrative,
  getNarrativeContext,
  getToneLabel,
};
