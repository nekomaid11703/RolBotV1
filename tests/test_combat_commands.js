const path = require("path");
const helpers = require("./test_helpers");
const { assert, assertEqual, printResults } = helpers;

async function run() {
  console.log("=== TEST: Combat Commands (Smoke Tests) ===\n");

  // ──────────────────────────────────────────────
  // Smoke test: command files load without error
  // ──────────────────────────────────────────────
  console.log("--- Command module loading ---");

  let loaded = 0;
  const failures = [];

  const commands = [
    { name: "atacar", path: "../src/commands/rpg/combat/atacar" },
    { name: "esquivar", path: "../src/commands/rpg/combat/esquivar" },
    { name: "bloquear", path: "../src/commands/rpg/combat/bloquear" },
    { name: "usar", path: "../src/commands/rpg/combat/usar" },
    { name: "habilidad", path: "../src/commands/rpg/combat/habilidad" },
    { name: "combate", path: "../src/commands/rpg/combat/combate" },
    { name: "rendirse", path: "../src/commands/rpg/combat/rendirse" },
  ];

  for (const cmd of commands) {
    try {
      const mod = require(cmd.path);
      assert(typeof mod.execute === "function", `${cmd.name} exports execute()`);
      assert(Array.isArray(mod.aliases), `${cmd.name} exports aliases array`);
      loaded++;
    } catch (err) {
      failures.push(`${cmd.name}: ${err.message}`);
      console.log(`  \u274c ${cmd.name} — load error: ${err.message}`);
    }
  }

  if (failures.length === 0) {
    assert(true, `All ${commands.length} command modules loaded successfully`);
  } else {
    assert(false, `${failures.length} modules failed to load`);
  }

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults("Combat Commands D20");
  if (!ok) process.exit(1);
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
