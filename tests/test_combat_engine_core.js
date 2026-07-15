const combatEngine = require("../src/services/rpg/combatEngine");
const helpers = require("./test_helpers");
const { assert, assertEqual, printResults } = helpers;

function createMockParticipant(overrides = {}) {
  return {
    id: "test-player-1",
    name: "TestPlayer",
    team: "players",
    hp: 100,
    maxHp: 100,
    fuerza: 5,
    velocidad: 5,
    reflejos: 5,
    resistencia_fisica: 5,
    resistencia_magica: 3,
    dominio_magico: 1,
    inventario: [],
    efectos_activos: [],
    habilidades: [],
    xp: 0,
    nivel: 1,
    ko: false,
    stunned: false,
    consecutiveSkips: 0,
    ...overrides,
  };
}

async function run() {
  console.log("=== TEST: Combat Engine Core D20 ===\n");

  // ──────────────────────────────────────────────
  // getStatMultiplier
  // ──────────────────────────────────────────────
  console.log("--- getStatMultiplier ---");
  assertEqual(combatEngine.getStatMultiplier(1), 1.0, "Stat level 1 = multiplier 1.0");
  assertEqual(combatEngine.getStatMultiplier(20), 5.0, "Stat level 20 = multiplier 5.0");
  assertEqual(combatEngine.getStatMultiplier(10.5), 3.0, "Stat level 10.5 = multiplier 3.0"); // (1 + 9.5 * 4/19) = 1 + 2 = 3.0
  assertEqual(combatEngine.getStatMultiplier(0), 1.0, "Under level 1 clamped to 1.0");
  assertEqual(combatEngine.getStatMultiplier(25), 5.0, "Above level 20 clamped to 5.0");

  // ──────────────────────────────────────────────
  // resolveAttack
  // ──────────────────────────────────────────────
  console.log("\n--- resolveAttack ---");

  // Caso 1: Ataque normal (forzando un mockeando de rollD o simplemente evaluando estructura)
  const attacker = createMockParticipant({ fuerza: 5, velocidad: 5 });
  const defender = createMockParticipant({ reflejos: 5, resistencia_fisica: 5 });

  const result = combatEngine.resolveAttack(attacker, defender);
  assert(result.d20 >= 1 && result.d20 <= 20, "d20 roll within bounds");
  assert(typeof result.hit === "boolean", "hit is boolean");
  assert(typeof result.damage === "number", "damage is number");
  assert(typeof result.defenderKO === "boolean", "defenderKO is boolean");
  assert(typeof result.attackerVulnerable === "boolean", "attackerVulnerable is boolean");
  assert(result.details.length > 0, "details is non-empty string");

  // ──────────────────────────────────────────────
  // resolveDodge
  // ──────────────────────────────────────────────
  console.log("\n--- resolveDodge ---");
  const dodger = createMockParticipant({ reflejos: 8 });
  const dodgeResult = combatEngine.resolveDodge(dodger);
  assert(dodgeResult.d20 >= 1 && dodgeResult.d20 <= 20, "d20 dodge roll within bounds");
  assert(
    combatEngine.hasEffect(dodger, "dodging") || combatEngine.hasEffect(dodger, "dodge_pif"),
    "dodger has dodge or pifia effects",
  );

  // ──────────────────────────────────────────────
  // resolveBlock
  // ──────────────────────────────────────────────
  console.log("\n--- resolveBlock ---");
  const blocker = createMockParticipant({ resistencia_fisica: 10 });
  const blockResult = combatEngine.resolveBlock(blocker);
  assert(blockResult.d20 >= 1 && blockResult.d20 <= 20, "d20 block roll within bounds");
  assert(
    combatEngine.hasEffect(blocker, "blocking") || blocker.ko || blocker.hp < blocker.maxHp,
    "blocker has blocking effect or suffered damage from pifia",
  );

  // ──────────────────────────────────────────────
  // resolveUseItem
  // ──────────────────────────────────────────────
  console.log("\n--- resolveUseItem ---");
  const user = createMockParticipant({ hp: 50, maxHp: 100 });
  const item = { id: "pocion_vida", name: "Poción de Vida", type: "consumible", efecto: "cura", potencia: 20 };
  const useResult = combatEngine.resolveUseItem(user, item);
  assert(useResult.d20 >= 1 && useResult.d20 <= 20, "d20 item use roll within bounds");
  if (useResult.isPifia) {
    assertEqual(user.hp, 50, "pifia does not heal");
  } else {
    assert(user.hp > 50, "successful heal restores HP");
  }

  // ──────────────────────────────────────────────
  // resolveAbility
  // ──────────────────────────────────────────────
  console.log("\n--- resolveAbility ---");
  const caster = createMockParticipant({ dominio_magico: 10 });
  const target = createMockParticipant({ hp: 100, maxHp: 100, resistencia_magica: 5 });
  const ability = { id: "bola_fuego", name: "Bola de Fuego", type: "damage", baseDamage: 15 };

  const abilityResult = combatEngine.resolveAbility(caster, target, ability);
  assert(abilityResult.d20 >= 1 && abilityResult.d20 <= 20, "d20 ability roll within bounds");
  if (!abilityResult.isPifia) {
    assert(target.hp < 100, "target takes damage from damage ability");
  }

  // ──────────────────────────────────────────────
  // tickEffects
  // ──────────────────────────────────────────────
  console.log("\n--- tickEffects ---");
  const p = createMockParticipant();
  p.efectos_activos.push({ tipo: "vulnerable", duracion: 2 });
  p.efectos_activos.push({ tipo: "dodging", duracion: 1 });

  combatEngine.tickEffects(p);
  assert(combatEngine.hasEffect(p, "vulnerable"), "vulnerable still active (duration 1)");
  assert(!combatEngine.hasEffect(p, "dodging"), "dodging expired (duration 0)");

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults("Combat Engine Core D20");
  if (!ok) process.exit(1);
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
