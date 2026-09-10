# Combat Simulation Report
Generated: 2026-08-06 14:16:16 | 50 simulations | Max 20 rounds

Config: numSims=50

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.1 | FAIL |
| Winrate de la build meta (max por personalidad) | 0.6 | 1.0 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 50 |
| KO victories | 50 (100.0%) |
| Timeouts (draws) | 0 (0.0%) |
| Avg rounds (all) | 6.6 |
| Avg rounds (KO only) | 6.6 |
| Rounds P50 / P90 / Max | 5 / 12 / 20 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 7 |
| Avg rounds | 10.1 |
| P50 / P90 | 11 / 20 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 30/50 |
| Winrate | 60.0% |
| Advantage over 50% | 10.0% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 3 | 5 | 60.0% |  |
| Asesino | 4 | 9 | 44.4% |  |
| Esquivo | 7 | 9 | 77.8% |  |
| Equilibrado | 6 | 11 | 54.5% |  |
| Extremista ATK | 1 | 6 | 16.7% |  |
| Extremista DEF | 5 | 10 | 50.0% |  |
| Extremista ASPD | 3 | 11 | 27.3% |  |
| Extremista REF | 6 | 8 | 75.0% |  |
| Velocista | 1 | 5 | 20.0% |  |
| Berserker | 2 | 6 | 33.3% |  |
| Guardian | 2 | 5 | 40.0% |  |
| Estratega | 5 | 6 | 83.3% |  |
| Gladiador | 4 | 8 | 50.0% |  |
| Magus | 1 | 1 | 100.0% | YES |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 2.0 | 2 |
| Heal applied | 94.2 | - |
| Rests | 1.0 | 0 |
| Advances | 1.9 | - |
| Retreats | 0.0 | - |
| Battles with item use | 76.0% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 30.28 (avg 45.07) |
| ASPD spread (stddev) | 30.94 (avg 51.14) |
| Equipment tier A | 1 (1.0%) |
| Equipment tier B | 50 (50.0%) |
| Equipment tier C | 15 (15.0%) |
| Equipment tier D | 28 (28.0%) |
| Equipment tier S | 6 (6.0%) |
| Level 100-199 | 25 |
| Level 200-299 | 28 |
| Level 300-399 | 24 |
| Level 400-500 | 23 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| perforante | 100 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 39 | 51.3% |
| media | 3 | 33.3% |
| total | 58 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 3 | 33.3% |
| 3+ | 97 | 50.5% |
Set bonus active: 50.5% (97) vs inactive 33.3% (3)

### Amulet
With amulet: 46.3% (41) vs without 52.5% (59)

### Shield
With shield: 50.9% (57) vs without 48.8% (43)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 1 | 100.0% |
| B | 50 | 62.0% |
| C | 15 | 33.3% |
| D | 28 | 25.0% |
| S | 6 | 100.0% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 24 | 50.0% |
| adamantita | 2 | 100.0% |
| bronce | 19 | 42.1% |
| filo_estelar | 4 | 100.0% |
| hierro | 21 | 14.3% |
| mitril | 18 | 77.8% |
| titanio | 12 | 58.3% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 30 | 70.0% |
| mitico | 6 | 100.0% |
| poco_comun | 64 | 35.9% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 20 | 55.0% |
| adamantita | 7 | 85.7% |
| bronce | 19 | 57.9% |
| filo_estelar | 4 | 25.0% |
| hierro | 25 | 28.0% |
| mitril | 13 | 46.2% |
| titanio | 12 | 66.7% |

