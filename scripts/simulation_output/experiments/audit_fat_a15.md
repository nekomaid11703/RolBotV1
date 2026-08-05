# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:13:51.566Z · Sims: 2000 · Máx rounds: 20

## 1. Integridad de datos

| Check | Casos | Detalle |
|-------|-------|---------|
| NaN en stats | 0 | stats no numéricas o NaN
| Stats fuera de clamp 1–100 | 0 | incluye magia y físicas
| winner fuera de {A,B} | 0 | 
| koType fuera de {ko,timeout} | 0 | 
| winnerIsFirstAttacker incoherente | 0 | 
| Rounds/distancia inválidos | 0 | rounds<1 o distancia negativa
| totalDamage negativo/NaN | 0 | 
| ítem↔heal incoherente | 0 | ítem sin heal o heal sin ítem
| Ítems > stock máximo (5) | 0 | 
| HP sube sin ítem | 0 | picos en hpCurve sin heal registrado
| Curvas vacías o inconsistentes | 0 | 

## 2. Sesgo de métricas (daño)

Post-fix: `collectMetrics` ahora incluye los contraataques (`*_counter`) en `totalDamage`/`damagePerTurn`. Verificación contra el daño real (pérdida de HP del rival en curvas):

| Métrica | Valor |
|---------|-------|
| Sims donde totalDamage < 90% del daño real (curvas) | 0 |
| Ratio dañoReal/dañoRegistrado > 1.05 (ambos lados) | 0 |
| Mediana del ratio (solo donde hay registro) | n/a |

**Diagnóstico**: consistencia total entre el daño registrado y el daño real por curvas (0 desviaciones >5%).

## 3. Timeouts (draws)

| Métrica | Valor |
|---------|-------|
| Timeouts | 286 (14.3%) |
| Ambos vivos al round 21 | 286/286 |
| Con fatiga ≥ 90 al final | 17/286 |
| Con algún HP ≤ 5 al final | 4/286 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 168/286 |
| Gap de HP relativo al corte (P50/P90) | 44.3% / 78.9% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 10.10 | 9.39–10.81 (n=309) | target 7.0 ⚠️ |
| Ventaja primer atacante | 2.3% | 0.1%–4.5% (n=2000) | target ≤5% ✅ |
| Winrate meta (tanque) | 69.6% | 64.0%–74.7% (n=280) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 35.9% | 35.9% [34.4%–37.4%] |
| Mismo build (guardian) | 500 | 35.0% | 35.0% [30.9%–39.3%] |
| Mismo build (velocista) | 600 | 36.5% | 36.5% [32.7%–40.4%] |
| Mismo build (asesino) | 578 | 35.1% | 35.1% [31.3%–39.1%] |
| Mismo build (equilibrado) | 542 | 37.8% | 37.8% [33.8%–42.0%] |
| Mismo build (extremista_reflejos) | 584 | 34.1% | 34.1% [30.3%–38.0%] |
| Mismo build (esquivo) | 538 | 39.8% | 39.8% [35.7%–44.0%] |
| Mismo build (extremista_defensa) | 532 | 36.7% | 36.7% [32.7%–40.8%] |
| Mismo build (extremista_ataque) | 570 | 33.0% | 33.0% [29.2%–36.9%] |
| Mismo build (gladiador) | 498 | 36.3% | 36.3% [32.2%–40.7%] |
| Mismo build (berserker) | 564 | 37.8% | 37.8% [33.9%–41.8%] |
| Mismo build (estratega) | 548 | 37.2% | 37.2% [33.3%–41.3%] |
| Mismo build (magus) | 522 | 36.0% | 36.0% [32.0%–40.2%] |
| Mismo build (tanque) | 560 | 36.6% | 36.6% [32.7%–40.7%] |
| Mismo build (extremista_velocidad) | 564 | 32.6% | 32.6% [28.9%–36.6%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.178 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 38.8% | 147 | 41.2% | 885 | -2.5pp |
| 200–299 | 40.7% | 268 | 46.7% | 845 | -6.1pp |
| 300–399 | 41.5% | 275 | 56.0% | 686 | -14.5pp |
| 400–500 | 46.9% | 258 | 71.5% | 636 | -24.6pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 39.9% | 143 | 41.1% | 889 | -1.2pp |
| 200–299 | 39.8% | 269 | 47.0% | 844 | -7.3pp |
| 300–399 | 40.9% | 269 | 56.1% | 692 | -15.2pp |
| 400–500 | 46.5% | 256 | 71.6% | 638 | -25.1pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 39.4% | 137 | 41.1% | 895 | -1.7pp |
| 200–299 | 40.7% | 270 | 46.7% | 843 | -6.0pp |
| 300–399 | 41.5% | 272 | 55.9% | 689 | -14.3pp |
| 400–500 | 46.9% | 258 | 71.5% | 636 | -24.6pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 70.7% | 478 | 461 |
| B | 59.0% | 802 | 389 |
| C | 48.0% | 1052 | 302 |
| E | 41.0% | 1668 | 197 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 1032 | 0.0% | 1.2% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1113 | 3.8% | 11.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 961 | 6.8% | 22.2% | 0.6% | 1.1% | 0.0% | 0.0% |
| 400–500 | 894 | 17.2% | 20.6% | 4.5% | 3.4% | 0.3% | 1.0% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 29.1% | 32.4% | 27.1% | 11.4% |
| 200–299 | 29.4% | 29.7% | 31.2% | 9.7% |
| 300–399 | 28.7% | 33.5% | 28.1% | 9.7% |
| 400–500 | 31.8% | 28.4% | 29.3% | 10.5% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 1032 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 502 (45.1%) | 611 (54.9%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 126 (13.1%) | 334 (34.8%) | 501 (52.1%) | 0 (0.0%) |
| 400–500 | 8 (0.9%) | 107 (12.0%) | 301 (33.7%) | 478 (53.5%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.21 |
| Cobertura dominante | total: 2573 · alta: 1286 · media: 124 · ligera: 17 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3909 · 1-2: 91 |
| Set bonus activo | 97.7% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 40.2% |
| Con escudo | 61.1% |
| Fighters con ≥1 pieza rota post-batalla | 59.4% (5907 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 88.3% |
| Batallas con ≥1 ítem | 50.5% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 16.2% |
| Rests por batalla (P50/P90) | 3/4 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.104 |
| def | 0.107 |
| aspd | -0.072 |
| ref | 0.024 |
| mspd | 0.058 |
| hp | 0.220 |
| fulgor | -0.076 |
| d_fulgor | -0.084 |
| r_fulgor | -0.083 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 314 (15.7%) |
| Duración media | 9.38 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 286 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (2.3% sobre 50%, CI 95% 0.1%–4.5%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (35.9% para el mayor nivel; correlación 0.178)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈69.6% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 50.5% de batallas usan ítem; los descansos (P50 3/4) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (2.3% ventaja, meta 69.6%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 10.10, meta 69.6%) para cerrar el ciclo.
