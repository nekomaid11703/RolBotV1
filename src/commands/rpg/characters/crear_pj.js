// @ts-nocheck
const { createCharacter, setActiveCharacter } = require("../../../services/characterService");
const {
  MAX_CHARACTER_NAME_LENGTH,
  LEVELABLE_STATS,
  FREE_POINTS_AT_CREATION,
  RACES,
} = require("../../../config/characterConfig");
const { formatCommandForm, formatError, box } = require("../../../utils/messageFormatUtils");
const { listarClases } = require("../../../data/clases");

const LABEL_TO_KEY = {};
for (const [key, cfg] of Object.entries(LEVELABLE_STATS)) {
  LABEL_TO_KEY[cfg.label.toLowerCase()] = key;
  LABEL_TO_KEY[key.toLowerCase()] = key;
}

/**
 *
 * @param input
 */
function validarRaza(input) {
  if (!input || typeof input !== "string") return null;
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim();
  for (const [id, race] of Object.entries(RACES)) {
    const raceKey = id.toLowerCase();
    const raceName = race.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    if (normalized === raceKey || normalized === raceName) return id;
  }
  return null;
}

/**
 *
 * @param input
 */
function resolverSeleccionRaza(input) {
  const clean = (input || "").replace(/[.\s)\]]/g, "").trim();
  if (/^\d+$/.test(clean)) {
    const idx = parseInt(clean, 10) - 1;
    const keys = Object.keys(RACES);
    if (idx >= 0 && idx < keys.length) return keys[idx];
  }
  return validarRaza(clean);
}

/**
 *
 * @param line
 */
function parseStatLine(line) {
  const trimmed = (line || "").trim();
  const match = trimmed.match(/^(STR|SPD_ATK|SPD_MOV|REF|DEF)\s*(?:\((\d+)\))?\s*:\s*(\d+)\s*$/i);
  if (!match) return null;
  const label = match[1].toLowerCase();
  const key = LABEL_TO_KEY[label];
  if (!key) return null;
  const value = parseInt(match[3], 10);
  if (!Number.isFinite(value) || value < 0) return null;
  return { key, value };
}

/**
 *
 * @param raceConfig
 */
function buildRaceSummary(raceConfig) {
  return Object.entries(LEVELABLE_STATS)
    .map(([key, cfg]) => `${cfg.label}(${raceConfig.baseStats[key] || 0})`)
    .join("  ");
}

/**
 *
 * @param raceConfig
 */
function buildTemplate(raceConfig) {
  const c = raceConfig;
  const clases = listarClases()
    .map((cls) => cls.name)
    .join(", ");
  const camposStat = Object.entries(LEVELABLE_STATS)
    .map(([key, cfg]) => `${cfg.label}(${c.baseStats[key] || 0}): `)
    .join("\n");
  return formatCommandForm({
    icon: "🎭",
    title: "Crear personaje",
    description: `Plantilla para ${c.name}. Completa los datos y envíalos de vuelta.`,
    command: "/crear_pj",
    fields: [
      "Nombre",
      `Raza: ${c.name}`,
      "Clase (" + clases + ")",
      camposStat,
      "Historia y detalles: (al final, saltos de línea permitidos)",
    ],
    example: [
      "/crear_pj",
      "Nombre: Aelin",
      `Raza: ${c.name}`,
      "Clase: Aventurero",
      "STR(2): 2",
      "SPD_ATK(2): 3",
      "SPD_MOV(2): 2",
      "REF(2): 2",
      "DEF(2): 1",
      "Historia y detalles: Una viajera que vaga por el mundo",
      "nacio en las montañas nevadas y pasa sus dias vagando.",
    ],
    notes: [
      `Nombre: 2-${MAX_CHARACTER_NAME_LENGTH} caracteres.`,
      `Stats base de ${c.name} (entre paréntesis): ${buildRaceSummary(c)}`,
      `Tienes ${FREE_POINTS_AT_CREATION} puntos libres para distribuir.`,
      "Stats opcionales: si no las envías, se reparten uniformemente.",
      "Historia al final, tan larga como quieras.",
    ],
  });
}

/**
 *
 */
function buildRaceList() {
  const raceIds = Object.keys(RACES);
  const lines = raceIds.map((id, i) => `${i + 1}. ${RACES[id].name} — ${RACES[id].description}`);
  return box("🌍 Escoge tu raza", [
    "",
    "Escribe el número o nombre de la raza:",
    "",
    ...lines,
    "",
    "Ej: /crear_pj 1   o   /crear_pj humano",
  ]);
}

