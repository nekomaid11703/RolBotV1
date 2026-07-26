// @ts-nocheck
const { createCharacter, setActiveCharacter } = require("../../../services/characterService");
/**
 * @constant {
  MAX_CHARACTER_NAME_LENGTH,
  LEVELABLE_STATS,
  FREE_POINTS_AT_CREATION,
  RACES,
}
 * @type {any}
 */
const {
  MAX_CHARACTER_NAME_LENGTH,
  LEVELABLE_STATS,
  FREE_POINTS_AT_CREATION,
  RACES,
} = require("../../../config/characterConfig");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandForm } = require("../../../utils/formatCommandUtils");
const { listarClases, validarClase } = require("../../../data/clases");

/**
 * @constant LABEL_TO_KEY
 * @type {object}
 */
const LABEL_TO_KEY = {};
for (const [key, cfg] of Object.entries(LEVELABLE_STATS)) {
  LABEL_TO_KEY[cfg.label.toLowerCase()] = key;
  LABEL_TO_KEY[key.toLowerCase()] = key;
}

/**
 * @param input
 * @returns
 */
function validarRaza(input) {
  if (!input || typeof input !== "string") return null;
  /**
   * @constant normalized
   */
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim();
  for (const [id, race] of Object.entries(RACES)) {
    /**
     * @constant raceKey
     */
    const raceKey = id.toLowerCase();
    /**
     * @constant raceName
     */
    const raceName = race.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    if (normalized === raceKey || normalized === raceName) return id;
    if (Array.isArray(race.aliases)) {
      for (const alias of race.aliases) {
        /**
         * @constant normAlias
         */
        const normAlias = alias
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "");
        if (normalized === normAlias) return id;
      }
    }
  }
  return null;
}

/**
 * @param input
 * @returns
 */
function resolverSeleccionRaza(input) {
  /**
   * @constant clean
   */
  const clean = (input || "").replace(/[.\s)\]]/g, "").trim();
  if (/^\d+$/.test(clean)) {
    /**
     * @constant idx
     */
    const idx = parseInt(clean, 10) - 1;
    /**
     * @constant keys
     */
    const keys = Object.keys(RACES);
    if (idx >= 0 && idx < keys.length) return keys[idx];
  }
  return validarRaza(clean);
}

/**
 * @param line
 * @returns
 */
function parseStatLine(line) {
  /**
   * @constant trimmed
   */
  const trimmed = (line || "").trim();
  /**
   * @constant stat
   */
  const stat = trimmed.match(/^(HP|ATK|ASPD|MSPD|REF|DEF|FULGOR|D_FULGOR|R_FULGOR)/i);
  if (!stat) return null;
  /**
   * @constant rest
   */
  const rest = trimmed.slice(stat[0].length).trim();
  /**
   * @constant pointsMatch
   */
  const pointsMatch = rest.match(/^\((\d+)\)\s*:\s*(\d+)$|^:\s*(\d+)$/);
  if (!pointsMatch) return null;
  /**
   * @constant match
   * @type {Array}
   */
  const match = [stat[0], stat[1], pointsMatch[1], pointsMatch[2] || pointsMatch[3]];
  if (!match) return null;
  /**
   * @constant label
   */
  const label = match[1].toLowerCase();
  /**
   * @constant key
   */
  const key = LABEL_TO_KEY[label];
  if (!key) return null;
  /**
   * @constant value
   */
  const value = parseInt(match[3], 10);
  if (!Number.isFinite(value) || value < 0) return null;
  return { key, value };
}

/**
 * @param raceConfig
 * @returns
 */
function buildRaceSummary(raceConfig) {
  return Object.entries(LEVELABLE_STATS)
    .map(([key, cfg]) => `${cfg.label}(${raceConfig.baseStats[key] || 0})`)
    .join("  ");
}

/**
 * @param raceConfig
 * @returns
 */
