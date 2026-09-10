# Combat Simulation Report
Generated: 2026-08-05 03:14:03 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1707 (85.4%) |
| Timeouts (draws) | 293 (14.6%) |
| Avg rounds (all) | 9.3 |
| Avg rounds (KO only) | 7.3 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 284 |
| Avg rounds | 10.7 |
| P50 / P90 | 9 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 981/2000 |
| Winrate | 49.0% |
| Advantage over 50% | -1.0% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 188 | 283 | 66.4% | YES |
| Asesino | 112 | 291 | 38.5% |  |
| Esquivo | 134 | 288 | 46.5% |  |
| Equilibrado | 160 | 293 | 54.6% |  |
| Extremista ATK | 137 | 308 | 44.5% |  |
| Extremista DEF | 187 | 284 | 65.8% |  |
| Extremista ASPD | 107 | 301 | 35.5% |  |
| Extremista REF | 124 | 301 | 41.2% |  |
| Velocista | 164 | 275 | 59.6% |  |
| Berserker | 118 | 279 | 42.3% |  |
| Guardian | 165 | 266 | 62.0% |  |
| Estratega | 134 | 254 | 52.8% |  |
| Gladiador | 152 | 308 | 49.4% |  |
| Magus | 117 | 269 | 43.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.2 | 0 |
| Heal applied | 73.1 | - |
| Rests | 4.2 | 3 |
| Advances | 4.2 | - |
| Retreats | 0.1 | - |
| Battles with item use | 48.2% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.1% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.35 (avg 47.87) |
| ASPD spread (stddev) | 31.43 (avg 53.47) |
| Equipment tier A | 488 (12.2%) |
| Equipment tier B | 825 (20.6%) |
| Equipment tier C | 1015 (25.4%) |
| Equipment tier E | 1672 (41.8%) |
| Level 100-199 | 977 |
| Level 200-299 | 1161 |
| Level 300-399 | 962 |
| Level 400-500 | 900 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1196 |
| cortante | 1223 |
| desarmado | 395 |
| perforante | 1186 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1281 | 47.9% |
| ligera | 19 | 57.9% |
| media | 105 | 46.7% |
| total | 2595 | 51.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 86 | 41.9% |
| 3+ | 3914 | 50.2% |
Set bonus active: 50.2% (3914) vs inactive 41.9% (86)

### Amulet
With amulet: 49.4% (1603) vs without 50.4% (2397)

### Shield
With shield: 50.3% (2452) vs without 49.4% (1548)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 440 | 72.0% |
| B | 751 | 58.9% |
| C | 920 | 48.7% |
| E | 1494 | 41.8% |
| desarmado | 395 | 42.3% |

