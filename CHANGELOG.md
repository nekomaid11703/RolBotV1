# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
