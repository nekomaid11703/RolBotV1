# Decisiones Técnicas

Registro de decisiones arquitectónicas y técnicas. Formato: fecha + contexto + decisión + alternativas.

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