### Nature by level bracket
- **100-199**: contundente: 291, cortante: 304, desarmado: 104, perforante: 278
- **200-299**: contundente: 342, cortante: 347, desarmado: 123, perforante: 349
- **300-399**: contundente: 299, cortante: 281, desarmado: 83, perforante: 299
- **400-500**: contundente: 264, cortante: 291, desarmado: 85, perforante: 260

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 39.3% | 934 | 53.2% | 3066 | -13.9pp |
| d_fulgor | 39.4% | 941 | 53.2% | 3059 | -13.8pp |
| r_fulgor | 40.1% | 937 | 53.0% | 3063 | -12.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.6 | 0 | 128 | 4 | 13 | 25 |
| Asesino | 58.4 | 0 | 128 | 39 | 55 | 84 |
| Esquivo | 17.4 | 0 | 128 | 0 | 14 | 25 |
| Equilibrado | 32.6 | 0 | 128 | 17 | 29 | 46 |
| Extremista ATK | 56.2 | 0 | 128 | 40 | 56 | 76 |
| Extremista DEF | 8.0 | 0 | 128 | 0 | 0 | 11 |
| Extremista ASPD | 46.0 | 6 | 128 | 19 | 44 | 68 |
| Extremista REF | 24.4 | 0 | 128 | 12 | 19 | 30 |
| Velocista | 25.4 | 0 | 128 | 10 | 19 | 36 |
| Berserker | 60.5 | 0 | 128 | 46 | 57 | 84 |
| Guardian | 12.6 | 0 | 128 | 0 | 5 | 19 |
| Estratega | 32.0 | 0 | 128 | 16 | 24 | 44 |
| Gladiador | 51.4 | 0 | 128 | 33 | 47 | 70 |
| Magus | 47.7 | 0 | 128 | 23 | 46 | 67 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 337 | 337 | 100.0% |
| Asesino | 390 | 390 | 100.0% |
| Esquivo | 1264 | 1264 | 100.0% |
| Equilibrado | 1149 | 1149 | 100.0% |
| Extremista ATK | 183 | 183 | 100.0% |
| Extremista DEF | 206 | 206 | 100.0% |
| Extremista ASPD | 210 | 210 | 100.0% |
| Extremista REF | 289 | 289 | 100.0% |
| Velocista | 362 | 362 | 100.0% |
| Berserker | 153 | 153 | 100.0% |
| Guardian | 625 | 625 | 100.0% |
| Estratega | 381 | 381 | 100.0% |
| Gladiador | 318 | 318 | 100.0% |
| Magus | 471 | 471 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 64 | 2004 | 3.2% |
| Asesino | 2 | 1298 | 0.2% |
| Esquivo | 591 | 2165 | 27.3% |
| Equilibrado | 112 | 2229 | 5.0% |
| Extremista ATK | 176 | 1751 | 10.1% |
| Extremista DEF | 421 | 1763 | 23.9% |
| Extremista ASPD | 115 | 1711 | 6.7% |
| Extremista REF | 1332 | 1994 | 66.8% |
| Velocista | 0 | 1014 | 0.0% |
| Berserker | 127 | 1501 | 8.5% |
| Guardian | 14 | 2042 | 0.7% |
| Estratega | 870 | 1637 | 53.1% |
| Gladiador | 540 | 1551 | 34.8% |
| Magus | 210 | 1491 | 14.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 13 | 14 | 18 | 9 | 10 | 9 | 9 | 6 | 11 | 12 | 15 | 9 | 15 |
| 5 | 24 | 21 | 18 | 25 | 18 | 19 | 17 | 14 | 13 | 19 | 22 | 18 | 18 | 23 |
| 10 | 28 | 21 | 21 | 27 | 18 | 23 | 16 | 12 | 17 | 20 | 26 | 18 | 18 | 23 |
| 15 | 29 | 22 | 23 | 27 | 19 | 27 | 16 | 12 | 17 | 20 | 29 | 17 | 18 | 23 |
| 20 | 30 | 22 | 25 | 28 | 19 | 29 | 17 | 12 | 16 | 20 | 30 | 18 | 18 | 24 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 71.4% | 66.7% | 45.0% | 90.0% | 70.0% | 87.0% | 71.4% | 70.0% | 65.4% | 29.4% | 62.5% | 73.9% | 70.6% |
| Asesino | 28.6% | 50.0% | 45.5% | 37.5% | 27.8% | 19.0% | 62.5% | 75.0% | 28.6% | 63.2% | 20.0% | 31.3% | 30.0% | 30.0% |
| Esquivo | 29.2% | 54.5% | 50.0% | 20.0% | 48.1% | 38.5% | 75.0% | 58.3% | 50.0% | 40.0% | 52.6% | 42.9% | 36.7% | 58.3% |
| Equilibrado | 55.0% | 62.5% | 80.0% | 50.0% | 65.5% | 45.5% | 74.1% | 39.1% | 47.8% | 57.1% | 35.0% | 47.1% | 40.9% | 50.0% |
| Extremista ATK | 10.0% | 72.2% | 51.9% | 34.5% | 50.0% | 13.0% | 69.0% | 52.0% | 29.6% | 45.5% | 37.0% | 59.1% | 64.7% | 41.7% |
| Extremista DEF | 30.0% | 81.0% | 61.5% | 54.5% | 87.0% | 50.0% | 80.0% | 81.8% | 47.6% | 76.5% | 34.8% | 73.7% | 71.4% | 86.2% |
| Extremista ASPD | 13.0% | 37.5% | 25.0% | 25.9% | 31.0% | 20.0% | 50.0% | 52.2% | 29.2% | 50.0% | 38.1% | 36.4% | 50.0% | 42.9% |
| Extremista REF | 28.6% | 25.0% | 41.7% | 60.9% | 48.0% | 18.2% | 47.8% | 50.0% | 12.5% | 45.8% | 35.7% | 33.3% | 50.0% | 53.8% |
| Velocista | 30.0% | 71.4% | 50.0% | 52.2% | 70.4% | 52.4% | 70.8% | 87.5% | 50.0% | 52.6% | 60.0% | 42.9% | 57.9% | 81.8% |
| Berserker | 34.6% | 36.8% | 60.0% | 42.9% | 54.5% | 23.5% | 50.0% | 54.2% | 47.4% | 50.0% | 23.5% | 35.0% | 37.9% | 41.2% |
| Guardian | 70.6% | 80.0% | 47.4% | 65.0% | 63.0% | 65.2% | 61.9% | 64.3% | 40.0% | 76.5% | 50.0% | 65.0% | 44.4% | 61.5% |
| Estratega | 37.5% | 68.8% | 57.1% | 52.9% | 40.9% | 26.3% | 63.6% | 66.7% | 57.1% | 65.0% | 35.0% | 50.0% | 68.4% | 50.0% |
| Gladiador | 26.1% | 70.0% | 63.3% | 59.1% | 35.3% | 28.6% | 50.0% | 50.0% | 42.1% | 62.1% | 55.6% | 31.6% | 50.0% | 53.6% |
| Magus | 29.4% | 70.0% | 41.7% | 50.0% | 58.3% | 13.8% | 57.1% | 46.2% | 18.2% | 58.8% | 38.5% | 50.0% | 46.4% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.1% | 660 |
| 16-30 | 48.5% | 1031 |
| 31-50 | 51.1% | 706 |
| 51-70 | 52.8% | 434 |
| 71-100 | 48.9% | 1169 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 17.9% | 39 |
| 16-30 | 31.3% | 855 |
| 31-50 | 46.0% | 1498 |
| 51-70 | 59.9% | 644 |
| 71-100 | 67.3% | 964 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.1% | 516 |
| 16-30 | 43.0% | 781 |
| 31-50 | 50.3% | 751 |
| 51-70 | 48.6% | 527 |
| 71-100 | 53.3% | 1425 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.8% | 955 |
| 16-30 | 42.6% | 960 |
| 31-50 | 53.0% | 706 |
| 51-70 | 60.5% | 476 |
| 71-100 | 58.6% | 903 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.8% | 1671 |
| 16-30 | 44.2% | 1036 |
| 31-50 | 51.6% | 630 |
| 51-70 | 72.9% | 273 |
| 71-100 | 73.1% | 390 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 3274 |
| 16-30 | 37.4% | 438 |
| 31-50 | 40.4% | 230 |
| 51-70 | 38.2% | 55 |
| 71-100 | 33.3% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 3281 |
| 16-30 | 38.9% | 434 |
| 31-50 | 41.9% | 234 |
| 51-70 | 37.0% | 46 |
| 71-100 | 40.0% | 5 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 3275 |
| 16-30 | 38.8% | 449 |
| 31-50 | 40.8% | 223 |
| 51-70 | 39.1% | 46 |
| 71-100 | 14.3% | 7 |
