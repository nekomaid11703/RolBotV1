# Roadmap de Optimización y Salud — RolBot

> **Base**: 95 JS files, 11,600 LOC, 15 test files  
> **Herramientas**: ESLint 10, TypeScript 7 (checkJs), Prettier 3, dependency-cruiser 18  
> **Deuda actual**: 11 ESLint errors · 35 warnings · 223 TS errors · 4 depcruise violations · 110 archivos sin formateo

---

## Criterios de ponderación

| Factor | Peso |
|---|---|
| **Impacto** (1-10): cuánto mejora la estabilidad/seguridad/mantenibilidad | ×3 |
| **Urgencia** (1-10): qué tan pronto explota si no se atiende | ×2 |
| **Esfuerzo** (1-10 inverso): 1 = trivial, 10 = semanas | ÷2 |

**Score final** = (Impacto × 3) + (Urgencia × 2) − (Esfuerzo × 0.5)

---

## FASE 0 — Correcciones críticas (ahora)

Ítems que causan crashes en runtime o pérdida de datos.

| # | Ítem | Impacto | Urgencia | Esfuerzo | Score | Detalle |
|---|------|---------|----------|----------|-------|---------|
| 0.1 | **Fix ESLint errors × 11** | 10 | 10 | 3 | **48.5** | `no-promise-executor-return`, `no-useless-assignment`, `no-control-regex`, `preserve-caught-error` — bugs activos |
| 0.2 | **Fix tests que crashean** (×4) | 9 | 9 | 4 | **43** | `test_carta_blanca_inventory`, `test_combat_engine_fixes`, `test_combat_pipeline`, `test_combat_validator` lanzan excepción sin catch |
| 0.3 | **Fix tests con fallos** (×2) | 8 | 8 | 3 | **38.5** | `test_cache_state_version` (5/12 fail), `test_combat_turn_manager` (3/21 fail) |
| 0.4 | **Exports faltantes en characterService** | 9 | 9 | 5 | **43.5** | TypeScript detecta: `updateCharacterSlots`, `getCharacterNames`, `renameCharacter` no existen pero se importan |

---

## FASE 1 — Deuda técnica de alto impacto (1-2 semanas)

Ítems que no crashean pero erosionan la confianza en el código.

