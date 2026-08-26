// @ts-nocheck
const crypto = require("crypto");
const { createItemDefinition } = require("./itemFactory");
const { getMaterialCost } = require("./itemStatService");
const SpellModule = require("../../data/itemCategories/spell");
const ELEMENTS = SpellModule.ELEMENTS;
const {
  SPELL_KINDS,
  SPELL_APPLICATIONS,
  FULGOR_NATURES,
  SPELL_KIND_WEIGHTS,
  SPELL_APPLICATION_WEIGHTS,
  SPELL_DURATION_WEIGHT,
  SPELL_RESOLUTION_RULES,
  RESOLUTION_DEFAULT_TARGET_MODE,
  EFFECT_DEFS,
} = require("../../config/spellTree");
const {
  MAX_HITS_PER_SPELL,
  SPELL_POTENCIA_WEIGHT,
  SPELL_FINEZA_WEIGHT,
  SPELL_ELEMENT_POWER_WEIGHT,
  RANGE_REF,
  CAST_REF,
  CD_REF,
  RESULT_TYPE_WEIGHTS,
  SPELL_TIER_BRACKETS,
  SPELL_TIER_RULES,
  SPELL_DOMINIO_REQ,
  FULGOR_POOL_MAX,
  SPELL_NATURES,
  SPELL_ROLES,
  EFFECT_TYPES,
  EFFECT_TARGETS,
  EFFECT_WEIGHTS,
  TARGET_WEIGHTS,
  CHANNEL_BY_NATURE,
} = require("../../config/combatBalance");
const { LEVELABLE_STATS } = require("../../config/characterConfig");

/**
 * Servicio de forja de habilidades/hechizos.
 *
 * Convierte una "receta" (`validateSpellRecipe` → `buildSpellDefinition`) en una
 * `ItemDefinition` compatible con `createItemDefinition`, detecta duplicados por
 * fingerprint normalizado y permite refinamiento (progresión sin obsolescencia,
 * §11.5.5). Es POCO puro y totalmente testeable: no comunica con la DB (los items
 * forjados se persisten reutilizando el factory existente).
 */

/**
 * Normas de validación de una receta de hechizo.
 *
 * Dos modos de entrada (Fase D → árbol, retrocompat Fase B → hits):
 *  - Modo árbol: { naturaleza, subtype, role, activation, moment, effects[] }.
 *    Cada selección se valida contra la taxonomía (naturaleza→rol→efecto→target),
 *    garantizando que el hechizo sea expresable en el árbol desplegable.
 *  - Modo hits (legacy): { elements, hits[] } como en Fase B.
 *
 * @param {object} raw - Receta bruta
 * @returns {Array<{code: string, message: string}>} Lista de errores (vacía = OK)
 */
