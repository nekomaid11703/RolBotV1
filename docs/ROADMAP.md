# Roadmap del Proyecto — RolBotV1

> **Estado del Codebase**: ~7,480 LOC JS · 82 módulos fuente · 10 suites de prueba en Vitest (191/191 tests verdes) · Strict TypeScript · Graphify AST Graph · CI/CD activo

---

## Criterios de Ponderación

| Factor | Peso |
|--------|------|
| **Impacto** (1-10): Mejora la estabilidad, resiliencia y mantenibilidad | ×3 |
| **Urgencia** (1-10): Prioridad de atención en producción | ×2 |
| **Esfuerzo** (1-10 inverso): 1 = trivial, 10 = semanas | ÷2 |

---

## 🟢 FASE 0 — Correcciones Críticas y Fundación (COMPLETADO)

- [x] **Fix de Bugs Runtime**: Corrección de errores de ESLint, promesas sin manejo y regex.
- [x] **Infraestructura de Tipos**: TypeScript `strict: true` en `tsconfig.json` (0 errores).
- [x] **Análisis de Código Muerto**: Integración de Knip y eliminación de exports desfasados.
- [x] **Comandos Rotos de Personajes**: Implementación de `getCharacterNames`, `renameCharacter` y `updateCharacterSlots` en `characterService.js`.
- [x] **Purga de Capa de IA y Módulos Obsoletos**: Eliminación total del orquestador de IA, archivo de scripts de combate obsoletos y de tests del antiguo motor (`carta_blanca`, `inventory_test`).

---

## 🟢 FASE 1 — Guardarraíles y Herramientas de Calidad (COMPLETADO)

- [x] **Toolchain Unificado**: Script `npm run check:all` (`lint` + `typecheck` + `depcruise` + `format:check` + `test`).
- [x] **Git Hooks**: Husky + `lint-staged` para auto-formateo con Prettier y validación en commits.
- [x] **CI/CD Pipeline**: GitHub Actions (`.github/workflows/ci.yml`) ejecutando la suite de verificación completa.
- [x] **Framework de Tests**: Migración completa a Vitest v4 con 191 aserciones activas y 0 fallos.
- [x] **Documentación Arquitectónica**: Registro de decisiones de diseño (ADRs 001 y 002) y mapa estático de dependencias con Graphify (`.opencode/skills/graphify.md`).
- [x] **Formateo y Limpieza de Código**: 100% del código formateado con Prettier. Archivado de `characterProgressionService.js` y remoción de imports huérfanos.

---

## ✅ FASE 2 — Completar Versión 1.0: Inventario Consumible y Combate Melee (COMPLETADO)

Desarrollo completado. Juego básico 100% funcional con inventario de consumibles, PvP cuerpo a cuerpo por turnos, y comandos `/inventario`, `/usar`, `/retar`, `/atacar`, `/estado`, `/disolver_combate`.

### 2.1 — Módulo de Inventario Básico (Consumibles)
- **Base de Datos**: Tabla `inventory` en Supabase relacionada a `characters.id`.
- **Catálogo (`items.js`)**: Consumibles de recuperación con precios inflados para control de inflación (Vendas: 100 stelas, Poción: 180 stelas, Tónico: 280 stelas, Antídoto: 200 stelas).
- **Seguridad**: Bloqueo exclusivo `withCharacterLock` para prevenir race conditions al usar ítems.
- **Comandos**: `/inventario` y `/usar`.

### 2.2 — Motor de Combate Melee Determinista (D20-style)
- **Sesión en Memoria**: `combatState.js` transitorio con expiración automática (10 min reto, 48 horas turno).
- **Cálculo de Daño**: `STR_atacante - DEF_defensor` (daño mínimo = 1).
- **Sistema de Reacciones**: Bloquear (-25% daño) o Esquivar (0 daño si `SPD_MOV >= SPD_ATK`) si los reflejos del defensor (`REF`) lo permiten.
- **Umbrales Activos**: Penalizaciones de -20% y -50% a stats en combate según HP actual.
- **Comandos**: `/retar <@usuario>` (PvP por turnos), `/estado` y comando administrativo `/disolver_combate` para desbloqueos.

---

## 🔶 FASE 2.6 — Ciclo de Items y Balance (APROBADO 2026-09-09 — EN CURSO)

