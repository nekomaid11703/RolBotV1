# Stress Test — Fase A (none)

Config: sims=100/par | nivel=100 | maxRounds=30 | armas=none
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ❌ VIOLADO
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (10 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 3 | 21 |
| el_misil | el_misil | none | 1 | 21 |
| el_misil | la_tormenta | none | 1 | 21 |
| el_intocable | el_intocable | none | 23 | 21 |
| la_tormenta | la_tormenta | none | 3 | 21 |
| la_tormenta | el_vidrio | none | 1 | 21 |
| el_vidrio | el_misil | none | 1 | 21 |
| el_vidrio | el_vidrio | none | 1 | 21 |
| el_goliat | la_tormenta | none | 2 | 21 |
| el_goliat | el_goliat | none | 4 | 21 |

## ⚠️ Daño inválido detectado (23 pares)
| Build A | Build B | Arma | bad A | bad B | razones |
| --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 244 | 119 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_muro | el_misil | none | 8 | 0 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_muro | el_intocable | none | 3678 | 10 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_muro | la_tormenta | none | 23 | 0 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_muro | el_vidrio | none | 100 | 0 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_muro | el_goliat | none | 28 | 78 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_misil | el_muro | none | 0 | 3 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_misil | el_intocable | none | 63 | 0 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_misil | el_goliat | none | 0 | 10 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_intocable | el_muro | none | 16 | 3741 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_intocable | el_intocable | none | 1869 | 1973 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_intocable | el_goliat | none | 0 | 2039 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| la_tormenta | el_muro | none | 0 | 25 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| la_tormenta | el_goliat | none | 0 | 205 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_vidrio | el_muro | none | 0 | 110 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_vidrio | el_intocable | none | 100 | 20 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_vidrio | el_goliat | none | 0 | 104 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_goliat | el_muro | none | 78 | 8 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_goliat | el_misil | none | 32 | 0 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_goliat | el_intocable | none | 2001 | 1 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_goliat | la_tormenta | none | 199 | 0 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_goliat | el_vidrio | none | 142 | 0 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |
| el_goliat | el_goliat | none | 393 | 193 | zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado); zero damage (nature=desarmado, weapon=desarmado) |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 42 | 55 | 3 | 42.0 | 21.0 | 21 | 244/119 |
| el_muro | el_misil | none | 98 | 2 | 0 | 98.0 | 11.7 | 21 | 8/0 |
| el_muro | el_intocable | none | 100 | 0 | 0 | 100.0 | 21.0 | 21 | 3678/10 |
| el_muro | la_tormenta | none | 100 | 0 | 0 | 100.0 | 11.9 | 21 | 23/0 |
| el_muro | el_vidrio | none | 97 | 3 | 0 | 97.0 | 18.3 | 21 | 100/0 |
| el_muro | el_goliat | none | 0 | 100 | 0 | 0.0 | 21.0 | 21 | 28/78 |
| el_misil | el_muro | none | 1 | 99 | 0 | 1.0 | 11.7 | 21 | 0/3 |
| el_misil | el_misil | none | 43 | 56 | 1 | 43.0 | 4.1 | 21 | 0/0 |
| el_misil | el_intocable | none | 86 | 14 | 0 | 86.0 | 2.6 | 13 | 63/0 |
| el_misil | la_tormenta | none | 45 | 54 | 1 | 45.0 | 3.8 | 21 | 0/0 |
| el_misil | el_vidrio | none | 39 | 61 | 0 | 39.0 | 4.2 | 21 | 0/0 |
| el_misil | el_goliat | none | 45 | 55 | 0 | 45.0 | 6.1 | 21 | 0/10 |
| el_intocable | el_muro | none | 0 | 100 | 0 | 0.0 | 21.0 | 21 | 16/3741 |
| el_intocable | el_misil | none | 0 | 100 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | none | 30 | 47 | 23 | 30.0 | 20.8 | 21 | 1869/1973 |
| el_intocable | la_tormenta | none | 0 | 100 | 0 | 0.0 | 1.1 | 2 | 0/0 |
| el_intocable | el_vidrio | none | 0 | 100 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | none | 0 | 100 | 0 | 0.0 | 21.0 | 21 | 0/2039 |
| la_tormenta | el_muro | none | 0 | 100 | 0 | 0.0 | 12.0 | 21 | 0/25 |
| la_tormenta | el_misil | none | 41 | 59 | 0 | 41.0 | 3.5 | 21 | 0/0 |
| la_tormenta | el_intocable | none | 98 | 2 | 0 | 98.0 | 2.0 | 3 | 0/0 |
| la_tormenta | la_tormenta | none | 43 | 54 | 3 | 43.0 | 5.6 | 21 | 0/0 |
| la_tormenta | el_vidrio | none | 6 | 93 | 1 | 6.0 | 3.9 | 21 | 0/0 |
| la_tormenta | el_goliat | none | 5 | 95 | 0 | 5.0 | 9.1 | 21 | 0/205 |
| el_vidrio | el_muro | none | 3 | 97 | 0 | 3.0 | 17.9 | 21 | 0/110 |
| el_vidrio | el_misil | none | 46 | 53 | 1 | 46.0 | 4.7 | 21 | 0/0 |
| el_vidrio | el_intocable | none | 96 | 4 | 0 | 96.0 | 3.0 | 21 | 100/20 |
| el_vidrio | la_tormenta | none | 87 | 13 | 0 | 87.0 | 3.2 | 21 | 0/0 |
| el_vidrio | el_vidrio | none | 41 | 58 | 1 | 41.0 | 4.3 | 21 | 0/0 |
| el_vidrio | el_goliat | none | 81 | 19 | 0 | 81.0 | 10.4 | 21 | 0/104 |
| el_goliat | el_muro | none | 100 | 0 | 0 | 100.0 | 21.0 | 21 | 78/8 |
| el_goliat | el_misil | none | 53 | 47 | 0 | 53.0 | 5.7 | 21 | 32/0 |
| el_goliat | el_intocable | none | 100 | 0 | 0 | 100.0 | 21.0 | 21 | 2001/1 |
| el_goliat | la_tormenta | none | 97 | 1 | 2 | 97.0 | 9.1 | 21 | 199/0 |
| el_goliat | el_vidrio | none | 14 | 86 | 0 | 14.0 | 10.3 | 21 | 142/0 |
| el_goliat | el_goliat | none | 46 | 50 | 4 | 46.0 | 21.0 | 21 | 393/193 |