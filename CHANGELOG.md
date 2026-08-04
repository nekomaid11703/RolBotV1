# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-08-04

### Added

- **Sistema de ítems v1.6**: equipo equipable por slot, durabilidad y absorción de material.
- **Equipo del dummy (PvE)**: el maniquí resuelve su equipo vía `equipmentResolverService` en el combate.
- **UI por secciones**: `src/ui/sectionBuilder.js` (`composeMessage`) + secciones de combate, personaje y equipo; menú de combate y reacciones data-driven vía `src/data/combatActions.js`.
- **Persistencia de `combat_sessions.distance`** y migración idempotente `004_harden_inventory_access.sql`.
- Pruebas de límites de seguridad, ciclo de vida, caché, actividad/UX y persistencia de combate.
- Reporte técnico y resumen en formato WhatsApp.

### Changed

- Integración de la auditoría de `main` sobre `AI_rolbot` sin retirar los sistemas v1.6.
- Escrituras de actividad, economía y combate reducidas o acotadas por dominio.
- Reconexión de Baileys, almacenamiento de auth, respuestas de error, menciones y helpers administrativos endurecidos.
- `recordGroupActivity` encadenado tras `recordUserActivity` para respetar el FK `group_members.player_phone → players`.
- Toolchain reproducible con 528 pruebas, Knip limpio, cero violaciones de arquitectura y cero vulnerabilidades auditadas.

### Security

- Eliminado el alias owner codificado y corregido el sentinel de permisos denegados.
- Multimedia de `/bugreport` limitada por MIME, tamaño, streaming y ruta segura.
- RLS forzado y privilegios revocados para `inventory` y `combat_sessions`.

## [1.5.0] - 2026-07-25

### Added

- **Sistema modular universal**: `ModuleBase`, `moduleRegistry` y `Entity` — ítems definidos por módulos con hooks (`TurnStart`, `TurnEnd`, `CombatEnd`, `Use`) y condiciones.
- **Mecánica de distancia v1.5**: distancia inicial 5m, alcance efectivo por MSPD/arma, penalización ASPD por bloque de 5m, `/avanzar` y `/retroceder`, IA del dummy con toma de decisiones por distancia.
- **Sistema de fatiga**: 4 niveles con penalidades de velocidad, costos por acción y recuperación.
- Simulación de balance (`scripts/simulate_battles.js`) con parámetros centralizados en `combatBalance.js`.

### Changed

- Hooks de combate conectados a producción (`combatState`, `combatEngine`, `statusService`).
- Constantes de balance migradas a `src/config/combatBalance.js`.

## [1.4.0] - 2026-07-24

### Changed

- **Refactor completo de stats**: HP leveleable, stats base = 1 y nueva fórmula de DEF.

## [1.3.0] - 2026-07-24

### Added

- **Inventario conectado a Supabase**: tabla `inventory` con `character_id` FK, catálogo de consumibles y comandos `/inventario` y `/usar` con bloqueo `withCharacterLock`.
- **Combate melee determinista**: sesiones en memoria con expiración (10 min reto, 48 h turno), reacciones bloquear/esquivar, umbrales activos por HP y comandos `/retar`, `/estado` y `/disolver_combate`.

## [1.2.0] - 2026-07-23

### Added

- **Fatigue System** (`fatigueEngine.js`): Nueva mecánica de combate que evita el esquive perpetuo
  - 4 niveles de fatiga: Pleno (0%), Agitado (-20%), Cansado (-40%), Fatigado (-60%) en velocidades (ASPD, MSPD, REF)
  - Costos de fatiga por acción: atacar (+3), esquivar (+6), bloquear (+1), huir (+4), usar ítem (+2)
  - Recuperación al bloquear (-3 base, escala según nivel de fatiga) y descansar (-5 base)
  - La resistencia (DEF) determina el umbral de fatiga del personaje
  - Penalidades de fatiga se aplican ANTES que las de HP (apilamiento progresivo)
