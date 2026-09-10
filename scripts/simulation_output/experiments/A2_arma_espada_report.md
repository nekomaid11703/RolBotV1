# Stress Test — Fase A (weapon)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=espada
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (3 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | espada | 20 | 31 |
| el_muro | el_goliat | espada | 11 | 31 |
| el_goliat | el_muro | espada | 3 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | espada | 120 | 160 | 20 | 40.0 | 10.0 | 31 | 0/0 |
| el_muro | el_misil | espada | 295 | 5 | 0 | 98.3 | 2.4 | 4 | 0/0 |
| el_muro | el_intocable | espada | 38 | 262 | 0 | 12.7 | 25.0 | 31 | 0/0 |
| el_muro | la_tormenta | espada | 299 | 1 | 0 | 99.7 | 2.4 | 4 | 0/0 |
| el_muro | el_vidrio | espada | 259 | 41 | 0 | 86.3 | 3.5 | 4 | 0/0 |
| el_muro | el_goliat | espada | 192 | 97 | 11 | 64.0 | 8.6 | 31 | 0/0 |
| el_misil | el_muro | espada | 1 | 299 | 0 | 0.3 | 2.2 | 4 | 0/0 |
| el_misil | el_misil | espada | 5 | 295 | 0 | 1.7 | 2.0 | 2 | 0/0 |
| el_misil | el_intocable | espada | 257 | 43 | 0 | 85.7 | 2.0 | 3 | 0/0 |
| el_misil | la_tormenta | espada | 2 | 298 | 0 | 0.7 | 2.0 | 2 | 0/0 |
| el_misil | el_vidrio | espada | 2 | 298 | 0 | 0.7 | 2.0 | 3 | 0/0 |
| el_misil | el_goliat | espada | 3 | 297 | 0 | 1.0 | 2.4 | 4 | 0/0 |
| el_intocable | el_muro | espada | 47 | 253 | 0 | 15.7 | 30.0 | 31 | 0/0 |
| el_intocable | el_misil | espada | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | espada | 0 | 300 | 0 | 0.0 | 1.0 | 2 | 0/0 |
| el_intocable | la_tormenta | espada | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | espada | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | espada | 15 | 285 | 0 | 5.0 | 14.2 | 31 | 0/0 |
| la_tormenta | el_muro | espada | 0 | 300 | 0 | 0.0 | 2.2 | 5 | 0/0 |
| la_tormenta | el_misil | espada | 1 | 299 | 0 | 0.3 | 2.0 | 2 | 0/0 |
| la_tormenta | el_intocable | espada | 260 | 40 | 0 | 86.7 | 2.0 | 3 | 0/0 |
| la_tormenta | la_tormenta | espada | 4 | 296 | 0 | 1.3 | 2.0 | 3 | 0/0 |
| la_tormenta | el_vidrio | espada | 0 | 300 | 0 | 0.0 | 2.0 | 3 | 0/0 |
| la_tormenta | el_goliat | espada | 3 | 297 | 0 | 1.0 | 2.4 | 4 | 0/0 |
| el_vidrio | el_muro | espada | 7 | 293 | 0 | 2.3 | 3.4 | 6 | 0/0 |
| el_vidrio | el_misil | espada | 190 | 110 | 0 | 63.3 | 2.0 | 3 | 0/0 |
| el_vidrio | el_intocable | espada | 259 | 41 | 0 | 86.3 | 2.1 | 4 | 0/0 |
| el_vidrio | la_tormenta | espada | 185 | 115 | 0 | 61.7 | 2.0 | 3 | 0/0 |
| el_vidrio | el_vidrio | espada | 103 | 197 | 0 | 34.3 | 2.5 | 5 | 0/0 |
| el_vidrio | el_goliat | espada | 60 | 240 | 0 | 20.0 | 3.2 | 4 | 0/0 |
| el_goliat | el_muro | espada | 4 | 293 | 3 | 1.3 | 4.4 | 31 | 0/0 |
| el_goliat | el_misil | espada | 91 | 209 | 0 | 30.3 | 2.8 | 4 | 0/0 |
| el_goliat | el_intocable | espada | 3 | 297 | 0 | 1.0 | 5.7 | 31 | 0/0 |
| el_goliat | la_tormenta | espada | 94 | 206 | 0 | 31.3 | 2.9 | 4 | 0/0 |
| el_goliat | el_vidrio | espada | 259 | 41 | 0 | 86.3 | 2.8 | 3 | 0/0 |
| el_goliat | el_goliat | espada | 1 | 299 | 0 | 0.3 | 3.5 | 8 | 0/0 |