# Combat Simulation Report
Generated: 2026-08-05 02:26:01 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.5 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 951 (95.1%) |
| Timeouts (draws) | 49 (4.9%) |
| Avg rounds (all) | 10.8 |
| Avg rounds (KO only) | 8.7 |
| Rounds P50 / P90 / Max | 6 / 27 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 157 |
| Avg rounds | 10.5 |
| P50 / P90 | 6 / 23 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 487/1000 |
| Winrate | 48.7% |
| Advantage over 50% | -1.3% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 79 | 141 | 56.0% |  |
| Asesino | 56 | 145 | 38.6% |  |
| Esquivo | 85 | 155 | 54.8% |  |
| Equilibrado | 76 | 135 | 56.3% |  |
| Extremista ATK | 56 | 138 | 40.6% |  |
| Extremista DEF | 67 | 139 | 48.2% |  |
| Extremista ASPD | 58 | 155 | 37.4% |  |
| Extremista REF | 73 | 147 | 49.7% |  |
| Velocista | 105 | 164 | 64.0% | YES |
| Berserker | 62 | 135 | 45.9% |  |
| Guardian | 84 | 133 | 63.2% |  |
| Estratega | 74 | 120 | 61.7% |  |
| Gladiador | 76 | 146 | 52.1% |  |
| Magus | 49 | 147 | 33.3% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.3 | 0 |
| Heal applied | 74.9 | - |
| Rests | 5.9 | 3 |
| Advances | 3.2 | - |
| Retreats | 0.2 | - |
| Battles with item use | 47.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.9% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.04 (avg 46.79) |
| ASPD spread (stddev) | 31.24 (avg 53.17) |
| Equipment tier A | 238 (11.9%) |
| Equipment tier B | 413 (20.6%) |
| Equipment tier C | 540 (27.0%) |
| Equipment tier E | 809 (40.5%) |
| Level 100-199 | 480 |
| Level 200-299 | 565 |
| Level 300-399 | 505 |
| Level 400-500 | 450 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 596 |
| cortante | 596 |
| desarmado | 182 |
| perforante | 626 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| ligera | 2000 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 50.0% |
Set bonus active: 50.0% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 49.0% (802) vs without 50.7% (1198)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 218 | 65.1% |
| B | 379 | 63.6% |
| C | 496 | 48.8% |
| E | 725 | 42.9% |
| desarmado | 182 | 35.2% |

