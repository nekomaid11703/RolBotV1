# Graph Report - RolBotV1  (2026-07-23)

## Corpus Check
- 156 files · ~46,216 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1086 nodes · 2606 edges · 80 communities (63 shown, 17 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 228 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f4606006`
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
- groupUtils.js
- eco_admin_rem.js
- listCharacters
- demote.js
- promote.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 92 edges
2. `formatError()` - 68 edges
3. `formatDisplayMention()` - 30 edges
4. `getActiveCharacter()` - 29 edges
5. `resolveTargetDisplayName()` - 29 edges
6. `logSystem()` - 29 edges
7. `logError()` - 29 edges
8. `getFirstMentionedJid()` - 23 edges
9. `withMentions()` - 23 edges
10. `getUserProfile()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOpenReports()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/reportMaintenanceService.js
- `midnightReview()` --calls--> `getStats()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/reportMaintenanceService.js

## Import Cycles
- None detected.

## Communities (80 total, 17 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.11
Nodes (25): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+17 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.09
Nodes (26): { box }, { createReport }, execute(), { formatError }, reportCooldowns, { box }, execute(), { formatError } (+18 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (33): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+25 more)

### Community 3 - "loggerService.js"
Cohesion: 0.14
Nodes (21): calculateLevel(), CLASSES, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, getHpState(), HP_THRESHOLDS, LEVELABLE_STATS, RACES (+13 more)

### Community 4 - "characterService.js"
Cohesion: 0.14
Nodes (18): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+10 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.40
Nodes (14): execute(), filterExisting(), createCharacter(), deleteCharacter(), distribuirPunto(), getCharacterSlug(), getXpInfo(), normalizeCharacterRecord() (+6 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.18
Nodes (15): getRole(), cleanText(), extractMentionLabelFromContext(), findParticipantDisplayName(), { getGroupMetadata }, { getUserProfile }, isMeaningfulDisplayName(), resolveTargetDisplayName() (+7 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (31): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+23 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.28
Nodes (8): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE

### Community 9 - "characterConfig.js"
Cohesion: 0.25
Nodes (7): { addWarn, getWarns, MAX_WARNS }, { box }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }

### Community 10 - "characterProgressionService.js"
Cohesion: 0.18
Nodes (13): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+5 more)

### Community 11 - "userService.js"
Cohesion: 0.08
Nodes (36): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+28 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.18
Nodes (19): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+11 more)

### Community 14 - "unwarn.js"
Cohesion: 0.21
Nodes (18): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction(), { DAMAGE_MIN, BLOCK_REDUCTION } (+10 more)

### Community 15 - "economyService.js"
Cohesion: 0.12
Nodes (24): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+16 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.17
Nodes (24): execute(), { box }, { calcFatigueCost }, execute(), {
  findSessionByCharacter,
  findSessionByUser,
  endSession,
  advanceTurn,
  setPendingReaction,
}, { formatError }, {
  formatFlee,
  formatActionMenu,
  formatReactionPrompt,
  buildFatigueBar,
}, { getActiveCharacter } (+16 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.13
Nodes (19): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, loadCommands(), { logSystem, logCommand, logError } (+11 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.10
Nodes (29): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatCommandUsage }, { formatError } (+21 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 20 - "box"
Cohesion: 0.06
Nodes (29): GROUP_ACTIVITY_ROOT, path, hasColumn(), buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity() (+21 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.29
Nodes (10): FATIGUE_COSTS, FATIGUE_RECOVERY, FATIGUE_SPEED_STATS, FATIGUE_THRESHOLDS, applyFatiguePenalties(), calcFatigueRecovery(), { FATIGUE_THRESHOLDS, FATIGUE_SPEED_STATS }, getFatigueLevel() (+2 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.18
Nodes (14): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, execute() (+6 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.27
Nodes (10): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), claimDaily() (+2 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 26 - "permissionService.js"
Cohesion: 0.13
Nodes (27): execute(), execute(), execute(), { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError } (+19 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.25
Nodes (13): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), cachedErrors, { getRecentErrors } (+5 more)

### Community 31 - "dado.js"
Cohesion: 0.19
Nodes (12): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { box }, buildHpBar(), formatCharacter(), formatHpState() (+4 more)

### Community 32 - "formatError"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+1 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.19
Nodes (12): execute(), { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter } (+4 more)

### Community 35 - "LRUCache"
Cohesion: 0.29
Nodes (6): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, removeSession(), CombatAI, { createDummySession, removeSession }

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.12
Nodes (26): { box }, { calcFatigueCost }, execute(), {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError }, { getActiveCharacter, addXp, setHp } (+18 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.09
Nodes (39): execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError }, { getActiveCharacter }, { createSession, createDummySession, findSessionByCharacter }, { ensureTestKit }, execute() (+31 more)

### Community 39 - "invite.js"
Cohesion: 0.50
Nodes (4): execute(), { executeGroupAction }, { removeParticipant }, removeParticipant()

### Community 40 - "actividad.js"
Cohesion: 0.18
Nodes (16): appendToLog(), cleanOldLogs(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, logCommand() (+8 more)

### Community 41 - "add.js"
Cohesion: 0.20
Nodes (15): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), logError(), getOpenReports(), getStats(), { logSystem } (+7 more)

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 43 - "item_rem.js"
Cohesion: 0.10
Nodes (22): { box }, execute(), { getActiveCharacter }, { getInventory }, { getItem, ITEMS }, { addItem }, { box }, { formatError } (+14 more)

### Community 44 - "getUserProfile"
Cohesion: 0.18
Nodes (9): { box }, execute(), { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, getTopBalances(), topBalancesCacheKey() (+1 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 48 - "logError"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueCost, calcFatigueRecovery }, { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu, buildFatigueBar }, { formatError }, { getActiveCharacter, addXp, setHp }

### Community 64 - "item_add.js"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueRecovery }, { executeAttack, executeReaction }, {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError }, { getActiveCharacter }

### Community 68 - "renombrar_pj.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { openGroup }, openGroup()

### Community 69 - "schemaMigration.js"
Cohesion: 0.08
Nodes (36): discover(), KNOWN_SCHEMA, { logSystem }, { supabase }, COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns() (+28 more)

### Community 70 - "getActiveCharacter"
Cohesion: 0.40
Nodes (5): { box }, { closeGroup }, execute(), { formatError }, closeGroup()

### Community 71 - "resolveTargetDisplayName"
Cohesion: 0.19
Nodes (12): extractAmountFromArgs(), parsePositiveInteger(), { box }, executeEconomyAction(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas } (+4 more)

### Community 72 - "commandRegistry.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { getInviteCode }, getInviteCode()

### Community 73 - "admin_perm_add.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 74 - "admin_perm_rem.js"
Cohesion: 0.14
Nodes (19): { box }, execute(), { formatError }, { useItem }, addItem(), characterLocks, ensureTestKit(), { filterExisting } (+11 more)

### Community 75 - "groupUtils.js"
Cohesion: 0.43
Nodes (7): addWarn(), deleteWarn(), deleteWarns(), getWarns(), { isSameIdentity }, saveWarns(), { supabase }

### Community 76 - "eco_admin_rem.js"
Cohesion: 0.38
Nodes (6): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), getOrCreateProfile()

### Community 77 - "listCharacters"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 78 - "demote.js"
Cohesion: 0.50
Nodes (4): { demoteFromAdmin }, execute(), { executeGroupAction }, demoteFromAdmin()

### Community 79 - "promote.js"
Cohesion: 0.50
Nodes (4): execute(), { executeGroupAction }, { promoteToAdmin }, promoteToAdmin()

## Knowledge Gaps
- **503 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+498 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `test_helpers.js` to `bugReportService.js`, `groupActivityService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterConfig.js`, `characterProgressionService.js`, `userService.js`, `formatErrorUtils.js`, `eliminar_pj.js`, `characterSkillUtils.js`, `eco_admin_rem.js`, `permissionService.js`, `set_stelas.js`, `dado.js`, `formatError`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `item_rem.js`, `getUserProfile`, `characterConfig.js`, `logError`, `item_add.js`, `renombrar_pj.js`, `getActiveCharacter`, `resolveTargetDisplayName`, `commandRegistry.js`, `admin_perm_add.js`, `admin_perm_rem.js`, `eco_admin_rem.js`, `listCharacters`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `formatError()` connect `formatErrorUtils.js` to `bugReportService.js`, `groupActivityService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterConfig.js`, `characterProgressionService.js`, `test_helpers.js`, `eliminar_pj.js`, `eco_admin_rem.js`, `permissionService.js`, `set_stelas.js`, `formatError`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `item_rem.js`, `characterConfig.js`, `logError`, `item_add.js`, `renombrar_pj.js`, `getActiveCharacter`, `resolveTargetDisplayName`, `commandRegistry.js`, `admin_perm_add.js`, `admin_perm_rem.js`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `logError()` connect `add.js` to `bot.js`, `bugReportService.js`, `schemaMigration.js`, `grupo_cerrar.js`, `actividad.js`, `admin_perm_rem.js`, `economyService.js`, `groupUtils.js`, `dar_stelas.js`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _503 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09359605911330049 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07716701902748414 - nodes in this community are weakly interconnected._