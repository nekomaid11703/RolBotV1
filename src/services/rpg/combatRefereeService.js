const orchestrator = require('../ai/aiOrchestrator');
const combatEngine = require('./combatEngine');
const combatParser = require('./combatParser');
const combatValidator = require('./combatValidator');
const combatNarrator = require('./combatNarrator');
const turnManager = require('./combatTurnManager');
const stateManager = require('./combatStateManager');
const envEffects = require('./environmentalEffects');
const outputValidator = require('./narratorOutputValidator');
const itemsData = require('./items');
const invService = require('./inventoryService');
const abilities = require('./abilities');
const abilityEngine = require('./abilityEngine');
const { getContextualLore } = require('./worldLore');
const { getSceneWithEffects, getSceneVersion, incrementEffectBurn } = require('./sceneCache');
const { CombatBuffer } = require('./combatBuffer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLASSIFICATION_PROMPT = fs.readFileSync(path.join(__dirname, 'narrativePrompts', 'classification.prompt.md'), 'utf8');
const SYSTEM_PROMPT_PATH = path.join(__dirname, 'narrativePrompts', 'combat.system.md');
const CACHE_TTL = 30000;
const MAX_CACHE_SIZE = 20;

const PREP_KEYWORDS = ['preparo', 'prepara', 'preparando', 'prepararme', 'miro', 'mira', 'mirando', 'observo', 'observa', 'observando', 'analizo', 'analiza', 'analizando', 'examino', 'examina', 'examinando', 'reviso', 'revisa', 'revisando', 'busco', 'busca', 'buscando', 'espero', 'espera', 'esperando', 'pienso', 'piensa', 'pensando', 'medito', 'medita', 'meditando', 'planeo', 'planea', 'planeando', 'considero', 'considera', 'considerando', 'reconozco', 'reconoce', 'reconociendo', 'estudio', 'estudia', 'estudiando', 'inspecciono', 'inspecciona', 'inspeccionando', 'evalúo', 'evalua', 'evaluando', 'exploro', 'explora', 'explorando'];
const ATTACK_VERBS = ['ataco', 'ataca', 'atacando', 'golpeo', 'golpea', 'golpeando', 'apuñalo', 'apuñala', 'apuñalando', 'corto', 'corta', 'cortando', 'disparo', 'dispara', 'disparando', 'lanzo', 'lanza', 'lanzando', 'embisto', 'embiste', 'embistiendo', 'impacto', 'impacta', 'impactando', 'asesino', 'asesina', 'asesinando', 'decapito', 'decapita', 'decapitando', 'reban', 'rebanar'];
const IMPERATIVE_DIALOGUE = /^(aléjate|alejate|ríndete|rindete|cállate|callate|detente|quieto|suelta|para|espera|ven|vamos|muévete|muevete|quiero|necesito|ayuda|por favor|no\s*|si\s*)/i;
const llmCache = new Map();
const playerCacheKeys = new Map();

function getCacheKey(ctx) {
  const raw = `${ctx.room?.id || ''}:${ctx.participant?.id || ''}:${ctx.room?.stateVersion || 0}:${ctx.text}`;
  return crypto.createHash('md5').update(raw).digest('hex');
}

function setPlayerCacheEntry(roomId, playerId, cacheKey, entry) {
  const playerKey = `${roomId}:${playerId}`;
  const oldKey = playerCacheKeys.get(playerKey);
  if (oldKey && oldKey !== cacheKey) {
    llmCache.delete(oldKey);
  }
  playerCacheKeys.set(playerKey, cacheKey);
  llmCache.set(cacheKey, entry);
}

function pruneCache() {
  if (llmCache.size <= MAX_CACHE_SIZE) return;
  const entries = [...llmCache.entries()].sort((a, b) => a[1].ts - b[1].ts);
  const toDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE);
  for (const [key] of toDelete) llmCache.delete(key);
}

function loadSystemPrompt() {
  try {
    return fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf8');
  } catch {
    return 'Eres el árbitro de combate. Analiza el texto de rol del jugador y determina si es válido.';
  }
}

