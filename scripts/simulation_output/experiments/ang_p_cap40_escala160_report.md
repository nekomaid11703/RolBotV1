# Combat Simulation Report
Generated: 2026-08-07 18:12:19 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1954 (97.7%) |
| Timeouts (draws) | 46 (2.3%) |
| Avg rounds (all) | 5.6 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 223 |
| Avg rounds | 5.8 |
| P50 / P90 | 5 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 949/2000 |
| Winrate | 47.4% |
| Advantage over 50% | -2.6% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 193 | 296 | 65.2% |  |
| Asesino | 93 | 298 | 31.2% |  |
| Esquivo | 85 | 298 | 28.5% |  |
| Equilibrado | 106 | 302 | 35.1% |  |
| Extremista ATK | 158 | 279 | 56.6% |  |
| Extremista DEF | 209 | 297 | 70.4% | YES |
| Extremista ASPD | 137 | 251 | 54.6% |  |
| Extremista REF | 173 | 306 | 56.5% |  |
| Velocista | 57 | 289 | 19.7% |  |
| Berserker | 180 | 301 | 59.8% |  |
| Guardian | 140 | 267 | 52.4% |  |
| Estratega | 164 | 256 | 64.1% |  |
| Gladiador | 179 | 266 | 67.3% |  |
| Magus | 126 | 294 | 42.9% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 27.8 | - |
| Rests | 3.1 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.7 | - |
| Battles with item use | 24.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.4% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.52 (avg 47.47) |
| ASPD spread (stddev) | 31.22 (avg 53.16) |
| Equipment tier A | 152 (3.8%) |
| Equipment tier B | 1643 (41.1%) |
| Equipment tier C | 668 (16.7%) |
| Equipment tier D | 1151 (28.8%) |
| Equipment tier S | 386 (9.7%) |
| Level 100-199 | 970 |
| Level 200-299 | 1067 |
| Level 300-399 | 1012 |
| Level 400-500 | 951 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 940 |
| cortante | 871 |
| desarmado | 385 |
| perforante | 1804 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1266 | 49.1% |
| ligera | 23 | 34.8% |
| media | 126 | 46.8% |
| total | 2585 | 50.8% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 100 | 47.0% |
| 3+ | 3900 | 50.1% |
Set bonus active: 50.1% (3900) vs inactive 47.0% (100)

### Amulet
With amulet: 50.9% (1583) vs without 49.4% (2417)

### Shield
With shield: 50.6% (2414) vs without 49.1% (1586)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 136 | 60.3% |
| B | 1489 | 56.7% |
| C | 602 | 46.0% |
| D | 1046 | 41.4% |
| S | 342 | 68.4% |
| desarmado | 385 | 33.5% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 784 | 48.2% |
| adamantita | 175 | 66.9% |
| bronce | 815 | 42.0% |
| desarmado | 385 | 33.5% |
| filo_estelar | 167 | 70.1% |
| hierro | 797 | 48.8% |
| mitril | 460 | 61.1% |
| titanio | 417 | 59.2% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 877 | 60.2% |
| mitico | 342 | 68.4% |
| ninguno | 385 | 33.5% |
| poco_comun | 2396 | 46.3% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 915 | 48.4% |
| adamantita | 187 | 52.4% |
| bronce | 857 | 50.8% |
| filo_estelar | 188 | 50.0% |
| hierro | 891 | 48.3% |
| mitril | 474 | 50.4% |
| titanio | 488 | 53.5% |

