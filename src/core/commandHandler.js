const fs = require("fs");
const path = require("path");

const { isAdmin, isBotAdmin, isOnGroup } = require("../utils/groupUtils");
const { isOwner } = require("../utils/permissionUtils");
const { hasEconomyPermission } = require("../services/permissionService");
const { recordUserActivity } = require("../services/userService");
const { logSystem, logCommand, logError } = require("../services/loggerService");
const { incrementCommands, incrementErrors, addEvent } = require("../services/stats");

const commands = new Map();
const aliases = new Map();

/** @param {string} value */
function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/** @param {Record<string,any>} command @param {string} fileName */
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

/** @param {string} dir @returns {string[]} */
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

function loadCommands() {
  const commandsPath = path.join(__dirname, "../commands");

  commands.clear();
  aliases.clear();

  let commandCount = 0;
  let aliasCount = 0;

  const files = getJsFilesRecursively(commandsPath);

  for (const filePath of files) {
    const file = path.basename(filePath);

    delete require.cache[require.resolve(filePath)];

    const command = require(filePath);

    registerCommand(command, file);
    commandCount++;

    if (Array.isArray(command.aliases)) {
      aliasCount += command.aliases.length;
    }
  }

  console.log(`📦 ${commandCount} comandos · ${aliasCount} aliases cargados`);

  void logSystem("Comandos cargados correctamente", {
    commandCount,
    aliasCount,
  });
}

/** @param {Record<string,any>} ctx */
async function handleCommand(ctx) {
  const prefix = "/";

  if (!ctx.text.startsWith(prefix)) {
    return;
  }

  const args = ctx.text.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) {
    return;
  }

  const command = commands.get(commandName) || aliases.get(commandName);

  if (!command) {
    return;
  }

  ctx.args = args;
  ctx.command = commandName;
  ctx.commandName = command.name;

  const logBase = {
    userId: ctx.senderJid || ctx.sender,
    userPhone: ctx.senderNumber || null,
    userName: ctx.userName,
    groupId: ctx.from,
    inputCommand: commandName,
    resolvedCommand: command.name,
    args,
  };

  if (command.groupOnly && !isOnGroup(ctx.from)) {
    await logCommand({
      ...logBase,
      status: "denied",
      reason: "Este comando solo funciona en grupos.",
    });

    return ctx.reply("❌ Este comando solo funciona en grupos.");
  }

  if (command.creatorOnly) {
    const owner = isOwner({
      jid: ctx.senderJid || ctx.sender,
      phone: ctx.senderNumber,
      displayName: ctx.userName,
    });

    if (!owner) {
      await logCommand({
        ...logBase,
        status: "denied",
        reason: "Solo el creador puede usar este comando.",
      });

      return ctx.reply("❌ Solo el creador puede usar este comando.");
    }
  }

  if (command.economyAdminOnly) {
    const allowed = await hasEconomyPermission({
      jid: ctx.senderJid || ctx.sender,
      phone: ctx.senderNumber,
      displayName: ctx.userName,
    });

    if (!allowed) {
      await logCommand({
        ...logBase,
        status: "denied",
        reason: "Solo los administradores de economía pueden usar este comando.",
      });

      return ctx.reply("❌ Solo los administradores de economía pueden usar este comando.");
    }
  }

  if (command.adminOnly) {
    if (!isOnGroup(ctx.from)) {
      await logCommand({
        ...logBase,
        status: "denied",
        reason: "Este comando solo funciona en grupos.",
      });

      return ctx.reply("❌ Este comando solo funciona en grupos.");
    }

    const admin = await isAdmin(ctx.sock, ctx.from, ctx.senderJid || ctx.sender);

    if (!admin) {
      await logCommand({
        ...logBase,
        status: "denied",
        reason: "Solo los administradores pueden usar este comando.",
      });

      return ctx.reply("❌ Solo los administradores pueden usar este comando.");
    }
  }

  if (command.botAdminOnly) {
    const botAdmin = await isBotAdmin(ctx.sock, ctx.from);

    if (!botAdmin) {
      await logCommand({
        ...logBase,
        status: "denied",
        reason: "El bot necesita ser administrador.",
      });

      return ctx.reply("❌ El bot necesita ser administrador.");
    }
  }

  try {
    await command.execute(ctx);

    incrementCommands();
    addEvent("cmd", `/${command.name} — ${ctx.userName}`);

    await logCommand({
      ...logBase,
      status: "success",
    });

    try {
      await recordUserActivity({
        creatorId: ctx.senderJid || ctx.sender,
        creatorName: ctx.userName,
        displayName: ctx.userName,
        pushName: ctx.userName,
        senderJid: ctx.senderJid || ctx.sender,
        senderNumber: ctx.senderNumber || null,
        commandCount: 1,
        messageType: ctx.messageType,
        isText: Boolean(ctx.text),
        registration: {
          source: "command",
          scope: isOnGroup(ctx.from) ? "group" : "self",
          createdBy: ctx.senderJid || ctx.sender,
        },
      });
    } catch (activityError) {
      await logError({
        source: `command-activity:${command.name}`,
        userId: ctx.senderJid || ctx.sender,
        userName: ctx.userName,
        groupId: ctx.from,
        error: activityError,
        context: {
          inputCommand: commandName,
          resolvedCommand: command.name,
        },
      });
    }
  } catch (/** @type {any} */ error) {
    await logCommand({
      ...logBase,
      status: "error",
      reason: error?.message || "Error desconocido",
    });

    incrementErrors();
    addEvent("err", `Error en /${command.name}: ${String(error?.message || "").slice(0, 60)}`);

    await logError({
      source: `command:${command.name}`,
      userId: ctx.senderJid || ctx.sender,
      userName: ctx.userName,
      groupId: ctx.from,
      error,
      context: {
        inputCommand: commandName,
        resolvedCommand: command.name,
        args,
        isGroup: isOnGroup(ctx.from),
      },
    });
    await ctx.reply("❌ Error ejecutando comando.");
  }
}

module.exports = {
  loadCommands,
  handleCommand,
  commands,
  aliases,
};
