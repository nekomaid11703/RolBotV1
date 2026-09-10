# Laboratorio Fase C — Arma vs Grados de Armadura

Config: sims/par=40 | nivel=300 | nominalDamage=20 | tier=B | maxRounds=30
Dummys idénticos en stats, nivel e IA; única variable = cobertura de armadura | arquetipo=nivelado (Nivelado)
Método: swap de orden de ataque por sim (anula el sesgo del primer atacante); cada 40 combates se rota el grado de cobertura de la armadura.

Armadura por grado: cobertura afecta MSPD (penalización 0.1→0.4) y fatiga de movimiento (×1.05→×1.5); la pieza más pesada manda.
Nota: la armadura NO mitiga el daño corporal (el bonusDef solo sesga la reacción de bloqueo); absorbe daño material (durabilidad).
Lectura: la DIAGONAL (espejo) debe quedar ~50%. Las celdas off-diagonal muestran cuánto protege la cobertura de A contra la cobertura de B con la misma arma.

## Cortante — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | - | - | - | - |
| Ligera | - | 50.0% | - | - | - |
| Media | - | - | 50.0% | - | - |
| Alta | - | - | - | 50.0% | - |
| Total | - | - | - | - | 50.0% |

## Contundente — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | - | - | - | - |
| Ligera | - | 50.0% | - | - | - |
| Media | - | - | 50.0% | - | - |
| Alta | - | - | - | 50.0% | - |
| Total | - | - | - | - | 50.0% |

## Perforante — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | - | - | - | - |
| Ligera | - | 50.0% | - | - | - |
| Media | - | - | 50.0% | - | - |
| Alta | - | - | - | 50.0% | - |
| Total | - | - | - | - | 50.0% |

## Proyectil — winrate A% (A=covA vs B=covB, misma arma)
| A\B | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- |
| None | 50.0% | - | - | - | - |
| Ligera | - | 50.0% | - | - | - |
| Media | - | - | 50.0% | - | - |
| Alta | - | - | - | 50.0% | - |
| Total | - | - | - | - | 50.0% |

## Duración por par (avgRounds)
| Arma | Par (A vs B) | avgRounds | maxRounds | t/o |
| --- | --- | --- | --- | --- |
| cortante | none vs none | 3.0 | 3 | 0 |
| cortante | ligera vs ligera | 3.0 | 3 | 0 |
| cortante | media vs media | 3.0 | 3 | 0 |
| cortante | alta vs alta | 3.0 | 3 | 0 |
| cortante | total vs total | 3.0 | 3 | 0 |
| contundente | none vs none | 3.0 | 3 | 0 |
| contundente | ligera vs ligera | 3.0 | 3 | 0 |
| contundente | media vs media | 3.0 | 3 | 0 |
| contundente | alta vs alta | 3.0 | 3 | 0 |
| contundente | total vs total | 3.0 | 3 | 0 |
| perforante | none vs none | 3.0 | 3 | 0 |
| perforante | ligera vs ligera | 3.0 | 3 | 0 |
| perforante | media vs media | 3.0 | 3 | 0 |
| perforante | alta vs alta | 3.0 | 3 | 0 |
| perforante | total vs total | 3.0 | 3 | 0 |
| proyectil | none vs none | 2.0 | 2 | 0 |
| proyectil | ligera vs ligera | 2.0 | 2 | 0 |
| proyectil | media vs media | 2.0 | 2 | 0 |
| proyectil | alta vs alta | 2.0 | 2 | 0 |
| proyectil | total vs total | 2.0 | 2 | 0 |

## Daño promedio por golpe (A)
| Arma | Par (A vs B) | dmgA | dmgB | mat/hitA | absorbA | maxResistA | piezasRotasA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cortante | none vs none | 63 | 63 | 63 | 0 | 0 | 0 |
| cortante | ligera vs ligera | 63 | 63 | 63 | 63 | 324 | 0 |
| cortante | media vs media | 63 | 63 | 63 | 63 | 324 | 0 |
| cortante | alta vs alta | 63 | 63 | 63 | 63 | 324 | 0 |
| cortante | total vs total | 59.8 | 59.8 | 63 | 189 | 324 | 2 |
| contundente | none vs none | 53 | 53 | 79 | 0 | 0 | 0 |
| contundente | ligera vs ligera | 53 | 53 | 79 | 158 | 324 | 1 |
| contundente | media vs media | 53 | 53 | 79 | 237 | 324 | 2 |
| contundente | alta vs alta | 53 | 53 | 79 | 237 | 324 | 2 |
| contundente | total vs total | 50.4 | 50.4 | 79 | 237 | 324 | 2 |
| perforante | none vs none | 70 | 70 | 35 | 0 | 0 | 0 |
| perforante | ligera vs ligera | 70 | 70 | 35 | 35 | 324 | 0 |
| perforante | media vs media | 70 | 70 | 35 | 35 | 324 | 0 |
| perforante | alta vs alta | 70 | 70 | 35 | 35 | 324 | 0 |
| perforante | total vs total | 65.8 | 65.8 | 35 | 35 | 324 | 0 |
| proyectil | none vs none | 56 | 56 | 28 | 0 | 0 | 0 |
| proyectil | ligera vs ligera | 56 | 56 | 28 | 84 | 324 | 1 |
| proyectil | media vs media | 56 | 56 | 28 | 84 | 324 | 1 |
| proyectil | alta vs alta | 56.3 | 56.3 | 28 | 84 | 324 | 1 |
| proyectil | total vs total | 57.5 | 57.5 | 28.8 | 84 | 324 | 1 |

## Invariantes
- Winrate espejo en 50±5%: ✅ OK
- Sin timeouts: ✅ OK