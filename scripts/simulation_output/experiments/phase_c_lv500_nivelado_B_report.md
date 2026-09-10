# Laboratorio Fase C — Arma vs Grados de Armadura

Config: sims/par=300 | nivel=500 | nominalDamage=20 | tier=B | maxRounds=30
Dummys idénticos en stats, nivel e IA; única variable = cobertura de armadura | arquetipo=nivelado (Nivelado)
Método: swap de orden de ataque por sim (anula el sesgo del primer atacante); cada 300 combates se rota el grado de cobertura de la armadura.

Armadura por grado: cobertura afecta MSPD (penalización 0.1→0.4) y fatiga de movimiento (×1.05→×1.5); la pieza más pesada manda.
Nota: la armadura NO mitiga el daño corporal (el bonusDef solo sesga la reacción de bloqueo); absorbe daño material (durabilidad).
Lectura: la DIAGONAL (espejo) debe quedar ~50%. Las celdas off-diagonal muestran cuánto protege la cobertura de A contra la cobertura de B con la misma arma.

## Cortante — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Total |
| --- | --- | --- | --- | --- |
| None | 50.0% | 50.0% | 50.0% | 50.0% |
| Ligera | 50.0% | 50.0% | 50.0% | 50.0% |
| Media | 50.0% | 50.0% | 50.0% | 50.0% |
| Total | 50.0% | 50.0% | 50.0% | 50.0% |

## Contundente — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Total |
| --- | --- | --- | --- | --- |
| None | 50.0% | 50.0% | 50.0% | 50.0% |
| Ligera | 50.0% | 50.0% | 50.0% | 50.0% |
| Media | 50.0% | 50.0% | 50.0% | 50.0% |
| Total | 50.0% | 50.0% | 50.0% | 50.0% |

## Perforante — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Total |
| --- | --- | --- | --- | --- |
| None | 50.0% | 50.0% | 50.0% | 50.0% |
| Ligera | 50.0% | 50.0% | 50.0% | 50.0% |
| Media | 50.0% | 50.0% | 50.0% | 50.0% |
| Total | 50.0% | 50.0% | 50.0% | 50.0% |

## Proyectil — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Total |
| --- | --- | --- | --- | --- |
| None | 50.0% | 50.0% | 50.0% | 50.0% |
| Ligera | 50.0% | 50.0% | 50.0% | 50.0% |
| Media | 50.0% | 50.0% | 50.0% | 50.0% |
| Total | 50.0% | 50.0% | 50.0% | 50.0% |