function buildRefereeContext(ctx) {
  const { room, participant, text } = ctx;
  const inv = ctx.inventory || { items: [], equipped: {} };
  const location = room.location || {};

  const equippedList = [];
  for (const [slot, itemId] of Object.entries(inv.equipped)) {
    if (itemId) {
      const item = itemsData.getItem(itemId);
      if (item) equippedList.push(`${item.name} (${slot})`);
    }
  }

  const invList = [];
  for (const stack of inv.items) {
    const item = itemsData.getItem(stack.itemId);
    if (item) {
      const dur = stack.durability !== undefined ? ` [dur:${stack.durability}/${item.resistencia}]` : '';
      invList.push(`${item.name} x${stack.quantity}${dur}`);
    }
  }

  const alivePlayers = turnManager.getAliveParticipants(room, 'players');
  const aliveEnemies = turnManager.getAliveParticipants(room, 'enemies');

  const sceneVersion = getSceneVersion(location.locationId) || 1;
  let sceneDesc = '';
  try {
    const scene = getSceneWithEffects(
      location.locationId || 'default',
      location.zone || 'desconocido',
      location.region || 'desconocido',
      sceneVersion,
      room.activeEffects
    );
    sceneDesc = typeof scene === 'string' ? scene : (scene.description || '');
  } catch {
    sceneDesc = '';
  }

  const lore = getContextualLore(location.region, location.zone, location.locationId, 500);

  const bodyPartsSummary = Object.entries(participant.bodyParts || {})
    .filter(([_, hp]) => hp <= 3)
    .map(([zone, hp]) => `${zone} (${hp} HP)`)
    .join(', ') || 'Ninguna zona crítica';

  return {
    EQUIPO: equippedList.length > 0 ? equippedList.join(', ') : 'Ninguno',
    INVENTARIO: invList.length > 0 ? invList.join(', ') : 'Vacío',
    ZONAS_CRITICAS: bodyPartsSummary,
    PARTICIPANTES_VIVOS: room.participants.filter(p => !p.ko).map(p =>
      `- ${p.id === participant.id ? '(TU)' : ''} ${p.name} (${p.team}): HP ${p.hp}/${p.maxHp}, Fatiga ${p.fatigue || 0}/10${p.ko ? ' [KO]' : ''}`
    ).join('\n'),
    JUGADORES_VIVOS: alivePlayers.map(p => p.name).join(', '),
    ENEMIGOS_VIVOS: aliveEnemies.map(p => `${p.name} (HP ${p.hp}/${p.maxHp})`).join(', '),
    TURNO_ACTUAL: participant.name,
    RONDA: room.round || 1,
    TURNO_NUMERO: room.turnCount || 1,
    ESCENARIO: sceneDesc,
    LORE: lore || 'No hay contexto de mundo.',
    ZONA: location.zone || 'desconocida',
    REGION: location.region || 'desconocida',
    EFFECTS_ACTIVOS: room.activeEffects ? envEffects.getActiveEffectsDescription(room.activeEffects) : 'Ninguno',
    EFFECTS_REGISTRY: envEffects.EFFECTS_REGISTRY.map(e => `- ${e.id}: ${e.desc} (condiciones: ${Object.keys(e.conditions).join(', ')})${e.damagePerTurn ? ` [${e.damagePerTurn} daño/turno]` : ''}`).join('\n'),
    COMBINED_EFFECTS: Object.values(envEffects.COMBINED_EFFECTS).map(ce => `- ${ce.id}: ${ce.desc} (requiere ${ce.id.split('+').join(' + ')})${ce.damagePerTurn ? ` [${ce.damagePerTurn} daño/turno]` : ''}`).join('\n'),
    EFFECT_BURN: room.activeEffects ? `Turnos con estos efectos activos: ${incrementEffectBurn(ctx.room.location?.locationId || 'default', room.activeEffects)}` : '',
    ABILITIES_AVAILABLE: abilities.getAvailableAbilities(participant).join('\n') || 'Ninguna disponible',
    ABILITIES_REGISTRY: abilities.ABILITIES_REGISTRY.map(a =>
      `- ${a.id} (${a.name}): ${a.description} [Tier ${a.tier}, ${a.cost.fulgor > 0 ? a.cost.fulgor + ' fulgor' : ''}${a.cost.fatigue > 0 ? (a.cost.fulgor > 0 ? ' + ' : '') + a.cost.fatigue + ' fatiga' : ''}, cd: ${a.cooldown}]`
    ).join('\n'),
    ACTIVE_BUFFS: abilities.getActiveBuffsDescription(participant),
    FULGOR: `${participant.fulgor || 0}/${participant.maxFulgor || 50}`,
    FATIGA: `${participant.fatigue || 0}/10`,
  };
}

function buildRefereePrompt(ctx) {
  const c = buildRefereeContext(ctx);
  return [
    '## CONTEXTO DEL COMBATE',
    '',
    `Ronda: ${c.RONDA} | Turno #${c.TURNO_NUMERO}`,
    `Ubicación: ${c.ZONA} (${c.REGION})`,
    `Escenario: ${c.ESCENARIO}`,
    '',
    `Turno actual: ${c.TURNO_ACTUAL}`,
    '',
    '### Participantes Vivos',
    c.PARTICIPANTES_VIVOS,
    '',
    '### Equipo del Personaje',
    c.EQUIPO,
    '',
    '### Inventario del Personaje',
    c.INVENTARIO,
    '',
    '### Zonas Corporales Dañadas',
    c.ZONAS_CRITICAS,
    '',
    '### Efectos Ambientales Activos',
    c.EFFECTS_ACTIVOS,
    '',
    c.EFFECT_BURN,
    '',
    '### Efectos Combinados (cuando dos efectos activos coexisten)',
    c.COMBINED_EFFECTS,
    '',
    '### Habilidades del Personaje',
    'Tus habilidades disponibles (según stats, fulgor y fatiga):',
    c.ABILITIES_AVAILABLE,
    '',
    '### Registro Completo de Habilidades',
    c.ABILITIES_REGISTRY,
    '',
    '### Buffs/Debuffs Activos',
    c.ACTIVE_BUFFS,
    '',
    '### Fulgor y Fatiga',
    `Fulgor: ${c.FULGOR} | Fatiga: ${c.FATIGA}`,
    '',
    '### Tono Narrativo',
    'Genera la narracion en un tono que refleje la gravedad del momento. Usa tono epico para KOs y criticos, dramatico cuando hay fatiga alta, sombrio en entornos hostiles, agil para acciones normales.',
    'La narracion debe ser INMERSIVA pero CONCISA (1-2 oraciones). Describe la INTENCION y el MOVIMIENTO, no el resultado mecanico.',
    'Incluye referencias sutiles al entorno cuando sea relevante.',
    '',
    '### Registro de Efectos Ambientales Disponibles',
    c.EFFECTS_REGISTRY,
    '',
    '### Lore del Mundo',
    c.LORE,
    '',
    '## TEXTO DEL JUGADOR (rol)',
    '',
    ctx.text,
    '',
    '---',
    'Responde SOLO con el JSON especificado en las instrucciones. Sin texto adicional.',
  ].join('\n');
}

function logRefereeDecision(entry) {
  const log = [
    `[REFEREE] room=${entry.roomId} player=${entry.playerName} turn=${entry.turnCount}`,
    `  text="${entry.text.slice(0, 80)}"`,
    `  source=${entry.source} valid=${entry.valid} cb=${entry.cartaBlanca}`,
    `  action=${entry.actionType} infractions=${entry.infractionCount}`,
    entry.cartaBlanca ? `  carta_blanca: ${entry.infractionDetails}` : '',
    entry.errors ? `  errors: ${entry.errors}` : '',
  ].filter(Boolean).join('\n');
  console.log(log);
}