- **`buildFatigueBar()`**: Barra visual de fatiga con icono por nivel (🟢 Pleno, 🟠 Agitado, 🟡 Cansado, 🔴 Fatigado)
- **29 tests** para `fatigueEngine.js` (umbrales, costos, recuperación, penalidades)
- **7 tests adicionales** en `combat_engine.test.js` (integración fatiga+HP, fatiga en reacciones)

### Changed

- `combatEngine.js`: Todas las funciones reciben parámetros opcionales de fatiga y la integran en cálculos
- `combatState.js`: Sesiones de combate ahora trackean `fatigue` por participante
- `atacar.js`, `esquivar.js`, `bloquear.js`, `huir.js`: Aplican costos/recuperación de fatiga según acción
- `combatMessages.js`: `formatCombatStatus` y `formatFlee` muestran fatiga; exporta `buildFatigueBar`

## [1.1.0] - 2026-07-22

### Added

- **userService tests**: 14 tests for `sanitizeName` (accent stripping, whitespace normalization, forbidden chars, edge cases)
- **combatState tests**: 16 tests for `generateDummyCharacter`, `isSessionActive`, `isSessionExpired` (pure logic, no DB)
- **permissionService tests**: 6 tests for `getCategoryLabel` (category label mapping)
- **economyService tests**: 5 tests for config constants (`DAILY_BASE_REWARD`, `DAILY_COOLDOWN_HOURS`, etc.)

### Changed

- Test suite expanded from 237 to 289 tests (+52 tests, +22% coverage), then cleaned to 263 tests (-26 low-value tests)
- 19 test files (down from 22, removed 3 low-quality files)
- `cache_state.test.js` deleted: tested local-only function, not a real module
- `crear_pj.test.js` deleted: tested local parser reimplementation, not the actual command
- `character_service.test.js` deleted: trivial stub returning hardcoded values
- 5 legacy `test_*.js` files deleted (duplicates of vitest equivalents)
- `economy_service.test.js` stripped: removed local function redefinitions (`getMoneyValue`, `validateAmount`) that bypassed the real module
- `inventory.test.js`: removed `item_add` duplicate (covered by `item_commands.test.js`)
- `combat_ai.test.js`: removed `generateDummyCharacter` duplicate (covered by `combat_state.test.js`)

## [1.0.0] - 2026-07-22

### Added

- **Help System**: Reorganized into 3 sections (Administrador/Creador/Comunes) with subcategories (RPG, Economía, Grupo, Permisos, Info)
- **Permission System**: Generic extensible permission system with `adminPerm` flag on commands. Categories stored in `bot_auth_state.data.categories` map
- **Permission Commands**: `admin_perm_add`, `admin_perm_rem`, `admin_perm_list` for managing category-based admin permissions
- **Item Commands**: `item_add` (renamed from `dar_item`) and `item_rem` for inventory management
- **Combat System**: PvE/PvP combat with Supabase persistence
  - Sessions stored in `combat_sessions` table
  - Timer-based expiry (48h turn timeout) instead of setTimeout
  - Auto-cleanup every 5 minutes
  - Max 50 active sessions limit
- **Inventory System**: Items, consumables, and equipment management
- **Character System**: 21 canon races, character progression
- **Schema Migration**: Version 2.1.0 with `combat_sessions` table creation

### Changed

- Help command reorganized from 4 flat categories to 3 permission-based sections
- All 33 command `category:` strings updated (rpg, admin, info)
- `dar_item` renamed to `item_add` (alias preserved for backward compatibility)
- `combatConfig.js`: Added `MAX_ACTIVE_SESSIONS=50`, `CLEANUP_INTERVAL_MS=300000`
- `combatConfig.js`: Removed `CHALLENGE_TIMEOUT_MS` (was dead code)
- `combatState.js`: Complete rewrite with Supabase persistence
- `bot.js`: Added `restoreSessions()` and `startCleanupInterval()` on startup

### Fixed

- Combat session persistence across bot restarts
- Timer-based combat expiry using verification instead of setTimeout
- Auto-cleanup of expired combat sessions

### Technical

- 17 test files with 237 passing tests
- ESLint configuration updated for scripts directory
- Supabase RPC integration for table creation
