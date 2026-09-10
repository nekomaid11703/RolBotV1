# Combat Simulation Report
Generated: 2026-08-06 21:42:12 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1958 (97.9%) |
| Timeouts (draws) | 42 (2.1%) |
| Avg rounds (all) | 5.6 |
| Avg rounds (KO only) | 5.3 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 232 |
| Avg rounds | 6.1 |
| P50 / P90 | 5 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 965/2000 |
| Winrate | 48.3% |
| Advantage over 50% | -1.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 175 | 260 | 67.3% |  |
| Asesino | 87 | 285 | 30.5% |  |
| Esquivo | 97 | 325 | 29.8% |  |
| Equilibrado | 106 | 290 | 36.6% |  |
| Extremista ATK | 174 | 280 | 62.1% |  |
| Extremista DEF | 197 | 289 | 68.2% | YES |
| Extremista ASPD | 151 | 269 | 56.1% |  |
| Extremista REF | 168 | 280 | 60.0% |  |
| Velocista | 42 | 280 | 15.0% |  |
| Berserker | 179 | 291 | 61.5% |  |
| Guardian | 162 | 322 | 50.3% |  |
| Estratega | 186 | 291 | 63.9% |  |
| Gladiador | 158 | 277 | 57.0% |  |
| Magus | 118 | 261 | 45.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 29.1 | - |
| Rests | 3.2 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.7 | - |
| Battles with item use | 25.2% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.1% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.17 (avg 47.63) |
| ASPD spread (stddev) | 31.27 (avg 53.22) |
| Equipment tier A | 139 (3.5%) |
| Equipment tier B | 1706 (42.6%) |
| Equipment tier C | 699 (17.5%) |
| Equipment tier D | 1109 (27.7%) |
| Equipment tier E | 1 (0.0%) |
| Equipment tier S | 346 (8.6%) |
| Level 100-199 | 946 |
| Level 200-299 | 1079 |
| Level 300-399 | 1014 |
| Level 400-500 | 961 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 888 |
| cortante | 936 |
| desarmado | 394 |
| perforante | 1782 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1255 | 48.2% |
| ligera | 21 | 42.9% |
| media | 131 | 44.3% |
| ninguna | 1 | 0.0% |
| total | 2592 | 51.2% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 0.0% |
| 1-2 | 79 | 46.8% |
| 3+ | 3920 | 50.1% |
Set bonus active: 50.1% (3920) vs inactive 46.3% (80)

### Amulet
With amulet: 51.2% (1640) vs without 49.2% (2360)

### Shield
With shield: 50.1% (2455) vs without 49.8% (1545)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 121 | 59.5% |
| B | 1548 | 56.5% |
| C | 630 | 47.1% |
| D | 1001 | 41.1% |
| S | 306 | 69.0% |
| desarmado | 394 | 34.3% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 763 | 48.4% |
| adamantita | 147 | 67.3% |
| bronce | 819 | 42.9% |
| desarmado | 394 | 34.3% |
| filo_estelar | 159 | 70.4% |
| hierro | 821 | 46.7% |
| mitril | 425 | 63.3% |
| titanio | 472 | 59.7% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 897 | 61.4% |
| mitico | 306 | 69.0% |
| ninguno | 394 | 34.3% |
| poco_comun | 2403 | 45.9% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 846 | 49.1% |
| adamantita | 173 | 57.8% |
| bronce | 933 | 51.8% |
| filo_estelar | 189 | 50.3% |
| hierro | 889 | 49.7% |
| mitril | 466 | 44.4% |
| ninguno | 1 | 0.0% |
| titanio | 503 | 51.3% |

