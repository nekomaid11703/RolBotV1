# AI_CHANGELOG.md — Registro de Cambios de la IA

Este archivo registra los cambios significativos y decisiones arquitectónicas tomadas por Antigravity en la base de código.

---

## [Unreleased]

### Sistema y Mecánicas de Contenedores de Hechizos (`spell_container`) (2026-08-22)

- **Capacidades Ajustadas y Ranuras por Tier (`spellContainerService.js`)**:
  - `CONTAINER_CAPACITIES`: Pergamino (1 slot), Libreta desgastada (4 slots), Grimorio (12 slots), **Grimorio Arcano (24 slots — capaz de albergar hasta 6 hechizos Tier S de 4 slots cada uno)**.
  - Coste de ranuras por Tier (`getSpellSlotCost`): Tier S (4 slots), Tier A (3 slots), Tier B / C (2 slots), Tier E / D (1 slot).
  - Validación de memoria al equipar hechizos (`equipActiveSpell`): rechaza el equipamiento si supera la capacidad libre del contenedor equipado activo.
- **Ranura de Tomo Único (`equipmentService.js`)**:
  - Incorporado slot oficial `spell_container` a `EQUIPMENT_SLOTS` y aliases coloquiales (`tomo`, `grimorio`, `pergamino`, `contenedor`). Un personaje solo puede tener 1 tomo equipado a la vez.
- **UI & Menú de Hechizos (`spellSections.js` & `spell.js`)**:
  - Muestra el tomo equipado con barra visual de capacidad `[████░░░░] 4/24 slots usados` al inicio de `/spell`.
  - Muestra el coste en slots de cada hechizo según su Tier al listar `/spell` o `/spell info`.
- **Pruebas Automatizadas (`tests/spell_container_capacity.test.js`)**:
  - Creada suite de pruebas dedicada. Verificación limpia de la suite completa del proyecto (63 archivos, 770 tests 100% pasados).

### Catálogo de Familias de Materiales y Rediseño de `/item_add` (2026-08-22)

- **`src/data/materialFamilies.js`**:
  - Generador y registro automático de familias de ítems para **todos los 20+ materiales del juego** (`materialData.js`: Madera, Cuero, Hueso, Piedra, Hierro, Bronce, Acero, Plata, Platino, Obsidiana, Oro, Madera de Caoba, Titanio, Mitril, Oricalco, Luminita, Mineral Pálido, Obsidiana Azul, Madera del Irminsul, Adamantita, Etério, Vibranium, Filo Estelar).
  - Generación de **11 tipos de ítems por material**: Espadas (cortantes), Mazas (contundentes), Lanzas (perforantes), Dagas (perforantes), Báculos (canalización mágica), Cascos, Pecheras, Grebas, Botas, Escudos y Amuletos místicos.
  - Derivación automática de metadatos (resistencia, durabilidad, masa, multiplicadores) mediante `createItemDefinition` de `itemFactory.js`.
- **`src/data/items.js`**:
  - Auto-carga de `materialFamilies.js` e integración con `getItem(id)`, `getAllItems()` y `getItemsByCategory(category)`.
- **`src/commands/rpg/inventory/item_add.js`**:
  - Rediseñado con soporte de **búsqueda inteligente por término** (ej: `/item_add mitril`, `/item_add casco`, `/item_add buscar espada`).
  - Asignación rápida cuando la coincidencia es única o por ID exacto.
  - Formato estructurado con sugerencias de IDs exactos cuando la búsqueda arroja múltiples coincidencias.
  - Guía visual interactiva de materiales y categorías disponibles al ejecutar `/item_add` sin argumentos.
- **`tests/material_families.test.js`**:
  - Cobertura de pruebas automatizadas para el catálogo completo de familias de materiales y filtrado por categoría.

### Puesta a Punto y Producción del Sistema de Combate (2026-08-22)

- **UI & Mensajería Predictiva de Combate**:
  - `src/ui/sections/combatSections.js` y `combatMessages.js`: Menú de turno enriquecido con contexto situacional directo (distancia en metros, HP y maxHP del enemigo, Fulgor disponible/máximo).
  - `src/data/combatActions.js`: Prompt de reacción `REACTION_ACTIONS` actualizado para mostrar la **probabilidad % estimada de esquiva** y el coste de daño/fatiga antes de tomar la decisión.
  - `src/ui/sections/combatStats.js`: `buildStatSummary` re-formateado a 2 líneas limpias con iconos temáticos (⚔️ ATK, 🛡️ DEF, ⚡ ASPD, 🏃 MSP, 👁️ REF, ✨ FUL).
- **Integración de Meditación en Descanso**:
  - `src/commands/rpg/combat/descansar.js`: `/descansar` (y alias `/meditar`) ahora recupera **Fatiga Y Fulgor** en el mismo turno. La recuperación de Fulgor es proporcional a la estadística de Defensa Arcana (`DF`).
- **Comando `/usar` (Consumibles en Combate)**:
  - `src/commands/rpg/combat/usar.js`: Nuevo comando de ejecución directa para usar pociones, vendas y elixires en combate o fuera de él. Consume del inventario, aplica curación de HP o restauración de Fulgor instantánea y avanza el turno.
- **Visualización de Alcance de Hechizos (`/spell`)**:
  - `src/ui/sections/spellSections.js` y `spell.js`: Sub-menú de hechizos equipados con indicadores 🟢/🔴 que comparan dinámicamente el alcance de cada hechizo contra la distancia actual de combate.
- **Claridad en Reacciones y Resultados**:
  - `bloquear.js`, `esquivar.js`, `huir.js` y `atacar.js` pasados a formato estándar con `buildSituationalCtx` para garantizar que el menú del siguiente turno presente la información situacional actualizada.

### Catálogo Masivo de 40 Spells, Consumibles Escalados, Arenas Dinámicas y Sinergia de Build 100-500 (2026-08-22)

- **`scripts/simulate_combat/repertorio40.js`**:
  - Creación del catálogo masivo de **40 Habilidades Experimentales** forjadas bajo el Sistema Simplificado de Magia, cubriendo las 9 naturalezas de Fulgor (*fuego, agua, tierra, aire, hielo, electro, luz, oscuridad, caos*), las 2 aplicaciones (*propia, externa*), los 5 tipos de resolución (*proyectil, explosion, barrera, buffo, aura*) y efectos de estado. Clasificación determinista en Tiers oficiales con `getSpellCategory`.
- **`scripts/simulate_combat/config.js` y `combatLoop.js`**:
  - Adición de 4 personalidades especializadas (`mago_bombardero`, `mago_barrera`, `hibrido_perforante`, `hibrido_tanque`), nivelando la muestra (11 físicas vs 9 mágicas/híbridas).
  - Implementación de consumibles de utilidad escalados por nivel (`ITEM_TIERS_BY_LEVEL`: Pociones Menores/Medias/Mayores de HP y Elixires de Fulgor).
  - Soporte en `combatLoop.js` (`shouldUseItem`/`useItem`) para que magos e híbridos consuman pociones de Fulgor en combate, recargando batería de forma instantánea sin perder turnos meditando.
- **`src/services/rpg/itemStatService.js`**:
  - Implementación de `calculateBuildSynergy(stats, equipment, level)`, que evalúa la coherencia stat-equipo-hechizo. Aplica un coeficiente progresivo que otorga hasta **+15% de efectividad a Nivel 400-500** para builds especializadas y un malus de hasta **-10% por ineficiencia** a reparticiones sin coherencia.
- **`scripts/simulate_combat/run_archetype_matrix.js`**:
  - Runner actualizado para sortear distancias iniciales de arena (2m, 6m, 10m), asignar rotaciones de las 40 habilidades experimentales y evaluar comparativamente los brackets **Bracket Bajo (100–200)** vs **Bracket Alto (400–500 con sinergia activa)**.
- **`memory/decisions.md`**:
  - Registro de la **Nota Arquitectónica sobre el Consenso de Progresión**: la mejora/upgrade de equipamiento y hechizos del jugador está abstraída por nivel en el laboratorio y se diseñará en una sesión posterior.

### Paso 5: Calibración y Balance Fino Competitivo (2026-08-22)

