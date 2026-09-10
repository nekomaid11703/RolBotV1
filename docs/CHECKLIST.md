# Checklist del Proyecto — RolBotV1

> Estado general actualizado al 4 de agosto de 2026.
> Leyenda: `[x]` Completado · `[/]` En progreso · `[ ]` Pendiente
> Las cifras incluidas dentro de fases antiguas son hitos históricos; el estado actual validado es 44 archivos y 528 pruebas.

---

## 🟢 FASE 0 — Correcciones Críticas y Fundación (COMPLETADO)

- [x] Fix de 11 errores de ESLint (`no-promise-executor-return`, `no-useless-assignment`, `no-control-regex`, `preserve-caught-error`).
- [x] Corrección de crash en tests sin captura de excepciones.
- [x] Corrección de fallos en tests de caché (`test_cache_state_version.js`).
- [x] Implementación y exportación de funciones faltantes en `characterService.js`:
  - [x] `getCharacterNames`
  - [x] `renameCharacter`
  - [x] `updateCharacterSlots`
- [x] Activación de TypeScript `strict: true` en `tsconfig.json` (0 errores).
- [x] Integración de Knip y detección de código muerto.
- [x] Purga y archivado de la capa de IA (Gemini, OpenRouter, referee/parser de combate).

---

## 🟢 FASE 1 — Guardarraíles, Herramientas y Limpieza (COMPLETADO)

- [x] **Toolchain Integrado**:
  - [x] Configuración del script `npm run check:all` (`lint` + `typecheck` + `depcruise` + `format:check` + `test`).
  - [x] Configuración de Husky y `lint-staged` para hooks pre-commit.
  - [x] Pipeline CI/CD en GitHub Actions (`.github/workflows/ci.yml`).
- [x] **Migración a Vitest v4**:
  - [x] Configuración de `vitest.config.js`.
  - [x] 10 test suites activas (`*.test.js`).
  - [x] 191/191 aserciones en verde, 0 tests skipped.
- [x] **Limpieza y Formateo**:
  - [x] Formateo 100% de archivos JS con Prettier (`npm run format`).
  - [x] Archivado de tests obsoletos de combate IA (`tests/carta_blanca.test.js`, `tests/test_carta_blanca_inventory.js` -> `_archive/`).
  - [x] Archivado de servicios no utilizados (`src/services/characterProgressionService.js` -> `_archive/`).
  - [x] Limpieza de importaciones no utilizadas en `src/utils/messageFormatUtils.js`.
- [x] **Documentación y Conocimiento**:
  - [x] Registro de decisiones de diseño (`adr/ADR-001`, `adr/ADR-002`).
  - [x] Skill de Graphify e integración de `npm run graphify:update` (`.opencode/skills/graphify.md`).
  - [x] Actualización de la bitácora de problemas conocidos (`memory/known_issues.md`).
  - [x] Registro de cambios en `AI_CHANGELOG.md` (v3.1.0).

---

## ✅ FASE 2 — Completar Versión 1.0: Inventario y Combate Melee (COMPLETADO)

### 2.1 Módulo de Inventario Básico (Consumibles)

- [x] **Configuración y Catálogo**:
  - [x] Crear `src/config/inventoryConfig.js` (MAX_INVENTORY_SIZE = 20, stacks de 99).
  - [x] Crear `src/data/items.js` (catálogo precios inflados: venda=100, pocion=180, tonico=280, antidoto=200; efectos: venda=+15HP, pocion=+40HP, tonico=+80HP, antidoto=+25HP).
- [x] **Persistencia y Lógica**:
  - [x] Script SQL de migración (`src/database/migrations/001_create_inventory.sql`).
  - [x] Registro de `inventory` en `src/database/schemaValidator.js` y `schemaMigration.js`.
  - [x] Crear `src/services/rpg/inventoryService.js` con `withCharacterLock` por characterId.
- [x] **Comandos**:
  - [x] Crear `src/commands/rpg/inventory/inventario.js`.
  - [x] Crear `src/commands/rpg/inventory/usar.js`.
- [x] **Tests Unitarios**:
  - [x] Crear `tests/inventory.test.js` (14 tests en Vitest).

### 2.2 Motor de Combate Melee Determinista (D20-style)

- [x] **Fundación**:
  - [x] Crear `src/config/combatConfig.js` (timeouts: 10 min reto, 48 horas turno).
  - [x] Crear `src/services/rpg/combatState.js` para sesiones en memoria activa.