Roadmap del ciclo de ítems/materiales/balance posterior al canon B8.2a. Alcance aprobado:
balance + saneamiento de incoherencias de ítems, empezando por B8.2b. Los contadores de tests
se mantienen en `docs/AI_CHANGELOG.md` (check:all actual: 914 tests verdes en 81 archivos).

### Restricciones y modificaciones de items que condicionan cada paso
- Canon 24 materiales (6 rarezas × 4 ejes, presupuestos serie ×1.4); nunca inventar stats.
- Los ítems reales son `trozo_de_<id>` / `espada_de_<id>` (generados por `materialFamilies`);
  la analítica revierte `trozo_de_`→canon. Diseñar drops siempre contra `trozo_de_*`.
- Variantes (`006_inventory_variants`): materiales apilan por `variant_key=tier:E..N`;
  equipables = `instance:<uuid>`.
- Tiers de forja E→N heredados del material; refinado universal 2:1 sin techos.
- Herramientas: hoy `lootBonus` multiplica probabilidad (`activityEngineService.js:337-341`);
  B8.2b lo sustituye por la ley R(L). Recalcular payback B4 en el reporte.
- 5 zonas (`bosque/minas/montanas/costa/tundra`) sin campo de piso hoy.
- P1-P5 como criterio transversal (`DESIGN_TARGETS` + `progression:report`).

### Orden de ejecución
- [x] **P0 — Saneamiento de incoherencias de items** (pre-req) — IMPLEMENTADO 2026-09-09
  - [x] **Gate D1 resuelto: canon completo.** `ironFamily.js` eliminado (`git rm`); sus ítems se
        sustituyen por la familia canónica de acero ya generada por `materialFamilies`.
  - [x] `armorSets.js`: `set_hierro` → `set_acero` (name "Acero", bonus `def:10`).
  - [x] `kunai_*` ahora se genera para todos los materiales (`materialFamilies`), con
        `kunai_de_acero` válido para tienda y receta `kunai`.
  - [x] `equipmentResolverService.js`: flecha por defecto `flechas_de_acero` / material `acero`.
  - [x] Ejemplos/ayudas de UI (`forjar`, `refinar`, `item_add`, `item_info`) y flavor
        (`shopConfig`, `jobConfig`, `expeditionConfig`) actualizados al canon.
  - [x] `materialData.js`: `getMaterialStats` resuelve de forma estricta (lanza error si el
        material no es canon; ya no cae silenciosamente a `madera`). Se corrigió `eterio`→`etereo`
        en `arcaneFamily.js`.
  - [x] [NEW] `src/database/migrations/007_hierro_to_acero.sql`: remapea `inventory` +
        `equipped_slots` de los 7 ids legacy de hierro a acero. Pendiente solo de aplicarse en el
        despliegue.
  - [x] Guarda de integridad de referencias ([NEW] `tests/reference_integrity.test.js`): todo
        itemId de configs/`TOOL_UPGRADE_COSTS` existe y su material es canon; toda receta de
        forja produce ítem real para cada material del canon. `iron_family.test.js` retirado.
  - Verificación: **899 tests verdes en 81 archivos** (`check:all`).
- [ ] **P1 — B8.2b Ley de obtención R(L) + pisos por zona** (primero)
  - [ ] [NEW] `src/config/rarityDropConfig.js` (o en `progressionBalance.js`): tabla R(L) 16→1.39,
        `R(L)=16−14.61·(L−1)/9`, renormalización por piso.
  - [ ] [NEW] `src/services/rpg/rarityDropService.js`: `rollRarity({toolLevel, floorRarity})`
        geométrico con seed determinista.
  - [ ] [MODIFY] `expeditionConfig.js`: `floorRarity` por zona + rareza por entrada de `lootTable`;
        drops no-material fuera de la curva.
  - [ ] [MODIFY] `activityEngineService.js:331-353`: sustituir `(1+lootBonus)` por el sampler;
        duración solo escala cantidad/stelas/XP.
  - [ ] [MODIFY] `progressionAnalyticsService.js` + `analyze_progression.js`: replicar cálculo,
        métricas de distribución por zona y guardas "16:1 en L1" / "~1 mítico/16 en L10".
  - [ ] [MODIFY] Tests `expedition_system`, `tool_progression`, `progression_analytics`,
        `forge_economics`.
  - **Gate D2**: al quitar `lootBonus`, recalcular payback B4 (rebalancear costes o aceptar retorno).