function validateSpellRecipe(raw) {
  const errors = [];
  if (!raw || typeof raw !== "object") {
    return [{ code: "RAW_INVALID", message: "La receta debe ser un objeto." }];
  }

  const hasEffects = Array.isArray(raw.effects);
  const hasHits = Array.isArray(raw.hits);
  const hasSimplified = Boolean(raw.kind);

  if (hasSimplified) {
    // ── Modo simplificado (Sistema Simplificado 2026-08-18) ──
    // Ejes: tipo de hechizo → aplicación → naturaleza de fulgor → efectos[].
    // Retrocompat: la taxonomía nueva convive con los modos árbol/hits viejos.
    if (!SPELL_KINDS[raw.kind]) {
      errors.push({ code: "KIND_UNKNOWN", message: `Tipo de hechizo desconocido: "${raw.kind}".` });
    }
    if (!SPELL_APPLICATIONS.includes(raw.application)) {
      errors.push({ code: "APPLICATION_UNKNOWN", message: `Aplicación desconocida: "${raw.application}".` });
    }
    if (!FULGOR_NATURES.includes(raw.nature)) {
      errors.push({ code: "NATURE_UNKNOWN", message: `Naturaleza de fulgor desconocida: "${raw.nature}".` });
    }
    if (raw.effects != null && !Array.isArray(raw.effects)) {
      errors.push({ code: "EFFECTS_INVALID", message: "effects debe ser un array (puede estar vacío)." });
    }
    if (Array.isArray(raw.effects) && raw.effects.length > MAX_HITS_PER_SPELL) {
      errors.push({ code: "EFFECTS_TOO_MANY", message: `Máximo ${MAX_HITS_PER_SPELL} efectos por hechizo.` });
    }
    for (const [i, ef] of (Array.isArray(raw.effects) ? raw.effects : []).entries()) {
      const def = EFFECT_DEFS[ef?.tipo];
      if (!def) {
        errors.push({ code: "EFFECT_TYPE_UNKNOWN", message: `Efecto ${i + 1}: tipo desconocido "${ef?.tipo}".` });
        continue;
      }
      if (raw.kind && !def.compatibleKinds.includes(raw.kind)) {
        errors.push({
          code: "EFFECT_FORBIDDEN_BY_KIND",
          message: `Efecto "${ef.tipo}" no compatible con el tipo de hechizo "${raw.kind}".`,
        });
      }
      if (raw.application && !def.compatibleApplications.includes(raw.application)) {
        errors.push({
          code: "EFFECT_FORBIDDEN_BY_APPLICATION",
          message: `Efecto "${ef.tipo}" no compatible con la aplicación "${raw.application}".`,
        });
      }
      const magnitude = Number(ef?.magnitude);
      if (!Number.isFinite(magnitude) || magnitude <= 0) {
        errors.push({ code: "EFFECT_MAGNITUDE_INVALID", message: `Efecto ${i + 1}: magnitud debe ser > 0.` });
      }
      if (def.duration) {
        const duration = Number(ef?.duration);
        if (!Number.isFinite(duration) || duration < 0) {
          errors.push({ code: "EFFECT_DURATION_INVALID", message: `Efecto ${i + 1}: duración inválida.` });
        }
      }
    }

    // ── Contrato §11: semántica de resolución canónica (kind × application) ──
    const resRules = SPELL_RESOLUTION_RULES[raw.kind]?.[raw.application];
    if (resRules) {
      const resolution = raw.resolution && typeof raw.resolution === "object" ? raw.resolution : {};

      // targetMode explícito: si se declara, debe estar en los permitidos para
      // la combinación. Si se omite, el constructor deriva el default.
      if (resolution.targetMode != null && !resRules.targetModes.includes(resolution.targetMode)) {
        errors.push({
          code: "TARGET_MODE_FORBIDDEN",
          message: `targetMode "${resolution.targetMode}" no permitido para "${raw.kind}" × "${raw.application}".`,
        });
      }

      // Sin daño directo: barrera, aura, buffo y proyectil propia NO portan golpes
      // ofensivos (un proyectil propia es una imbuición del arma, no un disparo).
      if (!resRules.dañoDirecto && Array.isArray(raw.hits) && raw.hits.length > 0) {
        errors.push({
          code: "DIRECT_DAMAGE_FORBIDDEN",
          message: `"${raw.kind}" (${raw.application}) no admite daño directo (hits).`,
        });
      }

      // Campos requeridos por resolución:
      if (resRules.payload.radius && !(Number(resolution.radius) > 0)) {
        errors.push({ code: "EXPLOSION_RADIUS_REQUIRED", message: `"${raw.kind}" requiere radius > 0.` });
      }
      if (resRules.payload.barrierHp && !(Number(resolution.barrierHp) > 0)) {
        errors.push({
          code: "BARRER_HP_REQUIRED",
          message: `"${raw.kind}" (${raw.application}) requiere barrierHp (durabilidad de barrera).`,
        });
      }
      if (resRules.payload.duration && !(Number(resolution.duration) > 0)) {
        errors.push({ code: "RESOLUTION_DURATION_REQUIRED", message: `"${raw.kind}" requiere duration > 0.` });
      }
      if (resRules.payload.statMods) {
        const statMods = Array.isArray(resolution.statMods) ? resolution.statMods : [];
        if (statMods.length === 0) {
          errors.push({
            code: "BUFFO_STAT_MODS_REQUIRED",
            message: `"${raw.kind}" requiere al menos una modificación de estadística (statMods).`,
          });
        }
        for (const [i, mod] of statMods.entries()) {
          if (!mod || !LEVELABLE_STATS[mod.stat]) {
            errors.push({ code: "STAT_MOD_INVALID", message: `statMods[${i}]: stat inválida "${mod?.stat}".` });
          } else if (!(Number(mod.delta) !== 0)) {
            errors.push({ code: "STAT_MOD_DELTA_INVALID", message: `statMods[${i}]: delta debe ser distinto de 0.` });
          }
        }
      }
      if (resRules.payload.imbuement) {
        // Aura y proyectil propia necesitan elemento imbuido o efecto con duración.
        const hasImbuement = Boolean(resolution.imbuement) || Boolean(raw.nature);
        const hasDurEffect = (Array.isArray(raw.effects) ? raw.effects : []).some(
          (e) => EFFECT_DEFS[e?.tipo]?.duration,
        );
        if (!hasImbuement && !hasDurEffect) {
          errors.push({
            code: "IMBUEMENT_OR_DURATION_REQUIRED",
            message: `"${raw.kind}" requiere elemento de imbuición o un efecto de duración.`,
          });
        }
      }
    }
  } else if (hasEffects) {
    // ── Modo árbol (Fase D) ──
    if (raw.effects.length === 0) {
      errors.push({ code: "EFFECTS_EMPTY", message: "El hechizo necesita al menos un efecto." });
    }
    if (raw.effects.length > MAX_HITS_PER_SPELL) {
      errors.push({ code: "EFFECTS_TOO_MANY", message: `Máximo ${MAX_HITS_PER_SPELL} efectos por hechizo.` });
    }

    const naturaleza = raw.naturaleza;
    if (!SPELL_NATURES[naturaleza]) {
      errors.push({ code: "NATURALEZA_UNKNOWN", message: `Naturaleza desconocida: "${naturaleza}".` });
    } else {
      const natura = SPELL_NATURES[naturaleza];
      if (raw.subtype != null && !natura.subtypes.includes(raw.subtype)) {
        errors.push({
          code: "SUBTYPE_UNKNOWN",
          message: `Sub-tipo "${raw.subtype}" no pertenece a la naturaleza ${naturaleza}.`,
        });
      }
      if (raw.role != null && !natura.roles.includes(raw.role)) {
        errors.push({
          code: "ROLE_FORBIDDEN_BY_NATURE",
          message: `Rol "${raw.role}" no expresable con naturaleza ${naturaleza}.`,
        });
      }
    }

    const roleRules = SPELL_ROLES[raw.role];
    if (roleRules) {
      if (raw.activation != null && !roleRules.activations.includes(raw.activation)) {
        errors.push({
          code: "ACTIVATION_FORBIDDEN_BY_ROLE",
          message: `Activación "${raw.activation}" no permitida para el rol "${raw.role}".`,
        });
      }
      if (raw.moment != null && !roleRules.moments.includes(raw.moment)) {
        errors.push({
          code: "MOMENT_FORBIDDEN_BY_ROLE",
          message: `Momento "${raw.moment}" no permitido para el rol "${raw.role}".`,
        });
      }
    }

    for (const [i, ef] of raw.effects.entries()) {
      if (!EFFECT_TYPES.includes(ef?.tipo)) {
        errors.push({ code: "EFFECT_TYPE_UNKNOWN", message: `Efecto ${i + 1}: tipo desconocido "${ef?.tipo}".` });
      } else {
        if (roleRules && !roleRules.effects.includes(ef.tipo)) {
          errors.push({
            code: "EFFECT_FORBIDDEN_BY_ROLE",
            message: `Efecto "${ef.tipo}" no permitido para el rol "${raw.role}".`,
          });
        }
        if (!(EFFECT_TARGETS[ef.tipo] || []).includes(ef.target)) {
          errors.push({
            code: "EFFECT_TARGET_INVALID",
            message: `Efecto ${i + 1} ("${ef.tipo}"): target "${ef.target}" inválido.`,
          });
        }
        const magnitude = Number(ef?.magnitude);
        if (!Number.isFinite(magnitude) || magnitude <= 0) {
          errors.push({ code: "EFFECT_MAGNITUDE_INVALID", message: `Efecto ${i + 1}: magnitud debe ser > 0.` });
        }
        if (ef.element != null && !ELEMENTS.includes(ef.element)) {
          errors.push({
            code: "EFFECT_ELEMENT_UNKNOWN",
            message: `Efecto ${i + 1}: elemento desconocido "${ef.element}".`,
          });
        }
      }
    }
  } else if (hasHits) {
    // ── Modo hits (legacy Fase B) ──
    const elements = Array.isArray(raw.elements) ? raw.elements : [];
    for (const el of elements) {
      if (!ELEMENTS.includes(el)) {
        errors.push({ code: "ELEMENT_UNKNOWN", message: `Elemento desconocido: "${el}".` });
      }
    }

    const hits = raw.hits;
    if (hits.length === 0) {
      errors.push({ code: "HITS_EMPTY", message: "El hechizo necesita al menos un hit." });
    }
    if (hits.length > MAX_HITS_PER_SPELL) {
      errors.push({ code: "HITS_TOO_MANY", message: `Máximo ${MAX_HITS_PER_SPELL} hits por hechizo.` });
    }
    for (const [i, h] of hits.entries()) {
      if (!h || (h.element && !ELEMENTS.includes(h.element))) {
        errors.push({ code: "HIT_ELEMENT_INVALID", message: `Hit ${i + 1}: elemento inválido.` });
      }
      const magnitude = Number(h?.magnitude);
      if (!Number.isFinite(magnitude) || magnitude <= 0) {
        errors.push({ code: "HIT_MAGNITUDE_INVALID", message: `Hit ${i + 1}: magnitud debe ser > 0.` });
      }
    }
  } else {
    errors.push({ code: "NO_COMPONENTS", message: "La receta necesita hits o efectos." });
  }

  const cost = raw.fulgorCost;
  // El costo de fulgor se DERIVA del costo fino (Fase D): el jugador no lo elige.
  // Si la receta lo omite, se calcula en el lab; si se provee, debe ser válido.
  if (cost !== undefined && cost !== null && cost !== "") {
    const n = Number(cost);
    if (!Number.isFinite(n) || n <= 0) {
      errors.push({ code: "FULGOR_COST_INVALID", message: "fulgorCost debe ser > 0." });
    }
  }

  // En modo árbol el canal se deriva de la naturaleza (§5); en modo hits sigue
  // validándose spellNature como en Fase B.
  if (!hasEffects && raw.spellNature !== "mágico" && raw.spellNature !== "objeto") {
    errors.push({ code: "NATURE_INVALID", message: `spellNature inválida: "${raw.spellNature}" (mágico|objeto).` });
  }

  return errors;
}