- [x] **Lógica Matemática del Motor**:
  - [x] Crear `src/services/rpg/combatEngine.js` (daño = STR_atk - DEF_def, bloqueo -25%, esquiva si SPD_MOV_def > SPD_MOV_atk).
  - [x] Penalización a stats por HP actual vía `getHpState` (Lastimado -20%, Incapacitado -50%, K.O./Muerto -100%).
  - [x] XP = nivel_ene * 0.3 y persistencia del HP final.
- [x] **Mensajería y Comandos**:
  - [x] Crear `src/services/rpg/combatMessages.js`.
  - [x] Crear `src/commands/rpg/combat/retar.js` (PvP por turnos).
  - [x] Crear `src/commands/rpg/combat/atacar.js` (ejecuta acción de ataque).
  - [x] Crear `src/commands/rpg/combat/estado.js`.
  - [x] Crear `src/commands/admin/group/disolver_combate.js` (desbloqueo forzado).
- [x] **Modo PvE / Dummy Test e IA Escalable**:
  - [x] Crear `src/services/rpg/combatAI.js` (extensible para enemigos PvE v2.0/v3.0).
  - [x] `generateDummyCharacter` en `combatState.js` con suma de stats igual a los puntos totales del personaje (nivel) y ligera variación aleatoria uniforme.
  - [x] Kit de prueba de consumibles en `inventoryService.js` (`ensureTestKit`).
  - [x] Soporte `/retar dummy` sin ejecución automática de turnos (soporte en DM).
  - [x] Rediseño de flujo por turnos asíncronos en 1 único mensaje por evento (`formatCombatOpen`, `formatActionMenu`, `formatReactionPrompt`).
  - [x] Submenú de reacción con nuevos comandos `/esquivar` y `/bloquear` (preparación para mecánica de fatiga).
  - [x] Pruebas unitarias en `tests/combat_ai.test.js` y `tests/combat_messages.test.js` (232 tests pasando en Vitest).

---

## ✅ FASE 2.5 — Stats Magicas y 21 Razas Canon (COMPLETADO)

- [x] **8 stats levelables**: ATK, DEF, ASPD, REF, MSPD, FULGOR, D_FULGOR, R_FULGOR
- [x] **21 razas canon** con stats balanceadas (suma=50 c/u) y aliases multilingue
- [x] **Razas implementadas**: Humano, Elfo, Enano, Duende, Oni, Elemental, Dragon, Yordle, No Muerto, Vampiro, Furry, Hada, Automata, Trickster, Puppet, Encarnacion, Ser del Vacio, Angel, Graviton, Sirena, Demonio
- [x] **LEVEL_INITIAL = 100** (coincide con 50 raza + 50 libres)
- [x] **Migracion automatica**: personajes antiguos reciben stats mágicas base de su raza al cargar
- [x] **Sistema de desbloqueo de habilidades**: deshabilitado (todas disponibles sin restriccion)
- [x] **XP de batallas**: deshabilitada (addXp no-op)
- [x] **Template crear_pj**: limpio (clases en notas, historia simplificada)
- [x] **214 tests pasando** en 14 suites Vitest

---

## 🟠 FASE 3 — Calidad Avanzada y Arquitectura (PARCIAL)

- [x] **3.1 Resolver Violaciones de Capas (depcruise)**: 0 violaciones; los helpers administrativos viven en `src/services/` y `safeQuery` ya no depende de servicios.
- [ ] **3.2 Remoción Gradual de `@ts-nocheck`**:
  - [ ] Retirar `@ts-nocheck` en `src/core/` (bot.js, commandHandler.js, context.js).
  - [ ] Retirar `@ts-nocheck` en `src/services/` (userService.js, economyService.js, characterService.js).
  - [ ] Retirar `@ts-nocheck` en `src/utils/`.
- [ ] **3.3 Mutation Testing**:
  - [ ] Ejecutar `npx stryker run` en `src/core/` y elevar cobertura de mutantes a >75%.
- [ ] **3.4 Cobertura de JSDoc**:
  - [ ] Añadir JSDoc `@param` y `@returns` completos en funciones exportadas de `src/utils/` y `src/services/`.

---

## 🔵 FASE 4 — Resiliencia y Operación (PENDIENTE)

- [x] **4.1 Reconexión Baileys**: arranque, socket, watchdog y temporizador de reconexión protegidos.
- [ ] **4.2 Rate Limiting**: Limitador de tasa por usuario/grupo para prevenir spam.
- [ ] **4.3 Structured Logging**: Logs en formato JSON rotativo en `loggerService.js`.
- [x] **4.4 Dashboard de Monitoreo**: métricas operativas en `statusDashboard.js`.
