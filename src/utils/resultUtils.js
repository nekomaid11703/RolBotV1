// @ts-nocheck

/**
 * Crea un resultado exitoso.
 * @param {unknown} [data] - Dato opcional a retornar. Si se omite, retorna { success: true }.
 * @returns {unknown|{success: boolean}} El dato pasado o un objeto de éxito.
 */
function ok(data = undefined) {
  return data !== undefined ? data : { success: true };
}

/**
 * Crea un resultado de error.
 * @param {string} message - Mensaje descriptivo del error.
 * @returns {{error: string}} Objeto con propiedad error.
 */
function fail(message) {
  return { error: message };
}

/**
 * Verifica si un resultado es un error.
 * @param {unknown} result - Resultado a evaluar.
 * @returns {boolean} True si el resultado tiene propiedad error de tipo string.
 */
function isError(result) {
  return result && typeof result.error === "string";
}

/**
 * Desenvuelve un resultado. Si es error, lanza excepción.
 * @param {unknown} result - Resultado a desenvolver.
 * @returns {unknown} El dato interno si no es error.
 * @throws {Error} Si el resultado es un error.
 */
function unwrap(result) {
  if (isError(result)) throw new Error(result.error);
  return result;
}

module.exports = { ok, fail, isError, unwrap };
