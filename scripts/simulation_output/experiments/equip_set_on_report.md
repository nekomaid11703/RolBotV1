# Combat Simulation Report
Generated: 2026-08-05 03:22:25 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.5 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 910 (91.0%) |
| Timeouts (draws) | 90 (9.0%) |
| Avg rounds (all) | 7.0 |
| Avg rounds (KO only) | 5.6 |
| Rounds P50 / P90 / Max | 5 / 18 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 150 |
| Avg rounds | 7.5 |
| P50 / P90 | 5 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 521/1000 |
| Winrate | 52.1% |
| Advantage over 50% | 2.1% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 79 | 131 | 60.3% |  |
| Asesino | 53 | 131 | 40.5% |  |
| Esquivo | 82 | 161 | 50.9% |  |
| Equilibrado | 77 | 138 | 55.8% |  |
| Extremista ATK | 37 | 129 | 28.7% |  |
| Extremista DEF | 78 | 137 | 56.9% |  |
| Extremista ASPD | 66 | 155 | 42.6% |  |
| Extremista REF | 65 | 156 | 41.7% |  |
| Velocista | 89 | 136 | 65.4% | YES |
| Berserker | 48 | 133 | 36.1% |  |
| Guardian | 88 | 135 | 65.2% |  |
| Estratega | 94 | 162 | 58.0% |  |
| Gladiador | 79 | 143 | 55.2% |  |
| Magus | 63 | 153 | 41.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.9 | 0 |
| Heal applied | 52.5 | - |
| Rests | 2.7 | 2 |
| Advances | 3.5 | - |
| Retreats | 0.1 | - |
| Battles with item use | 39.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 88.8% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.39 (avg 46.62) |
| ASPD spread (stddev) | 30.66 (avg 53.17) |
| Equipment tier A | 239 (11.9%) |
| Equipment tier B | 432 (21.6%) |
| Equipment tier C | 514 (25.7%) |
| Equipment tier E | 815 (40.8%) |
| Level 100-199 | 489 |
| Level 200-299 | 554 |
| Level 300-399 | 490 |
| Level 400-500 | 467 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 615 |
| cortante | 573 |
| desarmado | 225 |
| perforante | 587 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 515 | 52.8% |
| ligera | 531 | 46.3% |
| media | 458 | 48.0% |
| total | 496 | 52.4% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 49.9% |
Set bonus active: 49.9% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 51.3% (781) vs without 49.0% (1219)

### Shield
With shield: 0.0% (0) vs without 49.9% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 217 | 65.0% |
| B | 381 | 57.5% |
| C | 454 | 47.8% |
| E | 723 | 44.3% |
| desarmado | 225 | 44.9% |