/**
 * Payload de resolución explícito de un hechizo simplificado (Contrato §11).
 * El motor NO infiere la semántica desde el nombre del hechizo: el constructor
 * normaliza y persiste `{ targetMode, radius, barrierHp, imbuement, duration,
 * statMods }` desde `recipe.resolution` (o default del kind × application).
 * También se usa en el fingerprint para detectar duplicados que difieren solo
 * en resolución.
 * @param {object} recipe - Receta con kind/application
 * @returns {object} Payload de resolución normalizado
 */
function normalizeResolution(recipe) {
  if (!recipe || !recipe.kind) return null;
  const res = recipe.resolution && typeof recipe.resolution === "object" ? recipe.resolution : {};
  const rules = SPELL_RESOLUTION_RULES[recipe.kind]?.[recipe.application] || null;
  const allowed = rules?.targetModes || [];
  const defaultMode = RESOLUTION_DEFAULT_TARGET_MODE?.[recipe.kind]?.[recipe.application] || "objetivo";
  const targetMode = allowed.includes(res.targetMode) ? res.targetMode : defaultMode;
  const statMods = Array.isArray(res.statMods) ? res.statMods.map((m) => ({ ...m })) : [];
  return {
    targetMode,
    radius: Math.max(0, Number(res.radius) || 0),
    barrierHp: Math.max(0, Number(res.barrierHp) || 0),
    imbuement: res.imbuement || null,
    duration: Math.max(0, Number(res.duration) || 0),
    statMods,
  };
}

