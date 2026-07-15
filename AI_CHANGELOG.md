# AI_CHANGELOG.md — Registro de Cambios de la IA

Este archivo registra los cambios significativos y decisiones arquitectónicas tomadas por Antigravity en la base de código.

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
