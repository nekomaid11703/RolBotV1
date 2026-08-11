# Combat Simulation Report
Generated: 2026-08-07 19:00:56 | 5000 simulations | Max 20 rounds

Config: numSims=5000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.0 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 5000 |
| KO victories | 4870 (97.4%) |
| Timeouts (draws) | 130 (2.6%) |
| Avg rounds (all) | 6.4 |
| Avg rounds (KO only) | 6.0 |
| Rounds P50 / P90 / Max | 5 / 12 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 570 |
| Avg rounds | 7.0 |
| P50 / P90 | 5 / 13 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 2436/5000 |
| Winrate | 48.7% |
| Advantage over 50% | -1.3% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 533 | 837 | 63.7% | YES |
| Extremista ATK | 434 | 852 | 50.9% |  |
| Extremista DEF | 553 | 875 | 63.2% |  |
| Extremista ASPD | 377 | 796 | 47.4% |  |
| Extremista REF | 397 | 825 | 48.1% |  |
| Berserker | 374 | 838 | 44.6% |  |
| Guardian | 412 | 803 | 51.3% |  |
| Estratega | 452 | 842 | 53.7% |  |
| Gladiador | 427 | 813 | 52.5% |  |
| Magus | 274 | 846 | 32.4% |  |
| Matatanques | 397 | 840 | 47.3% |  |
| Rompescudos | 370 | 833 | 44.4% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.7 | 0 |
| Heal applied | 34.0 | - |
| Rests | 3.3 | 3 |
| Advances | 4.9 | - |
| Retreats | 0.8 | - |
| Battles with item use | 31.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.1% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 33.44 (avg 54.69) |
| ASPD spread (stddev) | 31.69 (avg 55.12) |
| Equipment tier A | 369 (3.7%) |
| Equipment tier B | 4080 (40.8%) |
| Equipment tier C | 1687 (16.9%) |
| Equipment tier D | 2918 (29.2%) |
| Equipment tier S | 946 (9.5%) |
| Level 100-199 | 2436 |
| Level 200-299 | 2797 |
| Level 300-399 | 2443 |
| Level 400-500 | 2324 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 2206 |
| cortante | 2271 |
| desarmado | 994 |
| perforante | 4529 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 3269 | 47.9% |
| ligera | 40 | 45.0% |
| media | 347 | 45.8% |
| total | 6344 | 51.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 235 | 45.1% |
| 3+ | 9765 | 50.1% |
Set bonus active: 50.1% (9765) vs inactive 45.1% (235)

### Amulet
With amulet: 52.2% (3995) vs without 48.5% (6005)

### Shield
With shield: 49.7% (5952) vs without 50.4% (4048)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 335 | 69.3% |
| B | 3672 | 56.4% |
| C | 1550 | 44.3% |
| D | 2616 | 41.1% |
| S | 833 | 75.4% |
| desarmado | 994 | 31.1% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 1985 | 49.3% |
| adamantita | 428 | 75.2% |
| bronce | 2050 | 40.4% |
| desarmado | 994 | 31.1% |
| filo_estelar | 405 | 75.6% |
| hierro | 1940 | 45.7% |
| mitril | 1099 | 63.6% |
| titanio | 1099 | 61.1% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 2198 | 62.3% |
| mitico | 833 | 75.4% |
| ninguno | 994 | 31.1% |
| poco_comun | 5975 | 45.1% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 2179 | 50.2% |
| adamantita | 473 | 51.2% |
| bronce | 2212 | 50.4% |
| filo_estelar | 448 | 52.5% |
| hierro | 2281 | 48.8% |
| mitril | 1169 | 50.5% |
| ninguno | 2 | 50.0% |
| titanio | 1236 | 49.5% |