### Nature by level bracket
- **100-199**: perforante: 25
- **200-299**: perforante: 28
- **300-399**: perforante: 24
- **400-500**: perforante: 23

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 39.3% | 28 | 54.2% | 72 | -14.9pp |
| d_fulgor | 33.3% | 27 | 56.2% | 73 | -22.8pp |
| r_fulgor | 34.6% | 26 | 55.4% | 74 | -20.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 15.2 | 7 | 27 | 7 | 14 | 20 |
| Asesino | 30.1 | 9 | 51 | 24 | 27 | 43 |
| Esquivo | 28.7 | 15 | 51 | 18 | 23 | 43 |
| Equilibrado | 30.5 | 11 | 55 | 12 | 29 | 46 |
| Extremista ATK | 47.2 | 9 | 177 | 15 | 15 | 51 |
| Extremista DEF | 39.4 | 9 | 133 | 14 | 38 | 43 |
| Extremista ASPD | 34.8 | 15 | 64 | 17 | 25 | 55 |
| Extremista REF | 23.4 | 8 | 150 | 12 | 13 | 27 |
| Velocista | 31.9 | 15 | 55 | 15 | 23 | 55 |
| Berserker | 37.6 | 12 | 150 | 12 | 13 | 36 |
| Guardian | 27.7 | 8 | 60 | 9 | 26 | 41 |
| Estratega | 30.0 | 10 | 83 | 17 | 20 | 41 |
| Gladiador | 39.3 | 9 | 177 | 18 | 49 | 55 |
| Magus | 55.0 | 55 | 55 | 55 | 55 | 55 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 0 | 34 | 0.0% |
| Asesino | 1 | 20 | 5.0% |
| Esquivo | 17 | 38 | 44.7% |
| Equilibrado | 31 | 43 | 72.1% |
| Extremista ATK | 0 | 19 | 0.0% |
| Extremista DEF | 16 | 58 | 27.6% |
| Extremista ASPD | 0 | 45 | 0.0% |
| Extremista REF | 38 | 38 | 100.0% |
| Velocista | 12 | 25 | 48.0% |
| Berserker | 3 | 17 | 17.6% |
| Guardian | 3 | 35 | 8.6% |
| Estratega | 16 | 22 | 72.7% |
| Gladiador | 30 | 36 | 83.3% |
| Magus | 0 | 4 | 0.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 7 | 2 | 9 | 4 | 2 | 7 | 4 | 2 | 7 | 10 | 5 | 4 | 14 |
| 5 | 17 | 11 | 5 | 9 | 13 | 5 | 12 | 3 | 5 | 10 | 15 | 7 | 7 | 8 |
| 10 | 28 | 12 | 18 | 18 | 12 | 8 | 12 | 7 | 4 | 7 | 46 | 9 | 11 | 8 |
| 15 | 23 | 12 | 18 | 18 | 12 | 9 | 13 | 7 | 4 | 7 | 48 | 11 | 8 | 8 |
| 20 | 23 | 12 | 18 | 18 | 12 | 9 | 13 | 8 | 4 | 7 | 55 | 10 | 10 | 8 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 0.0% | 0.0% | 0.0% | 0.0% | 50.0% | 0.0% | 100.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Asesino | 0.0% | 0.0% | 0.0% | 100.0% | 100.0% | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Esquivo | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 100.0% | 50.0% | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Equilibrado | 0.0% | 0.0% | 100.0% | 0.0% | 100.0% | 50.0% | 100.0% | 0.0% | 0.0% | 50.0% | 100.0% | 0.0% | 0.0% | 0.0% |
| Extremista ATK | 50.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Extremista DEF | 0.0% | 100.0% | 0.0% | 50.0% | 0.0% | 50.0% | 0.0% | 0.0% | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Extremista ASPD | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% |
| Extremista REF | 100.0% | 100.0% | 50.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% |
| Velocista | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Berserker | 0.0% | 0.0% | 0.0% | 50.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| Guardian | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 50.0% | 0.0% |
| Estratega | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 0.0% | 100.0% | 0.0% |
| Gladiador | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% |
| Magus | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.8% | 13 |
| 16-30 | 48.5% | 33 |
| 31-50 | 68.4% | 19 |
| 51-70 | 54.5% | 11 |
| 71-100 | 33.3% | 24 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 100.0% | 1 |
| 16-30 | 41.7% | 24 |
| 31-50 | 41.7% | 36 |
| 51-70 | 61.5% | 13 |
| 71-100 | 61.5% | 26 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.9% | 14 |
| 16-30 | 50.0% | 18 |
| 31-50 | 64.0% | 25 |
| 51-70 | 36.4% | 11 |
| 71-100 | 46.9% | 32 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 25.0% | 24 |
| 16-30 | 50.0% | 22 |
| 31-50 | 40.0% | 20 |
| 51-70 | 66.7% | 9 |
| 71-100 | 76.0% | 25 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.7% | 45 |
| 16-30 | 47.4% | 19 |
| 31-50 | 63.2% | 19 |
| 51-70 | 50.0% | 10 |
| 71-100 | 42.9% | 7 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 54.7% | 75 |
| 16-30 | 35.3% | 17 |
| 31-50 | 33.3% | 6 |
| 51-70 | 50.0% | 2 |
| 71-100 | 0.0% | 0 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 55.1% | 78 |
| 16-30 | 35.7% | 14 |
| 31-50 | 0.0% | 4 |
| 51-70 | 33.3% | 3 |
| 71-100 | 100.0% | 1 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.9% | 76 |
| 16-30 | 35.3% | 17 |
| 31-50 | 25.0% | 4 |
| 51-70 | 66.7% | 3 |
| 71-100 | 0.0% | 0 |