- **`src/services/rpg/skillForgeService.js`**:
  - Adición de `getSpellCategory(spellDef)` para clasificar objetivamente los hechizos en categorías canónicas (`Básico` Tier E/D, `Intermedio` Tier C/B, `Avanzado` Tier A, `Mítico` Tier S) según coste de Fulgor, `d_fulgor` requerido (`SPELL_DOMINIO_REQ`) y complejidad.
- **`scripts/spell_lab/index.html` y `server.js`**:
  - Integración de `getSpellCategory` en la API `/api/cost` y actualización del Spell Lab para mostrar la categoría real calculada y sus métricas objetivas de dominio y Fulgor.
- **`scripts/simulate_combat/families.config.js` y `familyGenerator.js`**:
  - Generador universal de familias para los 21+ materiales del juego (`materialData.js`), derivando de base armas físicas, focos modulares (varitas/báculos con daño + canalización), armaduras y túnicas místicas (cobertura mística + buff mágico), escudos y artefactos.
  - Desvinculación del Tier de la rareza del material: el Tier representa la calidad de manufactura del objeto (existiendo Madera Tier S y Mitril Tier E).
- **`scripts/simulate_combat/config.js` y `fighterGenerator.js`**:
  - Adición de 4 personalidades con asignación de presupuesto en stats mágicas (`mago_puro`, `mago_control`, `hibrido_guerrero`, `hibrido_mago`) y mapa `ARCHETYPE_MAP`.
  - Asignación de equipo modular y libertad total de acciones sin bloqueos de clase.
- **`scripts/simulate_combat/run_archetype_matrix.js`**:
  - Runner dedicado para simular la matriz cruzada 3×3 de enfrentamientos (Físico vs Físico, Físico vs Mágico, Físico vs Híbrido, Mágico vs Mágico, Mágico vs Híbrido, Híbrido vs Híbrido) con niveles parejos. Generación de reporte en `scripts/simulation_output/archetype_matrix_report.md`.

### Runtime Completo de Efectos de Estado, Cegadura y Barreras (2026-08-22)

- **`src/config/spellTree.js`**:
  - Adición de la constante `CEGADURA_REF_REDUCTION = 3` y registro del nuevo efecto `cegadura` en `EFFECT_DEFS`.
  - Refinamiento de `congelado`: inmoviliza el movimiento de forma estándar; el bloqueo de ataques es condicional al daño mágico del impacto superando la Resistencia Mágica del objetivo (`dañoMágico > R_FULGOR`).
  - Consagración del **Principio Canónico de Naturalezas Primordiales**: Luz, Oscuridad y Caos pueden ejecutar todo el espectro (daño, debuffs como cegadura, buffs, curación, purificación, barreras y auras).
- **`src/services/rpg/combatState.js`**:
  - `getDefenseReduction(slot)`: cálculo acumulativo de reducción de defensa (DEF) para `rompe_armaduras`.
  - `getReflexReduction(slot)`: cálculo acumulativo de reducción de reflejos (REF) para `cegadura`.
  - `applyBarrierDamage(slot, rawDamage)`: absorción de daño prioritario por barrera defensiva antes de impactar el HP del personaje.
- **`src/ui/sections/combatSections.js`**:
  - `activeEffectLines(combatant)`: visualización de estados activos e indicadores de barrera HP en el menú de combate.
- **`src/commands/rpg/combat/spell.js`**:
  - Integración de `isActionBlocked` (bloqueo de casteo cuando está congelado severamente) y absorción de barrera al calcular daño mágico.
- **`tests/spell_effects_runtime.test.js`**:
  - Pruebas unitarias completas para `congelado` condicional, `cegadura`, `rompe_armaduras`, `applyBarrierDamage` y purificación.

### Sistema de Hechizos `/spell`, Contenedores y Ranuras Activas (2026-08-22)

- **`src/commands/rpg/combat/spell.js`**: comando principal `/spell` con sub-menú interactivo estilizado en la UI de combate (`spellSubmenuLines`), lanzamiento en combate, chequeo de cooldowns, toggle de pasivas, ficha técnica (`/spell info`) y listado de tomos (`/spell contenedores`).
- **`src/commands/rpg/inventory/equipar_spell.js`**: comando `/equipar_spell` (alias `/equipar_hechizo`, `/equipar_habilidad`) para equipar/desequipar en las 4 ranuras activas de combate.
- **`src/services/rpg/spellContainerService.js`**: servicio para gestionar la capacidad de tomos contenedores (`libreta_desgastada` [2], `pergamino` [1], `grimorio` [4], `grimorio_arcano` [8]) y el límite estricto de 4 ranuras activas equipadas (`spell_1`..`spell_4`).
- **`src/services/rpg/equipmentService.js`**: adición de `spell_1`..`spell_4` a `EQUIPMENT_SLOTS` y sus alias coloquiales (`hechizo_1`, `habilidad_1`, etc.).
- **`src/data/items.js`**: registro de ítems contenedores en el catálogo de ítems (`libreta_desgastada`, `pergamino`, `grimorio`, `grimorio_arcano`).
- **`src/data/combatActions.js`**: adición de `/spell` al menú de acciones de combate de WhatsApp.
- **`src/services/rpg/combatState.js`**: decaimiento por turno de cooldowns de hechizos activos (`decaySlotSpellCooldowns`).

### Quemadura persistente en combate

- **`src/config/spellTree.js`**: `quemadura` calcula duración y daño por tick según `d_fulgor` del lanzador, y mitiga cada tick con `r_fulgor` del objetivo.
- **`src/services/rpg/combatState.js`**: las reacciones registran efectos persistentes en el slot objetivo; los efectos no acumulables se refrescan y el DOT se resuelve al inicio del turno del portador.
- **`tests/combat_elemental.test.js`**: cobertura de aplicación, duración, consumo y mitigación de quemadura.

### Paridad de equipo y preparación de balance competitivo

- **`itemStatService`**: el tier de armas físicas se aplica una sola vez, eliminando el doble escalado frente a focos y armaduras.
- **Equipo de combate**: absorción y persistencia multi-pieza en ataque, bloqueos, esquivas, descanso, huida y turno del dummy; TD-005 resuelta.
- **`memory/plans/competitive_balance.md`**: criterios, métricas y puertas técnicas para el balance físico, mágico e híbrido.

---

## [2.12.0] - 2026-08-06

### Generador de familias de ítems tester (múltiples materiales + tiers) + IA de equipamiento + informe detallado + re-baseline

La simulación deja de depender del catálogo plano de hierro y pasa a generar equipo con **materiales reales del motor** (`materialData`), tiers por material, munición para arcos, y una IA de combate que reacciona al equipamiento. Los ítems siguen siendo SOLO tester (en memoria, sin registrar en el catálogo real).

- **`scripts/simulate_combat/families.config.js`** (nuevo): pesos de rareza de material (común 40% / poco común 30% / raro 15% / épico 10% / legendario 3% / mítico 2%), techo de tier por material (común→C, poco común→B, raro→A, épico/legendario/mítico→S), familias editables (hierro + madera), stock de flechas y umbral de bloqueo (`BLOCK_PREFER_DEF_THRESHOLD=60`).
- **`scripts/simulate_combat/familyGenerator.js`** (nuevo): registro en memoria `createFamily/removeFamily/editFamily/listFamilies` (persistencia opcional en `families.state.json` ignorada por git — solo cambios del CLI), `rollMaterial` (peso por rareza desplazado por nivel), `rollTier` (E–S según nivel + rareza del material), builders de arma/armadura/escudo/amuleto/municion con **stats reales del motor** (`base × tier × material` vía `itemStatService`), y `generateLoadout` (1 arma + munición si ranged + armadura con cobertura por pieza + escudo si 1 mano + amuleto). `rollTier` simula crafteo: tier del material como techo, con probabilidad de tier inferior.
- **`scripts/simulate_combat/fighterGenerator.js`**: `generateEquipment` delega en `generateLoadout` (presets de experimento siguen funcionando). Fix de nombre redundante (`Arco de Hierro de Acero` → `Arco de Hierro`).
- **IA de equipamiento** (`combatEngine.chooseAiReaction`): prefiere **bloquear** si hay escudo o `bonusDef ≥ 60`; el arquero sin flechas pasa a **desarmado** y se acerca (un ranged sin proyectil ya no "ataca a distancia" con daño 0). Umbral movido a `combatConfig.BLOCK_PREFER_DEF_THRESHOLD`.
- **`scripts/simulate_combat/manage_families.js`** (nuevo): CLI `list/show/add/edit/rm` sobre `families.config.js` (persistencia probada entre ejecuciones).
- **`scripts/simulate_combat/generate_family_report.js`** (nuevo): informe markdown detallado de equipamientos generados (stats, arma con naturaleza/tier/material/daño/alcance/municion, piezas de armadura con cobertura/maxResist/bonusDef, escudo, amuleto con buff, piezas de set y bono activo, stats de material por pieza) → `scripts/simulation_output/family_report.md`.
- **Métricas** (`metricsCollector`/`aggregator`/`formatters`): secciones con winrate por material, rareza del material del arma, material de armadura y munición en el reporte.

