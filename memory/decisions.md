# Decisiones Técnicas

Registro de decisiones arquitectónicas y técnicas. Formato: fecha + contexto + decisión + alternativas.

---

## 2026-08-18 — Sistema Simplificado de Hechizos (reemplaza la taxonomía Fase D)

**Contexto**: El árbol de forja Fase D (naturaleza → rol → activación/momento → efectos) era expresable pero difícil de resolver en el motor (los efectos viajan en el payload sin handlers reales). Para reducir la complejidad de desarrollo se sacrifica variabilidad: 4 ejes fijos pequeños + registro extensible de efectos.

**Decisión**: Nueva taxonomía en `src/config/spellTree.js` (fuente única, re-exportada por `combatBalance.js` para retrocompat): (1) **tipo de hechizo** `SPELL_KINDS` (proyectil/explosion/barrera/buffo/aura); (2) **aplicación** `SPELL_APPLICATIONS` (propia/externa); (3) **naturaleza** `SPELL_NATURES` (elemental agua/fuego/tierra/aire/hielo/**electro**; primordial luz/oscuridad/caos; `FULGOR_NATURES` = 9 totales, TODO hechizo referencia una, nunca nula); (4) **registro de efectos** `EFFECT_DEFS` (datos: id/label/description/compatibleKinds/compatibleApplications/duration/stackable/handler=null). Resolver declarativo `src/services/rpg/spellEffects.js`: despacha por `tipo` a un handler o devuelve `{ pending: true }`. **Reacciones elementales**: se mantienen, gobernadas por `ELEMENT_PERSISTENCE` (imbuición = aura pasiva; `baseTurnos`, mismo elemento refresca, sin reacción reemplaza) y la tabla `ELEMENT_REACTIONS` (`${pasivo}@${dominante}`), consultada por `resolveElementReaction(ctx, dominante)`. **Tabla de 40 pares teóricos → 39 reacciones definidas** (2026-08-18): (a) geo siempre cristalizado en ambos órdenes, el orden NO cambia la reacción pero SÍ el daño (geo dominante > geo pasivo); (b) `tierra@aire` excluida: geo y anemo no reaccionan entre sí; (c) anemo no persistente → solo dominante (`X@aire` = torbellino); (d) primordiales solo dominante contra elementales, nunca entre sí (una reacción por primordial); (e) núcleo fuego/hielo/agua/electro con ciclo de dominancia fuego > hielo > agua > electro > fuego (cambia la reacción por orden) y 2 parejas neutras (fuego-agua = vaporizado, hielo-electro = super conductor) que dan la misma reacción en ambas direcciones. La semántica numérica (`canal`, estados) se implementa en Fase 4 junto a `combatState` (estado de imbuición).

**Alternativas descartadas**: mantener los roles/activaciones/momentos de Fase D (más ejes que sostener y validar); implementar los efectos en esta fase (viola el plan: primero el sistema que los soporta, luego los handlers).

---

## 2026-08-11 — Equipamiento de mago Fase C: focos con obsolescencia, catálogo arcano y reglas 2h

**Contexto**: La Fase B construía hechizos y los hacía lanzar al dummy, pero faltaba el equipamiento de mago (focos/túnicas/artefactos) y la palanca de obsolescencia del canal mágico (P2: el foco caduca, la habilidad no).

**Decisión**: (1) `focus.js` como módulo de ítem (`static type = "focus"`, `triggers = ["Attack"]`) con config `{ slotHeld: "2h"|"1h", spellIds, canalizeScale }`; registrado en `itemCategories/index.js`. (2) `itemStatService.getSpellStats` → `canalizeBase = max(1, round(canalizeScale × conduccion_magica / EDGE_SCALE))` (espejo de `baseDamage`, la conducción del material ya escala por tier vía `getMaterialStats`). (3) `combatEngine` naturaleza `mágico`: `raw = FULGOR_ATK_SCALE × fulgor + canalizeBase`, mitigado por `r_fulgor`; `canalizeScale` multiplica como palanca fina. El término plano vive en el foco (obsolescencia P2/R2), no en la habilidad. (4) `equipmentService`: `EQUIPMENT_SLOTS` acepta `focus` en ambas manos, `resolveDefaultSlot` lo manda a `mano_der`, `equipItem` detecta 2h vía `focus.slotHeld` y marca `mano_izq` con `__2h:`. (5) `resolveAttackerWeapon` reconoce el módulo `focus`: resuelve el primer hechizo cargado del catálogo (o devuelve null → desarmado si no hay ninguno, C.5). (6) `arcaneFamily.js` con catálogo completo: `baculo_de_roble` (focus 2h → Doom), `varita_de_caoba` (focus 1h), `tunica_de_mago` (armor pecho + buff `d_fulgor`), `amuleto_de_fulgor` (artifact + buff `fulgor`) y `grimorio_de_tapa_negra` (special, no equipable — C.5).

**Alternativas descartadas**: dar el término plano al hechizo (rompe P2: la habilidad no tiene obsolescencia, el material sí); multiplicar solo por `canalizeScale` sin término plano (el foco perdería la palanca de obsolescencia del material); buscar el hechizo solo entre el equipo equipado (los hechizos son del catálogo, no se equipan directamente).

---

**Contexto**: Para validar el canal mágico de extremo a extremo hacía falta construir hechizos (backend) y que el dummy PvE los equipara y lanzara (caso "Doom": 1 hit cryo + 5 hits pyro). No existía ni la construcción ni el lanzamiento.

**Decisión**: (1) `spell.js` como módulo de ítem (`static type = "spell"`, `triggers = ["Attack"]`) que emite payload con `elements`, `hits[]` ordenados, `fulgorCost`, `spellNature` (`mágico|objeto`); registrado en `itemCategories/index.js`. (2) `skillForgeService.js` POCO puro: `validateSpellRecipe` (elementos ∈ tabla base hydro/pyro/geo/anemo/electro/cryo, `hits.length ≥ 1`, `≤ MAX_HITS_PER_SPELL`, `fulgorCost > 0`, `spellNature` válida), `buildSpellDefinition` (ItemDefinition tipo `spell` vía `createItemDefinition`), `refineSpell` (sube magnitude, baja coste, sube alcance — progresión sin obsolescencia §11.5.5) y `fingerprintSpell` (sha1 de elementos+hits+naturaleza+coste normalizados). (3) `itemFactory.js`: tipo `spell` válido y sin durabilidad. (4) Dummy mágico: `ARCANE_DUMMY_LOADOUT` + `buildDummyEquipment(loadout)` parametrizado, `generateDummyCharacter` con `minFulgor` garantizado, `resolveAttackerWeapon` reconoce el módulo `spell` (naturaleza mágico + `fulgorCost`), `dummyTurnService` aplica `getCastEfficiency` para lanzamiento diluido. (5) Semilla de catálogo `arcaneFamily.js` (Doom construido vía forja → valida el servicio con datos reales). Perillas `MAX_HITS_PER_SPELL` (10) y `MAX_ACTIVE_SKILLS` (4, §11.5.4).

**Alternativas descartadas**: duplicar el flujo de lanzamiento fuera de `executeAttack` (P7 exige reusar el motor); resolver el hechizo en `dummyTurnService` sin pasar por el resolver (habría bifurcado la resolución de equipo); encajar los hit masks con la tabla completa de reacciones elementales (diferido a Fase D, se implementa el subset del caso de prueba).

---

## 2026-08-11 — Canal mágico Fase A: naturaleza `mágico`, batería de fulgor y coste por dominio

**Contexto**: El motor de combate tenía tres naturalezas de daño físicas (`cortante`, `contundente`, `perforante`), sin canal mágico. Se diseñó el canal mágico (plan aprobado) para que los personajes con dominio mágico lancen hechizos usando stats vivas (`fulgor`/`d_fulgor`/`r_fulgor`) con espejo del canal físico (atk/def).

**Decisión**: (1) Perillas centralizadas en `combatBalance.js`: `FULGOR_ATK_SCALE` (0.8, espejo cortante), `MAGIC_DEFENSE_SCALE` (100, espejo `DAMAGE_DEFENSE_SCALE`), `DOMINIO_REF` (100), `FULGOR_COST_BASE` (10), `FULGOR_DILUTED_MIN` (0.1); corregido duplicado `DAMAGE_DEFENSE_SCALE` (error de lint pre-existente). (2) `calculateWeaponDamage` con naturaleza `mágico`: daño = `FULGOR_ATK_SCALE × fulgor_atacante × MAGIC_DEFENSE_SCALE/(MAGIC_DEFENSE_SCALE + r_fulgor_defensor)`, piso `DAMAGE_MIN`, sin término plano; `weaponInfo.damageNature === "mágico"` activa el canal. (3) `combatState.resolveSessionFulgor` inicializa la batería de fulgor (default 0, nunca negativo) y `createSession` la siembra en ambos lados. (4) `fatigueEngine.getCastCost(dominio)` reduce el coste con piso `FULGOR_COST_BASE × FULGOR_DILUTED_MIN` (nunca 0). Re-export en `combatConfig.js`.

**Alternativas descartadas**: fijar el daño mágico en el atk físico (duplica el canal físico y deja `fulgor` sin uso); mantener el coste plano (ignorar la eficiencia del dominio en el recuento de batería); permitir coste 0 en dominio alto (rompe la decisión R6 "el dominio no es daño directo").

---

## 2026-08-03 — UI por secciones reutilizables + registro declarativo de acciones de combate

**Contexto**: En la segunda prueba en vivo el jugador reportó (1) que las pantallas de combate/dummy seguían mostrando emojis de ítem (prefijos de tipo 🗡️/🛡️/📿/🔨/🧵, no el campo `icon` eliminado en v2.8.0); (2) que `/ver_pj` no reflejaba el equipamiento actual; (3) que varias pantallas no mostraban comandos disponibles (p. ej. `avanzar`/`retroceder`/`esquivar`/`bloquear`) porque `formatActionMenu`/`formatReactionPrompt` los tenían hardcodeados con solo 4 acciones.

**Decisión**: (1) nueva capa `src/ui/` con `sectionBuilder.composeMessage` (compone mensajes por secciones) y secciones por dominio (`combatStats`, `combatSections`, `characterSections`, `equipmentSections`); `combatMessages`, `characterFormatUtils` e `inventario` pasan a componer desde ahí, eliminando construcción duplicada de líneas. (2) `src/data/combatActions.js`: registro declarativo `{command, label, hint?, when?}` (+`render` para reacciones) del que se generan el menú de turno y el prompt de reacción → añadir/quitar acciones actualiza la UI sin tocar el formateador. (3) `/ver_pj` resuelve el equipo con `resolveCharacterEquipment` y lo muestra en una sección EQUIPO dentro de `formatCharacter`. (4) se eliminan los prefijos de tipo de ítem restantes en `formatEquipmentSummary` y en las líneas de arma/armadura de `atacar.js`; se conservan emojis de estado (HP/fatiga) y encabezados de sección.

**Alternativas descartadas**: mantener las listas de acciones hardcodeadas y solo añadir los comandos faltantes (no resuelve la causa raíz y vuelve a desincronizarse al añadir comandos); exponer `equipped_slots` crudo en `/ver_pj` (sin el payload resuelto que ya produce `resolveCharacterEquipment` y duplica la lógica de resolución).

---

## 2026-08-03 — UX de inventario por índice + eliminación de iconos de ítems

**Contexto**: En la primera prueba en vivo (kit de hierro) el jugador reportó que los comandos de inventario eran incómodos (había que recordar ids técnicos y slots) y que los emojis `icon` de los ítems ("stickers") añadían ruido. Además, el personaje podía iniciar un combate con 0 HP si había quedado con 0 de un combate anterior.

**Decisión**: (1) Listado numerado en `/inventario` y selección por índice en `/equipar`/`/usar`; (2) slot automático por categoría (`resolveDefaultSlot` en `equipmentService`) y aliases de slot (`normalizeSlot`/`SLOT_ALIASES`); (3) eliminar el campo `icon` de las definiciones de ítem y de todas las salidas de texto (los emojis de UI/sección y los iconos de stats se conservan); (4) `resolveSessionHp` en `combatState` garantiza HP inicial > 0 (si el persistido es 0/inválido usa el máximo).

**Alternativas descartadas**: Mantener ids técnicos y solo añadir el índice (no resolvía la fricción del slot); conservar `icon` en definiciones y solo ocultarlo en pantalla (deja el dato huérfano y obliga a dos fuentes de verdad; se prefirió eliminarlo y actualizar tests/entidad).

## 2026-08-03 — Persistencia de equipamiento: columna `equipped_slots`

**Contexto**: El sistema de equipamiento (`equipmentService.js`) escribía en `characters.equipped_slots`, columna inexistente en Supabase → `/equipar` y `/desequipar` fallaban. Existía la alternativa de reutilizar la columna `slots` existente.

**Decisión**: Aplicar la migración 002/003 tal como estaba diseñada: nueva columna JSONB `characters.equipped_slots`. Mantiene la intención original, separa responsabilidad de los estados de personaje (`slots`) y coincide con la documentación.

**Alternativas descartadas**: Refactor a `slots` JSONB (requería migración de datos y desacople de la especificación).

---

## 2026-08-03 — Aplicación de DDL: script SQL manual (no RPC `exec_sql`)

**Contexto**: `schemaMigration.createMissingTables()` dependía de un RPC `exec_sql` inexistente, por lo que las migraciones no se aplicaban solas (incluso `combat_sessions` no se creaba).

**Decisión**: Aplicar las migraciones pendientes mediante **script SQL manual** (idempotente) en el SQL Editor de Supabase, y documentar en `src/database/migrations/003_remediation_item_equipment.sql`. No crear un RPC `exec_sql` con `security definer`.

**Motivo**: Evitar exponer ejecución de SQL arbitrario al cliente `service_role` (superficie de ataque). El archivo SQL queda versionado y reproducible como DDL canónico.

## 2026-08-03 — Fuente única de versión de schema

**Contexto**: `schemaVersion.js` (2.0.0) y `schemaMigration.js` (2.1.0) tenían `CURRENT_VERSION` duplicados y desincronizados.

**Decisión**: Centralizar en `src/database/schemaConstants.js` (`CURRENT_VERSION = "2.2.0"`), importado por ambos módulos. Única fuente de verdad.

## 2026-08-03 — Capa de sistema gestor de ítems (infraestructura, sin catálogo)

**Contexto**: El motor (fórmulas `combatEngine`, materiales, módulos) existía, pero no había una capa que construyera/validara definiciones genéricas, resolviera equipo → payload de combate, ni persistiera durabilidad. El plan `item_system_engine.md` aprobado: construir la *mecánica*, no crear ítems.

**Decisión**: Introducir servicios puros — `itemFactory` (definición+metadata), `itemStatService` (base × tier × material), `equipmentResolverService` (equipped_slots ↔ inventory.metadata), `durabilityPersistenceService` (persistencia de desgaste), `armorSetService` (cobertura+sets) — con catálogo inyectable `itemCatalog` (vacío) y fixtures sintéticos en `tests/`. Integración combate mínima en `atacar.js` con fallback binario a desarmado/sin armadura.

**Alternativas descartadas**: Reutilizar `itemService/createItem` como única capa (mezclaba instanciación y normalidad); persistir durabilidad en memoria (perdía estado entre reinicios).

## 2026-08-03 — Integración combate: solo ataque principal (backward-compat)

**Contexto**: `descansar.js`/`huir.js` y las reacciones `esquivar/bloquear` también procesan contraataques donde no se resolvía arma/armadura.

**Decisión**: Cablear equipo sólo en `atacar.js` (ataque principal PvE/PvP) con fallback silencioso. Los contraataques de descansar/huir y la absorción en reacciones quedan sin arma/armadura (backward-compat), registrado como **TD-005** para más adelante sobre reacciones multi-pieza.

## 2026-08-03 — Familia del Hierro: puente de catálogo

**Contexto**: Para crear los primeros ítems (arma, set de armadura, artefacto y arma arrojadiza) hacía falta que el sistema real (equipo/resolver/inventario) viera las definiciones del `itemCatalog` inyectable, que estaba vacío.

**Decisión**: (1) `getItem` en `src/data/items.js` ahora cruza al `itemCatalog` (`ITEMS[id] || itemCatalog.load(id)`), un único seam de integración; `getItemsByCategory` se mantiene sobre el catálogo base. (2) Nuevo tipo `throwable` en la factory (arma arrojadiza no equipable: categoría no aceptada por `EQUIPMENT_SLOTS`, apilable, sin durabilidad persistente) con módulo `throwable` propio y trigger `Throw`/`Use`.

**Alternativas descartadas**: Añadir los ítems directamente a `ITEMS` (rompía la separación catálogo-inyectable/base y las consultas por categoría); reutilizar `weapon` para el arrojadizo (habría permitido equiparlo).
## 2026-08-03 � Dummy equipado y equipo en memoria (PvE)

**Contexto**: Para que los combates de prueba mostraran los �tems del hierro sin depender de filas DB, el dummy necesitaba equipo resoluble por el sistema real, y la UI deb�a reflejar el equipo de ambos bandos.

**Decisi�n**: (1) dummyEquipment en memoria con la misma forma que getEquippedItems; getEquippedItems/esolveDefenderArmor aceptan personaje o id y resuelven el dummy sin DB. (2) esolveCharacterEquipment produce el resumen de UI; ormatCombatOpen/ormatCombatStatus reciben equipmentMap. (3) El contraataque del dummy resuelve su arma (ya no es desarmado). (4) Kit de hierro sembrado por ensureIronFamilyKit al retar al dummy; �tems reales que persisten tras el combate (no temporales).

**Alternativas descartadas**: Crear filas DB para el dummy (contaminaba inventory/characters y requer�a limpieza); embeder el equipo en el mensaje (duplicaba l�gica de resoluci�n).
