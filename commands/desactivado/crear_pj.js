// commands/crear_pj.js
const fs = require("fs");
const path = require("path");
const sessions = require("../sessions");

// util: obtener texto del mensaje (puedes adaptarlo si tienes helper en index)
function extractTextFromMsg(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    ""
  );
}

// sanitizar nombre para usar como filename (solo alfanum, minúsculas, sin espacios)
// y truncar para 10 chars, si existe archivo intenta añadir sufijo numérico
function generateFilename(baseName) {
  const dir = path.join(__dirname, "..", "data", "characters");
  fs.mkdirSync(dir, { recursive: true });

  // normalizar: quitar no alfanuméricos y espacios, pasar a minúsculas
  let base = baseName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  if (!base) base = "pj";
  base = base.slice(0, 10);

  let candidate = base;
  let i = 1;
  while (fs.existsSync(path.join(dir, candidate + ".json"))) {
    // intenta ajustar para mantener ≤10 chars:
    const suffix = String(i);
    const allowedLen = 10 - suffix.length;
    candidate = base.slice(0, allowedLen) + suffix;
    i++;
    if (i > 999) break;
  }
  return candidate;
}

function saveCharacterToFile(charObj) {
  const dir = path.join(__dirname, "..", "data", "characters");
  fs.mkdirSync(dir, { recursive: true });

  // preparar objeto a guardar (puedes filtrar o añadir campos aquí)
  const toSave = {
    name: charObj.name,
    personality: charObj.personality,
    history: charObj.history,
    race: charObj.race,
    skill1: charObj.skill1,
    skill2: charObj.skill2,
    skill3: charObj.skill3,
    stats: charObj.stats,
    owner: charObj.owner || null,
    created_at: new Date().toISOString()
  };

  const filename = generateFilename(charObj.name);
  const filepath = path.join(dir, filename + ".json");
  fs.writeFileSync(filepath, JSON.stringify(toSave, null, 2), "utf8");
  return `data/characters/${filename}.json`;
}

/*
 STEPS:
 0: pedir name
 1: personality
 2: history
 3: race
 4: skill1 (Formato: Nombre: descripcion)
 5: skill2
 6: skill3
 7..13: estadisticas (7 items)
 14: validacion suma stats / reingreso
 15: confirmación y guardado
*/

const steps = [
  { key: "name", prompt: "📛 Indica el *nombre* del personaje sin espacios \n(archivo máximo 10 caracteres):" },
  { key: "personality", prompt: "🧠 Describe la *personality* (una o dos líneas):" },
  { key: "history", prompt: "📜 Cuenta la *history*/trasfondo del personaje:" },
  { key: "race", prompt: "🧬 Indica la *race* del personaje:" },
  { key: "skill1", prompt: "🛠️ Habilidad 1 — formato: NombreHabilidad: descripcion" },
  { key: "skill2", prompt: "🛠️ Habilidad 2 — formato: NombreHabilidad: descripcion" },
  { key: "skill3", prompt: "🛠️ Habilidad 3 — formato: NombreHabilidad: descripcion" },
];

const statKeys = [
  { key: "fuerza", label: "Fuerza" },
  { key: "resistencia", label: "Resistencia" },
  { key: "resistencia_cond", label: "Resistencia a condiciones" },
  { key: "velocidad", label: "Velocidad" },
  { key: "reflejos", label: "Reflejos" },
  { key: "velocidad_ataque", label: "Velocidad de ataque" },
  { key: "fulgor", label: "Fulgor" }
];