**Re-baseline (2000 sims, nuevo generador)**: integridad 0 issues; turnos subset parejo 6.03 (target 7.0 ✅, CI 5.45–6.62); ventaja primer atacante −4.4% (⚠️ ahora el 2º atacante gana — el primer atacante asume la fatiga de los 25 m iniciales, agravada por coberturas pesadas); meta gladiador 69.2% (target ≤55% ⚠️, hallazgo del motor, sin maquillar); set bonus activo 97.6% (todas las piezas comparten `setId` de familia); naturalezas por bracket desviadas de 1/3 (perforante ~44% porque el arco suma munición perforante). Hallazgos del motor pendientes: asimetría del primer atacante, progresión por tier vs nivel (el nivel no predice victoria), set bonus/amuleto solo UI, `getMovementFatigueWithCoverage` sin consumidor real.

Lint 0, typecheck 0, 532/532 tests verdes.


## [2.11.0] - 2026-08-05

### Techo de 20 rounds + balance de duración (HP×3) + cobertura coherente por fighter + re-baseline

Decisión de diseño del usuario: una pelea de más de 20 rounds se vuelve aburrida → el simulador ahora usa `MAX_ROUNDS=20` (solo simulación; el motor real no se toca).

- **`scripts/simulate_combat/config.js`**: `MAX_ROUNDS` 50→20, `FATIGUE_SNAPSHOT_TURNS` recortado a `[1,5,10,15,20]`, `HP_STAT_MULTIPLIER` 5→3 (HP pool medio ~215→~130: los KOs llegan antes sin tocar fatiga del motor).
- **`scripts/simulate_combat/fighterGenerator.js`**: la cobertura se sortea UNA vez por fighter (todas las piezas iguales) en vez de por pieza con "la más pesada manda" — antes el baseline quedaba con 65% "total" / 0.5% "ligera" sin varianza real; ahora ~25% cada cobertura.
- **`scripts/simulate_combat/audit.js`**: labels dinámicos ("round ${maxRounds+1}", "Batallas ≥ ${maxRounds}"); nuevas métricas de sesgo del desempate por HP residual en timeouts (perdedor ≥50% HP del ganador, gap de HP P50/P90).

**Resultados (baseline 2000 sims, techo 20 + HP×3)**: integridad 0 issues; turnos subset parejo 7.50 (target 7.0 ✅, antes 12.06); ventaja primer atacante 2.6% ✅ (antes 2.1% con techo 50); timeouts 9.2% (antes 4.4% con techo 50 — piso estructural del dodge determinista, ver abajo); duración media 7.20 (antes ~12); P90 20 (antes 26); cobertura ahora alta 55% / total 24% / media 11% / ligera 10% (el escudo fijo "alta" explica el 55%); meta tanque 67.1% (target ≤55% ⚠️ — hallazgo del motor, sin maquillar).

**Sweep de fatiga (6 candidatos × 2000 sims via `run_experiments.js`)**: `FATIGUE_ATK_COST_SCALE` 0.10/0.15, `FATIGUE_RECOVERY_MAX` 10/8, y combos — todos quedaron en 286-329 timeouts y ~9.3-9.7 rounds: la fatiga NO es el driver de la cola larga. El driver real es el **dodge determinista** (`combatEngine.attemptDodge`: mspd > aspd → esquiva siempre; 69% de los timeouts tienen un lado con dodge perfecto). Decisión del usuario: mantener el dodge determinista → el ~8-9% de timeouts es el piso estructural aceptado. **HP×3 fue la palanca efectiva** (timeouts 15.7%→8.2%, turnos 9.81→7.73; HP×2 invertía la ventaja del primer atacante a −2.6% y dejaba P50 en 4 → descartado).

**Experimentación (16 presets × 1000 sims, bajo el nuevo balance)**: todo acortó ~40% vs la pasada (amuleto 7.8→6.9 rounds, maza 16.8→9.2, tier E 15.1→9.1); jerarquías se mantienen (estoque más letal KO 96.7% / maza más lenta 9.2 rounds; tier E→A KO 84.7%→93.2%); el escudo ahora importa (winrate 49.2%→53.4%, antes sin efecto); set_on sigue alargando (5.5→7.0 rounds) y da ventaja (46.2%→52.1%).

Lint 0, typecheck 0. Hallazgos del motor sin tocar (tickets pendientes): nivel no predice victoria (34.5%), meta tanque 67.1%, desempate por HP residual en timeout, set bonus/amuleto solo UI, `getMovementFatigueWithCoverage` sin consumidor real.



## [2.10.0] - 2026-08-04

### Catálogo de ítems real (Familia del Hierro) en la simulación + re-baseline con soft cap + experimentos de equipamiento

Reemplaza el catálogo inventado de la simulación por el catálogo base de hierro derivado con las fórmulas REALES del motor (`itemStatService`: base × tier × material), con personalidades tipo jugador (especializadas 60-80% en 2-3 stats) y valida mecánicas pendientes del motor. Los ítems se crean SOLO en la simulación; cuando estén probados se implementarán en `src/data/` (revisando además cómo se almacenan los ítems ya creados).

- **`scripts/simulate_combat/config.js`**: `PERSONALITIES` rediseñadas (tanque, asesino, esquivo, equilibrado, extremista_*, velocista, berserker, guardian, estratega, gladiador, magus), `IRON_FAMILY` (weaponPool espada cortante 20 / estoque perforante 14 / maza contundente 22; armorSlotBase cabeza/pecho/pantalones/botas; coverageSuffix ligera/media/alta/total; escudo en `mano_izq` cobertura alta; amuleto `{atk:+5}`), `TIER_BRACKETS` (E/C/B/A) con asignación probabilística 60/30/10, `SHIELD_CHANCE=0.6`, `AMULET_CHANCE=0.4`, `SET_BONUS={def:10}`, `STAT_SOFT_CAP=75`.
- **Soft cap de asignación de puntos** (`fighterGenerator.js`): `allocateDelta` reparte el presupuesto de nivel punto a punto según pesos de personalidad con decay cuadrático desde el soft cap — el jugador diversifica al acercarse al clamp 100 (elimina la saturación que aplastaba la varianza). `scaleToLevel` re-gasta el delta con los pesos del propio fighter (adiós al escalado por ratio). `capToMaxLevel` recorta el exceso de nivel por buffs (suma ≤ 500).
- **`combatLoop.js`**: cobertura real aplicada a movimiento (mspd penalizada + `getMovementFatigueWithCoverage`); durabilidad por piezas EN ORDEN (`createDurability` reparte el daño material entre `armorList` — mecánica validada en sim, pendiente en motor real que solo impacta `armor.list[0]`).
- **Métricas/auditoría**: `metricsCollector` (equipmentTier, coverage, setPieces, amulet, shield, armorBrokenPieces...), `aggregator`/`formatters` (sección "Equipment Analysis" con winrates), `audit.js` (7.1 saturación por bracket, 7.2 naturalezas ≈1/3, 7.3 tier por nivel 60/30/10, 7.4 equipo; veredicto con backticks escapados; accepta `draw` por timeout con HP igual).
- **`scripts/simulate_combat/run_equipment_experiments.js`** (nuevo): 16 presets × 1000 sims (amuleto on/off, escudo on/off, cobertura ligera→total, set on/off, naturaleza espada/estoque/maza, tier E/C/A) → `scripts/simulation_output/experiments/`.
- **`docs/item_creation_guide.md`** (nueva): reglas canónicas de creación de ítems + resultados del re-baseline y experimentos.

