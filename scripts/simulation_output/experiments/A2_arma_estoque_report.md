# Stress Test — Fase A (weapon)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=estoque
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (3 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | estoque | 17 | 31 |
| el_muro | el_goliat | estoque | 10 | 31 |
| el_goliat | el_muro | estoque | 2 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | estoque | 121 | 162 | 17 | 40.3 | 10.6 | 31 | 0/0 |
| el_muro | el_misil | estoque | 298 | 2 | 0 | 99.3 | 2.5 | 5 | 0/0 |
| el_muro | el_intocable | estoque | 77 | 223 | 0 | 25.7 | 25.8 | 31 | 0/0 |
| el_muro | la_tormenta | estoque | 296 | 4 | 0 | 98.7 | 2.5 | 6 | 0/0 |
| el_muro | el_vidrio | estoque | 281 | 19 | 0 | 93.7 | 3.8 | 5 | 0/0 |
| el_muro | el_goliat | estoque | 199 | 91 | 10 | 66.3 | 9.0 | 31 | 0/0 |
| el_misil | el_muro | estoque | 0 | 300 | 0 | 0.0 | 2.3 | 5 | 0/0 |
| el_misil | el_misil | estoque | 19 | 281 | 0 | 6.3 | 2.0 | 3 | 0/0 |
| el_misil | el_intocable | estoque | 290 | 10 | 0 | 96.7 | 2.0 | 4 | 0/0 |
| el_misil | la_tormenta | estoque | 12 | 288 | 0 | 4.0 | 2.0 | 3 | 0/0 |
| el_misil | el_vidrio | estoque | 15 | 285 | 0 | 5.0 | 2.0 | 3 | 0/0 |
| el_misil | el_goliat | estoque | 0 | 300 | 0 | 0.0 | 2.7 | 4 | 0/0 |
| el_intocable | el_muro | estoque | 48 | 252 | 0 | 16.0 | 30.1 | 31 | 0/0 |
| el_intocable | el_misil | estoque | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | estoque | 0 | 300 | 0 | 0.0 | 1.3 | 2 | 0/0 |
| el_intocable | la_tormenta | estoque | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | estoque | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | estoque | 15 | 285 | 0 | 5.0 | 15.4 | 31 | 0/0 |
| la_tormenta | el_muro | estoque | 0 | 300 | 0 | 0.0 | 2.3 | 6 | 0/0 |
| la_tormenta | el_misil | estoque | 19 | 281 | 0 | 6.3 | 2.0 | 2 | 0/0 |
| la_tormenta | el_intocable | estoque | 288 | 12 | 0 | 96.0 | 2.0 | 3 | 0/0 |
| la_tormenta | la_tormenta | estoque | 11 | 289 | 0 | 3.7 | 2.0 | 3 | 0/0 |
| la_tormenta | el_vidrio | estoque | 17 | 283 | 0 | 5.7 | 2.0 | 3 | 0/0 |
| la_tormenta | el_goliat | estoque | 0 | 300 | 0 | 0.0 | 2.8 | 5 | 0/0 |
| el_vidrio | el_muro | estoque | 3 | 297 | 0 | 1.0 | 3.9 | 6 | 0/0 |
| el_vidrio | el_misil | estoque | 211 | 89 | 0 | 70.3 | 2.0 | 3 | 0/0 |
| el_vidrio | el_intocable | estoque | 263 | 37 | 0 | 87.7 | 2.2 | 5 | 0/0 |
| el_vidrio | la_tormenta | estoque | 200 | 100 | 0 | 66.7 | 2.0 | 3 | 0/0 |
| el_vidrio | el_vidrio | estoque | 115 | 185 | 0 | 38.3 | 2.5 | 5 | 0/0 |
| el_vidrio | el_goliat | estoque | 8 | 292 | 0 | 2.7 | 3.7 | 5 | 0/0 |
| el_goliat | el_muro | estoque | 1 | 297 | 2 | 0.3 | 4.4 | 31 | 0/0 |
| el_goliat | el_misil | estoque | 124 | 176 | 0 | 41.3 | 3.5 | 5 | 0/0 |
| el_goliat | el_intocable | estoque | 4 | 296 | 0 | 1.3 | 6.9 | 31 | 0/0 |
| el_goliat | la_tormenta | estoque | 98 | 202 | 0 | 32.7 | 3.6 | 5 | 0/0 |
| el_goliat | el_vidrio | estoque | 295 | 5 | 0 | 98.3 | 3.1 | 4 | 0/0 |
| el_goliat | el_goliat | estoque | 3 | 297 | 0 | 1.0 | 4.1 | 7 | 0/0 |