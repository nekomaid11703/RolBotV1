/**
 * @constant fs
 */
const fs = require("fs");
/**
 * @constant path
 */
const path = require("path");

/** @type {Map<string, *>} */
const commands = new Map();
/** @type {Map<string, *>} */
const aliases = new Map();

/**
 * Normalize a string value for comparison.
 * @param {string} value - Value to normalize
 * @returns {string} Lowercase trimmed string
 */
function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/**
 * Register a command and its aliases.
 * @param {*} command - - Command object with name, execute, and optional aliases.
 * @param {string} fileName - - Source file name for error messages.
 */
function registerCommand(command, fileName) {
  if (!command?.name) {
    throw new Error(`Comando inválido (${fileName}): falta la propiedad "name".`);
  }

  if (typeof command.execute !== "function") {
    throw new Error(`Comando inválido (${fileName}): falta la función "execute".`);
  }

  /**
   * @constant commandName
   */
  const commandName = normalizeName(command.name);

  if (!commandName) {
    throw new Error(`Comando inválido (${fileName}): el nombre está vacío.`);
  }

  if (commands.has(commandName)) {
    throw new Error(`Comando duplicado detectado: "${commandName}" (${fileName})`);
  }

  if (aliases.has(commandName)) {
    /**
     * @constant existingCommand
     */
    const existingCommand = aliases.get(commandName);
    throw new Error(
      `El nombre del comando "${commandName}" (${fileName}) entra en conflicto con el alias del comando "${existingCommand.name}".`,
    );
  }

  commands.set(commandName, command);

  if (!Array.isArray(command.aliases)) {
    return;
  }

  for (const alias of command.aliases) {
    if (typeof alias !== "string") {
      throw new Error(`Alias inválido en (${fileName}): todos los aliases deben ser texto.`);
    }

    /**
     * @constant aliasName
     */
    const aliasName = normalizeName(alias);

    if (!aliasName) {
      throw new Error(`Alias inválido en (${fileName}): no puede estar vacío.`);
    }

    if (commands.has(aliasName)) {
      /**
       * @constant existingCommand
       */
      const existingCommand = commands.get(aliasName);
      if (existingCommand !== command) {
        throw new Error(
          `Alias en conflicto: "${aliasName}" del comando "${commandName}" coincide con el nombre de un comando existente ("${existingCommand.name}").`,
        );
      }
      throw new Error(`Alias en conflicto: "${aliasName}" del comando "${commandName}" coincide con su propio nombre.`);
    }

    if (aliases.has(aliasName)) {
      /**
       * @constant existingCommand
       */
      const existingCommand = aliases.get(aliasName);
      throw new Error(
        `Alias duplicado detectado: "${aliasName}" usado por "${existingCommand.name}" y "${commandName}".`,
      );
    }

    aliases.set(aliasName, command);
  }
}

/**
 * Recursively get all .js files in a directory.
 * @param {string} dir - Directory path to search
 * @returns {string[]} Array of file paths
 */
function getJsFilesRecursively(dir) {
  /** @type {string[]} */
  let results = [];
  /**
   * @constant list
   */
  const list = fs.readdirSync(dir);
  for (const file of list) {
    /**
     * @constant filePath
     */
    const filePath = path.join(dir, file);
    /**
     * @constant stat
     */
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsFilesRecursively(filePath));
    } else if (file.endsWith(".js")) {
      results.push(filePath);
    }
  }
  return results;
}

module.exports = {
  commands,
  aliases,
  normalizeName,
  registerCommand,
  getJsFilesRecursively,
};
