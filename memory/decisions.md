# Decisiones Técnicas

Registro de decisiones arquitectónicas y técnicas. Formato: fecha + contexto + decisión + alternativas.

---

## 2026-09-09 — B7: forja vs compra bajo P1 (tiempo vs stelas)

**Contexto**: Con el nivel de adquisición en 5, forjar parecía siempre peor que comprar; además el
precio de compra directa usaba el `basePrice` estático (desactualizado frente al modelo de tiempo).

**Decisión**: Fijar `acquisitionToolLevel=10` (coherente con la valoración) y comparar en términos
de **stelas** (no de velocidad): forjar/refinar ahorra el margen del vendedor (~15%) y cuesta ~2×
tiempo; la compra directa es la vía de conveniencia. Los tiers D+ no tienen compra directa (solo
forja). `buildForgeEconomics` gana `forgeVsBuyRatioE`, comparación de refinado y guardas
`directBuyAvailableForE` / `forgeSavesStelas` / `refiningSavesStelas`.

**Alternativas descartadas**: exigir que forjar fuera más rápido que comprar (imposible sin
distorsionar el valor del tiempo o regalar cantidad); medir con `basePrice` estático (precios viejos).

---

## 2026-09-09 — D4: cap de rareza en tiendas y precios por tier

**Contexto**: Las tiendas vendían materia prima y equipo sin un límite de rareza claro, compitiendo
con la expedición como fuente; además los trozos de tier D se cobraban con precios fijos de config,
ajenos al modelo de tiempo/valor.

**Decisión**: Cada tienda declara `rarityCap` (materia prima hasta `poco_comun`; equipo hasta
`poco_comun` salvo la herrería, que llega a `raro`). La materia prima `raro+` no se vende: es la
firma de la expedición (overlap 0). Los precios pasan a valorar por **tier** (refinado 2:1 ⇒ ×2 por
escalón, E=1…N=64) vía `pricingService`, y `shopEngineService` propaga el `metadata.tier`.
Guardas: `tests/shop_caps.test.js` y el bloque `shops` del reporte.

**Alternativas descartadas**: dejar la tienda sin cap (canibaliza la expedición); vender materia
prima rara con sobreprecio (rompe la identidad de la ruta de expedición).

---

## 2026-09-09 — Trabajos Fase 1: pago con trade-off hora/energía (sin dominados)

**Contexto**: 12 de 20 trabajos quedaban dominados (otro pagaba más por hora y por energía con menos
requisitos) y su único diferenciador era el stat entrenado; con el tope semanal, elegir empleo era
casi indiferente.

**Decisión**: Recalcular el pago con `K × √(energía × duración) × (1 + 0,8 × req/22)`. El término
`√(energía × duración)` garantiza el trade-off: trabajos densos (cortos/energéticos) pagan más por
hora; trabajos largos pagan más por energía; los requisitos elevan ambos. El stat entrenado se
mantiene como firma. Se añade la guarda `tests/job_identity.test.js`.

**Alternativas descartadas**: dejar pagos planos (empleos intercambiables); escalar por nivel (haría
del nivel la palanca de dinero y no del desempeño del trabajo).

---

## 2026-09-09 — Economía: el crecimiento de ingreso viene de herramientas/materiales, no del nivel

**Contexto**: Se detectó que los 20 trabajos son accesibles a nivel 100 (requisito máximo 22 pts) y
pagan montos planos (720-1300/día), por lo que subir de nivel no aumentaba el ingreso; el `daily`
es fijo (200) y el combate no da stelas.

**Decisión**: Mantener los trabajos como **suelo estable** (salario mínimo y multiplicadores) y que
el crecimiento económico provenga de las **herramientas/rareza** (venta de materiales) y del riesgo.
Se añade `buildEconomyReport` al reporte con el ingreso diario por cohorte (trabajos + materiales +
daily) vs coste del set de referencia, y las guardas `incomeGrowsWithProgression` /
`materialIncomeScalesWithTool`.

**Alternativas descartadas**: escalar salarios con el nivel o desbloquear trabajos por nivel (haría
del nivel una palanca de dinero y diluiría el valor de la herramienta/rareza).

---

## 2026-09-09 — B4 revisado: costes de herramienta por jornada y payback acumulado

**Contexto**: Con la curva R(L), el valor esperado por expedición casi no sube en los primeros
niveles (deltas 1-4 stelas hasta L8) y explota en L9→L10 (+285 pico). El payback "por escalón" es
inviable (100-400 expediciones) aunque la inversión total sí se amortiza.

**Decisión**: Expresar las stelas de mejora como fracción del salario mínimo diario
(0,10→0,40 de jornada) y medir B4 como **payback acumulado** al completar el nivel 10, con metas
por herramienta (pico ≤15, hacha ≤30, bolsa ≤30; mochila sin payback). El reporte usa los precios
de `pricingService` para el valor de materiales y avisa si la meta no se cumple.

**Alternativas descartadas**: mantener payback por escalón (imposible con la curva); bajar costes
para forzar ≤15 en todas (distorsiona la escalera y el valor de la rareza).

---

## 2026-09-09 — P2: salario mínimo, valor de la stela y precios por tiempo

**Contexto**: Hacía falta una vara económica única para que trabajos, `daily` y precios de tienda
sean congruentes. El `daily` máximo era 200, sin referencia clara frente a los trabajos (720-1300
por día de 100 energía).

