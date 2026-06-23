/**
 * Pruebas unitarias para validar la extracción por Regex de crear_pj.js
 * Para ejecutar: node tests/test_crear_pj.js
 */

function testParser(rawText) {
  const nameMatch = rawText.match(/Nombre:\s*(.+)/i);
  const classMatch = rawText.match(/Clase:\s*(.+)/i);
  const historyMatch = rawText.match(/Historia:\s*([\s\S]+)/i);

  if (!nameMatch) {
    throw new Error("No encontré el campo 'Nombre:'.");
  }

  const name = nameMatch[1].trim();
  const clase = classMatch ? classMatch[1].trim() : "";
  const historia = historyMatch ? historyMatch[1].trim() : "";

  return { name, clase, historia };
}

const testCases = [
  {
    desc: "Caso Ideal (copiar/pegar de la plantilla)",
    input: `/crear_pj
Nombre: Kevin
Clase: Guerrero Mágico
Historia: Vivía en una montaña lejana.
Tenía un perro.`,
    expected: { name: "Kevin", clase: "Guerrero Mágico", historia: "Vivía en una montaña lejana.\nTenía un perro." }
  },
  {
    desc: "Caso desordenado (espacios y mayúsculas aleatorias)",
    input: `/CREAR_pj
nombre:    Aragorn  
cLAse:   Ranger
historia:  
El heredero de Isildur.`,
    expected: { name: "Aragorn", clase: "Ranger", historia: "El heredero de Isildur." }
  },
  {
    desc: "Caso sin clase (Clase vacía u omitida)",
    input: `/crear_pj\nNombre: Frodo\nHistoria: Portador del anillo.`,
    expected: { name: "Frodo", clase: "", historia: "Portador del anillo." }
  }
];

let failures = 0;

console.log("🛠️ EJECUTANDO PRUEBAS DE REGEX (crear_pj)...\n");

testCases.forEach((tc, i) => {
  try {
    const result = testParser(tc.input);
    const pass = 
      result.name === tc.expected.name && 
      result.clase === tc.expected.clase &&
      result.historia === tc.expected.historia;

    if (pass) {
      console.log(`✅ Prueba ${i + 1} superada: ${tc.desc}`);
    } else {
      console.error(`❌ Prueba ${i + 1} fallida: ${tc.desc}`);
      console.error(`  Esperado:`, tc.expected);
      console.error(`  Obtenido:`, result);
      failures++;
    }
  } catch (error) {
    console.error(`❌ Prueba ${i + 1} fallida por Error: ${tc.desc}`);
    console.error(`  ${error.message}`);
    failures++;
  }
});

if (failures === 0) {
  console.log("\n🎉 Todas las pruebas pasaron satisfactoriamente.");
  process.exit(0);
} else {
  console.log(`\n⚠️ Se encontraron ${failures} fallos.`);
  process.exit(1);
}
