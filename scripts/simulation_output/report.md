# Combat Simulation Report
Generated: 2026-08-05 03:21:07 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.5 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1816 (90.8%) |
| Timeouts (draws) | 184 (9.2%) |
| Avg rounds (all) | 7.2 |
| Avg rounds (KO only) | 5.8 |
| Rounds P50 / P90 / Max | 5 / 19 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 313 |
| Avg rounds | 7.5 |
| P50 / P90 | 5 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1053/2000 |
| Winrate | 52.6% |
| Advantage over 50% | 2.6% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 192 | 299 | 64.2% | YES |
| Asesino | 115 | 298 | 38.6% |  |
| Esquivo | 148 | 325 | 45.5% |  |
| Equilibrado | 128 | 250 | 51.2% |  |
| Extremista ATK | 122 | 289 | 42.2% |  |
| Extremista DEF | 185 | 305 | 60.7% |  |
| Extremista ASPD | 114 | 283 | 40.3% |  |
| Extremista REF | 106 | 268 | 39.6% |  |
| Velocista | 186 | 298 | 62.4% |  |
| Berserker | 121 | 266 | 45.5% |  |
| Guardian | 189 | 304 | 62.2% |  |
| Estratega | 137 | 256 | 53.5% |  |
| Gladiador | 138 | 281 | 49.1% |  |
| Magus | 118 | 278 | 42.4% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.0 | 0 |
| Heal applied | 53.8 | - |
| Rests | 2.8 | 2 |
| Advances | 3.7 | - |
| Retreats | 0.1 | - |
| Battles with item use | 41.0% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.3% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.29 (avg 46.85) |
| ASPD spread (stddev) | 31.37 (avg 52.51) |
| Equipment tier A | 527 (13.2%) |
| Equipment tier B | 816 (20.4%) |
| Equipment tier C | 1054 (26.4%) |
| Equipment tier E | 1603 (40.1%) |
| Level 100-199 | 965 |
| Level 200-299 | 1134 |
| Level 300-399 | 964 |
| Level 400-500 | 937 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1166 |
| cortante | 1210 |
| desarmado | 427 |
| perforante | 1197 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2213 | 50.4% |
| ligera | 392 | 45.4% |
| media | 423 | 50.4% |
| ninguna | 1 | 100.0% |
| total | 971 | 50.6% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 100.0% |
| 1-2 | 83 | 50.6% |
| 3+ | 3916 | 49.9% |
Set bonus active: 49.9% (3916) vs inactive 51.2% (84)

### Amulet
With amulet: 50.4% (1582) vs without 49.7% (2418)

### Shield
With shield: 49.7% (2416) vs without 50.4% (1584)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 476 | 66.4% |
| B | 739 | 55.2% |
| C | 937 | 50.6% |
| E | 1421 | 44.1% |
| desarmado | 427 | 41.0% |