### Nature by level bracket
- **100-199**: contundente: 140, cortante: 143, desarmado: 50, perforante: 147
- **200-299**: contundente: 179, cortante: 147, desarmado: 56, perforante: 183
- **300-399**: contundente: 136, cortante: 167, desarmado: 36, perforante: 166
- **400-500**: contundente: 141, cortante: 139, desarmado: 40, perforante: 130

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 42.5% | 510 | 52.6% | 1490 | -10.0pp |
| d_fulgor | 42.8% | 523 | 52.5% | 1477 | -9.7pp |
| r_fulgor | 41.0% | 519 | 53.1% | 1481 | -12.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 16.1 | 0 | 128 | 0 | 10 | 19 |
| Asesino | 55.6 | 14 | 128 | 26 | 49 | 84 |
| Esquivo | 19.1 | 0 | 128 | 0 | 14 | 25 |
| Equilibrado | 32.7 | 0 | 128 | 17 | 28 | 46 |
| Extremista ATK | 52.6 | 0 | 128 | 46 | 50 | 73 |
| Extremista DEF | 4.3 | 0 | 128 | 0 | 0 | 0 |
| Extremista ASPD | 40.5 | 8 | 128 | 19 | 37 | 50 |
| Extremista REF | 22.3 | 0 | 128 | 8 | 14 | 30 |
| Velocista | 25.4 | 0 | 128 | 11 | 19 | 32 |
| Berserker | 57.7 | 0 | 128 | 46 | 54 | 72 |
| Guardian | 10.9 | 0 | 96 | 0 | 7 | 17 |
| Estratega | 33.5 | 0 | 128 | 18 | 23 | 46 |
| Gladiador | 46.1 | 0 | 128 | 26 | 45 | 57 |
| Magus | 49.2 | 0 | 128 | 24 | 46 | 69 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 214 | 214 | 100.0% |
| Asesino | 125 | 125 | 100.0% |
| Esquivo | 1912 | 1912 | 100.0% |
| Equilibrado | 726 | 726 | 100.0% |
| Extremista ATK | 62 | 62 | 100.0% |
| Extremista DEF | 248 | 248 | 100.0% |
| Extremista ASPD | 184 | 184 | 100.0% |
| Extremista REF | 159 | 159 | 100.0% |
| Velocista | 391 | 391 | 100.0% |
| Berserker | 153 | 153 | 100.0% |
| Guardian | 649 | 649 | 100.0% |
| Estratega | 174 | 174 | 100.0% |
| Gladiador | 135 | 135 | 100.0% |
| Magus | 602 | 602 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 30 | 1239 | 2.4% |
| Asesino | 2 | 554 | 0.4% |
| Esquivo | 253 | 2374 | 10.7% |
| Equilibrado | 64 | 1308 | 4.9% |
| Extremista ATK | 82 | 773 | 10.6% |
| Extremista DEF | 443 | 1680 | 26.4% |
| Extremista ASPD | 102 | 955 | 10.7% |
| Extremista REF | 686 | 1031 | 66.5% |
| Velocista | 0 | 862 | 0.0% |
| Berserker | 106 | 845 | 12.5% |
| Guardian | 27 | 1763 | 1.5% |
| Estratega | 402 | 708 | 56.8% |
| Gladiador | 298 | 733 | 40.7% |
| Magus | 116 | 1265 | 9.2% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 18 | 21 | 17 | 18 | 13 | 12 | 14 | 12 | 7 | 12 | 16 | 17 | 11 | 25 |
| 5 | 27 | 28 | 20 | 23 | 21 | 21 | 20 | 15 | 14 | 21 | 23 | 18 | 17 | 29 |
| 10 | 29 | 28 | 24 | 27 | 21 | 26 | 20 | 14 | 17 | 21 | 26 | 18 | 18 | 29 |
| 15 | 30 | 28 | 26 | 28 | 21 | 30 | 20 | 15 | 16 | 21 | 28 | 19 | 18 | 29 |
| 20 | 30 | 28 | 27 | 28 | 21 | 32 | 20 | 16 | 16 | 21 | 29 | 19 | 18 | 30 |
| 25 | 30 | 29 | 28 | 29 | 21 | 32 | 21 | 17 | 16 | 22 | 33 | 19 | 18 | 31 |
| 30 | 30 | 29 | 30 | 30 | 21 | 32 | 21 | 17 | 21 | 22 | 33 | 19 | 18 | 32 |
| 40 | 30 | 29 | 32 | 31 | 21 | 31 | 21 | 17 | 21 | 22 | 34 | 20 | 18 | 34 |
| 50 | 30 | 29 | 34 | 32 | 21 | 31 | 21 | 18 | 21 | 23 | 34 | 20 | 18 | 35 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 83.3% | 27.3% | 35.7% | 80.0% | 66.7% | 66.7% | 77.8% | 40.0% | 64.3% | 37.5% | 60.0% | 37.5% | 69.2% |
| Asesino | 16.7% | 50.0% | 55.6% | 9.1% | 18.2% | 33.3% | 100.0% | 58.3% | 17.6% | 40.0% | 30.8% | 16.7% | 50.0% | 55.6% |
| Esquivo | 72.7% | 44.4% | 50.0% | 63.6% | 53.8% | 71.4% | 81.8% | 30.8% | 33.3% | 61.5% | 33.3% | 22.2% | 50.0% | 76.5% |
| Equilibrado | 64.3% | 90.9% | 36.4% | 50.0% | 55.6% | 50.0% | 66.7% | 46.2% | 0.0% | 42.9% | 70.0% | 40.0% | 62.5% | 77.8% |
| Extremista ATK | 20.0% | 81.8% | 46.2% | 44.4% | 50.0% | 57.1% | 28.6% | 30.0% | 23.5% | 100.0% | 0.0% | 50.0% | 20.0% | 50.0% |
| Extremista DEF | 33.3% | 66.7% | 28.6% | 50.0% | 42.9% | 50.0% | 56.3% | 50.0% | 33.3% | 66.7% | 38.5% | 50.0% | 50.0% | 77.8% |
| Extremista ASPD | 33.3% | 0.0% | 18.2% | 33.3% | 71.4% | 43.8% | 50.0% | 54.5% | 27.3% | 55.6% | 20.0% | 20.0% | 50.0% | 41.7% |
| Extremista REF | 22.2% | 41.7% | 69.2% | 53.8% | 70.0% | 50.0% | 45.5% | 50.0% | 47.1% | 50.0% | 44.4% | 27.3% | 60.0% | 60.0% |
| Velocista | 60.0% | 82.4% | 66.7% | 100.0% | 76.5% | 66.7% | 72.7% | 52.9% | 50.0% | 73.3% | 40.0% | 40.0% | 57.1% | 60.0% |
| Berserker | 35.7% | 60.0% | 38.5% | 57.1% | 0.0% | 33.3% | 44.4% | 50.0% | 26.7% | 50.0% | 28.6% | 50.0% | 100.0% | 61.5% |
| Guardian | 62.5% | 69.2% | 66.7% | 30.0% | 100.0% | 61.5% | 80.0% | 55.6% | 60.0% | 71.4% | 50.0% | 75.0% | 41.7% | 87.5% |
| Estratega | 40.0% | 83.3% | 77.8% | 60.0% | 50.0% | 50.0% | 80.0% | 72.7% | 60.0% | 50.0% | 25.0% | 50.0% | 64.7% | 70.0% |
| Gladiador | 62.5% | 50.0% | 50.0% | 37.5% | 80.0% | 50.0% | 50.0% | 40.0% | 42.9% | 0.0% | 58.3% | 35.3% | 50.0% | 91.7% |
| Magus | 30.8% | 44.4% | 23.5% | 22.2% | 50.0% | 22.2% | 58.3% | 40.0% | 40.0% | 38.5% | 12.5% | 30.0% | 8.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.3% | 357 |
| 16-30 | 55.3% | 526 |
| 31-50 | 56.7% | 351 |
| 51-70 | 48.3% | 209 |
| 71-100 | 47.6% | 557 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 38.5% | 13 |
| 16-30 | 38.9% | 440 |
| 31-50 | 45.1% | 754 |
| 51-70 | 58.3% | 302 |
| 71-100 | 62.7% | 491 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.2% | 242 |
| 16-30 | 44.6% | 419 |
| 31-50 | 51.1% | 378 |
| 51-70 | 57.7% | 253 |
| 71-100 | 51.8% | 708 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.5% | 460 |
| 16-30 | 43.0% | 477 |
| 31-50 | 50.1% | 403 |
| 51-70 | 56.3% | 240 |
| 71-100 | 63.6% | 420 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 810 |
| 16-30 | 41.9% | 551 |
| 31-50 | 47.3% | 294 |
| 51-70 | 72.9% | 140 |
| 71-100 | 80.0% | 205 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 1577 |
| 16-30 | 45.7% | 265 |
| 31-50 | 37.6% | 125 |
| 51-70 | 35.5% | 31 |
| 71-100 | 50.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 1580 |
| 16-30 | 44.1% | 261 |
| 31-50 | 41.5% | 130 |
| 51-70 | 34.5% | 29 |
| 71-100 | 0.0% | 0 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 1583 |
| 16-30 | 44.0% | 252 |
| 31-50 | 40.9% | 132 |
| 51-70 | 34.5% | 29 |
| 71-100 | 50.0% | 4 |