module.exports = {
  name: "crear_pj",
  aliases: ["cpj"],
  description: "Crea un personaje mediante un formulario simple.",
  category: "personajes",

  async execute(ctx) {
    const fullText = ctx.text.trim();

    if (ctx.args.length === 0) {
      return ctx.reply(buildRaceList());
    }

    const content = fullText.replace(/^\/\S+\s*/, "").trim();

    if (!content.includes("\n") && !content.includes(":")) {
      const raceId = resolverSeleccionRaza(ctx.args.join(" "));
      if (raceId) {
        return ctx.reply(buildTemplate(RACES[raceId]));
      }
    }

    try {
      const lines = fullText.split("\n");

      let name = "";
      let raza = "";
      let clase = "";
      const statDistribution = {};
      let hasCustomStats = false;
      let historia = "";
      let historiaStarted = false;
      let historiaFirstLine = true;

      for (const rawLine of lines) {
        const trimmed = (rawLine || "").trim();

        if (historiaStarted) {
          if (historiaFirstLine) {
            historia += trimmed;
            historiaFirstLine = false;
          } else {
            historia += "\n" + trimmed;
          }
          continue;
        }

        if (/^Historia/i.test(trimmed)) {
          historiaStarted = true;
          const rest = trimmed.replace(/^Historia[^:]*:\s*/i, "");
          if (rest) {
            historia = rest;
            historiaFirstLine = false;
          }
          continue;
        }

        const nameMatch = trimmed.match(/^Nombre:\s*(.+)/i);
        if (nameMatch && !name) {
          name = nameMatch[1].trim();
          continue;
        }

        const raceMatch = trimmed.match(/^Raza:\s*(.+)/i);
        if (raceMatch && !raza) {
          raza = validarRaza(raceMatch[1].trim());
          continue;
        }

        const classMatch = trimmed.match(/^Clase:\s*(.+)/i);
        if (classMatch && !clase) {
          clase = classMatch[1].trim();
          continue;
        }

        const parsed = parseStatLine(trimmed);
        if (parsed) {
          hasCustomStats = true;
          statDistribution[parsed.key] = parsed.value;
        }
      }

      if (!name) {
        return ctx.reply(formatError("Debes incluir el Nombre.", buildRaceList()));
      }

      if (name.length < 2 || name.length > MAX_CHARACTER_NAME_LENGTH) {
        throw new Error(`El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`);
      }

      const raceKeys = Object.keys(RACES);
      const raceId = raza || raceKeys[0];
      const raceConfig = RACES[raceId];
      if (!raceConfig) {
        return ctx.reply(
          formatError(
            "Raza no válida. Razas disponibles: " +
              Object.values(RACES)
                .map((r) => r.name)
                .join(", "),
            buildRaceList(),
          ),
        );
      }

      if (!clase) {
        return ctx.reply(
          formatError(
            "Debes especificar una clase. Clases disponibles: " +
              listarClases()
                .map((c) => c.name)
                .join(", "),
            buildTemplate(raceConfig),
          ),
        );
      }

      const claseId = clase
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const { validarClase } = require("../../../data/clases");
      if (!validarClase(claseId)) {
        return ctx.reply(formatError(`Clase "${clase}" no válida.`, buildTemplate(raceConfig)));
      }

      if (!historia) {
        return ctx.reply(formatError("Debes escribir una historia para tu personaje.", buildTemplate(raceConfig)));
      }

      if (hasCustomStats) {
        const assignedPoints = Object.values(statDistribution).reduce((a, b) => a + (Number(b) || 0), 0);
        if (assignedPoints !== FREE_POINTS_AT_CREATION) {
          return ctx.reply(
            formatError(
              `Has asignado ${assignedPoints} puntos libres. Deben ser exactamente ${FREE_POINTS_AT_CREATION}.`,
              buildTemplate(raceConfig),
            ),
          );
        }
      } else {
        const uniform = Math.floor(FREE_POINTS_AT_CREATION / Object.keys(LEVELABLE_STATS).length);
        let remainder = FREE_POINTS_AT_CREATION;
        for (const key of Object.keys(LEVELABLE_STATS)) {
          const assign = remainder > uniform ? uniform : remainder;
          statDistribution[key] = assign;
          remainder -= assign;
        }
      }

      const character = await createCharacter({
        creatorId: ctx.sender,
        creatorName: ctx.userName,
        characterName: name,
        raza: raceId,
        clase: claseId,
        statDistribution,
        historia,
      });

      await setActiveCharacter({
        targetCreatorId: ctx.sender,
        targetCreatorName: ctx.userName,
        characterName: name,
        requesterId: ctx.sender,
        requesterIsAdmin: false,
      });

      await ctx.react("🎉");

      const statSummary = Object.entries(LEVELABLE_STATS)
        .map(([key, cfg]) => `${cfg.label}: ${character.stats[key] || 0}`)
        .join("  ");

      await ctx.reply(
        box("🎉 Personaje creado", [
          "",
          `👤  ${character.name.toUpperCase()}`,
          `🎖️  ${raceConfig.name} · ${character.clase}  ·  Nivel ${character.nivel}`,
          "",
          `📊  ${statSummary}`,
          "",
          `💡 Usa /ver_pj para ver tu perfil completo`,
        ]),
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
