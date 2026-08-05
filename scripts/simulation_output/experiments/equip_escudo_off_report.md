# Combat Simulation Report
Generated: 2026-08-05 03:22:09 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.0 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 901 (90.1%) |
| Timeouts (draws) | 99 (9.9%) |
| Avg rounds (all) | 7.2 |
| Avg rounds (KO only) | 5.7 |
| Rounds P50 / P90 / Max | 5 / 20 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 164 |
| Avg rounds | 7.0 |
| P50 / P90 | 5 / 15 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 492/1000 |
| Winrate | 49.2% |
| Advantage over 50% | -0.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 85 | 147 | 57.8% |  |
| Asesino | 50 | 147 | 34.0% |  |
| Esquivo | 75 | 132 | 56.8% |  |
| Equilibrado | 81 | 149 | 54.4% |  |
| Extremista ATK | 67 | 149 | 45.0% |  |
| Extremista DEF | 99 | 158 | 62.7% |  |
| Extremista ASPD | 65 | 140 | 46.4% |  |
| Extremista REF | 54 | 136 | 39.7% |  |
| Velocista | 92 | 161 | 57.1% |  |
| Berserker | 39 | 123 | 31.7% |  |
| Guardian | 95 | 140 | 67.9% | YES |
| Estratega | 62 | 122 | 50.8% |  |
| Gladiador | 84 | 158 | 53.2% |  |
| Magus | 52 | 138 | 37.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 56.2 | - |
| Rests | 2.8 | 1 |
| Advances | 3.4 | - |
| Retreats | 0.0 | - |
| Battles with item use | 44.0% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.1% |
| Armor presence | 99.9% |
| ATK spread (stddev) | 32.09 (avg 47.13) |
| ASPD spread (stddev) | 31.20 (avg 52.45) |
| Equipment tier A | 260 (13.0%) |
| Equipment tier B | 393 (19.7%) |
| Equipment tier C | 530 (26.5%) |
| Equipment tier E | 817 (40.8%) |
| Level 100-199 | 492 |
| Level 200-299 | 579 |
| Level 300-399 | 465 |
| Level 400-500 | 464 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 597 |
| cortante | 612 |
| desarmado | 198 |
| perforante | 593 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 495 | 51.3% |
| ligera | 484 | 48.8% |
| media | 520 | 46.0% |
| ninguna | 2 | 0.0% |
| total | 499 | 54.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 2 | 0.0% |
| 1-2 | 95 | 47.4% |
| 3+ | 1903 | 50.2% |
Set bonus active: 50.2% (1903) vs inactive 46.4% (97)

### Amulet
With amulet: 49.0% (790) vs without 50.7% (1210)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 240 | 67.9% |
| B | 356 | 60.1% |
| C | 464 | 47.2% |
| E | 742 | 42.6% |
| desarmado | 198 | 44.4% |

