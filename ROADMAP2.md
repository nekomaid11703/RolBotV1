# Roadmap de Infraestructura — Herramientas, Skills y Flujo

> **Objetivo**: Sistema de herramientas que detecte bugs automáticamente antes de que lleguen a producción, documente decisiones arquitectónicas, y garantice calidad medible en cada cambio.
>
> **Contexto**: 95 JS files · 11,600 LOC · 15 tests custom (sin framework) · 270 dependencias entre módulos · 4 violaciones depcruise · 0 CI · 0 pre-commit hooks · 0 cobertura · TypeScript con strict:false

---

## Criterios de ponderación

| Factor | Peso |
|--------|------|
| **Impacto** (1-10): cuánto reduce bugs futuros / mejora mantenibilidad | ×3 |
| **Urgencia** (1-10): qué tan pronto se necesita para no frenar otras tareas | ×2 |
| **Esfuerzo** (1-10 inverso): 1 = trivial, 10 = semanas | ÷2 |

**Score** = (Impacto × 3) + (Urgencia × 2) − (Esfuerzo × 0.5)

---

## FASE 0 — Fundación (pre-guardarraíles)

Herramientas que *encuentran* problemas existentes. Deben ejecutarse antes de instalar guardarraíles (husky/CI) para no bloquear commits con issues preexistentes.

| # | Herramienta | Impacto | Urgencia | Esfuerzo | Score | Por qué este orden |
|---|---|---|---|---|---|---|
| 0.1 | **TypeScript strict mode** | 10 | 10 | 7 | **46.5** | Atrapa null/undefined/typos — los 15 HIGH bugs que ya corregimos eran exactamente esto. Debe hacerse primero porque `strict: true` revelará cientos de errores que hay que limpiar antes de agregar pre-commit hooks. |
| 0.2 | **Knip (dead code analysis)** | 8 | 8 | 2 | **38** | Detecta archivos completos no importados (como `classifyUtils.js`) y exports nunca usados que ESLint no ve. Corre después de strict mode porque ambos modifican archivos; Knip tiene menos efectos secundarios. |

### Dependencias entre FASE 0
```
strict mode ──→ Knip
     ↕              ↕
(comparten archivos, se solapan limpiezas)
```
**Regla**: strict mode no requiere Knip, ni viceversa, pero es más eficiente hacer strict primero porque sus cambios pueden eliminar exports que Knip marcaría.

---

## FASE 1 — Guardarraíles (prevenir regresión)

Herramientas que *bloquean* código defectuoso antes de que entre al repo. Dependen de que FASE 0 haya limpiado el código base.

| # | Herramienta | Impacto | Urgencia | Esfuerzo | Score | Por qué este orden |
|---|---|---|---|---|---|---|
| 1.1 | **Script `check:all`** | 7 | 9 | 1 | **37.5** | Unifica lint + typecheck + depcruise + test:all + format:check en un comando. Prerrequisito lógico para CI y pre-commit. |
| 1.2 | **Husky + lint-staged** | 9 | 8 | 2 | **42** | Cada commit ejecuta lint + format + typecheck solo sobre archivos staged. Depende de que 0.1 y 0.2 estén resueltos (si no, el hook bloquearía todo). |
| 1.3 | **GitHub Actions CI** | 9 | 7 | 3 | **39.5** | Ejecuta `check:all` en cada push/PR. Depende de 1.1 (check:all script) para tener un solo comando que correr. |

### Dependencias entre FASE 1
```
check:all ──→ Husky ──→ CI
   ↑            ↑
(prerreq)   (prerreq: FASE 0)
```

---

## FASE 2 — Calidad (métricas y testing)

Herramientas que *miden y mejoran* la calidad del código existente y futuro.

