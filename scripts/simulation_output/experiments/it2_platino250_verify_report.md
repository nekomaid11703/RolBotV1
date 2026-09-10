# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=3000 | nominal=20 | maxRounds=30
Niveles: 250 | Modos: full | Armas: cortante, contundente, perforante, proyectil
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

## Invariantes (por nivel)
- Nivel 250: espejo fuera de 50±5%: ninguno ✅