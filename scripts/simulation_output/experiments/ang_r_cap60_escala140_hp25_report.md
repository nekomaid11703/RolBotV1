# Combat Simulation Report
Generated: 2026-08-07 18:14:25 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1970 (98.5%) |
| Timeouts (draws) | 30 (1.5%) |
| Avg rounds (all) | 5.2 |
| Avg rounds (KO only) | 5.0 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 262 |
| Avg rounds | 5.7 |
| P50 / P90 | 5 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 987/2000 |
| Winrate | 49.4% |
| Advantage over 50% | -0.7% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 212 | 321 | 66.0% |  |
| Asesino | 82 | 298 | 27.5% |  |
| Esquivo | 67 | 274 | 24.5% |  |
| Equilibrado | 104 | 285 | 36.5% |  |
| Extremista ATK | 169 | 274 | 61.7% |  |
| Extremista DEF | 204 | 281 | 72.6% | YES |
| Extremista ASPD | 151 | 280 | 53.9% |  |
| Extremista REF | 177 | 296 | 59.8% |  |
| Velocista | 53 | 272 | 19.5% |  |
| Berserker | 151 | 267 | 56.6% |  |
| Guardian | 159 | 291 | 54.6% |  |
| Estratega | 163 | 275 | 59.3% |  |
| Gladiador | 178 | 300 | 59.3% |  |
| Magus | 130 | 286 | 45.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 25.5 | - |
| Rests | 2.8 | 2 |
| Advances | 3.8 | - |
| Retreats | 0.7 | - |
| Battles with item use | 25.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.9% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.81 (avg 47.55) |
| ASPD spread (stddev) | 31.09 (avg 53.97) |
| Equipment tier A | 142 (3.5%) |
| Equipment tier B | 1664 (41.6%) |
| Equipment tier C | 685 (17.1%) |
| Equipment tier D | 1136 (28.4%) |
| Equipment tier S | 373 (9.3%) |
| Level 100-199 | 941 |
| Level 200-299 | 1094 |
| Level 300-399 | 1003 |
| Level 400-500 | 962 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 925 |
| cortante | 864 |
| desarmado | 403 |
| perforante | 1808 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1314 | 49.2% |
| ligera | 21 | 23.8% |
| media | 141 | 46.1% |
| total | 2524 | 50.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 110 | 34.5% |
| 3+ | 3890 | 50.4% |
Set bonus active: 50.4% (3890) vs inactive 34.5% (110)

### Amulet
With amulet: 50.0% (1591) vs without 50.0% (2409)

### Shield
With shield: 50.1% (2395) vs without 49.8% (1605)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 126 | 60.3% |
| B | 1507 | 54.8% |
| C | 611 | 45.0% |
| D | 1012 | 43.5% |
| S | 341 | 70.1% |
| desarmado | 403 | 35.7% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 798 | 51.4% |
| adamantita | 158 | 67.7% |
| bronce | 833 | 42.0% |
| desarmado | 403 | 35.7% |
| filo_estelar | 183 | 72.1% |
| hierro | 796 | 45.2% |
| mitril | 425 | 58.8% |
| titanio | 404 | 61.1% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 829 | 60.0% |
| mitico | 341 | 70.1% |
| ninguno | 403 | 35.7% |
| poco_comun | 2427 | 46.1% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 848 | 51.2% |
| adamantita | 191 | 48.7% |
| bronce | 902 | 48.4% |
| filo_estelar | 165 | 55.2% |
| hierro | 907 | 51.0% |
| mitril | 483 | 47.4% |
| titanio | 504 | 50.2% |