function buildTemplate(raceConfig) {
  /**
   * @constant c
   */
  const c = raceConfig;
  /**
   * @constant clases
   */
  const clases = listarClases()
    .map((cls) => cls.name)
    .join(", ");
  /**
   * @constant statFields
   */
  const statFields = Object.entries(LEVELABLE_STATS).map(([key, cfg]) => `${cfg.label}(${c.baseStats[key] || 0})`);
  return formatCommandForm({
    icon: "🎭",
    title: "Crear personaje",
    description: `Plantilla para ${c.name}. Completa los datos y envíalos de vuelta.`,
    command: "/crear_pj",
    fields: ["Nombre", `Raza: ${c.name}`, "Clase", ...statFields, "Historia"],
    example: [
      "/crear_pj",
      "Nombre: Aelin",
      `Raza: ${c.name}`,
      "Clase: Aventurero",
      ...Object.entries(LEVELABLE_STATS).map(
        ([key, cfg]) => `${cfg.label}(${c.baseStats[key] || 0}): ${c.baseStats[key] || 0}`,
      ),
      "Historia: Una viajera que vaga por el mundo",
      "nacio en las montanas nevadas y pasa sus dias vagando.",
    ],
    notes: [
      `Nombre: 2-${MAX_CHARACTER_NAME_LENGTH} caracteres.`,
      `Stats base de ${c.name} (entre paréntesis): ${buildRaceSummary(c)}`,
      `Tienes ${FREE_POINTS_AT_CREATION} puntos libres para distribuir.`,
      "Stats opcionales: si no las envías, se reparten uniformemente.",
      `Clases disponibles: ${clases}.`,
      "Historia: al final del mensaje, tan larga como quieras.",
    ],
  });
}

/**
 * @returns
 */