/**
 * Fingerprint normalizado de un hechizo: hash de (naturaleza + rol + efectos
 * normalizados + recursos + spellNature/fulgorCost legacy). Dos recetas
 * idénticas colisionan (detección de duplicados, §7 spec).
 * @param {object} raw - Receta normalizada
 * @returns {string} Hash sha1 en hex
 */
function fingerprintSpell(raw) {
  const hasEffects = Array.isArray(raw?.effects);
  const hasSimplified = Boolean(raw?.kind);
  const normalized = hasSimplified
    ? {
        kind: raw.kind,
        application: raw.application,
        nature: raw.nature || null,
        effects: (raw.effects || []).map((e) => ({
          tipo: e?.tipo || null,
          magnitude: Number(e?.magnitude) || 0,
          duration: Number(e?.duration) || 0,
        })),
        resourceCost: raw.cost || null,
        castTime: Number(raw?.castTime) || 0,
        cooldown: Number(raw?.cooldown) || 0,
        range: Number(raw?.range) || 0,
        resolution: normalizeResolution(raw),
      }
    : hasEffects
      ? {
          naturaleza: raw.naturaleza || null,
          subtype: raw.subtype || null,
          role: raw.role || null,
          activation: raw.activation || null,
          moment: raw.moment || null,
          effects: (raw.effects || []).map((e) => ({
            tipo: e?.tipo || null,
            target: e?.target || null,
            element: e?.element || null,
            magnitude: Number(e?.magnitude) || 0,
            duration: Number(e?.duration) || 0,
            range: Number(e?.range) || 0,
          })),
          resourceCost: raw.cost || null,
        }
      : {
          elements: (Array.isArray(raw?.elements) ? [...raw.elements] : []).sort(),
          hits: (Array.isArray(raw?.hits) ? raw.hits : []).map((h) => ({
            element: h?.element || null,
            magnitude: Number(h?.magnitude) || 0,
          })),
          spellNature: raw?.spellNature || "mágico",
          fulgorCost: Number(raw?.fulgorCost) || 0,
        };
  return crypto.createHash("sha1").update(JSON.stringify(normalized)).digest("hex");
}

/**
 * Resuelve el nombre del tier por bracket de costoFino CRUDO (antes de descuentos).
 * @param {number} costoFino - Costo fino crudo del hechizo
 * @returns {string} Tier (E, D, C, B, A, S)
 */