### Nature by level bracket
- **100-199**: contundente: 224, cortante: 208, desarmado: 92, perforante: 417
- **200-299**: contundente: 246, cortante: 221, desarmado: 127, perforante: 500
- **300-399**: contundente: 231, cortante: 216, desarmado: 86, perforante: 470
- **400-500**: contundente: 224, cortante: 219, desarmado: 98, perforante: 421

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.3% | 965 | 51.2% | 3035 | -4.8pp |
| d_fulgor | 46.5% | 960 | 51.1% | 3040 | -4.7pp |
| r_fulgor | 47.2% | 967 | 50.9% | 3033 | -3.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 25.6 | 1 | 138 | 12 | 23 | 35 |
| Asesino | 44.4 | 1 | 143 | 17 | 40 | 67 |
| Esquivo | 27.4 | 1 | 141 | 14 | 23 | 32 |
| Equilibrado | 35.6 | 1 | 150 | 16 | 28 | 49 |
| Extremista ATK | 58.0 | 1 | 156 | 26 | 57 | 82 |
| Extremista DEF | 25.3 | 1 | 143 | 13 | 21 | 32 |
| Extremista ASPD | 47.5 | 1 | 170 | 17 | 42 | 69 |
| Extremista REF | 31.5 | 1 | 149 | 15 | 26 | 42 |
| Velocista | 27.3 | 1 | 120 | 13 | 24 | 35 |
| Berserker | 57.4 | 1 | 160 | 27 | 56 | 82 |
| Guardian | 23.3 | 1 | 148 | 12 | 19 | 30 |
| Estratega | 33.4 | 1 | 141 | 16 | 28 | 47 |
| Gladiador | 50.5 | 1 | 162 | 22 | 48 | 72 |
| Magus | 39.5 | 1 | 170 | 17 | 35 | 54 |

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
| Tanque | 176 | 1093 | 16.1% |
| Asesino | 67 | 600 | 11.2% |
| Esquivo | 365 | 664 | 55.0% |
| Equilibrado | 228 | 882 | 25.9% |
| Extremista ATK | 103 | 608 | 16.9% |
| Extremista DEF | 237 | 915 | 25.9% |
| Extremista ASPD | 152 | 608 | 25.0% |
| Extremista REF | 639 | 827 | 77.3% |
| Velocista | 74 | 662 | 11.2% |
| Berserker | 83 | 628 | 13.2% |
| Guardian | 161 | 1044 | 15.4% |
| Estratega | 516 | 731 | 70.6% |
| Gladiador | 289 | 620 | 46.6% |
| Magus | 205 | 638 | 32.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 46 | 57 | 56 | 14 | 18 | 13 | 13 | 99 | 15 | 45 | 15 | 10 | 24 |
| 5 | 38 | 50 | 63 | 63 | 23 | 28 | 21 | 19 | 104 | 24 | 57 | 23 | 19 | 31 |
| 10 | 39 | 50 | 62 | 63 | 23 | 31 | 21 | 18 | 104 | 24 | 58 | 23 | 19 | 31 |
| 15 | 40 | 50 | 62 | 63 | 23 | 33 | 20 | 19 | 104 | 24 | 59 | 23 | 19 | 31 |
| 20 | 39 | 50 | 62 | 63 | 23 | 33 | 20 | 19 | 104 | 24 | 59 | 23 | 19 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 88.5% | 90.9% | 76.9% | 59.4% | 46.2% | 75.0% | 50.0% | 95.5% | 57.9% | 62.5% | 52.9% | 48.1% | 84.2% |
| Asesino | 11.5% | 50.0% | 52.9% | 36.4% | 5.9% | 7.4% | 25.0% | 30.0% | 73.7% | 28.6% | 23.5% | 17.4% | 10.0% | 18.2% |
| Esquivo | 9.1% | 47.1% | 50.0% | 37.5% | 15.8% | 9.5% | 21.1% | 16.7% | 57.1% | 20.0% | 22.2% | 14.3% | 25.9% | 4.5% |
| Equilibrado | 23.1% | 63.6% | 62.5% | 50.0% | 24.0% | 15.8% | 25.0% | 19.0% | 63.6% | 14.3% | 35.7% | 52.9% | 26.7% | 43.5% |
| Extremista ATK | 40.6% | 94.1% | 84.2% | 76.0% | 50.0% | 15.4% | 58.3% | 61.1% | 100.0% | 60.0% | 65.4% | 52.6% | 45.5% | 62.5% |
| Extremista DEF | 53.8% | 92.6% | 90.5% | 84.2% | 84.6% | 50.0% | 78.6% | 66.7% | 100.0% | 68.2% | 57.9% | 57.9% | 63.6% | 70.0% |
| Extremista ASPD | 25.0% | 75.0% | 78.9% | 75.0% | 41.7% | 21.4% | 50.0% | 43.8% | 90.5% | 33.3% | 46.7% | 66.7% | 35.3% | 60.0% |
| Extremista REF | 50.0% | 70.0% | 83.3% | 81.0% | 38.9% | 33.3% | 56.3% | 50.0% | 80.0% | 58.8% | 59.3% | 50.0% | 58.3% | 67.9% |
| Velocista | 4.5% | 26.3% | 42.9% | 36.4% | 0.0% | 0.0% | 9.5% | 20.0% | 50.0% | 14.3% | 21.7% | 6.3% | 7.7% | 13.3% |
| Berserker | 42.1% | 71.4% | 80.0% | 85.7% | 40.0% | 31.8% | 66.7% | 41.2% | 85.7% | 50.0% | 47.8% | 31.8% | 73.7% | 66.7% |
| Guardian | 37.5% | 76.5% | 77.8% | 64.3% | 34.6% | 42.1% | 53.3% | 40.7% | 78.3% | 52.2% | 50.0% | 35.3% | 57.1% | 70.8% |
| Estratega | 47.1% | 82.6% | 85.7% | 47.1% | 47.4% | 42.1% | 33.3% | 50.0% | 93.8% | 68.2% | 64.7% | 50.0% | 58.8% | 56.3% |
| Gladiador | 51.9% | 90.0% | 74.1% | 73.3% | 54.5% | 36.4% | 64.7% | 41.7% | 92.3% | 26.3% | 42.9% | 41.2% | 50.0% | 94.1% |
| Magus | 15.8% | 81.8% | 95.5% | 56.5% | 37.5% | 30.0% | 40.0% | 32.1% | 86.7% | 33.3% | 29.2% | 43.8% | 5.9% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.7% | 632 |
| 16-30 | 48.7% | 1051 |
| 31-50 | 49.1% | 743 |
| 51-70 | 50.8% | 453 |
| 71-100 | 53.3% | 1121 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 30.8% | 26 |
| 16-30 | 41.0% | 847 |
| 31-50 | 49.0% | 1493 |
| 51-70 | 50.1% | 595 |
| 71-100 | 59.2% | 1039 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.4% | 467 |
| 16-30 | 49.4% | 785 |
| 31-50 | 42.9% | 748 |
| 51-70 | 43.6% | 557 |
| 71-100 | 54.1% | 1443 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 918 |
| 16-30 | 48.2% | 969 |
| 31-50 | 49.0% | 751 |
| 51-70 | 52.2% | 467 |
| 71-100 | 51.3% | 895 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.3% | 1613 |
| 16-30 | 52.8% | 1071 |
| 31-50 | 47.0% | 613 |
| 51-70 | 33.2% | 325 |
| 71-100 | 30.4% | 378 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 3236 |
| 16-30 | 46.9% | 448 |
| 31-50 | 49.2% | 252 |
| 51-70 | 44.6% | 56 |
| 71-100 | 87.5% | 8 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 3241 |
| 16-30 | 47.0% | 443 |
| 31-50 | 47.6% | 252 |
| 51-70 | 51.7% | 58 |
| 71-100 | 66.7% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 3233 |
| 16-30 | 48.3% | 435 |
| 31-50 | 49.0% | 261 |
| 51-70 | 50.0% | 64 |
| 71-100 | 57.1% | 7 |