### Nature by level bracket
- **100-199**: contundente: 157, cortante: 132, desarmado: 56, perforante: 144
- **200-299**: contundente: 156, cortante: 157, desarmado: 59, perforante: 182
- **300-399**: contundente: 160, cortante: 134, desarmado: 63, perforante: 133
- **400-500**: contundente: 142, cortante: 150, desarmado: 47, perforante: 128

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 42.0% | 505 | 52.6% | 1495 | -10.6pp |
| d_fulgor | 40.1% | 499 | 53.2% | 1501 | -13.1pp |
| r_fulgor | 40.7% | 499 | 53.0% | 1501 | -12.3pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.0 | 0 | 128 | 5 | 11 | 21 |
| Asesino | 60.9 | 14 | 128 | 45 | 65 | 78 |
| Esquivo | 16.3 | 0 | 128 | 0 | 11 | 25 |
| Equilibrado | 35.7 | 0 | 128 | 19 | 30 | 48 |
| Extremista ATK | 52.3 | 0 | 128 | 19 | 52 | 71 |
| Extremista DEF | 5.5 | 0 | 128 | 0 | 0 | 4 |
| Extremista ASPD | 45.5 | 9 | 128 | 19 | 46 | 66 |
| Extremista REF | 21.3 | 0 | 128 | 9 | 17 | 28 |
| Velocista | 25.3 | 0 | 128 | 10 | 19 | 37 |
| Berserker | 57.8 | 19 | 128 | 45 | 61 | 73 |
| Guardian | 14.8 | 0 | 128 | 0 | 9 | 20 |
| Estratega | 29.9 | 0 | 128 | 14 | 19 | 43 |
| Gladiador | 46.3 | 13 | 128 | 24 | 37 | 65 |
| Magus | 49.4 | 9 | 128 | 31 | 47 | 61 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 81 | 81 | 100.0% |
| Asesino | 46 | 46 | 100.0% |
| Esquivo | 740 | 740 | 100.0% |
| Equilibrado | 384 | 384 | 100.0% |
| Extremista ATK | 73 | 73 | 100.0% |
| Extremista DEF | 140 | 140 | 100.0% |
| Extremista ASPD | 85 | 85 | 100.0% |
| Extremista REF | 26 | 26 | 100.0% |
| Velocista | 165 | 165 | 100.0% |
| Berserker | 130 | 130 | 100.0% |
| Guardian | 293 | 293 | 100.0% |
| Estratega | 130 | 130 | 100.0% |
| Gladiador | 49 | 49 | 100.0% |
| Magus | 199 | 199 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 2 | 722 | 0.3% |
| Asesino | 7 | 319 | 2.2% |
| Esquivo | 142 | 995 | 14.3% |
| Equilibrado | 33 | 682 | 4.8% |
| Extremista ATK | 52 | 542 | 9.6% |
| Extremista DEF | 219 | 871 | 25.1% |
| Extremista ASPD | 40 | 496 | 8.1% |
| Extremista REF | 591 | 719 | 82.2% |
| Velocista | 0 | 343 | 0.0% |
| Berserker | 40 | 498 | 8.0% |
| Guardian | 0 | 846 | 0.0% |
| Estratega | 427 | 687 | 62.2% |
| Gladiador | 139 | 441 | 31.5% |
| Magus | 61 | 549 | 11.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 17 | 15 | 18 | 11 | 13 | 10 | 10 | 9 | 13 | 16 | 15 | 10 | 18 |
| 5 | 24 | 22 | 19 | 25 | 18 | 20 | 16 | 13 | 14 | 19 | 23 | 17 | 17 | 24 |
| 10 | 26 | 23 | 22 | 28 | 18 | 25 | 17 | 12 | 16 | 19 | 25 | 17 | 17 | 25 |
| 15 | 27 | 23 | 27 | 28 | 18 | 28 | 17 | 12 | 16 | 20 | 27 | 17 | 17 | 25 |
| 20 | 27 | 23 | 28 | 29 | 19 | 29 | 17 | 12 | 16 | 20 | 28 | 17 | 18 | 26 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 66.7% | 33.3% | 44.4% | 92.9% | 54.5% | 75.0% | 83.3% | 16.7% | 100.0% | 40.0% | 33.3% | 33.3% | 75.0% |
| Asesino | 33.3% | 50.0% | 33.3% | 50.0% | 50.0% | 0.0% | 66.7% | 42.9% | 12.5% | 71.4% | 27.3% | 40.0% | 25.0% | 40.0% |
| Esquivo | 66.7% | 66.7% | 50.0% | 28.6% | 85.7% | 23.5% | 41.7% | 50.0% | 43.8% | 70.0% | 0.0% | 58.3% | 84.6% | 55.6% |
| Equilibrado | 55.6% | 50.0% | 71.4% | 50.0% | 80.0% | 33.3% | 50.0% | 62.5% | 16.7% | 71.4% | 58.3% | 50.0% | 0.0% | 61.5% |
| Extremista ATK | 7.1% | 50.0% | 14.3% | 20.0% | 50.0% | 25.0% | 0.0% | 36.4% | 0.0% | 20.0% | 28.6% | 36.4% | 35.7% | 60.0% |
| Extremista DEF | 36.4% | 100.0% | 76.5% | 66.7% | 75.0% | 50.0% | 62.5% | 55.6% | 25.0% | 54.5% | 38.5% | 54.5% | 50.0% | 69.2% |
| Extremista ASPD | 25.0% | 33.3% | 58.3% | 50.0% | 100.0% | 37.5% | 50.0% | 57.1% | 28.6% | 53.3% | 27.3% | 50.0% | 38.5% | 35.3% |
| Extremista REF | 16.7% | 57.1% | 50.0% | 37.5% | 63.6% | 44.4% | 42.9% | 50.0% | 16.7% | 83.3% | 22.2% | 22.2% | 38.5% | 55.6% |
| Velocista | 83.3% | 87.5% | 56.3% | 83.3% | 100.0% | 75.0% | 71.4% | 83.3% | 50.0% | 66.7% | 25.0% | 45.5% | 46.7% | 77.8% |
| Berserker | 0.0% | 28.6% | 30.0% | 28.6% | 80.0% | 45.5% | 46.7% | 16.7% | 33.3% | 50.0% | 20.0% | 33.3% | 30.0% | 57.1% |
| Guardian | 60.0% | 72.7% | 100.0% | 33.3% | 71.4% | 61.5% | 72.7% | 77.8% | 75.0% | 80.0% | 50.0% | 50.0% | 44.4% | 62.5% |
| Estratega | 66.7% | 60.0% | 41.7% | 50.0% | 63.6% | 45.5% | 50.0% | 77.8% | 54.5% | 66.7% | 50.0% | 50.0% | 72.7% | 62.5% |
| Gladiador | 66.7% | 75.0% | 15.4% | 100.0% | 64.3% | 50.0% | 61.5% | 61.5% | 53.3% | 70.0% | 55.6% | 27.3% | 50.0% | 69.2% |
| Magus | 25.0% | 60.0% | 44.4% | 38.5% | 40.0% | 30.8% | 64.7% | 44.4% | 22.2% | 42.9% | 37.5% | 37.5% | 30.8% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.0% | 312 |
| 16-30 | 52.5% | 562 |
| 31-50 | 54.2% | 373 |
| 51-70 | 52.4% | 210 |
| 71-100 | 43.8% | 543 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 30.8% | 13 |
| 16-30 | 35.9% | 429 |
| 31-50 | 45.0% | 757 |
| 51-70 | 56.5% | 301 |
| 71-100 | 65.8% | 500 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.1% | 220 |
| 16-30 | 45.5% | 400 |
| 31-50 | 49.9% | 419 |
| 51-70 | 55.6% | 286 |
| 71-100 | 50.4% | 675 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.2% | 440 |
| 16-30 | 44.8% | 496 |
| 31-50 | 52.6% | 367 |
| 51-70 | 57.6% | 191 |
| 71-100 | 55.9% | 506 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.2% | 808 |
| 16-30 | 40.4% | 520 |
| 31-50 | 43.3% | 337 |
| 51-70 | 79.9% | 154 |
| 71-100 | 80.7% | 181 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1598 |
| 16-30 | 37.6% | 250 |
| 31-50 | 47.0% | 117 |
| 51-70 | 31.3% | 32 |
| 71-100 | 66.7% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.5% | 1589 |
| 16-30 | 36.5% | 252 |
| 31-50 | 48.8% | 127 |
| 51-70 | 32.1% | 28 |
| 71-100 | 25.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.9% | 1600 |
| 16-30 | 39.5% | 228 |
| 31-50 | 46.7% | 137 |
| 51-70 | 41.4% | 29 |
| 71-100 | 33.3% | 6 |
