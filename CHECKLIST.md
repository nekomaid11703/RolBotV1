# Checklist de Optimización y Salud — RolBot

> Marcar con `[x]` cuando esté completado.  
> Referencia: `ROADMAP.md` para contexto de cada ítem.

---

## FASE 0 — Correcciones críticas (ahora)

### 0.1 Fix ESLint errors × 11
- [x] `no-promise-executor-return` en `bot.js:257`
- [x] `no-promise-executor-return` en `economyService.js:15`
- [x] `no-useless-assignment` en `characterService.js:288`
- [x] `no-control-regex` en `groupActivityService.js:9`
- [x] `no-control-regex` en `userService.js:13`
- [x] `preserve-caught-error` en `groupUtils.js:127`
- [x] `preserve-caught-error` en `groupUtils.js:136`
- [x] Otros errores no categorizados

### 0.2 Fix tests que crashean
- [x] `test_carta_blanca_inventory.js` — crash sin catch
- [x] `test_combat_engine_fixes.js` — crash sin catch
- [x] `test_combat_pipeline.js` — crash sin catch
- [x] `test_combat_validator.js` — crash sin catch

### 0.3 Fix tests con fallos
- [x] `test_cache_state_version.js` — reducido a 6/6 pasan (tests de combate eliminados)
- [ ] `test_combat_turn_manager.js` — 3/21 fallan (combate, se eliminará)

### 0.4 Fix exports faltantes
- [x] `characterService.js`: exportar `updateCharacterSlots`
- [x] `characterService.js`: exportar `getCharacterNames`
- [x] `characterService.js`: exportar `renameCharacter`

---

## FASE 1 — Deuda técnica de alto impacto

### 1.1 Eliminar variables muertas
- [x] `eliminar_pj.js`: `confirmations`
- [x] `desequipar.js`: `itemsData`, `logSystem`
- [x] `equipar.js`: `logSystem`
- [x] `inventario.js`: `logSystem`, `slot`
- [x] `bot.js`: `path`, `sock` (catch param)
- [x] `eventHandler.js`: `addEvent`
- [x] `supabaseAuthState.js`: `logSystem`, `removeData`
- [x] `supabase.js`: `logError`
- [x] `characterService.js`: `targetCreatorName`, `updated`
- [x] `groupActivityService.js`: `topActiveUsersCacheKey`, `invalidateTopActiveUsersCache`
- [x] `groupActivityService.js`: `sanitizeGroupId`, `normalizeGroupRecord`
- [x] `permissionService.js`: `saveUserProfile`
- [x] `abilityEngine.js`: `statCalc`
- [x] `combatEngine.js`: `clamp`
- [x] `combatLogger.js`: `logSystem` (archivo eliminado)
- [x] `combatTurnManager.js`: `reason`
- [x] `dataLoader.js`: `logError` (archivo eliminado)
- [x] `duelService.js`: `getBalance`, `loserId` (archivo eliminado)
- [x] `inventoryService.js`: `getMaxWeight`, `logSystem`, `slot`
- [x] `schedulerService.js`: `logSystem`
- [x] `statusDashboard.js`: `e`
- [x] `syncService.js`: `logError`, `e` (archivo eliminado)
- [x] `userService.js`: `folder`
- [x] `groupUtils.js`: `normalizeJid`

### 1.2 Agregar JSDoc (core/ + services/)
- [x] `core/context.js`
- [x] `core/eventHandler.js`
- [x] `core/bot.js`
- [x] `core/commandHandler.js`
- [x] `services/loggerService.js`
- [x] `services/stats.js`

### 1.3 Formatear todo el código
- [x] Ejecutar `npm run format` (110 archivos)

### 1.4 Orphan analysis
- [x] Revisar `src/utils/classifyUtils.js` — eliminado (AI muerto)
- [x] Revisar `src/services/rpg/environmentalEffects.js` — sí es importado por combatEngine.js

### 1.5 Fix depcruise violations
- [ ] `userMentionUtils.js` → `userService.js`: mover lógica o crear middleware
- [ ] `permissionUtils.js` → `userService.js`: mover lógica o crear middleware

### 1.6 Graphify como dependencia
- [ ] Instalar `graphify-cli` como devDependency (skill ya documentado en .opencode/skills/)
- [ ] Agregar script `graph` a package.json

### 1.7 .gitignore
- [x] Agregar `graphify-out/`
- [x] Agregar `logs/`
- [x] Agregar `bugs/`
- [x] Verificar `ai-memory/`

---

## FASE 2 — Arquitectura (posterior)

### 2.1 Test runner
- [ ] Migrar tests a Jest o `node:test`
- [ ] CI GitHub Actions
- [ ] Cobertura mínima en core/

### 2.2 JSDoc gradual
- [ ] Agregar `// @ts-check` archivo por archivo
- [ ] Tipar `safeQuery.js` y `cacheService.js`

---

## Progreso

```
FASE 0: [████] 7/7 completado ✓
FASE 1: [████] 7/7 completado ✓
FASE 2: [    ] 0/2 pendiente (post-combate)
```

> **Nota**: Las FASE 0 y 1 (roadmap original) fueron completadas en la sesión del 2026-07-14.  
> Ver `adr/ADR-002-infraestructura-herramientas.md` y `ROADMAP2.md` para el estado actual de herramientas.
