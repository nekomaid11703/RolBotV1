// @ts-nocheck
const fs = require("fs");
const path = require("path");

const commands = new Map();
const aliases = new Map();

/**
 *
 * @param value
 */
function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/**
 *
 * @param command
 * @param fileName
 */
function registerCommand(command, fileName) {
  if (!command?.name) {
    throw new Error(`Comando inválido (${fileName}): falta la propiedad "name".`);
  }

  if (typeof command.execute !== "function") {
    throw new Error(`Comando inválido (${fileName}): falta la función "execute".`);
  }

  const commandName = normalizeName(command.name);

  if (!commandName) {
    throw new Error(`Comando inválido (${fileName}): el nombre está vacío.`);
  }

  if (commands.has(commandName)) {
    throw new Error(`Comando duplicado detectado: "${commandName}" (${fileName})`);
  }

  if (aliases.has(commandName)) {
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

    const aliasName = normalizeName(alias);

    if (!aliasName) {
      throw new Error(`Alias inválido en (${fileName}): no puede estar vacío.`);
    }

    if (commands.has(aliasName)) {
      const existingCommand = commands.get(aliasName);
      if (existingCommand !== command) {
        throw new Error(
          `Alias en conflicto: "${aliasName}" del comando "${commandName}" coincide con el nombre de un comando existente ("${existingCommand.name}").`,
        );
      }
      throw new Error(`Alias en conflicto: "${aliasName}" del comando "${commandName}" coincide con su propio nombre.`);
    }

    if (aliases.has(aliasName)) {
      const existingCommand = aliases.get(aliasName);
      throw new Error(
        `Alias duplicado detectado: "${aliasName}" usado por "${existingCommand.name}" y "${commandName}".`,
      );
    }

    aliases.set(aliasName, command);
  }
}

/**
 *
 * @param dir
 */
function getJsFilesRecursively(dir) {
  /** @type {string[]} */
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
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
  registerCommand,
  getJsFilesRecursively,
};
