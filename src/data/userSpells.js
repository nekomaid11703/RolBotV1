// @ts-nocheck
const fs = require("fs");
const path = require("path");
const itemCatalog = require("./itemCatalog");
const { buildSpellDefinition } = require("../services/rpg/skillForgeService");

/**
 * Carga y registra los hechizos creados por el usuario en el catálogo inyectable.
 *
 * Los hechizos construidos en el Spell Lab (`scripts/spell_lab`) se persisten como
 * recetas en `user_spells.json`. Este loader los re-monta en el arranque
 * (`getItem` / `itemCatalog.load`) para que estén listos para usarse en el motor
 * principal. Si el archivo no existe o está vacío, no hace nada.
 */

/**
 * Ruta al almacén persistente de recetas de hechizos del usuario.
 * @constant USER_SPELLS_FILE
 * @type {string}
 */
const USER_SPELLS_FILE = path.join(__dirname, "user_spells.json");

/**
 * Lee las recetas persistidas.
 * @returns {Array<object>} Array de recetas (vacío si no existe o está corrupto)
 */
function readUserSpellRecipes() {
  try {
    if (!fs.existsSync(USER_SPELLS_FILE)) return [];
    const raw = fs.readFileSync(USER_SPELLS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

/**
 * Registra (o re-registra) una receta en el catálogo usando el generador real.
 * @param {object} recipe - Receta válida de hechizo
 * @returns {object|null} ItemDefinition registrada o null si la receta es inválida
 */
function registerSpellRecipe(recipe) {
  if (!recipe || !recipe.id) return null;
  let def;
  try {
    def = buildSpellDefinition(recipe);
  } catch (err) {
    return null;
  }
  // Idempotente: si ya existe (re-load), se re-registra sin lanzar.
  if (itemCatalog.ids().includes(recipe.id)) {
    itemCatalog.unregister(recipe.id);
  }
  itemCatalog.register(recipe.id, () => def);
  return def;
}

/**
 * Registra todos los hechizos persistidos en el catálogo (se llama en el arranque).
 * @returns {Array<object>} Definiciones registradas
 */
function loadUserSpells() {
  const recipes = readUserSpellRecipes();
  const loaded = [];
  for (const recipe of recipes) {
    const def = registerSpellRecipe(recipe);
    if (def) loaded.push(def);
  }
  return loaded;
}

/**
 * Persiste una receta en el almacén (añade o reemplaza por id).
 * @param {object} recipe - Receta válida de hechizo
 * @returns {boolean} true si se persistió
 */
function saveUserSpellRecipe(recipe) {
  if (!recipe || !recipe.id) return false;
  const recipes = readUserSpellRecipes().filter((r) => r.id !== recipe.id);
  recipes.push(recipe);
  fs.mkdirSync(path.dirname(USER_SPELLS_FILE), { recursive: true });
  fs.writeFileSync(USER_SPELLS_FILE, JSON.stringify(recipes, null, 2), "utf8");
  return true;
}

/**
 * Elimina una receta persistida por id.
 * @param {string} id - Id del hechizo
 * @returns {boolean} true si existía
 */
function deleteUserSpellRecipe(id) {
  const recipes = readUserSpellRecipes();
  const next = recipes.filter((r) => r.id !== id);
  if (next.length === recipes.length) return false;
  fs.mkdirSync(path.dirname(USER_SPELLS_FILE), { recursive: true });
  fs.writeFileSync(USER_SPELLS_FILE, JSON.stringify(next, null, 2), "utf8");
  return true;
}

module.exports = {
  loadUserSpells,
  readUserSpellRecipes,
  registerSpellRecipe,
  saveUserSpellRecipe,
  deleteUserSpellRecipe,
  USER_SPELLS_FILE,
};
