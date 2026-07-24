# Graph Report - RolBotV1  (2026-07-22)

## Corpus Check
- 155 files · ~45,509 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1070 nodes · 2538 edges · 76 communities (59 shown, 17 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 224 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b97962ce`
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
- dado.js
- formatError
- logger.test.js
- inventario.js
- LRUCache
- graphify — Knowledge Graph (Code-Only)
- formatError
- grupo_cerrar.js
- invite.js
- actividad.js
- add.js
- message_format.test.js
- item_rem.js
- getUserProfile
- h
- Plan: Implementacion de Stats Magicas + Correcciones
- characterConfig.js
- logError
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
- item_add.js
- vitest.config.js
- renombrar_pj.js
- schemaMigration.js
- getActiveCharacter
- resolveTargetDisplayName
- commandRegistry.js
- admin_perm_add.js
- admin_perm_rem.js
- eco_admin_rem.js

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
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOpenReports()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/reportMaintenanceService.js
- `midnightReview()` --calls--> `getStats()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/reportMaintenanceService.js

## Import Cycles
- None detected.

## Communities (76 total, 17 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.13
Nodes (22): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+14 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.08
Nodes (37): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+29 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (33): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+25 more)

### Community 3 - "loggerService.js"
Cohesion: 0.20
Nodes (9): characterLocks, { filterExisting }, { getActiveCharacter, setHp }, { getItem }, { HP_MAX }, { invalidateUserCache }, { logError }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE } (+1 more)

### Community 4 - "characterService.js"
Cohesion: 0.14
Nodes (18): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+10 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.09
Nodes (26): { box }, { createReport }, execute(), { formatError }, reportCooldowns, { box }, execute(), { formatError } (+18 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.16
Nodes (16): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+8 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (38): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+30 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.28
Nodes (8): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE

### Community 9 - "characterConfig.js"
Cohesion: 0.12
Nodes (23): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+15 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.18
Nodes (10): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+2 more)

### Community 11 - "userService.js"
Cohesion: 0.29
Nodes (9): getHpState(), { box }, buildHpBar(), formatCharacter(), formatHpState(), { getItem }, { LEVELABLE_STATS, getHpState, HP_MAX }, { formatCharacter, buildHpBar, formatHpState } (+1 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.18
Nodes (18): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+10 more)

### Community 14 - "unwarn.js"
Cohesion: 0.13
Nodes (27): { box }, { calcFatigueCost }, execute(), {
  findSessionByCharacter,
  findSessionByUser,
  endSession,
  advanceTurn,
  setPendingReaction,
}, { formatError }, { formatFlee, formatActionMenu, formatReactionPrompt }, { getActiveCharacter }, { rollFlee, executeAttack, executeReaction } (+19 more)