async function processRoleplay(text, room, participant, inventory) {
  const expired = envEffects.reduceEffectDurations(room);
  if (expired.length > 0) {
    envEffects.removeExpiredEffects(room);
    console.log(`[REFEREE] Expired effects removed: ${expired.join(', ')}`);
  }
  const dotApplied = envEffects.applyDotToParticipants(room);
  if (dotApplied) {
    console.log(`[REFEREE] DOT applied to all participants in room ${room.id}`);
  }
  const ctx = { text, room, participant, inventory };

  // Feature Flag: Pipeline multi-model
  if (FEATURE_FLAG_PIPELINE) {
    console.log(`[PIPELINE] Intentando pipeline multi-model (text: "${text.slice(0, 50)}...")`);
    const buffer = new CombatBuffer(ctx);
    const pipelineResult = await processRoleplayPipeline(buffer);
    if (!pipelineResult.error) {
      console.log(`[PIPELINE] Exitoso. Modelos usados: ${JSON.stringify(buffer.modelsUsed)}`);
      return pipelineResult;
    }
    console.log(`[PIPELINE] Fallo completo: ${pipelineResult.error}. Cayendo a legacy.`);
  }

  const systemPrompt = loadSystemPrompt();
  const prompt = buildRefereePrompt(ctx);
  const cacheKey = getCacheKey(ctx);

  const cached = llmCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    const validation = outputValidator.validateOutput(cached.data);
    if (validation.valid) {
      return await executeValidatedOutput(cached.data, ctx);
    }
    llmCache.delete(cacheKey);
  }

  try {
    console.log(`[REFEREE] Calling LLM (providerPreference: deepseek, text: "${ctx.text.slice(0, 50)}...")`);
    const startTime = Date.now();
    const rawResponse = await orchestrator.generateText({
      prompt,
      systemInstruction: systemPrompt,
      temperature: 0.3,
      providerPreference: 'deepseek',
      bypassCache: true,
    });
    console.log(`[REFEREE] LLM response received in ${Date.now() - startTime}ms`);

    const parsed = parseLLMResponse(rawResponse);
    if (parsed.error) {
      return await fallbackProcess(text, room, participant);
    }

    const coherence = validateCoherence(parsed, ctx);
    if (!coherence.coherent) {
      parsed.coherent = false;
      parsed.coherence_issues = (parsed.coherence_issues || []).concat(coherence.issues);
    }

    // If coherence fails for semantic reasons, return issues to user instead of executing
    if (!coherence.coherent && coherence.issues.length > 0) {
      const semantico = coherence.issues.find(i =>
        i.includes('acción describe preparación') ||
        i.includes('principalmente diálogo') ||
        i.includes('No debería clasificarse como ataque')
      );
      if (semantico) {
        logRefereeDecision({
          roomId: room.id, playerName: participant.name, turnCount: room.turnCount,
          text, source: 'llm_semantic', valid: false, cartaBlanca: false,
          actionType: parsed.mechanics?.action_type || 'unknown',
          infractionCount: 0, errors: coherence.issues.join('; '),
        });
        return {
          success: false,
          narrative: `⚠️ *Incoherencia semántica detectada:*\n${coherence.issues.map(i => `• ${i}`).join('\n')}\n\nVuelve a intentar con /rol describiendo claramente tu acción.`,
          mechanical: '',
          actionResult: null, cartaBlanca: false, infractions: [],
        };
      }
    }

    const validation = outputValidator.validateOutput(parsed);
    if (validation.valid) {
      setPlayerCacheEntry(room.id, participant.id, cacheKey, { data: parsed, ts: Date.now() });
      pruneCache();

      const result = await executeValidatedOutput(parsed, ctx);
      logRefereeDecision({
        roomId: room.id, playerName: participant.name, turnCount: room.turnCount,
        text, source: 'llm', valid: true, cartaBlanca: result.cartaBlanca,
        actionType: parsed.mechanics?.action_type || 'unknown',
        infractionCount: (parsed.infractions || []).length,
        infractionDetails: JSON.stringify(parsed.infractions || []),
      });
      return result;
    }

    logRefereeDecision({
      roomId: room.id, playerName: participant.name, turnCount: room.turnCount,
      text, source: 'llm_invalid', valid: false, cartaBlanca: false,
      actionType: 'fallback', infractionCount: 0, errors: validation.errors.join('; '),
    });

    return await fallbackProcess(text, room, participant);
  } catch (err) {
    logRefereeDecision({
      roomId: room.id, playerName: participant.name, turnCount: room.turnCount,
      text, source: 'llm_error', valid: false, cartaBlanca: false,
      actionType: 'fallback', infractionCount: 0, errors: err.message,
    });
    return await fallbackProcess(text, room, participant);
  }
}

function parseLLMResponse(raw) {
  if (!raw || typeof raw !== 'string') {
    return { error: 'Respuesta vacía de la IA.' };
  }

  const parsed = outputValidator.fuzzyParseJSON(raw);
  if (parsed) return parsed;

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { error: 'JSON extraído no válido.', raw: raw.slice(0, 200) };
    }
  }

  return { error: 'No se encontró JSON en la respuesta.', raw: raw.slice(0, 200) };
}

