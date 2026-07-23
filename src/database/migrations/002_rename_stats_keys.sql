-- Migración: Renombrar claves de stats en JSONB
-- str → atk, spd_atk → aspd, spd_mov → mspd
-- Ejecutar SOLO si hay personajes con claves viejas

UPDATE characters
SET stats =
  COALESCE(stats, '{}'::jsonb)
  - 'str'
  - 'spd_atk'
  - 'spd_mov'
  ||
  CASE WHEN stats ? 'str'     THEN jsonb_build_object('atk',  stats->'str')     ELSE '{}'::jsonb END
  ||
  CASE WHEN stats ? 'spd_atk' THEN jsonb_build_object('aspd', stats->'spd_atk') ELSE '{}'::jsonb END
  ||
  CASE WHEN stats ? 'spd_mov' THEN jsonb_build_object('mspd', stats->'spd_mov') ELSE '{}'::jsonb END
WHERE stats ? 'str' OR stats ? 'spd_atk' OR stats ? 'spd_mov';
