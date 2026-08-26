# Graph Report - RolBotV1  (2026-07-21)

## Corpus Check
- 148 files · ~41,863 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1009 nodes · 2322 edges · 71 communities (52 shown, 19 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 220 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `546c9b58`
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
- daily.js
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
- grupo_abrir.js
- h
- supabase.js
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
- editar_pj.js
- resolveTargetDisplayName

## God Nodes (most connected - your core abstractions)
1. `box()` - 82 edges
2. `formatError()` - 60 edges
3. `formatDisplayMention()` - 26 edges
4. `getActiveCharacter()` - 25 edges
5. `resolveTargetDisplayName()` - 25 edges
6. `logSystem()` - 25 edges
7. `logError()` - 25 edges
8. `filterExisting()` - 21 edges
9. `getUserProfile()` - 21 edges
10. `startBot()` - 19 edges

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

## Communities (71 total, 19 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.13
Nodes (22): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+14 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.15
Nodes (23): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText() (+15 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.15
Nodes (17): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+9 more)

### Community 3 - "loggerService.js"
Cohesion: 0.10
Nodes (21): KNOWN_SCHEMA, { logSystem }, { supabase }, checkHealth(), { checkVersion }, CRITICAL_EQUALS_COLUMNS, { discover }, { logSystem, logError } (+13 more)

### Community 4 - "characterService.js"
Cohesion: 0.18
Nodes (14): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+6 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.10
Nodes (25): { box }, { createReport }, { formatError }, reportCooldowns, { box }, execute(), { formatError }, { getReport, getUserReports } (+17 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.11
Nodes (27): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+19 more)

### Community 7 - "box"
Cohesion: 0.08
Nodes (39): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+31 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.21
Nodes (14): { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles }, hasEconomyPermission(), isEconomyAdmin(), { isOwner }, listEconomyAdmins(), pickDisplayName(), readPermissions() (+6 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.10
Nodes (29): { addItem }, { box }, execute(), { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { box }, execute() (+21 more)

### Community 11 - "userService.js"
Cohesion: 0.20
Nodes (19): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getOrCreateProfile(), getTopActiveUsers(), getUserProfile(), normalizeActivity() (+11 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.24
Nodes (11): discover(), COLUMN_TYPES, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL(), logMigrationInfo(), { logSystem } (+3 more)

### Community 14 - "unwarn.js"
Cohesion: 0.14
Nodes (19): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+11 more)

### Community 15 - "economyService.js"
Cohesion: 0.12
Nodes (27): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+19 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.17
Nodes (10): crypto, getCacheKey(), helpers, run(), assert(), createMockEnemy(), createMockParticipant(), path (+2 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.18
Nodes (13): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, loadCommands(), { logSystem, logCommand, logError } (+5 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.13
Nodes (20): { box }, executeEconomyAction(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, getUsage() (+12 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.14
Nodes (24): execute(), { box }, execute(), { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu }, { formatError }, { getActiveCharacter, addXp, setHp } (+16 more)

### Community 20 - "box"
Cohesion: 0.19
Nodes (16): { box }, { findSessionByCharacter, findSessionByUser, endSession, advanceTurn, setPendingReaction }, { formatError }, { formatFlee, formatActionMenu, formatReactionPrompt }, { getActiveCharacter }, { rollFlee, executeAttack, executeReaction }, { box }, buildHpBar() (+8 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.19
Nodes (24): execute(), DEFAULT_CHARACTER_SLOTS, filterExisting(), createCharacter(), {
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
}, deleteCharacter(), distribuirPunto(), { filterExisting } (+16 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.07
Nodes (26): GROUP_ACTIVITY_ROOT, path, hasColumn(), buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity() (+18 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.33
Nodes (7): getClase(), { getClase }, { getHabilidad, habilidadesPorClase }, habilidadesDisponibles(), { maxSkillSlots }, sanitizarHabilidadesArray(), { habilidadesDisponibles, sanitizarHabilidadesArray }

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.07
Nodes (41): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+33 more)

### Community 26 - "permissionService.js"
Cohesion: 0.21
Nodes (12): execute(), { formatCharacter }, { getActiveCharacter }, getHpState(), getCombatStats(), { box }, buildHpBar(), formatCharacter() (+4 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.16
Nodes (13): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+5 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (18): execute(), applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction(), { DAMAGE_MIN, BLOCK_REDUCTION } (+10 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.17
Nodes (17): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), formatDuration() (+9 more)

### Community 31 - "daily.js"
Cohesion: 0.18
Nodes (10): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+2 more)

### Community 32 - "formatError"
Cohesion: 0.25
Nodes (11): calculateLevel(), CLASSES, DEFAULT_CHARACTER_STATS, HP_THRESHOLDS, LEVELABLE_STATS, maxSkillSlots(), RACES, RANGOS (+3 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "test_message_format_utils.js"
Cohesion: 0.25
Nodes (6): assert, { box, formatCommandUsage, formatCommandForm, formatError }, forbiddenImports, fs, path, srcContent

### Community 35 - "LRUCache"
Cohesion: 0.22
Nodes (8): { box }, execute(), { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, getTopBalances(), topBalancesCacheKey()

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.16
Nodes (17): execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError }, { getActiveCharacter }, { createSession, createDummySession, findSessionByCharacter }, { ensureTestKit }, execute() (+9 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.14
Nodes (18): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, SESSION_STATES, formatCombatDisolved(), { CHALLENGE_TIMEOUT_MS, TURN_TIMEOUT_MS, SESSION_STATES }, cleanup(), clearPendingReaction() (+10 more)

### Community 39 - "invite.js"
Cohesion: 0.11
Nodes (24): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+16 more)

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

### Community 44 - "grupo_abrir.js"
Cohesion: 0.25
Nodes (7): { box }, {
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
}, { formatError }, { getActiveCharacter, addXp, setHp }, formatVictory()

### Community 46 - "supabase.js"
Cohesion: 0.24
Nodes (9): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState(), logError(), { logError }, { midnightReview }, scheduleNext() (+1 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.08
Nodes (26): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage, { box } (+18 more)

### Community 69 - "editar_pj.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 71 - "resolveTargetDisplayName"
Cohesion: 0.15
Nodes (17): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+9 more)

## Knowledge Gaps
- **449 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+444 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `eco_admin_rem.js` to `bugReportService.js`, `characterService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `unwarn.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `set_stelas.js`, `combatEngine.js`, `daily.js`, `LRUCache`, `grupo_cerrar.js`, `invite.js`, `grupo_abrir.js`, `renombrar_pj.js`, `editar_pj.js`, `resolveTargetDisplayName`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `formatError()` connect `eco_admin_rem.js` to `renombrar_pj.js`, `economyAdminHelper.js`, `crear_pj.js`, `resolveTargetDisplayName`, `box`, `formatError`, `characterProgressionService.js`, `invite.js`, `grupo_abrir.js`, `unwarn.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `resolveTargetDisplayName`, `set_stelas.js`, `combatEngine.js`, `daily.js`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `supabase` connect `loggerService.js` to `economyAdminHelper.js`, `invite.js`, `characterConfig.js`, `add.js`, `characterProgressionService.js`, `userService.js`, `supabase.js`, `economyService.js`, `resolveTargetDisplayName`, `eliminar_pj.js`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _449 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `loggerService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Should `economyAdminHelper.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._