function validateCoherence(data, ctx) {
  const issues = [];
  const { participant, inventory, room, text } = ctx;
  const mechanics = data.mechanics || {};

  const ac = mechanics.action_type;

  // Semantic check: preparation/observation text classified as attack
  if (ac === 'attack') {
    const lowerText = (text || '').toLowerCase();
    const lowerAccion = ((data.layers?.accion) || '').toLowerCase();
    const lowerMembrete = ((data.layers?.membrete) || '').toLowerCase();

    const foundPrep = PREP_KEYWORDS.find(kw => lowerText.includes(kw));
    if (foundPrep && !ATTACK_VERBS.find(av => lowerText.includes(av))) {
      issues.push(`La acción describe preparación/observación ("${foundPrep}...") pero está clasificada como ataque. Si no hay intención ofensiva explícita, usa transition o interact.`);
    }

    // Dialogue-only text classified as attack
    const dialogueCount = data.dialogue_count || 0;
    const accionEmpty = !lowerAccion || lowerAccion.trim() === '';
    const hasAttackVerb = ATTACK_VERBS.find(av => lowerText.includes(av));
    if (!hasAttackVerb && dialogueCount > 0 && accionEmpty) {
      issues.push('El texto es principalmente diálogo sin una acción ofensiva concreta. No debería clasificarse como ataque.');
    }
  }

  if (['attack', 'defend'].includes(ac)) {
    const weaponId = inventory.equipped?.arma;
    if (ac === 'attack' && !weaponId && itemsData.findItemByName(mechanics.weapon || '')) {
      const found = itemsData.findItemByName(mechanics.weapon);
      if (found && found.type === 'arma') {
        issues.push(`Tienes "${found.name}" en inventario pero no está equipada. Usa /rol para equiparla primero.`);
      } else if (mechanics.weapon && !weaponId) {
        issues.push('No tienes un arma equipada. Puedes atacar sin arma (daño reducido) o equipar una.');
      }
    }
  }

  if (ac === 'use_item' && mechanics.weapon) {
    const item = itemsData.findItemByName(mechanics.weapon);
    if (!item) {
      issues.push(`"${mechanics.weapon}" no es un item válido.`);
    } else if (item.type === 'consumible') {
      const stack = inventory.items.find(i => i.itemId === item.id);
      if (!stack || stack.quantity < 1) {
        issues.push(`No tienes "${item.name}" en tu inventario.`);
      }
    } else if (item.type === 'arma' || item.type === 'armadura') {
      issues.push(`"${item.name}" no es consumible. No puedes usarlo directamente.`);
    }
  }

  if (mechanics.zone) {
    const bp = participant.bodyParts || {};
    const validZones = outputValidator.VALID_ZONES;
    if (validZones.includes(mechanics.zone) && (bp[mechanics.zone] !== undefined && bp[mechanics.zone] <= 0)) {
      issues.push(`Tu ${mechanics.zone} está amputada/inutilizada. No puedes usarla para esta acción.`);
    }
  }

  const participantHasFulgor = (participant.fulgor || 0) <= 0;
  if (data.damage_type === 'magico' && participantHasFulgor) {
    issues.push('No tienes fulgor suficiente para un ataque mágico.');
  }

  if (data.environmental_effect) {
    const valid = envEffects.validateEffectSelection(data.environmental_effect, room.location);
    if (!valid) {
      issues.push(`El efecto "${data.environmental_effect}" no es aplicable en esta ubicación.`);
    }
  }

  if (participant.stunned && ac !== 'defend') {
    issues.push('Estás aturdido. Solo puedes defenderte este turno.');
  }

  if (data.ability_id) {
    const ability = abilities.getAbility(data.ability_id);
    if (!ability) {
      issues.push(`Habilidad "${data.ability_id}" no existe en el registro.`);
    } else {
      const check = abilities.canUseAbility(participant, data.ability_id);
      if (!check.canUse) {
        issues.push(check.reason);
      }
      if (check.requiresTarget && !mechanics.target_id) {
        issues.push(`${ability.name} requiere un objetivo específico (target_id).`);
      }
      if (ability.conditions && ability.conditions.target_hp_under && mechanics.target_id) {
        const target = room.participants.find(p => p.id === mechanics.target_id);
        if (target && !target.ko) {
          const ratio = target.hp / (target.maxHp || target.hp || 100);
          if (ratio > ability.conditions.target_hp_under) {
            issues.push(`${ability.name} solo funciona contra objetivos debilitados (<${Math.round(ability.conditions.target_hp_under * 100)}% HP). ${target.name} tiene ${Math.round(ratio * 100)}% HP.`);
          }
        }
      }
    }
  }

  if (data.dialogue_count > 2 && !data.dialogue_as_action) {
    data.dialogue_as_action = true;
    issues.push('El diálogo excede 2 líneas — consume tu acción.');
  }

  return { coherent: issues.length === 0, issues };
}

