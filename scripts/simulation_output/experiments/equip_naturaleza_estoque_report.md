# Combat Simulation Report
Generated: 2026-08-05 02:26:19 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 980 (98.0%) |
| Timeouts (draws) | 20 (2.0%) |
| Avg rounds (all) | 8.9 |
| Avg rounds (KO only) | 8.1 |
| Rounds P50 / P90 / Max | 6 / 19 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 163 |
| Avg rounds | 10.8 |
| P50 / P90 | 7 / 25 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 528/1000 |
| Winrate | 52.8% |
| Advantage over 50% | 2.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 87 | 147 | 59.2% |  |
| Asesino | 46 | 130 | 35.4% |  |
| Esquivo | 86 | 144 | 59.7% |  |
| Equilibrado | 65 | 138 | 47.1% |  |
| Extremista ATK | 43 | 152 | 28.3% |  |
| Extremista DEF | 97 | 150 | 64.7% |  |
| Extremista ASPD | 52 | 135 | 38.5% |  |
| Extremista REF | 67 | 148 | 45.3% |  |
| Velocista | 110 | 160 | 68.8% | YES |
| Berserker | 52 | 140 | 37.1% |  |
| Guardian | 86 | 128 | 67.2% |  |
| Estratega | 87 | 140 | 62.1% |  |
| Gladiador | 66 | 143 | 46.2% |  |
| Magus | 56 | 145 | 38.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.4 | 1 |
| Heal applied | 80.0 | - |
| Rests | 4.5 | 2 |
| Advances | 4.2 | - |
| Retreats | 0.1 | - |
| Battles with item use | 50.6% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.53 (avg 46.92) |
| ASPD spread (stddev) | 30.99 (avg 53.17) |
| Equipment tier A | 257 (12.8%) |
| Equipment tier B | 377 (18.9%) |
| Equipment tier C | 555 (27.8%) |
| Equipment tier E | 811 (40.6%) |
| Level 100-199 | 455 |
| Level 200-299 | 627 |
| Level 300-399 | 469 |
| Level 400-500 | 449 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| perforante | 2000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 630 | 50.5% |
| ligera | 11 | 45.5% |
| media | 70 | 41.4% |
| total | 1289 | 50.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 50 | 30.0% |
| 3+ | 1950 | 50.5% |
Set bonus active: 50.5% (1950) vs inactive 30.0% (50)

### Amulet
With amulet: 49.1% (814) vs without 50.6% (1186)

### Shield
With shield: 50.4% (1196) vs without 49.4% (804)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 257 | 69.3% |
| B | 377 | 61.3% |
| C | 555 | 51.4% |
| E | 811 | 37.7% |

