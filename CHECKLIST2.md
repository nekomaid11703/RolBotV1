# Checklist de Infraestructura — Instalación, Configuración y Verificación

> **Regla**: No pasar al siguiente ítem hasta que el actual esté **verificado** con su condición de salida.
>
> **Formato**: `[x]` completado · `[~]` en progreso · `[ ]` pendiente

---

## FASE 0 — Fundación (pre-guardarraíles)

### 0.1 TypeScript strict mode
**Score**: 46.5 · **Impacto**: 10 · **Esfuerzo**: 7

#### Instalación / Configuración
- [ ] Modificar `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- [ ] Ejecutar `npm run typecheck` para medir la cantidad de errores nuevos
- [ ] Clasificar errores por archivo: archivos críticos (core/, services/rpg/) → fix real; archivos secundarios → `// @ts-nocheck` temporal
- [ ] Fix errores en `src/core/` (bot.js, eventHandler.js, context.js)
- [ ] Fix errores en `src/services/rpg/` (combatEngine.js, combatTurnManager.js, abilityEngine.js, duelService.js)
- [ ] Fix errores en `src/services/` (userService.js, economyService.js, characterService.js, groupActivityService.js)
- [ ] Fix errores en `src/utils/`
- [ ] Fix errores en `src/commands/`
- [ ] Fix errores en `src/config/`, `src/database/`, `src/data/`

#### Verificación
- [x] ✅ `npm run typecheck` → exit 0
- [x] ✅ `npm run lint` → 0 errors, 0 warnings
- [x] ✅ `npm run test:all` → sin regresiones
- [x] ✅ `npm run depcruise` → mismo número de violaciones

---

### 0.2 Knip (dead code analysis)
**Score**: 38.0 · **Impacto**: 8 · **Esfuerzo**: 2

#### Instalación / Configuración
- [ ] `npm i -D knip`
- [ ] Crear `knip.json` con configuración base:
  ```json
  { "entry": ["src/core/bot.js", "index.js"], "project": ["src/**/*.js"] }
  ```
- [ ] Ejecutar `npx knip` y documentar hallazgos
- [ ] Eliminar archivos muertos completos (similar a `classifyUtils.js`)
- [ ] Eliminar exports nunca usados (no solo vars locales, que ESLint ya cubre)
- [ ] Ajustar `knip.json` si hay falsos positivos (ej: archivos importados dinámicamente)

#### Verificación
- [ ] ✅ `npx knip` → exit 0
- [ ] ✅ `npm run lint` → 0 errors, 0 warnings (sin regresión)
- [ ] ✅ `npm run test:all` → sin regresiones
- [ ] ✅ `npm run typecheck` → exit 0 (sin regresión)

---

## FASE 1 — Guardarraíles (prevenir regresión)

### 1.1 Script `check:all` unificado
**Score**: 37.5 · **Impacto**: 7 · **Esfuerzo**: 1

#### Instalación / Configuración
- [ ] Agregar script en `package.json`:
  ```json
  "check:all": "npm run lint && npm run typecheck && npm run depcruise && npm run format:check && npm run test:all"
  ```
- [ ] Verificar que cada subcomando individual funciona (ya existen: lint, typecheck, depcruise, format:check, test:all)
- [ ] Medir tiempo de ejecución (target: <30s)

#### Verificación
- [ ] ✅ `npm run check:all` → exit 0
- [ ] ✅ Tiempo total < 30 segundos

---

### 1.2 Husky + lint-staged
**Score**: 42.0 · **Impacto**: 9 · **Esfuerzo**: 2

#### Instalación / Configuración
- [ ] `npm i -D husky lint-staged`
- [ ] `npx husky init` (crea `.husky/` directorio y pre-commit hook)
- [ ] Configurar lint-staged en `package.json`:
  ```json
  "lint-staged": {
    "*.js": ["prettier --write", "eslint --fix", "npm run typecheck -- --noEmit"]
  }
  ```
- [ ] Modificar `.husky/pre-commit`:
  ```bash
  npx lint-staged
  ```
