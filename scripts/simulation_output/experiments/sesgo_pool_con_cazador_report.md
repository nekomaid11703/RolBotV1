# Combat Simulation Report
Generated: 2026-08-07 18:26:33 | 3000 simulations | Max 20 rounds

Config: numSims=3000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.0 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 3000 |
| KO victories | 2936 (97.9%) |
| Timeouts (draws) | 64 (2.1%) |
| Avg rounds (all) | 5.4 |
| Avg rounds (KO only) | 5.1 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 343 |
| Avg rounds | 6.0 |
| P50 / P90 | 4 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1411/3000 |
| Winrate | 47.0% |
| Advantage over 50% | -3.0% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 283 | 412 | 68.7% |  |
| Asesino | 108 | 414 | 26.1% |  |
| Esquivo | 130 | 422 | 30.8% |  |
| Equilibrado | 143 | 401 | 35.7% |  |
| Extremista ATK | 228 | 398 | 57.3% |  |
| Extremista DEF | 260 | 378 | 68.8% | YES |
| Extremista ASPD | 218 | 418 | 52.2% |  |
| Extremista REF | 217 | 383 | 56.7% |  |
| Velocista | 73 | 390 | 18.7% |  |
| Berserker | 216 | 387 | 55.8% |  |
| Guardian | 212 | 403 | 52.6% |  |
| Estratega | 246 | 394 | 62.4% |  |
| Gladiador | 229 | 362 | 63.3% |  |
| Magus | 195 | 426 | 45.8% |  |
| Cazador Tanques | 242 | 412 | 58.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 24.9 | - |
| Rests | 3.0 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.7 | - |
| Battles with item use | 23.6% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.9% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.51 (avg 49.54) |
| ASPD spread (stddev) | 31.09 (avg 53.63) |
| Equipment tier A | 216 (3.6%) |
| Equipment tier B | 2480 (41.3%) |
| Equipment tier C | 1002 (16.7%) |
| Equipment tier D | 1722 (28.7%) |
| Equipment tier S | 580 (9.7%) |
| Level 100-199 | 1444 |
| Level 200-299 | 1689 |
| Level 300-399 | 1436 |
| Level 400-500 | 1431 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1300 |
| cortante | 1376 |
| desarmado | 607 |
| perforante | 2717 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1945 | 48.0% |
| ligera | 23 | 43.5% |
| media | 198 | 50.5% |
| total | 3834 | 51.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 149 | 45.6% |
| 3+ | 5851 | 50.1% |
Set bonus active: 50.1% (5851) vs inactive 45.6% (149)

### Amulet
With amulet: 49.3% (2375) vs without 50.4% (3625)

### Shield
With shield: 50.5% (3597) vs without 49.3% (2403)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 193 | 66.3% |
| B | 2234 | 56.5% |
| C | 898 | 46.2% |
| D | 1542 | 41.1% |
| S | 526 | 69.0% |
| desarmado | 607 | 32.5% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 1194 | 48.7% |
| adamantita | 278 | 67.6% |
| bronce | 1189 | 40.5% |
| desarmado | 607 | 32.5% |
| filo_estelar | 248 | 70.6% |
| hierro | 1166 | 47.4% |
| mitril | 664 | 63.0% |
| titanio | 654 | 61.9% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 1318 | 62.4% |
| mitico | 526 | 69.0% |
| ninguno | 607 | 32.5% |
| poco_comun | 3549 | 45.6% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 1303 | 50.4% |
| adamantita | 287 | 53.0% |
| bronce | 1362 | 47.9% |
| filo_estelar | 264 | 54.2% |
| hierro | 1286 | 49.0% |
| mitril | 736 | 49.0% |
| titanio | 762 | 53.1% |

