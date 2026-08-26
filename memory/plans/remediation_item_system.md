# Plan de Remediación — Sistema de Ítems & Infraestructura

> **Estado**: Aprobado / Pendiente de ejecución
> **Fecha**: 2026-08-03
> **Auditoría base**: Sistema de ítems (código vs Supabase en vivo)

---

## Contexto (decisiones cerradas)

| Decisión | Elección |
|---|---|
| Aplicación de DDL | **Script SQL manual** en Supabase (1 vez, idempotente, sin RPC) |
| Almacén de equipamiento | **Columna `equipped_slots`** (migración 002, coincide con el código) |
| Alcance | **Incluir** `combat_sessions` + limpieza de ítems temp huérfanos |

## Hallazgos que motivan el plan

- **CRÍTICO 1**: `equipmentService` lee/actualiza `characters.equipped_slots`, columna **inexistente** en Supabase → `/equipar` y `/desequipar` fallan en runtime. Tests pasan porque mockean la columna.
- **CRÍTICO 2**: Migración `002_add_item_metadata_and_equipment.sql` **nunca aplicada** (sin `metadata` ni `equipped_slots`). `schemaMigration.createMissingTables()` falla en silencio porque el RPC `exec_sql` no existe.
- **tabla `combat_sessions` no existe** → `saveSession`/`restoreSessions` fallan (persistencia de combate rota).
- **ALTO 3**: Doble fuente de versión (`schemaVersion=2.0.0` vs `schemaMigration=2.1.0`); `characters.id` es **UUID** pero el código dice `bigint`; `KNOWN_SCHEMA` fuera de sync (faltaba `category`).
- **Items temporales huérfanos**: `venda_temp/pocion_temp/tonico_temp` (9 filas) persisten en `inventory`.

---

## Fase 0 — Aplicar DDL en Supabase (manual · 1 vez · prerrequisito)

**Archivo**: `src/database/migrations/003_remediation_item_equipment.sql` (idempotente)

- [ ] `ALTER TABLE inventory ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}';`
- [ ] `ALTER TABLE characters ADD COLUMN IF NOT EXISTS equipped_slots JSONB NOT NULL DEFAULT '{}';`
- [ ] Índice `idx_characters_equipped_slots` (GIN) si no existe
- [ ] `CREATE TABLE IF NOT EXISTS combat_sessions (...)` (misma DDL de `TABLE_CREATE_SQL`)
- [ ] `NOTIFY pgrst, 'reload schema';`
- [ ] Verificar en Supabase: columnas `metadata`/`equipped_slots` + tabla `combat_sessions`

## FASE 1 — Unificar versión de schema (destino)

- [ ] Crear `src/database/schemaConstants.js` (`CURRENT_VERSION = "2.2.0"`, única fuente)
- [ ] `schemaVersion.js`: importar de schemaConstants, eliminar `2.0.0` local
- [ ] `schemaMigration.js`: importar de schemaConstants, eliminar `2.1.0` local

## Fase 2 — Alinear esquema conocido (3 archivos)

- [ ] `columnRegistry.KNOWN_SCHEMA`: añadir `category` a `characters` (mantener `equipped_slots`/`metadata`)
- [ ] `schemaValidator.SCHEMA` + `CRITICAL_EQUALS_COLUMNS`: añadir `metadata`(inventory), `equipped_slots`(characters)
- [ ] `schemaMigration.DESIRED_SCHEMA` + `COLUMN_TYPES`: tipos **UUID** (`characters.id`, `inventory.character_id`); añadir `characters.equipped_slots` y `inventory.metadata`

## FASE 3 — Blindaje de equipamiento (`equipmentService.js`)

- [ ] `getEquippedSlots`/`saveEquippedSlots`: guard si la columna/DB no responde → error claro ("ejecutar migración 003") en vez de `{}` silencioso
- [ ] `tests/equipment_service.test.js`: quitar mock que oculta la ausencia de columna; caso de error claro

## FASE 4 — Limpieza de datos huérfanos

- [ ] Borrar `venda_temp`, `pocion_temp`, `tonico_temp` del inventario (9 filas)
- [ ] (opcional) `scripts/cleanup-temp-items.js` con flag `--dry`

## FASE 5 — Conectar metadata/durabilidad (OPCIONAL · post-remediación)

- [ ] `addItem/useItem` → persistir desgaste/durabilidad en `inventory.metadata`
- [ ] Conectar `DurabilityModule` a storage; `item_add` aceptar tier/material
- [ ] Dejar `metadata` listo como storage; no implementar mecánicas de daño ahora

## FASE 6 — Verificación final

- [ ] `npm run check` (lint + typecheck + depcruise)
- [ ] `npm test`
- [ ] Smoke vs Supabase: `/equipar`, `/desequipar`, `equipped_slots` persistido; `metadata` en inventario; `_schema_version=2.2.0`; `combat_sessions` accesible
- [ ] `npm run graphify:update`

---

## Orden de ejecución
FASE 0 (DDL manual) → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 6.
> FASE 0 es prerrequisito para equipación; FASE 1–2 son independientes del DDL.

## Archivos afectados
- `src/database/migrations/003_remediation_item_equipment.sql` *(nuevo)*
- `src/database/schemaConstants.js` *(nuevo)*
- `src/database/schemaVersion.js`
- `src/database/schemaMigration.js`
- `src/database/columnRegistry.js`
- `src/database/schemaValidator.js`
- `src/services/rpg/equipmentService.js`
- `tests/equipment_service.test.js`
- `scripts/cleanup-temp-items.js` *(opcional)*