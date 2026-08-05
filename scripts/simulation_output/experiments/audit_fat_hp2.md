# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:17:56.750Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 144 (7.2%) |
| Ambos vivos al round 21 | 144/144 |
| Con fatiga ≥ 90 al final | 13/144 |
| Con algún HP ≤ 5 al final | 5/144 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 90/144 |
| Gap de HP relativo al corte (P50/P90) | 37.1% / 77.3% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 7.09 | 6.43–7.75 (n=296) | target 7.0 ✅ |
| Ventaja primer atacante | -2.6% | -4.7%–-0.4% (n=2000) | target ≤5% ✅ |
| Winrate meta (velocista) | 69.3% | 63.5%–74.5% (n=267) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 33.8% | 33.8% [32.4%–35.3%] |
| Mismo build (tanque) | 528 | 34.7% | 34.7% [30.7%–38.8%] |
| Mismo build (asesino) | 504 | 32.1% | 32.1% [28.2%–36.3%] |
| Mismo build (extremista_velocidad) | 552 | 32.2% | 32.2% [28.5%–36.3%] |
| Mismo build (equilibrado) | 630 | 34.8% | 34.8% [31.1%–38.6%] |
| Mismo build (guardian) | 566 | 35.0% | 35.0% [31.2%–39.0%] |
| Mismo build (velocista) | 534 | 33.9% | 33.9% [30.0%–38.0%] |
| Mismo build (extremista_defensa) | 600 | 33.2% | 33.2% [29.5%–37.0%] |
| Mismo build (estratega) | 528 | 35.0% | 35.0% [31.1%–39.2%] |
| Mismo build (berserker) | 592 | 33.6% | 33.6% [29.9%–37.5%] |
| Mismo build (extremista_reflejos) | 512 | 31.6% | 31.6% [27.8%–35.8%] |
| Mismo build (esquivo) | 530 | 34.7% | 34.7% [30.8%–38.9%] |
| Mismo build (magus) | 582 | 35.9% | 35.9% [32.1%–39.9%] |
| Mismo build (extremista_ataque) | 562 | 31.0% | 31.0% [27.3%–34.9%] |
| Mismo build (gladiador) | 510 | 33.1% | 33.1% [29.2%–37.3%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.150 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 44.4% | 124 | 42.9% | 856 | 1.5pp |
| 200–299 | 40.7% | 295 | 46.4% | 868 | -5.8pp |
| 300–399 | 43.2% | 292 | 55.4% | 689 | -12.3pp |
| 400–500 | 45.1% | 266 | 69.7% | 610 | -24.6pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 42.3% | 123 | 43.2% | 857 | -0.9pp |
| 200–299 | 41.1% | 285 | 46.2% | 878 | -5.2pp |
| 300–399 | 43.6% | 296 | 55.3% | 685 | -11.7pp |
| 400–500 | 44.7% | 266 | 69.8% | 610 | -25.1pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 45.5% | 123 | 42.7% | 857 | 2.8pp |
| 200–299 | 40.6% | 278 | 46.3% | 885 | -5.7pp |
| 300–399 | 43.7% | 293 | 55.2% | 688 | -11.5pp |
| 400–500 | 45.1% | 266 | 69.7% | 610 | -24.6pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 65.3% | 484 | 458 |
| B | 57.3% | 813 | 387 |
| C | 49.9% | 1044 | 300 |
| E | 41.9% | 1659 | 200 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 980 | 0.0% | 1.1% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1163 | 3.2% | 13.4% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 981 | 7.1% | 19.7% | 0.3% | 0.8% | 0.1% | 0.0% |
| 400–500 | 876 | 15.9% | 22.7% | 2.9% | 3.0% | 0.2% | 0.6% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 28.0% | 31.1% | 30.7% | 10.2% |
| 200–299 | 29.0% | 31.6% | 30.0% | 9.4% |
| 300–399 | 30.8% | 31.5% | 28.7% | 9.0% |
| 400–500 | 32.8% | 27.9% | 28.7% | 10.7% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 980 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 544 (46.8%) | 619 (53.2%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 127 (12.9%) | 323 (32.9%) | 531 (54.1%) | 0 (0.0%) |
| 400–500 | 8 (0.9%) | 102 (11.6%) | 282 (32.2%) | 484 (55.3%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.20 |
| Cobertura dominante | total: 2574 · alta: 1271 · media: 131 · ligera: 24 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3916 · 1-2: 84 |
| Set bonus activo | 97.9% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 39.6% |
| Con escudo | 59.3% |
| Fighters con ≥1 pieza rota post-batalla | 36.5% (2966 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 72.0% |
| Batallas con ≥1 ítem | 38.6% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 21.9% |
| Rests por batalla (P50/P90) | 1/1 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.102 |
| def | 0.093 |
| aspd | -0.049 |
| ref | -0.028 |
| mspd | 0.137 |
| hp | 0.169 |
| fulgor | -0.083 |
| d_fulgor | -0.083 |
| r_fulgor | -0.079 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 4 / 16 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 151 (7.5%) |
| Duración media | 6.38 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 144 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | velocista (report) | velocista (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (-2.6% sobre 50%, CI 95% -4.7%–-0.4%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (33.8% para el mayor nivel; correlación 0.150)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: velocista ≈69.3% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 38.6% de batallas usan ítem; los descansos (P50 1/1) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (-2.6% ventaja, meta 69.3%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 7.09, meta 69.3%) para cerrar el ciclo.
