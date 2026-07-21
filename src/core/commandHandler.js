// @ts-nocheck
const path = require("path");

const { isAdmin, isBotAdmin, isOnGroup } = require("../utils/groupUtils");
const { isOwner } = require("../utils/permissionUtils");
const { hasEconomyPermission } = require("../services/permissionService");
const { recordUserActivity } = require("../services/userService");
const { logSystem, logCommand, logError } = require("../services/loggerService");
const { incrementCommands, incrementErrors, addEvent } = require("../services/stats");
const { commands, aliases, registerCommand, getJsFilesRecursively } = require("./commandRegistry");

/**
 *
 */
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

  void logSystem("Comandos cargados correctamente", {
    commandCount,
    aliasCount,
  });
}

/**
 * @param {object} ctx - Command context
 * @returns {Promise<void>} Promise that resolves when complete
 */
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
  } catch (error) {
    const err = /** @type {{ message?: string }} */ (error);
    await logCommand({
      ...logBase,
      status: "error",
      reason: err.message || "Error desconocido",
    });

    incrementErrors();
    addEvent("err", `Error en /${command.name}: ${String(err.message || "").slice(0, 60)}`);

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
};
