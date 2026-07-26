// @ts-nocheck
const path = require("path");
const { isAdmin, isBotAdmin, isOnGroup } = require("../utils/groupUtils");
const { isOwner } = require("../utils/permissionUtils");
const { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel } = require("../services/permissionService");
const { recordUserActivity } = require("../services/userService");
const { logSystem, logCommand, logError } = require("../services/loggerService");
const { incrementCommands, incrementErrors, addEvent } = require("../services/stats");
const { commands, aliases, registerCommand, getJsFilesRecursively } = require("./commandRegistry");

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

async function logDenied(ctx, logBase, reason, message) {
  await logCommand({ ...logBase, status: "denied", reason });
  return ctx.reply(message);
}

async function checkGroupOnly(ctx, command, logBase) {
  if (!command.groupOnly || isOnGroup(ctx.from)) return null;
  return logDenied(ctx, logBase, "Este comando solo funciona en grupos.", "❌ Este comando solo funciona en grupos.");
}

async function checkCreatorOnly(ctx, command, logBase) {
  if (!command.creatorOnly) return null;
  const owner = isOwner({ jid: ctx.senderJid || ctx.sender, phone: ctx.senderNumber, displayName: ctx.userName });
  if (owner) return null;
  return logDenied(ctx, logBase, "Solo el creador puede usar este comando.", "❌ Solo el creador puede usar este comando.");
}

async function checkEconomyAdmin(ctx, command, logBase) {
  if (!command.economyAdminOnly) return null;
  const allowed = await hasEconomyPermission({ jid: ctx.senderJid || ctx.sender, phone: ctx.senderNumber, displayName: ctx.userName });
  if (allowed) return null;
  return logDenied(ctx, logBase, "Solo los administradores de economía pueden usar este comando.", "❌ Solo los administradores de economía pueden usar este comando.");
}

async function checkAdminPerm(ctx, command, logBase) {
  if (!command.adminPerm) return null;
  const allowed = await hasPermissionForCategory(
    { jid: ctx.senderJid || ctx.sender, phone: ctx.senderNumber, displayName: ctx.userName },
    command.adminPerm,
  );
  if (allowed) return null;
  const catLabel = getCategoryLabel(command.adminPerm);
  return logDenied(ctx, logBase, `Solo los administradores de ${catLabel} pueden usar este comando.`, `❌ Solo los administradores de ${catLabel} pueden usar este comando.`);
}

async function checkAdminOnly(ctx, command, logBase) {
  if (!command.adminOnly) return null;
  if (!isOnGroup(ctx.from)) {
    return logDenied(ctx, logBase, "Este comando solo funciona en grupos.", "❌ Este comando solo funciona en grupos.");
  }
  const admin = await isAdmin(ctx.sock, ctx.from, ctx.senderJid || ctx.sender);
  if (admin) return null;
  return logDenied(ctx, logBase, "Solo los administradores pueden usar este comando.", "❌ Solo los administradores pueden usar este comando.");
}

async function checkBotAdminOnly(ctx, command, logBase) {
  if (!command.botAdminOnly) return null;
  const botAdmin = await isBotAdmin(ctx.sock, ctx.from);
  if (botAdmin) return null;
  return logDenied(ctx, logBase, "El bot necesita ser administrador.", "❌ El bot necesita ser administrador.");
}

const PERMISSION_CHECKS = [
  checkGroupOnly,
  checkCreatorOnly,
  checkEconomyAdmin,
  checkAdminPerm,
  checkAdminOnly,
  checkBotAdminOnly,
];

async function checkPermission(ctx, command, logBase) {
  for (const check of PERMISSION_CHECKS) {
    const denied = await check(ctx, command, logBase);
    if (denied) return denied;
  }
  return null;
}

async function recordActivity(ctx, commandName, command) {
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
      context: { inputCommand: commandName, resolvedCommand: command.name },
    });
  }
}

async function handleCommandError(ctx, error, command, commandName, args, logBase) {
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
    context: { inputCommand: commandName, resolvedCommand: command.name, args, isGroup: isOnGroup(ctx.from) },
  });
  await ctx.reply("❌ Error ejecutando comando.");
}

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

  const denied = await checkPermission(ctx, command, logBase);
  if (denied) return;

  try {
    await command.execute(ctx);

    incrementCommands();
    addEvent("cmd", `/${command.name} — ${ctx.userName}`);

    await logCommand({ ...logBase, status: "success" });

    await recordActivity(ctx, commandName, command);
  } catch (error) {
    await handleCommandError(ctx, error, command, commandName, args, logBase);
  }
}

module.exports = {
  loadCommands,
  handleCommand,
};