async function executeValidatedOutput(data, ctx) {
  const { room, participant, inventory, text } = ctx;

  if (data.infractions && data.infractions.length > 0) {
    return await handleCartaBlanca(data, ctx);
  }

  const mechanics = data.mechanics || {};
  let actionResult = null;
  let abilityResult = null;

  if (data.ability_id) {
    abilityResult = await abilityEngine.executeAbility(
      room, participant,
      mechanics.target_id || null,
      data.ability_id,
      {
        zone: mechanics.zone || 'pecho',
        damageType: data.damage_type || undefined,
        damageProgression: data.skill_effects?.damageProgression || null,
      }
    );
    if (abilityResult.error) return { error: abilityResult.error };

    applyEnvironmentalEffect(data, room, participant);
    actionResult = abilityResult.effects?.find(e => e.actionResult)?.actionResult || null;

    const narrativeText = data.narrative || `Usa *${abilityResult.abilityName}*.`;
    const mechanicalMsg = abilityEngine.formatAbilityResult(abilityResult);

    if (abilityResult.abilityId === 'defensa_total' || abilityResult.abilityId === 'curarse' || abilityResult.abilityId === 'barrera_de_fulgor' || abilityResult.abilityId === 'impulso') {
      return {
        success: true,
        narrative: narrativeText,
        mechanical: mechanicalMsg,
        actionResult,
        cartaBlanca: false,
        infractions: data.infractions || [],
        environmentalEffect: data.environmental_effect || null,
        abilityResult,
      };
    }
  }

  if (!abilityResult) {
    switch (mechanics.action_type) {
      case 'attack': {
        const lowerText = (ctx.text || '').toLowerCase();
        const hasAttackVerb = ATTACK_VERBS.find(av => lowerText.includes(av));
        let targetJid = mechanics.target_id || null;
        if (!targetJid) {
          if (!hasAttackVerb) {
            return { error: 'No se detectó un ataque explícito en tu texto. Describe claramente tu golpe, corte o embestida.' };
          }
          const aliveEnemies = turnManager.getAliveParticipants(room, 'enemies');
          if (aliveEnemies.length > 0) targetJid = aliveEnemies[0].id;
        }
        if (!targetJid) {
          return { error: 'No hay objetivo disponible.' };
        }

        const zone = mechanics.zone || 'pecho';
        const options = {
          moveNumber: mechanics.move_number || 1,
          damageType: data.damage_type || undefined,
        };

        actionResult = await combatEngine.processAttack(room, participant.id, targetJid, zone, options);
        if (actionResult.error) return { error: actionResult.error };

        applyEnvironmentalEffect(data, room, participant);
        break;
      }

    case 'defend': {
      participant.defending = true;
      combatEngine.applyFatigue(participant);
      actionResult = await combatEngine.processDefend(room, participant.id);
      break;
    }

    case 'flee': {
      actionResult = await combatEngine.processFlee(room, participant.id);
      break;
    }

    case 'use_item': {
      const weapon = mechanics.weapon;
      if (weapon) {
        const item = itemsData.findItemByName(weapon);
        if (item && item.type === 'consumible') {
          const stack = inventory.items.find(i => i.itemId === item.id);
          if (stack && stack.quantity > 0) {
            if (item.efecto === 'cura' && item.potencia) {
              const vidaAntes = participant.hp;
              participant.hp = Math.min(participant.maxHp, participant.hp + item.potencia);
              await invService.removeItem(participant.id, item.id, 1);
              await stateManager.updateRoom(room.id, {});
              return {
                success: true,
                narrative: `Usaste ${item.name}. Vida: ${vidaAntes} → ${participant.hp}.`,
                mechanical: `💚 +${participant.hp - vidaAntes} HP`,
                actionResult: null,
                cartaBlanca: false,
                infractions: [],
              };
            }
            if (item.efecto === 'estabiliza') {
              let estabilizado = false;
              for (const [zone, hp] of Object.entries(participant.bodyParts)) {
                if (hp <= 0) { participant.bodyParts[zone] = 1; estabilizado = true; }
              }
              await invService.removeItem(participant.id, item.id, 1);
              await stateManager.updateRoom(room.id, {});
              return {
                success: true,
                narrative: estabilizado ? `Usaste ${item.name}. Zonas estabilizadas.` : `Usaste ${item.name}, pero no tenías zonas amputadas.`,
                mechanical: estabilizado ? '🩹 Zonas estabilizadas' : 'Sin efecto',
                actionResult: null, cartaBlanca: false, infractions: [],
              };
            }
            if (item.efecto === 'repara' && item.potencia) {
              let reparado = false;
              for (const [slot, itemId] of Object.entries(inventory.equipped)) {
                if (!itemId) continue;
                const eqItem = itemsData.getItem(itemId);
                if (eqItem && eqItem.resistencia) {
                  const stack = inventory.items.find(i => i.itemId === itemId);
                  const currentDur = stack ? (stack.durability ?? eqItem.resistencia) : eqItem.resistencia;
                  if (currentDur < eqItem.resistencia) {
                    const newDur = Math.min(eqItem.resistencia, currentDur + item.potencia);
                    if (!stack) inventory.items.push({ itemId, quantity: 0 });
                    inventory.items.find(i => i.itemId === itemId).durability = newDur;
                    reparado = true;
                    break;
                  }
                }
              }
              await invService.removeItem(participant.id, item.id, 1);
              await invService.saveInventory(participant.id, inventory);
              await stateManager.updateRoom(room.id, {});
              const repairMsg = reparado ? `Usaste ${item.name}. Resistencia restaurada.` : `Usaste ${item.name}, pero todo tu equipo está en buen estado.`;
              return {
                success: true, narrative: repairMsg, mechanical: reparado ? '🔧 Equipo reparado' : 'Sin efecto',
                actionResult: null, cartaBlanca: false, infractions: [],
              };
            }
            if (item.efecto === 'fulgor' && item.potencia) {
              const fulgorAntes = participant.fulgor || 0;
              participant.fulgor = Math.min(participant.maxFulgor || 50, fulgorAntes + item.potencia);
              await invService.removeItem(participant.id, item.id, 1);
              await stateManager.updateRoom(room.id, {});
              return {
                success: true,
                narrative: `Usaste ${item.name}. Fulgor: ${fulgorAntes} → ${participant.fulgor}.`,
                mechanical: `✨ +${participant.fulgor - fulgorAntes} Fulgor`,
                actionResult: null, cartaBlanca: false, infractions: [],
              };
            }
          }
        }
      }
      return { error: `No puedes usar "${weapon}" ahora.` };
    }

    case 'transition': {
      participant.fatigue = Math.min(10, (participant.fatigue || 0) + 1);
      await stateManager.updateRoom(room.id, {});
      return {
        success: true,
        narrative: data.narrative || 'Realizas una acción auxiliar.',
        mechanical: '🔄 Acción auxiliar (+1 fatiga)',
        actionResult: null, cartaBlanca: false, infractions: [],
      };
    }

    case 'interact': {
      participant.fatigue = Math.min(10, (participant.fatigue || 0) + 1);
      await stateManager.updateRoom(room.id, {});
      return {
        success: true,
        narrative: data.narrative || 'Interactúas con el entorno.',
        mechanical: '🤝 Interacción',
        actionResult: null, cartaBlanca: false, infractions: [],
      };
    }

    default: {
      return await fallbackProcess(text, room, participant);
    }
  }
  }

  if (!actionResult) {
    return await fallbackProcess(text, room, participant);
  }

  if (!actionResult.result) {
    return { error: 'Error procesando acción.' };
  }

  let narrativeText = data.narrative || combatNarrator.generateTemplateNarrative(actionResult, { abilityId: data.ability_id || undefined });
  let mechanicalMsg = combatEngine.formatActionResult(actionResult);

  if (abilityResult) {
    const abilityLine = abilityEngine.formatAbilityResult(abilityResult);
    mechanicalMsg = abilityLine + '\n' + mechanicalMsg;
    narrativeText = data.narrative || combatNarrator.generateTemplateNarrative(actionResult, { abilityId: data.ability_id });
  }

  return {
    success: true,
    narrative: narrativeText,
    mechanical: mechanicalMsg,
    actionResult,
    cartaBlanca: false,
    infractions: data.infractions || [],
    environmentalEffect: data.environmental_effect || null,
    abilityResult,
  };
}

