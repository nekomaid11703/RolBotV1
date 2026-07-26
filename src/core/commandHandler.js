// @ts-nocheck
/**
 * @constant path
 */
const path = require("path");
const { isAdmin, isBotAdmin, isOnGroup } = require("../utils/groupUtils");
const { isOwner } = require("../utils/permissionUtils");
const { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel } = require("../services/permissionService");
const { recordUserActivity } = require("../services/userService");
const { logSystem, logCommand, logError } = require("../services/loggerService");
const { incrementCommands, incrementErrors, addEvent } = require("../services/stats");
const { commands, aliases, registerCommand, getJsFilesRecursively } = require("./commandRegistry");

/**
 * TODO: describe what this does.
 */
function loadCommands() {
  /**
   * @constant commandsPath
   */
  const commandsPath = path.join(__dirname, "../commands");

  commands.clear();
  aliases.clear();

  let commandCount = 0;
  let aliasCount = 0;

  /**
   * @constant files
   */
  const files = getJsFilesRecursively(commandsPath);

  for (const filePath of files) {
    /**
     * @constant file
     */
    const file = path.basename(filePath);

    delete require.cache[require.resolve(filePath)];

    /**
     * @constant command
     */
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
 * @param {object} ctx - - Command context.
 * @returns {Promise<void>} Promise that resolves when complete.
 */
async function handleCommand(ctx) {
  /**
   * @constant prefix
   * @type {string}
   */
  const prefix = "/";

  if (!ctx.text.startsWith(prefix)) {
    return;
  }

  /**
   * @constant args
   */
  const args = ctx.text.slice(prefix.length).trim().split(/\s+/);
  /**
   * @constant commandName
   */
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) {
    return;
  }

  /**
   * @constant command
   */
  const command = commands.get(commandName) || aliases.get(commandName);

  if (!command) {
    return;
  }

  ctx.args = args;
  ctx.command = commandName;
  ctx.commandName = command.name;

  /**
   * @constant logBase
   * @type {object}
   */
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
    /**
     * @constant owner
     */
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
    /**
     * @constant allowed
     */
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

  if (command.adminPerm) {
    /**
     * @constant allowed
     */
    const allowed = await hasPermissionForCategory(
      {
        jid: ctx.senderJid || ctx.sender,
        phone: ctx.senderNumber,
        displayName: ctx.userName,
      },
      command.adminPerm,
    );

    if (!allowed) {
      /**
       * @constant catLabel
       */
      const catLabel = getCategoryLabel(command.adminPerm);
      await logCommand({
        ...logBase,
        status: "denied",
        reason: `Solo los administradores de ${catLabel} pueden usar este comando.`,
      });

      return ctx.reply(`❌ Solo los administradores de ${catLabel} pueden usar este comando.`);
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

    /**
     * @constant admin
     */
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
    /**
     * @constant botAdmin
     */
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
    /**
     * @constant err
     */
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
