# Combat Simulation Report
Generated: 2026-08-07 18:10:41 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.2 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.1 | FAIL |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1977 (98.9%) |
| Timeouts (draws) | 23 (1.1%) |
| Avg rounds (all) | 4.5 |
| Avg rounds (KO only) | 4.4 |
| Rounds P50 / P90 / Max | 4 / 8 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 236 |
| Avg rounds | 5.2 |
| P50 / P90 | 4 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 871/2000 |
| Winrate | 43.5% |
| Advantage over 50% | -6.5% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 198 | 284 | 69.7% | YES |
| Asesino | 78 | 260 | 30.0% |  |
| Esquivo | 61 | 271 | 22.5% |  |
| Equilibrado | 102 | 299 | 34.1% |  |
| Extremista ATK | 166 | 283 | 58.7% |  |
| Extremista DEF | 214 | 326 | 65.6% |  |
| Extremista ASPD | 152 | 286 | 53.1% |  |
| Extremista REF | 157 | 262 | 59.9% |  |
| Velocista | 47 | 318 | 14.8% |  |
| Berserker | 165 | 265 | 62.3% |  |
| Guardian | 154 | 285 | 54.0% |  |
| Estratega | 173 | 263 | 65.8% |  |
| Gladiador | 194 | 301 | 64.5% |  |
| Magus | 137 | 297 | 46.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 19.6 | - |
| Rests | 2.0 | 2 |
| Advances | 3.7 | - |
| Retreats | 0.6 | - |
| Battles with item use | 22.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.58 (avg 47.75) |
| ASPD spread (stddev) | 31.44 (avg 53.38) |
| Equipment tier A | 128 (3.2%) |
| Equipment tier B | 1630 (40.8%) |
| Equipment tier C | 680 (17.0%) |
| Equipment tier D | 1150 (28.7%) |
| Equipment tier S | 412 (10.3%) |
| Level 100-199 | 951 |
| Level 200-299 | 1124 |
| Level 300-399 | 958 |
| Level 400-500 | 967 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 878 |
| cortante | 933 |
| desarmado | 418 |
| perforante | 1771 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1275 | 49.0% |
| ligera | 20 | 60.0% |
| media | 131 | 54.2% |
| total | 2574 | 50.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 96 | 40.6% |
| 3+ | 3904 | 50.2% |
Set bonus active: 50.2% (3904) vs inactive 40.6% (96)

### Amulet
With amulet: 48.9% (1615) vs without 50.6% (2385)

### Shield
With shield: 49.1% (2345) vs without 51.2% (1655)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 118 | 59.3% |
| B | 1472 | 55.0% |
| C | 610 | 46.7% |
| D | 1010 | 44.0% |
| S | 372 | 67.7% |
| desarmado | 418 | 33.0% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 787 | 48.5% |
| adamantita | 174 | 67.8% |
| bronce | 775 | 43.4% |
| desarmado | 418 | 33.0% |
| filo_estelar | 198 | 67.7% |
| hierro | 787 | 48.0% |
| mitril | 435 | 59.8% |
| titanio | 426 | 59.2% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 861 | 59.5% |
| mitico | 372 | 67.7% |
| ninguno | 418 | 33.0% |
| poco_comun | 2349 | 46.7% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 912 | 48.5% |
| adamantita | 193 | 43.5% |
| bronce | 902 | 52.1% |
| filo_estelar | 176 | 51.7% |
| hierro | 890 | 51.8% |
| mitril | 481 | 47.6% |
| titanio | 446 | 49.6% |

