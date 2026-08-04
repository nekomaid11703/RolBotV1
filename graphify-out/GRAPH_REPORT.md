# Graph Report - RolBotV1  (2026-08-03)

## Corpus Check
- 232 files · ~2,363,053 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1758 nodes · 3940 edges · 120 communities (88 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 298 edges (avg confidence: 0.51)
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
- clases.js
- groupConfig.js
- command_format.test.js
- throwable.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 99 edges
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
- `simulateBattle()` --calls--> `executeAttack()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `executeReaction()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `calcFatigueCost()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/fatigueEngine.js

## Import Cycles
- None detected.

## Communities (120 total, 32 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.14
Nodes (35): attemptReconnect(), cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, handleConnectionClose(), handleConnectionOpen() (+27 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.10
Nodes (25): { box }, { createReport }, execute(), { formatError }, reportCooldowns, { box }, execute(), { formatError } (+17 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.11
Nodes (28): checkAdminOnly(), checkAdminPerm(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), checkPermission(), { commands, aliases, registerCommand, getJsFilesRecursively } (+20 more)

### Community 4 - "characterService.js"
Cohesion: 0.11
Nodes (27): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+19 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.20
Nodes (16): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction(), {
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_DISTANCE_BLOCK,
  ASPD_PENALTY_PER_5M,
} (+8 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.24
Nodes (17): addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getMoneyValue(), { getUserProfile, getOrCreateProfile, saveUserProfile }, { logError }, removeMoney() (+9 more)

### Community 7 - "box"
Cohesion: 0.11
Nodes (32): execute(), { box }, execute(), { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName } (+24 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.29
Nodes (9): check(), { execSync }, exists(), firstExisting(), fs, path, ROOT, run() (+1 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.08
Nodes (38): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+30 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.12
Nodes (19): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+11 more)

### Community 11 - "userService.js"
Cohesion: 0.23
Nodes (13): getTierMultiplier(), normalizeTier(), getMaterialStats(), { getTierMultiplier }, MATERIALS, deriveMetadata(), defaultBaseCost(), getMaterialCost() (+5 more)

### Community 12 - "knip.json"
Cohesion: 0.11
Nodes (17): entry, ignoreBinaries, project, rules, dependencies, devDependencies, exports, files (+9 more)

### Community 13 - "getUserProfile"
Cohesion: 0.12
Nodes (21): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), METADATA_UPDATERS, normalizeActivity() (+13 more)

### Community 14 - "unwarn.js"
Cohesion: 0.13
Nodes (22): resolveCombatEquipment(), { ARMOR_SETS }, buildEntriesFromDummy(), { getCategory }, getEquippedItems(), { getEquippedSlots }, getInventoryWithMetadata(), { getItem } (+14 more)

### Community 15 - "economyService.js"
Cohesion: 0.17
Nodes (16): { box }, { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile }, { resolveTargetDisplayName } (+8 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueCost, capFatigue }, {
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
}, { getActiveCharacter, setHp }, { rollFlee, executeAttack, executeReaction }

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
Nodes (21): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+13 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.18
Nodes (11): IRON_ITEMS, { getItem }, IRON_DUMMY_LOADOUT, { buildDummyEquipment, IRON_DUMMY_LOADOUT }, CHALLENGER_STATS, { formatCombatStatus, formatCombatOpen }, { generateDummyCharacter }, {
  getEquippedItems,
  resolveAttackerWeapon,
  resolveDefenderArmor,
  resolveCharacterEquipment,
} (+3 more)

### Community 20 - "box"
Cohesion: 0.11
Nodes (24): { box }, { formatCommandUsage }, { formatError }, { getActiveCharacter }, SLOTS_LIST, { unequipItem, normalizeSlot, EQUIPMENT_SLOTS }, usageMessage, equipItem() (+16 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.06
Nodes (48): execute(), executeDeletion(), { box }, { calculateMovementFatigue, capFatigue, getMovementRange }, { checkAttackRange }, execute(), { findSessionByCharacter, updateDistance }, { formatCommandUsage } (+40 more)

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
Cohesion: 0.15
Nodes (16): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+8 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.27
Nodes (10): { box }, execute(), { findSessionByCharacter }, { formatError }, { getActiveCharacter }, resolveUseTarget(), showInventoryList(), updateSessionHp() (+2 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (15): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), buildErrorLines(), cachedErrors (+7 more)

### Community 31 - "dado.js"
Cohesion: 0.05
Nodes (56): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { logError }, { resolveCharacterEquipment }, { composeMessage }, execute() (+48 more)

### Community 32 - "formatError"
Cohesion: 0.11
Nodes (18): Archetype Analysis, ASPD, ATK, Bottom 15 Binary Signatures, D_FULGOR, DEF, FULGOR, HP (+10 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.12
Nodes (14): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+6 more)

### Community 35 - "LRUCache"
Cohesion: 0.13
Nodes (12): hasColumn(), cache, TTLS, { cache, TTLS }, cachedRead(), groupCacheKey(), { hasColumn }, invalidateGroupCache() (+4 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.14
Nodes (17): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+9 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.08
Nodes (40): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, { createSession, createDummySession, findSessionByCharacter }, { ensureTempTestKit, ensureIronFamilyKit }, execute(), { formatCombatOpen }, { formatError } (+32 more)

### Community 39 - "invite.js"
Cohesion: 0.13
Nodes (18): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+10 more)

### Community 40 - "actividad.js"
Cohesion: 0.19
Nodes (14): appendToLog(), cleanOldLogs(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, LOGS_DIR (+6 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.11
Nodes (28): { applyFatiguePenalties }, {
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
}, runSimulation(), simulateBattle() (+20 more)

### Community 43 - "supabase.js"
Cohesion: 0.18
Nodes (10): { box }, execute(), { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, getTopBalances(), formatStelas() (+2 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.21
Nodes (16): buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity(), getTopGroupMembers(), { GROUP_TOP_LIMIT } (+8 more)

### Community 47 - "characterConfig.js"
Cohesion: 0.12
Nodes (15): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+7 more)

### Community 48 - "midnight_review.js"
Cohesion: 0.19
Nodes (15): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+7 more)

### Community 64 - "item_add.js"
Cohesion: 0.07
Nodes (37): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, execute(), { formatCommandUsage }, formatDisplayRoll() (+29 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (12): createContext, { handleCommand }, { incrementMessages }, { logSystem, logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+4 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.15
Nodes (15): CONTUNDENTE_PERFORANTE_MULT, getSpecialTierMult(), getTierPenaltyBonus(), TIERS, applyMaterialAbsorption(), calculateWeaponDamage(), resolveAttackerSpeed(), ArmorModule (+7 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.14
Nodes (13): 1. Sistema de Tiers (E, D, C, B, A, S, N), 2. Naturalezas de Daño Físico y Fórmulas de Combate, 3. Sistema de Materiales y Crafteo, 4. Equipamiento, Slots y Cobertura de Armadura, 5. Clasificación de Categorías Generales de Ítems, 🗡️ A. Cortante (Ej: Espadas, Katanas, Hachas), 🔨 B. Contundente (Ej: Mazos, Martillos, Garrotes), Bonos de Set (+5 more)

### Community 71 - "inventoryService.js"
Cohesion: 0.13
Nodes (24): addItem(), characterLocks, cleanupTemporalItems(), { createItem }, { createItemDefinition }, ensureIronFamilyKit(), ensureTempTestKit(), ensureTestKit() (+16 more)

### Community 72 - "supabase.js"
Cohesion: 0.06
Nodes (44): main(), say(), { supabase }, TEMP_PREFIXES, { BufferJSON, initAuthCreds }, { logError }, { supabase }, discover() (+36 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.25
Nodes (3): { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl

### Community 74 - "admin_perm_list.js"
Cohesion: 0.21
Nodes (17): OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText(), getMessageType(), isTextLikeMessageType(), TEXT_MESSAGE_TYPES, unwrapMessageContent() (+9 more)

### Community 75 - "atacar.js"
Cohesion: 0.24
Nodes (7): getItemsByCategory(), itemCatalog, ITEMS, { createEntity }, { getItem: getRawItem }, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 76 - "statusService.js"
Cohesion: 0.13
Nodes (22): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+14 more)

### Community 77 - "dar_stelas.js"
Cohesion: 0.20
Nodes (9): ARMOR_SETS, getSet(), { ARMOR_SETS, getSet }, { buildItem }, { EQUIPMENT_SLOTS }, { getItem, getItemsByCategory }, { getWeaponStats, getArmorStats }, { IRON_ITEMS, IRON_STATS } (+1 more)

### Community 78 - "messageFormatUtils.js"
Cohesion: 0.13
Nodes (14): Archivos modificados, Archivos nuevos, Arquitectura resultante, Contexto (estado actual del código), Exclusions / no hacer ahora, Fase 1 — Factoría & Registro genérico de definiciones, Fase 2 — Resolución de Estadísticas del Ítem, Fase 3 — Resolución de Equipo → Payload de Combate (+6 more)

### Community 79 - "dado.js"
Cohesion: 0.15
Nodes (24): appendHistoriaLine(), { box }, buildCharacterCreatedBox(), buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute() (+16 more)

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
Nodes (24): execute(), calculateLevel(), xpForNextLevel(), filterExisting(), createCharacter(), {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
}, deleteCharacter(), distribuirPunto() (+16 more)

### Community 84 - "clases.js"
Cohesion: 0.11
Nodes (46): applyAttackFatigue(), applyDurabilityHit(), { box }, buildAttackGearLines(), { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
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
} (+38 more)

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
Cohesion: 0.33
Nodes (8): addEffect(), { filterExisting }, getActiveEffects(), getCooldowns(), { logError }, saveSlots(), setCooldown(), { supabase }

### Community 92 - "itemService.js"
Cohesion: 0.35
Nodes (11): applyReactionFatigue(), { calcFatigueRecovery, calcFatigueCost, getFatigueLevel }, characterShape(), executeRestTurn(), { executeTurn, executeAttack }, { MAX_ROUNDS, FATIGUE_SNAPSHOT_TURNS }, shouldRest(), simulateCombat() (+3 more)

### Community 93 - "items.js"
Cohesion: 0.50
Nodes (3): characters, combat_sessions, inventory

### Community 94 - "buff.js"
Cohesion: 0.12
Nodes (19): { createItemDefinition }, define(), IRON_STATS, itemCatalog, itemCatalog, registry, createEntity(), moduleRegistry (+11 more)

### Community 95 - "listCharacters"
Cohesion: 0.36
Nodes (8): { calculateMovementFatigue }, countSetPieces(), COVERAGE_RULES, getCoverage(), getMovementFatigueWithCoverage(), resolveSetBonuses(), calculateMovementFatigue(), {
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
Cohesion: 0.19
Nodes (12): { box }, {
  equipItem,
  getEquippedSlots,
  normalizeSlot,
  resolveDefaultSlot,
  EQUIPMENT_SLOTS,
}, execute(), { formatCommandUsage }, { formatError }, { getActiveCharacter }, { getInventoryList }, { getItem } (+4 more)

### Community 102 - "eco_admin_list.js"
Cohesion: 0.17
Nodes (11): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+3 more)

### Community 103 - "Decisiones Técnicas"
Cohesion: 0.18
Nodes (10): 2026-08-03 — Aplicación de DDL: script SQL manual (no RPC `exec_sql`), 2026-08-03 — Capa de sistema gestor de ítems (infraestructura, sin catálogo), 2026-08-03 � Dummy equipado y equipo en memoria (PvE), 2026-08-03 — Familia del Hierro: puente de catálogo, 2026-08-03 — Fuente única de versión de schema, 2026-08-03 — Integración combate: solo ataque principal (backward-compat), 2026-08-03 — Persistencia de equipamiento: columna `equipped_slots`, 2026-08-03 — UI por secciones reutilizables + registro declarativo de acciones de combate (+2 more)

### Community 104 - "getActiveCharacter"
Cohesion: 0.08
Nodes (39): execute(), { box }, CATEGORIES, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError } (+31 more)

### Community 105 - "listCharacters"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 106 - "moduleRegistry.js"
Cohesion: 0.50
Nodes (3): ModuleBase, moduleRegistry, registry

### Community 107 - "grupo_cerrar.js"
Cohesion: 0.29
Nodes (8): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), formatDuration()

### Community 108 - "ModuleBase.js"
Cohesion: 0.20
Nodes (4): ArmorModule, ModuleBase, ModuleBase, TemporalModule

### Community 109 - "invite.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { getInviteCode }, getInviteCode()

### Community 113 - "demote.js"
Cohesion: 0.25
Nodes (7): { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, { executeReaction, calculateXpReward }, { findSessionByCharacter, advanceTurn, endSession }, { formatActionMenu, buildFatigueBar }, { formatError }, { getActiveCharacter, addXp, setHp }

### Community 116 - "clases.js"
Cohesion: 0.53
Nodes (4): CLASES, getClase(), validarClase(), { CLASES, getClase, listarClases, validarClase }

## Knowledge Gaps
- **812 isolated node(s):** `husky.sh script`, `require`, `sonarjs`, `$schema`, `src/core/bot.js` (+807 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `bugReportService.js`, `characterProgressionService.js`, `economyService.js`, `test_helpers.js`, `formatErrorUtils.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `set_stelas.js`, `dado.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `supabase.js`, `characterConfig.js`, `item_add.js`, `statusService.js`, `dado.js`, `characterConfig.js`, `items.js`, `clases.js`, `editar_pj.js`, `getInventory`, `eco_admin_list.js`, `getActiveCharacter`, `listCharacters`, `grupo_cerrar.js`, `invite.js`, `demote.js`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `formatError()` connect `resolveTargetDisplayName` to `bugReportService.js`, `box`, `characterProgressionService.js`, `test_helpers.js`, `formatErrorUtils.js`, `box`, `set_stelas.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `characterConfig.js`, `item_add.js`, `statusService.js`, `dado.js`, `characterConfig.js`, `items.js`, `clases.js`, `editar_pj.js`, `getInventory`, `eco_admin_list.js`, `getActiveCharacter`, `invite.js`, `demote.js`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `logError()` connect `bot.js` to `bugReportService.js`, `loggerService.js`, `renombrar_pj.js`, `crear_pj.js`, `grupo_cerrar.js`, `supabase.js`, `actividad.js`, `inventoryService.js`, `midnight_review.js`, `clases.js`, `box`, `huir.js`, `dado.js`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `require`, `sonarjs` to the rest of the system?**
  _812 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._