**Resultados (baseline 2000 sims)**: integridad 0 issues; saturación 0% en brackets bajos (máx 20.5% def en 400-500); naturalezas ≈1/3; tier 60/30/10; ventaja primer atacante 2.1% (target ≤5% ✅); meta velocista 64.6% (target ≤55% ❌ — hallazgo del motor); turnos 12.06 (target 7.0 ❌). **Experimentación**: amuleto acelera (rounds 12.8→10.2, ATK +8), set alarga combates (9.2→12.1 rounds), cobertura ligera/media invierte la ventaja del primer atacante, tier E→A reduce rounds 15.1→9.2, estoque es la naturaleza más letal (KO 98%). Lint 0, typecheck 0.


## [2.9.0] - 2026-08-03

### UI por secciones reutilizables + menú de combate data-driven + equipamiento en `/ver_pj`

Segunda pasada de UI (feedback de la segunda prueba en vivo): separar las pantallas del sistema en secciones reutilizables que se alimentan directamente del registro de comandos/servicios, para que añadir/quitar funcionalidad actualice la UI sin tocar el formateador.

- **Librería UI** (`src/ui/`): `sectionBuilder.composeMessage` compone cualquier mensaje a partir de secciones (arrays de líneas) separadas por línea en blanco; secciones por dominio en `src/ui/sections/` (`combatStats`, `combatSections`, `characterSections`, `equipmentSections`). `combatMessages`, `characterFormatUtils` e `inventario` ahora **componen** desde estas secciones en vez de construir líneas a mano (sin duplicación).
- **Menú de acciones data-driven** (`src/data/combatActions.js`): `COMBAT_ACTIONS` y `REACTION_ACTIONS` son listas declarativas `{command, label, hint?, when?}` con `render` para reacciones. `formatActionMenu`/`formatReactionPrompt` (y las pantallas de combate) se generan desde el registro → el menú ya muestra `avanzar`/`retroceder`, que antes faltaban por estar hardcodeado con solo 4 acciones.
- **Equipamiento en `/ver_pj`**: el comando resuelve el equipo con `equipmentResolverService.resolveCharacterEquipment` y `formatCharacter` muestra una sección **EQUIPO** (arma, armadura con durabilidad, material, artefactos, bonos de set) — antes no se reflejaba el equipamiento actual.
- **Sin emojis de ítem restantes**: se eliminan los prefijos de tipo 🗡️/🧵/🛡️ de `formatEquipmentSummary` y de las líneas de arma/armadura en `atacar.js` (107/449 y armadura). Se conservan emojis de estado (HP/fatiga), encabezados de sección e iconos de stats.

**Tests**: +11 (`combat_actions.test.js`×5, `section_builder.test.js`×4, equipo en `character_format.test.js`×2) — **469/469 verdes** (33 archivos). Typecheck 0. Eslint 0 errores en archivos tocados (2 preexistentes documentados en `atacar.js`).

## [2.8.0] - 2026-08-03

### UX de inventario + eliminación de iconos de ítems + fix HP 0 en combate

Revisión del sistema de inventario (feedback de la primera prueba en vivo con el kit de hierro):

- **Listado numerado**: `/inventario` muestra `N. Nombre xCantidad` con índice 1-based para referirse a los ítems cómodamente.
- **`/equipar <n>|item_id [slot]`**: acepta el número del listado; si no se indica slot, se elige automáticamente por categoría (weapon→`mano_der`, shield→`mano_izq`, armor→slot del módulo o inferido por id/nombre, artifact→primer hueco libre). Nuevos helpers en `equipmentService`: `resolveDefaultSlot`, `resolveArmorSlot`, `normalizeSlot`, `SLOT_ALIASES` (casco, pechera, grebas, botas, mano...).
- **`/des_equipar <slot>`**: nuevo nombre de comando (alias) y acepta alias de slot; `/usar <n>` acepta el número del listado.
- **Eliminación de sticker/icono de ítems**: se quita el campo `icon` de las definiciones (`items.js`, `ironFamily.js`) y de todas las salidas de texto (inventario, usar, item_add, item_rem, equipar, desequipar, UI de equipo en combate, ataque). `itemFactory`/`itemService` ya no inyectan icono; `entityFactory` conserva `icon === ""`.
- **Fix HP 0**: una sesión de combate nunca arranca con vida 0. Nuevo `combatState.resolveSessionHp` — si el HP persistido es 0/inválido, inicia con el HP máximo (p. ej. tras dejar vida 0 en un combate anterior).

**Tests**: +15 (`resolveSessionHp`, `normalizeSlot`, `resolveDefaultSlot`, `getInventoryList`) → **458/458 verdes** (31 archivos). Typecheck 0. Eslint 0 errores en archivos tocados.

## [2.7.0] - 2026-08-03

### Dummy equipado con la Familia del Hierro + UI de combate

Primera pasada integral de juego: el dummy PvE ahora usa equipo real y el sistema de combate lo muestra de punta a punta.

- **`src/services/rpg/dummyEquipment.js`** (nuevo): equipo en memoria del dummy (espada, set `set_hierro` de 4 piezas, amuleto) en la misma forma que expone `getEquippedItems` para la DB. `generateDummyCharacter` lo adjunta; los resolvers lo usan **sin tocar la DB**.
- **`equipmentResolverService`**: `getEquippedItems`/`resolveDefenderArmor` aceptan personaje (objeto) o id y resuelven el equipo en memoria del dummy; nuevo `resolveCharacterEquipment` (resumen de arma/armadura/artefactos/sets/cobertura) para la UI.
- **UI de combate** (`combatMessages`): `formatCombatOpen` y `formatCombatStatus` ahora reciben un `equipmentMap` y dibujan arma (naturaleza+daño), piezas de armadura con durabilidad, resistencia material total, artefactos y bonos de set activos.
- **`atacar.js`**: el ataque muestra el arma usada, el daño material, la absorción/overflow/rotura de la armadura y la durabilidad restante; los mensajes se reutilizan. El **contraataque del dummy ahora usa su espada** (resuelve su arma en memoria) y la durabilidad de su armadura se sincroniza en memoria (no escribe en la DB).
- **`estado.js` / `retar.js`**: resuelven el equipo de ambos bandos para la apertura y el estado.
- **Kit de hierro**: `inventoryService.ensureIronFamilyKit` siembra el set completo (+kunai x5) al retar al dummy; `/item_add` lista la familia de hierro.
- `armorSetService`/`armorSets`: los bonos de set exponen `name` para la UI.

**Tests**: +11 (`tests/dummy_equipment.test.js`: buildDummyEquipment, resolvers en memoria, resolveCharacterEquipment, UI) → **443/443 verdes** (31 archivos). Typecheck 0, eslint 0.

## [2.6.0] - 2026-08-03

### Familia del Hierro (primeros ítems de juego)

Primeros ítems concretos construidos sobre el sistema gestor de ítems (v2.5.0):

- **`src/data/ironFamily.js`**: 7 definiciones registradas en `itemCatalog` (material `hierro`, tier E):
  - Arma equipable `espada_de_hierro` (cortante, 1 mano).
  - Set `set_hierro` de 4 piezas: `casco`, `pechera`, `grebas`, `botas_de_hierro`.
  - Artefacto `amuleto_de_hierro` (buff `atk: 5`).
  - Arma arrojadiza `kunai_de_hierro` (perforante, apilable x20, consume turno de ataque).
- **`src/data/armorSets.js`**: bonus del set (≥3 piezas) → `{ def: 10 }`.
- **`src/data/itemCategories/throwable.js`** (nuevo módulo): arma no equipable, `trigger Throw/Use`, `consumedOnUse`.
- **`src/services/rpg/itemFactory.js`**: nuevo tipo `throwable` en `VALID_TYPES`; los arrojadizos no portan durabilidad persistente.
- **`src/data/items.js`**: `getItem` ahora cruza al `itemCatalog` inyectable (los ítems del catálogo son visibles para equipo/resolver/inventario). `getItemsByCategory` se mantiene sobre el catálogo base.

**Tests**: +18 (`iron_family.test.js`: stats, factory, set bonus, arma no equipable, resolución de equipo con puente real) → **432/432 verdes** (30 archivos). Typecheck 0, eslint 0 errores.