### Nature by level bracket
- **100-199**: contundente: 150, cortante: 152, desarmado: 40, perforante: 150
- **200-299**: contundente: 174, cortante: 172, desarmado: 60, perforante: 173
- **300-399**: contundente: 122, cortante: 152, desarmado: 59, perforante: 132
- **400-500**: contundente: 151, cortante: 136, desarmado: 39, perforante: 138

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 44.2% | 475 | 51.8% | 1525 | -7.6pp |
| d_fulgor | 44.8% | 469 | 51.6% | 1531 | -6.8pp |
| r_fulgor | 44.8% | 473 | 51.6% | 1527 | -6.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 14.6 | 0 | 128 | 3 | 9 | 22 |
| Asesino | 56.4 | 0 | 128 | 46 | 49 | 75 |
| Esquivo | 19.7 | 0 | 128 | 0 | 18 | 25 |
| Equilibrado | 27.0 | 0 | 128 | 17 | 22 | 38 |
| Extremista ATK | 57.2 | 0 | 128 | 40 | 54 | 74 |
| Extremista DEF | 7.2 | 0 | 128 | 0 | 0 | 7 |
| Extremista ASPD | 48.3 | 10 | 128 | 23 | 46 | 71 |
| Extremista REF | 27.1 | 0 | 128 | 11 | 19 | 35 |
| Velocista | 22.7 | 0 | 128 | 8 | 16 | 30 |
| Berserker | 57.0 | 0 | 128 | 43 | 50 | 78 |
| Guardian | 12.5 | 0 | 128 | 0 | 6 | 19 |
| Estratega | 32.0 | 0 | 128 | 19 | 21 | 38 |
| Gladiador | 47.4 | 14 | 128 | 22 | 41 | 69 |
| Magus | 43.2 | 0 | 128 | 19 | 41 | 54 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 118 | 118 | 100.0% |
| Asesino | 93 | 93 | 100.0% |
| Esquivo | 559 | 559 | 100.0% |
| Equilibrado | 391 | 391 | 100.0% |
| Extremista ATK | 75 | 75 | 100.0% |
| Extremista DEF | 195 | 195 | 100.0% |
| Extremista ASPD | 50 | 50 | 100.0% |
| Extremista REF | 65 | 65 | 100.0% |
| Velocista | 250 | 250 | 100.0% |
| Berserker | 36 | 36 | 100.0% |
| Guardian | 178 | 178 | 100.0% |
| Estratega | 225 | 225 | 100.0% |
| Gladiador | 159 | 159 | 100.0% |
| Magus | 242 | 242 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 14 | 972 | 1.4% |
| Asesino | 0 | 408 | 0.0% |
| Esquivo | 143 | 800 | 17.9% |
| Equilibrado | 19 | 740 | 2.6% |
| Extremista ATK | 65 | 578 | 11.2% |
| Extremista DEF | 245 | 886 | 27.7% |
| Extremista ASPD | 37 | 445 | 8.3% |
| Extremista REF | 458 | 667 | 68.7% |
| Velocista | 0 | 494 | 0.0% |
| Berserker | 38 | 449 | 8.5% |
| Guardian | 0 | 751 | 0.0% |
| Estratega | 272 | 630 | 43.2% |
| Gladiador | 194 | 565 | 34.3% |
| Magus | 111 | 673 | 16.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 17 | 14 | 18 | 12 | 12 | 11 | 12 | 7 | 10 | 13 | 14 | 8 | 17 |
| 5 | 25 | 22 | 19 | 24 | 19 | 19 | 18 | 15 | 11 | 17 | 20 | 18 | 15 | 22 |
| 10 | 27 | 22 | 22 | 27 | 19 | 23 | 18 | 14 | 13 | 17 | 22 | 17 | 15 | 22 |
| 15 | 29 | 23 | 24 | 27 | 19 | 25 | 18 | 15 | 13 | 17 | 23 | 17 | 15 | 22 |
| 20 | 29 | 23 | 25 | 28 | 20 | 27 | 18 | 15 | 13 | 17 | 23 | 18 | 15 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 85.7% | 44.4% | 22.2% | 60.0% | 28.6% | 62.5% | 58.3% | 88.9% | 78.6% | 55.6% | 50.0% | 58.3% | 42.9% |
| Asesino | 14.3% | 50.0% | 50.0% | 18.8% | 33.3% | 17.6% | 27.3% | 69.2% | 0.0% | 83.3% | 11.1% | 28.6% | 60.0% | 50.0% |
| Esquivo | 55.6% | 50.0% | 50.0% | 58.3% | 50.0% | 53.8% | 44.4% | 83.3% | 66.7% | 57.1% | 50.0% | 80.0% | 33.3% | 100.0% |
| Equilibrado | 77.8% | 81.3% | 41.7% | 50.0% | 50.0% | 55.6% | 57.1% | 66.7% | 66.7% | 57.1% | 40.0% | 45.5% | 20.0% | 50.0% |
| Extremista ATK | 40.0% | 66.7% | 50.0% | 50.0% | 50.0% | 18.2% | 33.3% | 66.7% | 7.1% | 42.9% | 46.2% | 44.4% | 60.0% | 50.0% |
| Extremista DEF | 71.4% | 82.4% | 46.2% | 44.4% | 81.8% | 50.0% | 76.9% | 80.0% | 42.9% | 88.9% | 25.0% | 54.5% | 46.2% | 81.8% |
| Extremista ASPD | 37.5% | 72.7% | 55.6% | 42.9% | 66.7% | 23.1% | 50.0% | 37.5% | 30.0% | 66.7% | 14.3% | 37.5% | 38.5% | 75.0% |
| Extremista REF | 41.7% | 30.8% | 16.7% | 33.3% | 33.3% | 20.0% | 62.5% | 50.0% | 63.6% | 60.0% | 27.3% | 37.5% | 35.7% | 66.7% |
| Velocista | 11.1% | 100.0% | 33.3% | 33.3% | 92.9% | 57.1% | 70.0% | 36.4% | 50.0% | 72.7% | 40.0% | 61.5% | 64.3% | 76.9% |
| Berserker | 21.4% | 16.7% | 42.9% | 42.9% | 57.1% | 11.1% | 33.3% | 40.0% | 27.3% | 50.0% | 25.0% | 33.3% | 30.8% | 38.5% |
| Guardian | 44.4% | 88.9% | 50.0% | 60.0% | 53.8% | 75.0% | 85.7% | 72.7% | 60.0% | 75.0% | 50.0% | 60.0% | 73.3% | 92.9% |
| Estratega | 50.0% | 71.4% | 20.0% | 54.5% | 55.6% | 45.5% | 62.5% | 62.5% | 38.5% | 66.7% | 40.0% | 50.0% | 37.5% | 50.0% |
| Gladiador | 41.7% | 40.0% | 66.7% | 80.0% | 40.0% | 53.8% | 61.5% | 64.3% | 35.7% | 69.2% | 26.7% | 62.5% | 50.0% | 57.1% |
| Magus | 57.1% | 50.0% | 0.0% | 50.0% | 50.0% | 18.2% | 25.0% | 33.3% | 23.1% | 61.5% | 7.1% | 50.0% | 42.9% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 343 |
| 16-30 | 56.5% | 513 |
| 31-50 | 54.4% | 366 |
| 51-70 | 44.0% | 209 |
| 71-100 | 46.6% | 569 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 25.9% | 27 |
| 16-30 | 36.0% | 464 |
| 31-50 | 45.2% | 703 |
| 51-70 | 55.9% | 295 |
| 71-100 | 67.1% | 511 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 230 |
| 16-30 | 45.8% | 445 |
| 31-50 | 47.9% | 388 |
| 51-70 | 54.5% | 246 |
| 71-100 | 51.7% | 691 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 479 |
| 16-30 | 40.7% | 509 |
| 31-50 | 53.5% | 372 |
| 51-70 | 57.9% | 214 |
| 71-100 | 59.9% | 426 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.0% | 830 |
| 16-30 | 42.2% | 507 |
| 31-50 | 43.5% | 315 |
| 51-70 | 79.7% | 148 |
| 71-100 | 74.5% | 200 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 1616 |
| 16-30 | 44.3% | 230 |
| 31-50 | 54.4% | 114 |
| 51-70 | 34.3% | 35 |
| 71-100 | 40.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 1618 |
| 16-30 | 48.5% | 229 |
| 31-50 | 49.1% | 114 |
| 51-70 | 27.0% | 37 |
| 71-100 | 0.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 1619 |
| 16-30 | 46.7% | 229 |
| 31-50 | 48.2% | 112 |
| 51-70 | 34.2% | 38 |
| 71-100 | 50.0% | 2 |