module.exports = {
  name: "crear_pj",
  description: "Inicia la creación interactiva de un personaje",
  category: "administracion",

  async execute(sock, msg) {
    // userId = participante real en grupo, o remoteJid en privado
    const userId = msg.key.participant || msg.key.remoteJid;
    const from = msg.key.remoteJid; // chat donde responder

    // iniciar sesión para este usuario
    sessions.startSession(userId, "crear_pj");

    // enviar primer prompt al chat
    await sock.sendMessage(from, {
      text:
        "Has iniciado la creación de personaje. Puedes escribir *back* para retroceder, *cancel* para cancelar.\n\n" +
        steps[0].prompt
    });
  },

  // handleFlow: procesa respuestas mientras la sesión está activa
  async handleFlow(session, text, sock, msg) {
    const from = msg.key.remoteJid;
    const userId = msg.key.participant || msg.key.remoteJid;

    const lower = text.trim();

    // comandos globales dentro del flujo
    if (lower.toLowerCase() === "cancel") {
      sessions.deleteSession(userId);
      await sock.sendMessage(from, { text: "❌ Creación cancelada." });
      return;
    }

    if (lower.toLowerCase() === "back") {
      // retrocede un paso
      if (session.step === 0 || !session.step) {
        await sock.sendMessage(from, { text: "No hay pasos anteriores. Escribe la información solicitada o 'cancel'." });
        return;
      }
      // si estamos en stats subpasos, manejar especial
      if (session.step > 7 && session.step <= 7 + statKeys.length) {
        // retroceder a la etapa previa de stats o a la última habilidad
        session.step -= 1;
        sessions.updateSession(userId, session);
      } else {
        session.step -= 1;
        sessions.updateSession(userId, session);
      }
      // reenviar prompt del paso actual
      await sendPromptForStep(sock, from, session);
      return;
    }

    // manejar respuesta según step
    // session.step indica índice lógico:
    // 0..6 => steps[]
    // 7..13 => stats (7 items)
    // 14 => validacion
    // 15 => confirm
    let stepNum = session.step;
    if (typeof stepNum === "undefined" || stepNum === null) stepNum = 0;

    if (stepNum >= 0 && stepNum <= 6) {
      const s = steps[stepNum];
      // validar habilidades formato en pasos 4,5,6
      if (s.key.startsWith("skill")) {
        if (!text.includes(":")) {
          await sock.sendMessage(from, { text: "Formato inválido. Usa: NombreHabilidad: descripcion\n" + s.prompt });
          return;
        }
        const [name, desc] = text.split(":").map(p => p.trim());
        if (!name || !desc) {
          await sock.sendMessage(from, { text: "Formato inválido. Asegúrate de 'Nombre: descripción'." });
          return;
        }
        session.data = session.data || {};
        session.data[s.key] = { name, description: desc };
      } else if (s.key === "name") {
        // name validation len>0
        const nm = text.trim();
        if (!nm) {
          await sock.sendMessage(from, { text: "El nombre no puede estar vacío. " + s.prompt });
          return;
        }
        session.data = session.data || {};
        session.data.name = nm;
      } else {
        // personality, history, race
        session.data = session.data || {};
        session.data[s.key] = text.trim();
      }

      session.step = (session.step || 0) + 1;
      sessions.updateSession(userId, session);

      // next prompt:
      if (session.step <= 6) {
        await sock.sendMessage(from, { text: steps[session.step].prompt });
        return;
      } else {
        // empezar stats
        session.step = 7; // stats first index marker (we'll treat 7..13)
        sessions.updateSession(userId, session);
        await sock.sendMessage(from, { text: `📊 Ahora ingresa las estadísticas del personaje. Deben sumar exactamente *700* puntos.\nVamos por: ${statKeys[0].label} (escribe un número entero):` });
        return;
      }
    }

    // stats handling
    if (stepNum >= 7 && stepNum <= 13) {
      const statIndex = stepNum - 7; // 0..6
      const statKey = statKeys[statIndex].key;
      const val = parseInt(text.trim(), 10);
      if (isNaN(val) || val < 0) {
        await sock.sendMessage(from, { text: `Valor inválido. ${statKeys[statIndex].label} requiere un número entero >= 0.` });
        return;
      }
      session.data = session.data || {};
      session.data.stats = session.data.stats || {};
      session.data.stats[statKey] = val;

      // avanzar paso
      session.step += 1;
      sessions.updateSession(userId, session);

      if (session.step <= 13) {
        // pedir siguiente stat
        const nextIndex = session.step - 7;
        await sock.sendMessage(from, { text: `Siguiente: ${statKeys[nextIndex].label} (número entero):` });
        return;
      } else {
        // ya se ingresaron todas las stats; validar suma
        const statsObj = session.data.stats || {};
        const sum = Object.values(statsObj).reduce((a, b) => a + b, 0);
        if (sum !== 700) {
          // permitir reingresar todas stats o retroceder
          await sock.sendMessage(from, { text: `⚠️ La suma de todas las estadísticas es *${sum}* (debe ser exactamente 700).\nEscribe *back* para retroceder y corregir, o escribe *reingresar stats* para introducir todas las estadísticas de nuevo desde el principio.` });
          // set a special flag to allow reingreso: step = 14 as a validation hold
          session.step = 14;
          sessions.updateSession(userId, session);
          return;
        } else {
          // continuar a confirmación
          session.step = 15; // confirm step
          sessions.updateSession(userId, session);
          // mostrar resumen y pedir confirmación
          const summary = buildSummary(session.data);
          await sock.sendMessage(from, { text: summary + "\n\n¿Confirmas y guardo la ficha? Escribe *yes* para confirmar, *back* para corregir o *cancel* para cancelar." });
          return;
        }
      }
    }

    // step 14: after invalid sum - user can type 'reingresar stats' or back
    if (stepNum === 14) {
      if (lower.toLowerCase() === "reingresar stats") {
        // reiniciar stats
        session.data = session.data || {};
        session.data.stats = {};
        session.step = 7;
        sessions.updateSession(userId, session);
        await sock.sendMessage(from, { text: `Reingreso de estadísticas iniciado.\n${statKeys[0].label}:` });
        return;
      } else {
        await sock.sendMessage(from, { text: "Opción no reconocida. Escribe *reingresar stats* para volver a introducir estadísticas, *back* para retroceder o *cancel*." });
        return;
      }
    }

    // confirm step (15)
    if (stepNum === 15) {
      if (lower.toLowerCase() === "yes" || lower.toLowerCase() === "si" || lower.toLowerCase() === "confirm") {
        // agregar owner y guardar
        try {
          // asegurar owner (número/jid del usuario)
          session.data.owner = userId;
          const filepath = saveCharacterToFile(session.data);
          await sock.sendMessage(from, { text: `✅ Personaje guardado en ${filepath}` });
        } catch (e) {
          console.error("Error guardando personaje:", e);
          await sock.sendMessage(from, { text: "❌ Ocurrió un error al guardar la ficha." });
          return;
        }
        sessions.deleteSession(userId);
        return;
      } else {
        await sock.sendMessage(from, { text: "Escribe *yes* para confirmar, *back* para volver a modificar, o *cancel* para cancelar." });
        return;
      }
    }

    // por defecto
    await sock.sendMessage(from, { text: "No entendí la entrada. Usa 'back', 'cancel' o sigue la instrucción solicitada." });
  }
};

