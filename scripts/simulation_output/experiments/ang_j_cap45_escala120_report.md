# Combat Simulation Report
Generated: 2026-08-07 18:09:31 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.0 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1968 (98.4%) |
| Timeouts (draws) | 32 (1.6%) |
| Avg rounds (all) | 5.4 |
| Avg rounds (KO only) | 5.1 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 237 |
| Avg rounds | 6.0 |
| P50 / P90 | 5 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 923/2000 |
| Winrate | 46.2% |
| Advantage over 50% | -3.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 187 | 273 | 68.5% |  |
| Asesino | 72 | 304 | 23.7% |  |
| Esquivo | 90 | 287 | 31.4% |  |
| Equilibrado | 102 | 283 | 36.0% |  |
| Extremista ATK | 174 | 321 | 54.2% |  |
| Extremista DEF | 216 | 296 | 73.0% | YES |
| Extremista ASPD | 169 | 305 | 55.4% |  |
| Extremista REF | 141 | 263 | 53.6% |  |
| Velocista | 54 | 261 | 20.7% |  |
| Berserker | 191 | 308 | 62.0% |  |
| Guardian | 135 | 262 | 51.5% |  |
| Estratega | 153 | 257 | 59.5% |  |
| Gladiador | 168 | 258 | 65.1% |  |
| Magus | 148 | 322 | 46.0% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 24.8 | - |
| Rests | 3.1 | 2 |
| Advances | 3.8 | - |
| Retreats | 0.7 | - |
| Battles with item use | 23.3% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.54 (avg 49.62) |
| ASPD spread (stddev) | 31.44 (avg 54.99) |
| Equipment tier A | 149 (3.7%) |
| Equipment tier B | 1701 (42.5%) |
| Equipment tier C | 705 (17.6%) |
| Equipment tier D | 1099 (27.5%) |
| Equipment tier S | 346 (8.6%) |
| Level 100-199 | 905 |
| Level 200-299 | 1108 |
| Level 300-399 | 996 |
| Level 400-500 | 991 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 932 |
| cortante | 897 |
| desarmado | 419 |
| perforante | 1752 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1293 | 49.3% |
| ligera | 18 | 16.7% |
| media | 129 | 48.8% |
| total | 2560 | 50.6% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 78 | 26.9% |
| 3+ | 3922 | 50.5% |
Set bonus active: 50.5% (3922) vs inactive 26.9% (78)

### Amulet
With amulet: 49.7% (1631) vs without 50.2% (2369)

### Shield
With shield: 49.9% (2419) vs without 50.2% (1581)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 132 | 64.4% |
| B | 1524 | 56.7% |
| C | 631 | 47.2% |
| D | 973 | 39.9% |
| S | 321 | 68.5% |
| desarmado | 419 | 34.6% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 819 | 50.1% |
| adamantita | 157 | 66.2% |
| bronce | 761 | 44.3% |
| desarmado | 419 | 34.6% |
| filo_estelar | 164 | 70.7% |
| hierro | 818 | 45.0% |
| mitril | 411 | 60.6% |
| titanio | 451 | 60.1% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 862 | 60.3% |
| mitico | 321 | 68.5% |
| ninguno | 419 | 34.6% |
| poco_comun | 2398 | 46.5% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 863 | 51.0% |
| adamantita | 185 | 50.3% |
| bronce | 923 | 49.8% |
| filo_estelar | 174 | 46.6% |
| hierro | 899 | 50.8% |
| mitril | 487 | 50.1% |
| titanio | 469 | 48.0% |

