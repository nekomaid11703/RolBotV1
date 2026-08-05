# Combat Simulation Report
Generated: 2026-08-05 02:26:21 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 16.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 902 (90.2%) |
| Timeouts (draws) | 98 (9.8%) |
| Avg rounds (all) | 16.8 |
| Avg rounds (KO only) | 13.0 |
| Rounds P50 / P90 / Max | 10 / 49 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 156 |
| Avg rounds | 16.8 |
| P50 / P90 | 11 / 42 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 528/1000 |
| Winrate | 52.8% |
| Advantage over 50% | 2.8% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 64 | 121 | 52.9% |  |
| Asesino | 66 | 159 | 41.5% |  |
| Esquivo | 67 | 151 | 44.4% |  |
| Equilibrado | 86 | 142 | 60.6% |  |
| Extremista ATK | 67 | 137 | 48.9% |  |
| Extremista DEF | 83 | 153 | 54.2% |  |
| Extremista ASPD | 57 | 140 | 40.7% |  |
| Extremista REF | 68 | 146 | 46.6% |  |
| Velocista | 72 | 143 | 50.3% |  |
| Berserker | 75 | 158 | 47.5% |  |
| Guardian | 73 | 140 | 52.1% |  |
| Estratega | 65 | 133 | 48.9% |  |
| Gladiador | 86 | 131 | 65.6% | YES |
| Magus | 70 | 146 | 47.9% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.7 | 1 |
| Heal applied | 105.0 | - |
| Rests | 9.5 | 5 |
| Advances | 4.4 | - |
| Retreats | 0.2 | - |
| Battles with item use | 56.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.83 (avg 48.58) |
| ASPD spread (stddev) | 31.41 (avg 54.25) |
| Equipment tier A | 234 (11.7%) |
| Equipment tier B | 450 (22.5%) |
| Equipment tier C | 502 (25.1%) |
| Equipment tier E | 814 (40.7%) |
| Level 100-199 | 463 |
| Level 200-299 | 554 |
| Level 300-399 | 517 |
| Level 400-500 | 466 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 2000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 627 | 50.1% |
| ligera | 5 | 80.0% |
| media | 60 | 38.3% |
| total | 1308 | 50.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 47 | 38.3% |
| 3+ | 1953 | 50.2% |
Set bonus active: 50.2% (1953) vs inactive 38.3% (47)

### Amulet
With amulet: 52.9% (769) vs without 48.1% (1231)

### Shield
With shield: 50.1% (1212) vs without 49.7% (788)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 234 | 74.8% |
| B | 450 | 55.8% |
| C | 502 | 49.2% |
| E | 814 | 40.0% |