## [2.5.0] - 2026-08-03

### Sistema Gestor de Ítems (mecánica, sin ítems concretos)

`Plan: memory/plans/item_system_engine.md` — capa de gestión que construye, valida, resuelve y persiste las definiciones de ítem y su equipo. No se crearon ítems del catálogo; se prueba con fixtures sintéticos.

- **`src/data/itemCatalog.js`**: registro inyectable/`lazy` de definiciones de ítem (vacío; catalogables a futuro).
- **`src/services/rpg/itemFactory.js`**: `createItemDefinition` con validación de tipo (`weapon|armor|artifact|consumable|material|special`), normalización de tier y derivación de `metadata` (durabilidad `maxResist/currentResist` y `materialStats`) desde material+tier.
- **`src/services/rpg/itemStatService.js`**: fórmula pura `base × tier × material` → `getWeaponStats`/`getArmorStats`/`getArtifactStats`/`getMaterialCost`.
- **`src/services/rpg/equipmentResolverService.js`**: cruza `equipped_slots` ↔ `inventory.metadata` → `weaponInfo` / instancias `DurabilityModule` / buffs de artefactos. Backward-compat: sin arma ⇒ `weaponInfo=null`.
- **`src/services/rpg/durabilityPersistenceService.js`**: sincroniza `currentResist`/`broken` a `inventory.metadata`; si el ítem no es reparable y llega a 0 ⇒ se elimina (destroyed). Preserva campos ajenos de metadata.
- **`src/services/rpg/armorSetService.js`**: cobertura (total/alta/media/ligera) → penalización `MSPD` y coste de fatiga por metro; bonos de set ≥3 piezas.
- **Integración combate (`atacar.js`)**: resuelve `weaponInfo` del atacante y `armorDurability` del defensor y los pasa a `executeAttack`/`executeReaction`; persiste durabilidad tras el golpe (fallback silencioso, backward-compat).

**Tests**: +32 (factory, stat service, resolver, durabilidad, sets) → **414/414 verdes**. Typecheck 0 errores, eslint 0 errores, depcruise 3 warnings históricos.

## [2.4.0] - 2026-08-03

### Remediación del Sistema de Ítems y Equipamiento

**Corrección de deuda técnica (auditoría código ↔ Supabase):**

- **Migración 003 (`src/database/migrations/003_remediation_item_equipment.sql`, manual en Supabase):**
  - `inventory.metadata` (JSONB) — storage para durabilidad/tier/material/broken.
  - `characters.equipped_slots` (JSONB) — desbloquea `/equipar` y `/desequipar`.
  - Tabla `combat_sessions` (misma DDL de `TABLE_CREATE_SQL`) — persiste sesiones de combate.
  - Limpieza de ítems temporales huérfanos (`*_temp`) del inventario.

- **Versión de schema unificada** (`src/database/schemaConstants.js`): `CURRENT_VERSION` como única fuente (2.2.0); `schemaVersion.js` y `schemaMigration.js` dejan de tener versiones duplicadas (2.0.0 vs 2.1.0).

- **Esquema conocido alineado:**
  - `columnRegistry.KNOWN_SCHEMA`: añadido `characters.category`.
  - `schemaValidator`: añadido `inventory.metadata` y `characters.equipped_slots`.
  - `schemaMigration.DESIRED_SCHEMA`/`COLUMN_TYPES`: tipos corregidos a **UUID** (`characters.id`, `inventory.character_id`), añadidas nuevas columnas deseadas.

- **Blindaje `equipmentService.js`:** nuevo guard que, ante columna/relación inexistente (PGRST204), lanza error claro apuntando a la migración 003 en lugar de fallar en silencio o devolver `{}`. Tests de degradación añadidos (migración ausente).

- **Nuevo script** `scripts/cleanup-temp-items.js` idempotente (DRY por defecto, `--apply` para ejecutar).

**Verificación:** typecheck 0 errores, lint 0 errores nuevos en archivos tocados (2 errores preexistentes en `formatErrorUtils.js`), 382/382 tests verdes (24 archivos), depcruise solo 3 warnings históricos, graphify actualizado (1558 nodos). Smoke vs Supabase: `equipped_slots`, `metadata` y `combat_sessions` operativos; `schema_version=2.2.0`.

---

## [2.3.1] - 2026-08-01

### Reestructuración de Raíz y Limpieza de Archivos Obsoletos

**Organización de la raíz del proyecto:**
- `docs/` — Movidos `AI_CHANGELOG.md`, `ROADMAP.md`, `CHECKLIST.md` desde la raíz.
- `_archive/` — Movidos `PLAN_stats_magicas.md` y `COMBATSISTEM.md` (borrador/plan completado).
- Eliminados `tsconfig.tsbuildinfo` (artefacto de cache incremental de `tsc`), `.clinerules`, `.roomodes` y `.roo/` (configs de agentes que referenciaban la capa de IA purgada).

**Limpieza de `_archive/`:**
- Eliminados 6 archivos obsoletos: `carta_blanca.test.js`, `test_carta_blanca_inventory.js` (tests de sistemas de combate/inventario IA eliminados), `characterProgressionService.js` (servicio sin uso, XP deshabilitada), `classes.js` y `races.js` (catálogos antiguos reemplazados por `src/data/clases.js` y `src/config/characterConfig.js` con 21 razas canon) y `COMBATSISTEM.md` (borrador).
- Conservados como histórico: `combat_systems_archive.zip`, `PLAN_stats_magicas.md` y `fase3_purga/`.

**Referencias actualizadas:**
- `.agents/AGENTS.md` y skills de opencode ahora apuntan a `RolBotV1/docs/`.
- `src/data/itemCategories/index.js`: añadido JSDoc a `getCategory` (error TS7006 oculto por el cache incremental de `tsc` quedó visible al eliminar `tsconfig.tsbuildinfo`).

**Verificación:** typecheck 0 errores, lint 0 errores nuevos en archivos tocados, 380/380 tests verdes, knip limpio, depcruise solo 3 warnings históricos.

---

## [2.3.0] - 2026-07-30

### Sistema de Ítems V2 — Tiers, Materiales, Módulos, Equipamiento y Naturalezas de Daño

**Nuevas funcionalidades:**

- **Tiers (E/D/C/B/A/S/N)**: `tierConfig.js` — multiplicadores lineales (1.12x→1.84x), especiales para Contundente (1.2x→6.0x), penetración para Cortante (12%→84%).
- **Materiales**: `materialData.js` — 20 materiales en 6 categorías con 4 atributos de forja (Afilabilidad, Conducción, Resistencia, Flexibilidad) escalados por Tier.
- **WeaponModule**: naturaleza de daño (cortante/contundente/perforante), manos (1/2).
- **ArmorModule**: slot corporal, grados de cobertura (total/alta/media/ligera).
- **DurabilityModule**: absorción, `broken` (reparables) vs `destroyed` (no reparables).
- **equipmentService**: 10 slots, auto-desequipado de armas de 2 manos (marcador `__2h:`), persistencia JSONB.
- **Comandos `/equipar` y `/desequipar`** con validaciones completas.
- **Migración SQL 002**: columnas `metadata` (inventory) y `equipped_slots` (characters) con índice GIN.

**Motor de combate:**
- `calculateWeaponDamage()` — Cortante: penetra DEF según tier. Contundente: daño material ×tier. Perforante: ignora DEF, daño fijo, ATK→ASPD.
- `resolveAttackerSpeed()` — Perforante usa ATK como velocidad de estocada.
- `executeAttack()` retrocompatible con nuevo parámetro `weaponInfo` opcional.

**Tests:** 376 / 376 pasando (24 suites).

---

## [2.2.2] - 2026-07-28

### Auditoría de Código con Knip

- `knip.json`: desactiva el análisis de dependencias, incluye `scripts/` y `tests/`, y conserva `dot` como binario usado por dependency-cruiser.
- `scripts/knip-wrapper.mjs`: desactiva `oxc-parser` raw transfer para evitar la asignación fallida de un buffer de 6 GiB en Windows/Node 24.
- `src/`: elimina exports y funciones sin consumidores confirmados por el repositorio.
- `tests/message_format.test.js`: usa un `require` estático para que Knip reconozca `messageFormatUtils.js` como usado.
- Resultado: Knip sin hallazgos, sin análisis de dependencias.

