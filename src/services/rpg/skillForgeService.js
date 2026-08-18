// @ts-nocheck
const crypto = require("crypto");
const { createItemDefinition } = require("./itemFactory");
const { getMaterialCost } = require("./itemStatService");
const SpellModule = require("../../data/itemCategories/spell");
const ELEMENTS = SpellModule.ELEMENTS;
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
  SPELL_DOMINIO_REQ,
  SPELL_NATURES,
  SPELL_ROLES,
  EFFECT_TYPES,
  EFFECT_TARGETS,
  EFFECT_WEIGHTS,
  TARGET_WEIGHTS,
  CHANNEL_BY_NATURE,
} = require("../../config/combatBalance");

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

  if (hasEffects) {
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
 * Fingerprint normalizado de un hechizo: hash de (naturaleza + rol + efectos
 * normalizados + recursos + spellNature/fulgorCost legacy). Dos recetas
 * idénticas colisionan (detección de duplicados, §7 spec).
 * @param {object} raw - Receta normalizada
 * @returns {string} Hash sha1 en hex
 */
function fingerprintSpell(raw) {
  const hasEffects = Array.isArray(raw?.effects);
  const normalized = hasEffects
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
 * Calcula el costo fino de un hechizo (métrica de poder por COMPLEJIDAD, §Fase D).
 * NO depende del daño ni de la naturaleza: mide el esfuerzo de lanzarlo.
 *
 * Modo árbol (Fase D): el costo se agrega POR EFECTO genérico:
 *   potencia = Σ (EFFECT_WEIGHTS[tipo] × magnitude)  + (elementos únicos − 1) × SPELL_ELEMENT_POWER_WEIGHT
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
  if (effects.length > 0) {
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
  const tier = tierPorCostoFino(costoFino);
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
  const canal = deriveDamageNature(recipe);

  // En modo árbol, los efectos de daño con elemento alimentan los hits del motor
  // (retrocompat): el payload transporta `effects` y el motor resuelve `hits`.
  let hits = recipe.hits;
  if (hasEffects) {
    hits = recipe.effects
      .filter((e) => e?.tipo === "dano")
      .map((e) => ({ element: e.element || null, magnitude: Number(e.magnitude) || 0 }));
  }

  const spellModule = new SpellModule({
    elements: recipe.elements,
    hits,
    fulgorCost: Number(recipe.fulgorCost) || 0,
    spellNature: canal.damageNature === "mágico" ? "mágico" : recipe.spellNature === "objeto" ? "objeto" : "mágico",
    baseDamage: Number(recipe.baseDamage) || 0,
    damageNature: canal.damageNature,
    range: Number(recipe.range) || 0,
    cooldown: Number(recipe.cooldown) || 0,
    castTime: Number(recipe.castTime) || 0,
    resultType: recipe.resultType || "destruccion",
    naturaleza: recipe.naturaleza || null,
    subtype: recipe.subtype || null,
    role: recipe.role || null,
    activation: recipe.activation || null,
    moment: recipe.moment || null,
    effects: hasEffects ? recipe.effects.map((e) => ({ ...e })) : [],
    resourceCost: recipe.cost || null,
    channel: canal.channel,
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

module.exports = {
  validateSpellRecipe,
  buildSpellDefinition,
  refineSpell,
  fingerprintSpell,
  computeSpellCost,
  tierPorCostoFino,
  rarityPorTier,
  fulgorCostDerivado,
  deriveDamageNature,
  SPELL_MATERIAL,
  ELEMENTS,
};
