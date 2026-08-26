# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=1000 | nominal=20 | maxRounds=30
Niveles: 300, 400, 450 | Modos: actual | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 300 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 400 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 450 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 300 | actual | cortante | none vs none | 50.0 | 2.0 | 126 | 75 | 63 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs total | 50.0 | 6.5 | 17 | 138 | 0 | 5 | 41 | 0 | 0 | 0 |
| 300 | actual | cortante | total vs none | 50.0 | 6.5 | 34.4 | 83.5 | 17.2 | 0 | 0 | 315 | 592 | 1.5 |
| 300 | actual | cortante | total vs total | 50.0 | 7.0 | 15.6 | 107.5 | 0 | 4.7 | 38.1 | 441 | 592 | 2.5 |
| 300 | actual | contundente | none vs none | 50.0 | 2.0 | 132 | 75 | 79 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | contundente | none vs total | 50.0 | 6.5 | 22.8 | 141 | 4.4 | 3.6 | 31.1 | 0 | 0 | 0 |
| 300 | actual | contundente | total vs none | 50.0 | 6.5 | 36 | 82 | 21.5 | 0 | 0 | 335.5 | 592 | 2 |
| 300 | actual | contundente | total vs total | 50.0 | 7.0 | 18.6 | 109.5 | 2.9 | 3.4 | 29.3 | 533 | 592 | 3.5 |
| 300 | actual | perforante | none vs none | 50.0 | 2.0 | 105 | 127.5 | 35 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | perforante | none vs total | 0.0 | 4.0 | 17.6 | 150 | 0 | 5.8 | 44.8 | 0 | 0 | 0 |
| 300 | actual | perforante | total vs none | 100.0 | 4.0 | 60 | 79 | 20 | 0 | 0 | 157.5 | 592 | 0.5 |
| 300 | actual | perforante | total vs total | 50.0 | 7.0 | 17.1 | 105 | 0 | 5.5 | 43.5 | 227.5 | 592 | 1 |
| 300 | actual | proyectil | none vs none | 50.0 | 2.0 | 84 | 117 | 28 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | proyectil | none vs total | 0.0 | 3.5 | 15 | 150 | 0 | 4 | 37 | 0 | 0 | 0 |
| 300 | actual | proyectil | total vs none | 100.0 | 3.5 | 86.3 | 67.5 | 28.8 | 0 | 0 | 126 | 592 | 0.5 |
| 300 | actual | proyectil | total vs total | 50.0 | 7.0 | 15.1 | 98 | 0 | 4.1 | 37.3 | 183.5 | 592 | 0.5 |
| 400 | actual | cortante | none vs none | 50.0 | 2.0 | 135 | 166.5 | 77 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | cortante | none vs total | 0.0 | 4.0 | 18.8 | 198 | 0 | 5.6 | 45.5 | 0 | 0 | 0 |
| 400 | actual | cortante | total vs none | 100.0 | 4.0 | 79.9 | 75 | 44 | 0 | 0 | 308 | 640 | 1 |
| 400 | actual | cortante | total vs total | 50.0 | 7.0 | 26.6 | 136.5 | 3.8 | 5.2 | 42.1 | 512.5 | 640 | 3 |
| 400 | actual | contundente | none vs none | 50.0 | 2.0 | 140 | 169 | 93 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | contundente | none vs total | 0.0 | 4.5 | 20.7 | 198 | 1.2 | 4.2 | 33.3 | 0 | 0 | 0 |
| 400 | actual | contundente | total vs none | 100.0 | 4.5 | 62.2 | 93 | 41.3 | 0 | 0 | 413 | 640 | 2.5 |
| 400 | actual | contundente | total vs total | 50.0 | 7.0 | 30.4 | 131.5 | 8 | 3.8 | 30 | 552.5 | 640 | 3 |
| 400 | actual | perforante | none vs none | 50.0 | 2.0 | 106 | 152 | 42 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | perforante | none vs total | 0.0 | 4.0 | 20.8 | 198 | 0 | 6.3 | 50.1 | 0 | 0 | 0 |
| 400 | actual | perforante | total vs none | 100.0 | 4.0 | 63.6 | 83 | 24 | 0 | 0 | 168 | 640 | 0.5 |
| 400 | actual | perforante | total vs total | 50.0 | 7.0 | 20.9 | 141.5 | 0 | 6.3 | 50.4 | 294 | 640 | 1.5 |
| 400 | actual | proyectil | none vs none | 50.0 | 2.0 | 114 | 156 | 38 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | proyectil | none vs total | 0.0 | 2.0 | 20 | 198 | 0 | 6 | 50 | 0 | 0 | 0 |
| 400 | actual | proyectil | total vs none | 100.0 | 2.0 | 122.5 | 30 | 40.8 | 0 | 0 | 57 | 640 | 0 |
| 400 | actual | proyectil | total vs total | 50.0 | 10.0 | 20.3 | 192 | 0 | 6.1 | 50.8 | 366.5 | 640 | 2 |
| 450 | actual | cortante | none vs none | 50.0 | 2.0 | 162 | 193.5 | 81 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | cortante | none vs total | 50.0 | 5.0 | 28.7 | 193.5 | 0.8 | 6.3 | 46.8 | 0 | 0 | 0 |
| 450 | actual | cortante | total vs none | 50.0 | 5.0 | 48.6 | 134.5 | 24.3 | 0 | 0 | 401 | 640 | 2.5 |
| 450 | actual | cortante | total vs total | 50.0 | 7.0 | 25 | 166 | 0.6 | 5.8 | 43.6 | 563 | 640 | 3.5 |
| 450 | actual | contundente | none vs none | 50.0 | 2.0 | 162 | 193.5 | 97 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | contundente | none vs total | 50.0 | 5.0 | 41 | 193.5 | 13.6 | 4 | 33.6 | 0 | 0 | 0 |
| 450 | actual | contundente | total vs none | 50.0 | 5.0 | 54 | 130.5 | 32.3 | 0 | 0 | 417 | 640 | 2.5 |
| 450 | actual | contundente | total vs total | 50.0 | 7.0 | 34.5 | 149.5 | 10.5 | 3.9 | 32.2 | 562.5 | 640 | 3.5 |
| 450 | actual | perforante | none vs none | 50.0 | 2.0 | 136 | 180.5 | 45 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | perforante | none vs total | 50.0 | 4.5 | 25 | 180.5 | 0 | 8 | 58 | 0 | 0 | 0 |
| 450 | actual | perforante | total vs none | 50.0 | 4.5 | 58.3 | 137.5 | 19.3 | 0 | 0 | 247.5 | 640 | 1 |
| 450 | actual | perforante | total vs total | 50.0 | 7.0 | 23.3 | 163 | 0 | 7.4 | 53.7 | 315 | 640 | 1.5 |
| 450 | actual | proyectil | none vs none | 50.0 | 2.0 | 117 | 171 | 39 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | proyectil | none vs total | 0.0 | 2.0 | 21 | 225 | 0 | 7 | 50 | 0 | 0 | 0 |
| 450 | actual | proyectil | total vs none | 100.0 | 2.0 | 125.3 | 31.5 | 41.8 | 0 | 0 | 58.5 | 640 | 0 |
| 450 | actual | proyectil | total vs total | 50.0 | 11.0 | 21.3 | 220.5 | 0 | 7.1 | 50.7 | 415 | 640 | 2 |

## Invariantes (por nivel)
- Nivel 300: espejo fuera de 50±5%: ninguno ✅
- Nivel 400: espejo fuera de 50±5%: ninguno ✅
- Nivel 450: espejo fuera de 50±5%: ninguno ✅