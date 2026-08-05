# Guía de Creación de Ítems

> Versión: 1.1.0 — Reglas canónicas para crear ítems coherentes con el sistema.
> Fuente de verdad: `docs/item_system_specification.md` + código en `src/`.

## 1. Anatomía de un ítem

Un ítem se define por:

1. **Material** (`material`) — aporta 4 atributos base (`materialData.js`): afilabilidad, conducción mágica, resistencia material, flexibilidad (rango 1-100).
2. **Tier** (`tier`) — calidad del ítem, aplica multiplicador (`tierConfig.js`): E `1.12x` · D `1.24x` · C `1.36x` · B `1.48x` · A `1.60x` · S `1.72x` · N `1.84x`.
3. **Módulo** (`modules`) — define el tipo: `weapon` | `armor` | `buff` (artefactos) | `throwable` | `heal`.
4. **Set** (`setId`) — opcional; ≥3 piezas del mismo setId activan el bono definido en `armorSets.js`.

**El tier NO está ligado al tipo de ítem ni a la naturaleza de daño.** Existen espadas de hierro tier E y tier S, ambas válidas. El tier del ítem se hereda del material con el que se forja.

## 2. Fórmulas derivadas (NO inventar números)

Todas las stats finales se computan con `itemStatService.js` (base × tier × material):

| Stat | Fórmula |
|------|---------|
| `baseDamage` (arma) | `round(baseNominal × tierMult × (afilabilidad / 50))` |
| `maxResist` (armadura) | `round(resistencia_material × tierMult)` |
| `bonusDef` (armadura) | `round(maxResist / 2)` — derivado, NO configurable |
| Durabilidad inicial | `maxResist` (se consume con daño material) |

Ejemplo hierro tier E (afilabilidad 45, resistencia 55): espada nominal 20 → `round(20 × 1.12 × 0.9) = 20`; pechera → `maxResist 62`, `bonusDef 31`.

## 3. Naturalezas de daño (`combatEngine.js:288-330`)

| Naturaleza | Fórmula corporal | vs Defensa | vs Material |
|------------|------------------|------------|-------------|
| cortante | `0.8×atk + base` | penetra 12-84% según tier | normal (×1) |
| contundente | `atk × 100/(100+def)` | normal | ×1.2 a ×6.0 según tier |
| perforante | `base × tierMult` (fijo, ignora atk/def) | ignora 100% | ×0.5 |
| desarmado | `atk × 100/(100+def)` | normal | ×1 |

**Implicaciones de diseño**: perforante no escala con ATK → su progresión depende SOLO del tier del arma. Cortante/contundente escalan con ATK.

## 4. Cobertura de armadura (`armorSetService.js`)

| Cobertura | mspd | Fatiga de movimiento |
|-----------|------|----------------------|
| ligera | −10% | ×1.05 |
| media | −20% | ×1.2 |
| alta | −30% | ×1.35 |
| total | −40% | ×1.5 |

La pieza MÁS pesada del conjunto impone la regla. La cobertura NO modifica la defensa: la defensa viene de material×tier. Cobertura = trade-off de movilidad.

## 5. Slots de equipo (spec §4)

`cabeza` · `pecho` · `pantalones` · `botas` · `mano_der` (arma/escudo) · `mano_izq` (arma secundaria/escudo) · `artefacto_1..4` (anillos, amuletos, reliquias). Armas a 2 manos ocupan mano_der + mano_izq.

## 6. Set bonus (`armorSets.js`, `armorSetService.js`)

- Set = grupo de piezas con el mismo `setId` (independiente del material).
- Bono activo con **≥3 piezas** (`SET_BONUS_THRESHOLD = 3`).
- El bono es un mapa de stats, p.ej. `{ def: 10 }` (set_hierro).

## 7. Flujo de validación: simulación → juego real

1. Los ítems nuevos se definen PRIMERO en la simulación (`scripts/simulate_combat/config.js`, familia `IRON_FAMILY`) usando las fórmulas reales vía `itemStatService`.
2. La simulación valida mecánicas pendientes del motor real (buffs de artefactos, set bonuses en combate, cobertura en fatiga de movimiento, absorción de durabilidad por piezas en orden).
3. Cuando estén probados y balanceados, se implementan en `src/data/` (p.ej. `ironFamily.js`) y el motor real aplica las mecánicas validadas.

## 7.1. Resultados del re-baseline con catálogo de hierro (baseline 2000 sims)

- **Saturación de stats corregida**: la asignación de puntos es por presupuesto con soft cap (`STAT_SOFT_CAP = 75`, decay cuadrático): el jugador diversifica al acercarse al cap. Resultado: 0% saturación en brackets bajos; máx 20.5% (def, por personalidades defensivas + set bonus) en 400-500.
- **Naturalezas ≈ 1/3 cada una** en todos los brackets (objetivo cumplido).
- **Tier probabilístico 60/30/10** por bracket E/C/B/A (objetivo cumplido).
- **Ventaja del primer atacante: 2.1%** (CI −0.0%–4.3%, target ≤5%) — la cobertura modula la asimetría del costo de movimiento inicial.
- **Meta (velocista): 64.6%** — falla el target ≤55%: hallazgo del MOTOR (bono de set {def:+10} y amuleto {atk:+5} refuerzan la ventaja), no del simulador.
- **El nivel no predice victoria** (36.2% para el mayor nivel): progresión real viene del EQUIPO (tier), no de las stats.

## 7.2. Experimentos de equipamiento (16 presets × 1000 sims, `run_equipment_experiments.js`)

| Preset | Efecto medido |
|--------|---------------|
| amuleto_off → on | ATK medio 46→54, rounds 12.8→10.2, KO 96.9% — acelera el combate |
| escudo_off → on | Sin efecto significativo (rounds 12.0→12.1) — el escudo suma resistencia, no modifica el meta |
| cobertura ligera/media | Invierten la ventaja del primer atacante (48.7/47.2%) — el costo de aproximación pesa |
| cobertura alta/total | Primer atacante ≈52% — empate; combates más largos (10.9→11.6 rounds) |
| set_off → on | {def:+10} alarga combates 9.2→12.1 rounds — el bono defensivo es real y medible |
| naturaleza_estoque | La más letal: KO 98%, 8.9 rounds (perforante ignora atk/def) |
| naturaleza_maza | La más lenta: 16.8 rounds, KO 90.2% (contundente se mitiga con def) |
| tier E → A | Progresión clara: rounds 15.1→9.2 — el tier es progresión de daño, no balance |

**Conclusión**: las mecánicas de cobertura/set/amuleto/durabilidad por piezas quedan VALIDADAS en la simulación con efectos medibles y esperables. Los fallos de targets restantes provienen del motor real (tickets de balance pendientes), no del simulador.

## 8. Reglas de oro

1. Nunca definir stats planas: siempre derivar con las fórmulas de la sección 2.
2. Respetar los 7 tiers; el multiplicador de tier SIEMPRE es el de `tierConfig.js`.
3. La naturaleza de daño define la fórmula; el tier la escala.
4. La cobertura es movilidad, no defensa.
5. Un bono de set se activa con ≥3 piezas del mismo setId.
6. Lo escrito en código manda sobre esta guía.