async function handleCartaBlanca(data, ctx) {
  const { room, participant } = ctx;
  const infractions = data.infractions || [];
  const infractionDescriptions = infractions.map(i => `• ${i.type}: ${i.description}`).join('\n');

  participant.fatigue = Math.min(10, (participant.fatigue || 0) + 3);
  participant.stunned = true;

  await stateManager.updateRoom(room.id, {});

  logRefereeDecision({
    roomId: room.id, playerName: participant.name, turnCount: room.turnCount,
    text: ctx.text, source: 'carta_blanca', valid: false, cartaBlanca: true,
    actionType: 'none', infractionCount: infractions.length,
    infractionDetails: infractions.map(i => `${i.type}:${i.description}`).join(' | '),
  });

  return {
    success: false,
    cartaBlanca: true,
    narrative: `Tu acción ha sido anulada por carta en blanco.\n\nInfracción(es) detectada(s):\n${infractionDescriptions}\n\nHas perdido tu turno y estás aturdido. El defensor tiene una acción libre.`,
    mechanical: '⛔ CARTA EN BLANCO — Turno anulado, aturdido +3 fatiga',
    actionResult: null,
    infractions,
    cartaBlancaTarget: data.mechanics?.target_id || null,
  };
}

function applyEnvironmentalEffect(data, room, participant) {
  const effectId = data.environmental_effect;
  if (!effectId) return;

  const valid = envEffects.validateEffectSelection(effectId, room.location);
  if (!valid) return;

  if (!room.activeEffects) room.activeEffects = [];
  if (!room.activeEffects.includes(effectId)) {
    room.activeEffects.push(effectId);
    if (!room.effectDurations) room.effectDurations = {};
    const dur = envEffects.getEffectDuration(effectId);
    if (dur > 0) room.effectDurations[effectId] = dur;
  }

  const dpt = envEffects.getDamagePerTurn(effectId);
  if (dpt > 0) {
    participant.hp = Math.max(1, (participant.hp || 100) - dpt);
  }
}

async function fallbackProcess(text, room, participant) {
  console.log(`[REFEREE] FALLBACK PATH — LLM no disponible, usando regex+parser (text: "${text.slice(0, 50)}...")`);
  const layers = extractLayers(text);
  const actionText = layers.accion || text;

  const parsed = combatParser.parse(actionText, { room, sender: participant.id });
  const vResult = combatValidator.validate(actionText, { parsed, room, participant });

  if (vResult.infractions.length > 0) {
    const fallbackCtx = { text, room, participant };
    const cartaData = {
      infractions: vResult.infractions,
      mechanics: { target_id: parsed.target || null },
    };
    return await handleCartaBlanca(cartaData, fallbackCtx);
  }

  const zone = parsed.zone || 'pecho';
  let targetJid = parsed.target;
  if (!targetJid) {
    const aliveEnemies = turnManager.getAliveParticipants(room, 'enemies');
    targetJid = aliveEnemies.length > 0 ? aliveEnemies[0].id : null;
  }

  if (!targetJid) {
    return { error: 'No hay objetivo disponible.' };
  }

  let actionResult;

  if (parsed.intent === 'defensivo') {
    actionResult = await combatEngine.processDefend(room, participant.id);
  } else if (parsed.intent === 'retirada') {
    actionResult = await combatEngine.processFlee(room, participant.id);
  } else if (parsed.intent === 'interact') {
    participant.fatigue = Math.min(10, (participant.fatigue || 0) + 1);
    await stateManager.updateRoom(room.id, {});
    return {
      success: true,
      narrative: `Observas el entorno con atención. El escenario se despliega ante ti, listo para ser explorado.`,
      mechanical: '👀 Observación (+1 fatiga)',
      actionResult: null, cartaBlanca: false, infractions: [],
    };
  } else {
    actionResult = await combatEngine.processAttack(room, participant.id, targetJid, zone, {
      moveNumber: parsed.moveNumber || 1,
    });
  }

  if (actionResult.error) return { error: actionResult.error };

  const narrative = await combatNarrator.narrate(actionResult, { activeEffects: room.activeEffects });
  const mechanicalMsg = combatEngine.formatActionResult(actionResult);

  return {
    success: true,
    narrative: narrative.narrative,
    mechanical: mechanicalMsg,
    actionResult,
    cartaBlanca: false,
    infractions: [],
    narrationType: narrative.narrationType || 'fallback',
    tone: combatNarrator.getToneLabel ? combatNarrator.getToneLabel(narrative.tone) : undefined,
  };
}

function extractLayers(text) {
  const quoteMatch = text.match(/"([^"]+)"/);
  let dialogo = quoteMatch ? quoteMatch[1] : '';

  // Detect imperative dialogue without quotes (commands directed at someone)
  if (!dialogo) {
    const lines = text.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const trimmed = line.trim().replace(/^[\*\~_\-\s]+/, '');
      if (IMPERATIVE_DIALOGUE.test(trimmed)) {
        dialogo = (dialogo ? dialogo + '\n' : '') + trimmed;
      }
    }
  }

  const actionVerbs = ['ataco', 'golpeo', 'corro', 'salto', 'esquivo', 'bloqueo',
    'defiendo', 'uso', 'sac', 'tomo', 'busco', 'apunto', 'disparo', 'lanzo',
    'cargo', 'empujo', 'tiro', 'agarr', 'cubr', 'proteg', 'retroced'];
  const lines = text.split('\n').filter(l => l.trim());
  let membrete = '';
  let accion = '';

  if (lines.length > 0) {
    const first = lines[0].toLowerCase();
    const verb = actionVerbs.find(v => first.includes(v));
    if (verb) {
      membrete = lines[0].trim();
      accion = lines.slice(0, Math.min(2, lines.length)).join('\n').trim();
    } else {
      accion = lines[0].trim();
      membrete = lines[0].trim().split(/[.,!?]/)[0] || lines[0].trim();
    }
  }

  return { membrete, accion, dialogo };
}

