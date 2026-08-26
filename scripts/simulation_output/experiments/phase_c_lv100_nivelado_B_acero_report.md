# Laboratorio Fase C — Arma vs Grados de Armadura

Config: sims/par=200 | nivel=100 | nominalDamage=20 | tier=B | material=acero (natural) | maxRounds=30
Dummys idénticos en stats, nivel e IA; única variable = cobertura de armadura | arquetipo=nivelado (Nivelado)
Método: swap de orden de ataque por sim (anula el sesgo del primer atacante); cada 200 combates se rota el grado de cobertura de la armadura.

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

## Duración por par (avgRounds)
| Arma | Par (A vs B) | avgRounds | maxRounds | t/o |
| --- | --- | --- | --- | --- |
| cortante | none vs none | 2.0 | 2 | 0 |
| cortante | ligera vs ligera | 2.0 | 2 | 0 |
| cortante | media vs media | 2.0 | 2 | 0 |
| cortante | alta vs alta | 2.0 | 2 | 0 |
| cortante | total vs total | 2.0 | 2 | 0 |

## Daño promedio por golpe (A)
| Arma | Par (A vs B) | dmgA | dmgB | mat/hitA | absorbA | maxResistA | piezasRotasA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cortante | none vs none | 41 | 41 | 55 | 0 | 0 | 0 |
| cortante | ligera vs ligera | 41 | 41 | 55 | 110 | 384 | 1 |
| cortante | media vs media | 41 | 41 | 55 | 110 | 384 | 1 |
| cortante | alta vs alta | 41 | 41 | 55 | 110 | 384 | 1 |
| cortante | total vs total | 41 | 41 | 55 | 110 | 384 | 1 |

## Invariantes
- Winrate espejo en 50±5%: ✅ OK
- Sin timeouts: ✅ OK