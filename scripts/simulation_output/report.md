# Combat Simulation Report
Generated: 2026-08-20 19:25:54 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.2 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1784 (89.2%) |
| Timeouts (draws) | 216 (10.8%) |
| Avg rounds (all) | 9.3 |
| Avg rounds (KO only) | 7.9 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 226 |
| Avg rounds | 10.2 |
| P50 / P90 | 8 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1022/2000 |
| Winrate | 51.1% |
| Advantage over 50% | 1.1% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 196 | 316 | 62.0% | YES |
| Extremista ATK | 153 | 337 | 45.4% |  |
| Extremista DEF | 197 | 334 | 59.0% |  |
| Extremista ASPD | 165 | 348 | 47.4% |  |
| Extremista REF | 167 | 331 | 50.5% |  |
| Berserker | 187 | 351 | 53.3% |  |
| Guardian | 209 | 350 | 59.7% |  |
| Estratega | 172 | 322 | 53.4% |  |
| Gladiador | 150 | 296 | 50.7% |  |
| Magus | 33 | 367 | 9.0% |  |
| Matatanques | 189 | 341 | 55.4% |  |
| Rompescudos | 180 | 307 | 58.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.5 | 1 |
| Heal applied | 71.1 | - |
| Rests | 3.3 | 2 |
| Advances | 3.5 | - |
| Retreats | 1.7 | - |
| Battles with item use | 71.4% | - |

## Magic Resource Use
| Metric | Value |
|--------|-------|
| Fulgor avg (start / spent / left) | 10.5 / 0.8 / 9.7 |
| Spell casts per fighter | 0.9 |
| Diluted casts per fighter / cast rate | 0.8 / 92.9% |
| Battles with spell casts | 16.8% |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 33.54 (avg 54.44) |
| ASPD spread (stddev) | 31.80 (avg 55.22) |
| Equipment tier A | 135 (3.4%) |
| Equipment tier B | 1663 (41.6%) |
| Equipment tier C | 670 (16.8%) |
| Equipment tier D | 1151 (28.8%) |
| Equipment tier S | 381 (9.5%) |
| Level 100-199 | 971 |
| Level 200-299 | 1121 |
| Level 300-399 | 984 |
| Level 400-500 | 924 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 813 |
| cortante | 752 |
| desarmado | 420 |
| mágico | 367 |
| perforante | 837 |
| proyectil | 811 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1295 | 48.0% |
| ligera | 13 | 23.1% |
| media | 131 | 55.0% |
| total | 2561 | 50.8% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 86 | 29.1% |
| 3+ | 3914 | 50.4% |
Set bonus active: 50.4% (3914) vs inactive 29.1% (86)

### Amulet
With amulet: 52.0% (1611) vs without 48.6% (2389)

### Shield
With shield: 51.5% (2410) vs without 47.7% (1590)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 107 | 73.8% |
| B | 1338 | 61.0% |
| C | 543 | 46.6% |
| D | 1288 | 35.6% |
| S | 304 | 74.0% |
| desarmado | 420 | 39.8% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 733 | 46.5% |
| adamantita | 149 | 79.2% |
| bronce | 665 | 58.3% |
| desarmado | 420 | 39.8% |
| filo_estelar | 155 | 69.0% |
| hierro | 741 | 47.9% |
| madera_caoba | 367 | 9.0% |
| mitril | 401 | 64.3% |
| titanio | 369 | 62.6% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 770 | 63.5% |
| mitico | 304 | 74.0% |
| ninguno | 420 | 39.8% |
| poco_comun | 2139 | 50.7% |
| raro | 367 | 9.0% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 852 | 52.6% |
| adamantita | 202 | 60.4% |
| bronce | 892 | 47.5% |
| filo_estelar | 185 | 58.4% |
| hierro | 894 | 43.8% |
| mitril | 479 | 49.3% |
| titanio | 496 | 54.0% |

### Nature by level bracket
- **100-199**: contundente: 206, cortante: 187, desarmado: 107, mágico: 102, perforante: 194, proyectil: 175
- **200-299**: contundente: 243, cortante: 182, desarmado: 113, mágico: 109, perforante: 210, proyectil: 264
- **300-399**: contundente: 191, cortante: 202, desarmado: 102, mágico: 73, perforante: 228, proyectil: 188
- **400-500**: contundente: 173, cortante: 181, desarmado: 98, mágico: 83, perforante: 205, proyectil: 184

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.7% | 951 | 52.5% | 3049 | -10.8pp |
| d_fulgor | 42.3% | 957 | 52.3% | 3043 | -10.0pp |
| r_fulgor | 42.2% | 959 | 52.4% | 3041 | -10.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 12.8 | 1 | 193 | 6 | 9 | 12 |
| Extremista ATK | 35.6 | 8 | 246 | 19 | 24 | 31 |
| Extremista DEF | 13.4 | 0 | 228 | 5 | 7 | 12 |
| Extremista ASPD | 29.1 | 3 | 207 | 14 | 20 | 29 |
| Extremista REF | 16.9 | 1 | 232 | 6 | 10 | 18 |
| Berserker | 38.9 | 8 | 274 | 21 | 27 | 33 |
| Guardian | 12.2 | 0 | 158 | 6 | 9 | 12 |
| Estratega | 17.9 | 1 | 218 | 8 | 11 | 17 |
| Gladiador | 31.1 | 2 | 231 | 15 | 21 | 29 |
| Magus | 1.6 | 1 | 16 | 1 | 1 | 1 |
| Matatanques | 30.5 | 5 | 289 | 14 | 21 | 28 |
| Rompescudos | 34.6 | 6 | 278 | 18 | 23 | 30 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 31 | 31 | 100.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 10 | 10 | 100.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 30 | 30 | 100.0% |
| Matatanques | 16 | 16 | 100.0% |
| Rompescudos | 1 | 1 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 366 | 2521 | 14.5% |
| Extremista ATK | 297 | 2051 | 14.5% |
| Extremista DEF | 551 | 2838 | 19.4% |
| Extremista ASPD | 264 | 2068 | 12.8% |
| Extremista REF | 2100 | 2414 | 87.0% |
| Berserker | 246 | 2017 | 12.2% |
| Guardian | 651 | 2910 | 22.4% |
| Estratega | 1482 | 2033 | 72.9% |
| Gladiador | 442 | 1456 | 30.4% |
| Magus | 1415 | 3799 | 37.2% |
| Matatanques | 259 | 2177 | 11.9% |
| Rompescudos | 649 | 1739 | 37.3% |

