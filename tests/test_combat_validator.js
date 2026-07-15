let combatValidator;
try {
  combatValidator = require("../src/services/rpg/combatValidator");
} catch {
  /* module not available */
}
const helpers = require("./test_helpers");
const { assert, assertEqual, printResults } = helpers;

async function run() {
  if (!combatValidator) {
    console.log("⚠ SKIP: combatValidator no disponible");
    const ok = printResults("Combat Validator");
    if (!ok) process.exit(1);
    return;
  }
  console.log("=== TEST: Combat Validator (Mano Blanca / Mano Negra) ===\n");

  // ──────────────────────────────────────────────
  // Mano Blanca patterns
  // ──────────────────────────────────────────────
  console.log("--- Mano Blanca patterns ---");

  assert(combatValidator.validate("lo mato de un golpe.", {}).valid === false, "lo mato → invalid");
  assert(combatValidator.validate("le meto una estocada.", {}).valid === false, "le meto → invalid");
  assert(combatValidator.validate("lo vence.", {}).valid === false, "lo vence → invalid");
  assert(combatValidator.validate("lo remato.", {}).valid === false, "lo remato → invalid");

  assert(combatValidator.validate("cae muerto.", {}).valid === false, "cae muerto → invalid");
  assert(combatValidator.validate("queda KO.", {}).valid === false, "queda KO → invalid");
  assert(combatValidator.validate("queda k o.", {}).valid === false, "queda k o → invalid");
  assert(combatValidator.validate("cae fulminado.", {}).valid === false, "cae fulminado → invalid");

  assert(combatValidator.validate("le corto el brazo.", {}).valid === false, "cortar brazo → invalid");
  assert(combatValidator.validate("corto su pierna.", {}).valid === false, "cortar pierna → invalid");
  assert(combatValidator.validate("le corto la cabeza.", {}).valid === false, "cortar cabeza → invalid");
  assert(combatValidator.validate("le corto el cuello.", {}).valid === false, "cortar cuello → invalid");

  assert(combatValidator.validate("lo desarmo.", {}).valid === false, "desarmar → invalid");
  assert(combatValidator.validate("le tiro el arma.", {}).valid === false, "tirar arma → invalid");
  assert(combatValidator.validate("le hizo soltar su espada.", {}).valid === false, "hizo soltar → invalid");

  assert(combatValidator.validate("le parto el escudo.", {}).valid === false, "partir → invalid");
  assert(combatValidator.validate("lo destroza.", {}).valid === false, "destrozar → invalid");

  // Compound action (contains comma after action verb)
  // Note: pattern /,.*,/ matches if there are two or more commas
  assert(combatValidator.validate("ataco, esquivo, bloqueo.", {}).valid === false, "multi-comma action → invalid");

  // ──────────────────────────────────────────────
  // Mano Negra patterns
  // ──────────────────────────────────────────────
  console.log("\n--- Mano Negra patterns ---");

  assert(combatValidator.validate("no puede esquivar mi golpe.", {}).valid === false, "no puede esquivar → invalid");
  assert(combatValidator.validate("no logra bloquear.", {}).valid === false, "no logra bloquear → invalid");
  assert(
    combatValidator.validate("no alcanza defender mi golpe.", {}).valid === false,
    "no alcanza defender → invalid",
  );
  assert(combatValidator.validate("no consigue reaccionar.", {}).valid === false, "no consigue reaccionar → invalid");

  assert(combatValidator.validate("su golpe falla.", {}).valid === false, "su golpe falla → invalid");
  assert(combatValidator.validate("su ataque falló.", {}).valid === false, "su ataque falló → invalid");
  assert(combatValidator.validate("su espada no conecta.", {}).valid === false, "su espada no conecta → invalid");
  assert(combatValidator.validate("su habilidad yerra el blanco.", {}).valid === false, "su habilidad yerra → invalid");

  assert(combatValidator.validate("queda aturdido.", {}).valid === false, "queda aturdido → invalid");
  assert(combatValidator.validate("queda inmovil.", {}).valid === false, "queda inmovil → invalid");
  assert(combatValidator.validate("queda ciego.", {}).valid === false, "queda ciego → invalid");
  assert(combatValidator.validate("queda paralizado.", {}).valid === false, "queda paralizado → invalid");

  assert(combatValidator.validate("no pudo hacer nada.", {}).valid === false, "no pudo → invalid");
  assert(combatValidator.validate("jamas podra alcanzarme.", {}).valid === false, "jamas podra → invalid");
  assert(combatValidator.validate("imposible que me toque.", {}).valid === false, "imposible que → invalid");

  assert(combatValidator.validate("suelta su espada.", {}).valid === false, "suelta espada → invalid");
  assert(combatValidator.validate("tira la daga.", {}).valid === false, "tira daga → invalid");
  assert(combatValidator.validate("deja caer su escudo.", {}).valid === false, "deja caer escudo → invalid");

  assert(
    combatValidator.validate("le clavo la espada en el pecho.", {}).valid === false,
    "clavar espada pecho → invalid",
  );
  assert(combatValidator.validate("le hunde la daga en el cuello.", {}).valid === false, "hunde daga cuello → invalid");
  assert(
    combatValidator.validate("le entierra la lanza en el abdomen.", {}).valid === false,
    "entierra lanza abdomen → invalid",
  );

  assert(
    combatValidator.validate("senti que su golpe penetra mi defensa.", {}).valid === false,
    "senti que penetra → invalid",
  );
  assert(
    combatValidator.validate("santi que su ataque impacta en el pecho.", {}).valid === false,
    "santi que impacta → invalid",
  );

  // ──────────────────────────────────────────────
  // Clean text — no infractions
  // ──────────────────────────────────────────────
  console.log("\n--- Clean text (should pass) ---");

  const cleanTexts = [
    "Ataco hacia su pecho con mi espada.",
    "lanzo un golpe rápido a su cabeza.",
    "me pongo en guardia y espero su movimiento.",
    "corro hacia la derecha buscando un mejor ángulo.",
    "salto hacia atrás para ganar distancia.",
    "apunto mi arma hacia su brazo izquierdo.",
    "cargo contra el enemigo con todo mi peso.",
    "empujo al oponente con mi escudo.",
    "retrocedo lentamente, observando sus movimientos.",
    "uso una pocion de vida para curarme.",
  ];
  for (const text of cleanTexts) {
    const v = combatValidator.validate(text, {});
    assert(v.valid === true, `clean text passes: "${text.substring(0, 40)}..."`);
    assert(v.infractions.length === 0, `clean text no infractions: "${text.substring(0, 40)}..."`);
  }

  // ──────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────
  console.log("\n--- Edge cases ---");

  assert(combatValidator.validate("", {}).valid === true, "empty text passes");
  assert(combatValidator.validate("   ", {}).valid === true, "whitespace only passes");
  assert(combatValidator.validate("a", {}).valid === true, "single letter passes");

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults("Combat Validator");
  if (!ok) process.exit(1);
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