### Nature by level bracket
- **100-199**: contundente: 209, cortante: 212, desarmado: 99, perforante: 385
- **200-299**: contundente: 266, cortante: 234, desarmado: 138, perforante: 470
- **300-399**: contundente: 236, cortante: 211, desarmado: 93, perforante: 456
- **400-500**: contundente: 221, cortante: 240, desarmado: 89, perforante: 441

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 47.2% | 956 | 50.9% | 3044 | -3.7pp |
| d_fulgor | 47.5% | 958 | 50.8% | 3042 | -3.3pp |
| r_fulgor | 47.4% | 947 | 50.8% | 3053 | -3.4pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.0 | 1 | 137 | 12 | 21 | 36 |
| Asesino | 40.3 | 1 | 138 | 17 | 35 | 58 |
| Esquivo | 26.6 | 1 | 121 | 12 | 22 | 35 |
| Equilibrado | 32.5 | 1 | 135 | 13 | 29 | 42 |
| Extremista ATK | 54.0 | 1 | 183 | 18 | 53 | 82 |
| Extremista DEF | 24.2 | 1 | 137 | 11 | 21 | 33 |
| Extremista ASPD | 54.1 | 1 | 155 | 27 | 48 | 77 |
| Extremista REF | 33.8 | 1 | 135 | 21 | 31 | 44 |
| Velocista | 34.6 | 1 | 129 | 23 | 34 | 40 |
| Berserker | 60.5 | 1 | 177 | 27 | 63 | 89 |
| Guardian | 22.1 | 1 | 121 | 11 | 18 | 28 |
| Estratega | 37.6 | 1 | 139 | 17 | 35 | 50 |
| Gladiador | 55.0 | 1 | 166 | 34 | 51 | 76 |
| Magus | 44.9 | 1 | 152 | 18 | 38 | 64 |

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
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 92 | 879 | 10.5% |
| Asesino | 61 | 703 | 8.7% |
| Esquivo | 436 | 745 | 58.5% |
| Equilibrado | 253 | 986 | 25.7% |
| Extremista ATK | 107 | 868 | 12.3% |
| Extremista DEF | 266 | 965 | 27.6% |
| Extremista ASPD | 147 | 769 | 19.1% |
| Extremista REF | 593 | 826 | 71.8% |
| Velocista | 93 | 706 | 13.2% |
| Berserker | 108 | 668 | 16.2% |
| Guardian | 207 | 1276 | 16.2% |
| Estratega | 533 | 732 | 72.8% |
| Gladiador | 227 | 520 | 43.7% |
| Magus | 238 | 787 | 30.2% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 27 | 48 | 56 | 49 | 15 | 17 | 15 | 14 | 97 | 12 | 46 | 17 | 12 | 24 |
| 5 | 40 | 52 | 62 | 55 | 23 | 29 | 23 | 21 | 102 | 21 | 59 | 25 | 23 | 31 |
| 10 | 42 | 53 | 62 | 55 | 24 | 31 | 23 | 20 | 102 | 21 | 58 | 24 | 23 | 31 |
| 15 | 42 | 53 | 63 | 55 | 24 | 33 | 23 | 20 | 102 | 21 | 58 | 24 | 23 | 31 |
| 20 | 42 | 53 | 64 | 55 | 24 | 33 | 23 | 20 | 102 | 21 | 58 | 24 | 23 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 80.0% | 81.0% | 86.7% | 55.6% | 56.5% | 65.2% | 60.0% | 100.0% | 77.3% | 76.2% | 50.0% | 58.8% | 56.5% |
| Asesino | 20.0% | 50.0% | 48.0% | 41.2% | 12.5% | 8.0% | 11.1% | 12.5% | 61.5% | 3.8% | 10.5% | 23.8% | 18.5% | 20.0% |
| Esquivo | 19.0% | 52.0% | 50.0% | 45.5% | 16.7% | 13.0% | 15.8% | 20.0% | 50.0% | 27.3% | 38.1% | 7.7% | 17.6% | 39.1% |
| Equilibrado | 13.3% | 58.8% | 54.5% | 50.0% | 31.8% | 16.7% | 48.0% | 17.4% | 72.2% | 23.8% | 64.3% | 25.0% | 26.3% | 17.4% |
| Extremista ATK | 44.4% | 87.5% | 83.3% | 68.2% | 50.0% | 10.7% | 57.1% | 59.1% | 84.6% | 21.9% | 33.3% | 46.2% | 45.5% | 74.2% |
| Extremista DEF | 43.5% | 92.0% | 87.0% | 83.3% | 89.3% | 50.0% | 73.3% | 66.7% | 100.0% | 66.7% | 66.7% | 62.5% | 36.8% | 85.2% |
| Extremista ASPD | 34.8% | 88.9% | 84.2% | 52.0% | 42.9% | 26.7% | 50.0% | 54.5% | 83.3% | 51.9% | 47.4% | 40.0% | 65.4% | 60.0% |
| Extremista REF | 40.0% | 87.5% | 80.0% | 82.6% | 40.9% | 33.3% | 45.5% | 50.0% | 100.0% | 17.6% | 48.0% | 55.0% | 38.1% | 60.0% |
| Velocista | 0.0% | 38.5% | 50.0% | 27.8% | 15.4% | 0.0% | 16.7% | 0.0% | 50.0% | 8.7% | 31.3% | 5.9% | 11.8% | 26.3% |
| Berserker | 22.7% | 96.2% | 72.7% | 76.2% | 78.1% | 33.3% | 48.1% | 82.4% | 91.3% | 50.0% | 46.7% | 40.0% | 42.9% | 65.4% |
| Guardian | 23.8% | 89.5% | 61.9% | 35.7% | 66.7% | 33.3% | 52.6% | 52.0% | 68.8% | 53.3% | 50.0% | 47.6% | 25.0% | 57.1% |
| Estratega | 50.0% | 76.2% | 92.3% | 75.0% | 53.8% | 37.5% | 60.0% | 45.0% | 94.1% | 60.0% | 52.4% | 50.0% | 44.4% | 52.6% |
| Gladiador | 41.2% | 81.5% | 82.4% | 73.7% | 54.5% | 63.2% | 34.6% | 61.9% | 88.2% | 57.1% | 75.0% | 55.6% | 50.0% | 87.0% |
| Magus | 43.5% | 80.0% | 60.9% | 82.6% | 25.8% | 14.8% | 40.0% | 40.0% | 73.7% | 34.6% | 42.9% | 47.4% | 13.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.7% | 583 |
| 16-30 | 47.8% | 1027 |
| 31-50 | 49.8% | 713 |
| 51-70 | 51.2% | 430 |
| 71-100 | 53.1% | 1247 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 34.5% | 29 |
| 16-30 | 39.6% | 859 |
| 31-50 | 48.0% | 1509 |
| 51-70 | 51.2% | 629 |
| 71-100 | 61.9% | 974 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.0% | 474 |
| 16-30 | 43.6% | 779 |
| 31-50 | 46.7% | 679 |
| 51-70 | 45.7% | 564 |
| 71-100 | 53.9% | 1504 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 906 |
| 16-30 | 47.8% | 990 |
| 31-50 | 49.5% | 749 |
| 51-70 | 48.8% | 471 |
| 71-100 | 53.6% | 884 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.9% | 1537 |
| 16-30 | 53.0% | 1155 |
| 31-50 | 44.2% | 684 |
| 51-70 | 33.3% | 261 |
| 71-100 | 34.4% | 363 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 3222 |
| 16-30 | 45.8% | 441 |
| 31-50 | 50.8% | 256 |
| 51-70 | 44.9% | 78 |
| 71-100 | 66.7% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 3225 |
| 16-30 | 48.4% | 432 |
| 31-50 | 48.7% | 275 |
| 51-70 | 47.7% | 65 |
| 71-100 | 66.7% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 3231 |
| 16-30 | 47.7% | 442 |
| 31-50 | 50.2% | 251 |
| 51-70 | 49.3% | 71 |
| 71-100 | 40.0% | 5 |
