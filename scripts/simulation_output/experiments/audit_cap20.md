# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:11:24.730Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 313 (15.7%) |
| Ambos vivos al round 21 | 313/313 |
| Con fatiga ≥ 90 al final | 20/313 |
| Con algún HP ≤ 5 al final | 10/313 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 181/313 |
| Gap de HP relativo al corte (P50/P90) | 41.5% / 86.5% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 9.81 | 9.13–10.50 (n=321) | target 7.0 ⚠️ |
| Ventaja primer atacante | 3.6% | 1.4%–5.8% (n=2000) | target ≤5% ⚠️ |
| Winrate meta (tanque) | 66.0% | 60.5%–71.1% (n=300) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 35.6% | 35.6% [34.2%–37.1%] |
| Mismo build (velocista) | 566 | 35.7% | 35.7% [31.9%–39.7%] |
| Mismo build (esquivo) | 512 | 35.4% | 35.4% [31.3%–39.6%] |
| Mismo build (guardian) | 514 | 36.0% | 36.0% [32.0%–40.2%] |
| Mismo build (tanque) | 600 | 39.3% | 39.3% [35.5%–43.3%] |
| Mismo build (extremista_defensa) | 516 | 34.5% | 34.5% [30.5%–38.7%] |
| Mismo build (berserker) | 592 | 33.3% | 33.3% [29.6%–37.2%] |
| Mismo build (estratega) | 580 | 36.2% | 36.2% [32.4%–40.2%] |
| Mismo build (extremista_velocidad) | 574 | 33.4% | 33.4% [29.7%–37.4%] |
| Mismo build (magus) | 608 | 33.7% | 33.7% [30.1%–37.6%] |
| Mismo build (extremista_ataque) | 548 | 36.3% | 36.3% [32.4%–40.4%] |
| Mismo build (extremista_reflejos) | 538 | 34.4% | 34.4% [30.5%–38.5%] |
| Mismo build (equilibrado) | 470 | 36.0% | 36.0% [31.7%–40.4%] |
| Mismo build (asesino) | 506 | 36.0% | 36.0% [31.9%–40.2%] |
| Mismo build (gladiador) | 544 | 36.9% | 36.9% [33.0%–41.1%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.189 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 43.8% | 128 | 41.9% | 857 | 1.9pp |
| 200–299 | 40.7% | 280 | 42.7% | 865 | -1.9pp |
| 300–399 | 42.5% | 285 | 54.6% | 661 | -12.2pp |
| 400–500 | 48.2% | 284 | 74.7% | 640 | -26.4pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 42.9% | 119 | 42.0% | 866 | 0.8pp |
| 200–299 | 39.6% | 273 | 43.0% | 872 | -3.4pp |
| 300–399 | 42.0% | 288 | 54.9% | 658 | -12.8pp |
| 400–500 | 48.2% | 284 | 74.7% | 640 | -26.4pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 42.5% | 120 | 42.1% | 865 | 0.4pp |
| 200–299 | 38.5% | 273 | 43.3% | 872 | -4.9pp |
| 300–399 | 41.9% | 279 | 54.7% | 667 | -12.8pp |
| 400–500 | 47.9% | 282 | 74.8% | 642 | -26.9pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 68.7% | 514 | 457 |
| B | 59.8% | 811 | 390 |
| C | 47.2% | 1031 | 300 |
| E | 40.8% | 1644 | 199 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 985 | 0.0% | 1.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1145 | 2.0% | 13.6% | 0.1% | 0.0% | 0.0% | 0.0% |
| 300–399 | 946 | 8.6% | 20.7% | 0.6% | 0.8% | 0.0% | 0.0% |
| 400–500 | 924 | 17.4% | 20.1% | 4.1% | 3.2% | 0.4% | 0.4% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 30.4% | 28.4% | 30.3% | 11.0% |
| 200–299 | 31.4% | 32.1% | 27.2% | 9.2% |
| 300–399 | 30.0% | 28.9% | 31.1% | 10.0% |
| 400–500 | 28.8% | 31.9% | 27.9% | 11.4% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 985 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 521 (45.5%) | 624 (54.5%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 127 (13.4%) | 302 (31.9%) | 517 (54.7%) | 0 (0.0%) |
| 400–500 | 11 (1.2%) | 105 (11.4%) | 294 (31.8%) | 514 (55.6%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.21 |
| Cobertura dominante | total: 2577 · alta: 1277 · media: 126 · ligera: 20 |
| Piezas de set (0 / 1-2 / 3+) | 1-2: 94 · 3+: 3906 |
| Set bonus activo | 97.7% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 40.4% |
| Con escudo | 59.9% |
| Fighters con ≥1 pieza rota post-batalla | 58.7% (5878 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 86.5% |
| Batallas con ≥1 ítem | 50.6% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 15.1% |
| Rests por batalla (P50/P90) | 3/3 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.128 |
| def | 0.093 |
| aspd | -0.090 |
| ref | 0.051 |
| mspd | 0.098 |
| hp | 0.207 |
| fulgor | -0.076 |
| d_fulgor | -0.078 |
| r_fulgor | -0.076 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 339 (17.0%) |
| Duración media | 9.36 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 313 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (3.6% sobre 50%, CI 95% 1.4%–5.8%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (35.6% para el mayor nivel; correlación 0.189)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈66.0% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 50.6% de batallas usan ítem; los descansos (P50 3/3) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (3.6% ventaja, meta 66.0%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 9.81, meta 66.0%) para cerrar el ciclo.
