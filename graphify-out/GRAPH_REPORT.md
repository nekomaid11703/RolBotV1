# Graph Report - RolBotV1  (2026-07-23)

## Corpus Check
- 166 files · ~184,801 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1152 nodes · 2739 edges · 73 communities (56 shown, 17 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 241 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99139c09`
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
- resolveTargetDisplayName
- admin_perm_add.js
- listCharacters

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
Cohesion: 0.11
Nodes (30): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+22 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.10
Nodes (25): { box }, { createReport }, { formatError }, reportCooldowns, { box }, execute(), { formatError }, { getReport, getUserReports } (+17 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.16
Nodes (15): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+7 more)

### Community 3 - "loggerService.js"
Cohesion: 0.29
Nodes (9): calculateLevel(), CLASSES, DEFAULT_CHARACTER_STATS, HP_THRESHOLDS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel() (+1 more)

### Community 4 - "characterService.js"
Cohesion: 0.27
Nodes (10): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+2 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.45
Nodes (12): filterExisting(), createCharacter(), deleteCharacter(), distribuirPunto(), getCharacterSlug(), getXpInfo(), normalizeCharacterRecord(), renameCharacter() (+4 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.11
Nodes (25): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+17 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (46): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+38 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.28
Nodes (8): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE

### Community 9 - "characterConfig.js"
Cohesion: 0.08
Nodes (38): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+30 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.20
Nodes (12): getHabilidad(), HABILIDADES, habilidadesPorClase(), habilidadesUniversales(), listarHabilidades(), TIER_MULTIPLIERS, TIERS, { getHabilidad, habilidadesPorClase } (+4 more)

### Community 11 - "userService.js"
Cohesion: 0.10
Nodes (31): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, OWNER_ALIASES (+23 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.18
Nodes (19): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+11 more)

### Community 14 - "unwarn.js"
Cohesion: 0.17
Nodes (21): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), { applyPenalties }, calculateDamageBackup(), { DAMAGE_MIN }, calculateDamage() (+13 more)

### Community 15 - "economyService.js"
Cohesion: 0.13
Nodes (21): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, addMoney(), claimDaily() (+13 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.17
Nodes (21): { box }, { calcFatigueCost }, execute(), {
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
}, { getActiveCharacter }, { rollFlee, executeAttack, executeReaction } (+13 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.12
Nodes (21): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, { logSystem, logCommand, logError }, path (+13 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.09
Nodes (26): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+18 more)

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
Cohesion: 0.20
Nodes (19): applyReactionFatigue(), { calcFatigueRecovery, calcFatigueCost, getFatigueLevel }, characterShape(), executeRestTurn(), { executeTurn, executeAttack }, { MAX_ROUNDS, FATIGUE_SNAPSHOT_TURNS }, shouldRest(), simulateCombat() (+11 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin } (+1 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.18
Nodes (14): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+6 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.14
Nodes (25): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, resolveEconomyProfile(), CATEGORY_LABELS, { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles } (+17 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueCost }, {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError }, { getActiveCharacter, addXp, setHp }

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.25
Nodes (13): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), cachedErrors, { getRecentErrors } (+5 more)

### Community 31 - "dado.js"
Cohesion: 0.39
Nodes (6): CLASES, getClase(), listarClases(), validarClase(), { CLASES, getClase, listarClases, validarClase }, { HABILIDADES }

### Community 32 - "formatError"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+1 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.11
Nodes (24): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+16 more)

### Community 35 - "LRUCache"
Cohesion: 0.29
Nodes (6): { box }, { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.12
Nodes (34): execute(), { box }, { calcFatigueCost, calcFatigueRecovery }, execute(), { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu, buildFatigueBar }, { formatError } (+26 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.08
Nodes (37): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError }, { getActiveCharacter }, { createSession, createDummySession, findSessionByCharacter } (+29 more)

### Community 39 - "invite.js"
Cohesion: 0.13
Nodes (18): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+10 more)

### Community 40 - "actividad.js"
Cohesion: 0.19
Nodes (15): appendToLog(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR (+7 more)

### Community 41 - "add.js"
Cohesion: 0.29
Nodes (11): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), logSystem(), getOpenReports(), getStats(), { logSystem } (+3 more)

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 43 - "item_rem.js"
Cohesion: 0.05
Nodes (56): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { box }, execute(), { getActiveCharacter }, { getInventory } (+48 more)

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
Cohesion: 0.50
Nodes (4): execute(), { executeEconomyAction }, { setMoney }, setMoney()

### Community 64 - "item_add.js"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueRecovery }, { executeAttack, executeReaction }, {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError }, { getActiveCharacter }

### Community 68 - "renombrar_pj.js"
Cohesion: 0.09
Nodes (26): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+18 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.07
Nodes (38): { BufferJSON, initAuthCreds }, { logError }, { supabase }, discover(), KNOWN_SCHEMA, { logSystem }, { supabase }, COLUMN_TYPES (+30 more)

### Community 71 - "resolveTargetDisplayName"
Cohesion: 0.10
Nodes (22): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+14 more)

### Community 73 - "admin_perm_add.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 77 - "listCharacters"
Cohesion: 0.14
Nodes (15): { box }, execute(), { listCharacters }, DEFAULT_CHARACTER_SLOTS, {
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
}, { filterExisting }, { getClase }, { invalidateUserCache, charactersCacheKey, safeSingleOrNull, cache, TTLS } (+7 more)

## Knowledge Gaps
- **531 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+526 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `bugReportService.js`, `groupActivityService.js`, `crear_pj.js`, `userService.js`, `test_helpers.js`, `formatErrorUtils.js`, `eliminar_pj.js`, `characterSkillUtils.js`, `permissionService.js`, `set_stelas.js`, `formatError`, `inventario.js`, `LRUCache`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `getUserProfile`, `characterConfig.js`, `item_add.js`, `renombrar_pj.js`, `resolveTargetDisplayName`, `admin_perm_add.js`, `listCharacters`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `formatError()` connect `renombrar_pj.js` to `bugReportService.js`, `groupActivityService.js`, `crear_pj.js`, `box`, `test_helpers.js`, `formatErrorUtils.js`, `eliminar_pj.js`, `set_stelas.js`, `formatError`, `inventario.js`, `LRUCache`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `characterConfig.js`, `item_add.js`, `resolveTargetDisplayName`, `admin_perm_add.js`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `logError()` connect `bot.js` to `bugReportService.js`, `schemaMigration.js`, `grupo_cerrar.js`, `formatError`, `actividad.js`, `add.js`, `item_rem.js`, `economyService.js`, `groupUtils.js`, `dar_stelas.js`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _531 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11290322580645161 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `crear_pj.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._