# Test de Repertorio en el Spell Lab

- Foco: Varita de Caoba (tier D)
- Resultado: 61/62 checks OK

## Smoke de combate (espejos mago, bateria de control = 60)

| patron | hechizo | casteos/combate | dilucion | meditaciones | dano total | winrate | timeouts |
|--------|---------|-----------------|----------|--------------|------------|---------|----------|
| directo | `directo_fuego_E` | 4 | 0 | 0 | 1121 | 60% | 0 |
| directo | `directo_hielo_D` | 3.3 | 0 | 0 | 1041 | 40% | 0 |
| directo | `directo_electro_C` | 6.3 | 0.22 | 95 | 1640 | 70% | 0 |
| area | `area_fuego_D` | 4.75 | 0 | 0 | 1313 | 50% | 0 |
| area | `area_hielo_C` | 3.85 | 0 | 0 | 1097 | 60% | 0 |
| control-debuff | `control_debuffo_oscuridad_D` | 3.65 | 0 | 0 | 1093 | 30% | 0 |
| control-buff | `control_buffo_electro_D` | 3.1 | 0 | 0 | 909 | 50% | 0 |
| multi-hit | `multihit_doom_legacy` | 3.05 | 0 | 0 | 940 | 40% | 0 |

## FALLOS (si los hay)

- sin dilucion directo_electro_C: dilucion=0.22
