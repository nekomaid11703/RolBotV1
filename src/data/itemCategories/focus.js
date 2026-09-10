// @ts-nocheck
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Módulo de Foco (báculo/varita).
 *
 * El foco canaliza hasta N hechizos "cargados" (spellIds) y su `canalizeScale`
 * aporta el término plano/multiplicador al canal mágico. Aquí vive la
 * obsolescencia programada (P2): la habilidad NO caduca, el foco sí — un foco
 * viejo se queda corto y la progresión pasa por forjar/ganar focos mejores.
 */
class FocusModule extends ModuleBase {
  static type = "focus";
  static triggers = ["Attack"];

  constructor(config = {}) {
    super(config);
    this.slotHeld = config.slotHeld || "1h"; // 1h | 2h
    this.spellIds = Array.isArray(config.spellIds) ? config.spellIds : [];
    this.canalizeScale = Number(config.canalizeScale) || 1;
    this.tier = config.tier || "E";
  }

  /**
   * Payload del foco al atacar: canaliza los hechizos cargados.
   * @param {object} [_context] - Contexto de ataque
   * @returns {object} Payload del foco
   */
  onAttack(_context) {
    return {
      type: "focus",
      slotHeld: this.slotHeld,
      spellIds: [...this.spellIds],
      canalizeScale: this.canalizeScale,
      tier: this.tier,
    };
  }
}

module.exports = FocusModule;