| # | Herramienta | Impacto | Urgencia | Esfuerzo | Score | Por qué este orden |
|---|---|---|---|---|---|---|
| 2.1 | **eslint-plugin-jsdoc** | 7 | 6 | 2 | **32** | Exige JSDoc en exports públicos. Atrapa params faltantes, returns no documentados. No depende de nada externo. |
| 2.2 | **Vitest (migración tests)** | 8 | 6 | 6 | **33** | Reemplaza asserts inline con framework real: aserciones con diff, coverage, watch mode. Depende de que test:all funcione (1.1). |
| 2.3 | **Stryker (mutation testing)** | 6 | 4 | 5 | **23.5** | Mide si los tests realmente prueban las invariantes. Depende de Vitest (2.2). |

### Dependencias entre FASE 2
```
jsdoc ──→ Vitest ──→ Stryker
                    (needs Vitest config)
```

---

## FASE 3 — Escalabilidad (proceso y contexto)

Herramientas y procesos que permiten que el proyecto crezca sin perder contexto arquitectónico.

| # | Herramienta | Impacto | Urgencia | Esfuerzo | Score | Por qué este orden |
|---|---|---|---|---|---|---|
| 3.1 | **ADR (Architecture Decision Records)** | 5 | 5 | 1 | **24.5** | Documenta cada decisión arquitectónica para que agentes futuros no repregunten lo mismo. No tiene dependencias. |
| 3.2 | **Graphify skill integrado en flujo** | 6 | 4 | 2 | **25** | Cargar graphify al inicio de cada sesión para visualizar dependencias antes de refactors. Depende de que depcruise esté verde (1.1) para que el grafo refleje la arquitectura real. |

### Dependencias entre FASE 3
```
ADR ──→ Graphify workflow
(no dependencias)     (depende: depcruise verde)
```

---

## Scoreboard resumen

```
FASE 0 — Fundación     ████████████████████████░  46.5 · 38.0
FASE 1 — Guardarraíles ██████████████████████░░░  37.5 · 42.0 · 39.5
FASE 2 — Calidad       ██████████████████░░░░░░░  32.0 · 33.0 · 23.5
FASE 3 — Escalabilidad ███████████████░░░░░░░░░░  24.5 · 25.0
```

---

## Resumen de modificaciones necesarias por herramienta

| # | Herramienta | Archivos a crear/modificar |
|---|---|---|
| 0.1 | TypeScript strict | `tsconfig.json` (strict:true), luego ~50-80 archivos .js con `@ts-nocheck` temporal o fixes reales |
| 0.2 | Knip | `npm i -D knip`, crear `knip.json`, resolver dead exports |
| 1.1 | check:all | `package.json` (script), `eslint.config.js` (si falta algo) |
| 1.2 | Husky + lint-staged | `npm i -D husky lint-staged`, crear `.husky/pre-commit`, modificar `package.json` |
| 1.3 | GitHub Actions | Crear `.github/workflows/ci.yml` |
| 2.1 | eslint-plugin-jsdoc | `npm i -D eslint-plugin-jsdoc`, modificar `eslint.config.js` |
| 2.2 | Vitest | `npm i -D vitest`, crear `vitest.config.js`, refactorizar 15 tests |
| 2.3 | Stryker | `npm i -D @stryker-mutator/core`, crear `stryker.config.json` |
| 3.1 | ADR | Crear `adr/` dir, template, y ADR-001 |
| 3.2 | Graphify workflow | `AGENTS.md` (instrucciones), `.opencode/skills/graphify.md` (skill) |

---

## Reglas de verificación (gate)

Cada ítem tiene una **condición de salida** obligatoria antes de iniciar el siguiente:

```
0.1 → `npm run typecheck` exit 0
0.2 → `npx knip` exit 0
1.1 → `npm run check:all` exit 0, <30s
1.2 → `git commit -m "test"` ejecuta lint+format sin bloquear
1.3 → Push a GitHub → Actions verde
2.1 → `npm run lint` exit 0 (con reglas jsdoc activas)
2.2 → `npx vitest run` pasa todos los tests
2.3 → Mutation score >75%
3.1 → `ls adr/` contiene al menos ADR-001.md
3.2 → `ls graphify-out/graph.json` existe + documento skill existe
```
