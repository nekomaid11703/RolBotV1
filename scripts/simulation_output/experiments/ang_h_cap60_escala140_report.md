# Combat Simulation Report
Generated: 2026-08-07 18:08:01 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1962 (98.1%) |
| Timeouts (draws) | 38 (1.9%) |
| Avg rounds (all) | 5.6 |
| Avg rounds (KO only) | 5.3 |
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 234 |
| Avg rounds | 6.1 |
| P50 / P90 | 5 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 941/2000 |
| Winrate | 47.0% |
| Advantage over 50% | -3.0% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 191 | 298 | 64.1% |  |
| Asesino | 83 | 285 | 29.1% |  |
| Esquivo | 103 | 298 | 34.6% |  |
| Equilibrado | 116 | 306 | 37.9% |  |
| Extremista ATK | 159 | 289 | 55.0% |  |
| Extremista DEF | 168 | 263 | 63.9% |  |
| Extremista ASPD | 161 | 280 | 57.5% |  |
| Extremista REF | 169 | 278 | 60.8% |  |
| Velocista | 38 | 264 | 14.4% |  |
| Berserker | 180 | 308 | 58.4% |  |
| Guardian | 155 | 293 | 52.9% |  |
| Estratega | 180 | 293 | 61.4% |  |
| Gladiador | 177 | 273 | 64.8% | YES |
| Magus | 119 | 272 | 43.8% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 27.5 | - |
| Rests | 3.2 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.7 | - |
| Battles with item use | 25.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.4% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.31 (avg 47.81) |
| ASPD spread (stddev) | 31.11 (avg 53.38) |
| Equipment tier A | 157 (3.9%) |
| Equipment tier B | 1637 (40.9%) |
| Equipment tier C | 696 (17.4%) |
| Equipment tier D | 1138 (28.4%) |
| Equipment tier S | 372 (9.3%) |
| Level 100-199 | 951 |
| Level 200-299 | 1139 |
| Level 300-399 | 971 |
| Level 400-500 | 939 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 898 |
| cortante | 870 |
| desarmado | 384 |
| perforante | 1848 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1286 | 50.4% |
| ligera | 17 | 41.2% |
| media | 119 | 47.9% |
| total | 2578 | 49.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 101 | 56.4% |
| 3+ | 3899 | 49.8% |
Set bonus active: 49.8% (3899) vs inactive 56.4% (101)

### Amulet
With amulet: 51.3% (1634) vs without 49.0% (2366)

### Shield
With shield: 49.1% (2363) vs without 51.2% (1637)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 144 | 67.4% |
| B | 1476 | 54.5% |
| C | 623 | 44.9% |
| D | 1036 | 41.0% |
| S | 337 | 72.1% |
| desarmado | 384 | 38.8% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 806 | 46.7% |
| adamantita | 164 | 72.0% |
| bronce | 795 | 40.0% |
| desarmado | 384 | 38.8% |
| filo_estelar | 173 | 72.3% |
| hierro | 756 | 45.5% |
| mitril | 470 | 62.8% |
| titanio | 452 | 60.6% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 922 | 61.7% |
| mitico | 337 | 72.1% |
| ninguno | 384 | 38.8% |
| poco_comun | 2357 | 44.0% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 885 | 48.6% |
| adamantita | 201 | 46.3% |
| bronce | 877 | 49.4% |
| filo_estelar | 181 | 47.5% |
| hierro | 890 | 52.7% |
| mitril | 494 | 48.2% |
| titanio | 472 | 53.0% |