---

## [2.2.1] - 2026-07-28

### Correcciones del Toolchain y Cache

- `scripts/tools-list.js`: reconoce configuraciones ESLint `.js`, `.mjs` y `.cjs`, y cuenta suites `*.test.js` además de `test_*.js`.
- `src/utils/safeQuery.js`: `cachedRead` conserva correctamente valores cacheados falsy.
- `src/core/commandRegistry.js`: carga archivos recursivos en orden determinista y evita `statSync` innecesario.
- `tests/safe_query.test.js`: añade regresión para valores `null`, `false`, `0` y cadena vacía.

---

## [2.2.0] - 2026-07-21

### Rediseño Completo del Sistema de Combate por Turnos y Formato Único de Mensaje

**Objetivo:** Rediseñar el flujo de combate RPG para operar de forma totalmente asíncrona por turnos, eliminando la ejecución automática de turnos en `/retar`, agregando submenús de reacción (`/esquivar`, `/bloquear`), garantizando 1 único mensaje formateado por evento y permitiendo el modo entrenamiento PvE en mensajes directos (DM).

#### Cambios Implementados:
- **`src/config/combatConfig.js`**:
  - Añadido enum `SESSION_STATES` (`WAITING_ACTION`, `WAITING_REACTION`, `COMPLETED`, `EXPIRED`).
- **`src/services/rpg/combatState.js`**:
  - Actualizado para inicializar sesiones en `waiting_action`.
  - Añadidas funciones `setPendingReaction`, `clearPendingReaction` e `isSessionActive` para soportar la fase de reacción del jugador.
  - Generación de identificadores de dummy únicos (`dummy_<timestamp>_<random>`) para prevenir colisiones entre combates.
- **`src/services/rpg/combatEngine.js`**:
  - Desacoplado `executeTurn` en `executeAttack`, `executeReaction` y `chooseAiReaction` manteniendo compatibilidad.
- **`src/services/rpg/combatMessages.js`**:
  - Diseñados formateadores de mensaje único (`formatCombatOpen`, `formatActionMenu`, `formatReactionPrompt`, `formatCombatStatus`) que devuelven la información del turno en una sola caja sin spam de mensajes.
- **Comandos de combate (`retar.js`, `atacar.js`, `estado.js`, `esquivar.js`, `bloquear.js`)**:
  - `/retar`: Elimina la ejecución automática de turnos. Envía un único mensaje de apertura con stats de ambos y menú de acción. Permite `/retar dummy` en mensajes privados (DM).
  - `/atacar`: Procesa el ataque del jugador, contraataque del dummy o solicitudes de reacción en un solo mensaje. Removido `groupOnly` para soporte en DM.
  - `/esquivar` y `/bloquear`: Creados nuevos comandos para que el jugador responda a ataques que superen la condición de reacción (REF/MSPD ≥ ASPD).
  - `/estado`: Eliminadas respuestas dobles/contradictorias. Muestra el estado actual y el menú de acción o submenú de reacción correspondiente en un único mensaje.
- **Pruebas unitarias**:
  - Creado `tests/combat_messages.test.js` (4 nuevas pruebas para formateadores de mensaje único).
  - Actualizado `tests/combat_engine.test.js` y `tests/combat_ai.test.js` (232/232 pruebas unitarias pasando en Vitest).

---

### Refactorización y Pulido de la Fase 2 — Sistema de Combate e Inventario

**Objetivo:** Auditar y refactorizar el código implementado por el agente secundario para garantizar el anclaje de combate al personaje (`characterId`), normalización de estadísticas y alineación con las especificaciones del plan original.

#### Cambios Implementados:
- **`src/services/rpg/combatState.js`**:
  - Refactorizado para indexar sesiones de combate por `characterId` (personaje activo) en lugar de por `userId`.
  - Añadida función `findSessionByCharacter(characterId)` para permitir la alternancia de personajes (`/switch_pj`) y combates paralelos de un mismo usuario.
  - Limpieza automática de temporizadores `setTimeout` al finalizar/expirar sesiones para prevenir fugas de memoria.
- **`src/services/rpg/combatEngine.js`**:
  - Añadido normalizador de estadísticas `normalizeStats` que soporta aliasing (`atk`/`fuerza`/`str`, `def`/`defensa`, `aspd`/`velocidad_ataque`, `ref`/`reflejos`, `mspd`/`velocidad_movimiento`).
  - Corregida la fórmula de XP según la especificación: `50 + (nivel * 2)` para el ganador y 30% para el perdedor.
- **`src/commands/rpg/combat/retar.js` & `atacar.js` & `estado.js`**:
  - Actualizados para validar y operar sobre la sesión del personaje activo (`activeChar.id`).
  - Añadida sugerencia amigable de `/switch_pj <nombre>` cuando el usuario intenta responder a un combate con un personaje activo diferente al que está en batalla.
  - Sincronización de HP y asignación de XP en Supabase al finalizar la batalla.
- **`src/services/rpg/inventoryService.js`**:
  - `useItem` sincroniza inmediatamente la curación con la sesión activa en memoria si el personaje se encuentra en combate.
- **Pruebas y Grafo**:
  - Actualizado `tests/combat_engine.test.js` (225/225 pruebas unitarias pasando en Vitest).
  - Grafo AST actualizado con Graphify (`951 nodos, 2108 bordes`).

---

## [2.0.1] - 2026-07-11

### Operativización de Graphify como Herramienta Central

**Objetivo:** Integrar Graphify como herramienta obligatoria para todo análisis, búsqueda, auditoría y guía del código.

#### Normativas creadas:
- **`c:\IA_rolbot\.agents\AGENTS.md`**: Reescritura completa con 7 secciones de normativas Graphify (Consulta Pre-Acción, Actualización Post-Modificación, Análisis/Auditoría, Búsqueda Guiada, Integridad, Reglas Operativas, Referencia de Comandos)
- **`c:\IA_rolbot\RolBotV1\AGENTS.md`**: Actualización con reglas específicas del proyecto complementarias

#### Grafo actualizado:
- Actualización incremental: 92 archivos nuevos/modificados, 74 eliminados (523 nodos podados)
- Resultado final: **1408 nodos, 2251 edges, 124 comunidades etiquetadas**
- Health check: OK (0 errores de integridad)
- Costo: 0 tokens LLM (extracción AST pura)

#### Archivos modificados:
- `c:\IA_rolbot\.agents\AGENTS.md` — Normativa exhaustiva de Graphify
- `c:\IA_rolbot\RolBotV1\AGENTS.md` — Reglas específicas del proyecto
- `graphify-out/graph.json` — Grafo actualizado
- `graphify-out/GRAPH_REPORT.md` — Reporte regenerado con 124 community labels
- `graphify-out/graph.html` — Visualización HTML regenerada
- `graphify-out/.graphify_labels.json` — Etiquetas de comunidades

#### Decisiones técnicas:
- Hook post-commit ya instalado (se verificó que estaba activo)
- Normativa consolidada en workspace root (`c:\IA_rolbot\.agents\AGENTS.md`) por ser la que Antigravity lee siempre
- RolBotV1 AGENTS.md mantiene referencia local para herramientas de terceros

---

## [2.0.0] - 2026-07-11

### Rediseño Completo del Sistema de Combate Táctico por Comandos (D20)

#### Tareas Completadas
- **Fase 1: Núcleo del Motor (Services)**
  - Reescritura de `src/config/rpg.config.js` para adaptarlo a estadísticas de combate D20 (1-20) y mapeo de reacciones emoji para WhatsApp.
  - Reescritura de `src/services/rpg/combatEngine.js` implementando la lógica matemática determinista D20 (sin arbitraje de IA, sin rol descriptivo literario).
  - Reescritura de `src/services/rpg/combatStateManager.js` para utilizar la nueva ficha táctica con los slots de inventario, efectos activos, habilidades, XP y nivel, limitando los 6 atributos al rango [1, 20].
  - Reescritura de `src/services/rpg/combatTurnManager.js` para auto-resolver turnos de NPCs de forma inline y agrupar toda la resolución del turno en una sola respuesta visual en WhatsApp, incluyendo menciones `@JID` para notificaciones push.
