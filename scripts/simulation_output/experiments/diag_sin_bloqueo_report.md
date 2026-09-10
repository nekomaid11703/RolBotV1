# Combat Simulation Report
Generated: 2026-08-07 16:07:29 | 2000 simulations | Max 20 rounds

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
| KO victories | 1957 (97.9%) |
| Timeouts (draws) | 43 (2.1%) |
| Avg rounds (all) | 5.4 |
| Avg rounds (KO only) | 5.0 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 262 |
| Avg rounds | 5.8 |
| P50 / P90 | 4 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 997/2000 |
| Winrate | 49.9% |
| Advantage over 50% | -0.2% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 197 | 299 | 65.9% |  |
| Asesino | 91 | 294 | 31.0% |  |
| Esquivo | 69 | 285 | 24.2% |  |
| Equilibrado | 111 | 269 | 41.3% |  |
| Extremista ATK | 174 | 292 | 59.6% |  |
| Extremista DEF | 209 | 292 | 71.6% | YES |
| Extremista ASPD | 155 | 294 | 52.7% |  |
| Extremista REF | 140 | 272 | 51.5% |  |
| Velocista | 61 | 286 | 21.3% |  |
| Berserker | 159 | 292 | 54.5% |  |
| Guardian | 168 | 275 | 61.1% |  |
| Estratega | 155 | 263 | 58.9% |  |
| Gladiador | 191 | 297 | 64.3% |  |
| Magus | 120 | 290 | 41.4% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 24.6 | - |
| Rests | 2.9 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.6 | - |
| Battles with item use | 23.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.61 (avg 47.75) |
| ASPD spread (stddev) | 31.41 (avg 53.37) |
| Equipment tier A | 130 (3.3%) |
| Equipment tier B | 1665 (41.6%) |
| Equipment tier C | 673 (16.8%) |
| Equipment tier D | 1164 (29.1%) |
| Equipment tier S | 368 (9.2%) |
| Level 100-199 | 989 |
| Level 200-299 | 1125 |
| Level 300-399 | 979 |
| Level 400-500 | 907 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 886 |
| cortante | 932 |
| desarmado | 414 |
| perforante | 1768 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1312 | 47.9% |
| ligera | 23 | 47.8% |
| media | 125 | 45.6% |
| ninguna | 1 | 0.0% |
| total | 2539 | 51.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 0.0% |
| 1-2 | 87 | 50.6% |
| 3+ | 3912 | 50.0% |
Set bonus active: 50.0% (3912) vs inactive 50.0% (88)

### Amulet
With amulet: 49.2% (1544) vs without 50.5% (2456)

### Shield
With shield: 50.4% (2351) vs without 49.4% (1649)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 122 | 69.7% |
| B | 1469 | 53.2% |
| C | 618 | 48.7% |
| D | 1039 | 45.1% |
| S | 338 | 69.5% |
| desarmado | 414 | 30.9% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 812 | 50.5% |
| adamantita | 172 | 67.4% |
| bronce | 799 | 42.9% |
| desarmado | 414 | 30.9% |
| filo_estelar | 166 | 71.7% |
| hierro | 773 | 47.1% |
| mitril | 417 | 60.9% |
| titanio | 447 | 59.5% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 864 | 60.2% |
| mitico | 338 | 69.5% |
| ninguno | 414 | 30.9% |
| poco_comun | 2384 | 46.9% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 853 | 50.2% |
| adamantita | 177 | 52.0% |
| bronce | 924 | 47.7% |
| filo_estelar | 171 | 55.0% |
| hierro | 902 | 48.3% |
| mitril | 466 | 53.9% |
| ninguno | 1 | 0.0% |
| titanio | 506 | 51.0% |

