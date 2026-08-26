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
