-- RolBotV1 Supabase schema
-- Backend-only architecture: the bot must use SUPABASE_KEY with service_role.
-- Do not expose this key in clients or public repositories.

-- Required extension for gen_random_uuid().
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. WhatsApp/Baileys auth state.
-- Used by src/core/supabaseAuthState.js.
CREATE TABLE IF NOT EXISTS public.bot_auth_state (
  session_id text NOT NULL,
  id text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (session_id, id)
);

-- 2. Players.
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

-- 3. Groups.
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_jid text UNIQUE NOT NULL,
  group_name text,
  total_messages int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Group members.
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  player_phone text REFERENCES public.players(phone) ON DELETE CASCADE,
  messages_count int DEFAULT 0,
  last_active_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (group_id, player_phone)
);

-- 5. Characters.
CREATE TABLE IF NOT EXISTS public.characters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_phone text REFERENCES public.players(phone) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  category text DEFAULT 'F',
  stats jsonb DEFAULT '{"vida":100,"dinero":0,"exp":0,"fuerza":0,"defensa":0,"agilidad":0,"inteligencia":0,"suerte":0}'::jsonb,
  slots jsonb DEFAULT '{"descripcion":"","historia":"","habilidad_1":"","habilidad_2":""}'::jsonb,
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(player_phone, slug)
);

-- Enable RLS on every bot table.
ALTER TABLE public.bot_auth_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Remove legacy permissive policies if this migration is applied to an older database.
DROP POLICY IF EXISTS "Bot Full Access Players" ON public.players;
DROP POLICY IF EXISTS "Bot Full Access Groups" ON public.groups;
DROP POLICY IF EXISTS "Bot Full Access Group Members" ON public.group_members;
DROP POLICY IF EXISTS "Bot Full Access Characters" ON public.characters;

-- Service-role-only policies.
-- The bot is a backend process, so anon/authenticated roles should not access
-- these tables directly. service_role also bypasses RLS in Supabase, but these
-- policies document and preserve the intended access model.
CREATE POLICY "bot_service_role_auth_state" ON public.bot_auth_state
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "bot_service_role_players" ON public.players
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "bot_service_role_groups" ON public.groups
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "bot_service_role_group_members" ON public.group_members
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "bot_service_role_characters" ON public.characters
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Explicit privileges.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.bot_auth_state TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.players TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.groups TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.group_members TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.characters TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Revoke broad public table access from previous permissive versions.
REVOKE ALL PRIVILEGES ON TABLE public.bot_auth_state FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.players FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.groups FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.group_members FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.characters FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

