# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=500 | nominal=20 | maxRounds=30
Niveles: 450, 500 | Modos: full | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 450 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 500 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 450 | full | cortante | none vs none | 50.0 | 1.0 | 368 | 112.5 | 147 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | cortante | none vs total | 0.0 | 1.0 | 10 | 225 | 0 | 12 | 97 | 0 | 0 | 0 |
| 450 | full | cortante | total vs none | 100.0 | 1.0 | 368 | 5 | 147 | 0 | 0 | 73.5 | 688 | 0 |
| 450 | full | cortante | total vs total | 50.0 | 6.0 | 43.6 | 173 | 21.9 | 7.9 | 63.7 | 688 | 688 | 4 |
| 450 | full | contundente | none vs none | 50.0 | 1.0 | 340 | 112.5 | 151 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | contundente | none vs total | 0.0 | 1.0 | 8 | 225 | 0 | 8 | 66 | 0 | 0 | 0 |
| 450 | full | contundente | total vs none | 100.0 | 1.0 | 340 | 4 | 151 | 0 | 0 | 75.5 | 688 | 0 |
| 450 | full | contundente | total vs total | 50.0 | 6.0 | 44.3 | 177.5 | 25.9 | 5.3 | 43.6 | 688 | 688 | 4 |
| 450 | full | perforante | none vs none | 50.0 | 1.0 | 264 | 112.5 | 81 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | perforante | none vs total | 0.0 | 1.0 | 12 | 225 | 0 | 13 | 108 | 0 | 0 | 0 |
| 450 | full | perforante | total vs none | 100.0 | 1.0 | 264 | 6 | 81 | 0 | 0 | 40.5 | 688 | 0 |
| 450 | full | perforante | total vs total | 50.0 | 8.0 | 24.4 | 141 | 7.6 | 10.4 | 85.8 | 587 | 688 | 3 |
| 450 | full | proyectil | none vs none | 50.0 | 1.0 | 364 | 112.5 | 112 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | proyectil | none vs total | 0.0 | 1.0 | 15 | 225 | 0 | 19 | 148 | 0 | 0 | 0 |
| 450 | full | proyectil | total vs none | 100.0 | 1.0 | 356 | 7.5 | 109.5 | 0 | 0 | 56 | 688 | 0 |
| 450 | full | proyectil | total vs total | 50.0 | 8.0 | 37 | 215.5 | 12 | 13.9 | 110.3 | 688 | 688 | 4 |
| 500 | full | cortante | none vs none | 50.0 | 1.0 | 345 | 124.5 | 149 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | cortante | none vs total | 0.0 | 1.0 | 9 | 249 | 0 | 9 | 73 | 0 | 0 | 0 |
| 500 | full | cortante | total vs none | 100.0 | 1.0 | 345 | 4.5 | 149 | 0 | 0 | 74.5 | 688 | 0 |
| 500 | full | cortante | total vs total | 50.0 | 6.0 | 44.9 | 193.5 | 23.9 | 6.5 | 53.1 | 688 | 688 | 4 |
| 500 | full | contundente | none vs none | 50.0 | 1.0 | 332 | 124.5 | 156 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | contundente | none vs total | 0.0 | 1.0 | 6 | 249 | 0 | 7 | 50 | 0 | 0 | 0 |
| 500 | full | contundente | total vs none | 100.0 | 1.0 | 332 | 3 | 156 | 0 | 0 | 78 | 688 | 0 |
| 500 | full | contundente | total vs total | 50.0 | 6.0 | 49.1 | 205 | 30.9 | 5.1 | 36.4 | 688 | 688 | 4 |
| 500 | full | perforante | none vs none | 50.0 | 2.0 | 255 | 124.5 | 83 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | perforante | none vs total | 0.0 | 2.5 | 9 | 249 | 0 | 11 | 81 | 0 | 0 | 0 |
| 500 | full | perforante | total vs none | 100.0 | 2.5 | 239 | 4.5 | 83 | 0 | 0 | 41.5 | 688 | 0 |
| 500 | full | perforante | total vs total | 50.0 | 10.0 | 26.1 | 214 | 10.6 | 9.3 | 68.2 | 688 | 688 | 4 |
| 500 | full | proyectil | none vs none | 50.0 | 1.0 | 362 | 124.5 | 111 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | proyectil | none vs total | 0.0 | 1.0 | 16 | 249 | 0 | 19 | 145 | 0 | 0 | 0 |
| 500 | full | proyectil | total vs none | 100.0 | 1.0 | 359.5 | 8 | 110.5 | 0 | 0 | 55.5 | 688 | 0 |
| 500 | full | proyectil | total vs total | 50.0 | 8.0 | 28.3 | 207.5 | 7.4 | 14.7 | 113.3 | 688 | 688 | 4 |

## Invariantes (por nivel)
- Nivel 450: espejo fuera de 50±5%: ninguno ✅
- Nivel 500: espejo fuera de 50±5%: ninguno ✅