## Duración por par (avgRounds)
| Arma | Par (A vs B) | avgRounds | maxRounds | t/o |
| --- | --- | --- | --- | --- |
| cortante | none vs none | 5.0 | 5 | 0 |
| cortante | none vs ligera | 5.0 | 5 | 0 |
| cortante | none vs media | 5.0 | 5 | 0 |
| cortante | none vs total | 5.0 | 5 | 0 |
| cortante | ligera vs none | 5.0 | 5 | 0 |
| cortante | ligera vs ligera | 5.0 | 5 | 0 |
| cortante | ligera vs media | 5.0 | 5 | 0 |
| cortante | ligera vs total | 5.0 | 5 | 0 |
| cortante | media vs none | 5.0 | 5 | 0 |
| cortante | media vs ligera | 5.0 | 5 | 0 |
| cortante | media vs media | 5.0 | 5 | 0 |
| cortante | media vs total | 5.0 | 5 | 0 |
| cortante | total vs none | 5.0 | 5 | 0 |
| cortante | total vs ligera | 5.0 | 5 | 0 |
| cortante | total vs media | 5.0 | 5 | 0 |
| cortante | total vs total | 5.0 | 5 | 0 |
| contundente | none vs none | 5.0 | 5 | 0 |
| contundente | none vs ligera | 5.5 | 6 | 0 |
| contundente | none vs media | 5.5 | 6 | 0 |
| contundente | none vs total | 5.5 | 6 | 0 |
| contundente | ligera vs none | 5.5 | 6 | 0 |
| contundente | ligera vs ligera | 5.0 | 5 | 0 |
| contundente | ligera vs media | 5.5 | 6 | 0 |
| contundente | ligera vs total | 5.5 | 6 | 0 |
| contundente | media vs none | 5.5 | 6 | 0 |
| contundente | media vs ligera | 5.5 | 6 | 0 |
| contundente | media vs media | 5.0 | 5 | 0 |
| contundente | media vs total | 5.5 | 6 | 0 |
| contundente | total vs none | 5.5 | 6 | 0 |
| contundente | total vs ligera | 5.5 | 6 | 0 |
| contundente | total vs media | 5.5 | 6 | 0 |
| contundente | total vs total | 5.0 | 5 | 0 |
| perforante | none vs none | 4.0 | 4 | 0 |
| perforante | none vs ligera | 4.0 | 4 | 0 |
| perforante | none vs media | 4.0 | 4 | 0 |
| perforante | none vs total | 4.0 | 4 | 0 |
| perforante | ligera vs none | 4.0 | 4 | 0 |
| perforante | ligera vs ligera | 4.0 | 4 | 0 |
| perforante | ligera vs media | 4.0 | 4 | 0 |
| perforante | ligera vs total | 4.0 | 4 | 0 |
| perforante | media vs none | 4.0 | 4 | 0 |
| perforante | media vs ligera | 4.0 | 4 | 0 |
| perforante | media vs media | 4.0 | 4 | 0 |
| perforante | media vs total | 4.0 | 4 | 0 |
| perforante | total vs none | 4.0 | 4 | 0 |
| perforante | total vs ligera | 4.0 | 4 | 0 |
| perforante | total vs media | 4.0 | 4 | 0 |
| perforante | total vs total | 4.0 | 4 | 0 |
| proyectil | none vs none | 3.0 | 3 | 0 |
| proyectil | none vs ligera | 3.0 | 3 | 0 |
| proyectil | none vs media | 3.0 | 3 | 0 |
| proyectil | none vs total | 3.0 | 3 | 0 |
| proyectil | ligera vs none | 3.0 | 3 | 0 |
| proyectil | ligera vs ligera | 3.0 | 3 | 0 |
| proyectil | ligera vs media | 3.0 | 3 | 0 |
| proyectil | ligera vs total | 3.0 | 3 | 0 |
| proyectil | media vs none | 3.0 | 3 | 0 |
| proyectil | media vs ligera | 3.0 | 3 | 0 |
| proyectil | media vs media | 3.0 | 3 | 0 |
| proyectil | media vs total | 3.0 | 3 | 0 |
| proyectil | total vs none | 3.0 | 3 | 0 |
| proyectil | total vs ligera | 3.0 | 3 | 0 |
| proyectil | total vs media | 3.0 | 3 | 0 |
| proyectil | total vs total | 3.0 | 3 | 0 |

