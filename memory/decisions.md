# Decisiones Técnicas

Registro de decisiones arquitectónicas y técnicas. Formato: fecha + contexto + decisión + alternativas.

---

## 2026-08-22 — Convención de Nombres de Ítems y Heredabilidad de Tier en Crafteo

**Contexto**: Con la incorporación de las familias de todos los materiales al catálogo oficial, se definió la convención de nombres para ítems regulares y la regla de derivación de Tier para el futuro sistema de crafteo.

**Decisión**:
1. **Nombres de Ítems**: El estándar `[Tipo] de [Material]` (ej: *Espada de Mitril*, *Pechera de Obsidiana*) es el patrón base para las familias de materiales regulares. Los ítems únicos o especiales pueden tener nombres propios sin seguir este patrón (ej: *"Espada Maldita"*, *"Escudo de Cruz Ansata"*, *"Anillo de Calamitas"*).
2. **Crafteo y Tiers**: La calidad (Tier E, D, C, B, A, S) del objeto crafteado hereda directamente el Tier del material utilizado durante su fabricación (ej: un lingote de *Hierro Tier E* forjará una *Espada de Hierro Tier E*).

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
