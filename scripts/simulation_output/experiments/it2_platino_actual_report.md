# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=3000 | nominal=20 | maxRounds=30
Niveles: 250 | Modos: actual | Armas: cortante
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 250 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 250 | actual | cortante | none vs none | 50.0 | 2.0 | 89 | 106 | 51 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | cortante | none vs total | 50.0 | 4.0 | 25.4 | 106 | 1.6 | 5.4 | 18 | 0 | 0 | 0 |
| 250 | actual | cortante | total vs none | 50.0 | 4.0 | 33.4 | 77.5 | 19.1 | 0 | 0 | 173 | 244 | 2.5 |
| 250 | actual | cortante | total vs total | 50.0 | 5.0 | 23.3 | 93.5 | 1.2 | 5.3 | 17.8 | 224 | 244 | 3.5 |

## Invariantes (por nivel)
- Nivel 250: espejo fuera de 50±5%: ninguno ✅