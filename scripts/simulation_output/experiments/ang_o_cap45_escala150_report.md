# Combat Simulation Report
Generated: 2026-08-07 18:12:17 | 2000 simulations | Max 20 rounds

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
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 231 |
| Avg rounds | 6.1 |
| P50 / P90 | 5 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 950/2000 |
| Winrate | 47.5% |
| Advantage over 50% | -2.5% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 207 | 301 | 68.8% |  |
| Asesino | 63 | 279 | 22.6% |  |
| Esquivo | 82 | 279 | 29.4% |  |
| Equilibrado | 104 | 252 | 41.3% |  |
| Extremista ATK | 146 | 261 | 55.9% |  |
| Extremista DEF | 193 | 270 | 71.5% | YES |
| Extremista ASPD | 150 | 288 | 52.1% |  |
| Extremista REF | 172 | 303 | 56.8% |  |
| Velocista | 57 | 299 | 19.1% |  |
| Berserker | 167 | 275 | 60.7% |  |
| Guardian | 161 | 305 | 52.8% |  |
| Estratega | 177 | 290 | 61.0% |  |
| Gladiador | 189 | 312 | 60.6% |  |
| Magus | 132 | 286 | 46.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 29.4 | - |
| Rests | 3.1 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.7 | - |
| Battles with item use | 26.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.15 (avg 47.48) |
| ASPD spread (stddev) | 31.03 (avg 54.19) |
| Equipment tier A | 119 (3.0%) |
| Equipment tier B | 1739 (43.5%) |
| Equipment tier C | 720 (18.0%) |
| Equipment tier D | 1073 (26.8%) |
| Equipment tier S | 349 (8.7%) |
| Level 100-199 | 916 |
| Level 200-299 | 1114 |
| Level 300-399 | 1031 |
| Level 400-500 | 939 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 881 |
| cortante | 913 |
| desarmado | 378 |
| perforante | 1828 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1291 | 48.3% |
| ligera | 19 | 42.1% |
| media | 117 | 47.0% |
| total | 2573 | 51.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 91 | 37.4% |
| 3+ | 3909 | 50.3% |
Set bonus active: 50.3% (3909) vs inactive 37.4% (91)

### Amulet
With amulet: 52.7% (1590) vs without 48.2% (2410)

### Shield
With shield: 49.9% (2385) vs without 50.1% (1615)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 104 | 67.3% |
| B | 1584 | 56.2% |
| C | 648 | 46.3% |
| D | 975 | 40.1% |
| S | 311 | 71.7% |
| desarmado | 378 | 33.3% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 796 | 48.1% |
| adamantita | 139 | 63.3% |
| bronce | 767 | 41.9% |
| desarmado | 378 | 33.3% |
| filo_estelar | 172 | 78.5% |
| hierro | 835 | 44.9% |
| mitril | 455 | 67.3% |
| titanio | 458 | 58.1% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 913 | 62.7% |
| mitico | 311 | 71.7% |
| ninguno | 378 | 33.3% |
| poco_comun | 2398 | 45.0% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 899 | 49.5% |
| adamantita | 182 | 54.9% |
| bronce | 836 | 47.6% |
| filo_estelar | 205 | 59.5% |
| hierro | 893 | 49.7% |
| mitril | 495 | 51.1% |
| titanio | 490 | 48.6% |