### Nature by level bracket
- **100-199**: contundente: 194, cortante: 237, desarmado: 107, perforante: 413
- **200-299**: contundente: 264, cortante: 264, desarmado: 118, perforante: 478
- **300-399**: contundente: 218, cortante: 218, desarmado: 101, perforante: 421
- **400-500**: contundente: 202, cortante: 214, desarmado: 92, perforante: 459

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.3% | 966 | 51.1% | 3034 | -4.8pp |
| d_fulgor | 46.1% | 965 | 51.2% | 3035 | -5.1pp |
| r_fulgor | 46.6% | 982 | 51.0% | 3018 | -4.4pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 25.1 | 1 | 148 | 11 | 22 | 33 |
| Asesino | 43.3 | 1 | 140 | 14 | 37 | 65 |
| Esquivo | 28.5 | 1 | 141 | 13 | 24 | 35 |
| Equilibrado | 30.5 | 0 | 131 | 12 | 22 | 43 |
| Extremista ATK | 54.9 | 1 | 177 | 18 | 59 | 82 |
| Extremista DEF | 22.7 | 1 | 125 | 10 | 20 | 29 |
| Extremista ASPD | 48.5 | 1 | 158 | 19 | 41 | 72 |
| Extremista REF | 33.2 | 1 | 147 | 17 | 29 | 44 |
| Velocista | 30.5 | 1 | 117 | 17 | 25 | 36 |
| Berserker | 57.8 | 1 | 181 | 21 | 59 | 85 |
| Guardian | 23.4 | 1 | 127 | 11 | 22 | 33 |
| Estratega | 40.8 | 1 | 157 | 23 | 34 | 52 |
| Gladiador | 50.3 | 1 | 171 | 25 | 47 | 73 |
| Magus | 51.3 | 1 | 171 | 27 | 49 | 69 |

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
| Velocista | 2 | 2 | 100.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 101 | 660 | 15.3% |
| Asesino | 49 | 471 | 10.4% |
| Esquivo | 243 | 541 | 44.9% |
| Equilibrado | 264 | 738 | 35.8% |
| Extremista ATK | 48 | 542 | 8.9% |
| Extremista DEF | 244 | 964 | 25.3% |
| Extremista ASPD | 97 | 491 | 19.8% |
| Extremista REF | 441 | 540 | 81.7% |
| Velocista | 71 | 645 | 11.0% |
| Berserker | 105 | 456 | 23.0% |
| Guardian | 174 | 895 | 19.4% |
| Estratega | 351 | 482 | 72.8% |
| Gladiador | 199 | 463 | 43.0% |
| Magus | 144 | 492 | 29.3% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 19 | 42 | 60 | 49 | 14 | 17 | 16 | 12 | 105 | 14 | 44 | 16 | 12 | 26 |
| 5 | 35 | 46 | 65 | 54 | 22 | 27 | 23 | 17 | 111 | 22 | 56 | 23 | 21 | 31 |
| 10 | 36 | 46 | 65 | 53 | 22 | 29 | 23 | 16 | 111 | 21 | 56 | 22 | 21 | 31 |
| 15 | 37 | 46 | 65 | 54 | 22 | 30 | 23 | 16 | 111 | 21 | 57 | 22 | 21 | 31 |
| 20 | 37 | 46 | 65 | 54 | 22 | 31 | 23 | 16 | 111 | 21 | 57 | 22 | 21 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 86.7% | 85.7% | 86.7% | 52.6% | 54.5% | 76.2% | 50.0% | 100.0% | 61.9% | 64.7% | 58.3% | 67.9% | 73.9% |
| Asesino | 13.3% | 50.0% | 53.3% | 50.0% | 13.6% | 20.0% | 38.5% | 12.5% | 81.8% | 0.0% | 33.3% | 7.1% | 0.0% | 30.0% |
| Esquivo | 7.1% | 46.7% | 50.0% | 37.5% | 13.6% | 10.5% | 8.3% | 12.5% | 73.7% | 15.0% | 25.0% | 12.5% | 7.1% | 25.0% |
| Equilibrado | 13.3% | 50.0% | 62.5% | 50.0% | 23.8% | 19.2% | 36.0% | 37.5% | 80.8% | 12.0% | 37.9% | 6.7% | 5.9% | 29.2% |
| Extremista ATK | 47.4% | 86.4% | 86.4% | 76.2% | 50.0% | 18.2% | 50.0% | 56.3% | 77.4% | 60.0% | 47.1% | 56.3% | 32.1% | 71.4% |
| Extremista DEF | 45.5% | 80.0% | 89.5% | 80.8% | 81.8% | 50.0% | 66.7% | 58.8% | 76.5% | 57.7% | 58.6% | 46.4% | 68.4% | 73.7% |
| Extremista ASPD | 23.8% | 61.5% | 91.7% | 64.0% | 50.0% | 33.3% | 50.0% | 35.0% | 95.7% | 52.4% | 31.8% | 50.0% | 44.4% | 55.6% |
| Extremista REF | 50.0% | 87.5% | 87.5% | 62.5% | 43.8% | 41.2% | 65.0% | 50.0% | 90.0% | 43.8% | 41.7% | 42.9% | 55.6% | 73.9% |
| Velocista | 0.0% | 18.2% | 26.3% | 19.2% | 22.6% | 23.5% | 4.3% | 10.0% | 50.0% | 4.3% | 8.3% | 9.5% | 9.5% | 11.1% |
| Berserker | 38.1% | 100.0% | 85.0% | 88.0% | 40.0% | 42.3% | 47.6% | 56.3% | 95.7% | 50.0% | 62.5% | 43.8% | 35.3% | 68.2% |
| Guardian | 35.3% | 66.7% | 75.0% | 62.1% | 52.9% | 41.4% | 68.2% | 58.3% | 91.7% | 37.5% | 50.0% | 25.0% | 33.3% | 38.1% |
| Estratega | 41.7% | 92.9% | 87.5% | 93.3% | 43.8% | 53.6% | 50.0% | 57.1% | 90.5% | 56.3% | 75.0% | 50.0% | 55.0% | 73.9% |
| Gladiador | 32.1% | 100.0% | 92.9% | 94.1% | 67.9% | 31.6% | 55.6% | 44.4% | 90.5% | 64.7% | 66.7% | 45.0% | 45.5% | 70.4% |
| Magus | 26.1% | 70.0% | 75.0% | 70.8% | 28.6% | 26.3% | 44.4% | 26.1% | 88.9% | 31.8% | 61.9% | 26.1% | 29.6% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.4% | 709 |
| 16-30 | 47.0% | 1000 |
| 31-50 | 46.8% | 701 |
| 51-70 | 51.4% | 387 |
| 71-100 | 55.9% | 1203 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.6% | 29 |
| 16-30 | 41.3% | 869 |
| 31-50 | 47.5% | 1412 |
| 51-70 | 52.6% | 647 |
| 71-100 | 58.7% | 1043 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.7% | 519 |
| 16-30 | 49.6% | 791 |
| 31-50 | 43.8% | 723 |
| 51-70 | 46.6% | 543 |
| 71-100 | 52.5% | 1424 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 940 |
| 16-30 | 48.8% | 957 |
| 31-50 | 46.7% | 737 |
| 51-70 | 47.0% | 451 |
| 71-100 | 53.1% | 915 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 59.5% | 1562 |
| 16-30 | 53.1% | 1104 |
| 31-50 | 46.0% | 654 |
| 51-70 | 29.9% | 274 |
| 71-100 | 24.6% | 406 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 3230 |
| 16-30 | 44.5% | 472 |
| 31-50 | 47.4% | 234 |
| 51-70 | 54.1% | 61 |
| 71-100 | 33.3% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 3225 |
| 16-30 | 46.8% | 477 |
| 31-50 | 47.6% | 231 |
| 51-70 | 47.7% | 65 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.7% | 3227 |
| 16-30 | 46.7% | 471 |
| 31-50 | 43.6% | 234 |
| 51-70 | 59.1% | 66 |
| 71-100 | 0.0% | 2 |
