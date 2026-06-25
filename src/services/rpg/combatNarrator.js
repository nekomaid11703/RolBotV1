const fs = require('fs');
const path = require('path');
const orchestrator = require('../ai/aiOrchestrator');
const { getSceneForNarrative, invalidateScene } = require('./sceneCache');
const { getLoreContext, getLoreByKeyword } = require('./worldLore');
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
  const scene = getSceneForNarrative(
    context.locationId,
    context.zoneName,
    context.loreContext
  );

  const lore = getLoreContext(800);

  const prompt = `Genera una narración de combate basada en este resultado:

ESCENARIO: ${scene.description}

CONTEXTO DEL MUNDO:
${lore ? lore : 'No hay contexto de mundo disponible.'}

ACCIÓN:
- Actor: ${action.actor} (${context.attacker.name})
- Tipo: ${action.type}
- Intención: ${action.intent}
- Zona objetivo: ${action.targetZone}
- Daño: ${action.damageType}
- Movimiento #${context.moveNumber}

RESULTADO:
- Acierto: ${result.hit ? 'Sí' : 'No'}
- Daño: ${result.damage}
- Zona afectada: ${result.bodyPart}
- Crítico: ${result.crit ? 'Sí' : 'No'}
- Bloqueado: ${result.blocked ? 'Sí' : 'No'}
- KO: ${result.ko ? 'Sí' : 'No'}
- Fatiga atacante: ${context.attacker.fatiga}/5
- Fatiga defensor: ${context.defender.fatiga}/5

Narra el resultado en 1-3 oraciones.`;

  return prompt;
}

function determineTone(actionResult) {
  const { result, context } = actionResult;

  if (result.ko) return 'epic';
  if (result.crit) return 'epic';
  if (context.attacker.fatiga >= 3 || context.defender.fatiga >= 3) return 'dramatic';
  if (context.moveNumber > 5) return 'dynamic';
  if (context.isBoss) return 'epic';
  return 'agile';
}

async function narrate(actionResult) {
  const systemInstruction = loadSystemPrompt();
  const prompt = buildNarrativePrompt(actionResult);
  const tone = determineTone(actionResult);

  const temperature = tone === 'epic' ? 0.8 : tone === 'dramatic' ? 0.7 : 0.6;

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
  const attacker = action.actor === 'player' ? context.attacker.name : context.defender.name;
  const defender = action.actor === 'player' ? context.defender.name : context.attacker.name;

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
    return render('attack_miss', attacker, defender);
  }
  if (action.type === 'defend') {
    return result.hit ? render('defend_block', context.attacker.name, context.defender.name) : render('defend', attacker);
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