**Decisión**: Salario mínimo = **720 stelas / 100 energía** (trabajo peor pagado) y jornada de
referencia de **120 min** → **1 minuto = 6 stelas**. Los salarios de trabajo se documentan como
múltiplos del mínimo (`MIN_WAGE_PER_ENERGY=7,2`, `wageMultiplierForJob`), sin cambiar montos. Los
precios de tienda se calculan: `precio = minutos_material(herramienta 10) × 6 × unidades_receta ×
1,15` vía `pricingService`; los ítems sin material conservan su precio. `daily` (200) = 0,28
jornadas, mantiene valor sin dominar.

**Alternativas descartadas**: basar la stela en el `daily` (1,67/min, valores ~3,6× más bajos y
con inversiones raras al valorar por nivel de referencia); hardcodear precios (menos trazable).

---

## 2026-09-09 — P2: identidad de zonas por multiplicadores de eje (sin piso de probabilidad)

**Contexto**: El modelo B8.2b usaba un piso de rareza por zona, lo que hacía que zonas de piso
alto (p. ej. Montañas con banda única poco común) regalaran materiales raros y que la herramienta
solo importara en la única zona con dos bandas.

**Decisión**: Eliminar el piso. Cada zona declara `axisWeights` (multiplicadores filo/cond/res/flex).
Una tirada: (1) sortea el eje ponderado por zona, (2) usa el nivel de la herramienta de ese eje
(`AXIS_TOOL`) para tirar la rareza con la curva completa R(L), (3) resuelve el material canónico
rareza × eje (`materialForBandAxis`). Añadir zonas nuevas = añadir `axisWeights` de lore.

**Consecuencia**: `unreachableMaterials=[]` y `blockedRequirements=[]` (las 24 combinaciones tienen
ruta); la rareza pasa a ser un problema de probabilidad/tiempo, no de acceso. Pendiente: zonas
profundas (D3), cap de rareza en tienda (D4) y calibración de precios/cantidades.
Además se retiró la **caña de pescar** por no aportar un eje material ni valor de inversión;
`pescado_fresco` queda como ítem legado sin fuente hasta un posible rediseño de pesca.

**Alternativas descartadas**: mantener pisos por zona (banda única trivializa rarezas); ponderar
solo por lista de materiales sin multiplicadores (menos control de identidad y lore).

---

## 2026-09-09 — B8.2b: rareza por herramienta (R(L)), zonas multi-banda y recalibración B5/B1

**Contexto**: El modelo anterior daba a la herramienta un bonus plano de probabilidad (`lootBonus`,
hasta ×7.1 en nivel 10), lo que no expresaba identidad de rareza. Se aprobó el modelo "banda + pool
ponderado": la zona declara piso y pool por banda, y el nivel de herramienta suaviza la curva
`P(i+1)=P(i)/R(L)` (R=16 en L1, 1.39 en L10). Al probarlo, el ROI de herramienta en stelas se
volvió no competitivo (gate D2).

**Decisión**:
1. [NEW] `rarityDropConfig` + `rarityDropService`; `expeditionConfig` con `floorRarity`/`rarityPool`;
   `activityEngineService` con tiradas por R(L); `TOOL_UPGRADE_COSTS` sin `lootBonus`; reporte con
   guardas 16:1/1:16 y fuentes por banda.
2. **D2 reframe**: el payback B4 ≤10 expediciones se suspende como criterio; queda como métrica
   informativa y las mejoras se miden por acceso a rareza (recalibración fina en P2).
3. **B5/B1 recalibrados** para cap Nivel 500 en ~90 días jugando 2 h (regular 4 combates + ~20% XP
   de actividades): curva ×0.262 (≈450 victorias equivalentes), `jobShareBase 0.1`,
   `expeditionShareBase 0.8`.
4. **Anclaje material↔nivel**: `MATERIAL_LEVEL_ANCHOR` con f=0.35 (DEF del set ≈ 35% del
   presupuesto): común 150, poco 200, raro 300, épico 400, legendario/mítico 500; `ANCHOR_POLICY`
   (2 h/día, 4 combates, 3 expediciones) y `materialAnchors` en el reporte.

**Alternativas descartadas**: mantener el bonus plano (sin identidad de rareza); forzar ROI ≤10
subiendo precios/cantidades en este paso (se pospone a P2 con las métricas de anclaje).

---

## 2026-09-09 — Gate D1: la familia legacy de hierro se migra por completo al canon (acero)

**Contexto**: El canon B8 dejó `material:"hierro"` fuera de `materialData`, pero `ironFamily.js`
seguía registrando `espada_de_hierro`, `set_hierro`, etc., que resolvían stats por el fallback
silencioso a `madera` (`getMaterialStats`). `materialFamilies` ya genera la familia canónica de
acero, por lo que ambas convivían como duplicados (misma rareza/eje filo) con nombres fuera de canon.

**Decisión**: Canon completo — eliminar `ironFamily.js` y sus registros, remapear en DB (migración
`007_hierro_to_acero.sql` sobre `inventory` y `characters.equipped_slots`) de los 7 ids legacy a sus
equivalentes `*_de_acero`, redefinir el set en `armorSets` como `set_acero`, generar `kunai_*` como
throwable para todos los materiales, apuntar la flecha por defecto a `flechas_de_acero` y hacer
`getMaterialStats` estricto (error si el material no es canon). Se añadió la guarda
`tests/reference_integrity.test.js`.

**Alternativas descartadas**: mantener ids legacy con alias `hierro→acero` en `getMaterialStats`
(deja dos familias paralelas con stats idénticas y nombres que mienten sobre el canon); renombrar
solo algunos ítems sin migrar `equipped_slots`.

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
