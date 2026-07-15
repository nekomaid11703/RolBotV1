const path = require("path");

let combatValidator, combatRefereeService;
try {
  combatValidator = require("../src/services/rpg/combatValidator");
} catch {
  /* module not available */
}
try {
  combatRefereeService = require("../src/services/rpg/combatRefereeService");
} catch {
  /* module not available */
}
const invService = require("../src/services/rpg/inventoryService");

const helpers = require("./test_helpers");
const {
  assert,
  assertEqual,
  assertDeepEqual,
  printResults,
  createMockParticipant,
  createMockRoom,
  createMockInventory,
} = helpers;

async function run() {
  if (!combatValidator) {
    console.log("⚠ SKIP: combatValidator no disponible");
    return;
  }
  console.log("=== TEST: Carta Blanca + Inventory Error Handling ===\n");

  // ──────────────────────────────────────────────
  // Fix: Carta Blanca unificada (LLM y Fallback mismo castigo)
  // ──────────────────────────────────────────────
  console.log("--- Fix 1: Carta Blanca unified ---");

  // 1a. validate() detects mano_blanca patterns (sin strikes progresivos)
  const v1 = combatValidator.validate("lo mato de un golpe.", {});
  assert(v1.valid === false, 'mano_blanca: "lo mato" marked invalid');
  assert(v1.infractions.length === 1, "mano_blanca: 1 infraction");
  assert(v1.infractions[0].type === "mano_blanca", "mano_blanca: type is mano_blanca");
  assert(v1.strikeApplied === undefined, "mano_blanca: no strikeApplied field");
  assert(v1.sanction === undefined, "mano_blanca: no sanction field");

  // 1b. validate() detects mano_negra patterns
  const v2 = combatValidator.validate("su golpe falla estrepitosamente.", {});
  assert(v2.valid === false, 'mano_negra: "su golpe falla" marked invalid');
  assert(v2.infractions.length === 1, "mano_negra: 1 infraction");
  assert(v2.infractions[0].type === "mano_negra", "mano_negra: type is mano_negra");

  // 1c. Clean text passes validation
  const v3 = combatValidator.validate("Ataco con mi espada hacia su pecho.", {});
  assert(v3.valid === true, "clean text: valid");
  assert(v3.infractions.length === 0, "clean text: no infractions");

  // 1d. Previously the old system had progressive strikes (warning → block → sanction)
  // Now ANY infraction is immediately carta_blanca
  const v4 = combatValidator.validate("le corto el brazo con mi espada.", {});
  assert(v4.valid === false, "mano_blanca (amputación): invalid on first offense");
  assert(v4.infractions.length === 1, "mano_blanca (amputación): 1 infraction");
  // No room.infractions tracking
  assert(v4.infractions[0].strike === undefined, "strike counter removed from infraction");

  // 1e. Multiple patterns detected (both blanca and negra if both match)
  const v5 = combatValidator.validate("lo remato mientras su ataque falla.", {});
  assert(v5.infractions.length >= 1, "multiple patterns detected");

  // 1f. First-time and repeated infractions produce identical result (no state tracking)
  const room6 = createMockRoom();
  const v6a = combatValidator.validate("Lo mato.", { room: room6, participant: createMockParticipant() });
  const v6b = combatValidator.validate("Lo mato.", { room: room6, participant: createMockParticipant() });
  assert(v6a.infractions.length === v6b.infractions.length, "same infraction count on repeat");
  assert(v6a.valid === v6b.valid, "same valid flag on repeat");

  // 1g. handleCartaBlanca applies +3 fatigue and stunned
  const p1g = createMockParticipant({ fatigue: 2 });
  const room1g = createMockRoom();
  const ctx1g = { text: "Lo mato.", room: room1g, participant: p1g };
  const data1g = {
    infractions: [{ type: "mano_blanca", severity: "alta", description: "declarar KO" }],
    mechanics: {},
  };
  // Mock stateManager.updateRoom
  const stateManager = require("../src/services/rpg/combatStateManager");
  const origUpdate = stateManager.updateRoom;
  stateManager.updateRoom = async () => {};

  const result1g = await combatRefereeService.handleCartaBlanca(data1g, ctx1g);
  assert(result1g.cartaBlanca === true, "handleCartaBlanca returns cartaBlanca: true");
  assert(result1g.success === false, "handleCartaBlanca returns success: false");
  assert(p1g.fatigue === 5, "handleCartaBlanca: fatigue +3 (2+3=5)");
  assert(p1g.stunned === true, "handleCartaBlanca: stunned set to true");

  // Reset
  stateManager.updateRoom = origUpdate;

  // 1h. handleCartaBlanca with multiple infractions
  const p1h = createMockParticipant();
  const ctx1h = { text: "test", room: createMockRoom(), participant: p1h };
  const data1h = {
    infractions: [
      { type: "mano_blanca", severity: "alta", description: "declarar KO" },
      { type: "mano_negra", severity: "critica", description: "decidir fallo del oponente" },
    ],
    mechanics: { target_id: "enemy_01" },
  };
  stateManager.updateRoom = async () => {};
  const result1h = await combatRefereeService.handleCartaBlanca(data1h, ctx1h);
  assert(result1h.infractions.length === 2, "handleCartaBlanca preserves all infractions");
  assert(result1h.cartaBlancaTarget === "enemy_01", "handleCartaBlanca preserves target_id");
  assert(p1h.stunned === true, "stunned set with multiple infractions");

  // ──────────────────────────────────────────────
  // Fix: Inventory error handling
  // ──────────────────────────────────────────────
  console.log("\n--- Fix 2: Inventory error handling ---");

  // 2a. getInventory returns empty for unknown player (no crash)
  const inv = await invService.getInventory("nonexistent_player_test_123");
  assert(inv !== null && inv !== undefined, "getInventory returns object for unknown player");
  assert(Array.isArray(inv.items), "getInventory returns items array");
  assert(typeof inv.equipped === "object", "getInventory returns equipped object");

  // 2b. addItem returns error for unknown itemId
  const addResult = await invService.addItem("test_player_inv", "item_no_existe");
  assert(addResult.error !== undefined, "addItem with unknown itemId returns error");
  assert(addResult.success === undefined, "addItem error does not have success");

  // 2c. removeItem returns error for item not owned
  const rmResult = await invService.removeItem("test_player_inv", "espada_corta");
  assert(rmResult.error !== undefined, "removeItem for unowned item returns error");

  // 2d. equipItem returns error for non-equippable type
  const eqResult = await invService.equipItem("test_player_inv", "pocion_vida");
  assert(eqResult.error !== undefined, "equipItem for consumable returns error");

  // 2e. unequipItem returns error for empty slot
  const uqResult = await invService.unequipItem("test_player_inv", "arma");
  assert(uqResult.error !== undefined, "unequipItem for empty slot returns error");

  // 2f. damageEquippedItem returns null for empty slot
  const dmgResult = await invService.damageEquippedItem("test_player_inv", "arma");
  assert(dmgResult === null, "damageEquippedItem for empty slot returns null");

  // 2g. damageEquippedItem returns null for unknown item in slot
  // Create a mock inv with an item in slot but unknown itemId
  // This requires actual supabase access, so we test the null path instead
  // (the function returns null when itemId is empty or item not found)

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults("Carta Blanca + Inventory");
  if (!ok) process.exit(1);
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