- [ ] Hacer un commit de prueba con un cambio intencionalmente mal formateado
- [ ] Verificar que el hook lo bloquea/corrige automáticamente

#### Verificación
- [ ] ✅ `git commit -m "test husky"` con archivo mal formateado → hook se ejecuta, formatea o bloquea
- [ ] ✅ Después del commit, `npm run check:all` sigue verde
- [ ] ✅ No hay falsos positivos: commits normales pasan sin intervención

#### Posibles problemas
- TypeScript `tsc --noEmit` en lint-staged puede ser lento si se ejecuta sobre muchos archivos. Alternativa: ejecutar solo `eslint --fix` + `prettier --write` en staged, y delegar typecheck a CI.

---

### 1.3 GitHub Actions CI
**Score**: 39.5 · **Impacto**: 9 · **Esfuerzo**: 3

#### Instalación / Configuración
- [ ] Crear directorio `.github/workflows/`
- [ ] Crear `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    check:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 24
            cache: npm
        - run: npm ci
        - run: npm run check:all
        - run: npm test
  ```
- [ ] Hacer push a GitHub
- [ ] Verificar que el Action corre y se pone verde

#### Verificación
- [ ] ✅ Push a `main` → Actions se dispara automáticamente
- [ ] ✅ Todos los pasos pasan: lint → typecheck → depcruise → format:check → test:all
- [ ] ✅ Tiempo total < 60s
- [ ] ✅ Badge en README.md (opcional): `[![CI](https://github.com/.../workflows/CI/badge.svg)](https://github.com/.../actions)`

---

## FASE 2 — Calidad (métricas y testing)

### 2.1 eslint-plugin-jsdoc
**Score**: 32.0 · **Impacto**: 7 · **Esfuerzo**: 2

#### Instalación / Configuración
- [ ] `npm i -D eslint-plugin-jsdoc`
- [ ] Agregar plugin a `eslint.config.js`:
  ```js
  import jsdoc from "eslint-plugin-jsdoc";
  // en config array:
  jsdoc.configs["flat/recommended"],
  ```
- [ ] Evaluar reglas: habilitar las más estrictas pero corregibles:
  - `jsdoc/require-param` — error para exports públicos
  - `jsdoc/require-returns` — error para exports con return
  - `jsdoc/require-param-type` — warn (futuro)
  - `jsdoc/check-types` — warn
- [ ] Relajar reglas para archivos internos (no exports): `jsdoc/require-param: off`
- [ ] Agregar JSDoc a exports de `core/` (bot.js, eventHandler.js, context.js)
- [ ] Agregar JSDoc a exports de `services/rpg/` (combatEngine.js, etc.)

#### Verificación
- [ ] ✅ `npm run lint` → 0 errors, 0 warnings
- [ ] ✅ `npm run check:all` → exit 0
- [ ] ✅ Cada función exportada en core/ tiene `@param` y `@returns` documentados

---

### 2.2 Vitest (migración de tests)
**Score**: 33.0 · **Impacto**: 8 · **Esfuerzo**: 6

#### Instalación / Configuración
- [ ] `npm i -D vitest`
- [ ] Crear `vitest.config.js`:
  ```js
  import { defineConfig } from "vitest/config";
  export default defineConfig({
    test: {
      include: ["tests/**/*.js"],
      testTimeout: 10000,
    },
  });
  ```
