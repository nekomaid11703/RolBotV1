# Stress Test — Fase A (full)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=arco
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (2 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | arco | 2 | 31 |
| el_goliat | el_goliat | arco | 11 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | arco | 70 | 228 | 2 | 23.3 | 31.0 | 31 | 0/0 |
| el_muro | el_misil | arco | 300 | 0 | 0 | 100.0 | 16.4 | 24 | 0/0 |
| el_muro | el_intocable | arco | 300 | 0 | 0 | 100.0 | 13.1 | 20 | 0/0 |
| el_muro | la_tormenta | arco | 300 | 0 | 0 | 100.0 | 16.3 | 22 | 0/0 |
| el_muro | el_vidrio | arco | 300 | 0 | 0 | 100.0 | 19.5 | 24 | 0/0 |
| el_muro | el_goliat | arco | 300 | 0 | 0 | 100.0 | 28.8 | 31 | 0/0 |
| el_misil | el_muro | arco | 0 | 300 | 0 | 0.0 | 17.0 | 22 | 0/0 |
| el_misil | el_misil | arco | 7 | 293 | 0 | 2.3 | 21.0 | 22 | 0/0 |
| el_misil | el_intocable | arco | 298 | 2 | 0 | 99.3 | 20.9 | 21 | 0/0 |
| el_misil | la_tormenta | arco | 10 | 290 | 0 | 3.3 | 21.0 | 21 | 0/0 |
| el_misil | el_vidrio | arco | 11 | 289 | 0 | 3.7 | 21.0 | 21 | 0/0 |
| el_misil | el_goliat | arco | 2 | 298 | 0 | 0.7 | 22.3 | 24 | 0/0 |
| el_intocable | el_muro | arco | 0 | 300 | 0 | 0.0 | 12.7 | 15 | 0/0 |
| el_intocable | el_misil | arco | 0 | 300 | 0 | 0.0 | 20.8 | 21 | 0/0 |
| el_intocable | el_intocable | arco | 21 | 279 | 0 | 7.0 | 18.3 | 25 | 0/0 |
| el_intocable | la_tormenta | arco | 0 | 300 | 0 | 0.0 | 20.9 | 21 | 0/0 |
| el_intocable | el_vidrio | arco | 0 | 300 | 0 | 0.0 | 20.9 | 21 | 0/0 |
| el_intocable | el_goliat | arco | 0 | 300 | 0 | 0.0 | 19.6 | 22 | 0/0 |
| la_tormenta | el_muro | arco | 0 | 300 | 0 | 0.0 | 16.9 | 22 | 0/0 |
| la_tormenta | el_misil | arco | 8 | 292 | 0 | 2.7 | 21.0 | 21 | 0/0 |
| la_tormenta | el_intocable | arco | 300 | 0 | 0 | 100.0 | 20.9 | 21 | 0/0 |
| la_tormenta | la_tormenta | arco | 8 | 292 | 0 | 2.7 | 21.0 | 21 | 0/0 |
| la_tormenta | el_vidrio | arco | 4 | 296 | 0 | 1.3 | 21.0 | 21 | 0/0 |
| la_tormenta | el_goliat | arco | 0 | 300 | 0 | 0.0 | 22.3 | 24 | 0/0 |
| el_vidrio | el_muro | arco | 0 | 300 | 0 | 0.0 | 20.0 | 25 | 0/0 |
| el_vidrio | el_misil | arco | 2 | 298 | 0 | 0.7 | 21.0 | 21 | 0/0 |
| el_vidrio | el_intocable | arco | 300 | 0 | 0 | 100.0 | 20.8 | 21 | 0/0 |
| el_vidrio | la_tormenta | arco | 0 | 300 | 0 | 0.0 | 21.0 | 21 | 0/0 |
| el_vidrio | el_vidrio | arco | 1 | 299 | 0 | 0.3 | 21.0 | 21 | 0/0 |
| el_vidrio | el_goliat | arco | 1 | 299 | 0 | 0.3 | 22.4 | 24 | 0/0 |
| el_goliat | el_muro | arco | 0 | 300 | 0 | 0.0 | 29.1 | 31 | 0/0 |
| el_goliat | el_misil | arco | 297 | 3 | 0 | 99.0 | 22.3 | 24 | 0/0 |
| el_goliat | el_intocable | arco | 300 | 0 | 0 | 100.0 | 22.7 | 31 | 0/0 |
| el_goliat | la_tormenta | arco | 294 | 6 | 0 | 98.0 | 22.3 | 25 | 0/0 |
| el_goliat | el_vidrio | arco | 291 | 9 | 0 | 97.0 | 22.4 | 24 | 0/0 |
| el_goliat | el_goliat | arco | 135 | 154 | 11 | 45.0 | 30.3 | 31 | 0/0 |