// @ts-nocheck
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Elementos base del canal mágico (tabla §4 del diseño, subconjunto funcional).
 * Los primordiales (luz/oscuridad/caos) y las reacciones elementales se
 * extienden sin tocar la estructura del módulo (Fase D).
 * @constant ELEMENTS
 * @type {string[]}
 */
const ELEMENTS = ["hydro", "pyro", "geo", "anemo", "electro", "cryo"];

/**
 * Módulo de Hechizo.
 *
 * El lanzamiento se modela como un ataque de naturaleza mágica (o física si
 * `spellNature === "objeto"`): reutiliza `executeAttack`/`resolveAttackerSpeed`
 * del motor. El payload de `onAttack` transporta la lista ordenada de hits
 * (elemento + magnitud) para que la fase de reacciones (Fase D) los consuma en
 * orden; hasta entonces cada hit se aplica con su daño base.
 */
class SpellModule extends ModuleBase {
  static type = "spell";
  static triggers = ["Attack"];

  constructor(config = {}) {
    super(config);
    this.elements = Array.isArray(config.elements) ? config.elements : [];
    this.hits = Array.isArray(config.hits) ? config.hits : [];
    this.fulgorCost = Number(config.fulgorCost) || 0;
    this.spellNature = config.spellNature || "mágico"; // mágico | objeto
    this.baseDamage = Number(config.baseDamage) || 0;
    this.damageNature = config.damageNature || "mágico";
    this.range = Number(config.range) || 0;
    this.cooldown = Number(config.cooldown) || 0;
    this.castTime = Number(config.castTime) || 0;
    // Estructura del efecto (complejidad de "información impresa", independiente de
    // elemento/naturaleza): destruccion|utilidad|alteracion|ilusion|creacion.
    this.resultType = config.resultType || "destruccion";

    // Árbol de forja (Fase D): naturaleza → rol → activación/momento → efectos → recursos.
    // Retrocompat con Fase B: si solo vienen hits/elements, la taxonomía queda vacía
    // y el payload sigue emitiendo hits como antes.
    this.naturaleza = config.naturaleza || null;
    this.subtype = config.subtype || null;
    this.role = config.role || null;
    this.activation = config.activation || null;
    this.moment = config.moment || null;
    this.effects = Array.isArray(config.effects) ? config.effects.map((e) => ({ ...e })) : [];
    this.resourceCost = config.resourceCost || null;
    this.channel = config.channel || null; // fisico | magico (regla de oro §5)
  }

  /**
   * Emite el payload del lanzamiento en el evento Attack.
   * @param {object} [_context] - Contexto de ataque
   * @returns {object} Payload del hechizo
   */
  onAttack(_context) {
    return {
      type: "spell",
      elements: [...this.elements],
      hits: this.hits.map((h) => ({ ...h })),
      fulgorCost: this.fulgorCost,
      spellNature: this.spellNature,
      baseDamage: this.baseDamage,
      damageNature: this.damageNature,
      range: this.range,
      cooldown: this.cooldown,
      castTime: this.castTime,
      resultType: this.resultType,
      naturaleza: this.naturaleza,
      subtype: this.subtype,
      role: this.role,
      activation: this.activation,
      moment: this.moment,
      effects: this.effects.map((e) => ({ ...e })),
      resourceCost: this.resourceCost ? { ...this.resourceCost } : null,
      channel: this.channel,
    };
  }
}

module.exports = SpellModule;
module.exports.ELEMENTS = ELEMENTS;
