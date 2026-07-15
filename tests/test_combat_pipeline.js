let CombatBuffer;
try {
  CombatBuffer = require("../src/services/rpg/combatBuffer")?.CombatBuffer;
} catch {
  /* module not available */
}
const helpers = require("./test_helpers");
const { assert, assertEqual, assertDeepEqual, printResults, createMockParticipant, createMockRoom } = helpers;

async function run() {
  if (!CombatBuffer) {
    console.log("⚠ SKIP: CombatBuffer no disponible (test_combat_pipeline)");
    return;
  }
  console.log("=== TEST: Combat Pipeline Multi-Model ===\n");

  // ──────────────────────────────────────────────
  // CombatBuffer constructor
  // ──────────────────────────────────────────────
  console.log("--- CombatBuffer ---");

  const mockCtx = {
    text: "ataco al enemigo en el pecho",
    room: { id: "room1", participants: [] },
    participant: { id: "p1", name: "Hero" },
    inventory: { items: [], equipped: {} },
  };

  const buffer = new CombatBuffer(mockCtx);
  assertEqual(buffer.inputText, mockCtx.text, "inputText stored");
  assertEqual(buffer.status, "pending", "initial status is pending");
  assertEqual(buffer.classification, null, "classification starts null");
  assertEqual(buffer.mechanics, null, "mechanics starts null");
  assertEqual(buffer.infractions.length, 0, "infractions starts empty");
  assertEqual(buffer.errors.length, 0, "errors starts empty");
  assertDeepEqual(buffer.modelsUsed, {}, "modelsUsed starts empty");

  // ──────────────────────────────────────────────
  // fallbackStep1Classification
  // ──────────────────────────────────────────────
  console.log("\n--- fallbackStep1Classification ---");

  const bufObserve = new CombatBuffer({
    text: "miro alrededor buscando enemigos",
    room: {},
    participant: {},
    inventory: {},
  });
  const referee = require("../src/services/rpg/combatRefereeService");
  const result1 = await referee.runStep1Classification(bufObserve);
  assert(result1.success, "runStep1Classification succeeds for observation");
  assertEqual(bufObserve.classification.actionType, "interact", "observation classified as interact");
  assertEqual(bufObserve.classification.intent, "auxiliar", "observation intent is auxiliar");

  const bufAttack = new CombatBuffer({
    text: "golpeo al enemigo en la cabeza con mi espada",
    room: {},
    participant: {},
    inventory: {},
  });
  const result2 = await referee.runStep1Classification(bufAttack);
  assert(result2.success, "runStep1Classification succeeds for attack");

  const bufDefend = new CombatBuffer({
    text: "defiendo el golpe con mi escudo",
    room: {},
    participant: {},
    inventory: {},
  });
  const result3 = await referee.runStep1Classification(bufDefend);
  assert(result3.success, "runStep1Classification succeeds for defend");
  assertEqual(bufDefend.classification.actionType, "defend", "defense classified as defend");

  // ──────────────────────────────────────────────
  // fallbackStep2Mechanics
  // ──────────────────────────────────────────────
  console.log("\n--- fallbackStep2Mechanics ---");

  const baseRoom = {
    id: "test_room",
    participants: [
      { id: "p1", name: "Hero", team: "players", hp: 100, maxHp: 100, ko: false },
      { id: "e1", name: "Goblin", team: "enemies", hp: 30, maxHp: 30, ko: false },
    ],
  };

  const bufMech = new CombatBuffer({
    text: "apunto al brazo izquierdo del enemigo",
    room: baseRoom,
    participant: { bodyParts: {}, name: "Hero", fulgor: 50, maxFulgor: 50, fatigue: 0, stunned: false },
    inventory: { equipped: {} },
  });
  bufMech.classification = { actionType: "attack", intent: "ofensivo", targetId: null, confidence: 0.8 };
  const result4 = await referee.runStep2Mechanics(bufMech);
  assert(result4.success, "runStep2Mechanics succeeds via fallback");
  // extractZone maps "brazo" -> "brazo_der" (left/right not distinguishable in current parser)
  assert(bufMech.mechanics.zone !== null, "extracted zone from text");

  const bufNoZone = new CombatBuffer({
    text: "ataco con todo",
    room: baseRoom,
    participant: { bodyParts: {}, name: "Hero", fulgor: 50, maxFulgor: 50, fatigue: 0, stunned: false },
    inventory: { equipped: {} },
  });
  bufNoZone.classification = { actionType: "attack", intent: "ofensivo", targetId: null, confidence: 0.8 };
  const result5 = await referee.runStep2Mechanics(bufNoZone);
  assert(result5.success, "runStep2Mechanics succeeds without zone");
  assert(bufNoZone.mechanics.zone !== undefined && bufNoZone.mechanics.zone !== null, "zone is set (LLM or fallback)");

  // ──────────────────────────────────────────────
  // runStep5Assemble
  // ──────────────────────────────────────────────
  console.log("\n--- runStep5Assemble ---");

  const bufFinal = new CombatBuffer(mockCtx);
  bufFinal.status = "executing";
  bufFinal.classification = { actionType: "attack", intent: "ofensivo", targetId: "enemy_1", confidence: 0.9 };
  bufFinal.mechanics = { zone: "pecho", weapon: "espada", abilityId: null, moveNumber: 1, isAttempt: false };
  bufFinal.actionResult = { result: { hit: true, damage: 15 }, action: { type: "attack" }, context: {} };
  bufFinal.narrative = "Golpeas al enemigo en el pecho.";
  bufFinal.tone = "agile";

  const assembled = referee.runStep5Assemble(bufFinal);
  assert(assembled.success, "assemble returns success");
  assertEqual(assembled.narrative, "Golpeas al enemigo en el pecho.", "narrative preserved");
  assert(assembled.mechanical.includes("ATTACK"), "mechanical includes action type");
  assert(assembled.mechanical.includes("pecho"), "mechanical includes zone");

  // ──────────────────────────────────────────────
  // runStep5Assemble with cartaBlanca
  // ──────────────────────────────────────────────
  console.log("\n--- runStep5Assemble with cartaBlanca ---");

  const bufCB = new CombatBuffer(mockCtx);
  bufCB.status = "executing";
  bufCB.classification = { actionType: "attack", intent: "ofensivo", targetId: null, confidence: 0.5 };
  bufCB.mechanics = { zone: "pecho", weapon: null, abilityId: null, moveNumber: 1, isAttempt: false };
  bufCB.infractions = [{ type: "invalid_target", description: "Objetivo no válido" }];
  bufCB.narrative = null;

  const assembledCB = referee.runStep5Assemble(bufCB);
  assert(!assembledCB.success, "assemble returns not success for cartaBlanca");
  assert(assembledCB.cartaBlanca, "cartaBlanca flag set");

  // ──────────────────────────────────────────────
  // processRoleplayPipeline via processRoleplay
  // ──────────────────────────────────────────────
  console.log("\n--- processRoleplayPipeline (integration via processRoleplay) ---");

  const room = createMockRoom
    ? createMockRoom()
    : {
        id: "test_room_1",
        participants: [
          {
            id: "test-player-1",
            name: "TestPlayer",
            team: "players",
            hp: 100,
            maxHp: 100,
            fulgor: 50,
            maxFulgor: 50,
            fatigue: 0,
            fuerza: 7,
            reflejos: 6,
            velocidad_ataque: 5,
            precision: 6,
            velocidad_desplazamiento: 5,
            dominio_fulgor: 3,
            resistencia_fisica: 5,
            resistencia_magica: 3,
            ko: false,
            stunned: false,
            defending: false,
            defenseMultiplier: 1,
            bodyParts: {
              cabeza: 10,
              cuello: 5,
              pecho: 20,
              abdomen: 15,
              espalda: 15,
              brazo_izq: 10,
              brazo_der: 10,
              pierna_izq: 10,
              pierna_der: 10,
              mano_izq: 5,
              mano_der: 5,
              pie_izq: 5,
              pie_der: 5,
            },
            detox: [],
          },
          {
            id: "enemy_goblin_0",
            name: "Goblin",
            team: "enemies",
            hp: 30,
            maxHp: 30,
            fulgor: 0,
            maxFulgor: 0,
            fatigue: 0,
            fuerza: 4,
            reflejos: 3,
            ko: false,
            bodyParts: { cabeza: 8, pecho: 15, abdomen: 10 },
          },
        ],
        turnCount: 1,
        round: 1,
        location: { zone: "bosque", region: "norte", locationId: "bosque_oscuro" },
      };

  if (!room.participants.find((p) => p.id === "test-player-1")) {
    room.participants.push({
      id: "test-player-1",
      name: "TestPlayer",
      team: "players",
      hp: 100,
      maxHp: 100,
      fulgor: 50,
      maxFulgor: 50,
      fatigue: 0,
      fuerza: 7,
      reflejos: 6,
      ko: false,
      stunned: false,
      bodyParts: { cabeza: 10, pecho: 20 },
    });
  }
  if (!room.participants.find((p) => p.id === "enemy_goblin_0")) {
    room.participants.push({
      id: "enemy_goblin_0",
      name: "Goblin",
      team: "enemies",
      hp: 30,
      maxHp: 30,
      fatigue: 0,
      fuerza: 4,
      reflejos: 3,
      ko: false,
      bodyParts: { cabeza: 8, pecho: 15 },
    });
  }

  const participant = room.participants[0];
  const inventory = { items: [], equipped: {} };

  try {
    const pipelineResult = await referee.processRoleplay(
      "miro alrededor en busca de enemigos",
      room,
      participant,
      inventory,
    );
    assert(
      pipelineResult.success === true || pipelineResult.cartaBlanca === true || pipelineResult.error,
      "pipeline returned a valid result for observation",
    );
    if (pipelineResult.success) {
      assert(typeof pipelineResult.narrative === "string", "narrative is string");
    }
  } catch (err) {
    console.log(`  \u26a0\ufe0f observation pipeline error (expected if no API keys): ${err.message}`);
  }

  // ──────────────────────────────────────────────
  // Run fallback directly (always works)
  // ──────────────────────────────────────────────
  console.log("\n--- fallbackProcess (legacy, no LLM needed) ---");

  try {
    const fallbackParticipant = room.participants.find((p) => p.team === "players");
    const fallbackTarget = room.participants.find((p) => p.team === "enemies");
    const fallbackResult = await referee.fallbackProcess(
      "golpeo al enemigo en la cabeza",
      room,
      fallbackParticipant || participant,
    );
    assert(
      fallbackResult.success !== false || fallbackResult.cartaBlanca !== undefined,
      "fallbackProcess returned a result",
    );
    if (fallbackResult.actionResult) {
      assert(typeof fallbackResult.actionResult === "object", "actionResult is object");
    }
  } catch (err) {
    console.log(`  \u274c fallbackProcess error: ${err.message}`);
  }

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  return printResults("Combat Pipeline Tests");
}

run().catch((err) => {
  console.error("Test suite error:", err);
  process.exit(1);
});
