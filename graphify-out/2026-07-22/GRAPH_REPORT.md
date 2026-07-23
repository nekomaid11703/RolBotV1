# Graph Report - RolBotV1  (2026-07-22)

## Corpus Check
- 162 files · ~47,743 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1111 nodes · 2559 edges · 75 communities (56 shown, 19 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 229 edges (avg confidence: 0.51)
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
- getUserProfile
- unwarn.js
- economyService.js
- test_helpers.js
- groupUtils.js
- formatErrorUtils.js
- dar_stelas.js
- box
- stryker.config.json
- resolveTargetDisplayName
- eliminar_pj.js
- characterSkillUtils.js
- eco_admin_rem.js
- permissionService.js
- IA_rolbot — RolBotV1
- set_stelas.js
- combatEngine.js
- renombrar_pj.js
- formatError
- logger.test.js
- test_message_format_utils.js
- LRUCache
- graphify — Knowledge Graph (Code-Only)
- formatError
- grupo_cerrar.js
- invite.js
- actividad.js
- add.js
- message_format.test.js
- test_command_usage_format.js
- h
- Plan: Implementacion de Stats Magicas + Correcciones
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
- renombrar_pj.js
- schemaMigration.js
- resolveTargetDisplayName
- commandRegistry.js
- admin_perm_add.js
- admin_perm_rem.js
- logError
- eco_admin_rem.js
- set_stelas.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 90 edges
2. `formatError()` - 66 edges
3. `formatDisplayMention()` - 30 edges
4. `resolveTargetDisplayName()` - 29 edges
5. `logSystem()` - 29 edges
6. `logError()` - 29 edges
7. `getActiveCharacter()` - 27 edges
8. `getFirstMentionedJid()` - 23 edges
9. `withMentions()` - 23 edges
10. `getUserProfile()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js
- `runCleanOldLogsTests()` --indirect_call--> `exists()`  [INFERRED]
  tests/test_logger_service.js → scripts/tools-list.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOpenReports()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/reportMaintenanceService.js

## Import Cycles
- None detected.

## Communities (75 total, 19 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.13
Nodes (22): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+14 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.07
Nodes (50): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+42 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.20
Nodes (12): getHabilidad(), HABILIDADES, habilidadesPorClase(), habilidadesUniversales(), listarHabilidades(), TIER_MULTIPLIERS, TIERS, { getHabilidad, habilidadesPorClase } (+4 more)

### Community 3 - "loggerService.js"
Cohesion: 0.41
Nodes (13): filterExisting(), createCharacter(), deleteCharacter(), distribuirPunto(), getCharacterSlug(), getXpInfo(), normalizeCharacterRecord(), renameCharacter() (+5 more)

### Community 4 - "characterService.js"
Cohesion: 0.29
Nodes (7): { createSession, createDummySession, findSessionByCharacter }, { ensureTestKit }, execute(), { formatCombatOpen }, { formatError }, { getActiveCharacter }, ensureTestKit()

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.09
Nodes (26): { box }, { createReport }, { formatError }, reportCooldowns, { box }, execute(), { formatError }, { getReport, getUserReports } (+18 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.16
Nodes (15): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+7 more)

### Community 7 - "box"
Cohesion: 0.10
Nodes (25): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+17 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.12
Nodes (23): { box }, execute(), { formatCount }, { formatError }, { formatRealMentionTag, withMentions }, { getGroupMetadata }, { addWarn, getWarns, MAX_WARNS }, { box } (+15 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.18
Nodes (10): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+2 more)

### Community 11 - "userService.js"
Cohesion: 0.05
Nodes (54): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { box }, execute(), { getActiveCharacter }, { getInventory } (+46 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.19
Nodes (17): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+9 more)

### Community 14 - "unwarn.js"
Cohesion: 0.18
Nodes (6): { box }, { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}

### Community 15 - "economyService.js"
Cohesion: 0.15
Nodes (18): execute(), { executeEconomyAction }, { removeMoney }, {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getBalance(), getMoneyValue(), getTopBalances() (+10 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.17
Nodes (10): crypto, getCacheKey(), helpers, run(), assert(), createMockEnemy(), createMockParticipant(), path (+2 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.12
Nodes (22): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, { logSystem, logCommand, logError }, path (+14 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.14
Nodes (19): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, getUsage(), { resolveTargetDisplayName } (+11 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.15
Nodes (25): { box }, execute(), {
  findSessionByCharacter,
  findSessionByUser,
  endSession,
  advanceTurn,
  setPendingReaction,
}, { formatError }, { formatFlee, formatActionMenu, formatReactionPrompt }, { getActiveCharacter }, { rollFlee, executeAttack, executeReaction }, applyPenalties() (+17 more)

### Community 20 - "box"
Cohesion: 0.19
Nodes (16): { box }, {
  executeAttack,
  executeReaction,
  chooseAiReaction,
  calculateXpReward,
}, {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
}, { formatActionMenu, formatReactionPrompt, formatVictory }, { formatError }, { getActiveCharacter, addXp, setHp }, { box }, buildHpBar() (+8 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.12
Nodes (16): { box }, execute(), { listCharacters }, DEFAULT_CHARACTER_SLOTS, {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
  getHpState,
  HP_MAX,
}, { filterExisting }, { getClase }, { invalidateUserCache, charactersCacheKey, safeSingleOrNull, cache, TTLS } (+8 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.06
Nodes (29): GROUP_ACTIVITY_ROOT, path, hasColumn(), buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity() (+21 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.27
Nodes (10): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), claimDaily() (+2 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.06
Nodes (47): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+39 more)

### Community 26 - "permissionService.js"
Cohesion: 0.39
Nodes (6): CLASES, getClase(), listarClases(), validarClase(), { CLASES, getClase, listarClases, validarClase }, { HABILIDADES }

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.29
Nodes (11): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), resolveEconomyProfile(), setAdminForCategory(), setEconomyAdmin() (+3 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 32 - "formatError"
Cohesion: 0.29
Nodes (9): calculateLevel(), CLASSES, DEFAULT_CHARACTER_STATS, HP_THRESHOLDS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel() (+1 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "test_message_format_utils.js"
Cohesion: 0.25
Nodes (6): assert, { box, formatCommandUsage, formatCommandForm, formatError }, forbiddenImports, fs, path, srcContent

### Community 35 - "LRUCache"
Cohesion: 0.22
Nodes (9): { box }, execute(), { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage (+1 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.12
Nodes (31): execute(), { box }, execute(), { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu }, { formatError }, { getActiveCharacter, addXp, setHp } (+23 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.11
Nodes (31): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, SESSION_STATES, formatCombatDisolved(), cleanup(), clearPendingReaction(), createDummySession() (+23 more)

### Community 39 - "invite.js"
Cohesion: 0.13
Nodes (18): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+10 more)

### Community 40 - "actividad.js"
Cohesion: 0.22
Nodes (13): appendToLog(), ensureLogsDir(), fsp, getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR, path (+5 more)

### Community 41 - "add.js"
Cohesion: 0.29
Nodes (11): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), logSystem(), getOpenReports(), getStats(), { logSystem } (+3 more)

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 43 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 68 - "renombrar_pj.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 69 - "schemaMigration.js"
Cohesion: 0.08
Nodes (35): discover(), KNOWN_SCHEMA, { logSystem }, { supabase }, COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns() (+27 more)

### Community 71 - "resolveTargetDisplayName"
Cohesion: 0.10
Nodes (32): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, execute() (+24 more)

### Community 72 - "commandRegistry.js"
Cohesion: 0.13
Nodes (19): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+11 more)

### Community 73 - "admin_perm_add.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 74 - "admin_perm_rem.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 75 - "logError"
Cohesion: 0.24
Nodes (9): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState(), logError(), { logError }, { midnightReview }, scheduleNext() (+1 more)

### Community 76 - "eco_admin_rem.js"
Cohesion: 0.16
Nodes (16): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin } (+8 more)

### Community 82 - "set_stelas.js"
Cohesion: 0.25
Nodes (9): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { setMoney }, addMoney(), setMoney() (+1 more)

## Knowledge Gaps
- **509 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+504 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `eco_admin_rem.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterConfig.js`, `characterProgressionService.js`, `userService.js`, `unwarn.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `resolveTargetDisplayName`, `characterSkillUtils.js`, `set_stelas.js`, `LRUCache`, `formatError`, `grupo_cerrar.js`, `invite.js`, `renombrar_pj.js`, `resolveTargetDisplayName`, `admin_perm_add.js`, `admin_perm_rem.js`, `eco_admin_rem.js`, `set_stelas.js`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `formatError()` connect `eco_admin_rem.js` to `LRUCache`, `renombrar_pj.js`, `economyAdminHelper.js`, `crear_pj.js`, `resolveTargetDisplayName`, `formatError`, `admin_perm_add.js`, `characterConfig.js`, `admin_perm_rem.js`, `eco_admin_rem.js`, `characterProgressionService.js`, `userService.js`, `invite.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `characterService.js`, `set_stelas.js`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `logError()` connect `logError` to `bot.js`, `characterService.js`, `economyAdminHelper.js`, `schemaMigration.js`, `grupo_cerrar.js`, `actividad.js`, `add.js`, `userService.js`, `economyService.js`, `groupUtils.js`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _509 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06545879602571596 - nodes in this community are weakly interconnected._
- **Should `economyAdminHelper.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09113300492610837 - nodes in this community are weakly interconnected._