- **Fase 2: Comandos Tácticos**
  - Reescritura de `atacar.js` para iniciar combates PvE/PvP y realizar ataques usando el nuevo sistema D20 y reacciones emoji.
  - Creación de `esquivar.js` (atajo `.e`) para preparar esquiva en base a Reflejos con críticos/pifias tácticas.
  - Creación de `bloquear.js` (atajo `.b`) para reducir daño en base a Resistencia Física con críticos/pifias.
  - Reescritura de `usar.js` (atajo `.u`) para consumir pociones/ítems usando dados D20 en combate.
  - Creación de `habilidad.js` (atajo `.h`) para ejecutar habilidades activas escaladas por Dominio Mágico.
  - Actualización de `combate.js` para mostrar el status del combate con barras HP unicode compactas.
  - Simplificación de `rendirse.js` para permitir la rendición directa en PvE y PvP.
- **Fase 3: Limpieza y Archivo**
  - Traslado a `_archive/combat_obsoleto/` de todos los archivos y servicios de arbitraje de IA obsoletos (`combatRefereeService.js`, `combatParser.js`, `combatValidator.js`, `combatNarrator.js`, `narrativePrompts/`, `combatBuffer.js`, `sceneCache.js`, `narratorOutputValidator.js`, `worldLore.js`, `ruleEngine.js`).
  - Eliminación de comandos huérfanos/obsoletos: `rol.js` y `duel.js`.
- **Fase 4: Base de Datos de Enemigos**
  - Reescritura de `src/services/rpg/enemies.js` adaptando a todos los NPCs (Slime, Goblin, Lobo, etc.) al nuevo sistema de 6 atributos [1, 20] y eliminando atributos de MP obsoletos.
- **Fase 5: Pruebas y Carga**
  - Reescritura completa de `tests/test_combat_engine_core.js` y `tests/test_combat_commands.js` para adaptarlos a la nueva interfaz D20. Ambos tests unitarios pasan al 100% (21/21 y 15/15 pruebas exitosas).
  - Verificación de la inicialización y carga recursiva del bot (46 comandos y 108 aliases cargados correctamente).