function tierPorCostoFino(costoFino) {
  const n = Math.max(0, Number(costoFino) || 0);
  for (const bracket of SPELL_TIER_BRACKETS) {
    if (n <= bracket.max) return bracket.tier;
  }
  return "S";
}

/**
 * Material conceptual de los hechizos: un hechizo/habilidad NO es un objeto
 * físico (no se forja en un taller, no tiene durabilidad ni stats de material).
 * El sistema de items exige un material por temas técnicos (metadata); usamos
 * una materia etérea neutra, nunca elegible por el jugador.
 */
const SPELL_MATERIAL = "etereo";

/**
 * Rareza derivada del tier (clasificación cualitativa, no entrada manual):
 * el jugador no elige la rareza; es una etiqueta mental sobre la calidad.
 * @param {string} tier - Tier derivado del costo fino (E-S)
 * @returns {string} Rareza cualitativa
 */
function rarityPorTier(tier) {
  const map = { E: "comun", D: "poco_comun", C: "raro", B: "epico", A: "legendario", S: "mitico" };
  return map[tier] || "comun";
}

/**
 * Coste de lanzamiento derivado del costo fino (el jugador NO puede elegirlo).
 * El jugador solo controla castTime/cooldown como REDUCTORES manuales (balance de
 * costos): un casteo lento o un frío largo abaratan el lanzamiento, nunca a 0.
 * @param {number} costoFino - Costo fino crudo del hechizo
 * @param {number} [castTime] - Turnos de casteo (≥ 1)
 * @param {number} [cooldown] - Turnos de enfriamiento (≥ 0)
 * @returns {number} fulgorCost derivado (≥ FULGOR_DILUTED_MIN × costoFino)
 */
function fulgorCostDerivado(costoFino, castTime, cooldown) {
  const ct = Math.max(1, Number(castTime) || 0);
  const cd = Math.max(0, Number(cooldown) || 0);
  const raw = costoFino * (CAST_REF / ct) * (CD_REF / (CD_REF + cd));
  return Math.max(1, Math.round(raw));
}

/**
 * Calcula el costo fino de un hechizo (métrica de poder por COMPLEJIDAD).
 *
 * NO depende del daño del motor: mide cuánto "imprime información en el mundo"
 * la resolución del hechizo.
 *
 * Modo simplificado (kind presente):
 *   potencia = SPELL_KIND_WEIGHTS[kind]                  (forma de resolución)
 *            + SPELL_APPLICATION_WEIGHTS[app]            (a quién se dirige)
 *            + Σ_efectos (weight × magnitude) × (1 + min(dur,CAP)×SPELL_DURATION_WEIGHT)
 *              weight = peso del efecto en EFFECT_DEFS (base pura de potencia)
 *   fineza   = (n_efectos − 1) × 0.5 + range / RANGE_REF   (control fino)
 *   Sin efectos → solo la forma (kind + aplicación) reproduce el golpe de fulgor.
 *
 * Modo árbol (Fase D): el costo se agrega POR EFECTO genérico:
 *   potencia = Σ (EFFECT_WEIGHTS[tipo] × magnitude) + (elementos únicos − 1) × SPELL_ELEMENT_POWER_WEIGHT
 *   fineza   = TARGET_WEIGHTS[target] + (efectos − 1) + range / RANGE_REF
 * Modo hits (legacy): fórmula de Fase B sin cambios.
 *
 * Derivados (calculados, no elegibles):
 *   tier       = bracket(costoFino crudo)
 *   dominioReq = SPELL_DOMINIO_REQ[tier]
 *   fulgorCost = derivado de costoFino × f_cast(castTime) × f_cd(cooldown)
 *
 * @param {object} def - ItemDefinition de hechizo (salida de buildSpellDefinition)
 * @returns {{ potencia: number, fineza: number, costoFino: number, tier: string, rarity: string, material: string, dominioReq: number, fulgorCost: number, resultType: string }}
 * @throws {Error} Si def no tiene el módulo spell
 */
