# Graph Report - RolBotV1  (2026-08-04)

## Corpus Check
- 245 files · ~2,370,237 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1831 nodes · 4002 edges · 118 communities (90 shown, 28 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 297 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fdabbe67`
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
- inventario.js
- itemService.js
- items.js
- buff.js
- listCharacters
- combatBalance.js
- durabilityPersistenceService.js
- knip-wrapper.mjs
- durability.js
- weapon.js
- eco_admin_list.js
- Decisiones Técnicas
- getActiveCharacter
- listCharacters
- moduleRegistry.js
- ModuleBase.js
- invite.js
- buff.js
- damage.js
- heal.js
- demote.js
- Entity
- bugreport.js
- groupConfig.js
- command_format.test.js
- supabase_auth_state.test.js
- throwable.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 99 edges
2. `logError()` - 44 edges
3. `getActiveCharacter()` - 40 edges
4. `logSystem()` - 30 edges
5. `formatError()` - 30 edges
6. `formatDisplayMention()` - 30 edges
7. `filterExisting()` - 29 edges
8. `resolveTargetDisplayName()` - 29 edges
9. `findSessionByCharacter()` - 28 edges
10. `supabase` - 27 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js
- `simulateBattle()` --calls--> `executeAttack()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `executeReaction()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js

## Import Cycles
- None detected.

## Communities (118 total, 28 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.11
Nodes (31): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+23 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.12
Nodes (19): assertDeclaredImageSize(), CATEGORY_KEYWORDS, crypto, { downloadMediaMessage }, fs, fsp, { getGroupMetadata }, getImageExtension() (+11 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.12
Nodes (23): chatCommandTails, checkAdminOnly(), checkAdminPerm(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), { commands, aliases, registerCommand, getJsFilesRecursively } (+15 more)

### Community 4 - "characterService.js"
Cohesion: 0.11
Nodes (21): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+13 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.16
Nodes (20): { applyFatiguePenalties }, applyMaterialAbsorption(), applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction() (+12 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.12
Nodes (28): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+20 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (35): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+27 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.29
Nodes (9): check(), { execSync }, exists(), firstExisting(), fs, path, ROOT, run() (+1 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.08
Nodes (37): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+29 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.12
Nodes (19): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+11 more)

### Community 11 - "userService.js"
Cohesion: 0.17
Nodes (13): CONTUNDENTE_PERFORANTE_MULT, getSpecialTierMult(), getTierPenaltyBonus(), TIERS, calculateWeaponDamage(), ArmorModule, ATK_STATS, { calculateWeaponDamage, resolveAttackerSpeed } (+5 more)

### Community 12 - "knip.json"
Cohesion: 0.20
Nodes (9): entry, ignoreBinaries, project, rules, dependencies, devDependencies, exports, files (+1 more)

### Community 13 - "getUserProfile"
Cohesion: 0.09
Nodes (30): listAdminsForCategory(), pickDisplayName(), buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles() (+22 more)

### Community 14 - "unwarn.js"
Cohesion: 0.13
Nodes (18): { ARMOR_SETS }, buildEntriesFromDummy(), { getCategory }, getEquippedItems(), { getEquippedSlots }, getInventoryWithMetadata(), { getItem }, { getWeaponStats, getArmorStats, getArtifactStats } (+10 more)

### Community 15 - "economyService.js"
Cohesion: 0.14
Nodes (11): cachedModules, createContext, handleCommand, handlerPath, incrementMessages, logError, logSystem, rawMessage (+3 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.19
Nodes (12): { box }, buildDivider(), buildDummyAttackLines(), buildKoLines(), buildRestLines(), { calcFatigueRecovery, capFatigue }, execute(), { executeAttack, executeReaction, evaluateDodgeFeasibility } (+4 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.24
Nodes (12): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { logError }, { resolveCharacterEquipment }, logError(), cleanupTemporalItems() (+4 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.20
Nodes (16): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+8 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.20
Nodes (10): { getItem }, IRON_DUMMY_LOADOUT, { buildDummyEquipment, IRON_DUMMY_LOADOUT }, CHALLENGER_STATS, { formatCombatStatus, formatCombatOpen }, { generateDummyCharacter }, {
  getEquippedItems,
  resolveAttackerWeapon,
  resolveDefenderArmor,
  resolveCharacterEquipment,
}, { IRON_ITEMS } (+2 more)

### Community 20 - "box"
Cohesion: 0.09
Nodes (33): { box }, execute(), { formatCommandUsage }, { getActiveCharacter }, SLOTS_LIST, { unequipItem, normalizeSlot, EQUIPMENT_SLOTS }, usageMessage, { box } (+25 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.21
Nodes (12): loadCommands(), aliases, commands, fs, getJsFilesRecursively(), normalizeName(), path, registerAlias() (+4 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.07
Nodes (42): { applyFatiguePenalties }, {
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
}, runSimulation(), simulateBattle() (+34 more)

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
Cohesion: 0.16
Nodes (15): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin }, usageMessage (+7 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.23
Nodes (9): { composeMessage }, execute(), { getActiveCharacter }, { getInventoryList }, { box }, composeMessage(), toLines(), { box } (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.27
Nodes (10): resolveTarget(), { box }, execute(), { findSessionByCharacter }, { getActiveCharacter }, resolveUseTarget(), showInventoryList(), updateSessionHp() (+2 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (15): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), buildErrorLines(), cachedErrors (+7 more)

### Community 31 - "dado.js"
Cohesion: 0.12
Nodes (25): COMBAT_ACTIONS, REACTION_ACTIONS, { box }, { buildFatigueBar, buildStatSummary }, {
  combatantLines,
  equipmentSectionLines,
  actionMenuLines,
  reactionPromptLines,
}, { composeMessage }, formatCombatOpen(), formatCombatStatus() (+17 more)

### Community 32 - "formatError"
Cohesion: 0.11
Nodes (18): Archetype Analysis, ASPD, ATK, Bottom 15 Binary Signatures, D_FULGOR, DEF, FULGOR, HP (+10 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.18
Nodes (10): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+2 more)

### Community 35 - "LRUCache"
Cohesion: 0.15
Nodes (10): hasColumn(), getTopBalances(), { cache, TTLS }, cachedRead(), groupCacheKey(), { hasColumn }, invalidateGroupCache(), safeSelect() (+2 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas del repositorio:, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.18
Nodes (9): KNOWN_SCHEMA, { logSystem }, { supabase }, { checkHealth }, { discover, KNOWN_SCHEMA }, loggerService, schemaMigrationPath, schemaVersion (+1 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.06
Nodes (59): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, getRestContext(), execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { getActiveCharacter } (+51 more)

### Community 39 - "invite.js"
Cohesion: 0.14
Nodes (17): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+9 more)

### Community 40 - "actividad.js"
Cohesion: 0.21
Nodes (13): appendToLog(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, LOGS_DIR, parseErrorEntries() (+5 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.15
Nodes (24): applyReactionFatigue(), { calcFatigueRecovery, calcFatigueCost, getFatigueLevel }, characterShape(), executeRestTurn(), { executeTurn, executeAttack }, { MAX_ROUNDS, FATIGUE_SNAPSHOT_TURNS }, shouldRest(), simulateCombat() (+16 more)

### Community 43 - "supabase.js"
Cohesion: 0.06
Nodes (31): Antes y después en la rama v1.6, Auditoría profunda e integración de RolBotV1, Cambios implementados, Combate y persistencia, Conexión y ciclo de vida, Deuda restante priorizada, Evidencia reproducible, Integración sin pérdida de v1.6 (+23 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.14
Nodes (18): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, { GROUP_TOP_LIMIT }, groupActivityTails (+10 more)

### Community 47 - "characterConfig.js"
Cohesion: 0.09
Nodes (36): { addParticipant }, { box }, execute(), { box }, execute(), { openGroup }, { box }, { closeGroup } (+28 more)

### Community 48 - "midnight_review.js"
Cohesion: 0.29
Nodes (10): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+2 more)

### Community 64 - "item_add.js"
Cohesion: 0.14
Nodes (17): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, execute(), { formatCommandUsage }, formatDisplayRoll() (+9 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (12): createContext, { handleCommand }, { incrementMessages }, { logSystem, logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+4 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.24
Nodes (14): getTierMultiplier(), normalizeTier(), getMaterialStats(), { getTierMultiplier }, MATERIALS, deriveMetadata(), defaultBaseCost(), getArmorStats() (+6 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.14
Nodes (13): 1. Sistema de Tiers (E, D, C, B, A, S, N), 2. Naturalezas de Daño Físico y Fórmulas de Combate, 3. Sistema de Materiales y Crafteo, 4. Equipamiento, Slots y Cobertura de Armadura, 5. Clasificación de Categorías Generales de Ítems, 🗡️ A. Cortante (Ej: Espadas, Katanas, Hachas), 🔨 B. Contundente (Ej: Mazos, Martillos, Garrotes), Bonos de Set (+5 more)

### Community 71 - "inventoryService.js"
Cohesion: 0.13
Nodes (15): characterLocks, { createItem }, { createItemDefinition }, EQUIPABLE_TYPES, { filterExisting }, { getActiveCharacter, setHp }, { getItem }, { invalidateUserCache } (+7 more)

### Community 72 - "supabase.js"
Cohesion: 0.11
Nodes (16): main(), say(), { supabase }, TEMP_PREFIXES, { BufferJSON, initAuthCreds, makeCacheableSignalKeyStore }, { logError }, { supabase }, useSupabaseAuthState() (+8 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.15
Nodes (8): getItemsByCategory(), itemCatalog, ITEMS, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 74 - "admin_perm_list.js"
Cohesion: 0.09
Nodes (35): { box }, CATEGORY_DISPLAY, execute(), { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, { box }, execute(), { getOwnerRecords } (+27 more)

### Community 75 - "atacar.js"
Cohesion: 0.18
Nodes (15): buildHpBar(), characterSheet(), { composeMessage }, { equipmentSummaryLines }, formatHpState(), { getItem }, headerLines(), inventorySectionLines() (+7 more)

### Community 76 - "statusService.js"
Cohesion: 0.14
Nodes (20): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+12 more)

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
Cohesion: 0.13
Nodes (20): { addItem }, { box }, execute(), { getActiveCharacter }, { getItem, ITEMS }, { IRON_ITEMS }, { parseQuantity }, { box } (+12 more)

### Community 83 - "items.js"
Cohesion: 0.14
Nodes (31): execute(), calculateLevel(), DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel() (+23 more)

### Community 84 - "clases.js"
Cohesion: 0.08
Nodes (54): applyAttackFatigue(), applyDurabilityHit(), { box }, buildAttackGearLines(), { calcFatigueCost, capFatigue }, execute(), {
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
} (+46 more)

### Community 86 - "schedulerService.js"
Cohesion: 0.33
Nodes (8): fixCharacter(), isDryRun, main(), needsMigration(), normalizeStats(), path, { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS }, { supabase }

### Community 87 - "heal.js"
Cohesion: 0.27
Nodes (10): checkPermission(), getActorId(), handleCommand(), handleCommandError(), recordActivity(), serializeChatCommand(), logCommand(), safeStringify() (+2 more)

### Community 88 - "LRUCache"
Cohesion: 0.10
Nodes (17): bugReportServicePath, cachedModules, { createReport }, crypto, discover, downloadMediaMessage, fs, fsp (+9 more)

### Community 89 - "editar_pj.js"
Cohesion: 0.25
Nodes (6): cachedModules, { commands, aliases }, { handleCommand }, handlerPath, logCommand, logError

### Community 90 - "huir.js"
Cohesion: 0.31
Nodes (9): useItem(), addEffect(), { filterExisting }, getActiveEffects(), getCooldowns(), { logError }, saveSlots(), setCooldown() (+1 more)

### Community 91 - "inventario.js"
Cohesion: 0.10
Nodes (28): discover(), COLUMN_TYPES, createMissingTables(), { CURRENT_VERSION }, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL() (+20 more)

### Community 92 - "itemService.js"
Cohesion: 0.38
Nodes (5): createEntity(), moduleRegistry, { createEntity }, createItem(), { getItem: getRawItem }

### Community 93 - "items.js"
Cohesion: 0.16
Nodes (10): cache, TTLS, { addMoney, getBalance, transferMoney }, { cache, TTLS }, createContext, { recordGroupActivity }, { recordUserActivity }, { supabase } (+2 more)

### Community 94 - "buff.js"
Cohesion: 0.13
Nodes (18): { createItemDefinition }, define(), IRON_ITEMS, IRON_STATS, itemCatalog, itemCatalog, registry, buildItem() (+10 more)

### Community 95 - "listCharacters"
Cohesion: 0.36
Nodes (8): { calculateMovementFatigue }, countSetPieces(), COVERAGE_RULES, getCoverage(), getMovementFatigueWithCoverage(), resolveSetBonuses(), resolveCharacterEquipment(), {
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

### Community 102 - "eco_admin_list.js"
Cohesion: 0.21
Nodes (11): { box }, executeEconomyAction(), { formatCommandUsage }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, getUsage(), { resolveTargetDisplayName } (+3 more)

### Community 103 - "Decisiones Técnicas"
Cohesion: 0.18
Nodes (10): 2026-08-03 — Aplicación de DDL: script SQL manual (no RPC `exec_sql`), 2026-08-03 — Capa de sistema gestor de ítems (infraestructura, sin catálogo), 2026-08-03 � Dummy equipado y equipo en memoria (PvE), 2026-08-03 — Familia del Hierro: puente de catálogo, 2026-08-03 — Fuente única de versión de schema, 2026-08-03 — Integración combate: solo ataque principal (backward-compat), 2026-08-03 — Persistencia de equipamiento: columna `equipped_slots`, 2026-08-03 — UI por secciones reutilizables + registro declarativo de acciones de combate (+2 more)

### Community 104 - "getActiveCharacter"
Cohesion: 0.08
Nodes (39): execute(), { box }, CATEGORIES, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError } (+31 more)

### Community 105 - "listCharacters"
Cohesion: 0.16
Nodes (13): { box }, execute(), executeDeletion(), { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage (+5 more)

### Community 106 - "moduleRegistry.js"
Cohesion: 0.50
Nodes (3): ModuleBase, moduleRegistry, registry

### Community 108 - "ModuleBase.js"
Cohesion: 0.20
Nodes (4): ArmorModule, ModuleBase, ModuleBase, TemporalModule

### Community 109 - "invite.js"
Cohesion: 0.22
Nodes (9): { box }, { createReport }, execute(), reportCooldowns, createReport(), determineCategory(), determinePriority(), getDailyCount() (+1 more)

### Community 113 - "demote.js"
Cohesion: 0.38
Nodes (6): { box }, execute(), { formatError }, { getReport, getUserReports }, getReport(), getUserReports()

### Community 117 - "groupConfig.js"
Cohesion: 0.40
Nodes (4): bugreport, commandPath, createReport, servicePath

### Community 118 - "command_format.test.js"
Cohesion: 0.12
Nodes (23): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage, buildFormBody() (+15 more)

### Community 119 - "supabase_auth_state.test.js"
Cohesion: 0.67
Nodes (3): cachedModules, loadAuthState(), mockCommonJsModule()

## Knowledge Gaps
- **854 isolated node(s):** `husky.sh script`, `$schema`, `entry`, `project`, `files` (+849 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `characterConfig.js` to `characterService.js`, `box`, `characterProgressionService.js`, `test_helpers.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `IA_rolbot — RolBotV1`, `set_stelas.js`, `dado.js`, `inventario.js`, `grupo_cerrar.js`, `invite.js`, `item_add.js`, `admin_perm_list.js`, `statusService.js`, `dado.js`, `characterConfig.js`, `items.js`, `clases.js`, `eco_admin_list.js`, `getActiveCharacter`, `listCharacters`, `invite.js`, `demote.js`, `command_format.test.js`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `supabase` connect `supabase.js` to `bugReportService.js`, `durabilityPersistenceService.js`, `formatError`, `crear_pj.js`, `grupo_cerrar.js`, `getActiveCharacter`, `inventoryService.js`, `economyAdminHelper.js`, `getUserProfile`, `Plan: Implementacion de Stats Magicas + Correcciones`, `unwarn.js`, `midnight_review.js`, `characterConfig.js`, `items.js`, `box`, `huir.js`, `inventario.js`, `items.js`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `logError()` connect `groupUtils.js` to `bot.js`, `bugReportService.js`, `loggerService.js`, `renombrar_pj.js`, `crear_pj.js`, `grupo_cerrar.js`, `supabase.js`, `actividad.js`, `inventoryService.js`, `invite.js`, `midnight_review.js`, `clases.js`, `box`, `heal.js`, `huir.js`, `inventario.js`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `entry` to the rest of the system?**
  _854 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11051693404634581 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._