# Laboratorio Fase C — Arma vs Grados de Armadura

Config: sims/par=1000 | nivel=300 | nominalDamage=20 | tier=B | maxRounds=30
Dummys idénticos en stats, nivel e IA; única variable = cobertura de armadura | arquetipo=nivelado (Nivelado)
Método: swap de orden de ataque por sim (anula el sesgo del primer atacante); cada 1000 combates se rota el grado de cobertura de la armadura.

Armadura por grado: cobertura afecta MSPD (penalización 0.1→0.4) y fatiga de movimiento (×1.05→×1.5); la pieza más pesada manda.
Nota: la armadura NO mitiga el daño corporal (el bonusDef solo sesga la reacción de bloqueo); absorbe daño material (durabilidad).
Lectura: la DIAGONAL (espejo) debe quedar ~50%. Las celdas off-diagonal muestran cuánto protege la cobertura de A contra la cobertura de B con la misma arma.

## Cortante — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| Ligera | 0.0% | 50.0% | 50.0% | 50.0% | 100.0% |
| Media | 0.0% | 50.0% | 50.0% | 50.0% | 100.0% |
| Alta | 0.0% | 50.0% | 50.0% | 50.0% | 100.0% |
| Total | 0.0% | 0.0% | 0.0% | 0.0% | 50.0% |

## Contundente — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | 50.0% | 100.0% | 100.0% | 100.0% |
| Ligera | 50.0% | 50.0% | 100.0% | 100.0% | 100.0% |
| Media | 0.0% | 0.0% | 50.0% | 50.0% | 50.0% |
| Alta | 0.0% | 0.0% | 50.0% | 50.0% | 50.0% |
| Total | 0.0% | 0.0% | 50.0% | 50.0% | 50.0% |

## Perforante — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| Ligera | 0.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| Media | 0.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| Alta | 0.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| Total | 0.0% | 50.0% | 50.0% | 50.0% | 50.0% |

## Proyectil — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| Ligera | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| Media | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| Alta | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| Total | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |

## Duración por par (avgRounds)
| Arma | Par (A vs B) | avgRounds | maxRounds | t/o |
| --- | --- | --- | --- | --- |
| cortante | none vs none | 3.0 | 3 | 0 |
| cortante | none vs ligera | 4.0 | 5 | 0 |
| cortante | none vs media | 4.0 | 5 | 0 |
| cortante | none vs alta | 4.0 | 5 | 0 |
| cortante | none vs total | 3.0 | 3 | 0 |
| cortante | ligera vs none | 4.0 | 5 | 0 |
| cortante | ligera vs ligera | 3.0 | 3 | 0 |
| cortante | ligera vs media | 3.0 | 3 | 0 |
| cortante | ligera vs alta | 3.0 | 3 | 0 |
| cortante | ligera vs total | 3.0 | 3 | 0 |
| cortante | media vs none | 4.0 | 5 | 0 |
| cortante | media vs ligera | 3.0 | 3 | 0 |
| cortante | media vs media | 3.0 | 3 | 0 |
| cortante | media vs alta | 3.0 | 3 | 0 |
| cortante | media vs total | 3.0 | 3 | 0 |
| cortante | alta vs none | 4.0 | 5 | 0 |
| cortante | alta vs ligera | 3.0 | 3 | 0 |
| cortante | alta vs media | 3.0 | 3 | 0 |
| cortante | alta vs alta | 3.0 | 3 | 0 |
| cortante | alta vs total | 3.0 | 3 | 0 |
| cortante | total vs none | 3.0 | 3 | 0 |
| cortante | total vs ligera | 3.0 | 3 | 0 |
| cortante | total vs media | 3.0 | 3 | 0 |
| cortante | total vs alta | 3.0 | 3 | 0 |
| cortante | total vs total | 3.0 | 3 | 0 |
| contundente | none vs none | 3.0 | 3 | 0 |
| contundente | none vs ligera | 3.0 | 3 | 0 |
| contundente | none vs media | 3.0 | 3 | 0 |
| contundente | none vs alta | 3.0 | 3 | 0 |
| contundente | none vs total | 3.0 | 3 | 0 |
| contundente | ligera vs none | 3.0 | 3 | 0 |
| contundente | ligera vs ligera | 3.0 | 3 | 0 |
| contundente | ligera vs media | 3.0 | 3 | 0 |
| contundente | ligera vs alta | 3.0 | 3 | 0 |
| contundente | ligera vs total | 3.0 | 3 | 0 |
| contundente | media vs none | 3.0 | 3 | 0 |
| contundente | media vs ligera | 3.0 | 3 | 0 |
| contundente | media vs media | 3.0 | 3 | 0 |
| contundente | media vs alta | 3.0 | 3 | 0 |
| contundente | media vs total | 3.0 | 3 | 0 |
| contundente | alta vs none | 3.0 | 3 | 0 |
| contundente | alta vs ligera | 3.0 | 3 | 0 |
| contundente | alta vs media | 3.0 | 3 | 0 |
| contundente | alta vs alta | 3.0 | 3 | 0 |
| contundente | alta vs total | 3.0 | 3 | 0 |
| contundente | total vs none | 3.0 | 3 | 0 |
| contundente | total vs ligera | 3.0 | 3 | 0 |
| contundente | total vs media | 3.0 | 3 | 0 |
| contundente | total vs alta | 3.0 | 3 | 0 |
| contundente | total vs total | 3.0 | 3 | 0 |
| perforante | none vs none | 3.0 | 3 | 0 |
| perforante | none vs ligera | 4.0 | 5 | 0 |
| perforante | none vs media | 4.0 | 5 | 0 |
| perforante | none vs alta | 4.0 | 5 | 0 |
| perforante | none vs total | 3.0 | 3 | 0 |
| perforante | ligera vs none | 4.0 | 5 | 0 |
| perforante | ligera vs ligera | 3.0 | 3 | 0 |
| perforante | ligera vs media | 3.0 | 3 | 0 |
| perforante | ligera vs alta | 3.0 | 3 | 0 |
| perforante | ligera vs total | 3.0 | 3 | 0 |
| perforante | media vs none | 4.0 | 5 | 0 |
| perforante | media vs ligera | 3.0 | 3 | 0 |
| perforante | media vs media | 3.0 | 3 | 0 |
| perforante | media vs alta | 3.0 | 3 | 0 |
| perforante | media vs total | 3.0 | 3 | 0 |
| perforante | alta vs none | 4.0 | 5 | 0 |
| perforante | alta vs ligera | 3.0 | 3 | 0 |
| perforante | alta vs media | 3.0 | 3 | 0 |
| perforante | alta vs alta | 3.0 | 3 | 0 |
| perforante | alta vs total | 3.0 | 3 | 0 |
| perforante | total vs none | 3.0 | 3 | 0 |
| perforante | total vs ligera | 3.0 | 3 | 0 |
| perforante | total vs media | 3.0 | 3 | 0 |
| perforante | total vs alta | 3.0 | 3 | 0 |
| perforante | total vs total | 3.0 | 3 | 0 |
| proyectil | none vs none | 2.0 | 2 | 0 |
| proyectil | none vs ligera | 2.0 | 2 | 0 |
| proyectil | none vs media | 2.0 | 2 | 0 |
| proyectil | none vs alta | 2.0 | 2 | 0 |
| proyectil | none vs total | 2.0 | 2 | 0 |
| proyectil | ligera vs none | 2.0 | 2 | 0 |
| proyectil | ligera vs ligera | 2.0 | 2 | 0 |
| proyectil | ligera vs media | 2.0 | 2 | 0 |
| proyectil | ligera vs alta | 2.0 | 2 | 0 |
| proyectil | ligera vs total | 2.0 | 2 | 0 |
| proyectil | media vs none | 2.0 | 2 | 0 |
| proyectil | media vs ligera | 2.0 | 2 | 0 |
| proyectil | media vs media | 2.0 | 2 | 0 |
| proyectil | media vs alta | 2.0 | 2 | 0 |
| proyectil | media vs total | 2.0 | 2 | 0 |
| proyectil | alta vs none | 2.0 | 2 | 0 |
| proyectil | alta vs ligera | 2.0 | 2 | 0 |
| proyectil | alta vs media | 2.0 | 2 | 0 |
| proyectil | alta vs alta | 2.0 | 2 | 0 |
| proyectil | alta vs total | 2.0 | 2 | 0 |
| proyectil | total vs none | 2.0 | 2 | 0 |
| proyectil | total vs ligera | 2.0 | 2 | 0 |
| proyectil | total vs media | 2.0 | 2 | 0 |
| proyectil | total vs alta | 2.0 | 2 | 0 |
| proyectil | total vs total | 2.0 | 2 | 0 |

