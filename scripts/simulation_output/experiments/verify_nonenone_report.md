# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=3000 | nominal=20 | maxRounds=30
Niveles: 300 | Modos: actual | Armas: cortante
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 300 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Ligera |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 300 | actual | cortante | none vs none | 50.0 | 2.0 | 112 | 131 | 56 | 0 | 0 | 0 | 0 | 0 |
| 300 | actual | cortante | none vs ligera | 0.0 | 2.0 | 23 | 150 | 0 | 7 | 26 | 0 | 0 | 0 |
| 300 | actual | cortante | ligera vs none | 100.0 | 2.0 | 112 | 34.5 | 56 | 0 | 0 | 84 | 268 | 0.5 |
| 300 | actual | cortante | ligera vs ligera | 50.0 | 6.0 | 34.5 | 121 | 6.8 | 5.4 | 20.1 | 246 | 268 | 3.5 |

## Invariantes (por nivel)
- Nivel 300: espejo fuera de 50±5%: ninguno ✅