function computeSpellCost(def) {
  const spell = (def && def.modules && def.modules.spell) || null;
  if (!spell) throw new Error("computeSpellCost espera una definición con módulo spell");

  const effects = Array.isArray(spell.effects) ? spell.effects : [];
  const hits = Array.isArray(spell.hits) ? spell.hits : [];

  let potencia;
  let finezaBase;
  if (spell.kind) {
    // ── Modo simplificado (Sistema Simplificado) ──
    const DUR_CAP = 6; // la duración aporta solo hasta 6 turnos al costo
    let effectPower = 0;
    for (const e of effects) {
      const def = EFFECT_DEFS[e?.tipo];
      const w = def?.weight ?? 1;
      const mag = Number(e?.magnitude) || 0;
      const dur = Math.max(0, Number(e?.duration) || 0);
      const durMult = 1 + Math.min(dur, DUR_CAP) * SPELL_DURATION_WEIGHT;
      effectPower += w * mag * durMult;
    }
    const kindW = spell.kind ? (SPELL_KIND_WEIGHTS[spell.kind] ?? 1) : 1;
    const appW = spell.application ? (SPELL_APPLICATION_WEIGHTS[spell.application] ?? 0) : 0;
    potencia = SPELL_POTENCIA_WEIGHT * (kindW + appW + effectPower);
    finezaBase = Math.max(0, effects.length - 1) * 0.5 + (Number(spell.range) || 0) / RANGE_REF;
  } else if (effects.length > 0) {
    // ── Modo árbol (Fase D): costo por efecto genérico ──
    const byElement = new Set(effects.filter((e) => e.element != null).map((e) => e.element)).size;
    const effectMagnitude = effects.reduce(
      (acc, e) => acc + (EFFECT_WEIGHTS[e?.tipo] ?? 1) * (Number(e?.magnitude) || 0),
      0,
    );
    potencia = SPELL_POTENCIA_WEIGHT * (effectMagnitude + Math.max(0, byElement - 1) * SPELL_ELEMENT_POWER_WEIGHT);

    const primaryTarget = effects[0]?.target || "propio";
    const targetFineza = TARGET_WEIGHTS[primaryTarget] ?? 0;
    finezaBase = targetFineza + Math.max(0, effects.length - 1) + (Number(spell.range) || 0) / RANGE_REF;
  } else {
    // ── Modo hits (legacy Fase B) ──
    const elements = Array.isArray(spell.elements) ? spell.elements : [];
    const uniqueElements = new Set(elements).size;
    const totalMagnitude = hits.reduce((acc, h) => acc + (Number(h.magnitude) || 0), 0);
    potencia = SPELL_POTENCIA_WEIGHT * (totalMagnitude + Math.max(0, uniqueElements - 1) * SPELL_ELEMENT_POWER_WEIGHT);

    const resultType = spell.resultType || "destruccion";
    finezaBase =
      (RESULT_TYPE_WEIGHTS[resultType] ?? 0) + Math.max(0, hits.length - 1) + (Number(spell.range) || 0) / RANGE_REF;
  }

  const fineza = SPELL_FINEZA_WEIGHT * finezaBase;
  const costoFino = Math.round(potencia + fineza);
  let tier = tierPorCostoFino(costoFino);

  // Reglas canónicas del tier E (golpe básico): un solo elemento, sin efectos.
  // Si el costo lo ubicaría en E pero el diseño lleva efectos o multi-elemento,
  // se ajusta al tier D (la complejidad estructural lo saca del "básico").
  const elementosUnicos = new Set([
    ...(Array.isArray(spell.elements) ? spell.elements.filter(Boolean) : []),
    ...(Array.isArray(hits) ? hits.map((h) => h.element).filter(Boolean) : []),
    ...(Array.isArray(effects) ? effects.map((e) => e.element).filter(Boolean) : []),
    spell.nature,
  ]).size;
  const tierAjustadoPorReglaE = Number(tier === "E" && (effects.length > 0 || elementosUnicos > 1));
  if (tierAjustadoPorReglaE) tier = "D";

  const rarity = rarityPorTier(tier);
  const dominioReq = SPELL_DOMINIO_REQ[tier] ?? 0;
  const fulgorCost = fulgorCostDerivado(costoFino, spell.castTime, spell.cooldown);

  return {
    potencia,
    fineza,
    costoFino,
    tier,
    rarity,
    material: SPELL_MATERIAL,
    dominioReq,
    fulgorCost,
    // Balance: si el coste final ≥ la batería de un nivel máximo → canónico,
    // existe pero NO se lanza de forma natural (solo forzado/ritual).
    usableNaturalmente: fulgorCost < FULGOR_POOL_MAX,
    fulgorPoolMax: FULGOR_POOL_MAX,
    reglasTier: SPELL_TIER_RULES[tier] ?? null,
    tierAjustadoPorReglaE: Boolean(tierAjustadoPorReglaE),
    resultType: spell.resultType || "destruccion",
  };
}

/**
 * Canal de daño derivado de la NATURALEZA (regla de oro §5):
 *   material → físico (DEF); conceptual → mágico (r_fulgor); elemental → mágico.
 * El canal fija el spellNature del módulo y, en modo hits (legacy),
 * el damageNature explícito de la receta tiene prioridad.
 * @param {object} recipe - Receta { naturaleza, spellNature, damageNature, subtype }
 * @returns {{ channel: "fisico"|"magico", damageNature: string }}
 */