### Nature by level bracket
- **100-199**: contundente: 292, cortante: 287, desarmado: 106, perforante: 280
- **200-299**: contundente: 338, cortante: 332, desarmado: 138, perforante: 326
- **300-399**: contundente: 270, cortante: 305, desarmado: 91, perforante: 298
- **400-500**: contundente: 266, cortante: 286, desarmado: 92, perforante: 293

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 40.2% | 979 | 53.1% | 3021 | -12.9pp |
| d_fulgor | 40.2% | 974 | 53.1% | 3026 | -12.9pp |
| r_fulgor | 40.3% | 987 | 53.1% | 3013 | -12.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 18.5 | 0 | 128 | 3 | 14 | 24 |
| Asesino | 59.5 | 0 | 128 | 46 | 54 | 77 |
| Esquivo | 15.7 | 0 | 128 | 0 | 11 | 21 |
| Equilibrado | 32.4 | 0 | 128 | 18 | 26 | 46 |
| Extremista ATK | 55.4 | 0 | 128 | 21 | 53 | 75 |
| Extremista DEF | 7.4 | 0 | 128 | 0 | 0 | 8 |
| Extremista ASPD | 44.6 | 0 | 128 | 19 | 44 | 62 |
| Extremista REF | 25.8 | 0 | 128 | 9 | 19 | 33 |
| Velocista | 24.0 | 0 | 128 | 10 | 17 | 27 |
| Berserker | 56.9 | 0 | 128 | 36 | 58 | 77 |
| Guardian | 13.0 | 0 | 128 | 0 | 8 | 19 |
| Estratega | 31.4 | 0 | 128 | 15 | 24 | 41 |
| Gladiador | 47.4 | 0 | 128 | 19 | 46 | 62 |
| Magus | 46.9 | 11 | 128 | 25 | 45 | 63 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 355 | 355 | 100.0% |
| Asesino | 240 | 240 | 100.0% |
| Esquivo | 1038 | 1038 | 100.0% |
| Equilibrado | 717 | 717 | 100.0% |
| Extremista ATK | 81 | 81 | 100.0% |
| Extremista DEF | 310 | 310 | 100.0% |
| Extremista ASPD | 162 | 162 | 100.0% |
| Extremista REF | 149 | 149 | 100.0% |
| Velocista | 487 | 487 | 100.0% |
| Berserker | 137 | 137 | 100.0% |
| Guardian | 598 | 598 | 100.0% |
| Estratega | 308 | 308 | 100.0% |
| Gladiador | 193 | 193 | 100.0% |
| Magus | 425 | 425 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 54 | 1625 | 3.3% |
| Asesino | 17 | 831 | 2.0% |
| Esquivo | 427 | 1694 | 25.2% |
| Equilibrado | 57 | 1345 | 4.2% |
| Extremista ATK | 98 | 923 | 10.6% |
| Extremista DEF | 383 | 1717 | 22.3% |
| Extremista ASPD | 113 | 1037 | 10.9% |
| Extremista REF | 1057 | 1446 | 73.1% |
| Velocista | 0 | 1061 | 0.0% |
| Berserker | 66 | 883 | 7.5% |
| Guardian | 1 | 1858 | 0.1% |
| Estratega | 646 | 1170 | 55.2% |
| Gladiador | 363 | 1032 | 35.2% |
| Magus | 114 | 1058 | 10.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14 | 16 | 16 | 20 | 10 | 12 | 11 | 11 | 6 | 11 | 16 | 13 | 10 | 15 |
| 5 | 24 | 21 | 20 | 24 | 18 | 20 | 17 | 14 | 11 | 19 | 24 | 17 | 17 | 22 |
| 10 | 27 | 21 | 21 | 26 | 18 | 24 | 17 | 13 | 15 | 19 | 26 | 16 | 17 | 22 |
| 15 | 27 | 22 | 23 | 27 | 18 | 26 | 17 | 13 | 16 | 19 | 27 | 16 | 17 | 22 |
| 20 | 27 | 22 | 25 | 27 | 18 | 27 | 17 | 13 | 15 | 20 | 28 | 16 | 17 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 70.4% | 62.1% | 42.9% | 80.0% | 55.6% | 84.0% | 60.0% | 41.2% | 73.9% | 85.0% | 53.3% | 71.4% | 58.8% |
| Asesino | 29.6% | 50.0% | 45.5% | 42.9% | 37.5% | 21.4% | 48.0% | 47.6% | 45.0% | 44.4% | 9.5% | 43.8% | 43.8% | 38.5% |
| Esquivo | 37.9% | 54.5% | 50.0% | 50.0% | 50.0% | 33.3% | 47.8% | 42.9% | 50.0% | 61.9% | 41.2% | 45.5% | 33.3% | 39.1% |
| Equilibrado | 57.1% | 57.1% | 50.0% | 50.0% | 53.3% | 43.5% | 52.6% | 64.7% | 38.9% | 53.8% | 48.0% | 41.7% | 59.1% | 45.5% |
| Extremista ATK | 20.0% | 62.5% | 50.0% | 46.7% | 50.0% | 14.3% | 52.6% | 50.0% | 24.0% | 43.5% | 19.2% | 40.9% | 50.0% | 65.5% |
| Extremista DEF | 44.4% | 78.6% | 66.7% | 56.5% | 85.7% | 50.0% | 86.4% | 57.9% | 43.3% | 63.2% | 35.5% | 70.6% | 52.4% | 84.2% |
| Extremista ASPD | 16.0% | 52.0% | 52.2% | 47.4% | 47.4% | 13.6% | 50.0% | 81.8% | 27.3% | 38.1% | 23.8% | 60.0% | 38.9% | 40.0% |
| Extremista REF | 40.0% | 52.4% | 57.1% | 35.3% | 50.0% | 42.1% | 18.2% | 50.0% | 40.7% | 10.5% | 32.0% | 15.8% | 50.0% | 50.0% |
| Velocista | 58.8% | 55.0% | 50.0% | 61.1% | 76.0% | 56.7% | 72.7% | 59.3% | 50.0% | 85.7% | 66.7% | 56.3% | 65.2% | 72.2% |
| Berserker | 26.1% | 55.6% | 38.1% | 46.2% | 56.5% | 36.8% | 61.9% | 89.5% | 14.3% | 50.0% | 11.1% | 35.0% | 53.3% | 53.8% |
| Guardian | 15.0% | 90.5% | 58.8% | 52.0% | 80.8% | 64.5% | 76.2% | 68.0% | 33.3% | 88.9% | 45.8% | 61.9% | 59.1% | 73.3% |
| Estratega | 46.7% | 56.3% | 54.5% | 58.3% | 59.1% | 29.4% | 40.0% | 84.2% | 43.8% | 65.0% | 38.1% | 50.0% | 58.3% | 61.1% |
| Gladiador | 28.6% | 56.3% | 66.7% | 40.9% | 50.0% | 47.6% | 61.1% | 50.0% | 34.8% | 46.7% | 40.9% | 41.7% | 50.0% | 78.9% |
| Magus | 41.2% | 61.5% | 60.9% | 54.5% | 34.5% | 15.8% | 60.0% | 50.0% | 27.8% | 46.2% | 26.7% | 38.9% | 21.1% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.2% | 707 |
| 16-30 | 50.6% | 1057 |
| 31-50 | 54.5% | 695 |
| 51-70 | 45.1% | 412 |
| 71-100 | 49.4% | 1129 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 30.3% | 33 |
| 16-30 | 35.5% | 865 |
| 31-50 | 45.3% | 1458 |
| 51-70 | 54.5% | 606 |
| 71-100 | 66.7% | 1038 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 512 |
| 16-30 | 45.4% | 844 |
| 31-50 | 49.6% | 728 |
| 51-70 | 54.6% | 538 |
| 71-100 | 52.6% | 1378 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 923 |
| 16-30 | 45.4% | 1014 |
| 31-50 | 48.0% | 743 |
| 51-70 | 57.5% | 445 |
| 71-100 | 58.5% | 875 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.3% | 1582 |
| 16-30 | 41.6% | 1087 |
| 31-50 | 46.7% | 675 |
| 51-70 | 80.0% | 245 |
| 71-100 | 73.7% | 411 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 3203 |
| 16-30 | 41.2% | 471 |
| 31-50 | 44.3% | 255 |
| 51-70 | 30.3% | 66 |
| 71-100 | 20.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 3220 |
| 16-30 | 39.1% | 450 |
| 31-50 | 43.1% | 262 |
| 51-70 | 36.9% | 65 |
| 71-100 | 33.3% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 3219 |
| 16-30 | 39.1% | 440 |
| 31-50 | 45.4% | 269 |
| 51-70 | 36.4% | 66 |
| 71-100 | 0.0% | 6 |