## Daño promedio por golpe (A)
| Arma | Par (A vs B) | dmgA | dmgB | mat/hitA | absorbA | maxResistA | piezasRotasA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cortante | none vs none | 58.3 | 58.3 | 74 | 0 | 0 | 0 |
| cortante | none vs ligera | 58.3 | 56 | 74 | 111 | 162 | 1 |
| cortante | none vs media | 58.3 | 56 | 74 | 111 | 162 | 1 |
| cortante | none vs total | 58.3 | 56 | 74 | 111 | 162 | 1 |
| cortante | ligera vs none | 56 | 58.3 | 74 | 111 | 162 | 1 |
| cortante | ligera vs ligera | 58.3 | 58.3 | 74 | 222 | 324 | 2 |
| cortante | ligera vs media | 58.3 | 56 | 74 | 222 | 324 | 2 |
| cortante | ligera vs total | 58.3 | 56 | 74 | 222 | 324 | 2 |
| cortante | media vs none | 56 | 58.3 | 74 | 111 | 162 | 1 |
| cortante | media vs ligera | 56 | 58.3 | 74 | 222 | 324 | 2 |
| cortante | media vs media | 58.3 | 58.3 | 74 | 222 | 324 | 2 |
| cortante | media vs total | 58.3 | 56 | 74 | 222 | 324 | 2 |
| cortante | total vs none | 56 | 58.3 | 74 | 111 | 162 | 1 |
| cortante | total vs ligera | 56 | 58.3 | 74 | 222 | 324 | 2 |
| cortante | total vs media | 56 | 58.3 | 74 | 222 | 324 | 2 |
| cortante | total vs total | 58.3 | 58.3 | 74 | 222 | 324 | 2 |
| contundente | none vs none | 51 | 51 | 97 | 0 | 0 | 0 |
| contundente | none vs ligera | 50.8 | 49 | 97 | 162 | 162 | 2 |
| contundente | none vs media | 50.8 | 49 | 97 | 162 | 162 | 2 |
| contundente | none vs total | 50.8 | 49 | 97 | 162 | 162 | 2 |
| contundente | ligera vs none | 49 | 50.8 | 97 | 162 | 162 | 2 |
| contundente | ligera vs ligera | 51 | 51 | 97 | 291 | 324 | 3 |
| contundente | ligera vs media | 50.8 | 49 | 97 | 307.5 | 324 | 3.5 |
| contundente | ligera vs total | 50.8 | 49 | 97 | 307.5 | 324 | 3.5 |
| contundente | media vs none | 49 | 50.8 | 97 | 162 | 162 | 2 |
| contundente | media vs ligera | 49 | 50.8 | 97 | 307.5 | 324 | 3.5 |
| contundente | media vs media | 51 | 51 | 97 | 291 | 324 | 3 |
| contundente | media vs total | 50.8 | 49 | 97 | 307.5 | 324 | 3.5 |
| contundente | total vs none | 49 | 50.8 | 97 | 162 | 162 | 2 |
| contundente | total vs ligera | 49 | 50.8 | 97 | 307.5 | 324 | 3.5 |
| contundente | total vs media | 49 | 50.8 | 97 | 307.5 | 324 | 3.5 |
| contundente | total vs total | 51 | 51 | 97 | 291 | 324 | 3 |
| perforante | none vs none | 70.7 | 70.7 | 44 | 0 | 0 | 0 |
| perforante | none vs ligera | 70.7 | 67 | 44 | 44 | 162 | 0.5 |
| perforante | none vs media | 70.7 | 67 | 44 | 44 | 162 | 0.5 |
| perforante | none vs total | 70.7 | 67 | 44 | 44 | 162 | 0.5 |
| perforante | ligera vs none | 67 | 70.7 | 44 | 44 | 162 | 0.5 |
| perforante | ligera vs ligera | 70.7 | 70.7 | 44 | 88 | 324 | 1 |
| perforante | ligera vs media | 70.7 | 67 | 44 | 88 | 324 | 1 |
| perforante | ligera vs total | 70.7 | 67 | 44 | 88 | 324 | 1 |
| perforante | media vs none | 67 | 70.7 | 44 | 44 | 162 | 0.5 |
| perforante | media vs ligera | 67 | 70.7 | 44 | 88 | 324 | 1 |
| perforante | media vs media | 70.7 | 70.7 | 44 | 88 | 324 | 1 |
| perforante | media vs total | 70.7 | 67 | 44 | 88 | 324 | 1 |
| perforante | total vs none | 67 | 70.7 | 44 | 44 | 162 | 0.5 |
| perforante | total vs ligera | 67 | 70.7 | 44 | 88 | 324 | 1 |
| perforante | total vs media | 67 | 70.7 | 44 | 88 | 324 | 1 |
| perforante | total vs total | 70.7 | 70.7 | 44 | 88 | 324 | 1 |
| proyectil | none vs none | 66 | 66 | 33 | 0 | 0 | 0 |
| proyectil | none vs ligera | 66 | 66 | 33 | 66 | 162 | 0.5 |
| proyectil | none vs media | 66 | 66 | 33 | 66 | 162 | 0.5 |
| proyectil | none vs total | 66 | 66.4 | 33 | 66 | 162 | 0.5 |
| proyectil | ligera vs none | 66 | 66 | 33 | 66 | 162 | 0.5 |
| proyectil | ligera vs ligera | 66 | 66 | 33 | 132 | 324 | 1 |
| proyectil | ligera vs media | 66 | 66 | 33 | 132 | 324 | 1 |
| proyectil | ligera vs total | 66 | 66.4 | 33 | 132 | 324 | 1 |
| proyectil | media vs none | 66 | 66 | 33 | 66 | 162 | 0.5 |
| proyectil | media vs ligera | 66 | 66 | 33 | 132 | 324 | 1 |
| proyectil | media vs media | 66 | 66 | 33 | 132 | 324 | 1 |
| proyectil | media vs total | 66 | 66.4 | 33 | 132 | 324 | 1 |
| proyectil | total vs none | 66.4 | 66 | 33.2 | 66 | 162 | 0.5 |
| proyectil | total vs ligera | 66.4 | 66 | 33.2 | 132 | 324 | 1 |
| proyectil | total vs media | 66.4 | 66 | 33.2 | 132 | 324 | 1 |
| proyectil | total vs total | 66.4 | 66.4 | 33.2 | 132 | 324 | 1 |

## Invariantes
- Winrate espejo en 50±5%: ✅ OK
- Sin timeouts: ✅ OK