### Nature by level bracket
- **100-199**: contundente: 210, cortante: 229, desarmado: 115, perforante: 435
- **200-299**: contundente: 238, cortante: 281, desarmado: 105, perforante: 501
- **300-399**: contundente: 220, cortante: 220, desarmado: 100, perforante: 439
- **400-500**: contundente: 218, cortante: 202, desarmado: 94, perforante: 393

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 48.0% | 940 | 50.6% | 3060 | -2.6pp |
| d_fulgor | 48.2% | 938 | 50.6% | 3062 | -2.4pp |
| r_fulgor | 47.4% | 951 | 50.8% | 3049 | -3.4pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.1 | 0 | 140 | 13 | 24 | 36 |
| Asesino | 48.7 | 1 | 143 | 17 | 38 | 77 |
| Esquivo | 28.7 | 1 | 133 | 14 | 25 | 34 |
| Equilibrado | 41.9 | 1 | 132 | 22 | 37 | 58 |
| Extremista ATK | 64.1 | 1 | 180 | 36 | 67 | 88 |
| Extremista DEF | 26.3 | 1 | 139 | 11 | 23 | 35 |
| Extremista ASPD | 48.4 | 1 | 165 | 21 | 39 | 71 |
| Extremista REF | 32.3 | 1 | 150 | 13 | 28 | 44 |
| Velocista | 31.9 | 1 | 139 | 17 | 29 | 38 |
| Berserker | 57.3 | 1 | 180 | 24 | 58 | 82 |
| Guardian | 26.5 | 1 | 126 | 10 | 22 | 38 |
| Estratega | 32.5 | 1 | 136 | 13 | 30 | 48 |
| Gladiador | 55.2 | 1 | 180 | 21 | 55 | 80 |
| Magus | 43.8 | 1 | 148 | 20 | 37 | 64 |

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
| Magus | 2 | 2 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 164 | 1042 | 15.7% |
| Asesino | 55 | 728 | 7.6% |
| Esquivo | 351 | 697 | 50.4% |
| Equilibrado | 291 | 945 | 30.8% |
| Extremista ATK | 83 | 693 | 12.0% |
| Extremista DEF | 287 | 963 | 29.8% |
| Extremista ASPD | 90 | 692 | 13.0% |
| Extremista REF | 480 | 657 | 73.1% |
| Velocista | 112 | 761 | 14.7% |
| Berserker | 62 | 648 | 9.6% |
| Guardian | 164 | 1142 | 14.4% |
| Estratega | 529 | 710 | 74.5% |
| Gladiador | 251 | 598 | 42.0% |
| Magus | 178 | 706 | 25.2% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 22 | 47 | 58 | 49 | 15 | 16 | 14 | 11 | 99 | 12 | 43 | 14 | 11 | 24 |
| 5 | 35 | 52 | 62 | 55 | 25 | 27 | 22 | 18 | 109 | 22 | 53 | 23 | 21 | 30 |
| 10 | 36 | 52 | 62 | 54 | 25 | 29 | 22 | 17 | 110 | 22 | 53 | 23 | 21 | 30 |
| 15 | 37 | 52 | 62 | 55 | 25 | 30 | 22 | 17 | 110 | 22 | 55 | 23 | 21 | 30 |
| 20 | 37 | 52 | 62 | 55 | 25 | 31 | 22 | 17 | 110 | 22 | 55 | 23 | 22 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 82.4% | 75.0% | 72.0% | 76.5% | 36.0% | 70.8% | 76.5% | 91.7% | 57.9% | 58.3% | 60.0% | 40.9% | 84.0% |
| Asesino | 17.6% | 50.0% | 45.0% | 42.3% | 17.6% | 13.6% | 26.9% | 53.8% | 68.0% | 17.4% | 5.9% | 38.9% | 10.0% | 31.8% |
| Esquivo | 25.0% | 55.0% | 50.0% | 22.2% | 16.7% | 0.0% | 15.0% | 8.7% | 65.0% | 16.1% | 16.7% | 10.5% | 0.0% | 35.3% |
| Equilibrado | 28.0% | 57.7% | 77.8% | 50.0% | 25.0% | 21.4% | 33.3% | 52.4% | 73.7% | 47.4% | 26.1% | 15.0% | 23.5% | 55.6% |
| Extremista ATK | 23.5% | 82.4% | 83.3% | 75.0% | 50.0% | 44.8% | 60.0% | 61.9% | 93.3% | 62.5% | 43.8% | 42.9% | 59.1% | 63.6% |
| Extremista DEF | 64.0% | 86.4% | 100.0% | 78.6% | 55.2% | 50.0% | 66.7% | 70.0% | 94.4% | 76.2% | 52.4% | 66.7% | 72.7% | 80.0% |
| Extremista ASPD | 29.2% | 73.1% | 85.0% | 66.7% | 40.0% | 33.3% | 50.0% | 57.1% | 86.4% | 45.5% | 43.8% | 34.8% | 35.0% | 68.8% |
| Extremista REF | 23.5% | 46.2% | 91.3% | 47.6% | 38.1% | 30.0% | 42.9% | 50.0% | 68.2% | 50.0% | 65.0% | 53.3% | 31.3% | 73.3% |
| Velocista | 8.3% | 32.0% | 35.0% | 26.3% | 6.7% | 5.6% | 13.6% | 31.8% | 50.0% | 5.3% | 20.7% | 15.8% | 25.0% | 22.7% |
| Berserker | 42.1% | 82.6% | 83.9% | 52.6% | 37.5% | 23.8% | 54.5% | 50.0% | 94.7% | 50.0% | 47.8% | 40.0% | 26.3% | 55.6% |
| Guardian | 41.7% | 94.1% | 83.3% | 73.9% | 56.3% | 47.6% | 56.3% | 35.0% | 79.3% | 52.2% | 50.0% | 71.4% | 35.0% | 71.4% |
| Estratega | 40.0% | 61.1% | 89.5% | 85.0% | 57.1% | 33.3% | 65.2% | 46.7% | 84.2% | 60.0% | 28.6% | 50.0% | 21.1% | 85.7% |
| Gladiador | 59.1% | 90.0% | 100.0% | 76.5% | 40.9% | 27.3% | 65.0% | 68.8% | 75.0% | 73.7% | 65.0% | 78.9% | 50.0% | 51.9% |
| Magus | 16.0% | 68.2% | 64.7% | 44.4% | 36.4% | 20.0% | 31.3% | 26.7% | 77.3% | 44.4% | 28.6% | 14.3% | 48.1% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.2% | 708 |
| 16-30 | 45.4% | 1011 |
| 31-50 | 50.7% | 692 |
| 51-70 | 50.1% | 405 |
| 71-100 | 54.0% | 1184 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.6% | 35 |
| 16-30 | 39.3% | 847 |
| 31-50 | 47.4% | 1539 |
| 51-70 | 54.3% | 610 |
| 71-100 | 60.8% | 969 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 61.1% | 501 |
| 16-30 | 45.6% | 803 |
| 31-50 | 47.4% | 737 |
| 51-70 | 45.9% | 516 |
| 71-100 | 51.4% | 1443 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 948 |
| 16-30 | 48.9% | 1016 |
| 31-50 | 50.2% | 723 |
| 51-70 | 49.1% | 444 |
| 71-100 | 48.8% | 869 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.9% | 1624 |
| 16-30 | 51.8% | 1136 |
| 31-50 | 43.2% | 609 |
| 51-70 | 40.6% | 254 |
| 71-100 | 28.1% | 377 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 3267 |
| 16-30 | 48.8% | 418 |
| 31-50 | 44.4% | 239 |
| 51-70 | 49.3% | 69 |
| 71-100 | 71.4% | 7 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 3263 |
| 16-30 | 46.6% | 429 |
| 31-50 | 47.7% | 239 |
| 51-70 | 52.5% | 61 |
| 71-100 | 62.5% | 8 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 3267 |
| 16-30 | 46.4% | 422 |
| 31-50 | 47.9% | 240 |
| 51-70 | 53.1% | 64 |
| 71-100 | 42.9% | 7 |