function deriveDamageNature(recipe) {
  if (!recipe) return { channel: "magico", damageNature: "mágico" };

  const hasEffects = Array.isArray(recipe.effects);
  if (hasEffects && recipe.naturaleza) {
    const channel = CHANNEL_BY_NATURE[recipe.naturaleza] || "magico";
    const damageNature = channel === "fisico" ? "perforante" : "mágico";
    return { channel, damageNature };
  }

  // Modo hits (legacy Fase B): se respeta el damageNature explícito (Doom = mágico).
  if (recipe.damageNature)
    return { channel: recipe.damageNature === "mágico" ? "magico" : "fisico", damageNature: recipe.damageNature };
  if (recipe.spellNature === "objeto") return { channel: "fisico", damageNature: "perforante" };
  return { channel: "magico", damageNature: "mágico" };
}

/**
 * Construye una ItemDefinition válida a partir de una receta validada.
 * Acepta el modo árbol (Fase D: naturaleza/rol/activación/momento/efectos) y el
 * modo hits (legacy Fase B). En modo árbol los efectos "dano" con elemento se
 * traducen a hits para el motor; el resto viaja en el payload de onAttack.
 * @param {object} recipe - Receta { id, name, naturaleza, role, effects, ... } | { id, name, elements, hits, ... }
 * @returns {object} ItemDefinition compatible con createItemDefinition
 * @throws {Error} Si la receta no valida
 */
function buildSpellDefinition(recipe) {
  const errors = validateSpellRecipe(recipe);
  if (errors.length > 0) {
    throw new Error(`Receta de hechizo inválida: ${errors.map((e) => e.message).join(" ")}`);
  }

  const hasEffects = Array.isArray(recipe.effects);
  const hasSimplified = Boolean(recipe.kind);
  const canal = deriveDamageNature(recipe);

  // En modo árbol, los efectos de daño con elemento alimentan los hits del motor
  // (retrocompat): el payload transporta `effects` y el motor resuelve `hits`.
  let hits = recipe.hits;
  if (hasSimplified) {
    // Sistema simplificado: el golpe de fulgor (hit) SOLO nace cuando la
    // resolución admite daño directo (§11). Barrera, aura, buffo y proyectil
    // propia NO portan golpes ofensivos. Para las resoluciones ofensivas el golpe
    // lleva la naturaleza de fulgor como elemento (canónico de reacciones:
    // fuego/agua/tierra/.../luz/oscuridad/caos) para que `resolveSpellDominante`/
    // el motor disparen reacciones sin tocar el resolver.
    const resRules = SPELL_RESOLUTION_RULES[recipe.kind]?.[recipe.application];
    const dañoDirecto = resRules?.dañoDirecto !== false;
    hits = dañoDirecto && recipe.nature ? [{ element: recipe.nature, magnitude: 1 }] : [];
  } else if (hasEffects) {
    hits = recipe.effects
      .filter((e) => e?.tipo === "dano")
      .map((e) => ({ element: e.element || null, magnitude: Number(e.magnitude) || 0 }));
  }

  // Payload de resolución explícito (Contrato §11): el motor NO infiere la
  // semántica desde el nombre del hechizo. Se deriva del kind × application y
  // se persiste tal cual en el módulo spell.
  const resolution = hasSimplified ? normalizeResolution(recipe) : null;

  const spellModule = new SpellModule({
    elements: hasSimplified && recipe.nature ? [recipe.nature] : recipe.elements,
    hits,
    fulgorCost: Number(recipe.fulgorCost) || 0,
    spellNature: canal.damageNature === "mágico" ? "mágico" : recipe.spellNature === "objeto" ? "objeto" : "mágico",
    baseDamage: Number(recipe.baseDamage) || 0,
    damageNature: canal.damageNature,
    range: Number(recipe.range) || 0,
    cooldown: Number(recipe.cooldown) || 0,
    castTime: Number(recipe.castTime) || 0,
    resultType: recipe.resultType || "destruccion",
    naturaleza: hasSimplified ? "elemental" : recipe.naturaleza || null,
    subtype: hasSimplified ? (FULGOR_NATURES.includes(recipe.nature) ? recipe.nature : null) : recipe.subtype || null,
    role: recipe.role || null,
    activation: recipe.activation || null,
    moment: recipe.moment || null,
    effects: hasEffects ? recipe.effects.map((e) => ({ ...e })) : [],
    resourceCost: recipe.cost || null,
    channel: canal.channel,
    kind: hasSimplified ? recipe.kind : null,
    application: hasSimplified ? recipe.application : null,
    nature: hasSimplified ? recipe.nature : null,
    resolution,
  });

  const definition = createItemDefinition({
    id: recipe.id,
    type: "spell",
    name: recipe.name || recipe.id,
    description: recipe.description || "",
    basePrice: Number(recipe.basePrice) || 0,
    maxStack: recipe.maxStack ?? 1,
    rarity: recipe.rarity || "comun",
    tier: recipe.tier || "E",
    material: SPELL_MATERIAL,
    categories: Array.isArray(recipe.categories) ? recipe.categories : ["spell"],
    modules: { spell: { ...spellModule.config } },
  });

  // Fase D — tier, rarity y material son DERIVADOS, no entrada manual:
  //   tier     = bracket(costoFino)        (indicador cualitativo de calidad)
  //   rarity   = etiqueta cualitativa del tier
  //   material = materia conceptual (un hechizo NO es un objeto físico)
  const costo = computeSpellCost(definition);
  definition.tier = costo.tier;
  definition.metadata.tier = costo.tier;
  definition.rarity = costo.rarity;
  definition.material = costo.material;
  definition.metadata.material = costo.material;

  // El jugador NO elige el costo de fulgor: se deriva del costo fino.
  // Si la receta lo provee (semilla Fase B Doom), se respeta; si lo omite
  // (lab), se calcula en base al costo fino recién derivado.
  if (recipe.fulgorCost === undefined || recipe.fulgorCost === null || recipe.fulgorCost === "") {
    definition.modules.spell.fulgorCost = costo.fulgorCost;
  }

  definition.fingerprint = fingerprintSpell(recipe);
  definition.cost = getMaterialCost(definition);
  return definition;
}

