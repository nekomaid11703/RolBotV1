# Combat Simulation Report
Generated: 2026-08-05 14:01:06 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.3 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1796 (89.8%) |
| Timeouts (draws) | 204 (10.2%) |
| Avg rounds (all) | 7.0 |
| Avg rounds (KO only) | 5.4 |
| Rounds P50 / P90 / Max | 5 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 312 |
| Avg rounds | 7.3 |
| P50 / P90 | 5 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 922/2000 |
| Winrate | 46.1% |
| Advantage over 50% | -3.9% |
| Draws | 3 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 181 | 291 | 62.2% |  |
| Asesino | 104 | 286 | 36.4% |  |
| Esquivo | 79 | 292 | 27.1% |  |
| Equilibrado | 97 | 309 | 31.4% |  |
| Extremista ATK | 183 | 293 | 62.5% |  |
| Extremista DEF | 190 | 319 | 59.6% |  |
| Extremista ASPD | 150 | 256 | 58.6% |  |
| Extremista REF | 159 | 273 | 58.2% |  |
| Velocista | 40 | 282 | 14.2% |  |
| Berserker | 174 | 259 | 67.2% |  |
| Guardian | 138 | 329 | 41.9% |  |
| Estratega | 183 | 277 | 66.1% |  |
| Gladiador | 201 | 278 | 72.3% | YES |
| Magus | 118 | 256 | 46.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 24.7 | - |
| Rests | 4.5 | 3 |
| Advances | 4.3 | - |
| Retreats | 0.0 | - |
| Battles with item use | 20.6% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.91 (avg 46.66) |
| ASPD spread (stddev) | 31.30 (avg 52.51) |
| Equipment tier A | 506 (12.7%) |
| Equipment tier B | 870 (21.8%) |
| Equipment tier C | 1006 (25.1%) |
| Equipment tier E | 1618 (40.5%) |
| Level 100-199 | 983 |
| Level 200-299 | 1083 |
| Level 300-399 | 995 |
| Level 400-500 | 939 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| perforante | 4000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2200 | 50.5% |
| ligera | 396 | 44.2% |
| media | 395 | 53.9% |
| total | 1009 | 49.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 91 | 49.5% |
| 3+ | 3909 | 49.9% |
Set bonus active: 49.9% (3909) vs inactive 49.5% (91)

### Amulet
With amulet: 51.1% (1631) vs without 49.1% (2369)

### Shield
With shield: 50.8% (2401) vs without 48.6% (1599)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 506 | 52.6% |
| B | 870 | 56.2% |
| C | 1006 | 49.7% |
| E | 1618 | 45.9% |