### Community 15 - "economyService.js"
Cohesion: 0.12
Nodes (26): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+18 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.16
Nodes (19): { box }, { calcFatigueCost }, {
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
}, {
  formatActionMenu,
  formatReactionPrompt,
  formatVictory,
  buildFatigueBar,
}, { formatError }, { getActiveCharacter, addXp, setHp }, { box } (+11 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.17
Nodes (14): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, loadCommands(), { logSystem, logCommand, logError } (+6 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.28
Nodes (10): buildFormBody(), buildUsageBody(), formatCommandForm(), formatCommandUsage(), buildFeedbackBody(), compactLines(), formatFeedback(), { box } (+2 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 20 - "box"
Cohesion: 0.12
Nodes (12): hasColumn(), KNOWN_SCHEMA, { logSystem }, { supabase }, getTopBalances(), { cache, TTLS }, groupCacheKey(), { hasColumn } (+4 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.19
Nodes (14): FATIGUE_COSTS, FATIGUE_RECOVERY, FATIGUE_SPEED_STATS, FATIGUE_THRESHOLDS, SESSION_STATES, getSession(), applyFatiguePenalties(), calcFatigueRecovery() (+6 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.10
Nodes (21): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity() (+13 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.14
Nodes (15): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), { box } (+7 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.10
Nodes (27): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+19 more)

### Community 26 - "permissionService.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.16
Nodes (13): { box }, execute(), executeDeletion(), { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage (+5 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 31 - "dado.js"
Cohesion: 0.33
Nodes (5): { box }, execute(), { formatCommandUsage }, { formatError }, usageMessage

### Community 32 - "formatError"
Cohesion: 0.20
Nodes (26): execute(), calculateLevel(), xpForNextLevel(), filterExisting(), createCharacter(), {
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
}, deleteCharacter(), distribuirPunto() (+18 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.20
Nodes (10): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { box }, execute(), { getActiveCharacter }, { getInventory } (+2 more)

### Community 35 - "LRUCache"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.12
Nodes (26): execute(), { box }, { calcFatigueCost, calcFatigueRecovery }, execute(), { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu }, { formatError } (+18 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.10
Nodes (35): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, { createSession, createDummySession, findSessionByCharacter }, { ensureTestKit }, execute(), { formatCombatOpen }, { formatError } (+27 more)

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

### Community 43 - "item_rem.js"
Cohesion: 0.18
Nodes (10): { box }, execute(), { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { removeItem }, removeItem(), withCharacterLock() (+2 more)

### Community 44 - "getUserProfile"
Cohesion: 0.27
Nodes (10): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), execute(), getBalance(), getOrCreateProfile() (+2 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.29
Nodes (8): CLASSES, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, HP_THRESHOLDS, LEVELABLE_STATS, RACES, RANGOS, {
  LEVELABLE_STATS,
  HP_MAX,
  DEFAULT_CHARACTER_STATS,
  RACES,
  CLASSES,
  LEVEL_INITIAL,
  LEVEL_MAX,
  FREE_POINTS_AT_CREATION,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  xpForNextLevel,
  calculateLevel,
  RANGOS,
  HP_THRESHOLDS,
  getHpState,
  MAX_CHARACTER_NAME_LENGTH,
  MAX_CHARACTERS_PER_USER,
}

### Community 48 - "logError"
Cohesion: 0.24
Nodes (9): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState(), logError(), { logError }, { midnightReview }, scheduleNext() (+1 more)

### Community 64 - "item_add.js"
Cohesion: 0.31
Nodes (8): { addItem }, { box }, execute(), { formatError }, { getActiveCharacter }, { getItem, ITEMS }, getItem(), addItem()

### Community 68 - "renombrar_pj.js"
Cohesion: 0.19
Nodes (12): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+4 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.08
Nodes (32): discover(), COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL(), logMigrationInfo() (+24 more)

### Community 70 - "getActiveCharacter"
Cohesion: 0.29
Nodes (7): execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError }, { getActiveCharacter }, getActiveCharacter(), getCombatStats()

### Community 71 - "resolveTargetDisplayName"
Cohesion: 0.19
Nodes (12): extractAmountFromArgs(), parsePositiveInteger(), { box }, executeEconomyAction(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas } (+4 more)

### Community 72 - "commandRegistry.js"
Cohesion: 0.38
Nodes (4): getItemsByCategory(), ITEMS, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 73 - "admin_perm_add.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 74 - "admin_perm_rem.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 76 - "eco_admin_rem.js"
Cohesion: 0.11
Nodes (31): execute(), execute(), execute(), { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError } (+23 more)

## Knowledge Gaps
- **494 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+489 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `eco_admin_rem.js` to `bugReportService.js`, `groupActivityService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterConfig.js`, `characterProgressionService.js`, `userService.js`, `unwarn.js`, `test_helpers.js`, `formatErrorUtils.js`, `characterSkillUtils.js`, `permissionService.js`, `set_stelas.js`, `dado.js`, `formatError`, `inventario.js`, `LRUCache`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `getUserProfile`, `item_add.js`, `renombrar_pj.js`, `resolveTargetDisplayName`, `admin_perm_add.js`, `admin_perm_rem.js`, `eco_admin_rem.js`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `formatError()` connect `eco_admin_rem.js` to `groupActivityService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterConfig.js`, `characterProgressionService.js`, `unwarn.js`, `test_helpers.js`, `formatErrorUtils.js`, `permissionService.js`, `set_stelas.js`, `dado.js`, `formatError`, `LRUCache`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `getUserProfile`, `item_add.js`, `renombrar_pj.js`, `getActiveCharacter`, `resolveTargetDisplayName`, `admin_perm_add.js`, `admin_perm_rem.js`, `eco_admin_rem.js`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `supabase` connect `schemaMigration.js` to `formatError`, `loggerService.js`, `economyAdminHelper.js`, `grupo_cerrar.js`, `add.js`, `characterConfig.js`, `eco_admin_rem.js`, `getUserProfile`, `economyService.js`, `logError`, `box`, `eliminar_pj.js`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _494 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0797979797979798 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07716701902748414 - nodes in this community are weakly interconnected._