### Nature by level bracket
- **100-199**: perforante: 455
- **200-299**: perforante: 627
- **300-399**: perforante: 469
- **400-500**: perforante: 449

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.7% | 501 | 51.4% | 1499 | -5.7pp |
| d_fulgor | 45.7% | 495 | 51.4% | 1505 | -5.8pp |
| r_fulgor | 46.0% | 507 | 51.4% | 1493 | -5.4pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.6 | 0 | 128 | 0 | 19 | 35 |
| Asesino | 53.0 | 0 | 128 | 19 | 46 | 84 |
| Esquivo | 22.9 | 0 | 128 | 0 | 14 | 19 |
| Equilibrado | 39.4 | 0 | 128 | 19 | 19 | 46 |
| Extremista ATK | 42.0 | 0 | 128 | 19 | 19 | 46 |
| Extremista DEF | 12.5 | 0 | 128 | 0 | 0 | 14 |
| Extremista ASPD | 47.1 | 14 | 128 | 19 | 46 | 46 |
| Extremista REF | 36.6 | 0 | 128 | 19 | 19 | 46 |
| Velocista | 41.5 | 0 | 128 | 19 | 19 | 46 |
| Berserker | 50.7 | 14 | 128 | 19 | 46 | 84 |
| Guardian | 21.0 | 0 | 128 | 0 | 14 | 35 |
| Estratega | 39.6 | 14 | 128 | 19 | 19 | 46 |
| Gladiador | 41.0 | 14 | 128 | 19 | 19 | 46 |
| Magus | 38.8 | 14 | 128 | 19 | 19 | 46 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 27 | 27 | 100.0% |
| Asesino | 170 | 170 | 100.0% |
| Esquivo | 1017 | 1017 | 100.0% |
| Equilibrado | 470 | 470 | 100.0% |
| Extremista ATK | 64 | 64 | 100.0% |
| Extremista DEF | 33 | 33 | 100.0% |
| Extremista ASPD | 97 | 97 | 100.0% |
| Extremista REF | 154 | 154 | 100.0% |
| Velocista | 216 | 216 | 100.0% |
| Berserker | 70 | 70 | 100.0% |
| Guardian | 90 | 90 | 100.0% |
| Estratega | 135 | 135 | 100.0% |
| Gladiador | 353 | 353 | 100.0% |
| Magus | 245 | 245 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 14 | 869 | 1.6% |
| Asesino | 9 | 589 | 1.5% |
| Esquivo | 177 | 1360 | 13.0% |
| Equilibrado | 5 | 953 | 0.5% |
| Extremista ATK | 75 | 737 | 10.2% |
| Extremista DEF | 99 | 770 | 12.9% |
| Extremista ASPD | 27 | 654 | 4.1% |
| Extremista REF | 501 | 892 | 56.2% |
| Velocista | 0 | 464 | 0.0% |
| Berserker | 21 | 621 | 3.4% |
| Guardian | 0 | 683 | 0.0% |
| Estratega | 509 | 825 | 61.7% |
| Gladiador | 184 | 850 | 21.6% |
| Magus | 110 | 733 | 15.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 14 | 14 | 18 | 10 | 9 | 10 | 11 | 4 | 9 | 13 | 12 | 9 | 14 |
| 5 | 24 | 21 | 18 | 23 | 18 | 18 | 17 | 15 | 9 | 17 | 21 | 16 | 16 | 21 |
| 10 | 26 | 21 | 19 | 25 | 19 | 23 | 17 | 14 | 11 | 17 | 23 | 16 | 17 | 20 |
| 15 | 27 | 21 | 20 | 25 | 19 | 25 | 17 | 14 | 11 | 17 | 24 | 16 | 17 | 20 |
| 20 | 27 | 21 | 21 | 25 | 19 | 26 | 17 | 14 | 10 | 17 | 24 | 16 | 18 | 21 |
| 25 | 27 | 21 | 22 | 25 | 19 | 26 | 17 | 14 | 10 | 17 | 23 | 16 | 18 | 21 |
| 30 | 27 | 22 | 23 | 26 | 19 | 26 | 17 | 14 | 10 | 17 | 23 | 16 | 18 | 21 |
| 40 | 27 | 22 | 24 | 26 | 19 | 25 | 17 | 14 | 10 | 17 | 23 | 16 | 18 | 21 |
| 50 | 27 | 22 | 26 | 26 | 19 | 25 | 17 | 14 | 10 | 17 | 22 | 16 | 19 | 21 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 20.0% | 11.1% | 50.0% | 83.3% | 54.5% | 88.9% | 66.7% | 72.7% | 77.8% | 50.0% | 33.3% | 58.3% | 84.6% |
| Asesino | 80.0% | 50.0% | 20.0% | 42.9% | 66.7% | 8.3% | 50.0% | 30.8% | 17.6% | 27.3% | 33.3% | 33.3% | 44.4% | 45.5% |
| Esquivo | 88.9% | 80.0% | 50.0% | 70.0% | 81.8% | 40.0% | 42.9% | 100.0% | 36.4% | 50.0% | 44.4% | 66.7% | 53.8% | 60.0% |
| Equilibrado | 50.0% | 57.1% | 30.0% | 50.0% | 77.8% | 54.5% | 66.7% | 44.4% | 50.0% | 50.0% | 16.7% | 30.8% | 28.6% | 60.0% |
| Extremista ATK | 16.7% | 33.3% | 18.2% | 22.2% | 50.0% | 0.0% | 46.2% | 50.0% | 11.1% | 50.0% | 16.7% | 22.2% | 9.1% | 40.0% |
| Extremista DEF | 45.5% | 91.7% | 60.0% | 45.5% | 100.0% | 50.0% | 76.9% | 76.9% | 22.2% | 88.9% | 41.7% | 55.6% | 81.8% | 66.7% |
| Extremista ASPD | 11.1% | 50.0% | 57.1% | 33.3% | 53.8% | 23.1% | 50.0% | 54.5% | 18.2% | 50.0% | 12.5% | 9.1% | 71.4% | 57.1% |
| Extremista REF | 33.3% | 69.2% | 0.0% | 55.6% | 50.0% | 23.1% | 45.5% | 50.0% | 23.1% | 50.0% | 66.7% | 42.9% | 62.5% | 66.7% |
| Velocista | 27.3% | 82.4% | 63.6% | 50.0% | 88.9% | 77.8% | 81.8% | 76.9% | 50.0% | 83.3% | 57.1% | 41.7% | 83.3% | 66.7% |
| Berserker | 22.2% | 72.7% | 50.0% | 50.0% | 50.0% | 11.1% | 50.0% | 50.0% | 16.7% | 50.0% | 9.1% | 45.5% | 10.0% | 33.3% |
| Guardian | 50.0% | 66.7% | 55.6% | 83.3% | 83.3% | 58.3% | 87.5% | 33.3% | 42.9% | 90.9% | 50.0% | 53.3% | 83.3% | 72.7% |
| Estratega | 66.7% | 66.7% | 33.3% | 69.2% | 77.8% | 44.4% | 90.9% | 57.1% | 58.3% | 54.5% | 46.7% | 50.0% | 70.0% | 77.8% |
| Gladiador | 41.7% | 55.6% | 46.2% | 71.4% | 90.9% | 18.2% | 28.6% | 37.5% | 16.7% | 90.0% | 16.7% | 30.0% | 50.0% | 61.5% |
| Magus | 15.4% | 54.5% | 40.0% | 40.0% | 60.0% | 33.3% | 42.9% | 33.3% | 33.3% | 66.7% | 27.3% | 22.2% | 38.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 54.1% | 327 |
| 16-30 | 54.9% | 534 |
| 31-50 | 53.6% | 360 |
| 51-70 | 48.2% | 228 |
| 71-100 | 41.2% | 551 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 29.4% | 17 |
| 16-30 | 32.7% | 434 |
| 31-50 | 46.5% | 791 |
| 51-70 | 58.1% | 265 |
| 71-100 | 67.1% | 493 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 249 |
| 16-30 | 42.9% | 399 |
| 31-50 | 50.4% | 377 |
| 51-70 | 50.2% | 261 |
| 71-100 | 52.9% | 714 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 37.0% | 478 |
| 16-30 | 43.8% | 468 |
| 31-50 | 52.7% | 406 |
| 51-70 | 61.1% | 203 |
| 71-100 | 62.9% | 445 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.7% | 827 |
| 16-30 | 46.4% | 541 |
| 31-50 | 46.9% | 286 |
| 51-70 | 75.9% | 141 |
| 71-100 | 79.5% | 205 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 1607 |
| 16-30 | 43.8% | 219 |
| 31-50 | 51.1% | 139 |
| 51-70 | 38.2% | 34 |
| 71-100 | 0.0% | 1 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 1609 |
| 16-30 | 48.5% | 231 |
| 31-50 | 49.6% | 131 |
| 51-70 | 30.8% | 26 |
| 71-100 | 33.3% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 1599 |
| 16-30 | 44.4% | 232 |
| 31-50 | 48.9% | 139 |
| 51-70 | 41.4% | 29 |
| 71-100 | 100.0% | 1 |
