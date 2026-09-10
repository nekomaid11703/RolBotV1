# Graph Report - RolBotV1  (2026-07-26)

## Corpus Check
- 187 files · ~2,343,067 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1452 nodes · 3358 edges · 98 communities (71 shown, 27 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 272 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68876b99`
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
- eslint.config.js
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
- characterConfig.js
- items.js
- clases.js
- equipable.js
- schedulerService.js
- heal.js
- LRUCache
- ConditionalMod
- listCharacters
- inventario.js
- add_stelas.js
- set_stelas.js
- supabaseAuthState.js
- sanitizeName
- combatBalance.js
- groupConfig.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 101 edges
2. `formatError()` - 73 edges
3. `logError()` - 43 edges
4. `logSystem()` - 36 edges
5. `getActiveCharacter()` - 35 edges
6. `formatDisplayMention()` - 30 edges
7. `resolveTargetDisplayName()` - 29 edges
8. `findSessionByCharacter()` - 26 edges
9. `filterExisting()` - 23 edges
10. `getFirstMentionedJid()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `simulateBattle()` --calls--> `executeAttack()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `executeReaction()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `applyReactionFatigue()` --calls--> `calcFatigueCost()`  [EXTRACTED]
  scripts/simulate_combat/combatLoop.js → src/services/rpg/fatigueEngine.js

## Import Cycles
- None detected.

## Communities (98 total, 27 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.14
Nodes (36): attemptReconnect(), cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, handleConnectionClose(), handleConnectionOpen() (+28 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.09
Nodes (26): { box }, { createReport }, execute(), { formatError }, reportCooldowns, { box }, execute(), { formatError } (+18 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.12
Nodes (25): checkAdminOnly(), checkAdminPerm(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), checkPermission(), { commands, aliases, registerCommand, getJsFilesRecursively } (+17 more)

### Community 4 - "characterService.js"
Cohesion: 0.11
Nodes (27): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+19 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.21
Nodes (23): execute(), DEFAULT_CHARACTER_SLOTS, filterExisting(), createCharacter(), {
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
Nodes (29): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+21 more)

### Community 7 - "box"
Cohesion: 0.08
Nodes (39): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+31 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.28
Nodes (8): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE

### Community 9 - "characterConfig.js"
Cohesion: 0.06
Nodes (56): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+48 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.18
Nodes (10): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+2 more)

### Community 11 - "userService.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.14
Nodes (18): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), METADATA_UPDATERS, normalizeActivity(), normalizeProfile() (+10 more)

### Community 14 - "unwarn.js"
Cohesion: 0.11
Nodes (31): applyAttackFatigue(), { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError } (+23 more)

### Community 15 - "economyService.js"
Cohesion: 0.15
Nodes (20): execute(), { executeEconomyAction }, { removeMoney }, claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getBalance(), getMoneyValue() (+12 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.17
Nodes (22): handlePvPWithReaction(), { box }, { calcFatigueCost, capFatigue }, execute(), {
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
}, { getActiveCharacter, setHp } (+14 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.12
Nodes (21): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+13 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.09
Nodes (26): execute(), execute(), { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas } (+18 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.13
Nodes (17): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, execute(), { formatCommandUsage }, formatDisplayRoll() (+9 more)

### Community 20 - "box"
Cohesion: 0.16
Nodes (17): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, execute(), { formatStelas } (+9 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.08
Nodes (48): { applyFatiguePenalties }, {
  calcFatigueCost,
  calcFatigueRecovery,
  capFatigue,
  calculateMovementFatigue,
  getMovementRange,
}, {
  executeAttack,
  executeReaction,
  checkAttackRange,
  getAspdPenalty,
}, generateBattlePair(), generateRandomCharacter(), {
  INITIAL_DISTANCE,
  SIM_AI_DODGE_CHANCE,
  SIM_MIN_LEVEL,
  SIM_MAX_LEVEL,
  SIM_MAX_LEVEL_DIFF,
  SIM_MAX_TURNS,
  SIM_DEFAULT_BATTLE_COUNT,
  SIM_HP_MULTIPLIER,
  SIM_STAT_BASE,
}, runSimulation(), simulateBattle() (+40 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.20
Nodes (8): BuffModule, DamageModule, EquipableModule, HealModule, moduleRegistry, TemporalModule, ModuleBase, TemporalModule

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.09
Nodes (18): createEntity(), moduleRegistry, A, B, BadMod, BuffModule, { Entity, createEntity }, HealModule (+10 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.07
Nodes (49): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+41 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.24
Nodes (11): { box }, execute(), { findSessionByCharacter }, { formatError }, { getActiveCharacter }, { getItem, ITEMS }, showInventoryList(), updateSessionHp() (+3 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (15): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), buildErrorLines(), cachedErrors (+7 more)

### Community 31 - "dado.js"
Cohesion: 0.16
Nodes (16): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { logError }, { box }, buildHpBar(), buildInventoryLines() (+8 more)

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
Cohesion: 0.14
Nodes (10): hasColumn(), cache, TTLS, { cache, TTLS }, groupCacheKey(), { hasColumn }, invalidateGroupCache(), { logSystem } (+2 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.09
Nodes (37): handlePvP(), { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu, buildFatigueBar }, { formatError } (+29 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.08
Nodes (34): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, { createSession, createDummySession, findSessionByCharacter }, { ensureTempTestKit }, { formatCombatOpen }, { formatError }, { getActiveCharacter } (+26 more)

### Community 39 - "invite.js"
Cohesion: 0.13
Nodes (18): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+10 more)

### Community 40 - "actividad.js"
Cohesion: 0.18
Nodes (15): appendToLog(), cleanOldLogs(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, logCommand() (+7 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 43 - "item_rem.js"
Cohesion: 0.12
Nodes (14): { addItem }, { box }, { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { parseQuantity }, { box }, { formatError } (+6 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.07
Nodes (42): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+34 more)

### Community 48 - "midnight_review.js"
Cohesion: 0.19
Nodes (15): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+7 more)

### Community 64 - "item_add.js"
Cohesion: 0.18
Nodes (16): { box }, buildDivider(), buildDummyAttackLines(), buildKoLines(), buildRestLines(), { calcFatigueRecovery, capFatigue }, execute(), { executeAttack, executeReaction, evaluateDodgeFeasibility } (+8 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.24
Nodes (11): createContext, { handleCommand }, { incrementMessages }, { logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+3 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.21
Nodes (9): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), formatDuration() (+1 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.23
Nodes (15): buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getTopGroupMembers(), { GROUP_TOP_LIMIT }, groupCacheKey() (+7 more)

### Community 71 - "inventoryService.js"
Cohesion: 0.14
Nodes (22): execute(), execute(), addItem(), characterLocks, cleanupTemporalItems(), { createItem }, ensureTempTestKit(), ensureTestKit() (+14 more)

### Community 72 - "supabase.js"
Cohesion: 0.25
Nodes (14): addEffect(), cleanCooldown(), cleanExpiredCooldowns(), clearEffects(), { filterExisting }, getActiveEffects(), getCooldown(), getCooldowns() (+6 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.25
Nodes (3): { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl

### Community 75 - "schemaMigration.js"
Cohesion: 0.18
Nodes (13): checkHealth(), { checkVersion }, CRITICAL_EQUALS_COLUMNS, { discover }, { logSystem, logError }, SCHEMA, { supabase }, verifyStartup() (+5 more)

### Community 76 - "statusService.js"
Cohesion: 0.21
Nodes (13): discover(), COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL(), logMigrationInfo() (+5 more)

### Community 78 - "eco_admin_rem.js"
Cohesion: 0.18
Nodes (9): KNOWN_SCHEMA, { logSystem }, { supabase }, { createClient }, { logSystem }, supabase, assert, REQUIRED_TABLES (+1 more)

### Community 79 - "dado.js"
Cohesion: 0.15
Nodes (23): appendHistoriaLine(), { box }, buildCharacterCreatedBox(), buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute() (+15 more)

### Community 80 - "editar_pj.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 81 - "atacar.js"
Cohesion: 0.22
Nodes (5): BuffModule, ModuleBase, ModuleBase, moduleRegistry, registry

### Community 82 - "characterConfig.js"
Cohesion: 0.29
Nodes (8): calculateLevel(), DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel(), { CLASES }, {
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

### Community 83 - "items.js"
Cohesion: 0.24
Nodes (6): getItemsByCategory(), ITEMS, { createEntity }, { ITEMS, getItem: getRawItem }, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 84 - "clases.js"
Cohesion: 0.48
Nodes (5): CLASES, getClase(), listarClases(), validarClase(), { CLASES, getClase, listarClases, validarClase }

### Community 86 - "schedulerService.js"
Cohesion: 0.33
Nodes (8): fixCharacter(), isDryRun, main(), needsMigration(), normalizeStats(), path, { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS }, { supabase }

### Community 90 - "listCharacters"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 91 - "inventario.js"
Cohesion: 0.33
Nodes (5): { box }, execute(), { getActiveCharacter }, { getInventory }, { getItem }

### Community 92 - "add_stelas.js"
Cohesion: 0.50
Nodes (4): { addMoney }, execute(), { executeEconomyAction }, addMoney()

### Community 93 - "set_stelas.js"
Cohesion: 0.50
Nodes (4): execute(), { executeEconomyAction }, { setMoney }, setMoney()

### Community 94 - "supabaseAuthState.js"
Cohesion: 0.40
Nodes (4): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState()

### Community 95 - "sanitizeName"
Cohesion: 0.50
Nodes (3): sanitizeName(), stripAccents(), { sanitizeName }

## Knowledge Gaps
- **649 isolated node(s):** `husky.sh script`, `require`, `sonarjs`, `$schema`, `src/core/bot.js` (+644 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `characterConfig.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `userService.js`, `unwarn.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `set_stelas.js`, `dado.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `item_add.js`, `schemaMigration.js`, `inventoryService.js`, `dado.js`, `editar_pj.js`, `listCharacters`, `inventario.js`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `formatError()` connect `characterConfig.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `userService.js`, `unwarn.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `resolveTargetDisplayName`, `set_stelas.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `item_add.js`, `inventoryService.js`, `dado.js`, `editar_pj.js`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `supabase` connect `eco_admin_rem.js` to `bugReportService.js`, `economyAdminHelper.js`, `admin_perm_rem.js`, `grupo_cerrar.js`, `inventoryService.js`, `supabase.js`, `crear_pj.js`, `schemaMigration.js`, `statusService.js`, `getUserProfile`, `economyService.js`, `midnight_review.js`, `permissionService.js`, `supabaseAuthState.js`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `require`, `sonarjs` to the rest of the system?**
  _649 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13813813813813813 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09359605911330049 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._