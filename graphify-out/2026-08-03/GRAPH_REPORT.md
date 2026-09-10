# Graph Report - RolBotV1  (2026-08-03)

## Corpus Check
- 224 files · ~2,361,684 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1724 nodes · 3884 edges · 117 communities (88 shown, 29 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 286 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5fd2d3ee`
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
- supabase.js
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
- admin_perm_list.js
- atacar.js
- statusService.js
- dar_stelas.js
- messageFormatUtils.js
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
- editar_pj.js
- huir.js
- itemService.js
- items.js
- buff.js
- listCharacters
- combatBalance.js
- durabilityPersistenceService.js
- knip-wrapper.mjs
- durability.js
- weapon.js
- getInventory
- eco_admin_list.js
- Decisiones Técnicas
- getActiveCharacter
- listCharacters
- moduleRegistry.js
- grupo_cerrar.js
- ModuleBase.js
- invite.js
- buff.js
- damage.js
- heal.js
- demote.js
- Entity
- bugreport.js
- throwable.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 103 edges
2. `formatError()` - 77 edges
3. `logError()` - 46 edges
4. `getActiveCharacter()` - 40 edges
5. `logSystem()` - 38 edges
6. `formatDisplayMention()` - 30 edges
7. `resolveTargetDisplayName()` - 29 edges
8. `filterExisting()` - 27 edges
9. `getItem()` - 26 edges
10. `findSessionByCharacter()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `simulateBattle()` --calls--> `executeAttack()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `executeReaction()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js

## Import Cycles
- None detected.

## Communities (117 total, 29 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.14
Nodes (37): attemptReconnect(), cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, handleConnectionClose(), handleConnectionOpen() (+29 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.12
Nodes (21): { box }, execute(), { formatError }, { getReport, getUserReports }, CATEGORY_KEYWORDS, createReport(), crypto, determineCategory() (+13 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.13
Nodes (25): checkAdminOnly(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), checkPermission(), { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand() (+17 more)

### Community 4 - "characterService.js"
Cohesion: 0.11
Nodes (27): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+19 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.09
Nodes (39): applyAttackFatigue(), applyDurabilityHit(), { box }, buildAttackGearLines(), { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
  executeAttack,
  executeReaction,
  chooseAiReaction,
  calculateXpReward,
  checkAttackRange,
}, {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
} (+31 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.06
Nodes (52): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+44 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (33): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+25 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.29
Nodes (9): check(), { execSync }, exists(), firstExisting(), fs, path, ROOT, run() (+1 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.08
Nodes (38): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+30 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 11 - "userService.js"
Cohesion: 0.27
Nodes (14): getTierMultiplier(), normalizeTier(), getMaterialStats(), resolveCharacterEquipment(), deriveMetadata(), defaultBaseCost(), getArmorStats(), getArtifactStats() (+6 more)

### Community 12 - "knip.json"
Cohesion: 0.11
Nodes (17): entry, ignoreBinaries, project, rules, dependencies, devDependencies, exports, files (+9 more)

### Community 13 - "getUserProfile"
Cohesion: 0.12
Nodes (21): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), METADATA_UPDATERS, normalizeActivity() (+13 more)

### Community 14 - "unwarn.js"
Cohesion: 0.13
Nodes (19): resolveCombatEquipment(), { ARMOR_SETS }, buildEntriesFromDummy(), { getCategory }, getEquippedItems(), { getEquippedSlots }, getInventoryWithMetadata(), { getItem } (+11 more)

### Community 15 - "economyService.js"
Cohesion: 0.17
Nodes (15): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage, buildFormBody() (+7 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.16
Nodes (20): handlePvPWithReaction(), { box }, { calcFatigueCost, capFatigue }, {
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
}, { getActiveCharacter, setHp }, { rollFlee, executeAttack, executeReaction } (+12 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.29
Nodes (7): DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, { CLASES }, {
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

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.11
Nodes (22): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+14 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.20
Nodes (12): generateDummyCharacter(), buildDummyEquipment(), { getItem }, IRON_DUMMY_LOADOUT, { buildDummyEquipment, IRON_DUMMY_LOADOUT }, CHALLENGER_STATS, { formatCombatStatus, formatCombatOpen }, { generateDummyCharacter } (+4 more)

### Community 20 - "box"
Cohesion: 0.11
Nodes (24): { box }, { formatCommandUsage }, { formatError }, { getActiveCharacter }, SLOTS_LIST, { unequipItem, normalizeSlot, EQUIPMENT_SLOTS }, usageMessage, equipItem() (+16 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.08
Nodes (40): { applyFatiguePenalties }, {
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
}, runSimulation(), simulateBattle() (+32 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.18
Nodes (10): ArmorModule, BuffModule, DamageModule, DurabilityModule, EquipableModule, HealModule, moduleRegistry, TemporalModule (+2 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.09
Nodes (17): A, B, BadMod, BuffModule, ConditionalMod, { Entity, createEntity }, HealModule, HighMod (+9 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.28
Nodes (7): { box }, { formatCommandUsage, formatCommandForm }, { formatError }, { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.17
Nodes (22): execute(), execute(), execute(), executeDeletion(), execute(), execute(), execute(), execute() (+14 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.24
Nodes (14): formatDuration(), getMemory(), getUptime(), stats, bar(), buildErrorLines(), cachedErrors, formatEventLine() (+6 more)

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
Cohesion: 0.13
Nodes (17): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+9 more)

### Community 35 - "LRUCache"
Cohesion: 0.11
Nodes (13): hasColumn(), KNOWN_SCHEMA, { logSystem }, { supabase }, { cache, TTLS }, cachedRead(), groupCacheKey(), { hasColumn } (+5 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.09
Nodes (21): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+13 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.07
Nodes (48): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, getRestContext(), execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError } (+40 more)

### Community 39 - "invite.js"
Cohesion: 0.17
Nodes (13): execute(), { executeGroupAction }, { removeParticipant }, execute(), { executeGroupAction }, { promoteToAdmin }, deleteWarn(), deleteWarns() (+5 more)

### Community 40 - "actividad.js"
Cohesion: 0.21
Nodes (14): appendToLog(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), getRecentErrors(), LOG_PREFIX, LOGS_DIR (+6 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.16
Nodes (22): applyReactionFatigue(), { calcFatigueRecovery, calcFatigueCost, getFatigueLevel }, characterShape(), executeRestTurn(), { executeTurn, executeAttack }, { MAX_ROUNDS, FATIGUE_SNAPSHOT_TURNS }, shouldRest(), simulateCombat() (+14 more)

### Community 43 - "supabase.js"
Cohesion: 0.14
Nodes (13): main(), say(), { supabase }, TEMP_PREFIXES, { BufferJSON, initAuthCreds }, { logError }, { supabase }, { createClient } (+5 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.10
Nodes (21): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity() (+13 more)

### Community 47 - "characterConfig.js"
Cohesion: 0.40
Nodes (5): { addParticipant }, { box }, execute(), { formatError }, addParticipant()

### Community 48 - "midnight_review.js"
Cohesion: 0.20
Nodes (14): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+6 more)

### Community 64 - "item_add.js"
Cohesion: 0.16
Nodes (16): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, execute(), { formatCommandUsage }, formatDisplayRoll() (+8 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (12): createContext, { handleCommand }, { incrementMessages }, { logSystem, logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+4 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.13
Nodes (17): CONTUNDENTE_PERFORANTE_MULT, getSpecialTierMult(), getTierPenaltyBonus(), TIERS, { getTierMultiplier }, MATERIALS, applyMaterialAbsorption(), calculateWeaponDamage() (+9 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.14
Nodes (13): 1. Sistema de Tiers (E, D, C, B, A, S, N), 2. Naturalezas de Daño Físico y Fórmulas de Combate, 3. Sistema de Materiales y Crafteo, 4. Equipamiento, Slots y Cobertura de Armadura, 5. Clasificación de Categorías Generales de Ítems, 🗡️ A. Cortante (Ej: Espadas, Katanas, Hachas), 🔨 B. Contundente (Ej: Mazos, Martillos, Garrotes), Bonos de Set (+5 more)

### Community 71 - "inventoryService.js"
Cohesion: 0.13
Nodes (21): addItem(), characterLocks, { createItem }, { createItemDefinition }, ensureIronFamilyKit(), ensureTempTestKit(), ensureTestKit(), EQUIPABLE_TYPES (+13 more)

### Community 72 - "supabase.js"
Cohesion: 0.09
Nodes (28): discover(), COLUMN_TYPES, createMissingTables(), { CURRENT_VERSION }, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL() (+20 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.15
Nodes (8): getItemsByCategory(), itemCatalog, ITEMS, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 74 - "admin_perm_list.js"
Cohesion: 0.07
Nodes (40): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+32 more)

### Community 75 - "atacar.js"
Cohesion: 0.32
Nodes (6): createEntity(), moduleRegistry, cleanupTemporalItems(), { createEntity }, createItem(), { getItem: getRawItem }

### Community 76 - "statusService.js"
Cohesion: 0.10
Nodes (30): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+22 more)

### Community 77 - "dar_stelas.js"
Cohesion: 0.20
Nodes (9): ARMOR_SETS, getSet(), { ARMOR_SETS, getSet }, { buildItem }, { EQUIPMENT_SLOTS }, { getItem, getItemsByCategory }, { getWeaponStats, getArmorStats }, { IRON_ITEMS, IRON_STATS } (+1 more)

### Community 78 - "messageFormatUtils.js"
Cohesion: 0.13
Nodes (14): Archivos modificados, Archivos nuevos, Arquitectura resultante, Contexto (estado actual del código), Exclusions / no hacer ahora, Fase 1 — Factoría & Registro genérico de definiciones, Fase 2 — Resolución de Estadísticas del Ítem, Fase 3 — Resolución de Equipo → Payload de Combate (+6 more)

### Community 79 - "dado.js"
Cohesion: 0.12
Nodes (28): appendHistoriaLine(), { box }, buildCharacterCreatedBox(), buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute() (+20 more)

### Community 80 - "editar_pj.js"
Cohesion: 0.27
Nodes (10): fs, generatePair(), generateRandomFighter(), generateRandomStats(), main(), path, quintileBuckets(), randomLevel() (+2 more)

### Community 81 - "atacar.js"
Cohesion: 0.15
Nodes (12): Archivos afectados, Contexto (decisiones cerradas), Fase 0 — Aplicar DDL en Supabase (manual · 1 vez · prerrequisito), FASE 1 — Unificar versión de schema (destino), Fase 2 — Alinear esquema conocido (3 archivos), FASE 3 — Blindaje de equipamiento (`equipmentService.js`), FASE 4 — Limpieza de datos huérfanos, FASE 5 — Conectar metadata/durabilidad (OPCIONAL · post-remediación) (+4 more)

### Community 82 - "characterConfig.js"
Cohesion: 0.12
Nodes (18): { addItem }, { box }, { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { IRON_ITEMS }, { parseQuantity }, { box } (+10 more)

### Community 83 - "items.js"
Cohesion: 0.21
Nodes (24): calculateLevel(), xpForNextLevel(), filterExisting(), createCharacter(), {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
}, deleteCharacter(), distribuirPunto(), { filterExisting } (+16 more)

### Community 84 - "clases.js"
Cohesion: 0.10
Nodes (39): handlePvP(), { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu, buildFatigueBar }, { formatError } (+31 more)

### Community 86 - "schedulerService.js"
Cohesion: 0.33
Nodes (8): fixCharacter(), isDryRun, main(), needsMigration(), normalizeStats(), path, { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS }, { supabase }

### Community 88 - "LRUCache"
Cohesion: 0.67
Nodes (3): inventory, trg_inventory_updated_at, update_inventory_updated_at()

### Community 89 - "editar_pj.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 90 - "huir.js"
Cohesion: 0.31
Nodes (9): useItem(), addEffect(), { filterExisting }, getActiveEffects(), getCooldowns(), { logError }, saveSlots(), setCooldown() (+1 more)

### Community 92 - "itemService.js"
Cohesion: 0.29
Nodes (6): { box }, { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage

### Community 93 - "items.js"
Cohesion: 0.50
Nodes (3): characters, combat_sessions, inventory

### Community 94 - "buff.js"
Cohesion: 0.12
Nodes (18): { createItemDefinition }, define(), IRON_ITEMS, IRON_STATS, itemCatalog, itemCatalog, registry, buildItem() (+10 more)

### Community 95 - "listCharacters"
Cohesion: 0.39
Nodes (7): { calculateMovementFatigue }, countSetPieces(), COVERAGE_RULES, getCoverage(), getMovementFatigueWithCoverage(), resolveSetBonuses(), {
  getCoverage,
  getMovementFatigueWithCoverage,
  countSetPieces,
  resolveSetBonuses,
  SET_BONUS_THRESHOLD,
}

### Community 96 - "combatBalance.js"
Cohesion: 0.22
Nodes (8): Deuda Técnica Registrada, TD-001 | Versionado de schema duplicado | resuelto (2026-08-03), TD-002 | Migraciones no aplicables por RPC `exec_sql` inexistente | resuelto (2026-08-03), TD-003 | Esquema conocido desincronizado | resuelto (2026-08-03), TD-004 | `exec_sql` con `security definer` no deseado | abierto, TD-005 | Equipo en contraataques y reacciones no resuelto | abierto, TD-006 | `itemCatalog` inyectable | resuelto parcialmente (2026-08-03), TD-007 | Arma arrojadiza no lanzable en combate real | abierto

### Community 97 - "durabilityPersistenceService.js"
Cohesion: 0.36
Nodes (5): { filterExisting }, { invalidateUserCache }, persistDurability(), readMetadata(), { supabase }

### Community 101 - "getInventory"
Cohesion: 0.14
Nodes (17): { box }, {
  equipItem,
  getEquippedSlots,
  normalizeSlot,
  resolveDefaultSlot,
  EQUIPMENT_SLOTS,
}, execute(), { formatCommandUsage }, { formatError }, { getActiveCharacter }, { getInventoryList }, { getItem } (+9 more)

### Community 102 - "eco_admin_list.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { openGroup }, openGroup()

### Community 103 - "Decisiones Técnicas"
Cohesion: 0.20
Nodes (9): 2026-08-03 — Aplicación de DDL: script SQL manual (no RPC `exec_sql`), 2026-08-03 — Capa de sistema gestor de ítems (infraestructura, sin catálogo), 2026-08-03 � Dummy equipado y equipo en memoria (PvE), 2026-08-03 — Familia del Hierro: puente de catálogo, 2026-08-03 — Fuente única de versión de schema, 2026-08-03 — Integración combate: solo ataque principal (backward-compat), 2026-08-03 — Persistencia de equipamiento: columna `equipped_slots`, 2026-08-03 — UX de inventario por índice + eliminación de iconos de ítems (+1 more)

### Community 104 - "getActiveCharacter"
Cohesion: 0.10
Nodes (26): execute(), { box }, CATEGORIES, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError } (+18 more)

### Community 105 - "listCharacters"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 106 - "moduleRegistry.js"
Cohesion: 0.50
Nodes (3): ModuleBase, moduleRegistry, registry

### Community 107 - "grupo_cerrar.js"
Cohesion: 0.40
Nodes (5): { box }, { closeGroup }, execute(), { formatError }, closeGroup()

### Community 108 - "ModuleBase.js"
Cohesion: 0.20
Nodes (4): ArmorModule, ModuleBase, ModuleBase, TemporalModule

### Community 109 - "invite.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { getInviteCode }, getInviteCode()

### Community 113 - "demote.js"
Cohesion: 0.50
Nodes (4): { demoteFromAdmin }, execute(), { executeGroupAction }, demoteFromAdmin()

### Community 115 - "bugreport.js"
Cohesion: 0.40
Nodes (4): { box }, { createReport }, { formatError }, reportCooldowns

## Knowledge Gaps
- **797 isolated node(s):** `husky.sh script`, `require`, `sonarjs`, `$schema`, `src/core/bot.js` (+792 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `set_stelas.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `economyService.js`, `test_helpers.js`, `formatErrorUtils.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `dado.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `characterConfig.js`, `item_add.js`, `admin_perm_list.js`, `statusService.js`, `dado.js`, `characterConfig.js`, `clases.js`, `editar_pj.js`, `itemService.js`, `getInventory`, `eco_admin_list.js`, `getActiveCharacter`, `listCharacters`, `grupo_cerrar.js`, `invite.js`, `bugreport.js`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `formatError()` connect `set_stelas.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `economyService.js`, `test_helpers.js`, `formatErrorUtils.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `characterConfig.js`, `item_add.js`, `statusService.js`, `dado.js`, `characterConfig.js`, `clases.js`, `editar_pj.js`, `itemService.js`, `getInventory`, `eco_admin_list.js`, `getActiveCharacter`, `grupo_cerrar.js`, `invite.js`, `bugreport.js`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `logError()` connect `bot.js` to `bugReportService.js`, `loggerService.js`, `renombrar_pj.js`, `crear_pj.js`, `grupo_cerrar.js`, `supabase.js`, `actividad.js`, `inventoryService.js`, `supabase.js`, `atacar.js`, `midnight_review.js`, `box`, `huir.js`, `dado.js`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `require`, `sonarjs` to the rest of the system?**
  _797 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13513513513513514 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11857707509881422 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._