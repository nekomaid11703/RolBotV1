# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=500 | nominal=20 | maxRounds=30
Niveles: 400, 450, 500 | Modos: full | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

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
| 400 | full | cortante | none vs none | 50.0 | 1.0 | 237 | 99 | 102 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | cortante | none vs total | 0.0 | 1.0 | 8 | 198 | 0 | 8 | 45 | 0 | 0 | 0 |
| 400 | full | cortante | total vs none | 100.0 | 1.0 | 237 | 4 | 102 | 0 | 0 | 51 | 480 | 0 |
| 400 | full | cortante | total vs total | 50.0 | 5.0 | 31.2 | 115 | 13.2 | 7.2 | 42 | 444 | 480 | 3.5 |
| 400 | full | contundente | none vs none | 50.0 | 1.0 | 245 | 99 | 115 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | contundente | none vs total | 0.0 | 1.0 | 6 | 198 | 0 | 6 | 34 | 0 | 0 | 0 |
| 400 | full | contundente | total vs none | 100.0 | 1.0 | 245 | 3 | 115 | 0 | 0 | 57.5 | 480 | 0 |
| 400 | full | contundente | total vs total | 50.0 | 5.0 | 38 | 111 | 21 | 5.6 | 31.6 | 470 | 480 | 3.5 |
| 400 | full | perforante | none vs none | 50.0 | 2.0 | 178 | 99 | 58 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | perforante | none vs total | 0.0 | 2.5 | 9 | 198 | 0 | 9 | 51 | 0 | 0 | 0 |
| 400 | full | perforante | total vs none | 100.0 | 2.5 | 167 | 4.5 | 58 | 0 | 0 | 29 | 480 | 0 |
| 400 | full | perforante | total vs total | 50.0 | 8.0 | 22.1 | 126 | 6.3 | 9.4 | 53.1 | 414 | 480 | 3 |
| 400 | full | proyectil | none vs none | 50.0 | 2.0 | 183 | 190.5 | 56 | 0 | 0 | 0 | 0 | 0 |
| 400 | full | proyectil | none vs total | 0.0 | 1.5 | 12 | 198 | 0 | 11 | 66 | 0 | 0 | 0 |
| 400 | full | proyectil | total vs none | 100.0 | 1.5 | 201.3 | 6 | 61.7 | 0 | 0 | 28 | 480 | 0 |
| 400 | full | proyectil | total vs total | 50.0 | 10.0 | 24.2 | 193 | 6.4 | 9.5 | 56.6 | 480 | 480 | 4 |
| 450 | full | cortante | none vs none | 50.0 | 1.0 | 263 | 112.5 | 105 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | cortante | none vs total | 0.0 | 1.0 | 12 | 225 | 0 | 11 | 60 | 0 | 0 | 0 |
| 450 | full | cortante | total vs none | 100.0 | 1.0 | 263 | 6 | 105 | 0 | 0 | 52.5 | 480 | 0 |
| 450 | full | cortante | total vs total | 50.0 | 6.0 | 39.7 | 174.5 | 17.7 | 7.2 | 39.5 | 480 | 480 | 4 |
| 450 | full | contundente | none vs none | 50.0 | 1.0 | 270 | 112.5 | 120 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | contundente | none vs total | 0.0 | 1.0 | 9 | 225 | 0 | 8 | 46 | 0 | 0 | 0 |
| 450 | full | contundente | total vs none | 100.0 | 1.0 | 270 | 4.5 | 120 | 0 | 0 | 60 | 480 | 0.5 |
| 450 | full | contundente | total vs total | 50.0 | 6.0 | 45 | 222.5 | 24 | 4.4 | 25.2 | 480 | 480 | 4 |
| 450 | full | perforante | none vs none | 50.0 | 2.0 | 199 | 112.5 | 61 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | perforante | none vs total | 0.0 | 3.5 | 11 | 225 | 0 | 10.3 | 58.7 | 0 | 0 | 0 |
| 450 | full | perforante | total vs none | 100.0 | 3.5 | 125 | 16.5 | 40.7 | 0 | 0 | 91.5 | 480 | 0.5 |
| 450 | full | perforante | total vs total | 50.0 | 8.0 | 21.6 | 144 | 4.6 | 9.9 | 55 | 423 | 480 | 3.5 |
| 450 | full | proyectil | none vs none | 50.0 | 2.0 | 186 | 205.5 | 57 | 0 | 0 | 0 | 0 | 0 |
| 450 | full | proyectil | none vs total | 0.0 | 1.5 | 12 | 225 | 0 | 12 | 66 | 0 | 0 | 0 |
| 450 | full | proyectil | total vs none | 100.0 | 1.5 | 204.3 | 6 | 62.7 | 0 | 0 | 28.5 | 480 | 0 |
| 450 | full | proyectil | total vs total | 50.0 | 10.0 | 25.9 | 214 | 7.4 | 10.3 | 56.6 | 480 | 480 | 4 |
| 500 | full | cortante | none vs none | 50.0 | 2.0 | 258 | 124.5 | 107 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | cortante | none vs total | 0.0 | 2.5 | 9 | 249 | 0 | 8 | 45 | 0 | 0 | 0 |
| 500 | full | cortante | total vs none | 100.0 | 2.5 | 248 | 4.5 | 107 | 0 | 0 | 53.5 | 480 | 0 |
| 500 | full | cortante | total vs total | 50.0 | 6.0 | 40 | 192.5 | 19.7 | 5.8 | 32.7 | 480 | 480 | 4 |
| 500 | full | contundente | none vs none | 50.0 | 1.0 | 264 | 124.5 | 124 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | contundente | none vs total | 0.0 | 1.0 | 8 | 249 | 0 | 6 | 35 | 0 | 0 | 0 |
| 500 | full | contundente | total vs none | 100.0 | 1.0 | 264 | 4 | 124 | 0 | 0 | 62 | 480 | 0.5 |
| 500 | full | contundente | total vs total | 50.0 | 5.0 | 35.2 | 157.5 | 17.3 | 4 | 23.3 | 480 | 480 | 4 |
| 500 | full | perforante | none vs none | 50.0 | 2.0 | 182 | 215.5 | 63 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | perforante | none vs total | 0.0 | 2.0 | 11 | 249 | 0 | 10 | 53 | 0 | 0 | 0 |
| 500 | full | perforante | total vs none | 100.0 | 2.0 | 182 | 16.5 | 63 | 0 | 0 | 94.5 | 480 | 0.5 |
| 500 | full | perforante | total vs total | 50.0 | 9.0 | 23.2 | 194.5 | 6.5 | 8.2 | 43.6 | 480 | 480 | 4 |
| 500 | full | proyectil | none vs none | 50.0 | 2.0 | 192 | 220.5 | 59 | 0 | 0 | 0 | 0 | 0 |
| 500 | full | proyectil | none vs total | 0.0 | 2.0 | 13 | 249 | 0 | 13 | 66 | 0 | 0 | 0 |
| 500 | full | proyectil | total vs none | 100.0 | 2.0 | 204.5 | 19.5 | 62.8 | 0 | 0 | 88.5 | 480 | 0 |
| 500 | full | proyectil | total vs total | 50.0 | 9.0 | 26.2 | 230 | 6.5 | 11 | 56 | 480 | 480 | 4 |

## Invariantes (por nivel)
- Nivel 400: espejo fuera de 50±5%: ninguno ✅
- Nivel 450: espejo fuera de 50±5%: ninguno ✅
- Nivel 500: espejo fuera de 50±5%: ninguno ✅