| # | Ítem | Impacto | Urgencia | Esfuerzo | Score | Detalle |
|---|------|---------|----------|----------|-------|---------|
| 1.1 | **Eliminar variables muertas** (×35 warnings) | 7 | 6 | 2 | **32** | `logSystem`, `logError`, `addEvent`, `statCalc`, `clamp`, `saveUserProfile` importados pero nunca usados |
| 1.2 | **Agregar JSDoc en core/ y services/** | 8 | 5 | 6 | **31** | Tipar `combatEngine.js` (el más grande, 534 líneas), `userService.js` (616), `economyService.js` — atajaría 150+ TS errors |
| 1.3 | **Formatear todo el código** (110 archivos) | 5 | 3 | 1 | **20.5** | `npm run format` — sin cambios semánticos, elimina ruido en diffs |
| 1.4 | **Orphan analysis**: `classifyUtils.js`, `environmentalEffects.js` | 6 | 4 | 1 | **25.5** | Archivos no importados por nadie — ¿código muerto o bug? |
| 1.5 | **Fix violaciones depcruise**: utils → services | 7 | 5 | 3 | **28.5** | `userMentionUtils` y `permissionUtils` importan `userService` — violación de capas |
| 1.6 | **Instalar graphify como dependencia npm** | 5 | 4 | 1 | **22.5** | Reemplazar dependencia global por local; habilitar hook post-commit |
| 1.7 | **Agregar .gitignore entries** | 4 | 3 | 1 | **17.5** | `graphify-out/`, `logs/`, `bugs/`, `.env.local` (si no está) |

---

## FASE 2 — Arquitectura y testing (2-4 semanas)

Ítems que mejoran la mantenibilidad a mediano plazo.

| # | Ítem | Impacto | Urgencia | Esfuerzo | Score | Detalle |
|---|------|---------|----------|----------|-------|---------|
| 2.1 | **Unificar test runner** (Jest o Node test) | 7 | 4 | 3 | **27.5** | Tests actuales son scripts sueltos con aserciones inline; migrar a Jest o `node:test` |
| 2.2 | **JSDoc gradual con `@ts-check`** | 8 | 3 | 5 | **27.5** | Agregar `// @ts-check` archivo por archivo empezando por `core/` |
| 2.3 | **Refactor combatEngine.js** | 7 | 3 | 6 | **24** | 534 líneas, 20 funciones, acoplamiento alto — dividir en sub-módulos |
| 2.4 | **CI pipeline (GitHub Actions)** | 8 | 2 | 4 | **26** | Correr `npm run check` + `npm test` en cada PR |
| 2.5 | **Centralizar config en environment** | 6 | 3 | 3 | **23** | `MAX_WARNS`, `GROUP_TOP_LIMIT`, límites de economía están hardcodeados |
| 2.6 | **Gestión de errores consistente** | 7 | 3 | 5 | **24.5** | Unificar formato de errores, reemplazar `throw Error` por errores tipados |
| 2.7 | **Auditar dependencias de npm** | 4 | 5 | 2 | **21** | `npm audit` muestra 2 vulnerabilidades; revisar si hay deps no usadas |

---

## FASE 3 — Resiliencia y monitoreo (1-2 meses)

Ítems que transforman el proyecto de "bot que funciona" a "sistema que se opera".

| # | Ítem | Impacto | Urgencia | Esfuerzo | Score | Detalle |
|---|------|---------|----------|----------|-------|---------|
| 3.1 | **Reconexión automática con backoff** | 9 | 6 | 4 | **37** | `bot.js` tiene watchdog básico; falta exponential backoff, jitter, métricas |
| 3.2 | **Métricas de salud (dashboard)** | 7 | 3 | 4 | **25** | `statusDashboard.js` existe pero muestra solo stats básicos; agregar uptime, memoria, tasa de error |
| 3.3 | **Rate limiting por comando/usuario** | 8 | 5 | 5 | **31.5** | Sin rate limiting actual; un usuario puede spamear comandos ilimitadamente |
| 3.4 | **Logs estructurados (formato JSON)** | 6 | 2 | 3 | **20.5** | `loggerService.js` escribe archivos planos; migrar a JSON rotate para ingesta |
| 3.5 | **Test de integración con Supabase** | 7 | 2 | 6 | **22** | Tests actuales que crashean lo hacen por falta de mock de DB; agregar mock layer |
| 3.6 | **Documentación de arquitectura** | 5 | 2 | 4 | **17** | `graphify-out/` tiene el grafo; falta documento de decisiones (ADRs) |
| 3.7 | **Segmentación de errores por gravedad** | 5 | 2 | 3 | **17.5** | Unificar `logError`/`logSystem`/`logWarn` en un solo logger con niveles |

---

## Scoreboard resumen

```
FASE 0 — Crítico     ████████████████████████░  48.5 · 43.0 · 38.5 · 43.5
FASE 1 — Deuda alta  ████████████████████░░░░░  32.0 · 31.0 · 20.5 · 25.5 · 28.5 · 22.5 · 17.5
FASE 2 — Arquitectura████████████████░░░░░░░░░  27.5 · 27.5 · 24.0 · 26.0 · 23.0 · 24.5 · 21.0
FASE 3 — Resiliencia ███████████████░░░░░░░░░░  37.0 · 25.0 · 31.5 · 20.5 · 22.0 · 17.0 · 17.5
```

---

## Recomendaciones inmediatas (próximos 3 días)

1. `npm run format` — 1 minuto, elimina 110 warnings de formato
2. Fix los **11 ESLint errors** (la mayoría son 1-liner)
3. Revisar `classifyUtils.js` y `environmentalEffects.js` — o se importan o se eliminan
4. Arreglar los **4 tests que crashean** (probablemente imports mal escritos)
5. Agregar JSDoc a `combatEngine.js` — es el archivo con más TS errors y el más crítico del RPG

```bash
# Pipeline de salud diario recomendado
npm run check    # lint + typecheck + depcruise  (~30s)
npm test         # tests del core                 (~2s)
```
