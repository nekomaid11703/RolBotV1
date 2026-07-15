const abilities = require("../src/services/rpg/abilities");
const helpers = require("./test_helpers");
const { assert, assertEqual, printResults, createMockParticipant } = helpers;

function run() {
  console.log("=== TEST: Abilities + Ability Engine ===\n");

  // ──────────────────────────────────────────────
  // ABILITIES_REGISTRY integrity
  // ──────────────────────────────────────────────
  console.log("--- Registry integrity ---");

  assert(Array.isArray(abilities.ABILITIES_REGISTRY), "ABILITIES_REGISTRY is array");
  assert(abilities.ABILITIES_REGISTRY.length === 10, "10 abilities registered");

  for (const a of abilities.ABILITIES_REGISTRY) {
    assert(typeof a.id === "string" && a.id.length > 0, `${a.name}: has id`);
    assert(typeof a.name === "string", `${a.id}: has name`);
    assert(Array.isArray(a.effects) && a.effects.length > 0, `${a.id}: has effects`);
    assert(typeof a.cost === "object", `${a.id}: has cost`);
    assert(typeof a.cooldown === "number", `${a.id}: has cooldown`);
  }

  // ──────────────────────────────────────────────
  // getAbility
  // ──────────────────────────────────────────────
  console.log("\n--- getAbility ---");

  const g1 = abilities.getAbility("golpe_poderoso");
  assert(g1 !== null, "getAbility: golpe_poderoso found");
  assert(g1.name === "Golpe Poderoso", "getAbility: correct name");

  const g2 = abilities.getAbility("nonexistent");
  assert(g2 === null, "getAbility: nonexistent returns null");

  // ──────────────────────────────────────────────
  // getAbilitiesByTier
  // ──────────────────────────────────────────────
  console.log("\n--- getAbilitiesByTier ---");

  const tier1 = abilities.getAbilitiesByTier(1);
  assert(tier1.length === 4, "4 abilities in tier 1");
  const tier2 = abilities.getAbilitiesByTier(2);
  assert(tier2.length === 4, "4 abilities in tier 2");
  const tier3 = abilities.getAbilitiesByTier(3);
  assert(tier3.length === 2, "2 abilities in tier 3");

  // ──────────────────────────────────────────────
  // canUseAbility
  // ──────────────────────────────────────────────
  console.log("\n--- canUseAbility ---");

  const p = createMockParticipant({
    fuerza: 7,
    precision: 6,
    fulgor: 50,
    fatigue: 2,
    dominio_fulgor: 5,
    resistencia_fisica: 5,
    velocidad_ataque: 6,
  });

  // Ability usable
  const c1 = abilities.canUseAbility(p, "golpe_poderoso");
  assert(c1.canUse === true, "golpe_poderoso: usable");

  // Cooldown blocks
  const pCd = createMockParticipant({ cooldowns: { golpe_poderoso: 2 } });
  const c2 = abilities.canUseAbility(pCd, "golpe_poderoso");
  assert(c2.canUse === false, "golpe_poderoso: blocked by cooldown");

  // Insufficient fulgor
  const pNoFulgor = createMockParticipant({ fulgor: 0, dominio_fulgor: 5 });
  const c3 = abilities.canUseAbility(pNoFulgor, "onda_de_choque");
  assert(c3.canUse === false, "onda_de_choque: blocked by insufficient fulgor");

  // Insufficient stats
  const pWeak = createMockParticipant({ fuerza: 2 });
  const c4 = abilities.canUseAbility(pWeak, "golpe_poderoso");
  assert(c4.canUse === false, "golpe_poderoso: blocked by insufficient fuerza");

  // Too much fatigue (cost + current > 10)
  const pFat = createMockParticipant({ fatigue: 9 });
  const c5 = abilities.canUseAbility(pFat, "golpe_poderoso");
  assert(c5.canUse === false, "golpe_poderoso: blocked by fatigue cap");

  // Unknown ability
  const c6 = abilities.canUseAbility(p, "fake_ability");
  assert(c6.canUse === false, "fake ability: blocked");
  assert(c6.reason !== undefined, "fake ability: has reason");

  // ──────────────────────────────────────────────
  // applyAbilityCosts
  // ──────────────────────────────────────────────
  console.log("\n--- applyAbilityCosts ---");

  const pCost = createMockParticipant({ fulgor: 30, fatigue: 3 });
  abilities.applyAbilityCosts(pCost, "golpe_poderoso");
  assert(pCost.fatigue === 5, "golpe_poderoso: fatigue 3→5");
  assert(pCost.fulgor === 30, "golpe_poderoso: fulgor unchanged (cost 0)");

  const pCost2 = createMockParticipant({ fulgor: 30, fatigue: 2 });
  abilities.applyAbilityCosts(pCost2, "onda_de_choque");
  assert(pCost2.fulgor === 0, "onda_de_choque: fulgor 30→0 (cost 30)");
  assert(pCost2.fatigue === 2, "onda_de_choque: fatigue unchanged");

  // Cooldown is set after use
  assert(pCost2.cooldowns !== undefined, "cooldowns object created");
  assert(pCost2.cooldowns.onda_de_choque === 5, "onda_de_choque: cooldown set to 5");

  // ──────────────────────────────────────────────
  // reduceCooldowns
  // ──────────────────────────────────────────────
  console.log("\n--- reduceCooldowns ---");

  const pCd2 = createMockParticipant({ cooldowns: { golpe_poderoso: 3, defensa_total: 1 } });
  abilities.reduceCooldowns(pCd2);
  assert(pCd2.cooldowns.golpe_poderoso === 2, "cooldown 3→2");
  assert(pCd2.cooldowns.defensa_total === 0, "cooldown 1→0");

  // Cooldown stops at 0 (doesn't go negative)
  const pCd3 = createMockParticipant({ cooldowns: { golpe_poderoso: 1 } });
  abilities.reduceCooldowns(pCd3);
  assert(pCd3.cooldowns.golpe_poderoso === 0, "cooldown 1→0");
  abilities.reduceCooldowns(pCd3);
  assert(pCd3.cooldowns.golpe_poderoso === 0, "cooldown stays at 0");

  // ──────────────────────────────────────────────
  // getAvailableAbilities
  // ──────────────────────────────────────────────
  console.log("\n--- getAvailableAbilities ---");

  const pFull = createMockParticipant({
    fuerza: 8,
    reflejos: 7,
    velocidad_ataque: 7,
    precision: 7,
    dominio_fulgor: 6,
    resistencia_fisica: 6,
    fulgor: 50,
    fatigue: 1,
    cooldowns: {},
  });
  const available = abilities.getAvailableAbilities(pFull);
  assert(available.length >= 6, "at least 6 abilities available for high-stat character");

  // ──────────────────────────────────────────────
  // getActiveBuffsDescription
  // ──────────────────────────────────────────────
  console.log("\n--- getActiveBuffsDescription ---");

  const desc1 = abilities.getActiveBuffsDescription(createMockParticipant({}));
  assert(desc1 === "Ninguno", "no buffs → Ninguno");

  const pBuffed = createMockParticipant({
    buffs: [{ stat: "fuerza", value: 3, duration: 2, type: "buff" }],
  });
  const desc2 = abilities.getActiveBuffsDescription(pBuffed);
  assert(desc2.includes("fuerza"), "buff description includes stat name");
  assert(desc2.includes("+3"), "buff description includes value");

  // ──────────────────────────────────────────────
  // reduceBuffDurations
  // ──────────────────────────────────────────────
  console.log("\n--- reduceBuffDurations ---");

  const pBuff = createMockParticipant({
    buffs: [
      { stat: "fuerza", value: 3, duration: 2, type: "buff" },
      { stat: "reflejos", value: 2, duration: 1, type: "buff" },
    ],
  });
  abilities.reduceBuffDurations(pBuff);
  assert(pBuff.buffs.length === 1, "one buff expired, one remains");
  assert(pBuff.buffs[0].duration === 1, "remaining buff duration 2→1");

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults("Abilities + Ability Engine");
  if (!ok) process.exit(1);
}

try {
  const r = run();
  if (r && r.catch)
    r.catch((err) => {
      console.error("FATAL:", err);
      process.exit(1);
    });
} catch (err) {
  console.error("FATAL:", err);
  process.exit(1);
}
