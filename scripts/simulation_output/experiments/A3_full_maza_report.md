# Stress Test — Fase A (full)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=maza
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (1 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_vidrio | el_vidrio | maza | 1 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | maza | 77 | 223 | 0 | 25.7 | 8.6 | 17 | 0/0 |
| el_muro | el_misil | maza | 299 | 1 | 0 | 99.7 | 3.2 | 5 | 0/0 |
| el_muro | el_intocable | maza | 300 | 0 | 0 | 100.0 | 2.0 | 3 | 0/0 |
| el_muro | la_tormenta | maza | 300 | 0 | 0 | 100.0 | 3.2 | 5 | 0/0 |
| el_muro | el_vidrio | maza | 291 | 9 | 0 | 97.0 | 4.4 | 7 | 0/0 |
| el_muro | el_goliat | maza | 279 | 21 | 0 | 93.0 | 5.5 | 10 | 0/0 |
| el_misil | el_muro | maza | 0 | 300 | 0 | 0.0 | 3.1 | 5 | 0/0 |
| el_misil | el_misil | maza | 19 | 281 | 0 | 6.3 | 2.0 | 2 | 0/0 |
| el_misil | el_intocable | maza | 300 | 0 | 0 | 100.0 | 2.0 | 2 | 0/0 |
| el_misil | la_tormenta | maza | 16 | 284 | 0 | 5.3 | 2.0 | 2 | 0/0 |
| el_misil | el_vidrio | maza | 5 | 295 | 0 | 1.7 | 2.0 | 3 | 0/0 |
| el_misil | el_goliat | maza | 0 | 300 | 0 | 0.0 | 3.0 | 5 | 0/0 |
| el_intocable | el_muro | maza | 0 | 300 | 0 | 0.0 | 1.5 | 2 | 0/0 |
| el_intocable | el_misil | maza | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | maza | 0 | 300 | 0 | 0.0 | 1.4 | 2 | 0/0 |
| el_intocable | la_tormenta | maza | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | maza | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | maza | 0 | 300 | 0 | 0.0 | 1.1 | 2 | 0/0 |
| la_tormenta | el_muro | maza | 0 | 300 | 0 | 0.0 | 3.1 | 7 | 0/0 |
| la_tormenta | el_misil | maza | 19 | 281 | 0 | 6.3 | 2.0 | 2 | 0/0 |
| la_tormenta | el_intocable | maza | 299 | 1 | 0 | 99.7 | 2.0 | 2 | 0/0 |
| la_tormenta | la_tormenta | maza | 11 | 289 | 0 | 3.7 | 2.0 | 2 | 0/0 |
| la_tormenta | el_vidrio | maza | 4 | 296 | 0 | 1.3 | 2.0 | 4 | 0/0 |
| la_tormenta | el_goliat | maza | 1 | 299 | 0 | 0.3 | 3.0 | 5 | 0/0 |
| el_vidrio | el_muro | maza | 3 | 297 | 0 | 1.0 | 4.8 | 8 | 0/0 |
| el_vidrio | el_misil | maza | 221 | 79 | 0 | 73.7 | 2.1 | 4 | 0/0 |
| el_vidrio | el_intocable | maza | 299 | 1 | 0 | 99.7 | 2.0 | 2 | 0/0 |
| el_vidrio | la_tormenta | maza | 215 | 85 | 0 | 71.7 | 2.1 | 4 | 0/0 |
| el_vidrio | el_vidrio | maza | 87 | 212 | 1 | 29.0 | 3.1 | 31 | 0/0 |
| el_vidrio | el_goliat | maza | 7 | 293 | 0 | 2.3 | 3.7 | 5 | 0/0 |
| el_goliat | el_muro | maza | 18 | 282 | 0 | 6.0 | 5.6 | 10 | 0/0 |
| el_goliat | el_misil | maza | 295 | 5 | 0 | 98.3 | 2.9 | 4 | 0/0 |
| el_goliat | el_intocable | maza | 300 | 0 | 0 | 100.0 | 2.1 | 3 | 0/0 |
| el_goliat | la_tormenta | maza | 300 | 0 | 0 | 100.0 | 2.9 | 4 | 0/0 |
| el_goliat | el_vidrio | maza | 299 | 1 | 0 | 99.7 | 3.0 | 4 | 0/0 |
| el_goliat | el_goliat | maza | 111 | 189 | 0 | 37.0 | 6.7 | 9 | 0/0 |