### Nature by level bracket
- **100-199**: perforante: 983
- **200-299**: perforante: 1083
- **300-399**: perforante: 995
- **400-500**: perforante: 939

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 47.1% | 951 | 50.8% | 3049 | -3.7pp |
| d_fulgor | 45.9% | 949 | 51.2% | 3051 | -5.2pp |
| r_fulgor | 47.0% | 943 | 50.8% | 3057 | -3.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 17.7 | 0 | 58 | 11 | 17 | 26 |
| Asesino | 58.6 | 0 | 81 | 47 | 64 | 76 |
| Esquivo | 10.1 | 0 | 51 | 0 | 0 | 20 |
| Equilibrado | 23.6 | 0 | 73 | 0 | 24 | 39 |
| Extremista ATK | 64.3 | 0 | 81 | 59 | 73 | 77 |
| Extremista DEF | 4.4 | 0 | 65 | 0 | 0 | 0 |
| Extremista ASPD | 47.1 | 0 | 81 | 26 | 49 | 66 |
| Extremista REF | 25.9 | 0 | 69 | 16 | 23 | 33 |
| Velocista | 21.9 | 0 | 52 | 15 | 25 | 30 |
| Berserker | 64.0 | 0 | 81 | 56 | 73 | 78 |
| Guardian | 8.4 | 0 | 51 | 0 | 0 | 17 |
| Estratega | 30.5 | 0 | 69 | 19 | 31 | 40 |
| Gladiador | 58.2 | 0 | 81 | 41 | 64 | 75 |
| Magus | 48.3 | 0 | 81 | 29 | 46 | 68 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 440 | 440 | 100.0% |
| Asesino | 391 | 391 | 100.0% |
| Esquivo | 1470 | 1470 | 100.0% |
| Equilibrado | 1335 | 1335 | 100.0% |
| Extremista ATK | 49 | 49 | 100.0% |
| Extremista DEF | 441 | 441 | 100.0% |
| Extremista ASPD | 245 | 245 | 100.0% |
| Extremista REF | 394 | 394 | 100.0% |
| Velocista | 674 | 674 | 100.0% |
| Berserker | 118 | 118 | 100.0% |
| Guardian | 851 | 851 | 100.0% |
| Estratega | 278 | 278 | 100.0% |
| Gladiador | 230 | 230 | 100.0% |
| Magus | 503 | 503 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 49 | 1583 | 3.1% |
| Asesino | 17 | 943 | 1.8% |
| Esquivo | 301 | 2077 | 14.5% |
| Equilibrado | 60 | 2176 | 2.8% |
| Extremista ATK | 142 | 675 | 21.0% |
| Extremista DEF | 260 | 1417 | 18.3% |
| Extremista ASPD | 83 | 805 | 10.3% |
| Extremista REF | 733 | 1272 | 57.6% |
| Velocista | 0 | 1454 | 0.0% |
| Berserker | 97 | 628 | 15.4% |
| Guardian | 0 | 2289 | 0.0% |
| Estratega | 596 | 1040 | 57.3% |
| Gladiador | 277 | 684 | 40.5% |
| Magus | 137 | 1022 | 13.4% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 26 | 39 | 60 | 55 | 14 | 17 | 11 | 13 | 105 | 11 | 48 | 16 | 10 | 21 |
| 5 | 37 | 43 | 63 | 59 | 24 | 27 | 21 | 19 | 105 | 22 | 56 | 22 | 20 | 29 |
| 10 | 38 | 44 | 63 | 60 | 25 | 31 | 21 | 18 | 105 | 23 | 56 | 21 | 20 | 29 |
| 15 | 39 | 44 | 65 | 62 | 25 | 35 | 22 | 19 | 106 | 23 | 57 | 21 | 21 | 29 |
| 20 | 39 | 45 | 66 | 63 | 25 | 37 | 22 | 19 | 106 | 23 | 57 | 22 | 21 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 92.3% | 72.2% | 95.0% | 42.9% | 68.4% | 73.7% | 34.8% | 93.8% | 76.5% | 62.5% | 25.0% | 31.8% | 75.0% |
| Asesino | 7.7% | 50.0% | 67.9% | 55.2% | 14.3% | 0.0% | 25.0% | 21.1% | 73.9% | 6.7% | 41.7% | 33.3% | 26.7% | 50.0% |
| Esquivo | 27.8% | 32.1% | 50.0% | 34.5% | 13.6% | 20.0% | 6.3% | 23.5% | 66.7% | 23.1% | 41.7% | 13.6% | 0.0% | 16.7% |
| Equilibrado | 5.0% | 44.8% | 62.1% | 50.0% | 36.8% | 19.2% | 0.0% | 14.3% | 71.4% | 20.0% | 50.0% | 22.7% | 4.3% | 9.1% |
| Extremista ATK | 57.1% | 85.7% | 86.4% | 63.2% | 50.0% | 59.1% | 61.9% | 43.8% | 88.2% | 22.7% | 65.2% | 54.2% | 56.0% | 85.0% |
| Extremista DEF | 31.6% | 100.0% | 80.0% | 80.8% | 40.9% | 50.0% | 50.0% | 61.5% | 86.4% | 57.1% | 40.9% | 50.0% | 46.4% | 58.3% |
| Extremista ASPD | 26.3% | 75.0% | 93.8% | 100.0% | 38.1% | 50.0% | 50.0% | 45.5% | 95.2% | 43.8% | 52.6% | 65.2% | 25.0% | 75.0% |
| Extremista REF | 65.2% | 78.9% | 76.5% | 85.7% | 56.3% | 38.5% | 54.5% | 50.0% | 100.0% | 36.8% | 57.1% | 42.9% | 17.4% | 58.3% |
| Velocista | 6.3% | 26.1% | 33.3% | 28.6% | 11.8% | 13.6% | 4.8% | 0.0% | 50.0% | 0.0% | 21.1% | 0.0% | 0.0% | 0.0% |
| Berserker | 23.5% | 93.3% | 76.9% | 80.0% | 77.3% | 42.9% | 56.3% | 63.2% | 100.0% | 50.0% | 80.0% | 64.3% | 36.8% | 92.3% |
| Guardian | 37.5% | 58.3% | 58.3% | 50.0% | 34.8% | 54.5% | 47.4% | 42.9% | 78.9% | 20.0% | 50.0% | 3.7% | 4.8% | 54.5% |
| Estratega | 75.0% | 66.7% | 86.4% | 77.3% | 45.8% | 50.0% | 34.8% | 57.1% | 100.0% | 35.7% | 96.3% | 50.0% | 52.6% | 66.7% |
| Gladiador | 68.2% | 73.3% | 100.0% | 95.7% | 44.0% | 53.6% | 66.7% | 82.6% | 100.0% | 63.2% | 95.2% | 47.4% | 50.0% | 77.3% |
| Magus | 25.0% | 50.0% | 83.3% | 90.9% | 15.0% | 41.7% | 25.0% | 41.7% | 100.0% | 7.7% | 45.5% | 33.3% | 22.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.6% | 716 |
| 16-30 | 46.6% | 1008 |
| 31-50 | 44.2% | 772 |
| 51-70 | 52.5% | 402 |
| 71-100 | 62.1% | 1102 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 22.6% | 31 |
| 16-30 | 45.5% | 824 |
| 31-50 | 50.9% | 1478 |
| 51-70 | 53.8% | 600 |
| 71-100 | 50.5% | 1067 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.9% | 536 |
| 16-30 | 44.7% | 814 |
| 31-50 | 45.2% | 713 |
| 51-70 | 48.4% | 533 |
| 71-100 | 56.7% | 1404 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 955 |
| 16-30 | 49.2% | 983 |
| 31-50 | 50.4% | 681 |
| 51-70 | 44.2% | 502 |
| 71-100 | 53.6% | 879 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.7% | 1600 |
| 16-30 | 55.9% | 1071 |
| 31-50 | 42.2% | 659 |
| 51-70 | 28.0% | 289 |
| 71-100 | 26.2% | 381 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 3259 |
| 16-30 | 43.0% | 451 |
| 31-50 | 54.1% | 229 |
| 51-70 | 54.5% | 55 |
| 71-100 | 50.0% | 6 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 3267 |
| 16-30 | 46.2% | 433 |
| 31-50 | 47.9% | 236 |
| 51-70 | 57.6% | 59 |
| 71-100 | 40.0% | 5 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 3252 |
| 16-30 | 43.8% | 457 |
| 31-50 | 49.6% | 230 |
| 51-70 | 61.4% | 57 |
| 71-100 | 50.0% | 4 |
