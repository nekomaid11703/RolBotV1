# Graph Report - RolBotV1  (2026-07-24)

## Corpus Check
- 171 files · ~185,185 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1188 nodes · 2826 edges · 73 communities (56 shown, 17 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 249 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04962292`
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
- logSystem
- h
- Plan: Implementacion de Stats Magicas + Correcciones
- characterConfig.js
- midnight_review.js
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
- admin_perm_rem.js
- inventoryService.js
- inventory_service.test.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 92 edges
2. `formatError()` - 68 edges
3. `logError()` - 33 edges
4. `getActiveCharacter()` - 31 edges
5. `formatDisplayMention()` - 30 edges
6. `resolveTargetDisplayName()` - 29 edges
7. `logSystem()` - 29 edges
8. `filterExisting()` - 23 edges
9. `getFirstMentionedJid()` - 23 edges
10. `withMentions()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js
- `executeRestTurn()` --calls--> `executeTurn()`  [EXTRACTED]
  scripts/simulate_combat/combatLoop.js → src/services/rpg/combatEngine.js
- `simulateCombat()` --calls--> `executeTurn()`  [EXTRACTED]
  scripts/simulate_combat/combatLoop.js → src/services/rpg/combatEngine.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js

## Import Cycles
- None detected.

## Communities (73 total, 17 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.10
Nodes (32): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+24 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.12
Nodes (19): { box }, { createReport }, { formatError }, reportCooldowns, CATEGORY_KEYWORDS, createReport(), crypto, determineCategory() (+11 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.18
Nodes (15): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+7 more)

### Community 3 - "loggerService.js"
Cohesion: 0.18
Nodes (14): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, { logSystem, logCommand, logError }, path (+6 more)

### Community 4 - "characterService.js"
Cohesion: 0.13
Nodes (19): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+11 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.06
Nodes (62): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+54 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.11
Nodes (23): { box }, { deleteWarn, getWarns }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS }, { box } (+15 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (44): execute(), { box }, execute(), { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName } (+36 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.28
Nodes (8): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE

### Community 9 - "characterConfig.js"
Cohesion: 0.08
Nodes (38): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+30 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.08
Nodes (36): { box }, CATEGORIES, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid } (+28 more)

### Community 11 - "userService.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.18
Nodes (20): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getOrCreateProfile(), getTopActiveUsers(), listUserProfiles(), normalizeActivity() (+12 more)

### Community 14 - "unwarn.js"
Cohesion: 0.18
Nodes (20): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), { applyPenalties }, calculateDamageBackup(), { DAMAGE_MIN }, calculateDamage() (+12 more)

