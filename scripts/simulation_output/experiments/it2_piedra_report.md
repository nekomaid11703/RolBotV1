# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=500 | nominal=20 | maxRounds=30
Niveles: 100, 150, 199 | Modos: full | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 150 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 0.0% |

## Nivel 199 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 0.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | full | cortante | none vs none | 50.0 | 2.0 | 35 | 41.5 | 15 | 0 | 0 | 0 | 0 | 0 |
| 100 | full | cortante | none vs total | 0.0 | 2.5 | 3 | 48 | 0 | 1 | 5 | 0 | 0 | 0 |
| 100 | full | cortante | total vs none | 100.0 | 2.5 | 35 | 6 | 15 | 0 | 0 | 30 | 216 | 0 |
| 100 | full | cortante | total vs total | 50.0 | 17.0 | 3.5 | 43.5 | 0.3 | 1 | 4.8 | 205.5 | 216 | 3.5 |
| 100 | full | contundente | none vs none | 50.0 | 1.0 | 51 | 24 | 24 | 0 | 0 | 0 | 0 | 0 |
| 100 | full | contundente | none vs total | 0.0 | 1.5 | 3 | 48 | 0 | 1 | 5 | 0 | 0 | 0 |
| 100 | full | contundente | total vs none | 100.0 | 1.5 | 51 | 3 | 24 | 0 | 0 | 24 | 216 | 0 |
| 100 | full | contundente | total vs total | 50.0 | 10.0 | 5.2 | 39 | 1.3 | 0.8 | 4.2 | 216 | 216 | 4 |
| 100 | full | perforante | none vs none | 50.0 | 3.0 | 21 | 34.5 | 7 | 0 | 0 | 0 | 0 | 0 |
| 100 | full | perforante | none vs total | 100.0 | 19.5 | 3 | 42 | 0 | 1.9 | 6.8 | 0 | 0 | 0 |
| 100 | full | perforante | total vs none | 0.0 | 19.5 | 2.5 | 48 | 0.8 | 0 | 0 | 112 | 216 | 2 |
| 100 | full | perforante | total vs total | 50.0 | 20.0 | 3 | 45 | 0 | 1 | 5 | 105 | 216 | 1.5 |
| 100 | full | proyectil | none vs none | 50.0 | 4.0 | 13 | 37 | 4 | 0 | 0 | 0 | 0 | 0 |
| 100 | full | proyectil | none vs total | 0.0 | 4.5 | 2.3 | 48 | 0 | 1 | 3 | 0 | 0 | 0 |
| 100 | full | proyectil | total vs none | 100.0 | 4.5 | 11.9 | 7 | 3.4 | 0 | 0 | 10 | 216 | 0 |
| 100 | full | proyectil | total vs total | 50.0 | 31.0 | 1.8 | 44.5 | 0 | 0.8 | 2.3 | 64 | 216 | 1 |
| 150 | full | cortante | none vs none | 50.0 | 2.0 | 53 | 64 | 21 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | cortante | none vs total | 0.0 | 2.5 | 4 | 75 | 0 | 3 | 9 | 0 | 0 | 0 |
| 150 | full | cortante | total vs none | 100.0 | 2.5 | 53 | 8 | 21 | 0 | 0 | 42 | 216 | 0 |
| 150 | full | cortante | total vs total | 50.0 | 10.0 | 7.2 | 47.5 | 2 | 2.4 | 7.6 | 171 | 216 | 3 |
| 150 | full | contundente | none vs none | 50.0 | 1.0 | 77 | 37.5 | 34 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | contundente | none vs total | 0.0 | 1.5 | 5 | 75 | 0 | 3 | 10 | 0 | 0 | 0 |
| 150 | full | contundente | total vs none | 100.0 | 1.5 | 77 | 5 | 34 | 0 | 0 | 34 | 216 | 0 |
| 150 | full | contundente | total vs total | 50.0 | 7.0 | 12.3 | 46.5 | 4.7 | 2.3 | 7.8 | 176 | 216 | 3 |
| 150 | full | perforante | none vs none | 50.0 | 3.0 | 34 | 54.5 | 10 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | perforante | none vs total | 50.0 | 12.0 | 4 | 71.5 | 0 | 3 | 9 | 0 | 0 | 0 |
| 150 | full | perforante | total vs none | 50.0 | 12.0 | 7.7 | 41.5 | 2.3 | 0 | 0 | 105 | 216 | 1.5 |
| 150 | full | perforante | total vs total | 50.0 | 15.0 | 3.8 | 52.5 | 0 | 2.8 | 8.6 | 140 | 216 | 2 |
| 150 | full | proyectil | none vs none | 50.0 | 28.0 | 3 | 73.5 | 1 | 0 | 0 | 0 | 0 | 0 |
| 150 | full | proyectil | none vs total | 0.0 | 23.5 | 1.1 | 75 | 0 | 0 | 0.2 | 0 | 0 | 0 |
| 150 | full | proyectil | total vs none | 100.0 | 23.5 | 3.6 | 22.5 | 1.2 | 0 | 0 | 24.5 | 216 | 0 |
| 150 | full | proyectil | total vs total | 0.0 | 31.0 | 1 | 30 | 0 | 0 | 0 | 30 | 216 | 0 |
| 199 | full | cortante | none vs none | 50.0 | 2.0 | 56 | 77.5 | 24 | 0 | 0 | 0 | 0 | 0 |
| 199 | full | cortante | none vs total | 0.0 | 3.0 | 5.2 | 99 | 0 | 2.6 | 9.2 | 0 | 0 | 0 |
| 199 | full | cortante | total vs none | 100.0 | 3.0 | 37.3 | 13 | 16 | 0 | 0 | 60 | 216 | 0.5 |
| 199 | full | cortante | total vs total | 50.0 | 9.0 | 7.8 | 63.5 | 1.4 | 2.2 | 8 | 192 | 216 | 3.5 |
| 199 | full | contundente | none vs none | 50.0 | 2.0 | 88 | 49.5 | 40 | 0 | 0 | 0 | 0 | 0 |
| 199 | full | contundente | none vs total | 50.0 | 6.0 | 18.5 | 92 | 8 | 2.3 | 8.5 | 0 | 0 | 0 |
| 199 | full | contundente | total vs none | 50.0 | 6.0 | 23.2 | 51.5 | 10.9 | 0 | 0 | 128 | 216 | 2 |
| 199 | full | contundente | total vs total | 50.0 | 6.0 | 14.4 | 57.5 | 5.8 | 2.5 | 8.4 | 188 | 216 | 3 |
| 199 | full | perforante | none vs none | 50.0 | 3.0 | 36 | 85.5 | 12 | 0 | 0 | 0 | 0 | 0 |
| 199 | full | perforante | none vs total | 0.0 | 4.0 | 5 | 99 | 0 | 2.5 | 9.5 | 0 | 0 | 0 |
| 199 | full | perforante | total vs none | 100.0 | 4.0 | 27 | 20 | 9 | 0 | 0 | 48 | 216 | 0.5 |
| 199 | full | perforante | total vs total | 50.0 | 15.0 | 5.2 | 68.5 | 0 | 2.4 | 9.3 | 162 | 216 | 3 |
| 199 | full | proyectil | none vs none | 50.0 | 10.0 | 9.2 | 81 | 2.8 | 0 | 0 | 0 | 0 | 0 |
| 199 | full | proyectil | none vs total | 0.0 | 11.5 | 1.8 | 99 | 0 | 0.8 | 1.5 | 0 | 0 | 0 |
| 199 | full | proyectil | total vs none | 100.0 | 11.5 | 8.3 | 15 | 2.5 | 0 | 0 | 21.5 | 216 | 0 |
| 199 | full | proyectil | total vs total | 0.0 | 31.0 | 2 | 60 | 0 | 1 | 2 | 90 | 216 | 1 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: ninguno ✅
- Nivel 150: espejo fuera de 50±5%: full/proyectil/total=0.0%
- Nivel 199: espejo fuera de 50±5%: full/proyectil/total=0.0%