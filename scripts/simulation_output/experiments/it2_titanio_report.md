# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=500 | nominal=20 | maxRounds=30
Niveles: 300, 400, 450 | Modos: full | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 300 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 400 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 450 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 300 | full | cortante | none vs none | 50.0 | 1.0 | 158 | 75 | 63 | 0 | 0 | 0 | 0 | 0 |
| 300 | full | cortante | none vs total | 0.0 | 1.0 | 5 | 150 | 0 | 5 | 41 | 0 | 0 | 0 |
| 300 | full | cortante | total vs none | 100.0 | 1.0 | 158 | 2.5 | 63 | 0 | 0 | 31.5 | 592 | 0 |
| 300 | full | cortante | total vs total | 50.0 | 9.0 | 13 | 89.5 | 5.6 | 4.1 | 33.1 | 516.5 | 592 | 3 |
| 300 | full | contundente | none vs none | 50.0 | 1.0 | 178 | 75 | 79 | 0 | 0 | 0 | 0 | 0 |
| 300 | full | contundente | none vs total | 0.0 | 1.0 | 4 | 150 | 0 | 4 | 35 | 0 | 0 | 0 |
| 300 | full | contundente | total vs none | 100.0 | 1.0 | 178 | 2 | 79 | 0 | 0 | 39.5 | 592 | 0 |
| 300 | full | contundente | total vs total | 50.0 | 8.0 | 14.2 | 86 | 7.4 | 3.1 | 27.3 | 572.5 | 592 | 3.5 |
| 300 | full | perforante | none vs none | 50.0 | 2.0 | 114 | 75 | 35 | 0 | 0 | 0 | 0 | 0 |
| 300 | full | perforante | none vs total | 50.0 | 11.0 | 9.8 | 132 | 2 | 5.4 | 41.2 | 0 | 0 | 0 |
| 300 | full | perforante | total vs none | 50.0 | 11.0 | 19 | 78 | 5.8 | 0 | 0 | 313.5 | 592 | 2 |
| 300 | full | perforante | total vs total | 50.0 | 15.0 | 7.8 | 98 | 1.3 | 4.9 | 39 | 488.5 | 592 | 3 |
| 300 | full | proyectil | none vs none | 50.0 | 2.0 | 91 | 120.5 | 28 | 0 | 0 | 0 | 0 | 0 |
| 300 | full | proyectil | none vs total | 0.0 | 3.5 | 5 | 150 | 0 | 4 | 37 | 0 | 0 | 0 |
| 300 | full | proyectil | total vs none | 100.0 | 3.5 | 93.5 | 22.5 | 28.8 | 0 | 0 | 126 | 592 | 0.5 |
| 300 | full | proyectil | total vs total | 50.0 | 18.0 | 6.1 | 107.5 | 0.7 | 3.9 | 36.1 | 479.5 | 592 | 3 |
| 400 | full | cortante | none vs none | 50.0 | 2.0 | 186 | 99 | 77 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | cortante | none vs total | 0.0 | 2.5 | 5 | 198 | 0 | 5 | 38 | 0 | 0 | 0 |
| 400 | full | cortante | total vs none | 100.0 | 2.5 | 179 | 2.5 | 77 | 0 | 0 | 38.5 | 640 | 0 |
| 400 | full | cortante | total vs total | 50.0 | 8.0 | 17.6 | 114 | 8.1 | 4.9 | 39.3 | 551 | 640 | 3 |
| 400 | full | contundente | none vs none | 50.0 | 1.0 | 198 | 99 | 93 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | contundente | none vs total | 0.0 | 1.0 | 4 | 198 | 0 | 4 | 30 | 0 | 0 | 0 |
| 400 | full | contundente | total vs none | 100.0 | 1.0 | 198 | 2 | 93 | 0 | 0 | 46.5 | 640 | 0 |
| 400 | full | contundente | total vs total | 50.0 | 8.0 | 23.3 | 111 | 13.1 | 3.6 | 28 | 599 | 640 | 3.5 |
| 400 | full | perforante | none vs none | 50.0 | 2.0 | 122 | 160 | 42 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | perforante | none vs total | 0.0 | 4.0 | 5.6 | 198 | 0 | 6.3 | 50.1 | 0 | 0 | 0 |
| 400 | full | perforante | total vs none | 100.0 | 4.0 | 72 | 22.5 | 24 | 0 | 0 | 168 | 640 | 0.5 |
| 400 | full | perforante | total vs total | 50.0 | 14.0 | 10.3 | 124 | 2.7 | 5.7 | 46.1 | 530 | 640 | 3 |
| 400 | full | proyectil | none vs none | 50.0 | 2.0 | 124 | 161 | 38 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | proyectil | none vs total | 0.0 | 2.0 | 6 | 198 | 0 | 6 | 50 | 0 | 0 | 0 |
| 400 | full | proyectil | total vs none | 100.0 | 2.0 | 133 | 9 | 40.8 | 0 | 0 | 57 | 640 | 0 |
| 400 | full | proyectil | total vs total | 50.0 | 18.0 | 11.1 | 195 | 2.8 | 5.4 | 44.9 | 640 | 640 | 4 |
| 450 | full | cortante | none vs none | 50.0 | 2.0 | 203 | 112.5 | 81 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | cortante | none vs total | 0.0 | 3.5 | 6 | 225 | 0 | 5.7 | 43.3 | 0 | 0 | 0 |
| 450 | full | cortante | total vs none | 100.0 | 3.5 | 130.3 | 9 | 54 | 0 | 0 | 121.5 | 640 | 0.5 |
| 450 | full | cortante | total vs total | 50.0 | 8.0 | 22.5 | 130.5 | 10.6 | 5.1 | 38.2 | 563 | 640 | 3.5 |
| 450 | full | contundente | none vs none | 50.0 | 2.0 | 219 | 112.5 | 97 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | contundente | none vs total | 0.0 | 3.5 | 4.7 | 225 | 0 | 4.3 | 34.7 | 0 | 0 | 0 |
| 450 | full | contundente | total vs none | 100.0 | 3.5 | 142 | 7 | 64.7 | 0 | 0 | 145.5 | 640 | 0.5 |
| 450 | full | contundente | total vs total | 50.0 | 7.0 | 19.3 | 125.5 | 9.7 | 3.9 | 32.1 | 611 | 640 | 3.5 |
| 450 | full | perforante | none vs none | 50.0 | 2.0 | 147 | 186 | 45 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | perforante | none vs total | 0.0 | 4.5 | 7 | 225 | 0 | 8 | 58 | 0 | 0 | 0 |
| 450 | full | perforante | total vs none | 100.0 | 4.5 | 73.5 | 31.5 | 22.5 | 0 | 0 | 202.5 | 640 | 0.5 |
| 450 | full | perforante | total vs total | 50.0 | 13.0 | 12.2 | 140 | 3.2 | 6.7 | 48.6 | 522.5 | 640 | 3 |
| 450 | full | proyectil | none vs none | 50.0 | 2.0 | 127 | 176 | 39 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | proyectil | none vs total | 0.0 | 2.0 | 6 | 225 | 0 | 7 | 50 | 0 | 0 | 0 |
| 450 | full | proyectil | total vs none | 100.0 | 2.0 | 136 | 9 | 41.8 | 0 | 0 | 58.5 | 640 | 0 |
| 450 | full | proyectil | total vs total | 50.0 | 18.0 | 12.5 | 221 | 3.8 | 6.3 | 44.8 | 640 | 640 | 4 |

## Invariantes (por nivel)
- Nivel 300: espejo fuera de 50±5%: ninguno ✅
- Nivel 400: espejo fuera de 50±5%: ninguno ✅
- Nivel 450: espejo fuera de 50±5%: ninguno ✅