// helper: construir resumen bonito
function buildSummary(data) {
  let s = "📗 *Resumen del personaje*\n\n";
  s += `*Nombre:* ${data.name}\n`;
  s += `*personality:* ${data.personality}\n`;
  s += `*history:* ${data.history}\n`;
  s += `*race:* ${data.race}\n\n`;

  s += `*Habilidades:*\n`;
  s += `1) ${data.skill1.name}: ${data.skill1.description}\n`;
  s += `2) ${data.skill2.name}: ${data.skill2.description}\n`;
  s += `3) ${data.skill3.name}: ${data.skill3.description}\n\n`;

  s += `*Estadísticas:*\n`;
  const st = data.stats || {};
  for (const sk of statKeys) {
    s += `• ${sk.label}: ${st[sk.key] ?? 0}\n`;
  }
  const total = Object.values(st).reduce((a, b) => a + b, 0);
  s += `\n*Total:* ${total} (debe ser 700)`;
  return s;
}

// helper para reenviar prompt según step (usado en 'back')
async function sendPromptForStep(sock, from, session) {
  const stp = session.step;
  if (stp >= 0 && stp <= 6) {
    await sock.sendMessage(from, { text: steps[stp].prompt });
    return;
  }
  if (stp >= 7 && stp <= 13) {
    const idx = stp - 7;
    await sock.sendMessage(from, { text: `📊 Ingresa: ${statKeys[idx].label}` });
    return;
  }
  if (stp === 14) {
    await sock.sendMessage(from, { text: "⚠️ La suma de estadísticas no es 700. Escribe 'reingresar stats' o 'back'." });
    return;
  }
  if (stp === 15) {
    const summary = buildSummary(session.data);
    await sock.sendMessage(from, { text: summary + "\n\nEscribe 'yes' para confirmar, 'back' para modificar o 'cancel' para cancelar." });
    return;
  }
}