### Nature by level bracket
- **100-199**: contundente: 463
- **200-299**: contundente: 554
- **300-399**: contundente: 517
- **400-500**: contundente: 466

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 38.9% | 453 | 53.2% | 1547 | -14.3pp |
| d_fulgor | 38.3% | 460 | 53.4% | 1540 | -15.2pp |
| r_fulgor | 39.0% | 461 | 53.2% | 1539 | -14.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 9.6 | 0 | 39 | 0 | 7 | 15 |
| Asesino | 50.6 | 0 | 77 | 47 | 50 | 63 |
| Esquivo | 9.2 | 0 | 47 | 0 | 9 | 14 |
| Equilibrado | 23.1 | 0 | 61 | 14 | 25 | 34 |
| Extremista ATK | 50.4 | 0 | 80 | 44 | 50 | 67 |
| Extremista DEF | 3.6 | 0 | 51 | 0 | 0 | 4 |
| Extremista ASPD | 37.2 | 0 | 80 | 19 | 39 | 50 |
| Extremista REF | 13.5 | 0 | 63 | 8 | 11 | 19 |
| Velocista | 12.3 | 0 | 37 | 8 | 12 | 16 |
| Berserker | 49.2 | 0 | 83 | 48 | 50 | 64 |
| Guardian | 3.9 | 0 | 34 | 0 | 0 | 8 |
| Estratega | 17.9 | 0 | 61 | 9 | 16 | 25 |
| Gladiador | 40.7 | 0 | 79 | 28 | 44 | 55 |
| Magus | 36.8 | 0 | 77 | 19 | 37 | 50 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 259 | 259 | 100.0% |
| Asesino | 466 | 466 | 100.0% |
| Esquivo | 2360 | 2360 | 100.0% |
| Equilibrado | 1386 | 1386 | 100.0% |
| Extremista ATK | 153 | 153 | 100.0% |
| Extremista DEF | 509 | 509 | 100.0% |
| Extremista ASPD | 199 | 199 | 100.0% |
| Extremista REF | 362 | 362 | 100.0% |
| Velocista | 891 | 891 | 100.0% |
| Berserker | 360 | 360 | 100.0% |
| Guardian | 981 | 981 | 100.0% |
| Estratega | 827 | 827 | 100.0% |
| Gladiador | 263 | 263 | 100.0% |
| Magus | 353 | 353 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 79 | 2139 | 3.7% |
| Asesino | 22 | 1192 | 1.8% |
| Esquivo | 591 | 3109 | 19.0% |
| Equilibrado | 83 | 2181 | 3.8% |
| Extremista ATK | 137 | 1078 | 12.7% |
| Extremista DEF | 553 | 2466 | 22.4% |
| Extremista ASPD | 100 | 1182 | 8.5% |
| Extremista REF | 1640 | 2178 | 75.3% |
| Velocista | 0 | 1865 | 0.0% |
| Berserker | 157 | 1426 | 11.0% |
| Guardian | 14 | 2943 | 0.5% |
| Estratega | 955 | 2008 | 47.6% |
| Gladiador | 416 | 1142 | 36.4% |
| Magus | 303 | 1333 | 22.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12 | 16 | 14 | 14 | 11 | 11 | 9 | 9 | 6 | 10 | 15 | 14 | 10 | 18 |
| 5 | 24 | 23 | 19 | 23 | 20 | 21 | 18 | 13 | 14 | 19 | 24 | 18 | 19 | 24 |
| 10 | 30 | 24 | 21 | 28 | 21 | 26 | 17 | 11 | 20 | 19 | 29 | 17 | 19 | 23 |
| 15 | 34 | 25 | 24 | 28 | 21 | 30 | 18 | 11 | 20 | 19 | 33 | 18 | 20 | 23 |
| 20 | 34 | 26 | 27 | 29 | 21 | 32 | 18 | 11 | 19 | 20 | 34 | 19 | 21 | 23 |
| 25 | 34 | 26 | 28 | 29 | 22 | 32 | 18 | 12 | 19 | 21 | 35 | 20 | 21 | 23 |
| 30 | 33 | 27 | 29 | 30 | 22 | 32 | 19 | 13 | 19 | 21 | 35 | 21 | 21 | 23 |
| 40 | 32 | 28 | 31 | 31 | 22 | 29 | 19 | 13 | 19 | 22 | 35 | 23 | 21 | 24 |
| 50 | 31 | 28 | 34 | 32 | 22 | 30 | 19 | 14 | 18 | 22 | 34 | 24 | 22 | 24 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 58.3% | 40.0% | 30.8% | 66.7% | 44.4% | 77.8% | 60.0% | 84.6% | 66.7% | 66.7% | 25.0% | 0.0% | 55.6% |
| Asesino | 41.7% | 50.0% | 27.3% | 33.3% | 50.0% | 40.0% | 50.0% | 66.7% | 30.8% | 27.3% | 50.0% | 36.4% | 33.3% | 45.5% |
| Esquivo | 60.0% | 72.7% | 50.0% | 58.3% | 40.0% | 25.0% | 63.6% | 52.6% | 60.0% | 35.7% | 31.3% | 80.0% | 11.1% | 11.1% |
| Equilibrado | 69.2% | 66.7% | 41.7% | 50.0% | 66.7% | 83.3% | 64.3% | 66.7% | 66.7% | 50.0% | 50.0% | 85.7% | 52.9% | 33.3% |
| Extremista ATK | 33.3% | 50.0% | 60.0% | 33.3% | 50.0% | 27.3% | 58.3% | 37.5% | 63.6% | 80.0% | 60.0% | 27.3% | 28.6% | 60.0% |
| Extremista DEF | 55.6% | 60.0% | 75.0% | 16.7% | 72.7% | 50.0% | 50.0% | 63.6% | 55.6% | 40.0% | 33.3% | 70.0% | 41.7% | 72.7% |
| Extremista ASPD | 22.2% | 50.0% | 36.4% | 35.7% | 41.7% | 50.0% | 50.0% | 37.5% | 44.4% | 12.5% | 41.7% | 85.7% | 33.3% | 41.2% |
| Extremista REF | 40.0% | 33.3% | 47.4% | 33.3% | 62.5% | 36.4% | 62.5% | 50.0% | 56.3% | 62.5% | 22.2% | 66.7% | 22.2% | 57.1% |
| Velocista | 15.4% | 69.2% | 40.0% | 33.3% | 36.4% | 44.4% | 55.6% | 43.8% | 50.0% | 81.8% | 60.0% | 55.6% | 28.6% | 88.9% |
| Berserker | 33.3% | 72.7% | 64.3% | 50.0% | 20.0% | 60.0% | 87.5% | 37.5% | 18.2% | 50.0% | 35.7% | 46.2% | 33.3% | 50.0% |
| Guardian | 33.3% | 50.0% | 68.8% | 50.0% | 40.0% | 66.7% | 58.3% | 77.8% | 40.0% | 64.3% | 42.9% | 50.0% | 20.0% | 33.3% |
| Estratega | 75.0% | 63.6% | 20.0% | 14.3% | 72.7% | 30.0% | 14.3% | 33.3% | 44.4% | 53.8% | 50.0% | 50.0% | 64.3% | 50.0% |
| Gladiador | 100.0% | 66.7% | 88.9% | 47.1% | 71.4% | 58.3% | 66.7% | 77.8% | 71.4% | 66.7% | 80.0% | 35.7% | 50.0% | 72.7% |
| Magus | 44.4% | 54.5% | 88.9% | 66.7% | 40.0% | 27.3% | 58.8% | 42.9% | 11.1% | 50.0% | 66.7% | 50.0% | 27.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 37.9% | 317 |
| 16-30 | 45.9% | 545 |
| 31-50 | 55.1% | 334 |
| 51-70 | 52.0% | 196 |
| 71-100 | 56.4% | 608 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 25.0% | 12 |
| 16-30 | 32.2% | 422 |
| 31-50 | 47.6% | 764 |
| 51-70 | 64.3% | 300 |
| 71-100 | 60.4% | 502 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.0% | 248 |
| 16-30 | 43.8% | 395 |
| 31-50 | 43.6% | 353 |
| 51-70 | 52.3% | 260 |
| 71-100 | 57.4% | 744 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 39.2% | 457 |
| 16-30 | 41.6% | 459 |
| 31-50 | 51.5% | 367 |
| 51-70 | 61.4% | 246 |
| 71-100 | 61.4% | 471 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.9% | 779 |
| 16-30 | 43.8% | 564 |
| 31-50 | 54.4% | 329 |
| 51-70 | 72.4% | 152 |
| 71-100 | 68.8% | 176 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1622 |
| 16-30 | 40.0% | 220 |
| 31-50 | 41.9% | 117 |
| 51-70 | 30.8% | 39 |
| 71-100 | 0.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1624 |
| 16-30 | 39.4% | 218 |
| 31-50 | 41.3% | 121 |
| 51-70 | 34.3% | 35 |
| 71-100 | 0.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.9% | 1617 |
| 16-30 | 38.3% | 222 |
| 31-50 | 39.7% | 131 |
| 51-70 | 25.0% | 28 |
| 71-100 | 0.0% | 2 |