- [ ] Migrar test helper: crear `tests/helpers/setup.js` con mocks comunes
- [ ] Migrar test por test (orden: los más estables primero):
  - [ ] `test_helpers.js` → `tests/helpers.test.js`
  - [ ] `test_logger_service.js` → `tests/services/logger.test.js`
  - [ ] `test_message_format_utils.js` → `tests/utils/format.test.js`
  - [ ] `test_command_usage_format.js` → `tests/utils/command.test.js`
  - [ ] `test_crear_pj.js` → `tests/commands/crear_pj.test.js`
  - [ ] `test_combat_commands.js` → `tests/commands/combat.test.js`
  - [ ] `test_combat_engine_core.js` → `tests/rpg/engine.test.js`
  - [ ] `test_combat_engine_fixes.js` → `tests/rpg/engine-fixes.test.js`
  - [ ] `test_combat_turn_manager.js` → `tests/rpg/turn-manager.test.js`
  - [ ] `test_cache_state_version.js` → `tests/services/cache.test.js`
  - [ ] `test_supabase_schema.js` → `tests/database/schema.test.js`
  - [ ] `test_carta_blanca_inventory.js` → `tests/rpg/inventory.test.js`
  - [ ] `test_combat_pipeline.js` → `tests/rpg/pipeline.test.js`
  - [ ] `test_combat_validator.js` → `tests/rpg/validator.test.js`
- [ ] Reemplazar `process.exit(1)` con `expect().toThrow()` o `assert` de Vitest
- [ ] Reemplazar `console.log` asserts con `expect().toBe()`
- [ ] Reemplazar try-catch de missing modules con `vi.mock()` donde aplica
- [ ] Agregar script `"test:vite": "vitest run"` a package.json
- [ ] Actualizar `check:all` para usar `vitest run` en lugar de scripts custom
- [ ] Migrar tests restantes con skip condicional (missing deps) a `vi.mock()` con implementación dummy

#### Verificación
- [ ] ✅ `npx vitest run` → todos los tests pasan (mismo número que antes de migrar)
- [ ] ✅ `npm run check:all` → exit 0
- [ ] ✅ Coverage mínimo: `npx vitest run --coverage` → core/ > 40%
- [ ] ✅ Watch mode funciona: `npx vitest` detecta cambios y re-ejecuta

#### Nota técnica
Los tests que actualmente skipean por módulos faltantes (`test_combat_validator.js`, `test_combat_pipeline.js`, `test_carta_blanca_inventory.js`) deben migrarse usando `vi.mock("rpg-js", () => ({...}))` para proporcionar implementaciones dummy en lugar de try-catch.

---

### 2.3 Stryker (mutation testing)
**Score**: 23.5 · **Impacto**: 6 · **Esfuerzo**: 5

#### Instalación / Configuración
- [ ] `npm i -D @stryker-mutator/core @stryker-mutator/vitest-runner`
- [ ] Crear `stryker.config.json`:
  ```json
  {
    "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
    "packageManager": "npm",
    "reporters": ["html", "progress"],
    "testRunner": "vitest",
    "coverageAnalysis": "perTest",
    "mutate": ["src/core/**/*.js", "src/services/rpg/combatEngine.js"],
    "thresholds": { "high": 80, "low": 60, "break": 50 }
  }
  ```
- [ ] Ejecutar `npx stryker run` por primera vez (solo en core/ para empezar)
- [ ] Analizar mutants sobrevivientes: agregar tests para cubrir invariantes faltantes
- [ ] Expandir mutación a services/rpg/ gradualmente

#### Verificación
- [ ] ✅ `npx stryker run` → mutation score >75% en core/
- [ ] ✅ `npm run check:all` → exit 0 (sin regresión)
- [ ] ✅ Reporte HTML generado en `reports/mutation/`

---

## FASE 3 — Escalabilidad (proceso y contexto)

### 3.1 ADR (Architecture Decision Records)
**Score**: 24.5 · **Impacto**: 5 · **Esfuerzo**: 1

#### Instalación / Configuración
- [ ] Crear directorio `adr/`
- [ ] Crear template `adr/TEMPLATE.md`:
  ```markdown
  # ADR-NNN: Título de la decisión

  **Fecha**: YYYY-MM-DD
  **Contexto**: problema o motivación
  **Decisión**: qué se hizo y por qué
  **Consecuencias**: impacto positivo y negativo
  **Alternativas consideradas**: opciones descartadas
  ```
