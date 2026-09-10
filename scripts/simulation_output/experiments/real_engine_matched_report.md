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
| 100 | actual | cortante | none vs none | 50.0 | 1.0 | 110 | 24 | 63 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs ligera | 0.0 | 1.5 | 12 | 48 | 0 | 3 | 32 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs media | 0.0 | 1.5 | 12 | 48 | 0 | 3 | 32 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs alta | 0.0 | 1.5 | 12 | 48 | 0 | 3 | 32 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs total | 0.0 | 1.5 | 12 | 48 | 0 | 3 | 32 | 0 | 0 | 0 |
| 100 | actual | cortante | ligera vs none | 100.0 | 1.5 | 110 | 12 | 63 | 0 | 0 | 63 | 532 | 0 |
| 100 | actual | cortante | ligera vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | ligera vs media | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | ligera vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | ligera vs total | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | media vs none | 100.0 | 1.5 | 110 | 12 | 63 | 0 | 0 | 63 | 532 | 0 |
| 100 | actual | cortante | media vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | media vs media | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | media vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | media vs total | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | alta vs none | 100.0 | 1.5 | 110 | 12 | 63 | 0 | 0 | 63 | 532 | 0 |
| 100 | actual | cortante | alta vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | alta vs media | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | alta vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | alta vs total | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | total vs none | 100.0 | 1.5 | 110 | 12 | 63 | 0 | 0 | 63 | 532 | 0 |
| 100 | actual | cortante | total vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | total vs media | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | total vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | cortante | total vs total | 50.0 | 4.0 | 12 | 42 | 0 | 3 | 32 | 220.5 | 532 | 1 |
| 100 | actual | contundente | none vs none | 50.0 | 1.0 | 92 | 24 | 61 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs ligera | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 21 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs media | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 21 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs alta | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 21 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs total | 0.0 | 1.5 | 8 | 48 | 0 | 2 | 21 | 0 | 0 | 0 |
| 100 | actual | contundente | ligera vs none | 100.0 | 1.5 | 92 | 8 | 61 | 0 | 0 | 61 | 532 | 0 |
| 100 | actual | contundente | ligera vs ligera | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | ligera vs media | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | ligera vs alta | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | ligera vs total | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | media vs none | 100.0 | 1.5 | 92 | 8 | 61 | 0 | 0 | 61 | 532 | 0 |
| 100 | actual | contundente | media vs ligera | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | media vs media | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | media vs alta | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | media vs total | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | alta vs none | 100.0 | 1.5 | 92 | 8 | 61 | 0 | 0 | 61 | 532 | 0 |
| 100 | actual | contundente | alta vs ligera | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | alta vs media | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | alta vs alta | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | alta vs total | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | total vs none | 100.0 | 1.5 | 92 | 8 | 61 | 0 | 0 | 61 | 532 | 0 |
| 100 | actual | contundente | total vs ligera | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | total vs media | 50.0 | 7.5 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | total vs alta | 50.0 | 7.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | contundente | total vs total | 50.0 | 6.0 | 8 | 40 | 0 | 2 | 21 | 305 | 532 | 1.5 |
| 100 | actual | perforante | none vs none | 50.0 | 1.0 | 83 | 24 | 33 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs ligera | 0.0 | 1.5 | 12 | 48 | 0 | 4 | 34 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs media | 0.0 | 1.5 | 12 | 48 | 0 | 4 | 34 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs alta | 0.0 | 1.5 | 12 | 48 | 0 | 4 | 34 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs total | 0.0 | 1.5 | 12 | 48 | 0 | 4 | 34 | 0 | 0 | 0 |
| 100 | actual | perforante | ligera vs none | 100.0 | 1.5 | 83 | 12 | 33 | 0 | 0 | 33 | 532 | 0 |
| 100 | actual | perforante | ligera vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | ligera vs media | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | ligera vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | ligera vs total | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | media vs none | 100.0 | 1.5 | 83 | 12 | 33 | 0 | 0 | 33 | 532 | 0 |
| 100 | actual | perforante | media vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | media vs media | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | media vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | media vs total | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | alta vs none | 100.0 | 1.5 | 83 | 12 | 33 | 0 | 0 | 33 | 532 | 0 |
| 100 | actual | perforante | alta vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | alta vs media | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | alta vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | alta vs total | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | total vs none | 100.0 | 1.5 | 83 | 12 | 33 | 0 | 0 | 33 | 532 | 0 |
| 100 | actual | perforante | total vs ligera | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | total vs media | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | total vs alta | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | perforante | total vs total | 50.0 | 4.0 | 12 | 42 | 0 | 4 | 34 | 115.5 | 532 | 0 |
| 100 | actual | proyectil | none vs none | 50.0 | 1.0 | 103 | 24 | 34 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs ligera | 0.0 | 1.0 | 16 | 48 | 0 | 5 | 48 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs media | 0.0 | 1.0 | 16 | 48 | 0 | 5 | 48 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs alta | 0.0 | 1.0 | 16 | 48 | 0 | 5 | 48 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs total | 0.0 | 1.0 | 16 | 48 | 0 | 5 | 48 | 0 | 0 | 0 |
| 100 | actual | proyectil | ligera vs none | 100.0 | 1.0 | 101 | 8 | 33.5 | 0 | 0 | 17 | 532 | 0 |
| 100 | actual | proyectil | ligera vs ligera | 50.0 | 3.0 | 15.3 | 40 | 0 | 5 | 44.2 | 95.5 | 532 | 0 |
| 100 | actual | proyectil | ligera vs media | 0.0 | 3.0 | 15.5 | 48 | 0 | 5 | 44.8 | 111.5 | 532 | 0 |
| 100 | actual | proyectil | ligera vs alta | 0.0 | 3.0 | 15.4 | 48 | 0 | 5 | 44.4 | 112.5 | 532 | 0 |
| 100 | actual | proyectil | ligera vs total | 0.0 | 3.0 | 15.5 | 48 | 0 | 5 | 44.8 | 113 | 532 | 0 |
| 100 | actual | proyectil | media vs none | 100.0 | 1.0 | 103 | 8 | 34 | 0 | 0 | 17 | 532 | 0 |
| 100 | actual | proyectil | media vs ligera | 100.0 | 3.0 | 15.4 | 31 | 0 | 5 | 44.3 | 64.5 | 532 | 0 |
| 100 | actual | proyectil | media vs media | 50.0 | 3.0 | 15.6 | 39 | 0 | 5 | 44.8 | 80.5 | 532 | 0 |
| 100 | actual | proyectil | media vs alta | 50.0 | 3.0 | 15.5 | 39 | 0 | 5 | 44.5 | 81.5 | 532 | 0 |
| 100 | actual | proyectil | media vs total | 50.0 | 2.5 | 15.8 | 39 | 0 | 5 | 45.3 | 82 | 532 | 0 |
| 100 | actual | proyectil | alta vs none | 100.0 | 1.0 | 105.5 | 8 | 35 | 0 | 0 | 17 | 532 | 0 |
| 100 | actual | proyectil | alta vs ligera | 100.0 | 3.0 | 15.4 | 38.5 | 0 | 5.1 | 44.6 | 80 | 532 | 0 |
| 100 | actual | proyectil | alta vs media | 50.0 | 3.0 | 15.6 | 46.5 | 0 | 5.2 | 45.2 | 96 | 532 | 0 |
| 100 | actual | proyectil | alta vs alta | 50.0 | 3.0 | 15.5 | 46.5 | 0 | 5.2 | 44.8 | 97 | 532 | 0 |
| 100 | actual | proyectil | alta vs total | 50.0 | 2.5 | 15.8 | 46.5 | 0 | 5.3 | 46.5 | 98.5 | 532 | 0 |
| 100 | actual | proyectil | total vs none | 100.0 | 1.0 | 107.5 | 8 | 35.5 | 0 | 0 | 17 | 532 | 0 |
| 100 | actual | proyectil | total vs ligera | 100.0 | 3.0 | 15.6 | 31 | 0 | 5.1 | 44.9 | 64.5 | 532 | 0 |
| 100 | actual | proyectil | total vs media | 50.0 | 2.5 | 15.8 | 31.5 | 0 | 5.2 | 45.6 | 65 | 532 | 0 |
| 100 | actual | proyectil | total vs alta | 50.0 | 2.5 | 15.7 | 31.5 | 0 | 5.2 | 45.7 | 67 | 532 | 0 |
| 100 | actual | proyectil | total vs total | 50.0 | 2.0 | 16.3 | 32 | 0 | 5.3 | 47.5 | 68 | 532 | 0 |
| 300 | actual | cortante | none vs none | 50.0 | 2.0 | 112 | 131 | 56 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs ligera | 0.0 | 2.0 | 23 | 150 | 0 | 7 | 26 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs media | 0.0 | 2.0 | 23 | 150 | 0 | 7 | 26 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs alta | 0.0 | 2.0 | 23 | 150 | 0 | 7 | 26 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs total | 50.0 | 3.5 | 29.4 | 131 | 1.7 | 6 | 22.3 | 0 | 0 | 0 |
| 300 | actual | cortante | ligera vs none | 100.0 | 2.0 | 112 | 34.5 | 56 | 0 | 0 | 84 | 268 | 0.5 |
| 300 | actual | cortante | ligera vs ligera | 50.0 | 6.0 | 34.5 | 121 | 6.8 | 5.4 | 20.1 | 246 | 268 | 3.5 |
| 300 | actual | cortante | ligera vs media | 50.0 | 6.0 | 36.3 | 121 | 7.3 | 4.9 | 18.3 | 246 | 268 | 3.5 |
| 300 | actual | cortante | ligera vs alta | 50.0 | 6.0 | 36.3 | 121 | 7.3 | 4.9 | 18.3 | 246 | 268 | 3.5 |
| 300 | actual | cortante | ligera vs total | 100.0 | 5.5 | 37.5 | 84.5 | 7.3 | 4.9 | 18.3 | 224 | 268 | 3 |
| 300 | actual | cortante | media vs none | 100.0 | 2.0 | 112 | 34.5 | 56 | 0 | 0 | 84 | 268 | 0.5 |
| 300 | actual | cortante | media vs ligera | 50.0 | 6.0 | 34 | 148 | 6.8 | 5.2 | 19.4 | 268 | 268 | 4 |
| 300 | actual | cortante | media vs media | 50.0 | 6.0 | 35.8 | 148 | 7.3 | 4.7 | 17.6 | 268 | 268 | 4 |
| 300 | actual | cortante | media vs alta | 50.0 | 6.0 | 35.8 | 148 | 7.3 | 4.7 | 17.6 | 268 | 268 | 4 |
| 300 | actual | cortante | media vs total | 100.0 | 5.5 | 37.1 | 111.5 | 7.3 | 4.7 | 17.6 | 246 | 268 | 3.5 |
| 300 | actual | cortante | alta vs none | 100.0 | 2.0 | 112 | 34.5 | 56 | 0 | 0 | 84 | 268 | 0.5 |
| 300 | actual | cortante | alta vs ligera | 50.0 | 6.0 | 34 | 148 | 6.8 | 5.2 | 19.4 | 268 | 268 | 4 |
| 300 | actual | cortante | alta vs media | 50.0 | 6.0 | 35.8 | 148 | 7.3 | 4.7 | 17.6 | 268 | 268 | 4 |
| 300 | actual | cortante | alta vs alta | 50.0 | 6.0 | 35.8 | 148 | 7.3 | 4.7 | 17.6 | 268 | 268 | 4 |
| 300 | actual | cortante | alta vs total | 100.0 | 5.5 | 37.1 | 111.5 | 7.3 | 4.7 | 17.6 | 246 | 268 | 3.5 |
| 300 | actual | cortante | total vs none | 50.0 | 3.5 | 56 | 98 | 28 | 0 | 0 | 190 | 268 | 2.5 |
| 300 | actual | cortante | total vs ligera | 0.0 | 5.5 | 21.1 | 150 | 0 | 6.3 | 23.4 | 268 | 268 | 4 |
| 300 | actual | cortante | total vs media | 0.0 | 5.5 | 24.8 | 150 | 1.3 | 5.6 | 20.8 | 268 | 268 | 4 |
| 300 | actual | cortante | total vs alta | 0.0 | 5.5 | 24.8 | 150 | 1.3 | 5.6 | 20.8 | 268 | 268 | 4 |
| 300 | actual | cortante | total vs total | 50.0 | 5.0 | 26.3 | 113.5 | 1.3 | 5.6 | 20.8 | 246 | 268 | 3.5 |
| 300 | actual | contundente | none vs none | 50.0 | 2.0 | 120 | 75 | 72 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs ligera | 50.0 | 5.0 | 44.7 | 135 | 15.3 | 4 | 14.7 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs media | 50.0 | 5.0 | 44.7 | 135 | 15.3 | 4 | 14.7 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs alta | 50.0 | 5.0 | 44.7 | 135 | 15.3 | 4 | 14.7 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs total | 50.0 | 5.0 | 44.7 | 135 | 15.3 | 4 | 14.7 | 0 | 0 | 0 |
| 300 | actual | contundente | ligera vs none | 50.0 | 5.0 | 45 | 85 | 27 | 0 | 0 | 170 | 268 | 2.5 |
| 300 | actual | contundente | ligera vs ligera | 50.0 | 5.0 | 37 | 105 | 11.5 | 4.5 | 16.5 | 242 | 268 | 3.5 |
| 300 | actual | contundente | ligera vs media | 100.0 | 5.0 | 48.4 | 85.5 | 18.4 | 3.6 | 13.2 | 242 | 268 | 3.5 |
| 300 | actual | contundente | ligera vs alta | 100.0 | 5.0 | 48.4 | 85.5 | 18.4 | 3.6 | 13.2 | 242 | 268 | 3.5 |
| 300 | actual | contundente | ligera vs total | 100.0 | 5.0 | 48.4 | 83 | 18.4 | 3.6 | 13.2 | 242 | 268 | 3.5 |
| 300 | actual | contundente | media vs none | 50.0 | 5.0 | 45 | 85 | 27 | 0 | 0 | 170 | 268 | 2.5 |
| 300 | actual | contundente | media vs ligera | 0.0 | 5.0 | 24.4 | 150 | 2.9 | 4.9 | 18.1 | 268 | 268 | 4 |
| 300 | actual | contundente | media vs media | 50.0 | 5.0 | 39.9 | 130.5 | 12.4 | 3.8 | 14.1 | 268 | 268 | 4 |
| 300 | actual | contundente | media vs alta | 50.0 | 5.0 | 39.9 | 130.5 | 12.4 | 3.8 | 14.1 | 268 | 268 | 4 |
| 300 | actual | contundente | media vs total | 50.0 | 5.0 | 39.9 | 128 | 12.4 | 3.8 | 14.1 | 268 | 268 | 4 |
| 300 | actual | contundente | alta vs none | 50.0 | 5.0 | 45 | 85 | 27 | 0 | 0 | 170 | 268 | 2.5 |
| 300 | actual | contundente | alta vs ligera | 0.0 | 5.0 | 24.4 | 150 | 2.9 | 4.9 | 18.1 | 268 | 268 | 4 |
| 300 | actual | contundente | alta vs media | 50.0 | 5.0 | 39.9 | 130.5 | 12.4 | 3.8 | 14.1 | 268 | 268 | 4 |
| 300 | actual | contundente | alta vs alta | 50.0 | 5.0 | 39.9 | 130.5 | 12.4 | 3.8 | 14.1 | 268 | 268 | 4 |
| 300 | actual | contundente | alta vs total | 50.0 | 5.0 | 39.9 | 128 | 12.4 | 3.8 | 14.1 | 268 | 268 | 4 |
| 300 | actual | contundente | total vs none | 50.0 | 5.0 | 45 | 85 | 27 | 0 | 0 | 170 | 268 | 2.5 |
| 300 | actual | contundente | total vs ligera | 0.0 | 5.0 | 23.7 | 150 | 2.9 | 4.6 | 17.4 | 268 | 268 | 4 |
| 300 | actual | contundente | total vs media | 50.0 | 5.0 | 39.3 | 130.5 | 12.4 | 3.6 | 13.6 | 268 | 268 | 4 |
| 300 | actual | contundente | total vs alta | 50.0 | 5.0 | 39.3 | 130.5 | 12.4 | 3.6 | 13.6 | 268 | 268 | 4 |
| 300 | actual | contundente | total vs total | 50.0 | 5.0 | 39.3 | 128 | 12.4 | 3.6 | 13.6 | 268 | 268 | 4 |
| 300 | actual | perforante | none vs none | 50.0 | 2.0 | 91 | 120.5 | 30 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs ligera | 0.0 | 2.0 | 24 | 150 | 0 | 8 | 29 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs media | 0.0 | 2.0 | 24 | 150 | 0 | 8 | 29 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs alta | 0.0 | 2.0 | 24 | 150 | 0 | 8 | 29 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs total | 50.0 | 4.0 | 23.4 | 120.5 | 0 | 7.8 | 28.1 | 0 | 0 | 0 |
| 300 | actual | perforante | ligera vs none | 100.0 | 2.0 | 91 | 36 | 30 | 0 | 0 | 45 | 268 | 0 |
| 300 | actual | perforante | ligera vs ligera | 50.0 | 6.0 | 23.2 | 130 | 0 | 7.7 | 27.7 | 180 | 268 | 2.5 |
| 300 | actual | perforante | ligera vs media | 50.0 | 6.0 | 23.2 | 127.5 | 0 | 7.7 | 27.7 | 180 | 268 | 2.5 |
| 300 | actual | perforante | ligera vs alta | 50.0 | 6.0 | 23.2 | 127.5 | 0 | 7.7 | 27.7 | 180 | 268 | 2.5 |
| 300 | actual | perforante | ligera vs total | 50.0 | 6.0 | 23.2 | 115.5 | 0 | 7.7 | 27.7 | 165 | 268 | 2 |
| 300 | actual | perforante | media vs none | 100.0 | 2.0 | 91 | 36 | 30 | 0 | 0 | 45 | 268 | 0 |
| 300 | actual | perforante | media vs ligera | 50.0 | 6.0 | 22.8 | 130 | 0 | 7.5 | 27 | 180 | 268 | 2.5 |
| 300 | actual | perforante | media vs media | 50.0 | 6.0 | 22.8 | 127.5 | 0 | 7.5 | 27 | 180 | 268 | 2.5 |
| 300 | actual | perforante | media vs alta | 50.0 | 6.0 | 22.8 | 127.5 | 0 | 7.5 | 27 | 180 | 268 | 2.5 |
| 300 | actual | perforante | media vs total | 50.0 | 6.0 | 22.8 | 115.5 | 0 | 7.5 | 27 | 165 | 268 | 2 |
| 300 | actual | perforante | alta vs none | 100.0 | 2.0 | 91 | 36 | 30 | 0 | 0 | 45 | 268 | 0 |
| 300 | actual | perforante | alta vs ligera | 50.0 | 6.0 | 22.8 | 130 | 0 | 7.5 | 27 | 180 | 268 | 2.5 |
| 300 | actual | perforante | alta vs media | 50.0 | 6.0 | 22.8 | 127.5 | 0 | 7.5 | 27 | 180 | 268 | 2.5 |
| 300 | actual | perforante | alta vs alta | 50.0 | 6.0 | 22.8 | 127.5 | 0 | 7.5 | 27 | 180 | 268 | 2.5 |
| 300 | actual | perforante | alta vs total | 50.0 | 6.0 | 22.8 | 115.5 | 0 | 7.5 | 27 | 165 | 268 | 2 |
| 300 | actual | perforante | total vs none | 50.0 | 4.0 | 45.5 | 99 | 15 | 0 | 0 | 135 | 268 | 1.5 |
| 300 | actual | perforante | total vs ligera | 50.0 | 6.0 | 22.6 | 130 | 0 | 7.5 | 26.8 | 180 | 268 | 2.5 |
| 300 | actual | perforante | total vs media | 50.0 | 6.0 | 22.6 | 127.5 | 0 | 7.5 | 26.8 | 180 | 268 | 2.5 |
| 300 | actual | perforante | total vs alta | 50.0 | 6.0 | 22.6 | 127.5 | 0 | 7.5 | 26.8 | 180 | 268 | 2.5 |
| 300 | actual | perforante | total vs total | 50.0 | 6.0 | 22.6 | 115.5 | 0 | 7.5 | 26.8 | 165 | 268 | 2 |
| 300 | actual | proyectil | none vs none | 50.0 | 2.0 | 70 | 110 | 23 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs ligera | 50.0 | 3.5 | 19 | 110 | 0 | 6 | 22 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs media | 50.0 | 3.5 | 19 | 110 | 0 | 6 | 22 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs alta | 50.0 | 3.5 | 19 | 111 | 0 | 6 | 22 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs total | 50.0 | 3.5 | 19 | 114 | 0 | 6 | 22 | 0 | 0 | 0 |
| 300 | actual | proyectil | ligera vs none | 50.0 | 3.5 | 70 | 84.5 | 23 | 0 | 0 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | ligera vs ligera | 50.0 | 5.0 | 19 | 84.5 | 0 | 6 | 22 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | ligera vs media | 50.0 | 5.0 | 19 | 84.5 | 0 | 6 | 22 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | ligera vs alta | 50.0 | 5.0 | 19 | 85 | 0 | 6 | 22 | 104 | 268 | 1 |
| 300 | actual | proyectil | ligera vs total | 50.0 | 5.0 | 19 | 85.5 | 0 | 6 | 22 | 105 | 268 | 1 |
| 300 | actual | proyectil | media vs none | 50.0 | 3.5 | 70 | 84.5 | 23 | 0 | 0 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | media vs ligera | 50.0 | 5.0 | 19 | 84.5 | 0 | 6 | 22 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | media vs media | 50.0 | 5.0 | 19 | 84.5 | 0 | 6 | 22 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | media vs alta | 50.0 | 5.0 | 19 | 85 | 0 | 6 | 22 | 104 | 268 | 1 |
| 300 | actual | proyectil | media vs total | 50.0 | 5.0 | 19 | 85.5 | 0 | 6 | 22 | 105 | 268 | 1 |
| 300 | actual | proyectil | alta vs none | 50.0 | 3.5 | 70.5 | 84.5 | 23.3 | 0 | 0 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | alta vs ligera | 50.0 | 5.0 | 19.1 | 84.5 | 0 | 6 | 22 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | alta vs media | 50.0 | 5.0 | 19.1 | 84.5 | 0 | 6 | 22 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | alta vs alta | 50.0 | 5.0 | 19.1 | 85 | 0 | 6 | 22 | 104 | 268 | 1 |
| 300 | actual | proyectil | alta vs total | 50.0 | 5.0 | 19.1 | 85.5 | 0 | 6 | 22 | 105 | 268 | 1 |
| 300 | actual | proyectil | total vs none | 50.0 | 3.5 | 72 | 84.5 | 23.8 | 0 | 0 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | total vs ligera | 50.0 | 5.0 | 19.2 | 84.5 | 0 | 6.1 | 22.2 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | total vs media | 50.0 | 5.0 | 19.2 | 84.5 | 0 | 6.1 | 22.2 | 103.5 | 268 | 1 |
| 300 | actual | proyectil | total vs alta | 50.0 | 5.0 | 19.2 | 85 | 0 | 6.1 | 22.2 | 104 | 268 | 1 |
| 300 | actual | proyectil | total vs total | 50.0 | 5.0 | 19.2 | 95 | 0 | 6.1 | 22.2 | 116.5 | 268 | 1 |
| 500 | actual | cortante | none vs none | 50.0 | 2.0 | 138 | 193.5 | 79 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs ligera | 0.0 | 2.0 | 22 | 249 | 0 | 7 | 30 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs media | 0.0 | 2.0 | 22 | 249 | 0 | 7 | 30 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs alta | 0.0 | 2.0 | 22 | 249 | 0 | 7 | 30 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs total | 0.0 | 2.0 | 22 | 249 | 0 | 7 | 30 | 0 | 0 | 0 |
| 500 | actual | cortante | ligera vs none | 100.0 | 2.0 | 138 | 33 | 79 | 0 | 0 | 118.5 | 384 | 0.5 |
| 500 | actual | cortante | ligera vs ligera | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | ligera vs media | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | ligera vs alta | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | ligera vs total | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | media vs none | 100.0 | 2.0 | 138 | 33 | 79 | 0 | 0 | 118.5 | 384 | 0.5 |
| 500 | actual | cortante | media vs ligera | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | media vs media | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | media vs alta | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | media vs total | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | alta vs none | 100.0 | 2.0 | 138 | 33 | 79 | 0 | 0 | 118.5 | 384 | 0.5 |
| 500 | actual | cortante | alta vs ligera | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | alta vs media | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | alta vs alta | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | alta vs total | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | total vs none | 100.0 | 2.0 | 138 | 33 | 79 | 0 | 0 | 118.5 | 384 | 0.5 |
| 500 | actual | cortante | total vs ligera | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | total vs media | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | total vs alta | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | cortante | total vs total | 50.0 | 6.0 | 41.3 | 203.5 | 9.2 | 5.1 | 21.8 | 384 | 384 | 4 |
| 500 | actual | contundente | none vs none | 50.0 | 2.0 | 155 | 202 | 103 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs ligera | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 26 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs media | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 26 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs alta | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 26 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs total | 0.0 | 2.0 | 20 | 249 | 0 | 6 | 26 | 0 | 0 | 0 |
| 500 | actual | contundente | ligera vs none | 100.0 | 2.0 | 155 | 30 | 103 | 0 | 0 | 154.5 | 384 | 1.5 |
| 500 | actual | contundente | ligera vs ligera | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | ligera vs media | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | ligera vs alta | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | ligera vs total | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | media vs none | 100.0 | 2.0 | 155 | 30 | 103 | 0 | 0 | 154.5 | 384 | 1.5 |
| 500 | actual | contundente | media vs ligera | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | media vs media | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | media vs alta | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | media vs total | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | alta vs none | 100.0 | 2.0 | 155 | 30 | 103 | 0 | 0 | 154.5 | 384 | 1.5 |
| 500 | actual | contundente | alta vs ligera | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | alta vs media | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | alta vs alta | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | alta vs total | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | total vs none | 100.0 | 2.0 | 155 | 30 | 103 | 0 | 0 | 154.5 | 384 | 1.5 |
| 500 | actual | contundente | total vs ligera | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | total vs media | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | total vs alta | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | contundente | total vs total | 50.0 | 5.0 | 48.3 | 194.5 | 17.7 | 4 | 17.3 | 384 | 384 | 4 |
| 500 | actual | perforante | none vs none | 50.0 | 3.0 | 127 | 185 | 48 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs ligera | 0.0 | 3.5 | 27 | 249 | 0 | 9 | 37 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs media | 0.0 | 3.5 | 27 | 249 | 0 | 9 | 37 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs alta | 0.0 | 3.5 | 27 | 249 | 0 | 9 | 37 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs total | 0.0 | 3.5 | 27 | 249 | 0 | 9 | 37 | 0 | 0 | 0 |
| 500 | actual | perforante | ligera vs none | 100.0 | 3.5 | 121 | 40.5 | 48 | 0 | 0 | 72 | 384 | 0.5 |
| 500 | actual | perforante | ligera vs ligera | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | ligera vs media | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | ligera vs alta | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | ligera vs total | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | media vs none | 100.0 | 3.5 | 121 | 40.5 | 48 | 0 | 0 | 72 | 384 | 0.5 |
| 500 | actual | perforante | media vs ligera | 50.0 | 8.0 | 30.3 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | media vs media | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | media vs alta | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | media vs total | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | alta vs none | 100.0 | 3.5 | 121 | 40.5 | 48 | 0 | 0 | 72 | 384 | 0.5 |
| 500 | actual | perforante | alta vs ligera | 50.0 | 8.0 | 30.3 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | alta vs media | 50.0 | 8.0 | 30.3 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | alta vs alta | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | alta vs total | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | total vs none | 100.0 | 3.5 | 121 | 40.5 | 48 | 0 | 0 | 72 | 384 | 0.5 |
| 500 | actual | perforante | total vs ligera | 50.0 | 8.0 | 30.3 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | total vs media | 50.0 | 8.0 | 30.3 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | total vs alta | 50.0 | 8.0 | 30.3 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | perforante | total vs total | 50.0 | 8.0 | 32 | 205.5 | 0 | 8.4 | 34.4 | 336 | 384 | 3.5 |
| 500 | actual | proyectil | none vs none | 50.0 | 2.0 | 112 | 180.5 | 37 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs ligera | 0.0 | 3.5 | 28 | 249 | 0 | 9 | 38 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs media | 0.0 | 3.5 | 28 | 249 | 0 | 9 | 38 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs alta | 0.0 | 3.5 | 28 | 249 | 0 | 9 | 38 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs total | 0.0 | 3.5 | 28 | 249 | 0 | 9 | 38 | 0 | 0 | 0 |
| 500 | actual | proyectil | ligera vs none | 100.0 | 3.5 | 112 | 98 | 37 | 0 | 0 | 129.5 | 384 | 1 |
| 500 | actual | proyectil | ligera vs ligera | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | ligera vs media | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | ligera vs alta | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | ligera vs total | 50.0 | 6.0 | 28 | 167 | 0 | 9 | 38 | 222.5 | 384 | 2 |
| 500 | actual | proyectil | media vs none | 100.0 | 3.5 | 112 | 98 | 37 | 0 | 0 | 129.5 | 384 | 1 |
| 500 | actual | proyectil | media vs ligera | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | media vs media | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | media vs alta | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | media vs total | 50.0 | 6.0 | 28 | 167 | 0 | 9 | 38 | 222.5 | 384 | 2 |
| 500 | actual | proyectil | alta vs none | 100.0 | 3.5 | 112 | 98 | 37 | 0 | 0 | 129.5 | 384 | 1 |
| 500 | actual | proyectil | alta vs ligera | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | alta vs media | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | alta vs alta | 50.0 | 6.0 | 28 | 166.5 | 0 | 9 | 38 | 222 | 384 | 2 |
| 500 | actual | proyectil | alta vs total | 50.0 | 6.0 | 28 | 167 | 0 | 9 | 38 | 222.5 | 384 | 2 |
| 500 | actual | proyectil | total vs none | 100.0 | 3.5 | 112.5 | 98 | 37.2 | 0 | 0 | 129.5 | 384 | 1 |
| 500 | actual | proyectil | total vs ligera | 50.0 | 6.0 | 28.1 | 166.5 | 0 | 9 | 38.1 | 222 | 384 | 2 |
| 500 | actual | proyectil | total vs media | 50.0 | 6.0 | 28.1 | 166.5 | 0 | 9 | 38.1 | 222 | 384 | 2 |
| 500 | actual | proyectil | total vs alta | 50.0 | 6.0 | 28.1 | 166.5 | 0 | 9 | 38.1 | 222 | 384 | 2 |
| 500 | actual | proyectil | total vs total | 50.0 | 6.0 | 28.1 | 167 | 0 | 9 | 38.1 | 222.5 | 384 | 2 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: ninguno ✅
- Nivel 300: espejo fuera de 50±5%: ninguno ✅
- Nivel 500: espejo fuera de 50±5%: ninguno ✅