### Nature by level bracket
- **100-199**: contundente: 220, cortante: 199, desarmado: 99, perforante: 433
- **200-299**: contundente: 253, cortante: 249, desarmado: 106, perforante: 531
- **300-399**: contundente: 228, cortante: 206, desarmado: 76, perforante: 461
- **400-500**: contundente: 197, cortante: 216, desarmado: 103, perforante: 423

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 48.2% | 933 | 50.5% | 3067 | -2.3pp |
| d_fulgor | 47.7% | 944 | 50.7% | 3056 | -3.0pp |
| r_fulgor | 49.3% | 948 | 50.2% | 3052 | -0.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 26.5 | 1 | 146 | 13 | 23 | 35 |
| Asesino | 44.3 | 1 | 139 | 16 | 35 | 67 |
| Esquivo | 24.6 | 1 | 115 | 14 | 21 | 33 |
| Equilibrado | 33.9 | 1 | 152 | 14 | 30 | 44 |
| Extremista ATK | 56.1 | 1 | 175 | 23 | 50 | 85 |
| Extremista DEF | 24.1 | 1 | 146 | 11 | 20 | 32 |
| Extremista ASPD | 49.7 | 1 | 153 | 19 | 43 | 71 |
| Extremista REF | 34.5 | 1 | 142 | 19 | 32 | 46 |
| Velocista | 37.4 | 4 | 118 | 20 | 35 | 51 |
| Berserker | 59.6 | 1 | 177 | 29 | 56 | 84 |
| Guardian | 25.0 | 1 | 128 | 11 | 23 | 35 |
| Estratega | 32.5 | 0 | 146 | 15 | 29 | 42 |
| Gladiador | 45.9 | 1 | 175 | 15 | 44 | 68 |
| Magus | 45.0 | 1 | 154 | 23 | 41 | 64 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 3 | 3 | 100.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 127 | 1008 | 12.6% |
| Asesino | 57 | 720 | 7.9% |
| Esquivo | 513 | 893 | 57.4% |
| Equilibrado | 178 | 927 | 19.2% |
| Extremista ATK | 108 | 708 | 15.3% |
| Extremista DEF | 328 | 1058 | 31.0% |
| Extremista ASPD | 157 | 697 | 22.5% |
| Extremista REF | 600 | 769 | 78.0% |
| Velocista | 151 | 769 | 19.6% |
| Berserker | 111 | 750 | 14.8% |
| Guardian | 214 | 1398 | 15.3% |
| Estratega | 656 | 895 | 73.3% |
| Gladiador | 305 | 598 | 51.0% |
| Magus | 273 | 740 | 36.9% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 26 | 47 | 53 | 50 | 14 | 16 | 14 | 12 | 113 | 13 | 49 | 14 | 10 | 23 |
| 5 | 41 | 53 | 57 | 58 | 23 | 30 | 22 | 19 | 120 | 22 | 61 | 24 | 20 | 29 |
| 10 | 42 | 53 | 57 | 58 | 23 | 33 | 22 | 18 | 120 | 22 | 61 | 23 | 20 | 28 |
| 15 | 42 | 53 | 58 | 57 | 24 | 33 | 22 | 18 | 120 | 22 | 61 | 23 | 20 | 28 |
| 20 | 43 | 53 | 58 | 58 | 24 | 34 | 22 | 18 | 120 | 23 | 62 | 23 | 20 | 28 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 81.0% | 88.9% | 77.8% | 75.0% | 45.0% | 57.9% | 50.0% | 100.0% | 75.0% | 65.4% | 57.9% | 33.3% | 59.1% |
| Asesino | 19.0% | 50.0% | 52.6% | 62.5% | 7.4% | 15.8% | 22.2% | 10.5% | 68.4% | 23.8% | 26.1% | 16.0% | 20.0% | 36.4% |
| Esquivo | 11.1% | 47.4% | 50.0% | 38.7% | 27.3% | 22.2% | 5.3% | 31.6% | 77.8% | 25.0% | 34.8% | 25.0% | 11.8% | 54.2% |
| Equilibrado | 22.2% | 37.5% | 61.3% | 50.0% | 39.3% | 41.7% | 31.8% | 4.8% | 80.0% | 28.6% | 28.0% | 28.6% | 28.6% | 50.0% |
| Extremista ATK | 25.0% | 92.6% | 72.7% | 60.7% | 50.0% | 38.5% | 39.1% | 56.0% | 92.9% | 28.6% | 35.3% | 46.2% | 44.4% | 68.2% |
| Extremista DEF | 50.0% | 84.2% | 77.8% | 58.3% | 61.5% | 50.0% | 42.1% | 60.0% | 96.0% | 52.2% | 72.2% | 61.9% | 26.7% | 82.6% |
| Extremista ASPD | 42.1% | 77.8% | 94.7% | 68.2% | 60.9% | 57.9% | 50.0% | 35.7% | 79.2% | 44.8% | 55.6% | 40.0% | 37.5% | 52.6% |
| Extremista REF | 50.0% | 89.5% | 68.4% | 95.2% | 44.0% | 40.0% | 64.3% | 50.0% | 85.7% | 57.1% | 68.4% | 48.0% | 52.6% | 37.5% |
| Velocista | 0.0% | 31.6% | 22.2% | 20.0% | 7.1% | 4.0% | 20.8% | 14.3% | 50.0% | 7.1% | 25.0% | 5.3% | 0.0% | 10.5% |
| Berserker | 25.0% | 76.2% | 75.0% | 71.4% | 71.4% | 47.8% | 55.2% | 42.9% | 92.9% | 50.0% | 50.0% | 53.3% | 50.0% | 55.0% |
| Guardian | 34.6% | 73.9% | 65.2% | 72.0% | 64.7% | 27.8% | 44.4% | 31.6% | 75.0% | 50.0% | 50.0% | 22.7% | 55.6% | 76.5% |
| Estratega | 42.1% | 84.0% | 75.0% | 71.4% | 53.8% | 38.1% | 60.0% | 52.0% | 94.7% | 46.7% | 77.3% | 50.0% | 41.2% | 78.6% |
| Gladiador | 66.7% | 80.0% | 88.2% | 71.4% | 55.6% | 73.3% | 62.5% | 47.4% | 100.0% | 50.0% | 44.4% | 58.8% | 50.0% | 77.8% |
| Magus | 40.9% | 63.6% | 45.8% | 50.0% | 31.8% | 17.4% | 47.4% | 62.5% | 89.5% | 45.0% | 23.5% | 21.4% | 22.2% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.5% | 662 |
| 16-30 | 48.8% | 1036 |
| 31-50 | 49.9% | 720 |
| 51-70 | 50.5% | 412 |
| 71-100 | 54.5% | 1170 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 38.7% | 31 |
| 16-30 | 41.7% | 842 |
| 31-50 | 49.1% | 1551 |
| 51-70 | 53.8% | 591 |
| 71-100 | 56.4% | 985 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.1% | 477 |
| 16-30 | 47.3% | 802 |
| 31-50 | 46.3% | 778 |
| 51-70 | 49.5% | 529 |
| 71-100 | 52.0% | 1414 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 917 |
| 16-30 | 45.8% | 973 |
| 31-50 | 49.2% | 748 |
| 51-70 | 52.5% | 457 |
| 71-100 | 53.8% | 905 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.3% | 1599 |
| 16-30 | 51.0% | 1128 |
| 31-50 | 46.0% | 618 |
| 51-70 | 37.7% | 297 |
| 71-100 | 26.8% | 358 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 3253 |
| 16-30 | 44.5% | 431 |
| 31-50 | 54.8% | 250 |
| 51-70 | 60.7% | 61 |
| 71-100 | 60.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3264 |
| 16-30 | 46.4% | 431 |
| 31-50 | 50.2% | 233 |
| 51-70 | 60.6% | 66 |
| 71-100 | 66.7% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 3252 |
| 16-30 | 47.1% | 433 |
| 31-50 | 52.7% | 245 |
| 51-70 | 57.4% | 68 |
| 71-100 | 100.0% | 2 |
