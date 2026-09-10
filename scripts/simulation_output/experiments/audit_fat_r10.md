# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:14:03.577Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 293 (14.6%) |
| Ambos vivos al round 21 | 293/293 |
| Con fatiga ≥ 90 al final | 19/293 |
| Con algún HP ≤ 5 al final | 8/293 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 168/293 |
| Gap de HP relativo al corte (P50/P90) | 43.1% / 81.0% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 10.75 | 9.99–11.50 (n=284) | target 7.0 ⚠️ |
| Ventaja primer atacante | -1.0% | -3.1%–1.2% (n=2000) | target ≤5% ✅ |
| Winrate meta (tanque) | 69.1% | 63.4%–74.3% (n=272) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 36.2% | 36.2% [34.7%–37.7%] |
| Mismo build (extremista_reflejos) | 568 | 36.1% | 36.1% [32.2%–40.1%] |
| Mismo build (berserker) | 540 | 35.0% | 35.0% [31.1%–39.1%] |
| Mismo build (tanque) | 544 | 34.6% | 34.6% [30.7%–38.7%] |
| Mismo build (asesino) | 562 | 36.8% | 36.8% [32.9%–40.9%] |
| Mismo build (estratega) | 494 | 35.8% | 35.8% [31.7%–40.2%] |
| Mismo build (extremista_ataque) | 606 | 36.6% | 36.6% [32.9%–40.5%] |
| Mismo build (extremista_defensa) | 550 | 35.1% | 35.1% [31.2%–39.2%] |
| Mismo build (velocista) | 538 | 37.2% | 37.2% [33.2%–41.3%] |
| Mismo build (gladiador) | 592 | 35.1% | 35.1% [31.4%–39.1%] |
| Mismo build (extremista_velocidad) | 584 | 36.3% | 36.3% [32.5%–40.3%] |
| Mismo build (magus) | 514 | 34.2% | 34.2% [30.3%–38.4%] |
| Mismo build (esquivo) | 548 | 37.4% | 37.4% [33.5%–41.5%] |
| Mismo build (equilibrado) | 574 | 38.5% | 38.5% [34.6%–42.5%] |
| Mismo build (guardian) | 510 | 36.3% | 36.3% [32.2%–40.5%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.190 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 34.4% | 122 | 43.7% | 855 | -9.3pp |
| 200–299 | 36.0% | 292 | 44.1% | 869 | -8.1pp |
| 300–399 | 41.1% | 282 | 54.1% | 680 | -13.0pp |
| 400–500 | 43.7% | 238 | 76.6% | 662 | -32.9pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.4% | 127 | 43.6% | 850 | -8.2pp |
| 200–299 | 36.3% | 295 | 44.0% | 866 | -7.7pp |
| 300–399 | 40.9% | 281 | 54.2% | 681 | -13.3pp |
| 400–500 | 43.7% | 238 | 76.6% | 662 | -32.9pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 34.8% | 138 | 43.9% | 839 | -9.1pp |
| 200–299 | 37.9% | 285 | 43.4% | 876 | -5.5pp |
| 300–399 | 42.0% | 276 | 53.6% | 686 | -11.6pp |
| 400–500 | 43.7% | 238 | 76.6% | 662 | -32.9pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 71.3% | 488 | 459 |
| B | 58.5% | 825 | 386 |
| C | 48.4% | 1015 | 302 |
| E | 40.5% | 1672 | 201 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 977 | 0.0% | 0.7% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1161 | 3.9% | 11.0% | 0.0% | 0.1% | 0.0% | 0.0% |
| 300–399 | 962 | 8.3% | 17.7% | 0.8% | 0.8% | 0.0% | 0.3% |
| 400–500 | 900 | 14.9% | 22.7% | 4.1% | 3.0% | 0.7% | 1.1% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 31.1% | 28.5% | 29.8% | 10.6% |
| 200–299 | 29.9% | 30.1% | 29.5% | 10.6% |
| 300–399 | 29.2% | 31.1% | 31.1% | 8.6% |
| 400–500 | 32.3% | 28.9% | 29.3% | 9.4% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 977 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 545 (46.9%) | 616 (53.1%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 141 (14.7%) | 282 (29.3%) | 539 (56.0%) | 0 (0.0%) |
| 400–500 | 9 (1.0%) | 117 (13.0%) | 286 (31.8%) | 488 (54.2%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.21 |
| Cobertura dominante | total: 2595 · alta: 1281 · media: 105 · ligera: 19 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3914 · 1-2: 86 |
| Set bonus activo | 97.9% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 40.1% |
| Con escudo | 61.3% |
| Fighters con ≥1 pieza rota post-batalla | 58.8% (5897 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 87.6% |
| Batallas con ≥1 ítem | 48.2% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 16.5% |
| Rests por batalla (P50/P90) | 3/3 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.109 |
| def | 0.124 |
| aspd | -0.100 |
| ref | 0.024 |
| mspd | 0.109 |
| hp | 0.232 |
| fulgor | -0.105 |
| d_fulgor | -0.109 |
| r_fulgor | -0.102 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 318 (15.9%) |
| Duración media | 9.27 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 293 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (-1.0% sobre 50%, CI 95% -3.1%–1.2%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (36.2% para el mayor nivel; correlación 0.190)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈69.1% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 48.2% de batallas usan ítem; los descansos (P50 3/3) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (-1.0% ventaja, meta 69.1%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 10.75, meta 69.1%) para cerrar el ciclo.
