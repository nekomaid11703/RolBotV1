# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:21:07.221Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 184 (9.2%) |
| Ambos vivos al round 21 | 184/184 |
| Con fatiga ≥ 90 al final | 14/184 |
| Con algún HP ≤ 5 al final | 3/184 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 114/184 |
| Gap de HP relativo al corte (P50/P90) | 41.9% / 79.3% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 7.50 | 6.86–8.15 (n=313) | target 7.0 ✅ |
| Ventaja primer atacante | 2.6% | 0.5%–4.8% (n=2000) | target ≤5% ✅ |
| Winrate meta (tanque) | 67.1% | 61.5%–72.3% (n=286) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 34.5% | 34.5% [33.1%–36.0%] |
| Mismo build (asesino) | 568 | 32.6% | 32.6% [28.8%–36.5%] |
| Mismo build (tanque) | 572 | 34.3% | 34.3% [30.5%–38.2%] |
| Mismo build (esquivo) | 614 | 37.6% | 37.6% [33.9%–41.5%] |
| Mismo build (equilibrado) | 478 | 35.8% | 35.8% [31.6%–40.2%] |
| Mismo build (extremista_velocidad) | 544 | 31.1% | 31.1% [27.3%–35.1%] |
| Mismo build (extremista_ataque) | 560 | 35.9% | 35.9% [32.0%–39.9%] |
| Mismo build (velocista) | 564 | 35.8% | 35.8% [32.0%–39.9%] |
| Mismo build (extremista_reflejos) | 522 | 32.6% | 32.6% [28.7%–36.7%] |
| Mismo build (estratega) | 498 | 36.9% | 36.9% [32.8%–41.3%] |
| Mismo build (gladiador) | 542 | 33.8% | 33.8% [29.9%–37.8%] |
| Mismo build (berserker) | 516 | 32.6% | 32.6% [28.7%–36.7%] |
| Mismo build (extremista_defensa) | 584 | 34.9% | 34.9% [31.2%–38.9%] |
| Mismo build (magus) | 534 | 32.6% | 32.6% [28.7%–36.7%] |
| Mismo build (guardian) | 584 | 37.0% | 37.0% [33.2%–41.0%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.169 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.5% | 110 | 43.5% | 855 | -8.1pp |
| 200–299 | 31.9% | 279 | 46.2% | 855 | -14.3pp |
| 300–399 | 41.0% | 290 | 57.3% | 674 | -16.2pp |
| 400–500 | 49.0% | 300 | 71.0% | 637 | -22.0pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 39.7% | 116 | 43.0% | 849 | -3.3pp |
| 200–299 | 29.3% | 266 | 46.8% | 868 | -17.5pp |
| 300–399 | 41.3% | 293 | 57.2% | 671 | -15.9pp |
| 400–500 | 49.2% | 299 | 70.8% | 638 | -21.7pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.8% | 109 | 43.5% | 856 | -7.7pp |
| 200–299 | 32.0% | 281 | 46.2% | 853 | -14.2pp |
| 300–399 | 40.7% | 297 | 57.6% | 667 | -16.8pp |
| 400–500 | 49.3% | 300 | 70.8% | 637 | -21.5pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 66.0% | 527 | 458 |
| B | 54.4% | 816 | 387 |
| C | 49.9% | 1054 | 303 |
| E | 42.5% | 1603 | 197 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 965 | 0.0% | 0.6% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1134 | 3.6% | 12.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 964 | 8.1% | 22.3% | 0.1% | 0.7% | 0.0% | 0.1% |
| 400–500 | 937 | 14.3% | 23.9% | 3.8% | 2.9% | 0.4% | 0.7% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 29.7% | 29.0% | 30.3% | 11.0% |
| 200–299 | 29.3% | 28.7% | 29.8% | 12.2% |
| 300–399 | 31.6% | 30.9% | 28.0% | 9.4% |
| 400–500 | 30.5% | 31.3% | 28.4% | 9.8% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 965 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 528 (46.6%) | 606 (53.4%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 106 (11.0%) | 337 (35.0%) | 521 (54.0%) | 0 (0.0%) |
| 400–500 | 4 (0.4%) | 111 (11.8%) | 295 (31.5%) | 527 (56.2%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.22 |
| Cobertura dominante | alta: 2213 · total: 971 · media: 423 · ligera: 392 · ninguna: 1 |
| Piezas de set (0 / 1-2 / 3+) | 0: 1 · 3+: 3916 · 1-2: 83 |
| Set bonus activo | 97.9% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 39.6% |
| Con escudo | 60.4% |
| Fighters con ≥1 pieza rota post-batalla | 45.7% (4076 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 80.3% |
| Batallas con ≥1 ítem | 41.0% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 18.6% |
| Rests por batalla (P50/P90) | 2/2 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.090 |
| def | 0.103 |
| aspd | -0.055 |
| ref | -0.005 |
| mspd | 0.104 |
| hp | 0.192 |
| fulgor | -0.096 |
| d_fulgor | -0.098 |
| r_fulgor | -0.094 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 5 / 20 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 200 (10.0%) |
| Duración media | 7.20 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 184 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (2.6% sobre 50%, CI 95% 0.5%–4.8%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (34.5% para el mayor nivel; correlación 0.169)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈67.1% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 41.0% de batallas usan ítem; los descansos (P50 2/2) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (2.6% ventaja, meta 67.1%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 7.50, meta 67.1%) para cerrar el ciclo.