### Community 15 - "economyService.js"
Cohesion: 0.12
Nodes (25): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+17 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.16
Nodes (22): { box }, { calcFatigueCost, capFatigue }, execute(), {
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
}, { getActiveCharacter, setHp }, { rollFlee, executeAttack, executeReaction } (+14 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.10
Nodes (22): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+14 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.07
Nodes (35): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+27 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 20 - "box"
Cohesion: 0.10
Nodes (21): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity() (+13 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.20
Nodes (19): applyReactionFatigue(), { calcFatigueRecovery, calcFatigueCost, getFatigueLevel }, characterShape(), executeRestTurn(), { executeTurn, executeAttack }, { MAX_ROUNDS, FATIGUE_SNAPSHOT_TURNS }, shouldRest(), simulateCombat() (+11 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.09
Nodes (14): BuffCategory, DamageCategory, EquipableCategory, HealCategory, BuffCategory, DamageCategory, EquipableCategory, getCategories() (+6 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.13
Nodes (13): { box }, { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile }, { resolveTargetDisplayName } (+5 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.08
Nodes (37): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+29 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.16
Nodes (14): { box }, execute(), { getActiveCharacter }, { getInventory }, { getItem }, { box }, execute(), { findSessionByCharacter } (+6 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.25
Nodes (13): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), cachedErrors, { getRecentErrors } (+5 more)

### Community 31 - "dado.js"
Cohesion: 0.17
Nodes (13): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { logError }, { box }, buildHpBar(), formatCharacter() (+5 more)

### Community 32 - "formatError"
Cohesion: 0.15
Nodes (8): hasColumn(), { cache, TTLS }, groupCacheKey(), { hasColumn }, invalidateGroupCache(), { logSystem }, safeSelect(), userCacheKey()

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.11
Nodes (18): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+10 more)

### Community 35 - "LRUCache"
Cohesion: 0.18
Nodes (9): { box }, execute(), { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, getTopBalances(), topBalancesCacheKey() (+1 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.10
Nodes (34): { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError }, { getActiveCharacter, addXp, setHp } (+26 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.10
Nodes (39): execute(), execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError }, { getActiveCharacter }, { createSession, createDummySession, findSessionByCharacter }, { ensureTestKit } (+31 more)

### Community 39 - "invite.js"
Cohesion: 0.10
Nodes (24): { addParticipant }, { box }, execute(), { formatError }, execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin } (+16 more)

### Community 40 - "actividad.js"
Cohesion: 0.19
Nodes (15): appendToLog(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR (+7 more)

### Community 41 - "add.js"
Cohesion: 0.28
Nodes (7): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, formatCombatDisolved(), removeSession(), CombatAI, { createDummySession, removeSession }

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 43 - "item_rem.js"
Cohesion: 0.13
Nodes (21): { addItem }, { box }, execute(), { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { parseQuantity }, { box } (+13 more)

### Community 44 - "logSystem"
Cohesion: 0.38
Nodes (6): { box }, execute(), { formatError }, { getReport, getUserReports }, getReport(), getUserReports()

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { getInviteCode }, getInviteCode()

### Community 48 - "midnight_review.js"
Cohesion: 0.26
Nodes (12): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), loadCommands(), logSystem(), getOpenReports(), getStats() (+4 more)

### Community 64 - "item_add.js"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueRecovery, capFatigue }, { executeAttack, executeReaction }, {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError }, { getActiveCharacter, setHp }

### Community 68 - "renombrar_pj.js"
Cohesion: 0.40
Nodes (5): { box }, { closeGroup }, execute(), { formatError }, closeGroup()

### Community 69 - "schemaMigration.js"
Cohesion: 0.06
Nodes (48): discover(), KNOWN_SCHEMA, { logSystem }, { supabase }, COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns() (+40 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.47
Nodes (4): getItemsByCategory(), ITEMS, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 71 - "inventoryService.js"
Cohesion: 0.17
Nodes (11): characterLocks, { createItem }, { filterExisting }, { getActiveCharacter, setHp }, { getItem }, { invalidateUserCache }, { logError }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE } (+3 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.25
Nodes (3): { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl

## Knowledge Gaps
- **547 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+542 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `bugReportService.js`, `groupActivityService.js`, `economyAdminHelper.js`, `crear_pj.js`, `characterProgressionService.js`, `userService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `characterSkillUtils.js`, `permissionService.js`, `set_stelas.js`, `dado.js`, `inventario.js`, `LRUCache`, `formatError`, `grupo_cerrar.js`, `invite.js`, `add.js`, `item_rem.js`, `logSystem`, `characterConfig.js`, `item_add.js`, `renombrar_pj.js`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `formatError()` connect `formatErrorUtils.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `userService.js`, `test_helpers.js`, `groupUtils.js`, `characterSkillUtils.js`, `set_stelas.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `logSystem`, `characterConfig.js`, `item_add.js`, `renombrar_pj.js`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `supabase` connect `schemaMigration.js` to `bot.js`, `bugReportService.js`, `economyAdminHelper.js`, `grupo_cerrar.js`, `inventoryService.js`, `invite.js`, `characterProgressionService.js`, `getUserProfile`, `economyService.js`, `midnight_review.js`, `box`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _547 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10084033613445378 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `characterService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._