### Nature by level bracket
- **100-199**: contundente: 186, cortante: 228, desarmado: 97, perforante: 435
- **200-299**: contundente: 237, cortante: 267, desarmado: 102, perforante: 473
- **300-399**: contundente: 248, cortante: 234, desarmado: 92, perforante: 440
- **400-500**: contundente: 217, cortante: 207, desarmado: 103, perforante: 434

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.6% | 1003 | 51.2% | 2997 | -4.6pp |
| d_fulgor | 46.3% | 992 | 51.2% | 3008 | -5.0pp |
| r_fulgor | 46.0% | 996 | 51.3% | 3004 | -5.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.2 | 1 | 126 | 17 | 23 | 35 |
| Asesino | 42.3 | 2 | 166 | 15 | 37 | 60 |
| Esquivo | 24.9 | 1 | 127 | 12 | 22 | 35 |
| Equilibrado | 33.5 | 1 | 145 | 16 | 33 | 47 |
| Extremista ATK | 58.0 | 1 | 161 | 33 | 61 | 82 |
| Extremista DEF | 24.4 | 1 | 145 | 12 | 20 | 31 |
| Extremista ASPD | 54.6 | 1 | 183 | 28 | 51 | 79 |
| Extremista REF | 30.8 | 1 | 145 | 16 | 27 | 40 |
| Velocista | 29.8 | 1 | 135 | 14 | 25 | 38 |
| Berserker | 59.8 | 1 | 168 | 29 | 63 | 83 |
| Guardian | 24.9 | 1 | 147 | 13 | 23 | 32 |
| Estratega | 35.4 | 1 | 147 | 17 | 30 | 48 |
| Gladiador | 54.6 | 1 | 184 | 25 | 54 | 79 |
| Magus | 46.8 | 1 | 146 | 22 | 44 | 67 |

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
| Tanque | 200 | 880 | 22.7% |
| Asesino | 113 | 706 | 16.0% |
| Esquivo | 484 | 937 | 51.7% |
| Equilibrado | 300 | 956 | 31.4% |
| Extremista ATK | 105 | 643 | 16.3% |
| Extremista DEF | 349 | 1050 | 33.2% |
| Extremista ASPD | 152 | 721 | 21.1% |
| Extremista REF | 776 | 954 | 81.3% |
| Velocista | 108 | 805 | 13.4% |
| Berserker | 149 | 698 | 21.3% |
| Guardian | 211 | 1490 | 14.2% |
| Estratega | 610 | 877 | 69.6% |
| Gladiador | 247 | 582 | 42.4% |
| Magus | 188 | 636 | 29.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 25 | 43 | 59 | 53 | 14 | 21 | 12 | 11 | 100 | 14 | 43 | 15 | 12 | 24 |
| 5 | 37 | 48 | 64 | 58 | 23 | 33 | 22 | 17 | 108 | 23 | 56 | 23 | 22 | 31 |
| 10 | 38 | 49 | 64 | 58 | 24 | 36 | 22 | 16 | 108 | 23 | 56 | 22 | 22 | 31 |
| 15 | 38 | 49 | 64 | 59 | 24 | 37 | 22 | 16 | 108 | 24 | 56 | 22 | 22 | 31 |
| 20 | 38 | 49 | 64 | 59 | 24 | 37 | 22 | 17 | 108 | 24 | 56 | 23 | 22 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 85.0% | 84.2% | 86.7% | 71.4% | 26.3% | 75.0% | 38.5% | 90.5% | 71.4% | 72.0% | 70.0% | 60.9% | 47.4% |
| Asesino | 15.0% | 50.0% | 43.3% | 45.0% | 14.3% | 19.2% | 15.8% | 28.0% | 87.0% | 18.2% | 6.3% | 6.7% | 6.3% | 54.5% |
| Esquivo | 15.8% | 56.7% | 50.0% | 25.0% | 12.0% | 22.7% | 21.7% | 12.9% | 61.5% | 16.7% | 41.2% | 21.9% | 6.7% | 42.9% |
| Equilibrado | 13.3% | 55.0% | 75.0% | 50.0% | 23.8% | 26.9% | 16.7% | 33.3% | 76.9% | 36.4% | 30.4% | 5.6% | 26.7% | 39.1% |
| Extremista ATK | 28.6% | 85.7% | 88.0% | 76.2% | 50.0% | 21.1% | 57.9% | 66.7% | 89.5% | 57.9% | 51.9% | 76.9% | 65.0% | 57.1% |
| Extremista DEF | 73.7% | 80.8% | 77.3% | 73.1% | 78.9% | 50.0% | 65.0% | 52.4% | 93.8% | 50.0% | 55.2% | 62.5% | 73.7% | 75.0% |
| Extremista ASPD | 25.0% | 84.2% | 78.3% | 83.3% | 42.1% | 35.0% | 50.0% | 50.0% | 100.0% | 43.5% | 46.7% | 33.3% | 47.8% | 53.3% |
| Extremista REF | 61.5% | 72.0% | 87.1% | 66.7% | 33.3% | 47.6% | 50.0% | 50.0% | 92.0% | 40.0% | 41.7% | 42.1% | 50.0% | 83.3% |
| Velocista | 9.5% | 13.0% | 38.5% | 23.1% | 10.5% | 6.3% | 0.0% | 8.0% | 50.0% | 20.0% | 15.8% | 0.0% | 20.0% | 18.2% |
| Berserker | 28.6% | 81.8% | 83.3% | 63.6% | 42.1% | 50.0% | 56.5% | 60.0% | 80.0% | 50.0% | 63.2% | 54.5% | 53.8% | 94.4% |
| Guardian | 28.0% | 93.8% | 58.8% | 69.6% | 48.1% | 44.8% | 53.3% | 58.3% | 84.2% | 36.8% | 50.0% | 19.0% | 32.1% | 50.0% |
| Estratega | 30.0% | 93.3% | 78.1% | 94.4% | 23.1% | 37.5% | 66.7% | 57.9% | 100.0% | 45.5% | 81.0% | 50.0% | 47.4% | 75.0% |
| Gladiador | 39.1% | 93.8% | 93.3% | 73.3% | 35.0% | 26.3% | 52.2% | 50.0% | 80.0% | 46.2% | 67.9% | 52.6% | 50.0% | 56.3% |
| Magus | 52.6% | 45.5% | 57.1% | 60.9% | 42.9% | 25.0% | 46.7% | 16.7% | 81.8% | 5.6% | 50.0% | 25.0% | 43.8% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 673 |
| 16-30 | 48.3% | 1021 |
| 31-50 | 46.7% | 737 |
| 51-70 | 53.0% | 415 |
| 71-100 | 54.9% | 1154 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.4% | 29 |
| 16-30 | 43.5% | 834 |
| 31-50 | 48.1% | 1488 |
| 51-70 | 54.3% | 611 |
| 71-100 | 55.7% | 1038 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.3% | 494 |
| 16-30 | 46.9% | 801 |
| 31-50 | 44.4% | 757 |
| 51-70 | 44.4% | 527 |
| 71-100 | 53.9% | 1421 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 903 |
| 16-30 | 49.7% | 966 |
| 31-50 | 44.4% | 729 |
| 51-70 | 45.2% | 489 |
| 71-100 | 55.0% | 913 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.2% | 1566 |
| 16-30 | 52.4% | 1106 |
| 31-50 | 48.6% | 644 |
| 51-70 | 36.5% | 301 |
| 71-100 | 22.5% | 383 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.1% | 3194 |
| 16-30 | 42.2% | 493 |
| 31-50 | 48.4% | 256 |
| 51-70 | 61.1% | 54 |
| 71-100 | 66.7% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.7% | 3193 |
| 16-30 | 46.4% | 476 |
| 31-50 | 46.2% | 275 |
| 51-70 | 57.7% | 52 |
| 71-100 | 75.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3208 |
| 16-30 | 44.3% | 481 |
| 31-50 | 46.4% | 248 |
| 51-70 | 59.3% | 59 |
| 71-100 | 50.0% | 4 |
