# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=500 | nominal=20 | maxRounds=30
Niveles: 250, 350, 399 | Modos: full | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 250 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 350 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Nivel 399 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| full | cortante | 50.0% | 50.0% |
| full | contundente | 50.0% | 50.0% |
| full | perforante | 50.0% | 50.0% |
| full | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 250 | full | cortante | none vs none | 50.0 | 2.0 | 123 | 61.5 | 51 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | cortante | none vs total | 50.0 | 5.5 | 24.6 | 120.5 | 8.9 | 4.7 | 15.6 | 0 | 0 | 0 |
| 250 | full | cortante | total vs none | 50.0 | 5.5 | 39.3 | 65 | 17 | 0 | 0 | 147.5 | 244 | 2 |
| 250 | full | cortante | total vs total | 50.0 | 5.0 | 19.3 | 75.5 | 6.2 | 4.8 | 16 | 224 | 244 | 3.5 |
| 250 | full | contundente | none vs none | 50.0 | 1.0 | 143 | 61.5 | 67 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | contundente | none vs total | 0.0 | 1.0 | 6 | 123 | 0 | 4 | 15 | 0 | 0 | 0 |
| 250 | full | contundente | total vs none | 100.0 | 1.0 | 143 | 3 | 67 | 0 | 0 | 33.5 | 244 | 0.5 |
| 250 | full | contundente | total vs total | 50.0 | 5.0 | 28.2 | 94.5 | 12.8 | 3.3 | 12 | 244 | 244 | 4 |
| 250 | full | perforante | none vs none | 50.0 | 2.0 | 82 | 102.5 | 28 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | perforante | none vs total | 0.0 | 3.5 | 9 | 123 | 0 | 6 | 23 | 0 | 0 | 0 |
| 250 | full | perforante | total vs none | 100.0 | 3.5 | 46.9 | 27 | 16 | 0 | 0 | 84 | 244 | 0.5 |
| 250 | full | perforante | total vs total | 50.0 | 8.0 | 14.1 | 85.5 | 2.3 | 5.4 | 20.5 | 206 | 244 | 3 |
| 250 | full | proyectil | none vs none | 50.0 | 2.0 | 69 | 96 | 21 | 0 | 0 | 0 | 0 | 0 |
| 250 | full | proyectil | none vs total | 0.0 | 2.0 | 8 | 123 | 0 | 5 | 19 | 0 | 0 | 0 |
| 250 | full | proyectil | total vs none | 100.0 | 2.0 | 69 | 12 | 21 | 0 | 0 | 31.5 | 244 | 0 |
| 250 | full | proyectil | total vs total | 50.0 | 11.0 | 10.7 | 97.5 | 1.3 | 4.5 | 17.3 | 216.5 | 244 | 3.5 |
| 350 | full | cortante | none vs none | 50.0 | 2.0 | 159 | 87 | 66 | 0 | 0 | 0 | 0 | 0 |
| 350 | full | cortante | none vs total | 0.0 | 3.5 | 10 | 174 | 0 | 7 | 25.3 | 0 | 0 | 0 |
| 350 | full | cortante | total vs none | 100.0 | 3.5 | 102 | 15 | 44 | 0 | 0 | 99 | 268 | 0.5 |
| 350 | full | cortante | total vs total | 50.0 | 6.0 | 30 | 105 | 12.8 | 4.8 | 18.4 | 266 | 268 | 3.5 |
| 350 | full | contundente | none vs none | 50.0 | 1.0 | 179 | 87 | 84 | 0 | 0 | 0 | 0 | 0 |
| 350 | full | contundente | none vs total | 0.0 | 1.0 | 8 | 174 | 0 | 5 | 19 | 0 | 0 | 0 |
| 350 | full | contundente | total vs none | 100.0 | 1.0 | 179 | 4 | 84 | 0 | 0 | 42 | 268 | 0.5 |
| 350 | full | contundente | total vs total | 50.0 | 5.0 | 37.8 | 99 | 19 | 3.8 | 14.3 | 260 | 268 | 3.5 |
| 350 | full | perforante | none vs none | 50.0 | 2.0 | 107 | 140.5 | 37 | 0 | 0 | 0 | 0 | 0 |
| 350 | full | perforante | none vs total | 0.0 | 2.0 | 10 | 174 | 0 | 7 | 25 | 0 | 0 | 0 |
| 350 | full | perforante | total vs none | 100.0 | 2.0 | 107 | 15 | 37 | 0 | 0 | 55.5 | 268 | 0.5 |
| 350 | full | perforante | total vs total | 50.0 | 9.0 | 17.8 | 122 | 4.1 | 6.1 | 21.9 | 263.5 | 268 | 3.5 |
| 350 | full | proyectil | none vs none | 50.0 | 2.0 | 95 | 134.5 | 29 | 0 | 0 | 0 | 0 | 0 |
| 350 | full | proyectil | none vs total | 0.0 | 4.0 | 14.1 | 174 | 2 | 7.3 | 23.6 | 0 | 0 | 0 |
| 350 | full | proyectil | total vs none | 100.0 | 4.0 | 97.3 | 77.5 | 29.8 | 0 | 0 | 148.5 | 268 | 2 |
| 350 | full | proyectil | total vs total | 50.0 | 7.0 | 17.8 | 98 | 3.9 | 6.8 | 22.2 | 164.5 | 268 | 2 |
| 399 | full | cortante | none vs none | 50.0 | 2.0 | 164 | 99 | 68 | 0 | 0 | 0 | 0 | 0 |
| 399 | full | cortante | none vs total | 0.0 | 2.5 | 10 | 198 | 0 | 7 | 22 | 0 | 0 | 0 |
| 399 | full | cortante | total vs none | 100.0 | 2.5 | 158 | 5 | 68 | 0 | 0 | 34 | 268 | 0.5 |
| 399 | full | cortante | total vs total | 50.0 | 5.0 | 37.8 | 128 | 14.4 | 4.8 | 15.6 | 268 | 268 | 4 |
| 399 | full | contundente | none vs none | 50.0 | 2.0 | 193 | 99 | 88 | 0 | 0 | 0 | 0 | 0 |
| 399 | full | contundente | none vs total | 0.0 | 2.5 | 9 | 198 | 0 | 6 | 19 | 0 | 0 | 0 |
| 399 | full | contundente | total vs none | 100.0 | 2.5 | 187 | 4.5 | 88 | 0 | 0 | 44 | 268 | 0.5 |
| 399 | full | contundente | total vs total | 50.0 | 5.0 | 53.9 | 184.5 | 28.4 | 4.7 | 15 | 268 | 268 | 4 |
| 399 | full | perforante | none vs none | 50.0 | 2.0 | 113 | 155.5 | 39 | 0 | 0 | 0 | 0 | 0 |
| 399 | full | perforante | none vs total | 0.0 | 4.0 | 13.5 | 198 | 0 | 9.9 | 31.6 | 0 | 0 | 0 |
| 399 | full | perforante | total vs none | 100.0 | 4.0 | 66.7 | 54 | 22.3 | 0 | 0 | 156 | 268 | 2 |
| 399 | full | perforante | total vs total | 50.0 | 7.0 | 20.4 | 132 | 3.1 | 8.1 | 26.1 | 251 | 268 | 3.5 |
| 399 | full | proyectil | none vs none | 50.0 | 2.0 | 99 | 148.5 | 30 | 0 | 0 | 0 | 0 | 0 |
| 399 | full | proyectil | none vs total | 0.0 | 3.5 | 12 | 198 | 0 | 8 | 27 | 0 | 0 | 0 |
| 399 | full | proyectil | total vs none | 100.0 | 3.5 | 100.3 | 54 | 30.5 | 0 | 0 | 135 | 268 | 1.5 |
| 399 | full | proyectil | total vs total | 50.0 | 7.0 | 21.4 | 117 | 4.4 | 6.4 | 21.3 | 180 | 268 | 2.5 |

## Invariantes (por nivel)
- Nivel 250: espejo fuera de 50±5%: ninguno ✅
- Nivel 350: espejo fuera de 50±5%: ninguno ✅
- Nivel 399: espejo fuera de 50±5%: ninguno ✅