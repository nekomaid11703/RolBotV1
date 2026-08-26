# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=500 | nominal=20 | maxRounds=30
Niveles: 100, 300, 500 | Modos: actual | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |

## Nivel 300 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |

## Nivel 500 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Ligera | Media | Alta | Total |
| --- | --- | --- | --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% | 50.0% | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | actual | cortante | none vs none | 50.0 | 1.0 | 72 | 24 | 41 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs ligera | 0.0 | 1.5 | 10 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs media | 0.0 | 1.5 | 10 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs alta | 0.0 | 1.5 | 10 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs total | 0.0 | 1.5 | 10 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | cortante | ligera vs none | 100.0 | 1.5 | 72 | 10 | 41 | 0 | 0 | 41 | 324 | 0 |
| 100 | actual | cortante | ligera vs ligera | 50.0 | 5.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | ligera vs media | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | ligera vs alta | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | ligera vs total | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | media vs none | 100.0 | 1.5 | 72 | 10 | 41 | 0 | 0 | 41 | 324 | 0 |
| 100 | actual | cortante | media vs ligera | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | media vs media | 50.0 | 5.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | media vs alta | 50.0 | 6.5 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | media vs total | 50.0 | 6.5 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | alta vs none | 100.0 | 1.5 | 72 | 10 | 41 | 0 | 0 | 41 | 324 | 0 |
| 100 | actual | cortante | alta vs ligera | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | alta vs media | 50.0 | 6.5 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | alta vs alta | 50.0 | 5.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | alta vs total | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | total vs none | 100.0 | 1.5 | 72 | 10 | 41 | 0 | 0 | 41 | 324 | 0 |
| 100 | actual | cortante | total vs ligera | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | total vs media | 50.0 | 6.5 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | total vs alta | 50.0 | 6.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | cortante | total vs total | 50.0 | 5.0 | 10 | 39 | 0 | 3 | 18 | 164 | 324 | 1.5 |
| 100 | actual | contundente | none vs none | 50.0 | 1.0 | 68 | 24 | 45 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs ligera | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs media | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs alta | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs total | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | contundente | ligera vs none | 100.0 | 1.5 | 68 | 8 | 45 | 0 | 0 | 45 | 324 | 0 |
| 100 | actual | contundente | ligera vs ligera | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | ligera vs media | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | ligera vs alta | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | ligera vs total | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | media vs none | 100.0 | 1.5 | 68 | 8 | 45 | 0 | 0 | 45 | 324 | 0 |
| 100 | actual | contundente | media vs ligera | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | media vs media | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | media vs alta | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | media vs total | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | alta vs none | 100.0 | 1.5 | 68 | 8 | 45 | 0 | 0 | 45 | 324 | 0 |
| 100 | actual | contundente | alta vs ligera | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | alta vs media | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | alta vs alta | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | alta vs total | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | total vs none | 100.0 | 1.5 | 68 | 8 | 45 | 0 | 0 | 45 | 324 | 0 |
| 100 | actual | contundente | total vs ligera | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | total vs media | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | total vs alta | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | contundente | total vs total | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 13 | 225 | 324 | 2.5 |
| 100 | actual | perforante | none vs none | 50.0 | 1.0 | 53 | 24 | 21 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs ligera | 0.0 | 1.5 | 11 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs media | 0.0 | 1.5 | 11 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs alta | 0.0 | 1.5 | 11 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs total | 0.0 | 1.5 | 11 | 48 | 0 | 3 | 18 | 0 | 0 | 0 |
| 100 | actual | perforante | ligera vs none | 100.0 | 1.5 | 53 | 11 | 21 | 0 | 0 | 21 | 324 | 0 |
| 100 | actual | perforante | ligera vs ligera | 50.0 | 5.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | ligera vs media | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | ligera vs alta | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | ligera vs total | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | media vs none | 100.0 | 1.5 | 53 | 11 | 21 | 0 | 0 | 21 | 324 | 0 |
| 100 | actual | perforante | media vs ligera | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | media vs media | 50.0 | 5.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | media vs alta | 50.0 | 6.5 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | media vs total | 50.0 | 6.5 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | alta vs none | 100.0 | 1.5 | 53 | 11 | 21 | 0 | 0 | 21 | 324 | 0 |
| 100 | actual | perforante | alta vs ligera | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | alta vs media | 50.0 | 6.5 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | alta vs alta | 50.0 | 5.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | alta vs total | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | total vs none | 100.0 | 1.5 | 53 | 11 | 21 | 0 | 0 | 21 | 324 | 0 |
| 100 | actual | perforante | total vs ligera | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | total vs media | 50.0 | 6.5 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | total vs alta | 50.0 | 6.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | perforante | total vs total | 50.0 | 5.0 | 11 | 40.5 | 0 | 3 | 18 | 84 | 324 | 0.5 |
| 100 | actual | proyectil | none vs none | 50.0 | 2.0 | 34 | 41 | 11 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs ligera | 0.0 | 2.0 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs media | 0.0 | 2.0 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs alta | 0.0 | 2.0 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs total | 0.0 | 2.0 | 8 | 48 | 0 | 2 | 13 | 0 | 0 | 0 |
| 100 | actual | proyectil | ligera vs none | 100.0 | 2.0 | 34 | 12 | 11 | 0 | 0 | 16.5 | 324 | 0 |
| 100 | actual | proyectil | ligera vs ligera | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | ligera vs media | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | ligera vs alta | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | ligera vs total | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | media vs none | 100.0 | 2.0 | 34 | 12 | 11 | 0 | 0 | 16.5 | 324 | 0 |
| 100 | actual | proyectil | media vs ligera | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | media vs media | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | media vs alta | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | media vs total | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | alta vs none | 100.0 | 2.0 | 34 | 12 | 11 | 0 | 0 | 16.5 | 324 | 0 |
| 100 | actual | proyectil | alta vs ligera | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | alta vs media | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | alta vs alta | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | alta vs total | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | total vs none | 100.0 | 2.0 | 34 | 12 | 11 | 0 | 0 | 16.5 | 324 | 0 |
| 100 | actual | proyectil | total vs ligera | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | total vs media | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | total vs alta | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 100 | actual | proyectil | total vs total | 50.0 | 5.0 | 8 | 40 | 0 | 2 | 13 | 55 | 324 | 0 |
| 300 | actual | cortante | none vs none | 50.0 | 2.0 | 138 | 75 | 69 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs ligera | 50.0 | 5.5 | 34.7 | 144 | 4.3 | 6 | 32.6 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs media | 50.0 | 5.5 | 34.7 | 144 | 4.3 | 6 | 32.6 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs alta | 50.0 | 5.5 | 34.7 | 144 | 4.3 | 6 | 32.6 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs total | 50.0 | 5.5 | 34.7 | 144 | 4.3 | 6 | 32.6 | 0 | 0 | 0 |
| 300 | actual | cortante | ligera vs none | 50.0 | 5.5 | 46 | 87 | 23 | 0 | 0 | 226.5 | 384 | 2 |
| 300 | actual | cortante | ligera vs ligera | 50.0 | 6.0 | 29.7 | 129 | 2.7 | 6 | 32.9 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | ligera vs media | 50.0 | 6.0 | 29.7 | 126 | 2.7 | 6 | 32.9 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | ligera vs alta | 50.0 | 6.0 | 29.7 | 126 | 2.7 | 6 | 32.9 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | ligera vs total | 50.0 | 5.5 | 29.7 | 114 | 2.7 | 6 | 32.9 | 330 | 384 | 3 |
| 300 | actual | cortante | media vs none | 50.0 | 5.5 | 46 | 87 | 23 | 0 | 0 | 226.5 | 384 | 2 |
| 300 | actual | cortante | media vs ligera | 50.0 | 6.0 | 29.2 | 129 | 2.7 | 5.8 | 32.1 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | media vs media | 50.0 | 6.0 | 29.2 | 126 | 2.7 | 5.8 | 32.1 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | media vs alta | 50.0 | 6.0 | 29.2 | 126 | 2.7 | 5.8 | 32.1 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | media vs total | 50.0 | 5.5 | 29.2 | 114 | 2.7 | 5.8 | 32.1 | 330 | 384 | 3 |
| 300 | actual | cortante | alta vs none | 50.0 | 5.5 | 46 | 87 | 23 | 0 | 0 | 226.5 | 384 | 2 |
| 300 | actual | cortante | alta vs ligera | 50.0 | 6.0 | 29.2 | 129 | 2.7 | 5.8 | 32.1 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | alta vs media | 50.0 | 6.0 | 29.2 | 126 | 2.7 | 5.8 | 32.1 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | alta vs alta | 50.0 | 6.0 | 29.2 | 126 | 2.7 | 5.8 | 32.1 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | alta vs total | 50.0 | 5.5 | 29.2 | 114 | 2.7 | 5.8 | 32.1 | 330 | 384 | 3 |
| 300 | actual | cortante | total vs none | 50.0 | 5.5 | 46 | 87 | 23 | 0 | 0 | 226.5 | 384 | 2 |
| 300 | actual | cortante | total vs ligera | 50.0 | 5.5 | 29.7 | 129 | 3 | 5.7 | 31.5 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | total vs media | 50.0 | 5.5 | 29.7 | 126 | 3 | 5.7 | 31.5 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | total vs alta | 50.0 | 5.5 | 29.7 | 126 | 3 | 5.7 | 31.5 | 364.5 | 384 | 3.5 |
| 300 | actual | cortante | total vs total | 50.0 | 5.0 | 29.7 | 114 | 3 | 5.7 | 31.5 | 330 | 384 | 3 |
| 300 | actual | contundente | none vs none | 50.0 | 2.0 | 142 | 75 | 85 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs ligera | 50.0 | 5.0 | 32.2 | 146 | 6.8 | 5 | 26.7 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs media | 50.0 | 5.0 | 32.2 | 146 | 6.8 | 5 | 26.7 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs alta | 50.0 | 5.0 | 32.2 | 146 | 6.8 | 5 | 26.7 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs total | 50.0 | 5.0 | 32.2 | 146 | 6.8 | 5 | 26.7 | 0 | 0 | 0 |
| 300 | actual | contundente | ligera vs none | 50.0 | 5.0 | 53.3 | 84.5 | 31.9 | 0 | 0 | 234.5 | 384 | 2 |
| 300 | actual | contundente | ligera vs ligera | 50.0 | 5.0 | 25.8 | 113 | 4.6 | 5.1 | 27.6 | 362 | 384 | 3.5 |
| 300 | actual | contundente | ligera vs media | 50.0 | 5.0 | 25.8 | 113 | 4.6 | 5.1 | 27.6 | 362 | 384 | 3.5 |
| 300 | actual | contundente | ligera vs alta | 50.0 | 5.0 | 25.8 | 113 | 4.6 | 5.1 | 27.6 | 362 | 384 | 3.5 |
| 300 | actual | contundente | ligera vs total | 100.0 | 5.0 | 33 | 70 | 8.2 | 4.6 | 24.8 | 340 | 384 | 3 |
| 300 | actual | contundente | media vs none | 50.0 | 5.0 | 53.3 | 84.5 | 31.9 | 0 | 0 | 234.5 | 384 | 2 |
| 300 | actual | contundente | media vs ligera | 50.0 | 5.0 | 25.3 | 113 | 4.6 | 4.9 | 26.7 | 362 | 384 | 3.5 |
| 300 | actual | contundente | media vs media | 50.0 | 5.0 | 25.3 | 113 | 4.6 | 4.9 | 26.7 | 362 | 384 | 3.5 |
| 300 | actual | contundente | media vs alta | 50.0 | 5.0 | 25.3 | 113 | 4.6 | 4.9 | 26.7 | 362 | 384 | 3.5 |
| 300 | actual | contundente | media vs total | 100.0 | 5.0 | 32.6 | 70 | 8.2 | 4.4 | 24 | 340 | 384 | 3 |
| 300 | actual | contundente | alta vs none | 50.0 | 5.0 | 53.3 | 84.5 | 31.9 | 0 | 0 | 234.5 | 384 | 2 |
| 300 | actual | contundente | alta vs ligera | 50.0 | 5.0 | 25.3 | 113 | 4.6 | 4.9 | 26.7 | 362 | 384 | 3.5 |
| 300 | actual | contundente | alta vs media | 50.0 | 5.0 | 25.3 | 113 | 4.6 | 4.9 | 26.7 | 362 | 384 | 3.5 |
| 300 | actual | contundente | alta vs alta | 50.0 | 5.0 | 25.3 | 113 | 4.6 | 4.9 | 26.7 | 362 | 384 | 3.5 |
| 300 | actual | contundente | alta vs total | 100.0 | 5.0 | 32.6 | 70 | 8.2 | 4.4 | 24 | 340 | 384 | 3 |
| 300 | actual | contundente | total vs none | 50.0 | 5.0 | 53.3 | 84.5 | 31.9 | 0 | 0 | 234.5 | 384 | 2 |
| 300 | actual | contundente | total vs ligera | 0.0 | 5.0 | 17.5 | 150 | 0 | 5.3 | 29 | 384 | 384 | 4 |
| 300 | actual | contundente | total vs media | 0.0 | 5.0 | 17.5 | 150 | 0 | 5.3 | 29 | 384 | 384 | 4 |
| 300 | actual | contundente | total vs alta | 0.0 | 5.0 | 17.5 | 150 | 0 | 5.3 | 29 | 384 | 384 | 4 |
| 300 | actual | contundente | total vs total | 50.0 | 5.0 | 26.4 | 107 | 4.6 | 4.7 | 25.8 | 362 | 384 | 3.5 |
| 300 | actual | perforante | none vs none | 50.0 | 2.0 | 117 | 75 | 39 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs ligera | 50.0 | 5.5 | 27 | 133.5 | 0 | 8 | 43 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs media | 50.0 | 5.5 | 27 | 133.5 | 0 | 8 | 43 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs alta | 50.0 | 5.5 | 27 | 133.5 | 0 | 8 | 43 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs total | 50.0 | 5.5 | 27 | 133.5 | 0 | 8 | 43 | 0 | 0 | 0 |
| 300 | actual | perforante | ligera vs none | 50.0 | 5.5 | 39 | 88.5 | 13 | 0 | 0 | 136.5 | 384 | 1 |
| 300 | actual | perforante | ligera vs ligera | 50.0 | 5.0 | 26.3 | 125.5 | 0 | 7.8 | 42 | 195 | 384 | 1.5 |
| 300 | actual | perforante | ligera vs media | 50.0 | 5.0 | 26.3 | 122 | 0 | 7.8 | 42 | 195 | 384 | 1.5 |
| 300 | actual | perforante | ligera vs alta | 50.0 | 5.0 | 26.3 | 122 | 0 | 7.8 | 42 | 195 | 384 | 1.5 |
| 300 | actual | perforante | ligera vs total | 50.0 | 5.0 | 26.3 | 118.5 | 0 | 7.8 | 42 | 195 | 384 | 1.5 |
| 300 | actual | perforante | media vs none | 50.0 | 5.5 | 39 | 88.5 | 13 | 0 | 0 | 136.5 | 384 | 1 |
| 300 | actual | perforante | media vs ligera | 50.0 | 5.0 | 25.6 | 125.5 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | media vs media | 50.0 | 5.0 | 25.6 | 122 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | media vs alta | 50.0 | 5.0 | 25.6 | 122 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | media vs total | 50.0 | 5.0 | 25.6 | 118.5 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | alta vs none | 50.0 | 5.5 | 39 | 88.5 | 13 | 0 | 0 | 136.5 | 384 | 1 |
| 300 | actual | perforante | alta vs ligera | 50.0 | 5.0 | 25.6 | 125.5 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | alta vs media | 50.0 | 5.0 | 25.6 | 122 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | alta vs alta | 50.0 | 5.0 | 25.6 | 122 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | alta vs total | 50.0 | 5.0 | 25.6 | 118.5 | 0 | 7.6 | 41 | 195 | 384 | 1.5 |
| 300 | actual | perforante | total vs none | 50.0 | 5.5 | 39 | 88.5 | 13 | 0 | 0 | 136.5 | 384 | 1 |
| 300 | actual | perforante | total vs ligera | 50.0 | 5.0 | 24.9 | 125.5 | 0 | 7.4 | 40 | 195 | 384 | 1.5 |
| 300 | actual | perforante | total vs media | 50.0 | 5.0 | 24.9 | 122 | 0 | 7.4 | 40 | 195 | 384 | 1.5 |
| 300 | actual | perforante | total vs alta | 50.0 | 5.0 | 24.9 | 122 | 0 | 7.4 | 40 | 195 | 384 | 1.5 |
| 300 | actual | perforante | total vs total | 50.0 | 5.0 | 24.9 | 118.5 | 0 | 7.4 | 40 | 195 | 384 | 1.5 |
| 300 | actual | proyectil | none vs none | 50.0 | 2.0 | 97 | 123.5 | 32 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs ligera | 50.0 | 3.0 | 22 | 123.5 | 0 | 7 | 36 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs media | 50.0 | 3.0 | 22 | 123.5 | 0 | 7 | 36 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs alta | 50.0 | 3.0 | 22 | 124.5 | 0 | 7 | 36 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs total | 0.0 | 2.5 | 22 | 150 | 0 | 7 | 36 | 0 | 0 | 0 |
| 300 | actual | proyectil | ligera vs none | 50.0 | 3.0 | 97 | 86 | 32 | 0 | 0 | 128 | 384 | 1 |
| 300 | actual | proyectil | ligera vs ligera | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36 | 128 | 384 | 1 |
| 300 | actual | proyectil | ligera vs media | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36 | 128 | 384 | 1 |
| 300 | actual | proyectil | ligera vs alta | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36 | 128.5 | 384 | 1 |
| 300 | actual | proyectil | ligera vs total | 50.0 | 4.0 | 22 | 87 | 0 | 7 | 36 | 129.5 | 384 | 1 |
| 300 | actual | proyectil | media vs none | 50.0 | 3.0 | 97 | 86 | 32 | 0 | 0 | 128 | 384 | 1 |
| 300 | actual | proyectil | media vs ligera | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36 | 128 | 384 | 1 |
| 300 | actual | proyectil | media vs media | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36 | 128 | 384 | 1 |
| 300 | actual | proyectil | media vs alta | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36 | 128.5 | 384 | 1 |
| 300 | actual | proyectil | media vs total | 50.0 | 4.0 | 22 | 87 | 0 | 7 | 36 | 129.5 | 384 | 1 |
| 300 | actual | proyectil | alta vs none | 50.0 | 3.0 | 97.7 | 86 | 32.3 | 0 | 0 | 128 | 384 | 1 |
| 300 | actual | proyectil | alta vs ligera | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36.1 | 128 | 384 | 1 |
| 300 | actual | proyectil | alta vs media | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36.1 | 128 | 384 | 1 |
| 300 | actual | proyectil | alta vs alta | 50.0 | 4.0 | 22 | 86 | 0 | 7 | 36.1 | 128.5 | 384 | 1 |
| 300 | actual | proyectil | alta vs total | 50.0 | 4.0 | 22 | 87 | 0 | 7 | 36.1 | 129.5 | 384 | 1 |
| 300 | actual | proyectil | total vs none | 100.0 | 2.5 | 99.3 | 55 | 32.8 | 0 | 0 | 80 | 384 | 0.5 |
| 300 | actual | proyectil | total vs ligera | 50.0 | 4.0 | 22.3 | 86 | 0 | 7.1 | 36.4 | 128 | 384 | 1 |
| 300 | actual | proyectil | total vs media | 50.0 | 4.0 | 22.3 | 86 | 0 | 7.1 | 36.4 | 128 | 384 | 1 |
| 300 | actual | proyectil | total vs alta | 50.0 | 4.0 | 22.3 | 86 | 0 | 7.1 | 36.4 | 128.5 | 384 | 1 |
| 300 | actual | proyectil | total vs total | 50.0 | 5.0 | 22.2 | 98 | 0 | 7.1 | 36.3 | 145.5 | 384 | 1 |
| 500 | actual | cortante | none vs none | 50.0 | 3.0 | 121.3 | 183 | 67 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs ligera | 0.0 | 3.5 | 22 | 249 | 0 | 7 | 21 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs media | 0.0 | 3.5 | 22 | 249 | 0 | 7 | 21 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs alta | 0.0 | 3.5 | 22 | 249 | 0 | 7 | 21 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs total | 0.0 | 3.5 | 22 | 249 | 0 | 7 | 21 | 0 | 0 | 0 |
| 500 | actual | cortante | ligera vs none | 100.0 | 3.5 | 117 | 33 | 67 | 0 | 0 | 100.5 | 268 | 1.5 |
| 500 | actual | cortante | ligera vs ligera | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | ligera vs media | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | ligera vs alta | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | ligera vs total | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | media vs none | 100.0 | 3.5 | 117 | 33 | 67 | 0 | 0 | 100.5 | 268 | 1.5 |
| 500 | actual | cortante | media vs ligera | 50.0 | 6.0 | 46.6 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | media vs media | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | media vs alta | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | media vs total | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | alta vs none | 100.0 | 3.5 | 117 | 33 | 67 | 0 | 0 | 100.5 | 268 | 1.5 |
| 500 | actual | cortante | alta vs ligera | 50.0 | 6.0 | 46.6 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | alta vs media | 50.0 | 6.0 | 46.6 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | alta vs alta | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | alta vs total | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | total vs none | 100.0 | 3.5 | 117 | 33 | 67 | 0 | 0 | 100.5 | 268 | 1.5 |
| 500 | actual | cortante | total vs ligera | 50.0 | 6.0 | 46.6 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | total vs media | 50.0 | 6.0 | 46.6 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | total vs alta | 50.0 | 6.0 | 46.6 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | cortante | total vs total | 50.0 | 6.0 | 48.3 | 182.5 | 13.4 | 4.2 | 12.6 | 268 | 268 | 4 |
| 500 | actual | contundente | none vs none | 50.0 | 2.0 | 135 | 192 | 90 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs ligera | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 19 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs media | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 19 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs alta | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 19 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs total | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 19 | 0 | 0 | 0 |
| 500 | actual | contundente | ligera vs none | 100.0 | 2.0 | 135 | 30 | 90 | 0 | 0 | 135 | 268 | 1.5 |
| 500 | actual | contundente | ligera vs ligera | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | ligera vs media | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | ligera vs alta | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | ligera vs total | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | media vs none | 100.0 | 2.0 | 135 | 30 | 90 | 0 | 0 | 135 | 268 | 1.5 |
| 500 | actual | contundente | media vs ligera | 50.0 | 5.0 | 55.5 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | media vs media | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | media vs alta | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | media vs total | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | alta vs none | 100.0 | 2.0 | 135 | 30 | 90 | 0 | 0 | 135 | 268 | 1.5 |
| 500 | actual | contundente | alta vs ligera | 50.0 | 5.0 | 55.5 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | alta vs media | 50.0 | 5.0 | 55.5 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | alta vs alta | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | alta vs total | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | total vs none | 100.0 | 2.0 | 135 | 30 | 90 | 0 | 0 | 135 | 268 | 1.5 |
| 500 | actual | contundente | total vs ligera | 50.0 | 5.0 | 55.5 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | total vs media | 50.0 | 5.0 | 55.5 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | total vs alta | 50.0 | 5.0 | 55.5 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | contundente | total vs total | 50.0 | 5.0 | 57.4 | 168 | 23 | 3 | 9.5 | 268 | 268 | 4 |
| 500 | actual | perforante | none vs none | 50.0 | 3.0 | 105 | 174.5 | 40 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs ligera | 0.0 | 3.5 | 27 | 249 | 0 | 8 | 25 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs media | 0.0 | 3.5 | 27 | 249 | 0 | 8 | 25 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs alta | 0.0 | 3.5 | 27 | 249 | 0 | 8 | 25 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs total | 0.0 | 3.5 | 27 | 249 | 0 | 8 | 25 | 0 | 0 | 0 |
| 500 | actual | perforante | ligera vs none | 100.0 | 3.5 | 100 | 40.5 | 40 | 0 | 0 | 60 | 268 | 0.5 |
| 500 | actual | perforante | ligera vs ligera | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | ligera vs media | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | ligera vs alta | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | ligera vs total | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | media vs none | 100.0 | 3.5 | 100 | 40.5 | 40 | 0 | 0 | 60 | 268 | 0.5 |
| 500 | actual | perforante | media vs ligera | 50.0 | 8.0 | 35.4 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | media vs media | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | media vs alta | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | media vs total | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | alta vs none | 100.0 | 3.5 | 100 | 40.5 | 40 | 0 | 0 | 60 | 268 | 0.5 |
| 500 | actual | perforante | alta vs ligera | 50.0 | 8.0 | 35.4 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | alta vs media | 50.0 | 8.0 | 35.4 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | alta vs alta | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | alta vs total | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | total vs none | 100.0 | 3.5 | 100 | 40.5 | 40 | 0 | 0 | 60 | 268 | 0.5 |
| 500 | actual | perforante | total vs ligera | 50.0 | 8.0 | 35.4 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | total vs media | 50.0 | 8.0 | 35.4 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | total vs alta | 50.0 | 8.0 | 35.4 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | perforante | total vs total | 50.0 | 8.0 | 36.9 | 205.5 | 3.7 | 6.9 | 21.4 | 254 | 268 | 3.5 |
| 500 | actual | proyectil | none vs none | 50.0 | 2.0 | 85 | 167 | 28 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs ligera | 0.0 | 3.5 | 25 | 249 | 0 | 8 | 24 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs media | 0.0 | 3.5 | 25 | 249 | 0 | 8 | 24 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs alta | 0.0 | 3.5 | 25 | 249 | 0 | 8 | 24 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs total | 0.0 | 3.5 | 25 | 249 | 0 | 8 | 24 | 0 | 0 | 0 |
| 500 | actual | proyectil | ligera vs none | 100.0 | 3.5 | 85 | 87.5 | 28 | 0 | 0 | 98 | 268 | 1 |
| 500 | actual | proyectil | ligera vs ligera | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | ligera vs media | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | ligera vs alta | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | ligera vs total | 50.0 | 7.0 | 28.4 | 162.5 | 0.9 | 7.4 | 22.2 | 176.5 | 268 | 2.5 |
| 500 | actual | proyectil | media vs none | 100.0 | 3.5 | 85 | 87.5 | 28 | 0 | 0 | 98 | 268 | 1 |
| 500 | actual | proyectil | media vs ligera | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | media vs media | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | media vs alta | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | media vs total | 50.0 | 7.0 | 28.4 | 162.5 | 0.9 | 7.4 | 22.2 | 176.5 | 268 | 2.5 |
| 500 | actual | proyectil | alta vs none | 100.0 | 3.5 | 85 | 87.5 | 28 | 0 | 0 | 98 | 268 | 1 |
| 500 | actual | proyectil | alta vs ligera | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | alta vs media | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | alta vs alta | 50.0 | 7.0 | 28.4 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | alta vs total | 50.0 | 7.0 | 28.4 | 162.5 | 0.9 | 7.4 | 22.2 | 176.5 | 268 | 2.5 |
| 500 | actual | proyectil | total vs none | 100.0 | 3.5 | 85.5 | 87.5 | 28.2 | 0 | 0 | 98 | 268 | 1 |
| 500 | actual | proyectil | total vs ligera | 50.0 | 7.0 | 28.5 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | total vs media | 50.0 | 7.0 | 28.5 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | total vs alta | 50.0 | 7.0 | 28.5 | 162 | 0.9 | 7.4 | 22.2 | 176 | 268 | 2.5 |
| 500 | actual | proyectil | total vs total | 50.0 | 7.0 | 28.5 | 162.5 | 0.9 | 7.4 | 22.2 | 176.5 | 268 | 2.5 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: ninguno ✅
- Nivel 300: espejo fuera de 50±5%: ninguno ✅
- Nivel 500: espejo fuera de 50±5%: ninguno ✅