### Nature by level bracket
- **100-199**: contundente: 201, cortante: 195, desarmado: 76, perforante: 444
- **200-299**: contundente: 249, cortante: 262, desarmado: 112, perforante: 491
- **300-399**: contundente: 234, cortante: 228, desarmado: 106, perforante: 463
- **400-500**: contundente: 197, cortante: 228, desarmado: 84, perforante: 430

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.9% | 954 | 51.0% | 3046 | -4.1pp |
| d_fulgor | 46.2% | 956 | 51.2% | 3044 | -4.9pp |
| r_fulgor | 47.2% | 969 | 50.9% | 3031 | -3.7pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 29.5 | 1 | 147 | 16 | 26 | 37 |
| Asesino | 48.2 | 1 | 125 | 16 | 41 | 75 |
| Esquivo | 26.3 | 1 | 136 | 9 | 22 | 34 |
| Equilibrado | 37.9 | 1 | 149 | 21 | 33 | 48 |
| Extremista ATK | 54.7 | 2 | 173 | 19 | 55 | 80 |
| Extremista DEF | 24.1 | 0 | 146 | 11 | 20 | 31 |
| Extremista ASPD | 46.5 | 1 | 178 | 23 | 37 | 69 |
| Extremista REF | 34.6 | 1 | 133 | 19 | 31 | 49 |
| Velocista | 26.9 | 1 | 113 | 16 | 24 | 36 |
| Berserker | 59.5 | 1 | 185 | 32 | 60 | 84 |
| Guardian | 22.6 | 1 | 121 | 10 | 20 | 31 |
| Estratega | 31.3 | 1 | 143 | 14 | 26 | 43 |
| Gladiador | 46.3 | 1 | 172 | 18 | 41 | 68 |
| Magus | 47.6 | 1 | 141 | 24 | 43 | 70 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 1 | 1 | 100.0% |
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
| Tanque | 169 | 1086 | 15.6% |
| Asesino | 86 | 733 | 11.7% |
| Esquivo | 505 | 844 | 59.8% |
| Equilibrado | 204 | 839 | 24.3% |
| Extremista ATK | 79 | 646 | 12.2% |
| Extremista DEF | 313 | 1028 | 30.4% |
| Extremista ASPD | 126 | 765 | 16.5% |
| Extremista REF | 640 | 834 | 76.7% |
| Velocista | 174 | 953 | 18.3% |
| Berserker | 75 | 644 | 11.6% |
| Guardian | 175 | 1318 | 13.3% |
| Estratega | 660 | 901 | 73.3% |
| Gladiador | 315 | 777 | 40.5% |
| Magus | 182 | 673 | 27.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 25 | 47 | 56 | 64 | 14 | 16 | 14 | 12 | 99 | 13 | 45 | 14 | 11 | 20 |
| 5 | 40 | 52 | 63 | 70 | 23 | 28 | 23 | 18 | 107 | 22 | 56 | 22 | 22 | 27 |
| 10 | 41 | 52 | 63 | 70 | 24 | 30 | 23 | 18 | 107 | 23 | 56 | 21 | 22 | 27 |
| 15 | 41 | 52 | 63 | 70 | 24 | 32 | 23 | 18 | 107 | 23 | 57 | 21 | 22 | 27 |
| 20 | 41 | 52 | 63 | 70 | 24 | 32 | 23 | 18 | 107 | 23 | 57 | 22 | 22 | 27 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 100.0% | 80.8% | 80.0% | 66.7% | 42.9% | 92.3% | 40.9% | 96.4% | 54.5% | 73.7% | 65.5% | 52.2% | 76.5% |
| Asesino | 0.0% | 50.0% | 52.6% | 29.4% | 20.8% | 8.7% | 28.6% | 17.4% | 66.7% | 15.8% | 8.0% | 4.8% | 15.0% | 23.1% |
| Esquivo | 19.2% | 47.4% | 50.0% | 28.6% | 33.3% | 6.3% | 13.3% | 37.9% | 84.0% | 5.6% | 23.8% | 9.5% | 10.0% | 26.3% |
| Equilibrado | 20.0% | 70.6% | 71.4% | 50.0% | 22.2% | 30.4% | 42.9% | 35.7% | 77.8% | 36.4% | 33.3% | 15.4% | 35.0% | 23.1% |
| Extremista ATK | 33.3% | 79.2% | 66.7% | 77.8% | 50.0% | 20.0% | 65.2% | 55.0% | 70.6% | 46.2% | 55.6% | 46.2% | 52.4% | 68.0% |
| Extremista DEF | 57.1% | 91.3% | 93.8% | 69.6% | 80.0% | 50.0% | 60.7% | 58.8% | 78.9% | 88.2% | 75.0% | 68.8% | 66.7% | 64.3% |
| Extremista ASPD | 7.7% | 71.4% | 86.7% | 57.1% | 34.8% | 39.3% | 50.0% | 61.9% | 84.2% | 33.3% | 47.4% | 63.2% | 36.4% | 58.6% |
| Extremista REF | 59.1% | 82.6% | 62.1% | 64.3% | 45.0% | 41.2% | 38.1% | 50.0% | 82.6% | 47.4% | 57.1% | 52.9% | 40.0% | 66.7% |
| Velocista | 3.6% | 33.3% | 16.0% | 22.2% | 29.4% | 21.1% | 15.8% | 17.4% | 50.0% | 14.3% | 20.0% | 4.2% | 9.5% | 20.0% |
| Berserker | 45.5% | 84.2% | 94.4% | 63.6% | 53.8% | 11.8% | 66.7% | 52.6% | 85.7% | 50.0% | 55.6% | 37.5% | 64.3% | 78.6% |
| Guardian | 26.3% | 92.0% | 76.2% | 66.7% | 44.4% | 25.0% | 52.6% | 42.9% | 80.0% | 44.4% | 50.0% | 40.0% | 39.1% | 57.7% |
| Estratega | 34.5% | 95.2% | 90.5% | 84.6% | 53.8% | 31.3% | 36.8% | 47.1% | 95.8% | 62.5% | 60.0% | 50.0% | 47.8% | 64.0% |
| Gladiador | 47.8% | 85.0% | 90.0% | 65.0% | 47.6% | 33.3% | 63.6% | 60.0% | 90.5% | 35.7% | 60.9% | 52.2% | 50.0% | 66.7% |
| Magus | 23.5% | 76.9% | 73.7% | 76.9% | 32.0% | 35.7% | 41.4% | 33.3% | 80.0% | 21.4% | 42.3% | 36.0% | 33.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.9% | 653 |
| 16-30 | 48.9% | 1040 |
| 31-50 | 51.3% | 758 |
| 51-70 | 44.4% | 390 |
| 71-100 | 54.3% | 1159 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.1% | 36 |
| 16-30 | 40.7% | 875 |
| 31-50 | 47.1% | 1484 |
| 51-70 | 57.2% | 582 |
| 71-100 | 58.6% | 1023 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.5% | 452 |
| 16-30 | 49.0% | 808 |
| 31-50 | 49.7% | 731 |
| 51-70 | 41.3% | 555 |
| 71-100 | 52.3% | 1454 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.4% | 865 |
| 16-30 | 48.6% | 1006 |
| 31-50 | 48.2% | 737 |
| 51-70 | 48.6% | 465 |
| 71-100 | 54.3% | 927 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.1% | 1579 |
| 16-30 | 54.1% | 1101 |
| 31-50 | 51.4% | 632 |
| 51-70 | 34.8% | 279 |
| 71-100 | 23.5% | 409 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3223 |
| 16-30 | 45.4% | 438 |
| 31-50 | 46.8% | 280 |
| 51-70 | 43.6% | 55 |
| 71-100 | 75.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3240 |
| 16-30 | 46.1% | 456 |
| 31-50 | 45.4% | 249 |
| 51-70 | 47.2% | 53 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.7% | 3222 |
| 16-30 | 48.0% | 473 |
| 31-50 | 46.5% | 241 |
| 51-70 | 42.4% | 59 |
| 71-100 | 40.0% | 5 |