## Fatigue Progression (Avg)
| Turn | Tanque | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Berserker | Guardian | Estratega | Gladiador | Magus | Matatanques | Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 8 | 12 | 7 | 5 | 7 | 18 | 7 | 7 | 6 | 12 | 7 |
| 5 | 26 | 18 | 23 | 17 | 9 | 18 | 25 | 12 | 17 | 13 | 23 | 16 |
| 10 | 29 | 19 | 26 | 18 | 10 | 19 | 28 | 13 | 18 | 13 | 23 | 17 |
| 15 | 31 | 19 | 28 | 18 | 10 | 19 | 30 | 14 | 18 | 12 | 23 | 17 |
| 20 | 31 | 19 | 29 | 18 | 10 | 19 | 30 | 14 | 18 | 12 | 23 | 17 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus | vs Matatanques | vs Rompescudos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 73.5% | 40.0% | 47.6% | 67.7% | 67.7% | 35.3% | 57.1% | 68.4% | 100.0% | 64.3% | 54.8% |
| Extremista ATK | 26.5% | 50.0% | 35.5% | 41.7% | 37.5% | 28.6% | 36.7% | 39.1% | 59.1% | 94.6% | 34.4% | 55.0% |
| Extremista DEF | 60.0% | 64.5% | 50.0% | 62.1% | 58.1% | 52.0% | 48.6% | 58.1% | 40.9% | 100.0% | 54.2% | 33.3% |
| Extremista ASPD | 52.4% | 58.3% | 37.9% | 50.0% | 47.4% | 47.1% | 35.5% | 30.0% | 52.9% | 100.0% | 30.8% | 40.6% |
| Extremista REF | 32.3% | 62.5% | 41.9% | 52.6% | 50.0% | 57.7% | 45.8% | 40.0% | 57.1% | 83.9% | 38.5% | 42.9% |
| Berserker | 32.3% | 71.4% | 48.0% | 52.9% | 42.3% | 50.0% | 40.0% | 41.9% | 48.4% | 97.1% | 64.0% | 42.1% |
| Guardian | 64.7% | 63.3% | 48.6% | 64.5% | 54.2% | 60.0% | 50.0% | 53.6% | 43.8% | 100.0% | 56.7% | 38.5% |
| Estratega | 42.9% | 60.9% | 41.9% | 70.0% | 60.0% | 58.1% | 46.4% | 46.9% | 48.0% | 94.1% | 43.2% | 45.5% |
| Gladiador | 31.6% | 40.9% | 59.1% | 47.1% | 42.9% | 51.6% | 56.3% | 52.0% | 50.0% | 90.0% | 47.1% | 47.4% |
| Magus | 0.0% | 5.4% | 0.0% | 0.0% | 16.1% | 2.9% | 0.0% | 5.9% | 10.0% | 50.0% | 3.6% | 0.0% |
| Matatanques | 35.7% | 65.6% | 45.8% | 69.2% | 61.5% | 36.0% | 43.3% | 56.8% | 52.9% | 96.4% | 50.0% | 48.1% |
| Rompescudos | 45.2% | 45.0% | 66.7% | 59.4% | 57.1% | 57.9% | 61.5% | 54.5% | 52.6% | 100.0% | 51.9% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.3% | 547 |
| 16-30 | 51.8% | 855 |
| 31-50 | 51.0% | 645 |
| 51-70 | 44.4% | 426 |
| 71-100 | 51.3% | 1527 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 17.1% | 41 |
| 16-30 | 38.9% | 958 |
| 31-50 | 47.8% | 1528 |
| 51-70 | 56.6% | 511 |
| 71-100 | 62.3% | 962 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.4% | 477 |
| 16-30 | 50.3% | 797 |
| 31-50 | 48.4% | 649 |
| 51-70 | 47.7% | 505 |
| 71-100 | 51.6% | 1572 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.8% | 1047 |
| 16-30 | 46.5% | 1046 |
| 31-50 | 52.1% | 724 |
| 51-70 | 55.4% | 426 |
| 71-100 | 55.4% | 757 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 2088 |
| 16-30 | 49.9% | 1205 |
| 31-50 | 58.7% | 521 |
| 51-70 | 68.3% | 139 |
| 71-100 | 72.3% | 47 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 3236 |
| 16-30 | 39.8% | 430 |
| 31-50 | 44.5% | 247 |
| 51-70 | 48.7% | 78 |
| 71-100 | 55.6% | 9 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.5% | 3250 |
| 16-30 | 40.5% | 407 |
| 31-50 | 46.4% | 261 |
| 51-70 | 46.1% | 76 |
| 71-100 | 33.3% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 3242 |
| 16-30 | 40.3% | 422 |
| 31-50 | 44.1% | 247 |
| 51-70 | 47.6% | 84 |
| 71-100 | 40.0% | 5 |