## Daño promedio por golpe (A)
| Arma | Par (A vs B) | dmgA | dmgB | mat/hitA | absorbA | maxResistA | piezasRotasA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cortante | none vs none | 63 | 63 | 63 | 0 | 0 | 0 |
| cortante | none vs ligera | 63 | 37.8 | 63 | 94.5 | 162 | 1 |
| cortante | none vs media | 63 | 37.8 | 63 | 94.5 | 162 | 1 |
| cortante | none vs alta | 63 | 37.8 | 63 | 94.5 | 162 | 1 |
| cortante | none vs total | 63 | 42 | 63 | 94.5 | 162 | 1 |
| cortante | ligera vs none | 37.8 | 63 | 63 | 94.5 | 162 | 1 |
| cortante | ligera vs ligera | 63 | 63 | 63 | 63 | 324 | 0 |
| cortante | ligera vs media | 63 | 59 | 63 | 63 | 324 | 0 |
| cortante | ligera vs alta | 63 | 59 | 63 | 63 | 324 | 0 |
| cortante | ligera vs total | 63 | 57.7 | 63 | 126 | 324 | 1 |
| cortante | media vs none | 37.8 | 63 | 63 | 94.5 | 162 | 1 |
| cortante | media vs ligera | 59 | 63 | 63 | 63 | 324 | 0 |
| cortante | media vs media | 63 | 63 | 63 | 63 | 324 | 0 |
| cortante | media vs alta | 63 | 59 | 63 | 63 | 324 | 0 |
| cortante | media vs total | 63 | 57.7 | 63 | 126 | 324 | 1 |
| cortante | alta vs none | 37.8 | 63 | 63 | 94.5 | 162 | 1 |
| cortante | alta vs ligera | 59 | 63 | 63 | 63 | 324 | 0 |
| cortante | alta vs media | 59 | 63 | 63 | 63 | 324 | 0 |
| cortante | alta vs alta | 63 | 63 | 63 | 63 | 324 | 0 |
| cortante | alta vs total | 63 | 57.7 | 63 | 126 | 324 | 1 |
| cortante | total vs none | 42 | 63 | 63 | 94.5 | 162 | 1 |
| cortante | total vs ligera | 57.7 | 63 | 63 | 126 | 324 | 1 |
| cortante | total vs media | 57.7 | 63 | 63 | 126 | 324 | 1 |
| cortante | total vs alta | 57.7 | 63 | 63 | 126 | 324 | 1 |
| cortante | total vs total | 59.8 | 59.8 | 63 | 189 | 324 | 2 |
| contundente | none vs none | 53 | 53 | 79 | 0 | 0 | 0 |
| contundente | none vs ligera | 53 | 53 | 79 | 79 | 162 | 0.5 |
| contundente | none vs media | 53 | 53 | 79 | 118.5 | 162 | 1 |
| contundente | none vs alta | 53 | 53 | 79 | 118.5 | 162 | 1 |
| contundente | none vs total | 53 | 39.8 | 79 | 118.5 | 162 | 1 |
| contundente | ligera vs none | 53 | 53 | 79 | 79 | 162 | 0.5 |
| contundente | ligera vs ligera | 53 | 53 | 79 | 158 | 324 | 1 |
| contundente | ligera vs media | 53 | 53 | 79 | 197.5 | 324 | 1.5 |
| contundente | ligera vs alta | 53 | 53 | 79 | 197.5 | 324 | 1.5 |
| contundente | ligera vs total | 53 | 49.8 | 79 | 197.5 | 324 | 1.5 |
| contundente | media vs none | 53 | 53 | 79 | 118.5 | 162 | 1 |
| contundente | media vs ligera | 53 | 53 | 79 | 197.5 | 324 | 1.5 |
| contundente | media vs media | 53 | 53 | 79 | 237 | 324 | 2 |
| contundente | media vs alta | 53 | 53 | 79 | 237 | 324 | 2 |
| contundente | media vs total | 53 | 50.4 | 79 | 237 | 324 | 2 |
| contundente | alta vs none | 53 | 53 | 79 | 118.5 | 162 | 1 |
| contundente | alta vs ligera | 53 | 53 | 79 | 197.5 | 324 | 1.5 |
| contundente | alta vs media | 53 | 53 | 79 | 237 | 324 | 2 |
| contundente | alta vs alta | 53 | 53 | 79 | 237 | 324 | 2 |
| contundente | alta vs total | 53 | 50.4 | 79 | 237 | 324 | 2 |
| contundente | total vs none | 39.8 | 53 | 79 | 118.5 | 162 | 1 |
| contundente | total vs ligera | 49.8 | 53 | 79 | 197.5 | 324 | 1.5 |
| contundente | total vs media | 50.4 | 53 | 79 | 237 | 324 | 2 |
| contundente | total vs alta | 50.4 | 53 | 79 | 237 | 324 | 2 |
| contundente | total vs total | 50.4 | 50.4 | 79 | 237 | 324 | 2 |
| perforante | none vs none | 70 | 70 | 35 | 0 | 0 | 0 |
| perforante | none vs ligera | 70 | 42 | 35 | 52.5 | 162 | 0.5 |
| perforante | none vs media | 70 | 42 | 35 | 52.5 | 162 | 0.5 |
| perforante | none vs alta | 70 | 42 | 35 | 52.5 | 162 | 0.5 |
| perforante | none vs total | 70 | 46.7 | 35 | 52.5 | 162 | 0.5 |
| perforante | ligera vs none | 42 | 70 | 35 | 52.5 | 162 | 0.5 |
| perforante | ligera vs ligera | 70 | 70 | 35 | 35 | 324 | 0 |
| perforante | ligera vs media | 70 | 65.8 | 35 | 35 | 324 | 0 |
| perforante | ligera vs alta | 70 | 65.8 | 35 | 35 | 324 | 0 |
| perforante | ligera vs total | 70 | 61.5 | 35 | 35 | 324 | 0 |
| perforante | media vs none | 42 | 70 | 35 | 52.5 | 162 | 0.5 |
| perforante | media vs ligera | 65.8 | 70 | 35 | 35 | 324 | 0 |
| perforante | media vs media | 70 | 70 | 35 | 35 | 324 | 0 |
| perforante | media vs alta | 70 | 65.8 | 35 | 35 | 324 | 0 |
| perforante | media vs total | 70 | 61.5 | 35 | 35 | 324 | 0 |
| perforante | alta vs none | 42 | 70 | 35 | 52.5 | 162 | 0.5 |
| perforante | alta vs ligera | 65.8 | 70 | 35 | 35 | 324 | 0 |
| perforante | alta vs media | 65.8 | 70 | 35 | 35 | 324 | 0 |
| perforante | alta vs alta | 70 | 70 | 35 | 35 | 324 | 0 |
| perforante | alta vs total | 70 | 61.5 | 35 | 35 | 324 | 0 |
| perforante | total vs none | 46.7 | 70 | 35 | 52.5 | 162 | 0.5 |
| perforante | total vs ligera | 61.5 | 70 | 35 | 35 | 324 | 0 |
| perforante | total vs media | 61.5 | 70 | 35 | 35 | 324 | 0 |
| perforante | total vs alta | 61.5 | 70 | 35 | 35 | 324 | 0 |
| perforante | total vs total | 65.8 | 65.8 | 35 | 35 | 324 | 0 |
| proyectil | none vs none | 56 | 56 | 28 | 0 | 0 | 0 |
| proyectil | none vs ligera | 56 | 56 | 28 | 42 | 162 | 0.5 |
| proyectil | none vs media | 56 | 56 | 28 | 42 | 162 | 0.5 |
| proyectil | none vs alta | 56 | 56.3 | 28 | 42 | 162 | 0.5 |
| proyectil | none vs total | 56 | 57.5 | 28 | 42 | 162 | 0.5 |
| proyectil | ligera vs none | 56 | 56 | 28 | 42 | 162 | 0.5 |
| proyectil | ligera vs ligera | 56 | 56 | 28 | 84 | 324 | 1 |
| proyectil | ligera vs media | 56 | 56 | 28 | 84 | 324 | 1 |
| proyectil | ligera vs alta | 56 | 56.3 | 28 | 84 | 324 | 1 |
| proyectil | ligera vs total | 56 | 57.5 | 28 | 84 | 324 | 1 |
| proyectil | media vs none | 56 | 56 | 28 | 42 | 162 | 0.5 |
| proyectil | media vs ligera | 56 | 56 | 28 | 84 | 324 | 1 |
| proyectil | media vs media | 56 | 56 | 28 | 84 | 324 | 1 |
| proyectil | media vs alta | 56 | 56.3 | 28 | 84 | 324 | 1 |
| proyectil | media vs total | 56 | 57.5 | 28 | 84 | 324 | 1 |
| proyectil | alta vs none | 56.3 | 56 | 28 | 42 | 162 | 0.5 |
| proyectil | alta vs ligera | 56.3 | 56 | 28 | 84 | 324 | 1 |
| proyectil | alta vs media | 56.3 | 56 | 28 | 84 | 324 | 1 |
| proyectil | alta vs alta | 56.3 | 56.3 | 28 | 84 | 324 | 1 |
| proyectil | alta vs total | 56.3 | 57.5 | 28 | 84 | 324 | 1 |
| proyectil | total vs none | 57.5 | 56 | 28.8 | 42 | 162 | 0.5 |
| proyectil | total vs ligera | 57.5 | 56 | 28.8 | 84 | 324 | 1 |
| proyectil | total vs media | 57.5 | 56 | 28.8 | 84 | 324 | 1 |
| proyectil | total vs alta | 57.5 | 56.3 | 28.8 | 84 | 324 | 1 |
| proyectil | total vs total | 57.5 | 57.5 | 28.8 | 84 | 324 | 1 |

## Invariantes
- Winrate espejo en 50±5%: ✅ OK
- Sin timeouts: ✅ OK