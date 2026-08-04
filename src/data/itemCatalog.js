/**
 * Registro genérico e inyectable de definiciones de ítems.
 *
 * Desacopla el *sistema gestor* del catálogo concreto: las definiciones se
 * registran mediante funciones de carga (load) en lugar de un objeto estático.
 * Hoy el registro está vacío a propósito (no se crean ítems concretos todavía);
 * las definiciones de prueba se registran vía fixtures o se resolverán a futuro.
 */

/**
 * @constant registry
 * @type {Map<string, () => object|null>}
 */
const registry = new Map();

const itemCatalog = {
  /**
   * Registra una función capaz de devolver una definición de ítem.
   * La función se evalúa de forma perezosa para permitir fixture/proxy.
   * @param {string} id
   * @param {() => object} loader
   * @throws {Error} Si el id ya está registrado o loader no es función
   */
  register(id, loader) {
    if (!id || typeof loader !== "function") {
      throw new Error("itemCatalog.register requiere id y una función loader");
    }
    if (registry.has(id)) {
      throw new Error(`Ítem "${id}" ya registrado en el catálogo`);
    }
    registry.set(id, loader);
  },

  /**
   * Normaliza la definición de ítem (nunca se expone el loader crudo).
   * @param {string} id
   * @returns {object|null} Definición o null si no existe
   */
  load(id) {
    const loader = registry.get(id);
    if (!loader) return null;
    return loader();
  },

  /**
   * Lista de ids registrados.
   * @returns {string[]}
   */
  ids() {
    return Array.from(registry.keys());
  },

  /**
   * Elimina un ítem del registro (utilizado en fixtures/tests).
   * @param {string} id
   */
  unregister(id) {
    registry.delete(id);
  },

  /**
   * Vacía el registro (utilizado en fixtures/tests).
   */
  clear() {
    registry.clear();
  },
};

module.exports = itemCatalog;