async function autoResolveStunnedOpponent(room, targetJid) {
  const target = turnManager.getParticipantByJid(room, targetJid);
  if (!target) return null;

  if (target.team === 'enemies') {
    return await combatEngine.autoResolveEnemyTurn(room);
  }

  return { type: 'player_action_required', target: target.name, message: `@${target.name} tiene una acción libre por carta en blanco! Usa /rol para actuar.` };
}

function invalidateCache() {
  llmCache.clear();
}

// ────────────────────────────────────────────────────────────────────────────
// PIPELINE MULTI-MODEL
// ────────────────────────────────────────────────────────────────────────────

async function runStep1Classification(buffer) {
  buffer.status = 'classifying';
  buffer.modelsUsed.step1 = 'deepseek';

  const prompt = CLASSIFICATION_PROMPT.replace('{text}', buffer.inputText);

  try {
    const raw = await orchestrator.generateText({
      prompt,
      temperature: 0.1,
      providerPreference: 'deepseek',
      bypassCache: true,
      jsonMode: true,
    });

    const parsed = JSON.parse(raw);
    if (!parsed.action_type || !['attack','defend','flee','interact','transition','use_item'].includes(parsed.action_type)) {
      throw new Error(`Invalid action_type: ${parsed.action_type}`);
    }

    buffer.classification = {
      actionType: parsed.action_type,
      intent: parsed.intent || 'ofensivo',
      targetId: parsed.target_id || null,
      confidence: parsed.confidence || 0.5,
    };
    return { success: true };
  } catch (err) {
    buffer.errors.push({ step: 1, provider: 'deepseek', error: err.message });
    return await fallbackStep1Classification(buffer);
  }
}

async function fallbackStep1Classification(buffer) {
  console.log(`[PIPELINE] Step1 fallback: usando combatParser (text: "${buffer.inputText.slice(0, 50)}...")`);
  const normalized = buffer.inputText.toLowerCase();
  let actionType = 'attack';
  let intent = 'ofensivo';

  if (combatParser.isObservacion(normalized) && !combatParser.ATTACK_SYNONYMS.some(s => normalized.includes(s))) {
    actionType = 'interact';
    intent = 'auxiliar';
  } else if (normalized.includes('defender') || normalized.includes('defensa') || normalized.includes('defiendo') || normalized.includes('esquivar') || normalized.includes('esquivo') || normalized.includes('bloquear') || normalized.includes('bloqueo') || normalized.includes('proteg') || normalized.includes('cubro') || normalized.includes('cubrir') || normalized.includes('guardia')) {
    actionType = 'defend';
    intent = 'defensivo';
  } else if (normalized.includes('huir') || normalized.includes('escapar') || normalized.includes('retirar') || normalized.includes('flee')) {
    actionType = 'flee';
    intent = 'retirada';
  } else if (combatParser.TRANSITION_SYNONYMS.some(s => normalized.includes(s))) {
    actionType = 'transition';
    intent = 'auxiliar';
  }

  buffer.classification = {
    actionType,
    intent,
    targetId: null,
    confidence: 0.6,
  };
  return { success: true, fallback: true };
}

async function runStep2Mechanics(buffer) {
  buffer.status = 'mechanics';
  buffer.modelsUsed.step2 = 'gemini';

  const p = buffer.participant;
  const aliveEnemies = turnManager.getAliveParticipants(buffer.room, 'enemies');
  const alivePlayers = turnManager.getAliveParticipants(buffer.room, 'players');
  const abilitiesList = abilities.getAvailableAbilities(p) || [];
  const weapon = buffer.inventory?.equipped?.arma
    ? (itemsData.getItem(buffer.inventory.equipped.arma)?.name || 'desarmado')
    : 'desarmado';

  const prompt = [
    '## MECANICAS DE COMBATE',
    '',
    `Accion: ${buffer.classification.actionType} (${buffer.classification.intent})`,
    '',
    `Personaje: ${p.name || 'Desconocido'}`,
    `Arma equipada: ${weapon}`,
    `Habilidades disponibles: ${abilitiesList.length > 0 ? abilitiesList.join(', ') : 'Ninguna'}`,
    `Fulgor: ${p.fulgor || 0}/${p.maxFulgor || 50} | Fatiga: ${p.fatigue || 0}/10`,
    `Aturdido: ${p.stunned ? 'Si' : 'No'}`,
    `Zonas danadas: ${Object.entries(p.bodyParts || {}).filter(([_, hp]) => hp <= 3).map(([z, hp]) => `${z}(${hp}HP)`).join(', ') || 'Ninguna'}`,
    `Enemigos vivos: ${aliveEnemies.map(e => `${e.name} (HP ${e.hp}/${e.maxHp})`).join(', ') || 'Ninguno'}`,
    '',
    ...(buffer.classification.actionType === 'attack' ? [
      'Determina la zona de impacto y si se usa una habilidad especial.',
      'Si el personaje tiene una habilidad disponible que tenga sentido usarse, establece ability_id.',
    ] : []),
    '',
    'Responde SOLO este JSON:',
    '{"zone":"cuerpo|null","weapon":"string|null","ability_id":"string|null","move_number":1|2,"is_attempt":bool}',
  ].join('\n');

  try {
    const raw = await orchestrator.generateText({
      prompt,
      temperature: 0.2,
      providerPreference: 'gemini',
      bypassCache: true,
      jsonMode: true,
    });

    const parsed = JSON.parse(raw);
    buffer.mechanics = {
      zone: parsed.zone || 'pecho',
      weapon: parsed.weapon || null,
      abilityId: parsed.ability_id || null,
      moveNumber: parsed.move_number || 1,
      isAttempt: parsed.is_attempt || false,
    };
    if (parsed.ability_id) buffer.abilityId = parsed.ability_id;
    return { success: true };
  } catch (err) {
    buffer.errors.push({ step: 2, provider: 'gemini', error: err.message });
    return await fallbackStep2Mechanics(buffer);
  }
}

