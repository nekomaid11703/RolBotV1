# Graph Report - NekoBot  (2026-08-04)

## Corpus Check
- 166 files · ~50,313 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1132 nodes · 2534 edges · 75 communities (55 shown, 20 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 210 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f44385b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- bot.js
- bugReportService.js
- groupActivityService.js
- loggerService.js
- characterService.js
- economyAdminHelper.js
- crear_pj.js
- box
- test_logger_service.js
- characterConfig.js
- characterProgressionService.js
- userService.js
- knip.json
- safeQuery.js
- unwarn.js
- economyService.js
- test_helpers.js
- groupUtils.js
- formatErrorUtils.js
- dar_stelas.js
- resolveTargetDisplayName
- stryker.config.json
- formatError
- eliminar_pj.js
- supabase.js
- eco_admin_rem.js
- permissionService.js
- IA_rolbot — RolBotV1
- actividad.js
- formatDisplayMention
- renombrar_pj.js
- daily.js
- switch_pj.js
- logger.test.js
- test_message_format_utils.js
- LRUCache
- graphify — Knowledge Graph (Code-Only)
- add.js
- grupo_cerrar.js
- invite.js
- ban.js
- demote.js
- message_format.test.js
- test_command_usage_format.js
- carta_blanca.test.js
- h
- groupConfig.js
- cache_state.test.js
- test_crear_pj.js
- applypatch-msg
- commit-msg
- husky.sh
- post-applypatch
- post-checkout
- post-commit
- post-merge
- post-rewrite
- pre-applypatch
- pre-auto-gc
- pre-commit
- pre-merge-commit
- pre-push
- pre-rebase
- prepare-commit-msg
- vitest.config.js
- eslint.config.js
- help.js
- stats.js
- eventHandler.js
- editar_pj.js
- Plan: Implementacion de Stats Magicas + Correcciones
- listCharacters
- supabaseAuthState.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 89 edges
2. `logError()` - 30 edges
3. `formatDisplayMention()` - 30 edges
4. `resolveTargetDisplayName()` - 29 edges
5. `logSystem()` - 29 edges
6. `formatError()` - 27 edges
7. `getActiveCharacter()` - 26 edges
8. `getFirstMentionedJid()` - 23 edges
9. `withMentions()` - 23 edges
10. `startBotOnce()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `runCleanOldLogsTests()` --indirect_call--> `exists()`  [INFERRED]
  tests/test_logger_service.js → scripts/tools-list.js
- `createWithImage()` --calls--> `createReport()`  [EXTRACTED]
  tests/security_boundaries.test.js → src/services/bugReportService.js
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js

## Import Cycles
- None detected.

## Communities (75 total, 20 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.12
Nodes (28): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+20 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.15
Nodes (24): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, { normalizeJid, uniqueStrings }, OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid } (+16 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.17
Nodes (18): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity() (+10 more)

### Community 3 - "loggerService.js"
Cohesion: 0.05
Nodes (67): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), { BufferJSON, initAuthCreds, makeCacheableSignalKeyStore }, { logError }, { supabase }, useSupabaseAuthState() (+59 more)

### Community 4 - "characterService.js"
Cohesion: 0.21
Nodes (20): execute(), DEFAULT_CHARACTER_SLOTS, filterExisting(), createCharacter(), {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  RANGOS,
  HP_MAX,
}, deleteCharacter(), { filterExisting }, getCharacterSlug() (+12 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.09
Nodes (21): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+13 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.15
Nodes (20): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+12 more)

### Community 7 - "box"
Cohesion: 0.10
Nodes (23): { box }, { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile }, { box } (+15 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.29
Nodes (9): calculateLevel(), CLASSES, DEFAULT_CHARACTER_STATS, HP_THRESHOLDS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel() (+1 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.12
Nodes (18): assertDeclaredImageSize(), CATEGORY_KEYWORDS, crypto, { downloadMediaMessage }, fs, fsp, { getGroupMetadata }, getImageExtension() (+10 more)

### Community 11 - "userService.js"
Cohesion: 0.16
Nodes (22): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+14 more)

### Community 12 - "knip.json"
Cohesion: 0.20
Nodes (9): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+1 more)

### Community 13 - "safeQuery.js"
Cohesion: 0.09
Nodes (15): cache, TTLS, { cache, TTLS }, groupCacheKey(), { hasColumn }, invalidateGroupCache(), { logSystem }, { addMoney } (+7 more)

### Community 14 - "unwarn.js"
Cohesion: 0.15
Nodes (32): execute(), execute(), { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { resolveTargetDisplayName } (+24 more)

### Community 15 - "economyService.js"
Cohesion: 0.10
Nodes (30): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+22 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.17
Nodes (10): crypto, getCacheKey(), helpers, run(), assert(), createMockEnemy(), createMockParticipant(), path (+2 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.20
Nodes (12): getHabilidad(), HABILIDADES, habilidadesPorClase(), habilidadesUniversales(), listarHabilidades(), TIER_MULTIPLIERS, TIERS, { getHabilidad, habilidadesPorClase } (+4 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.06
Nodes (43): { box }, execute(), { formatCommandUsage }, { formatError }, usageMessage, { box }, { formatCommandUsage }, { formatError } (+35 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.18
Nodes (11): { box }, execute(), { formatCount }, { formatRealMentionTag, withMentions }, { getGroupMetadata }, execute(), { formatDisplayMention }, cleanText() (+3 more)

### Community 20 - "resolveTargetDisplayName"
Cohesion: 0.22
Nodes (17): resolveEconomyProfile(), CATEGORY_LABELS, { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles }, hasEconomyPermission(), hasPermissionForCategory(), isAdminForCategory(), isEconomyAdmin() (+9 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.15
Nodes (13): { box }, CATEGORY_DISPLAY, execute(), { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, getCategoryLabel(), listAdminsForCategory(), listAllCategories() (+5 more)

### Community 22 - "formatError"
Cohesion: 0.14
Nodes (14): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin }, usageMessage (+6 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.06
Nodes (53): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { box }, execute(), { getActiveCharacter }, { getInventory } (+45 more)

### Community 24 - "supabase.js"
Cohesion: 0.14
Nodes (20): { box }, execute(), { executeReaction }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu }, { getActiveCharacter, setHp }, { box }, execute() (+12 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.11
Nodes (25): { createSession, createDummySession, findSessionByCharacter }, { ensureTestKit }, execute(), { formatCombatOpen }, { getActiveCharacter }, SESSION_STATES, createDummySession(), createSession() (+17 more)

### Community 26 - "permissionService.js"
Cohesion: 0.12
Nodes (13): bugReportServicePath, cachedModules, { createReport }, crypto, downloadMediaMessage, fs, fsp, loadOwnerChecker() (+5 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.06
Nodes (30): Antes y después, Auditoría profunda y optimización de RolBotV1, Cambios implementados, Conexión y ciclo de vida de Baileys, Deuda restante priorizada, Evidencia reproducible, Hallazgos críticos que requieren operación manual, Límites de esta entrega (+22 more)

### Community 28 - "actividad.js"
Cohesion: 0.21
Nodes (15): { box }, {
  findSessionByCharacter,
  endSession,
  advanceTurn,
  setPendingReaction,
}, { formatFlee, formatActionMenu, formatReactionPrompt }, { getActiveCharacter }, { rollFlee, executeAttack, executeReaction }, { box }, buildHpBar(), buildStatSummary() (+7 more)

### Community 29 - "formatDisplayMention"
Cohesion: 0.15
Nodes (25): { box }, execute(), { executeAttack, executeReaction, chooseAiReaction }, {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
}, { formatActionMenu, formatReactionPrompt }, { getActiveCharacter, setHp }, execute(), applyPenalties() (+17 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin } (+1 more)

### Community 31 - "daily.js"
Cohesion: 0.38
Nodes (6): { box }, execute(), { formatError }, { getReport, getUserReports }, getReport(), getUserReports()

### Community 32 - "switch_pj.js"
Cohesion: 0.18
Nodes (11): { box }, { createReport }, execute(), reportCooldowns, createReport(), determineCategory(), determinePriority(), getDailyCount() (+3 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "test_message_format_utils.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 35 - "LRUCache"
Cohesion: 0.16
Nodes (16): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { getActiveCharacter }, formatCombatDisolved() (+8 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas del repositorio:, Uso para auditoría e investigación

### Community 37 - "add.js"
Cohesion: 0.14
Nodes (19): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, loadCommands(), { logSystem, logCommand, logError } (+11 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.14
Nodes (14): aliases, commands, fs, normalizeName(), path, registerCommand(), cachedModules, { commands, aliases } (+6 more)

### Community 39 - "invite.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 40 - "ban.js"
Cohesion: 0.07
Nodes (35): { addParticipant }, { box }, execute(), execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute() (+27 more)

### Community 41 - "demote.js"
Cohesion: 0.18
Nodes (10): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+2 more)

### Community 42 - "message_format.test.js"
Cohesion: 0.18
Nodes (6): { box }, { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}

### Community 43 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

### Community 44 - "carta_blanca.test.js"
Cohesion: 0.25
Nodes (8): { box }, execute(), executeDeletion(), { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage

### Community 46 - "groupConfig.js"
Cohesion: 0.18
Nodes (14): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+6 more)

### Community 68 - "help.js"
Cohesion: 0.27
Nodes (10): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+2 more)

### Community 69 - "stats.js"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 70 - "eventHandler.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 71 - "editar_pj.js"
Cohesion: 0.67
Nodes (3): cachedModules, loadAuthState(), mockCommonJsModule()

### Community 72 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 73 - "listCharacters"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 75 - "supabaseAuthState.js"
Cohesion: 0.40
Nodes (4): bugreport, commandPath, createReport, servicePath

## Knowledge Gaps
- **519 isolated node(s):** `husky.sh script`, `prettier`, `globals`, `$schema`, `entry` (+514 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `unwarn.js` to `bugReportService.js`, `characterService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `formatErrorUtils.js`, `dar_stelas.js`, `stryker.config.json`, `formatError`, `eliminar_pj.js`, `supabase.js`, `actividad.js`, `formatDisplayMention`, `renombrar_pj.js`, `daily.js`, `switch_pj.js`, `test_message_format_utils.js`, `LRUCache`, `ban.js`, `demote.js`, `message_format.test.js`, `carta_blanca.test.js`, `groupConfig.js`, `listCharacters`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `supabase` connect `loggerService.js` to `groupActivityService.js`, `characterService.js`, `ban.js`, `characterProgressionService.js`, `userService.js`, `safeQuery.js`, `economyService.js`, `resolveTargetDisplayName`, `eliminar_pj.js`, `eco_admin_rem.js`, `formatDisplayMention`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `logError()` connect `loggerService.js` to `bot.js`, `switch_pj.js`, `LRUCache`, `add.js`, `eventHandler.js`, `characterProgressionService.js`, `economyService.js`, `eliminar_pj.js`, `eco_admin_rem.js`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `prettier`, `globals` to the rest of the system?**
  _519 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._
- **Should `loggerService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05030834144758196 - nodes in this community are weakly interconnected._
- **Should `economyAdminHelper.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._