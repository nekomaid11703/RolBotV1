# Graph Report - RolBotV1  (2026-07-24)

## Corpus Check
- 179 files · ~2,323,409 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1302 nodes · 2965 edges · 90 communities (67 shown, 23 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 255 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b69998eb`
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
- supabase.js
- inventory_service.test.js
- formatDisplayMention
- schemaMigration.js
- statusService.js
- dar_stelas.js
- eco_admin_rem.js
- dado.js
- editar_pj.js
- atacar.js
- resolveTargetDisplayName
- itemService.js
- ban.js
- equipable.js
- schedulerService.js
- heal.js
- groupConfig.js
- ConditionalMod

## God Nodes (most connected - your core abstractions)
1. `box()` - 92 edges
2. `formatError()` - 68 edges
3. `logError()` - 35 edges
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
- `applyReactionFatigue()` --calls--> `calcFatigueCost()`  [EXTRACTED]
  scripts/simulate_combat/combatLoop.js → src/services/rpg/fatigueEngine.js
- `applyReactionFatigue()` --calls--> `calcFatigueRecovery()`  [EXTRACTED]
  scripts/simulate_combat/combatLoop.js → src/services/rpg/fatigueEngine.js
- `shouldRest()` --calls--> `getFatigueLevel()`  [EXTRACTED]
  scripts/simulate_combat/combatLoop.js → src/services/rpg/fatigueEngine.js

## Import Cycles
- None detected.

## Communities (90 total, 23 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.13
Nodes (22): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+14 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.10
Nodes (24): { box }, { createReport }, { formatError }, reportCooldowns, { box }, execute(), { formatError }, { getReport, getUserReports } (+16 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.15
Nodes (16): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, { logSystem, logCommand, logError }, path (+8 more)

### Community 4 - "characterService.js"
Cohesion: 0.22
Nodes (10): loadCommands(), aliases, commands, fs, getJsFilesRecursively(), normalizeName(), path, registerCommand() (+2 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.21
Nodes (23): execute(), calculateLevel(), filterExisting(), createCharacter(), {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
}, deleteCharacter(), distribuirPunto(), { filterExisting } (+15 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.11
Nodes (30): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+22 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (39): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+31 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.28
Nodes (8): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE

### Community 9 - "characterConfig.js"
Cohesion: 0.06
Nodes (57): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+49 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.09
Nodes (36): execute(), { box }, CATEGORIES, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError } (+28 more)

### Community 11 - "userService.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.18
Nodes (18): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+10 more)

### Community 14 - "unwarn.js"
Cohesion: 0.19
Nodes (14): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction(), { DAMAGE_MIN, BLOCK_REDUCTION } (+6 more)

### Community 15 - "economyService.js"
Cohesion: 0.07
Nodes (45): { addMoney }, execute(), { executeEconomyAction }, { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar() (+37 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.16
Nodes (21): { box }, { calcFatigueCost, capFatigue }, {
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
}, { getActiveCharacter, setHp }, { rollFlee, executeAttack, executeReaction }, { box } (+13 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.10
Nodes (24): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+16 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.10
Nodes (29): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+21 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 20 - "box"
Cohesion: 0.14
Nodes (10): hasColumn(), cache, TTLS, { cache, TTLS }, groupCacheKey(), { hasColumn }, invalidateGroupCache(), { logSystem } (+2 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.32
Nodes (10): FATIGUE_COSTS, FATIGUE_RECOVERY, FATIGUE_SPEED_STATS, FATIGUE_THRESHOLDS, applyFatiguePenalties(), calcFatigueRecovery(), {
  FATIGUE_THRESHOLDS,
  FATIGUE_SPEED_STATS,
  FATIGUE_COSTS,
  FATIGUE_RECOVERY,
  FATIGUE_ATK_COST_SCALE,
  FATIGUE_DEF_REDUCTION_SCALE,
  FATIGUE_DODGE_MSPD_REDUCTION,
  FATIGUE_REST_DEF_SCALE,
  FATIGUE_COST_MIN,
  FATIGUE_RECOVERY_MAX,
  FATIGUE_MAX,
}, getFatigueLevel() (+2 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.18
Nodes (8): DamageModule, ModuleBase, BuffModule, DamageModule, EquipableModule, HealModule, moduleRegistry, TemporalModule

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.10
Nodes (16): A, B, BadMod, BuffModule, { Entity, createEntity }, HealModule, HighMod, LowMod (+8 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.20
Nodes (18): OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText(), getMessageType(), isTextLikeMessageType(), TEXT_MESSAGE_TYPES, unwrapMessageContent() (+10 more)

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
Cohesion: 0.18
Nodes (12): { formatCharacter }, { getActiveCharacter }, { getInventory }, { logError }, { box }, buildHpBar(), formatCharacter(), formatHpState() (+4 more)

### Community 32 - "formatError"
Cohesion: 0.11
Nodes (18): Archetype Analysis, ASPD, ATK, Bottom 15 Binary Signatures, D_FULGOR, DEF, FULGOR, HP (+10 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.12
Nodes (19): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+11 more)

### Community 35 - "LRUCache"
Cohesion: 0.21
Nodes (16): buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity(), getTopGroupMembers(), { GROUP_TOP_LIMIT } (+8 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.13
Nodes (36): { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError }, { getActiveCharacter, addXp, setHp } (+28 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.08
Nodes (43): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError }, { getActiveCharacter } (+35 more)

### Community 39 - "invite.js"
Cohesion: 0.13
Nodes (18): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+10 more)

### Community 40 - "actividad.js"
Cohesion: 0.19
Nodes (15): appendToLog(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR (+7 more)

### Community 41 - "add.js"
Cohesion: 0.15
Nodes (13): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, listAdminsForCategory() (+5 more)

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 43 - "item_rem.js"
Cohesion: 0.11
Nodes (19): { addItem }, { box }, execute(), { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { parseQuantity }, { box } (+11 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.08
Nodes (31): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+23 more)

### Community 48 - "midnight_review.js"
Cohesion: 0.29
Nodes (11): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), logSystem(), getOpenReports(), getStats(), { logSystem } (+3 more)

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
Cohesion: 0.27
Nodes (10): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+2 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.19
Nodes (12): checkHealth(), { checkVersion }, CRITICAL_EQUALS_COLUMNS, { discover }, { logSystem, logError }, SCHEMA, { supabase }, verifyStartup() (+4 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.27
Nodes (8): DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel(), { CLASES }, {
  LEVELABLE_STATS,
  HP_MAX,
  DEFAULT_CHARACTER_STATS,
  RACES,
  LEVEL_INITIAL,
  LEVEL_MAX,
  FREE_POINTS_AT_CREATION,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  xpForNextLevel,
  calculateLevel,
  RANGOS,

  MAX_CHARACTER_NAME_LENGTH,
  MAX_CHARACTERS_PER_USER,
}

### Community 71 - "inventoryService.js"
Cohesion: 0.17
Nodes (18): execute(), logError(), addItem(), characterLocks, cleanupTemporalItems(), { createItem }, ensureTempTestKit(), ensureTestKit() (+10 more)

### Community 72 - "supabase.js"
Cohesion: 0.13
Nodes (13): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState(), KNOWN_SCHEMA, { logSystem }, { supabase }, { createClient } (+5 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.25
Nodes (3): { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl

### Community 74 - "formatDisplayMention"
Cohesion: 0.20
Nodes (6): createEntity(), Entity, moduleRegistry, ModuleBase, moduleRegistry, registry

### Community 75 - "schemaMigration.js"
Cohesion: 0.20
Nodes (14): discover(), COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL(), logMigrationInfo() (+6 more)

### Community 76 - "statusService.js"
Cohesion: 0.25
Nodes (14): addEffect(), cleanCooldown(), cleanExpiredCooldowns(), clearEffects(), { filterExisting }, getActiveEffects(), getCooldown(), getCooldowns() (+6 more)

### Community 77 - "dar_stelas.js"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu, buildFatigueBar }, { formatError }, { getActiveCharacter, addXp, setHp }

### Community 78 - "eco_admin_rem.js"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin } (+1 more)

### Community 79 - "dado.js"
Cohesion: 0.13
Nodes (20): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+12 more)

### Community 80 - "editar_pj.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 81 - "atacar.js"
Cohesion: 0.25
Nodes (4): BuffModule, ModuleBase, ModuleBase, TemporalModule

### Community 83 - "itemService.js"
Cohesion: 0.21
Nodes (7): getItemsByCategory(), ITEMS, { createEntity }, createItem(), { ITEMS, getItem: getRawItem }, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 84 - "ban.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 86 - "schedulerService.js"
Cohesion: 0.47
Nodes (5): { logError }, { midnightReview }, scheduleNext(), startMidnightReview(), stopMidnightReview()

## Knowledge Gaps
- **608 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+603 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `characterConfig.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `userService.js`, `economyService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `set_stelas.js`, `dado.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `add.js`, `item_rem.js`, `item_add.js`, `dar_stelas.js`, `eco_admin_rem.js`, `dado.js`, `editar_pj.js`, `ban.js`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `formatError()` connect `formatErrorUtils.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `userService.js`, `test_helpers.js`, `groupUtils.js`, `set_stelas.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `characterConfig.js`, `item_add.js`, `dar_stelas.js`, `eco_admin_rem.js`, `dado.js`, `editar_pj.js`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `logError()` connect `inventoryService.js` to `bot.js`, `bugReportService.js`, `loggerService.js`, `schemaMigration.js`, `grupo_cerrar.js`, `supabase.js`, `actividad.js`, `statusService.js`, `economyService.js`, `midnight_review.js`, `dar_stelas.js`, `schedulerService.js`, `dado.js`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _608 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._