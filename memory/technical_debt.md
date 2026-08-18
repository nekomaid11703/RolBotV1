# Deuda Técnica Registrada

Registro de deuda técnica detectada. Formato: `TD-XXX | título | estado | descripción`. Estado: `abierto` | `resuelto`.

---

## TD-001 | Versionado de schema duplicado | resuelto (2026-08-03)

`schemaVersion.js` (2.0.0) y `schemaMigration.js` (2.1.0) tenían `CURRENT_VERSION` duplicados y desincronizados. Centralizado en `src/database/schemaConstants.js` (2.2.0).

## TD-002 | Migraciones no aplicables por RPC `exec_sql` inexistente | resuelto (2026-08-03)

`createMissingTables()` fallaba en silencio. Aplicadas manualmente vía SQL Editor (migración 003) y documentado el DDL canónico. Pendiente evaluar herramienta de migración (Supa CLI) para el futuro.

## TD-003 | Esquema conocido desincronizado | resuelto (2026-08-03)

`KNOWN_SCHEMA`/`SCHEMA`/`DESIRED_SCHEMA` no reflejaban la DB real (faltaba `category`; tipos `bigint` vs `uuid`). Alineados en FASE 2 de la remediación.

## TD-004 | `exec_sql` con `security definer` no deseado | abierto

Se decidió NO crear el RPC `exec_sql`. La auto-migración en arranque queda limitada a columnas vía `generateMigrationSQL` + `logMigrationInfo` (log-only). Si se requiere auto-migración de tablas en el futuro, evaluar Supa CLI o un proceso de migración fuera de línea.

## TD-005 | Equipo en contraataques y reacciones no resuelto | abierto

`atacar.js` resuelve `weaponInfo`/`armorDurability` solo en el ataque principal (PvE/PvP). Los contraataques de `descansar.js`/`huir.js` y la absorción de material en reacciones `esquivar/bloquear` operan backward-compat (desarmado/sin armadura). Pendiente: resolver equipo del rol atacante en cada turno/contraataque y soportar absorción multi-pieza (el `combatEngine` hoy acepta una sola instancia `DurabilityModule`).

## TD-006 | `itemCatalog` inyectable | resuelto parcialmente (2026-08-03)

El registro de definiciones de ítem (`src/data/itemCatalog.js`) partió vacío a propósito (solo mecánica). Con la **Familia del Hierro** (v2.6.0) el catálogo ya tiene 7 definiciones y `getItem` cruza a él. Pendiente: más familias y consumo desde tienda/crafteo.

## TD-007 | Arma arrojadiza no lanzable en combate real | abierto

El `kunai_de_hierro` (tipo `throwable`) está definido y su módulo emite payload `Throw`/`Use` (`damageNature`/`baseDamage`/`range`/`consumedOnUse`), pero aún no hay un flujo de combate que (a) permita lanzarlo desde el inventario (`/usar` o `/lanzar`), (b) consuma el turno de ataque y (c) descuente 1 unidad. El kit de hierro ya lo siembra (x5), por lo que queda listo para integrar con `combatEngine` + `inventoryService.useItem`. Pendiente de integrar con `combatEngine` + `inventoryService.useItem`.

## TD-008 | Scripts de graphify rotos tras merge perf/harden | resuelto (2026-08-04)

Los scripts pasaron a `python -m graphify` en `package.json` (binario desnudo `graphify` no está en PATH). Grafo regenerado: 1865 nodos, 4032 aristas, 120 comunidades.

## TD-009 | Colisión de numeración de migraciones `002_*` | resuelto (2026-08-04)

`002_rename_stats_keys.sql` renombrada a `005_rename_stats_keys.sql`. Quedan: 001, 002_add_item, 003, 004, 005.

## TD-010 | Directorios ignorados pero trackeados | resuelto (2026-08-04)

`git rm --cached` sobre `_archive/` (16 archivos) y `ai-memory/` (6 archivos). Quedan en disco, fuera del índice.

## TD-011 | Documentación desactualizada vs herramienta real | resuelto (2026-08-04)

(1) `AGENTS.md` actualizado: invocación `python -m graphify` (0.9.12), conteos del grafo vigentes y todas las consultas vía npm scripts. (2) `ADR-002` ajustado: Stryker diferido a Fase 3.3 del roadmap.

## TD-012 | `test_supabase_schema.js` sin runner | resuelto (2026-08-04)

Convertido en healthcheck manual gated: salta (exit 0) si no hay `SUPABASE_URL` real configurada, y añadidas `inventory` y `combat_sessions` a la lista de tablas requeridas.

## TD-013 | Carrera FK `group_members_player_phone_fkey` en primer mensaje | resuelto (2026-08-04)

`recordGroupActivity` y `recordUserActivity` corrían en paralelo; el upsert de `group_members` podía llegar antes de que existiera el `players` → violación de FK (PGRST PGRST204/23503) en usuarios nuevos. Fix: en `eventHandler.js`, `recordGroupActivity` se encadena tras `recordUserActivity` (promise chain), garantizando el jugador antes del miembro. Reigresión cubierta en `tests/event_handler_activity.test.js`.

## TD-014 | `itemStatService.js:60` error TS7053 pre-existente | abierto

`npm run typecheck` reporta `error TS7053` en `itemStatService.js:60` (indexing de `MATERIALS` con `string` sin firma de índice). Pre-existente a la Fase A del canal mágico (verificado con `git stash`); NO fue introducido por esta iteración. Pendiente: tipar `MATERIALS`/`getMaterialStats` con índice `Record<string, ...>` o `@ts-nocheck` dirigido.
