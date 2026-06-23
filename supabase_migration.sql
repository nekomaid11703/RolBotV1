-- Migración inicial para Supabase: RolBotV1

-- 1. Tabla de Jugadores (Players)
CREATE TABLE IF NOT EXISTS public.players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text UNIQUE NOT NULL,
  username text NOT NULL,
  money bigint DEFAULT 0,
  activity_messages int DEFAULT 0,
  activity_commands int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  last_active_at timestamp with time zone DEFAULT now()
);

-- 2. Tabla de Grupos (Groups)
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_jid text UNIQUE NOT NULL,
  group_name text,
  total_messages int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Tabla de Miembros de Grupos (Group Members)
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  player_phone text REFERENCES public.players(phone) ON DELETE CASCADE,
  messages_count int DEFAULT 0,
  last_active_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (group_id, player_phone)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Políticas base: permitir todo al rol de servicio (service_role) y anon si está configurado para el bot
CREATE POLICY "Bot Full Access Players" ON public.players FOR ALL USING (true);
CREATE POLICY "Bot Full Access Groups" ON public.groups FOR ALL USING (true);
CREATE POLICY "Bot Full Access Group Members" ON public.group_members FOR ALL USING (true);