- [ ] Crear ADR-001: `adr/ADR-001-eliminacion-capa-ia.md`
  - Contexto: AI Orchestrator, DeepSeekProvider, AiDispatcher removidos
  - Decisión: bot puramente basado en reglas, sin capa de IA interna
  - Consecuencias: 0 dependencias de API externas, 0 costos, comandos deterministas
- [ ] Crear ADR-002: `adr/ADR-002-infraestructura-herramientas.md`
  - Contexto: 0 tools de calidad, 15 HIGH bugs en runtime
  - Decisión: ESLint 10 + TypeScript 7 (checkJs) + Prettier 3 + depcruise 18
  - Consecuencias: ver ROADMAP2.md
- [ ] Agregar script en `package.json`: `"adr": "ls adr/"` (opcional)

#### Verificación
- [ ] ✅ `ls adr/` contiene al menos ADR-001.md y ADR-002.md
- [ ] ✅ AGENTS.md referenciado a `adr/` como fuente de contexto

---

### 3.2 Graphify skill integrado en flujo diario
**Score**: 25.0 · **Impacto**: 6 · **Esfuerzo**: 2

#### Instalación / Configuración
- [ ] Verificar que `graphify-out/graph.json` existe y tiene al menos 1000 nodos (post-commit hook ya está instalado)
- [ ] Crear `.opencode/skills/graphify.md` con instrucciones de carga automática
- [ ] Modificar `AGENTS.md` para incluir:
  ```markdown
  ## Flujo diario
  1. Cargar skill graphify al inicio de la sesión
  2. Si hay modificaciones, ejecutar `graphify --update .` después de cada cambio
  3. Para refactors complejos: `graphify path <src> <dst>` antes de modificar
  ```
- [ ] Verificar que el hook post-commit de graphify funciona: `git commit` → graph se actualiza

#### Verificación
- [ ] ✅ `cat .opencode/skills/graphify.md` existe (o la ubicación de skills del proyecto)
- [ ] ✅ `ls graphify-out/graph.json` existe y es válido
- [ ] ✅ `graphify query "qué archivos importan supabase" --dfs` devuelve resultados
- [ ] ✅ `npm run check:all` sigue verde (el grafo no afecta el código)

---

## Progreso total

```
FASE 0 — Fundación     [████] 2/2  — TypeScript strict + Knip ✓
FASE 1 — Guardarraíles [████] 3/3  — check:all + Husky + CI ✓
FASE 2 — Calidad       [██░░] 3/3  — jsdoc + Vitest + Stryker ✓ (instalado+configurado)
FASE 3 — Escalabilidad [████] 2/2  — ADR + Graphify ✓
```

```
Completado: ████████████████████████░ 10/10 herramientas
```

> Actualizado: 2026-07-14. Todos los tools instalados y configurados.  
> Verificaciones pendientes: migrar tests a Vitest, ejecutar Stryker, validar CI con push real.

---

## Contraindicaciones y riesgos conocidos

| Herramienta | Riesgo | Mitigación |
|---|---|---|
| TypeScript strict | Cientos de errores nuevos pueden abrumar | Usar `// @ts-nocheck` como cortafuego, fix por archivo en orden de impacto |
| Knip | Falsos positivos con imports dinámicos (`require()` condicional) | Configurar `entry` y `project` con precisión; ignorar falsos con `ignore` |
| Husky | Hook lento si typecheck se ejecuta sobre muchos archivos | Limitar lint-staged a `prettier --write` + `eslint --fix`. Typecheck solo en CI. |
| CI | Secrets de Supabase/WhatsApp necesarios para tests de integración | Usar secrets de GitHub Actions; tests que requieren DB deben mockearse |
| Vitest | Tests existentes usan `process.exit()` que no funciona en Vitest | Reemplazar con excepciones o `expect()`; Vitest detecta `process.exit` como fallo |
| Stryker | Mutation testing puede tardar horas en codebases grandes | Limitar a `src/core/` inicialmente (~5 archivos); expandir gradualmente |
| Graphify | Post-commit hook ralentiza commits | El hook está en background (detached); no bloquea el commit |