#### Archivos Creados/Reescritos
- **Nuevos/Modificados:**
  - [rpg.config.js](file:///c:/IA_rolbot/RolBotV1/src/config/rpg.config.js)
  - [combatEngine.js](file:///c:/IA_rolbot/RolBotV1/src/services/rpg/combatEngine.js)
  - [combatStateManager.js](file:///c:/IA_rolbot/RolBotV1/src/services/rpg/combatStateManager.js)
  - [combatTurnManager.js](file:///c:/IA_rolbot/RolBotV1/src/services/rpg/combatTurnManager.js)
  - [enemies.js](file:///c:/IA_rolbot/RolBotV1/src/services/rpg/enemies.js)
  - [atacar.js](file:///c:/IA_rolbot/RolBotV1/src/commands/rpg/combat/atacar.js)
  - [esquivar.js](file:///c:/IA_rolbot/RolBotV1/src/commands/rpg/combat/esquivar.js)
  - [bloquear.js](file:///c:/IA_rolbot/RolBotV1/src/commands/rpg/combat/bloquear.js)
  - [usar.js](file:///c:/IA_rolbot/RolBotV1/src/commands/rpg/combat/usar.js)
  - [habilidad.js](file:///c:/IA_rolbot/RolBotV1/src/commands/rpg/combat/habilidad.js)
  - [combate.js](file:///c:/IA_rolbot/RolBotV1/src/commands/rpg/combat/combate.js)
  - [rendirse.js](file:///c:/IA_rolbot/RolBotV1/src/commands/rpg/combat/rendirse.js)
- **Pruebas actualizadas:**
  - [test_combat_engine_core.js](file:///c:/IA_rolbot/RolBotV1/tests/test_combat_engine_core.js)
  - [test_combat_commands.js](file:///c:/IA_rolbot/RolBotV1/tests/test_combat_commands.js)

#### Decisiones Técnicas Clave
1. **Determinismo vs. IA:** Se eliminó por completo el pipeline de orquestación multi-modelo y prompts de LLMs para combate, haciéndolo 100% local, rápido y libre de costes de API/latencia.
2. **Escalado Lineal 500%:** La progresión se rige estrictamente por la fórmula $M(L) = 1 + (L-1) \times \frac{4}{19}$ para proyectar un incremento exacto de 5 veces en efectividad de nivel 1 a 20.
3. **Turnos Agrupados en WhatsApp:** Para optimizar la experiencia móvil, cuando un jugador ataca o realiza una acción, los turnos de todos los NPCs que le suceden se auto-resuelven inmediatamente y se muestran en una sola burbuja. Se usa mención `@JID` al final para alertar al siguiente jugador.
4. **Reacciones de Feedback rápido:** El bot reacciona usando la API oficial (`ctx.react`) a los mensajes del usuario usando emojis clave (⚔️, 🛡️, 💨, 🧪, 💥, 💀), reduciendo la necesidad de burbujas de texto redundantes.

---

## [3.0.0] - 2026-07-14

### Fases 0-5: Auditoría, Rescate, Portabilidad, CI/CD, Refactor, Rendimiento y Documentación

#### 🔴 FASE 0 — RESCATE (Seguridad)
- **0.1:** `.env.example` creado con placeholders de todas las variables (SUPABASE, GITHUB_PAT, OWNER_PHONE, OWNER_ALIASES). Las keys reales deben rotarse manualmente.
- **0.2:** PII telefónica (`15550000000`) movida de `permissionsConfig.js:4` a env var `OWNER_PHONE`.
- **0.3:** `supabase.js` reemplaza placeholder silencioso por throw FATAL si no hay credenciales.
- **0.4:** `.gitignore` creado en raíz del workspace. Basura documentada para eliminación manual.
- **0.5:** `nodemon.json` ignora `ai-memory/`, `bugs/`, `graphify-out/`, `_archive/`.

#### 🟠 FASE 1 — PORTABILIDAD Y ESTABILIDAD
- **1.1:** NekoMemori portátil: `fileUtils.js` usa `PROJECT_ROOT` env var con fallback relativo desde `__dirname`.
- **1.2:** `opencode.json` portable: rutas Windows reemplazadas por `{env:VAR}`.
- **1.3:** Atomic writes + mutex en NekoMemori: `withLock()` basado en promesas + atomic rename a `.tmp`.
- **1.4:** BUG-004 corregido: `lastActionAt` solo se actualiza en turno válido.
- **1.5:** Cleanup de rooms expiradas (TTL 5min, max 100 rooms) en `combatStateManager.js`.

#### 🟡 FASE 2 — CI/CD Y AUTOMATIZACIÓN
- **2.1:** CI workflow mejorado con `npm run test:vite` en `.github/workflows/ci.yml`.
- **2.2:** ESLint: `no-console: warn`, `no-empty` sin `allowEmptyCatch`.

#### 🟢 FASE 3 — REFACTOR Y DEUDA TÉCNICA
- **3.1:** `knip.json` limpiado (archivos eliminados ya no referenciados).
- **3.2:** `abilityEngine.applyEffect` refactorizado: 233 líneas → 14 dispatch functions independientes (`effectDamageMultiplier`, `effectHealPercent`, `effectBuff`, etc.).
- **3.3:** `console.log` duplicado eliminado de `commandHandler.js:133`.
- **3.5:** `resultUtils.js` creado con `fail()`, `ok()`, `isError()`, `unwrap()`. Migrados `inventoryService.js` (17 ocurrencias) y `combatEngine.js` (2).
- **3.6:** Saltado por decisión del usuario (`bot_auth_state` con `session_id` es suficiente).

#### 🔵 FASE 4 — RENDIMIENTO Y OPTIMIZACIÓN
- **4.2:** `listUserProfiles` acepta `{ offset, limit }` con `.range()` de Supabase.
- **4.3:** `getTopBalances` usa `ORDER BY money DESC LIMIT X` directo en SQL (antes: `SELECT *` + sort en JS).
- **4.4:** Cache `EQUIP_BONUSES_CACHE` ya existente en `inventoryService.js` — documentado.
- **4.5:** NekoMemori indexado: stats pre-computados en `rolbot-memory-stats.json`. `get_memory_stats` ya no parsea el JSONL completo.

#### 📘 FASE 5 — DOCUMENTACIÓN Y EXTENSIBILIDAD
- **5.1:** README reescrito con arquitectura, MCP, toolchain, estado del proyecto y knowledge graph.
- **5.2:** JSDoc añadido a todas las funciones exportadas en `resultUtils.js`, `abilityEngine.js`, `combatEngine.js`, `inventoryService.js`.
- **5.3:** Capa IA eliminada (verificada: 0 archivos residuales de providers, orchestrator, referee). El proyecto es 100% code-only.
- **5.4:** Script `npm run tools:list` creado (pre-flight check de herramientas, skills, tests, MCPs).
- **5.5:** Skills de Antigravity migrados a `.opencode/skills/` adaptados a opencode (tool names, rutas relativas, graphify).
- **5.6:** Este changelog actualizado.

#### Archivos modificados (principales)
- `src/config/permissionsConfig.js` — PII a env var
- `src/database/supabase.js` — FATAL en lugar de placeholder
- `src/services/rpg/abilityEngine.js` — Refactor completo + JSDoc
- `src/services/rpg/combatEngine.js` — JSDoc + `fail()` de resultUtils
- `src/services/rpg/inventoryService.js` — JSDoc + `fail()` de resultUtils
- `src/services/rpg/combatTurnManager.js` — BUG-004 fix
- `src/services/rpg/combatStateManager.js` — Cleanup TTL
- `src/services/userService.js` — Paginación con range()
- `src/services/economyService.js` — SQL directo en getTopBalances
- `src/core/commandHandler.js` — console.log eliminado
- `src/utils/resultUtils.js` — Nuevo helper de errores
- `mcp_nekomemori/utils/fileUtils.js` — Portabilidad + atomic writes + stats index
- `mcp_nekomemori/tools/memory.js` — Stats index
- `opencode.json` — Rutas portables
- `eslint.config.js` — no-console, no-empty rules
- `.github/workflows/ci.yml` — test:vite añadido
- `package.json` — tools:list script
- `scripts/tools-list.js` — Nuevo pre-flight check
- `.opencode/skills/` — 3 skills migrados de Antigravity
- `AUDITORIA_COMPLETA.md` — Auditoría viva actualizada
- `README.md` — Reescrito completo
- `AI_CHANGELOG.md` — Esta entrada

---

## [3.2.0] - 2026-07-23

### Refactor Completo del Sistema de Estadísticas (HP, Stats Base, Fórmula DEF)

**Objetivo:** Eliminar mecánicas de % de HP obsoletas, convertir HP en un stat leveleable, unificar stats base=1 y reemplazar la fórmula de daño cuadrática por una fórmula DEF basada en `ATK × (100/(100+DEF))`.

#### Fase 1 — Eliminar HP % Mechanics
- **`src/config/characterConfig.js`**: Eliminados `HP_THRESHOLDS`, `getHpState` y su exportación.
- **`src/services/rpg/combatEngine.js`**: Eliminada penalización por HP en `applyPenalties`.
- **`src/services/characterService.js`**: Eliminada penalización HP en `getCombatStats`.
- **`src/utils/characterFormatUtils.js`**: Eliminado `formatHpState` con estados de color (verde/amarillo/rojo).
- **Tests**: Eliminados 11 tests de HP thresholds/states (304 → 293).

#### Fase 2 — HP como Stat Leveleable
- **`src/config/characterConfig.js`**: `HP` añadido a `LEVELABLE_STATS` (9 stats, icon ❤️); `DEFAULT_CHARACTER_STATS.hp = 1`; 21 razas actualizadas con `hp` en `baseStats` (suma 50 pts c/u, HP range: 4-Elfo → 10-Oni).
- **Consumer code**: `crear_pj.js` → `hp_actual = finalStats.hp`; `setHp()` clamp a `stats.hp`; `restaurarHp()` obtiene max desde stats; `distribuirPunto()` no modifica `hp_actual`; `useItem()` tope en `stats.hp`; `normalizeCharacterRecord` clamp a `stats.hp`; `formatCharacter` barra usa `stats.hp`.
- **`src/services/rpg/combatMessages.js`**: `buildHpBar` usa `character.stats.hp` como max.
- **`src/services/rpg/combatState.js`**: Dummy HP basado en `totalPoints`.
- **Tests**: 26 tests de config validan 9 stats, DEFAULT=1, race sums=50.

#### Fase 3 — Stats Base = 1
- **`src/config/characterConfig.js`**: Todos los `DEFAULT_CHARACTER_STATS` en 1.
- **`src/services/rpg/combatEngine.js`**: `normalizeStats` defaults `?? 1`.
- **Tests**: Actualizados asserts de DEFAULT_CHARACTER_STATS.

#### Fase 4 — Nueva Fórmula DEF
- **`src/services/rpg/combatEngine.js`**: `calculateDamage` reemplazado: `Math.floor(atk × 100 / (100 + def))`.
- **Tests**: Valor esperado actualizado (ATK=50, DEF=50 → 33).

#### Limpieza de Código
- **`src/services/rpg/combatState.js`**: Eliminado import no usado de `HP_MAX`.
- **`src/utils/boxUtils.js`**: Eliminada constante `LINE` no usada.
- **`scripts/simulate_combat/fighterGenerator.js`**: Eliminado `HP_MAX` import, fighters usan `race.baseStats.hp`.

#### Archivos modificados:
- `src/config/characterConfig.js` — HP_THRESHOLDS/getHpState removidos, HP en LEVELABLE_STATS y razas
- `src/services/rpg/combatEngine.js` — Penalización HP removida, fórmula DEF nueva
- `src/services/rpg/combatState.js` — HP_MAX import removido
- `src/services/rpg/combatMessages.js` — HP bar usa stats.hp
- `src/services/rpg/inventoryService.js` — useItem tope en stats.hp
- `src/services/characterService.js` — HP penalty removido, setHp/restaurarHp/useItem actualizados
- `src/utils/characterFormatUtils.js` — formatHpState sin state name
- `src/utils/boxUtils.js` — LINE removida
- `scripts/simulate_combat/fighterGenerator.js` — HP desde race.baseStats
- `tests/character_config.test.js` — 9 stats, DEFAULT=1, race sums=50
- `tests/combat_engine.test.js` — Nueva fórmula DEF, sin HP penalty
- `tests/character_format.test.js` — Tests de HP state removidos

---

## [3.1.0] - 2026-07-21

### Auditoría de Salubridad y Mantenimiento de Limpieza (Recomendaciones 1 y 2 Aplicadas)

#### Tareas Completadas
- **Recomendación 1 — Higiene de Tests Obsoletos:** Se archivaron `tests/carta_blanca.test.js` y `tests/test_carta_blanca_inventory.js` en `_archive/` (probaban sistemas de combate de IA e inventario obsoletos y eliminados).
- **Recomendación 2 — Purga de Código Muerto:** 
  - Se movió `src/services/characterProgressionService.js` (233 líneas de servicio no utilizado) a `_archive/characterProgressionService.js`.
  - Se eliminaron las importaciones no utilizadas (`formatFeedback`, `buildFeedbackBody`, `compactLines`) en `src/utils/messageFormatUtils.js`.
- **Formateo completo:** Se corrigieron 5 archivos `.js` con problemas de formato según Prettier (`npm run format`).
- **Actualización de problemas conocidos:** Se marcó `KI-001` en `memory/known_issues.md` como resuelto.
- **Verificación Completa:** `npm run check:all` finalizó 100% verde (0 errores de ESLint, 0 errores de TypeScript, 10/10 test files y 191/191 tests pasados en Vitest).
- **Actualización del Grafo:** `graphify:update` completado exitosamente (853 nodos, 1845 edges, 63 comunidades).

#### Archivos modificados/archivados:
- `tests/carta_blanca.test.js` ➔ Movido a `_archive/`
- `tests/test_carta_blanca_inventory.js` ➔ Movido a `_archive/`
- `src/services/characterProgressionService.js` ➔ Movido a `_archive/`
- `src/utils/messageFormatUtils.js` ➔ Limpieza de imports no usados
- `memory/known_issues.md` ➔ Mover KI-001 a resueltos
- `AI_CHANGELOG.md` ➔ Esta entrada
