# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=500 | nominal=20 | maxRounds=30
Niveles: 150, 250, 299 | Modos: full | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 150 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 250 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 299 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 150 | full | cortante | none vs none | 50.0 | 2.0 | 65 | 37.5 | 26 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | cortante | none vs total | 0.0 | 4.0 | 3 | 75 | 0 | 3 | 14 | 0 | 0 | 0 |
| 150 | full | cortante | total vs none | 100.0 | 4.0 | 43.3 | 6 | 17.3 | 0 | 0 | 52 | 324 | 0 |
| 150 | full | cortante | total vs total | 50.0 | 12.0 | 6 | 49.5 | 1.8 | 2.5 | 12 | 266 | 324 | 3 |
| 150 | full | contundente | none vs none | 50.0 | 1.0 | 88 | 37.5 | 39 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | contundente | none vs total | 0.0 | 1.5 | 3 | 75 | 0 | 3 | 14 | 0 | 0 | 0 |
| 150 | full | contundente | total vs none | 100.0 | 1.5 | 88 | 3 | 39 | 0 | 0 | 39 | 324 | 0 |
| 150 | full | contundente | total vs total | 50.0 | 9.0 | 9.3 | 46.5 | 4.1 | 2.4 | 11.5 | 279 | 324 | 3 |
| 150 | full | perforante | none vs none | 50.0 | 2.0 | 43 | 59 | 13 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | perforante | none vs total | 0.0 | 2.5 | 3 | 75 | 0 | 3 | 15 | 0 | 0 | 0 |
| 150 | full | perforante | total vs none | 100.0 | 2.5 | 43 | 6 | 13 | 0 | 0 | 26 | 324 | 0 |
| 150 | full | perforante | total vs total | 50.0 | 22.0 | 3.2 | 58.5 | 0 | 2.7 | 13.6 | 253 | 324 | 3 |
| 150 | full | proyectil | none vs none | 50.0 | 3.0 | 26 | 63.5 | 8 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | proyectil | none vs total | 0.0 | 3.0 | 3 | 75 | 0 | 1 | 9 | 0 | 0 | 0 |
| 150 | full | proyectil | total vs none | 100.0 | 3.0 | 26 | 7.5 | 8 | 0 | 0 | 20 | 324 | 0 |
| 150 | full | proyectil | total vs total | 50.0 | 31.0 | 2.8 | 71.5 | 0 | 0.9 | 8.1 | 186.5 | 324 | 2 |
| 250 | full | cortante | none vs none | 50.0 | 2.0 | 86 | 104.5 | 37 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | cortante | none vs total | 0.0 | 3.5 | 4.5 | 123 | 0 | 3.5 | 17.5 | 0 | 0 | 0 |
| 250 | full | cortante | total vs none | 100.0 | 3.5 | 49.1 | 13.5 | 21.1 | 0 | 0 | 111 | 352 | 0.5 |
| 250 | full | cortante | total vs total | 50.0 | 9.0 | 9.6 | 75.5 | 3.1 | 3.2 | 15.8 | 305.5 | 352 | 3 |
| 250 | full | contundente | none vs none | 50.0 | 2.0 | 118.5 | 61.5 | 54 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | contundente | none vs total | 50.0 | 6.5 | 18.4 | 119 | 8.9 | 3 | 14.2 | 0 | 0 | 0 |
| 250 | full | contundente | total vs none | 50.0 | 6.5 | 31.4 | 63.5 | 14.7 | 0 | 0 | 203 | 352 | 2 |
| 250 | full | contundente | total vs total | 50.0 | 7.0 | 13.3 | 73.5 | 5.7 | 3 | 14.1 | 338 | 352 | 3.5 |
| 250 | full | perforante | none vs none | 50.0 | 3.0 | 57 | 89 | 19 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | perforante | none vs total | 50.0 | 12.5 | 6.7 | 116.5 | 0.4 | 3.7 | 19.3 | 0 | 0 | 0 |
| 250 | full | perforante | total vs none | 50.0 | 12.5 | 12 | 65.5 | 4.1 | 0 | 0 | 195 | 352 | 2 |
| 250 | full | perforante | total vs total | 50.0 | 14.0 | 5.9 | 79.5 | 0.3 | 3.5 | 18.5 | 261.5 | 352 | 2.5 |
| 250 | full | proyectil | none vs none | 50.0 | 3.0 | 43 | 104.5 | 13 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | proyectil | none vs total | 0.0 | 3.5 | 4 | 123 | 0 | 3 | 14 | 0 | 0 | 0 |
| 250 | full | proyectil | total vs none | 100.0 | 3.5 | 43 | 14 | 13 | 0 | 0 | 45.5 | 352 | 0 |
| 250 | full | proyectil | total vs total | 50.0 | 27.0 | 4.4 | 111.5 | 0.2 | 2.9 | 13.7 | 338.5 | 352 | 3.5 |
| 299 | full | cortante | none vs none | 50.0 | 2.0 | 95 | 121 | 41 | 0 | 0 | 0 | 0 | 0 |
| 299 | full | cortante | none vs total | 0.0 | 4.0 | 5.5 | 147 | 0 | 3.5 | 19 | 0 | 0 | 0 |
| 299 | full | cortante | total vs none | 100.0 | 4.0 | 55.4 | 22 | 23.4 | 0 | 0 | 164 | 352 | 1 |
| 299 | full | cortante | total vs total | 50.0 | 8.0 | 11.6 | 88.5 | 3.6 | 3.1 | 17 | 299 | 352 | 3 |
| 299 | full | contundente | none vs none | 50.0 | 2.0 | 127.5 | 73.5 | 58 | 0 | 0 | 0 | 0 | 0 |
| 299 | full | contundente | none vs total | 50.0 | 6.0 | 24.4 | 135.5 | 12.4 | 3 | 15.7 | 0 | 0 | 0 |
| 299 | full | contundente | total vs none | 50.0 | 6.0 | 37.2 | 76 | 17.4 | 0 | 0 | 205 | 352 | 2 |
| 299 | full | contundente | total vs total | 50.0 | 7.0 | 18.2 | 86 | 8.6 | 3 | 15.5 | 321 | 352 | 3.5 |
| 299 | full | perforante | none vs none | 50.0 | 3.0 | 66 | 105.5 | 22 | 0 | 0 | 0 | 0 | 0 |
| 299 | full | perforante | none vs total | 0.0 | 5.0 | 5.5 | 147 | 0 | 4.5 | 20 | 0 | 0 | 0 |
| 299 | full | perforante | total vs none | 100.0 | 5.0 | 44.4 | 22 | 14.7 | 0 | 0 | 88 | 352 | 0.5 |
| 299 | full | perforante | total vs total | 50.0 | 14.0 | 7.3 | 98.5 | 0.8 | 4.3 | 19.1 | 286 | 352 | 3 |
| 299 | full | proyectil | none vs none | 50.0 | 4.0 | 46 | 142.5 | 14 | 0 | 0 | 0 | 0 | 0 |
| 299 | full | proyectil | none vs total | 0.0 | 4.5 | 4 | 147 | 0 | 3 | 15 | 0 | 0 | 0 |
| 299 | full | proyectil | total vs none | 100.0 | 4.5 | 46 | 16 | 14 | 0 | 0 | 56 | 352 | 0 |
| 299 | full | proyectil | total vs total | 50.0 | 25.0 | 5 | 119.5 | 0.5 | 2.9 | 14.4 | 337 | 352 | 3.5 |

## Invariantes (por nivel)
- Nivel 150: espejo fuera de 50±5%: ninguno ✅
- Nivel 250: espejo fuera de 50±5%: ninguno ✅
- Nivel 299: espejo fuera de 50±5%: ninguno ✅