### Nature by level bracket
- **100-199**: contundente: 322, cortante: 316, desarmado: 148, perforante: 658
- **200-299**: contundente: 355, cortante: 429, desarmado: 182, perforante: 723
- **300-399**: contundente: 299, cortante: 298, desarmado: 158, perforante: 681
- **400-500**: contundente: 324, cortante: 333, desarmado: 119, perforante: 655

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 49.3% | 1435 | 50.2% | 4565 | -0.9pp |
| d_fulgor | 49.4% | 1442 | 50.2% | 4558 | -0.8pp |
| r_fulgor | 49.3% | 1435 | 50.2% | 4565 | -0.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.2 | 1 | 128 | 14 | 25 | 35 |
| Asesino | 44.0 | 1 | 177 | 15 | 36 | 68 |
| Esquivo | 26.1 | 1 | 135 | 13 | 23 | 34 |
| Equilibrado | 35.9 | 1 | 138 | 17 | 31 | 50 |
| Extremista ATK | 60.3 | 1 | 169 | 27 | 62 | 86 |
| Extremista DEF | 24.1 | 1 | 144 | 11 | 21 | 32 |
| Extremista ASPD | 50.4 | 1 | 162 | 24 | 46 | 74 |
| Extremista REF | 31.3 | 1 | 166 | 16 | 27 | 41 |
| Velocista | 31.7 | 1 | 119 | 18 | 28 | 38 |
| Berserker | 59.0 | 1 | 184 | 26 | 60 | 84 |
| Guardian | 25.3 | 0 | 129 | 13 | 21 | 32 |
| Estratega | 36.3 | 1 | 136 | 18 | 32 | 49 |
| Gladiador | 50.9 | 1 | 176 | 21 | 48 | 76 |
| Magus | 45.1 | 1 | 162 | 14 | 38 | 67 |
| Cazador Tanques | 52.1 | 1 | 165 | 21 | 50 | 74 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 1 | 1 | 100.0% |
| Cazador Tanques | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 210 | 1454 | 14.4% |
| Asesino | 90 | 964 | 9.3% |
| Esquivo | 751 | 1249 | 60.1% |
| Equilibrado | 283 | 1218 | 23.2% |
| Extremista ATK | 152 | 966 | 15.7% |
| Extremista DEF | 433 | 1442 | 30.0% |
| Extremista ASPD | 144 | 1068 | 13.5% |
| Extremista REF | 838 | 1105 | 75.8% |
| Velocista | 196 | 1143 | 17.1% |
| Berserker | 105 | 801 | 13.1% |
| Guardian | 169 | 1590 | 10.6% |
| Estratega | 744 | 1045 | 71.2% |
| Gladiador | 283 | 657 | 43.1% |
| Magus | 319 | 1087 | 29.3% |
| Cazador Tanques | 522 | 955 | 54.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus | Cazador Tanques |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 22 | 49 | 58 | 50 | 15 | 17 | 15 | 12 | 102 | 12 | 48 | 15 | 10 | 22 | 9 |
| 5 | 37 | 54 | 62 | 55 | 25 | 29 | 23 | 19 | 108 | 21 | 60 | 23 | 21 | 30 | 17 |
| 10 | 38 | 53 | 62 | 54 | 25 | 32 | 23 | 18 | 109 | 22 | 60 | 22 | 21 | 29 | 18 |
| 15 | 39 | 54 | 62 | 55 | 25 | 33 | 23 | 18 | 109 | 22 | 60 | 22 | 21 | 29 | 18 |
| 20 | 39 | 54 | 62 | 55 | 25 | 33 | 23 | 18 | 109 | 22 | 60 | 22 | 21 | 29 | 18 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus | vs Cazador Tanques |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 91.4% | 88.5% | 90.5% | 75.0% | 36.0% | 88.6% | 51.4% | 82.8% | 73.7% | 70.0% | 36.7% | 59.1% | 64.7% | 69.0% |
| Asesino | 8.6% | 50.0% | 43.3% | 25.0% | 11.1% | 10.3% | 23.8% | 25.9% | 69.2% | 25.0% | 11.5% | 17.2% | 15.0% | 25.7% | 25.0% |
| Esquivo | 11.5% | 56.7% | 50.0% | 38.7% | 38.1% | 11.4% | 26.1% | 24.0% | 65.4% | 10.7% | 18.5% | 23.1% | 11.5% | 46.2% | 23.3% |
| Equilibrado | 9.5% | 75.0% | 61.3% | 50.0% | 19.4% | 36.4% | 28.6% | 20.0% | 60.0% | 28.6% | 39.3% | 22.7% | 10.0% | 44.0% | 27.6% |
| Extremista ATK | 25.0% | 88.9% | 61.9% | 80.6% | 50.0% | 34.6% | 50.0% | 64.0% | 78.1% | 48.0% | 40.7% | 55.2% | 53.6% | 54.2% | 75.0% |
| Extremista DEF | 64.0% | 89.7% | 88.6% | 63.6% | 65.4% | 50.0% | 66.7% | 40.0% | 96.9% | 70.8% | 76.9% | 45.0% | 52.2% | 64.3% | 60.0% |
| Extremista ASPD | 11.4% | 76.2% | 73.9% | 71.4% | 50.0% | 33.3% | 50.0% | 40.7% | 85.3% | 50.0% | 50.0% | 38.7% | 50.0% | 69.2% | 38.5% |
| Extremista REF | 48.6% | 74.1% | 76.0% | 80.0% | 36.0% | 60.0% | 59.3% | 50.0% | 84.6% | 31.8% | 72.7% | 45.2% | 35.5% | 63.0% | 35.3% |
| Velocista | 17.2% | 30.8% | 34.6% | 40.0% | 21.9% | 3.1% | 14.7% | 15.4% | 50.0% | 10.7% | 24.0% | 5.3% | 13.0% | 14.8% | 3.7% |
| Berserker | 26.3% | 75.0% | 89.3% | 71.4% | 52.0% | 29.2% | 50.0% | 68.2% | 89.3% | 50.0% | 42.3% | 45.5% | 40.9% | 42.1% | 50.0% |
| Guardian | 30.0% | 88.5% | 81.5% | 60.7% | 59.3% | 23.1% | 50.0% | 27.3% | 76.0% | 57.7% | 50.0% | 36.7% | 40.0% | 64.5% | 42.3% |
| Estratega | 63.3% | 82.8% | 76.9% | 77.3% | 44.8% | 55.0% | 61.3% | 54.8% | 94.7% | 54.5% | 63.3% | 50.0% | 38.1% | 70.7% | 44.0% |
| Gladiador | 40.9% | 85.0% | 88.5% | 90.0% | 46.4% | 47.8% | 50.0% | 64.5% | 87.0% | 59.1% | 60.0% | 61.9% | 50.0% | 68.0% | 40.0% |
| Magus | 35.3% | 74.3% | 53.8% | 56.0% | 45.8% | 35.7% | 30.8% | 37.0% | 85.2% | 57.9% | 35.5% | 29.3% | 32.0% | 50.0% | 36.7% |
| Cazador Tanques | 31.0% | 75.0% | 76.7% | 72.4% | 25.0% | 40.0% | 61.5% | 64.7% | 96.3% | 50.0% | 57.7% | 56.0% | 60.0% | 63.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.4% | 941 |
| 16-30 | 48.0% | 1454 |
| 31-50 | 48.4% | 1080 |
| 51-70 | 49.9% | 631 |
| 71-100 | 53.7% | 1894 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.2% | 51 |
| 16-30 | 41.0% | 1450 |
| 31-50 | 49.5% | 2241 |
| 51-70 | 51.7% | 867 |
| 71-100 | 59.4% | 1391 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.9% | 712 |
| 16-30 | 49.5% | 1219 |
| 31-50 | 44.5% | 1139 |
| 51-70 | 46.3% | 795 |
| 71-100 | 53.6% | 2135 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 1268 |
| 16-30 | 46.9% | 1455 |
| 31-50 | 48.2% | 1156 |
| 51-70 | 50.1% | 733 |
| 71-100 | 54.5% | 1388 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.6% | 2509 |
| 16-30 | 50.6% | 1645 |
| 31-50 | 47.5% | 918 |
| 51-70 | 32.8% | 399 |
| 71-100 | 29.1% | 529 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 4849 |
| 16-30 | 47.6% | 691 |
| 31-50 | 49.6% | 341 |
| 51-70 | 58.7% | 109 |
| 71-100 | 70.0% | 10 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 4864 |
| 16-30 | 47.0% | 651 |
| 31-50 | 50.8% | 358 |
| 51-70 | 52.7% | 112 |
| 71-100 | 60.0% | 15 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 4841 |
| 16-30 | 46.6% | 684 |
| 31-50 | 51.6% | 353 |
| 51-70 | 55.0% | 111 |
| 71-100 | 72.7% | 11 |