### Nature by level bracket
- **100-199**: contundente: 226, cortante: 209, desarmado: 79, perforante: 456
- **200-299**: contundente: 246, cortante: 245, desarmado: 120, perforante: 456
- **300-399**: contundente: 244, cortante: 206, desarmado: 91, perforante: 471
- **400-500**: contundente: 224, cortante: 211, desarmado: 95, perforante: 421

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 48.0% | 973 | 50.6% | 3027 | -2.6pp |
| d_fulgor | 48.5% | 980 | 50.5% | 3020 | -2.0pp |
| r_fulgor | 48.4% | 979 | 50.5% | 3021 | -2.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 28.2 | 1 | 147 | 14 | 24 | 39 |
| Asesino | 49.0 | 1 | 170 | 13 | 43 | 80 |
| Esquivo | 27.5 | 1 | 138 | 16 | 25 | 35 |
| Equilibrado | 32.7 | 0 | 143 | 14 | 28 | 47 |
| Extremista ATK | 62.7 | 1 | 167 | 33 | 67 | 87 |
| Extremista DEF | 23.7 | 1 | 141 | 12 | 20 | 31 |
| Extremista ASPD | 53.9 | 1 | 173 | 30 | 49 | 72 |
| Extremista REF | 31.5 | 0 | 146 | 18 | 27 | 41 |
| Velocista | 30.7 | 1 | 144 | 18 | 28 | 38 |
| Berserker | 51.5 | 1 | 164 | 16 | 48 | 83 |
| Guardian | 23.0 | 0 | 134 | 9 | 19 | 29 |
| Estratega | 36.6 | 1 | 148 | 21 | 31 | 48 |
| Gladiador | 54.7 | 1 | 178 | 24 | 56 | 80 |
| Magus | 42.8 | 1 | 157 | 18 | 37 | 65 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 16 | 16 | 100.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 2 | 2 | 100.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 24 | 24 | 100.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 146 | 940 | 15.5% |
| Asesino | 65 | 679 | 9.6% |
| Esquivo | 424 | 858 | 49.4% |
| Equilibrado | 322 | 1050 | 30.7% |
| Extremista ATK | 119 | 686 | 17.3% |
| Extremista DEF | 260 | 1089 | 23.9% |
| Extremista ASPD | 122 | 648 | 18.8% |
| Extremista REF | 713 | 937 | 76.1% |
| Velocista | 125 | 808 | 15.5% |
| Berserker | 145 | 806 | 18.0% |
| Guardian | 150 | 1240 | 12.1% |
| Estratega | 508 | 722 | 70.4% |
| Gladiador | 250 | 494 | 50.6% |
| Magus | 314 | 850 | 36.9% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 23 | 45 | 60 | 51 | 15 | 16 | 12 | 11 | 100 | 13 | 41 | 14 | 12 | 26 |
| 5 | 36 | 49 | 64 | 58 | 24 | 28 | 21 | 18 | 106 | 23 | 53 | 23 | 23 | 31 |
| 10 | 37 | 49 | 64 | 58 | 25 | 32 | 21 | 17 | 106 | 23 | 54 | 22 | 23 | 31 |
| 15 | 37 | 49 | 64 | 58 | 25 | 33 | 21 | 17 | 106 | 23 | 55 | 23 | 23 | 30 |
| 20 | 37 | 49 | 64 | 58 | 25 | 33 | 21 | 17 | 106 | 23 | 55 | 22 | 23 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 85.7% | 84.0% | 82.1% | 55.0% | 30.0% | 70.8% | 33.3% | 100.0% | 69.0% | 76.0% | 38.9% | 37.5% | 84.6% |
| Asesino | 14.3% | 50.0% | 43.5% | 50.0% | 21.1% | 0.0% | 26.1% | 23.1% | 70.8% | 14.8% | 17.6% | 35.3% | 10.0% | 38.9% |
| Esquivo | 16.0% | 56.5% | 50.0% | 48.1% | 15.8% | 4.8% | 29.4% | 29.0% | 57.9% | 16.7% | 43.8% | 10.5% | 14.3% | 13.6% |
| Equilibrado | 17.9% | 50.0% | 51.9% | 50.0% | 16.7% | 20.7% | 26.3% | 38.1% | 66.7% | 30.4% | 37.5% | 21.7% | 29.4% | 33.3% |
| Extremista ATK | 45.0% | 78.9% | 84.2% | 83.3% | 50.0% | 40.0% | 50.0% | 52.6% | 85.7% | 37.0% | 43.8% | 55.6% | 25.0% | 72.2% |
| Extremista DEF | 70.0% | 100.0% | 95.2% | 79.3% | 60.0% | 50.0% | 68.4% | 63.6% | 89.5% | 70.0% | 66.7% | 62.5% | 47.8% | 61.5% |
| Extremista ASPD | 29.2% | 73.9% | 70.6% | 73.7% | 50.0% | 31.6% | 50.0% | 52.6% | 92.3% | 35.7% | 59.1% | 43.8% | 33.3% | 70.0% |
| Extremista REF | 66.7% | 76.9% | 71.0% | 61.9% | 47.4% | 36.4% | 47.4% | 50.0% | 94.7% | 50.0% | 27.8% | 41.7% | 42.3% | 82.6% |
| Velocista | 0.0% | 29.2% | 42.1% | 33.3% | 14.3% | 10.5% | 7.7% | 5.3% | 50.0% | 10.5% | 12.0% | 16.7% | 11.1% | 15.0% |
| Berserker | 31.0% | 85.2% | 83.3% | 69.6% | 63.0% | 30.0% | 64.3% | 50.0% | 89.5% | 50.0% | 50.0% | 23.1% | 70.6% | 65.4% |
| Guardian | 24.0% | 82.4% | 56.3% | 62.5% | 56.3% | 33.3% | 40.9% | 72.2% | 88.0% | 50.0% | 50.0% | 38.9% | 23.5% | 61.9% |
| Estratega | 61.1% | 64.7% | 89.5% | 78.3% | 44.4% | 37.5% | 56.3% | 58.3% | 83.3% | 76.9% | 61.1% | 50.0% | 63.6% | 60.0% |
| Gladiador | 62.5% | 90.0% | 85.7% | 70.6% | 75.0% | 52.2% | 66.7% | 57.7% | 88.9% | 29.4% | 76.5% | 36.4% | 50.0% | 84.0% |
| Magus | 15.4% | 61.1% | 86.4% | 66.7% | 27.8% | 38.5% | 30.0% | 17.4% | 85.0% | 34.6% | 38.1% | 40.0% | 16.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.0% | 682 |
| 16-30 | 48.4% | 1056 |
| 31-50 | 48.0% | 691 |
| 51-70 | 50.8% | 394 |
| 71-100 | 55.2% | 1177 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.9% | 31 |
| 16-30 | 41.7% | 871 |
| 31-50 | 48.3% | 1510 |
| 51-70 | 52.8% | 572 |
| 71-100 | 58.4% | 1016 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.2% | 502 |
| 16-30 | 46.1% | 814 |
| 31-50 | 44.7% | 740 |
| 51-70 | 44.3% | 526 |
| 71-100 | 54.2% | 1418 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 922 |
| 16-30 | 49.3% | 927 |
| 31-50 | 48.0% | 766 |
| 51-70 | 47.3% | 507 |
| 71-100 | 53.5% | 878 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.3% | 1548 |
| 16-30 | 51.7% | 1140 |
| 31-50 | 45.5% | 635 |
| 51-70 | 34.7% | 288 |
| 71-100 | 30.6% | 389 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 3218 |
| 16-30 | 48.4% | 461 |
| 31-50 | 51.0% | 255 |
| 51-70 | 58.1% | 62 |
| 71-100 | 75.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3219 |
| 16-30 | 47.0% | 460 |
| 31-50 | 50.2% | 247 |
| 51-70 | 57.4% | 68 |
| 71-100 | 66.7% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 3209 |
| 16-30 | 44.3% | 469 |
| 31-50 | 54.6% | 249 |
| 51-70 | 57.4% | 68 |
| 71-100 | 40.0% | 5 |