/**
 * Aplica un refinamiento a una definición de hechizo forjada (progresión sin
 * obsolescencia): sube magnitude de hits, baja fulgorCost y sube alcance.
 * Re-valida y re-estima el coste tras el refinamiento.
 * @param {object} def - ItemDefinition de hechizo (salida de buildSpellDefinition)
 * @param {object} [upgrade] - { magnitudeDelta, fulgorCostDelta, rangeDelta }
 * @returns {object} Nueva ItemDefinition refinada
 * @throws {Error} Si el refinamiento invalida la receta
 */
function refineSpell(def, upgrade = {}) {
  if (!def || def.type !== "spell") throw new Error("refineSpell espera una definición de hechizo");

  const spell = (def.modules && def.modules.spell) || {};
  const hits = (spell.hits || []).map((h) => ({
    element: h.element,
    magnitude: Math.max(1, Number(h.magnitude) + (Number(upgrade.magnitudeDelta) || 0)),
  }));

  const recipe = {
    ...def,
    elements: spell.elements || [],
    hits,
    fulgorCost: Math.max(1, Number(spell.fulgorCost) - (Number(upgrade.fulgorCostDelta) || 0)),
    spellNature: spell.spellNature || "mágico",
    baseDamage: Number(spell.baseDamage) || 0,
    range: Math.max(0, Number(spell.range) + (Number(upgrade.rangeDelta) || 0)),
  };

  return buildSpellDefinition(recipe);
}

/**
 * Determina la categoría canónica oficial de un hechizo (Básico, Intermedio, Avanzado, Maestro, Mítico).
 * Basado en su coste de Fulgor, requisito de dominio d_fulgor y complejidad.
 * @param {object} spellDef - Definición o receta del hechizo
 * @returns {{ key: string, category: string, label: string, desc: string, dominioReq: number, tier: string, fulgorCost: number }}
 */
function getSpellCategory(spellDef) {
  if (!spellDef) return { key: "E", category: "Básico", label: "Escaso", desc: "Golpe básico", dominioReq: 0, tier: "E", fulgorCost: 0 };

  const spell = spellDef.modules?.spell || spellDef;
  const fulgorCost = Number(spell.fulgorCost || spell.resourceCost) || 0;
  const tier = spellDef.tier || tierPorCostoFino(fulgorCost);
  const dominioReq = SPELL_DOMINIO_REQ[tier] ?? 0;

  const rule = SPELL_TIER_RULES[tier] || SPELL_TIER_RULES.E;

  let category = "Básico";
  if (tier === "E" || tier === "D") category = "Básico";
  else if (tier === "C" || tier === "B") category = "Intermedio";
  else if (tier === "A") category = "Avanzado";
  else if (tier === "S") category = "Mítico";

  return {
    key: tier,
    category,
    label: rule.label || category,
    desc: rule.desc || "",
    dominioReq,
    tier,
    fulgorCost,
  };
}

module.exports = {
  validateSpellRecipe,
  buildSpellDefinition,
  refineSpell,
  fingerprintSpell,
  computeSpellCost,
  getSpellCategory,
  tierPorCostoFino,
  rarityPorTier,
  fulgorCostDerivado,
  deriveDamageNature,
  normalizeResolution,
  SPELL_RESOLUTION_RULES,
  RESOLUTION_DEFAULT_TARGET_MODE,
  SPELL_MATERIAL,
  SPELL_TIER_BRACKETS,
  SPELL_TIER_RULES,
  FULGOR_POOL_MAX,
  ELEMENTS,
};
