# Stress Test — Fase A (weapon)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=arco
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (6 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | arco | 7 | 31 |
| el_muro | el_goliat | arco | 4 | 31 |
| el_intocable | el_intocable | arco | 3 | 31 |
| el_vidrio | el_intocable | arco | 1 | 31 |
| el_goliat | el_muro | arco | 13 | 31 |
| el_goliat | el_goliat | arco | 15 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | arco | 96 | 197 | 7 | 32.0 | 31.0 | 31 | 0/0 |
| el_muro | el_misil | arco | 288 | 12 | 0 | 96.0 | 16.9 | 31 | 0/0 |
| el_muro | el_intocable | arco | 300 | 0 | 0 | 100.0 | 30.9 | 31 | 0/0 |
| el_muro | la_tormenta | arco | 288 | 12 | 0 | 96.0 | 17.0 | 31 | 0/0 |
| el_muro | el_vidrio | arco | 296 | 4 | 0 | 98.7 | 18.5 | 26 | 0/0 |
| el_muro | el_goliat | arco | 229 | 67 | 4 | 76.3 | 29.8 | 31 | 0/0 |
| el_misil | el_muro | arco | 0 | 300 | 0 | 0.0 | 15.8 | 31 | 0/0 |
| el_misil | el_misil | arco | 7 | 293 | 0 | 2.3 | 21.0 | 21 | 0/0 |
| el_misil | el_intocable | arco | 211 | 89 | 0 | 70.3 | 21.2 | 28 | 0/0 |
| el_misil | la_tormenta | arco | 8 | 292 | 0 | 2.7 | 21.0 | 21 | 0/0 |
| el_misil | el_vidrio | arco | 5 | 295 | 0 | 1.7 | 21.0 | 21 | 0/0 |
| el_misil | el_goliat | arco | 1 | 299 | 0 | 0.3 | 21.9 | 25 | 0/0 |
| el_intocable | el_muro | arco | 0 | 300 | 0 | 0.0 | 30.9 | 31 | 0/0 |
| el_intocable | el_misil | arco | 0 | 300 | 0 | 0.0 | 21.0 | 21 | 0/0 |
| el_intocable | el_intocable | arco | 73 | 224 | 3 | 24.3 | 28.6 | 31 | 0/0 |
| el_intocable | la_tormenta | arco | 0 | 300 | 0 | 0.0 | 20.9 | 21 | 0/0 |
| el_intocable | el_vidrio | arco | 210 | 90 | 0 | 70.0 | 25.3 | 31 | 0/0 |
| el_intocable | el_goliat | arco | 0 | 300 | 0 | 0.0 | 30.6 | 31 | 0/0 |
| la_tormenta | el_muro | arco | 0 | 300 | 0 | 0.0 | 15.7 | 31 | 0/0 |
| la_tormenta | el_misil | arco | 12 | 288 | 0 | 4.0 | 21.0 | 22 | 0/0 |
| la_tormenta | el_intocable | arco | 215 | 85 | 0 | 71.7 | 21.1 | 26 | 0/0 |
| la_tormenta | la_tormenta | arco | 3 | 297 | 0 | 1.0 | 21.0 | 21 | 0/0 |
| la_tormenta | el_vidrio | arco | 5 | 295 | 0 | 1.7 | 21.0 | 21 | 0/0 |
| la_tormenta | el_goliat | arco | 1 | 299 | 0 | 0.3 | 21.8 | 24 | 0/0 |
| el_vidrio | el_muro | arco | 1 | 299 | 0 | 0.3 | 18.9 | 26 | 0/0 |
| el_vidrio | el_misil | arco | 1 | 299 | 0 | 0.3 | 21.0 | 21 | 0/0 |
| el_vidrio | el_intocable | arco | 91 | 208 | 1 | 30.3 | 25.0 | 31 | 0/0 |
| el_vidrio | la_tormenta | arco | 1 | 299 | 0 | 0.3 | 21.0 | 21 | 0/0 |
| el_vidrio | el_vidrio | arco | 0 | 300 | 0 | 0.0 | 21.0 | 21 | 0/0 |
| el_vidrio | el_goliat | arco | 0 | 300 | 0 | 0.0 | 22.4 | 24 | 0/0 |
| el_goliat | el_muro | arco | 1 | 286 | 13 | 0.3 | 29.6 | 31 | 0/0 |
| el_goliat | el_misil | arco | 298 | 2 | 0 | 99.3 | 22.3 | 25 | 0/0 |
| el_goliat | el_intocable | arco | 300 | 0 | 0 | 100.0 | 31.0 | 31 | 0/0 |
| el_goliat | la_tormenta | arco | 296 | 4 | 0 | 98.7 | 22.3 | 25 | 0/0 |
| el_goliat | el_vidrio | arco | 295 | 5 | 0 | 98.3 | 22.4 | 25 | 0/0 |
| el_goliat | el_goliat | arco | 52 | 233 | 15 | 17.3 | 28.3 | 31 | 0/0 |