- [ ] **P2 — B3 Rutas jugables de materiales raros y endgame**
  - [ ] `unreachableMaterials=[]` y `blockedRequirements=[]` (hoy 16 SIN RUTA; oro/titanio
        bloquean herramientas 9-10).
  - [ ] Pisos jugables entre las 5 zonas y, si hace falta, [NEW] zonas profundas para
        legendario/mítico — **Gate D3** (nombres y pisos).
  - [ ] `shopConfig.js`: acotar rareza máxima vendida (firma de expedición, P4) — **Gate D4**.
  - [ ] Cerrar desviación conocida de la Bolsa nivel 10 (B4) y regenerar `BALANCE_MATERIALES.md`.
- [ ] **P3 — B6 Hitos de equipo y poder por rango**
  - [ ] Poder relativo por build y cohorte en el reporte; ≥3 estilos viables por cohorte (P5).
  - [ ] Brechas de equipo sanas entre niveles y momentos de logro visibles (P2).
  - [ ] Configs de equipo/sets mapeadas al canon (tras P0) + tests de estilos viables.
- [ ] **P4 — Fase 2: segunda pasada de winrate de combate** (cierre)
  - [ ] Recalibrar con stats nuevos (dummy, armaduras, `EDGE_SCALE`) vía `scripts/simulate_combat`
        y `run_balance_sweep`; re-baseline a turnos objetivo (7.0 histórico).

### Verificación transversal (por paso)
- `npm run progression:report` con nuevas guardas (SIN RUTA=0 al cerrar B3; distribución R(L); payback).
- Test propio por paso + `npm run check:all`.
- Actualizar `docs/BALANCE_TROZOS.md`, `docs/AI_CHANGELOG.md`, `memory/decisions.md` (D1-D4) y
  regenerar grafo (`graphify:update`).

### Riesgos
- Quitar `lootBonus` cambia la economía de herramientas → D2 con el reporte como fuente de verdad.
- Renombrar items legacy (D1) puede afectar items en DB → variantes/alias o migración 007.
- Curvas muy empinadas en tool baja → mitigado con pisos y renormalización desde el primer drop.

---

## 🟠 FASE 3 — Calidad Avanzada y Arquitectura (PRÓXIMO)

Mejoras de mediano plazo para optimizar la mantenibilidad y cobertura estricta.

| # | Ítem | Impacto | Urgencia | Esfuerzo | Score | Detalle |
|---|------|---------|----------|----------|-------|---------|
| 3.1 | **Resolver Violaciones de Capas (depcruise)** | 7 | 5 | 3 | **28.5** | Desacoplar `src/utils/safeQuery.js` de `loggerService.js` e inyectar dependencias para cumplir `utils-not-to-services`. |
| 3.2 | **Remoción Gradual de `@ts-nocheck`** | 8 | 5 | 6 | **31.0** | Remover `// @ts-nocheck` archivo por archivo en `src/core/` y `src/services/` para aprovechar la validación estática de TypeScript. |
| 3.3 | **Mutation Testing con Stryker** | 6 | 4 | 5 | **23.5** | Ejecutar `npx stryker run` en `src/core/` para validar la calidad de las aserciones de prueba (cobertura de mutantes >75%). |
| 3.4 | **Completar JSDoc en Módulos Públicos** | 7 | 4 | 3 | **27.5** | Resolver gradualmente las advertencias de JSDoc en funciones exportadas de `src/utils/` y `src/services/`. |

---

## 🔵 FASE 4 — Resiliencia, Métricas y Monitoreo (FUTURO)

Transformación a un sistema listo para alta carga en producción.

| # | Ítem | Impacto | Urgencia | Esfuerzo | Score | Detalle |
|---|------|---------|----------|----------|-------|---------|
| 4.1 | **Reconexión de Baileys con Backoff** | 9 | 6 | 4 | **37.0** | Implementar reconexión con exponential backoff y jitter en `src/core/bot.js`. |
| 4.2 | **Rate Limiting por Usuario/Comando** | 8 | 5 | 5 | **31.5** | Prevenir spam de comandos en grupos mediante limitador en memoria por JID. |
| 4.3 | **Logs Estructurados (JSON Rotate)** | 6 | 3 | 3 | **22.0** | Migrar `loggerService.js` a formato JSON rotativo para facilitar diagnósticos y monitoreo. |
| 4.4 | **Dashboard de Salud Mejorado** | 7 | 3 | 4 | **25.0** | Expandir `statusDashboard.js` con métricas de uso de memoria, tiempo de respuesta y tasa de error. |