function buildRaceList() {
  /**
   * @constant raceIds
   */
  const raceIds = Object.keys(RACES);
  /**
   * @constant lines
   */
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

/**
 * Appends the historia line.
 * @param historia - - historia.
 * @param trimmed - - trimmed.
 * @param firstLine - - first line.
 * @returns
 */
function appendHistoriaLine(historia, trimmed, firstLine) {
  return firstLine ? trimmed : historia + "\n" + trimmed;
}

/**
 * Try start historia.
 * @param trimmed - - trimmed.
 * @returns
 */
function tryStartHistoria(trimmed) {
  if (!/^Historia/i.test(trimmed)) return null;
  /**
   * @constant rest
   */
  const rest = trimmed.replace(/^Historia[^:]*:\s*/i, "");
  return { text: rest, isFirstLine: !rest };
}

/**
 * Try parse name.
 * @param trimmed - - trimmed.
 * @param currentName - - current display name.
 * @returns
 */
function tryParseName(trimmed, currentName) {
  /**
   * @constant m
   */
  const m = trimmed.match(/^Nombre:\s*(.+)/i);
  if (m && !currentName) return m[1].trim();
  return null;
}

/**
 * Try parse race.
 * @param trimmed - - trimmed.
 * @param currentRawInput - - current raw input value.
 * @returns
 */
function tryParseRace(trimmed, currentRawInput) {
  /**
   * @constant m
   */
  const m = trimmed.match(/^Raza:\s*(.+)/i);
  if (m && !currentRawInput) return m[1].trim();
  return null;
}

/**
 * Try parse class.
 * @param trimmed - - trimmed.
 * @param currentClass - - current class.
 * @returns
 */
function tryParseClass(trimmed, currentClass) {
  /**
   * @constant m
   */
  const m = trimmed.match(/^Clase:\s*(.+)/i);
  if (m && !currentClass) return m[1].trim();
  return null;
}

/**
 * Parses the form lines.
 * @param lines - - lines.
 * @returns
 */
function parseFormLines(lines) {
  /**
   * @variable name
   * @type {string}
   */
  let name = "";
  /**
   * @variable raza
   * @type {string}
   */
  let raza = "";
  /**
   * @variable rawRazaInput
   * @type {string}
   */
  let rawRazaInput = "";
  /**
   * @variable clase
   * @type {string}
   */
  let clase = "";
  /**
   * @constant statDistribution
   * @type {object}
   */
  const statDistribution = {};
  /**
   * @variable hasCustomStats
   * @type {boolean}
   */
  let hasCustomStats = false;
  /**
   * @variable historia
   * @type {string}
   */
  let historia = "";
  /**
   * @variable historiaStarted
   * @type {boolean}
   */
  let historiaStarted = false;
  /**
   * @variable historiaFirstLine
   * @type {boolean}
   */
  let historiaFirstLine = true;

  for (const rawLine of lines) {
    /**
     * @constant trimmed
     */
    const trimmed = (rawLine || "").trim();

    if (historiaStarted) {
      historia = appendHistoriaLine(historia, trimmed, historiaFirstLine);
      historiaFirstLine = false;
      continue;
    }

    /**
     * @constant historiaMatch
     */
    const historiaMatch = tryStartHistoria(trimmed);
    if (historiaMatch) {
      historiaStarted = true;
      historia = historiaMatch.text;
      historiaFirstLine = historiaMatch.isFirstLine;
      continue;
    }

    /**
     * @constant parsedName
     */
    const parsedName = tryParseName(trimmed, name);
    if (parsedName) {
      name = parsedName;
      continue;
    }

    /**
     * @constant parsedRace
     */
    const parsedRace = tryParseRace(trimmed, rawRazaInput);
    if (parsedRace) {
      rawRazaInput = parsedRace;
      raza = validarRaza(parsedRace);
      continue;
    }

    /**
     * @constant parsedClass
     */
    const parsedClass = tryParseClass(trimmed, clase);
    if (parsedClass) {
      clase = parsedClass;
      continue;
    }

    /**
     * @constant parsed
     */
    const parsed = parseStatLine(trimmed);
    if (parsed) {
      hasCustomStats = true;
      statDistribution[parsed.key] = parsed.value;
    }
  }

  return { name, raza, rawRazaInput, clase, statDistribution, hasCustomStats, historia };
}

/**
 * Validates the form.
 * @param form - - form.
 * @param raceConfig - - race configuration object.
 * @throws {Error}
 * @returns
 */
function validateForm(form, raceConfig) {
  if (!form.name) {
    return formatError("Debes incluir el Nombre.", buildRaceList());
  }

  if (form.name.length < 2 || form.name.length > MAX_CHARACTER_NAME_LENGTH) {
    throw new Error(`El nombre debe tener entre 2 y ${MAX_CHARACTER_NAME_LENGTH} caracteres.`);
  }

  if (form.rawRazaInput && !form.raza) {
    return formatError(
      `Raza "${form.rawRazaInput}" no válida. Razas disponibles: ` +
        Object.values(RACES)
          .map((r) => r.name)
          .join(", "),
      buildRaceList(),
    );
  }

  if (!raceConfig) {
    return formatError(
      "Raza no válida. Razas disponibles: " +
        Object.values(RACES)
          .map((r) => r.name)
          .join(", "),
      buildRaceList(),
    );
  }

  if (!form.clase) {
    return formatError(
      "Debes especificar una clase. Clases disponibles: " +
        listarClases()
          .map((c) => c.name)
          .join(", "),
      buildTemplate(raceConfig),
    );
  }

  if (!form.historia) {
    return formatError("Debes escribir una historia para tu personaje.", buildTemplate(raceConfig));
  }

  if (form.hasCustomStats) {
    /**
     * @constant assignedPoints
     */
    const assignedPoints = Object.values(form.statDistribution).reduce((a, b) => a + (Number(b) || 0), 0);
    if (assignedPoints !== FREE_POINTS_AT_CREATION) {
      return formatError(
        `Has asignado ${assignedPoints} puntos libres. Deben ser exactamente ${FREE_POINTS_AT_CREATION}.`,
        buildTemplate(raceConfig),
      );
    }
  }

  return null;
}

/**
 * Resolves the stat distribution.
 * @param hasCustomStats - - has custom stats.
 * @param statDistribution - - stat distribution.
 * @returns
 */
function resolveStatDistribution(hasCustomStats, statDistribution) {
  if (hasCustomStats) {
    return statDistribution;
  }
  /**
   * @constant uniform
   */
  const uniform = Math.floor(FREE_POINTS_AT_CREATION / Object.keys(LEVELABLE_STATS).length);
  /**
   * @variable remainder
   * @type {any}
   */
  let remainder = FREE_POINTS_AT_CREATION;
  /**
   * @constant result
   * @type {object}
   */
  const result = {};
  for (const key of Object.keys(LEVELABLE_STATS)) {
    /**
     * @constant assign
     */
    const assign = remainder > uniform ? uniform : remainder;
    result[key] = assign;
    remainder -= assign;
  }
  return result;
}

/**
 * Builds a character created box.
 * @param character - - character.
 * @param raceConfig - - race configuration object.
 * @returns
 */
function buildCharacterCreatedBox(character, raceConfig) {
  /**
   * @constant statSummary
   */
  const statSummary = Object.entries(LEVELABLE_STATS)
    .map(([key, cfg]) => `${cfg.label}: ${character.stats[key] || 0}`)
    .join("  ");
  return box("🎉 Personaje creado", [
    "",
    `👤  ${character.name.toUpperCase()}`,
    `🎖️  ${raceConfig.name} · ${character.clase}  ·  Nivel ${character.nivel}`,
    "",
    `📊  ${statSummary}`,
    "",
    `💡 Usa /ver_pj para ver tu perfil completo`,
  ]);
}

module.exports = {
  name: "crear_pj",
  aliases: ["cpj"],
  description: "Crea un personaje mediante un formulario simple.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant fullText
     */
    const fullText = ctx.text.trim();

    if (ctx.args.length === 0) {
      return ctx.reply(buildRaceList());
    }

    /**
     * @constant content
     */
    const content = fullText.replace(/^\/\S+\s*/, "").trim();

    if (!content.includes("\n") && !content.includes(":")) {
      /**
       * @constant raceId
       */
      const raceId = resolverSeleccionRaza(ctx.args.join(" "));
      if (raceId) {
        return ctx.reply(buildTemplate(RACES[raceId]));
      }
    }

    try {
      /**
       * @constant form
       */
      const form = parseFormLines(fullText.split("\n"));
      /**
       * @constant raceKeys
       */
      const raceKeys = Object.keys(RACES);
      /**
       * @constant raceId
       */
      const raceId = form.raza || raceKeys[0];
      /**
       * @constant raceConfig
       */
      const raceConfig = RACES[raceId];

      /**
       * @constant validationError
       */
      const validationError = validateForm(form, raceConfig);
      if (validationError) {
        return ctx.reply(validationError);
      }

      /**
       * @constant claseId
       */
      const claseId = form.clase
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (!validarClase(claseId)) {
        return ctx.reply(formatError(`Clase "${form.clase}" no válida.`, buildTemplate(raceConfig)));
      }

      /**
       * @constant statDistribution
       */
      const statDistribution = resolveStatDistribution(form.hasCustomStats, form.statDistribution);

      /**
       * @constant character
       */
      const character = await createCharacter({
        creatorId: ctx.sender,
        creatorName: ctx.userName,
        characterName: form.name,
        raza: raceId,
        clase: claseId,
        statDistribution,
        historia: form.historia,
      });

      await setActiveCharacter({
        targetCreatorId: ctx.sender,
        targetCreatorName: ctx.userName,
        characterName: form.name,
        requesterId: ctx.sender,
        requesterIsAdmin: false,
      });

      await ctx.react("🎉");

      await ctx.reply(buildCharacterCreatedBox(character, raceConfig));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
