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
const { getContextualLore } = require('./worldLore');
const { getSceneForNarrative, getSceneVersion } = require('./sceneCache');
const fs = require('fs');
const path = require('path');

const SYSTEM_PROMPT_PATH = path.join(__dirname, 'narrativePrompts', 'combat.system.md');
const MAX_NARRATIVE_LENGTH = 300;

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
    if (item) invList.push(`${item.name} x${stack.quantity}`);
  }

  const alivePlayers = turnManager.getAliveParticipants(room, 'players');
  const aliveEnemies = turnManager.getAliveParticipants(room, 'enemies');

  const sceneVersion = getSceneVersion(location.locationId) || 1;
  let sceneDesc = '';
  try {
    const scene = getSceneForNarrative(
      location.locationId || 'default',
      location.zone || 'desconocido',
      location.region || 'desconocido',
      sceneVersion
    );
    sceneDesc = typeof scene === 'string' ? scene : (scene.description || '');
  } catch {
    sceneDesc = '';
  }

  const lore = getContextualLore(location.region, location.zone, location.locationId, 500);

  return {
    EQUIPO: equippedList.length > 0 ? equippedList.join(', ') : 'Ninguno',
    INVENTARIO: invList.length > 0 ? invList.join(', ') : 'Vacío',
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
    EFFECTS_REGISTRY: envEffects.EFFECTS_REGISTRY.map(e => `- ${e.id}: ${e.desc} (condiciones: ${Object.keys(e.conditions).join(', ')})`).join('\n'),
  };
}

function buildRefereePrompt(ctx, systemPrompt) {
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
    '### Efectos Ambientales Activos',
    c.EFFECTS_ACTIVOS,
    '',
    '### Registro de Efectos Ambientales Disponibles',
    '(Puedes seleccionar uno si la acción del jugador lo justifica)',
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
    'Responde SOLO con el JSON especificado en las instrucciones. Sin texto adicional antes ni después.',
  ].join('\n');
}

async function processRoleplay(text, room, participant, inventory) {
  const ctx = { text, room, participant, inventory };
  const systemPrompt = loadSystemPrompt();

  const prompt = buildRefereePrompt(ctx, systemPrompt);

  try {
    const rawResponse = await orchestrator.generateText({
      prompt,
      systemInstruction: systemPrompt,
      temperature: 0.3,
      providerPreference: 'deepseek',
      bypassCache: true,
    });

    const parsed = parseLLMResponse(rawResponse);
    const validation = outputValidator.validateOutput(parsed);

    if (validation.valid) {
      return await executeValidatedOutput(parsed, ctx);
    }

    console.warn('combatRefereeService: LLM output invalid, falling back:', validation.errors.join(', '));
    return await fallbackProcess(text, room, participant);
  } catch (err) {
    console.warn('combatRefereeService: LLM call failed, using fallback:', err.message);
    return await fallbackProcess(text, room, participant);
  }
}

function parseLLMResponse(raw) {
  if (!raw || typeof raw !== 'string') {
    return { error: 'Respuesta vacía de la IA.' };
  }

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { error: 'El JSON extraído no es válido.', raw };
    }
  }

  return { error: 'No se encontró JSON en la respuesta.', raw };
}

async function executeValidatedOutput(data, ctx) {
  const { room, participant, inventory, text } = ctx;

  if (data.infractions && data.infractions.length > 0) {
    return await handleCartaBlanca(data, ctx);
  }

  const mechanics = data.mechanics || {};
  let actionResult = null;

  switch (mechanics.action_type) {
    case 'attack': {
      let targetJid = mechanics.target_id || null;
      if (!targetJid) {
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
                actionResult: null,
                cartaBlanca: false,
                infractions: [],
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
        actionResult: null,
        cartaBlanca: false,
        infractions: [],
      };
    }

    case 'interact': {
      participant.fatigue = Math.min(10, (participant.fatigue || 0) + 1);
      await stateManager.updateRoom(room.id, {});
      return {
        success: true,
        narrative: data.narrative || 'Interactúas con el entorno.',
        mechanical: '🤝 Interacción',
        actionResult: null,
        cartaBlanca: false,
        infractions: [],
      };
    }

    default: {
      return await fallbackProcess(text, room, participant);
    }
  }

  if (!actionResult) {
    return await fallbackProcess(text, room, participant);
  }

  if (!actionResult.result) {
    return { error: 'Error procesando acción.' };
  }

  const narrativeText = data.narrative || combatNarrator.generateTemplateNarrative(actionResult);
  const mechanicalMsg = combatEngine.formatActionResult(actionResult);

  return {
    success: true,
    narrative: narrativeText,
    mechanical: mechanicalMsg,
    actionResult,
    cartaBlanca: false,
    infractions: data.infractions || [],
    environmentalEffect: data.environmental_effect || null,
  };
}

async function handleCartaBlanca(data, ctx) {
  const { room, participant } = ctx;
  const infractions = data.infractions || [];
  const infractionDescriptions = infractions.map(i => `• ${i.type}: ${i.description}`).join('\n');

  participant.fatigue = Math.min(10, (participant.fatigue || 0) + 3);
  participant.stunned = true;

  await stateManager.updateRoom(room.id, {});

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
  }

  const dpt = envEffects.getDamagePerTurn(effectId);
  if (dpt > 0) {
    participant.hp = Math.max(1, (participant.hp || 100) - dpt);
  }
}

async function fallbackProcess(text, room, participant) {
  const parsed = combatParser.parse(text, { room, sender: participant.id });
  const vResult = combatValidator.validate(text, { parsed, room, participant });

  if (vResult.sanction) {
    participant.fatigue = Math.min(10, (participant.fatigue || 0) + 5);
    await stateManager.updateRoom(room.id, {});
    return {
      success: false,
      cartaBlanca: true,
      narrative: vResult.messages.join('\n'),
      mechanical: '⛔ Sanción aplicada (fallback)',
      actionResult: null,
      infractions: vResult.infractions || [],
      cartaBlancaTarget: null,
    };
  }

  if (!vResult.valid) {
    return {
      success: false,
      narrative: vResult.messages.join('\n'),
      mechanical: '',
      actionResult: null,
      infractions: vResult.infractions || [],
    };
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
  } else {
    actionResult = await combatEngine.processAttack(room, participant.id, targetJid, zone, {
      moveNumber: parsed.moveNumber || 1,
    });
  }

  if (actionResult.error) return { error: actionResult.error };

  const narrative = await combatNarrator.narrate(actionResult);
  const mechanicalMsg = combatEngine.formatActionResult(actionResult);

  return {
    success: true,
    narrative: narrative.narrative,
    mechanical: mechanicalMsg,
    actionResult,
    cartaBlanca: false,
    infractions: [],
    narrationType: narrative.narrationType || 'fallback',
  };
}

async function autoResolveStunnedOpponent(room, targetJid) {
  const target = turnManager.getParticipantByJid(room, targetJid);
  if (!target) return null;

  if (target.team === 'enemies') {
    return await combatEngine.autoResolveEnemyTurn(room);
  }

  return { type: 'player_action_required', target: target.name, message: `@${target.name} tiene una acción libre por carta en blanco! Usa /rol para actuar.` };
}

module.exports = {
  processRoleplay,
  buildRefereeContext,
  buildRefereePrompt,
  parseLLMResponse,
  executeValidatedOutput,
  handleCartaBlanca,
  fallbackProcess,
  autoResolveStunnedOpponent,
};