function fallbackStep2Mechanics(buffer) {
  console.log(`[PIPELINE] Step2 fallback: usando regex extractZone/Weapon`);
  const normalized = buffer.inputText.toLowerCase();
  const zone = combatParser.extractZone(normalized);

  buffer.mechanics = {
    zone: zone || 'pecho',
    weapon: null,
    abilityId: null,
    moveNumber: 1,
    isAttempt: false,
  };
  return { success: true, fallback: true };
}

async function runStep3Narration(buffer) {
  buffer.status = 'narrating';
  buffer.modelsUsed.step3 = 'nararouter';

  try {
    const result = await combatNarrator.narrate(buffer.actionResult, {
      abilityId: buffer.abilityId || undefined,
      activeEffects: buffer.room?.activeEffects,
    });

    buffer.narrative = result.narrative;
    buffer.tone = result.tone || (combatNarrator.getToneLabel ? combatNarrator.getToneLabel(result.tone) : undefined);
    return { success: true, narrationType: result.narrationType };
  } catch (err) {
    buffer.errors.push({ step: 3, error: err.message });
    return fallbackStep3Narration(buffer);
  }
}

function fallbackStep3Narration(buffer) {
  console.log(`[PIPELINE] Step3 fallback: usando combatNarrator.generateTemplateNarrative`);
  buffer.narrative = combatNarrator.generateTemplateNarrative(buffer.actionResult, { abilityId: buffer.abilityId || undefined });
  buffer.tone = 'template';
  return { success: true, fallback: true, narrationType: 'template' };
}

async function runStep4Execute(buffer) {
  buffer.status = 'executing';

  const data = {
    mechanics: {
      action_type: buffer.classification.actionType,
      target_id: buffer.classification.targetId,
      zone: buffer.mechanics.zone,
      weapon: buffer.mechanics.weapon,
      move_number: buffer.mechanics.moveNumber,
    },
    ability_id: buffer.abilityId,
    narrative: null,
    infractions: buffer.infractions,
    environmental_effect: null,
    damage_type: null,
  };

  try {
    const result = await executeValidatedOutput(data, {
      text: buffer.inputText,
      room: buffer.room,
      participant: buffer.participant,
      inventory: buffer.inventory,
    });

    if (result.error) return { error: result.error };
    buffer.actionResult = result.actionResult;
    buffer.abilityResult = result.abilityResult || null;
    // Capture narrative from early-return actions (interact, transition, use_item)
    if (result.narrative && !buffer.narrative) {
      buffer.narrative = result.narrative;
      buffer._mechanicalFromExecute = result.mechanical || '';
    }
    return { success: true, result };
  } catch (err) {
    buffer.errors.push({ step: 4, error: err.message });
    return { error: err.message };
  }
}

function runStep5Assemble(buffer) {
  buffer.status = 'complete';

  const cartaBlanca = buffer.infractions.length > 0;

  // If execute step already provided a narrative+mechanical (interact, transition, etc.), use it directly
  if (buffer._mechanicalFromExecute) {
    return {
      success: !cartaBlanca,
      narrative: buffer.narrative || 'Accion procesada.',
      mechanical: buffer._mechanicalFromExecute,
      actionResult: buffer.actionResult,
      cartaBlanca,
      infractions: buffer.infractions,
      abilityResult: buffer.abilityResult || null,
      pipelineErrors: buffer.errors.length > 0 ? buffer.errors : undefined,
      modelsUsed: buffer.modelsUsed,
    };
  }

  const mechanicalParts = [];
  mechanicalParts.push(`**${buffer.classification.actionType.toUpperCase()}**`);
  if (buffer.mechanics.zone) mechanicalParts.push(`Zona: ${buffer.mechanics.zone}`);
  if (buffer.mechanics.weapon) mechanicalParts.push(`Arma: ${buffer.mechanics.weapon}`);
  if (buffer.abilityId) mechanicalParts.push(`Habilidad: ${buffer.abilityId}`);

  return {
    success: !cartaBlanca,
    narrative: buffer.narrative || 'Accion procesada.',
    mechanical: mechanicalParts.join(' | '),
    actionResult: buffer.actionResult,
    cartaBlanca,
    infractions: buffer.infractions,
    abilityResult: buffer.abilityResult || null,
    pipelineErrors: buffer.errors.length > 0 ? buffer.errors : undefined,
    modelsUsed: buffer.modelsUsed,
  };
}

async function processRoleplayPipeline(buffer) {
  const step1 = await runStep1Classification(buffer);
  if (!step1.success) return { error: 'Step1 (classification) fallo incluso con fallback.' };

  const step2 = await runStep2Mechanics(buffer);
  if (!step2.success) return { error: 'Step2 (mechanics) fallo incluso con fallback.' };

  const step4 = await runStep4Execute(buffer);
  if (step4.error) {
    return { error: step4.error };
  }

  if (step4.result.cartaBlanca) {
    buffer.infractions = step4.result.infractions || [];
    return runStep5Assemble(buffer);
  }

  // For non-combat actions (interact, transition, use_item), the execute step
  // already provides the narrative directly. Skip narration for these.
  const nonCombatTypes = ['interact', 'transition', 'use_item'];
  if (!nonCombatTypes.includes(buffer.classification.actionType)) {
    const step3 = await runStep3Narration(buffer);
  }

  return runStep5Assemble(buffer);
}

const FEATURE_FLAG_PIPELINE = true;

module.exports = {
  processRoleplay,
  buildRefereeContext,
  buildRefereePrompt,
  parseLLMResponse,
  executeValidatedOutput,
  handleCartaBlanca,
  fallbackProcess,
  autoResolveStunnedOpponent,
  invalidateCache,
  validateCoherence,
  processRoleplayPipeline,
  runStep1Classification,
  runStep2Mechanics,
  runStep3Narration,
  runStep4Execute,
  runStep5Assemble,
  CombatBuffer,
};
