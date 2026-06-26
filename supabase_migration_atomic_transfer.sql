CREATE OR REPLACE FUNCTION transfer_money(
  from_phone TEXT,
  to_phone TEXT,
  amount BIGINT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  from_balance BIGINT;
  to_balance BIGINT;
BEGIN
  SELECT money INTO from_balance FROM players WHERE phone = from_phone FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'El usuario origen no tiene perfil.');
  END IF;

  IF from_balance < amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Dinero insuficiente.');
  END IF;

  SELECT money INTO to_balance FROM players WHERE phone = to_phone FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'El usuario destino no tiene perfil.');
  END IF;

  UPDATE players SET money = money - amount, last_active_at = NOW() WHERE phone = from_phone;
  UPDATE players SET money = money + amount, last_active_at = NOW() WHERE phone = to_phone;

  RETURN jsonb_build_object('success', true);
END;
$$;