### Nature by level bracket
- **100-199**: contundente: 550, cortante: 536, desarmado: 234, perforante: 1116
- **200-299**: contundente: 627, cortante: 642, desarmado: 255, perforante: 1273
- **300-399**: contundente: 546, cortante: 576, desarmado: 254, perforante: 1067
- **400-500**: contundente: 483, cortante: 517, desarmado: 251, perforante: 1073

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 47.7% | 2443 | 50.7% | 7557 | -3.1pp |
| d_fulgor | 47.5% | 2415 | 50.8% | 7585 | -3.2pp |
| r_fulgor | 48.0% | 2425 | 50.6% | 7575 | -2.6pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 26.9 | 1 | 135 | 13 | 23 | 36 |
| Extremista ATK | 61.3 | 1 | 179 | 35 | 63 | 85 |
| Extremista DEF | 24.9 | 0 | 138 | 13 | 22 | 33 |
| Extremista ASPD | 48.2 | 1 | 178 | 21 | 43 | 73 |
| Extremista REF | 32.3 | 1 | 148 | 14 | 28 | 45 |
| Berserker | 57.3 | 1 | 183 | 25 | 55 | 82 |
| Guardian | 24.5 | 1 | 134 | 12 | 23 | 31 |
| Estratega | 32.5 | 1 | 156 | 14 | 28 | 44 |
| Gladiador | 51.6 | 1 | 177 | 24 | 48 | 75 |
| Magus | 42.3 | 1 | 153 | 15 | 36 | 64 |
| Matatanques | 46.5 | 1 | 163 | 15 | 42 | 71 |
| Rompescudos | 53.0 | 1 | 181 | 23 | 50 | 78 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 8 | 8 | 100.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |
| Matatanques | 0 | 0 | 0.0% |
| Rompescudos | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 386 | 3214 | 12.0% |
| Extremista ATK | 384 | 2366 | 16.2% |
| Extremista DEF | 964 | 3519 | 27.4% |
| Extremista ASPD | 303 | 2125 | 14.3% |
| Extremista REF | 1991 | 2693 | 73.9% |
| Berserker | 369 | 2081 | 17.7% |
| Guardian | 629 | 3799 | 16.6% |
| Estratega | 1658 | 2487 | 66.7% |
| Gladiador | 789 | 1960 | 40.3% |
| Magus | 681 | 2461 | 27.7% |
| Matatanques | 298 | 2780 | 10.7% |
| Rompescudos | 869 | 2372 | 36.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Berserker | Guardian | Estratega | Gladiador | Magus | Matatanques | Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 14 | 15 | 14 | 12 | 13 | 41 | 14 | 11 | 26 | 27 | 14 |
| 5 | 39 | 23 | 28 | 23 | 19 | 22 | 54 | 22 | 22 | 33 | 36 | 22 |
| 10 | 41 | 23 | 32 | 23 | 17 | 22 | 54 | 22 | 22 | 32 | 36 | 22 |
| 15 | 41 | 24 | 32 | 23 | 17 | 23 | 54 | 22 | 22 | 32 | 36 | 22 |
| 20 | 41 | 24 | 33 | 23 | 17 | 23 | 54 | 22 | 22 | 32 | 36 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus | vs Matatanques | vs Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 62.7% | 50.7% | 70.2% | 57.7% | 78.0% | 67.6% | 54.8% | 59.7% | 78.9% | 68.0% | 69.9% |
| Extremista ATK | 37.3% | 50.0% | 33.8% | 52.8% | 52.6% | 54.0% | 36.8% | 46.1% | 52.9% | 74.7% | 56.5% | 58.3% |
| Extremista DEF | 49.3% | 66.2% | 50.0% | 64.1% | 62.7% | 74.7% | 58.2% | 57.8% | 60.9% | 77.5% | 69.9% | 66.7% |
| Extremista ASPD | 29.8% | 47.2% | 35.9% | 50.0% | 55.7% | 47.9% | 39.2% | 50.7% | 42.6% | 69.1% | 46.0% | 52.5% |
| Extremista REF | 42.3% | 47.4% | 37.3% | 44.3% | 50.0% | 43.1% | 46.8% | 45.1% | 43.1% | 70.0% | 50.0% | 57.1% |
| Berserker | 22.0% | 46.0% | 25.3% | 52.1% | 56.9% | 50.0% | 45.1% | 38.5% | 41.1% | 61.8% | 49.4% | 51.9% |
| Guardian | 32.4% | 63.2% | 41.8% | 60.8% | 53.2% | 54.9% | 50.0% | 42.6% | 41.2% | 66.7% | 48.2% | 58.8% |
| Estratega | 45.2% | 53.9% | 42.2% | 49.3% | 54.9% | 61.5% | 57.4% | 50.0% | 43.8% | 72.9% | 46.9% | 64.6% |
| Gladiador | 40.3% | 47.1% | 39.1% | 57.4% | 56.9% | 58.9% | 58.8% | 56.2% | 50.0% | 57.3% | 59.4% | 50.0% |
| Magus | 21.1% | 25.3% | 22.5% | 30.9% | 30.0% | 38.2% | 33.3% | 27.1% | 42.7% | 50.0% | 38.9% | 30.1% |
| Matatanques | 32.0% | 43.5% | 30.1% | 54.0% | 50.0% | 50.6% | 51.8% | 53.1% | 40.6% | 61.1% | 50.0% | 52.0% |
| Rompescudos | 30.1% | 41.7% | 33.3% | 47.5% | 42.9% | 48.1% | 41.2% | 35.4% | 50.0% | 69.9% | 48.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.6% | 1398 |
| 16-30 | 53.0% | 2032 |
| 31-50 | 48.2% | 1642 |
| 51-70 | 44.4% | 1083 |
| 71-100 | 49.8% | 3845 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 32.2% | 87 |
| 16-30 | 37.8% | 2312 |
| 31-50 | 48.2% | 3902 |
| 51-70 | 57.5% | 1344 |
| 71-100 | 61.2% | 2355 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.4% | 1243 |
| 16-30 | 49.9% | 1870 |
| 31-50 | 45.4% | 1713 |
| 51-70 | 45.0% | 1302 |
| 71-100 | 52.0% | 3872 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.2% | 2612 |
| 16-30 | 48.0% | 2571 |
| 31-50 | 49.4% | 1775 |
| 51-70 | 50.0% | 1049 |
| 71-100 | 55.4% | 1993 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.8% | 5179 |
| 16-30 | 48.9% | 3099 |
| 31-50 | 54.4% | 1274 |
| 51-70 | 49.5% | 321 |
| 71-100 | 43.3% | 127 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 8072 |
| 16-30 | 47.0% | 1088 |
| 31-50 | 49.9% | 639 |
| 51-70 | 46.4% | 183 |
| 71-100 | 50.0% | 18 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 8093 |
| 16-30 | 47.1% | 1075 |
| 31-50 | 46.9% | 629 |
| 51-70 | 56.3% | 190 |
| 71-100 | 46.2% | 13 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 8064 |
| 16-30 | 46.9% | 1111 |
| 31-50 | 49.8% | 639 |
| 51-70 | 50.3% | 167 |
| 71-100 | 57.9% | 19 |
