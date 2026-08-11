# Stress Test — Fase A (weapon)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=maza
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (3 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | maza | 11 | 31 |
| el_muro | el_goliat | maza | 5 | 31 |
| el_goliat | el_muro | maza | 3 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | maza | 113 | 176 | 11 | 37.7 | 10.9 | 31 | 0/0 |
| el_muro | el_misil | maza | 296 | 4 | 0 | 98.7 | 2.5 | 5 | 0/0 |
| el_muro | el_intocable | maza | 192 | 108 | 0 | 64.0 | 28.4 | 31 | 0/0 |
| el_muro | la_tormenta | maza | 300 | 0 | 0 | 100.0 | 2.5 | 12 | 0/0 |
| el_muro | el_vidrio | maza | 284 | 16 | 0 | 94.7 | 3.7 | 5 | 0/0 |
| el_muro | el_goliat | maza | 189 | 106 | 5 | 63.0 | 9.9 | 31 | 0/0 |
| el_misil | el_muro | maza | 0 | 300 | 0 | 0.0 | 2.3 | 4 | 0/0 |
| el_misil | el_misil | maza | 4 | 296 | 0 | 1.3 | 2.0 | 2 | 0/0 |
| el_misil | el_intocable | maza | 286 | 14 | 0 | 95.3 | 2.1 | 4 | 0/0 |
| el_misil | la_tormenta | maza | 4 | 296 | 0 | 1.3 | 2.0 | 2 | 0/0 |
| el_misil | el_vidrio | maza | 5 | 295 | 0 | 1.7 | 2.0 | 2 | 0/0 |
| el_misil | el_goliat | maza | 5 | 295 | 0 | 1.7 | 2.8 | 5 | 0/0 |
| el_intocable | el_muro | maza | 32 | 268 | 0 | 10.7 | 30.8 | 31 | 0/0 |
| el_intocable | el_misil | maza | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | maza | 0 | 300 | 0 | 0.0 | 1.4 | 2 | 0/0 |
| el_intocable | la_tormenta | maza | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | maza | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | maza | 16 | 284 | 0 | 5.3 | 13.4 | 31 | 0/0 |
| la_tormenta | el_muro | maza | 0 | 300 | 0 | 0.0 | 2.4 | 4 | 0/0 |
| la_tormenta | el_misil | maza | 6 | 294 | 0 | 2.0 | 2.0 | 2 | 0/0 |
| la_tormenta | el_intocable | maza | 293 | 7 | 0 | 97.7 | 2.0 | 4 | 0/0 |
| la_tormenta | la_tormenta | maza | 7 | 293 | 0 | 2.3 | 2.0 | 2 | 0/0 |
| la_tormenta | el_vidrio | maza | 1 | 299 | 0 | 0.3 | 2.0 | 3 | 0/0 |
| la_tormenta | el_goliat | maza | 1 | 299 | 0 | 0.3 | 2.8 | 4 | 0/0 |
| el_vidrio | el_muro | maza | 1 | 299 | 0 | 0.3 | 3.9 | 6 | 0/0 |
| el_vidrio | el_misil | maza | 189 | 111 | 0 | 63.0 | 2.0 | 3 | 0/0 |
| el_vidrio | el_intocable | maza | 274 | 26 | 0 | 91.3 | 2.2 | 5 | 0/0 |
| el_vidrio | la_tormenta | maza | 195 | 105 | 0 | 65.0 | 2.0 | 3 | 0/0 |
| el_vidrio | el_vidrio | maza | 107 | 193 | 0 | 35.7 | 2.4 | 5 | 0/0 |
| el_vidrio | el_goliat | maza | 55 | 245 | 0 | 18.3 | 3.4 | 5 | 0/0 |
| el_goliat | el_muro | maza | 1 | 296 | 3 | 0.3 | 5.0 | 31 | 0/0 |
| el_goliat | el_misil | maza | 110 | 190 | 0 | 36.7 | 3.2 | 5 | 0/0 |
| el_goliat | el_intocable | maza | 1 | 299 | 0 | 0.3 | 8.0 | 24 | 0/0 |
| el_goliat | la_tormenta | maza | 87 | 213 | 0 | 29.0 | 3.3 | 5 | 0/0 |
| el_goliat | el_vidrio | maza | 260 | 40 | 0 | 86.7 | 3.0 | 4 | 0/0 |
| el_goliat | el_goliat | maza | 2 | 298 | 0 | 0.7 | 4.3 | 7 | 0/0 |